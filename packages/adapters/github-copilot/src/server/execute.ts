import type {
  AdapterExecutionContext,
  AdapterExecutionResult,
} from "@paperclipai/adapter-utils";
import {
  asString,
  asNumber,
  parseObject,
  buildPaperclipEnv,
  redactEnvForLogs,
  renderTemplate,
} from "@paperclipai/adapter-utils/server-utils";
import { parseGitHubCopilotResponse } from "./parse.js";

const DEFAULT_API_BASE_URL = "https://api.githubcopilot.com";

export async function execute(
  ctx: AdapterExecutionContext,
): Promise<AdapterExecutionResult> {
  const { runId, agent, runtime, config, context, onLog, onMeta, authToken } = ctx;

  const promptTemplate = asString(
    config.promptTemplate,
    "You are agent {{agent.id}} ({{agent.name}}). Continue your Paperclip work.",
  );
  const model = asString(config.model, "gpt-4o");
  const apiBaseUrl = asString(config.apiBaseUrl, DEFAULT_API_BASE_URL);
  const maxTokens = asNumber(config.maxTokens, 4096);
  const temperature = asNumber(config.temperature, 0.7);
  const timeoutSec = asNumber(config.timeoutSec, 300);

  const envConfig = parseObject(config.env);
  const apiKey =
    asString(config.apiKey, "") ||
    asString(envConfig.GITHUB_TOKEN, "") ||
    (typeof process !== "undefined" ? process.env.GITHUB_TOKEN ?? "" : "");

  if (!apiKey) {
    return {
      exitCode: 1,
      signal: null,
      timedOut: false,
      errorMessage:
        "GitHub token is required. Set it via adapterConfig.apiKey or GITHUB_TOKEN environment variable.",
    };
  }

  const cwd = asString(config.cwd, process.cwd());

  // Build environment
  const env: Record<string, string> = { ...buildPaperclipEnv(agent) };
  env.PAPERCLIP_RUN_ID = runId;
  for (const [key, value] of Object.entries(envConfig)) {
    if (typeof value === "string") env[key] = value;
  }
  if (authToken) {
    env.PAPERCLIP_API_KEY = authToken;
  }

  // Render prompt
  const templateData = {
    agentId: agent.id,
    companyId: agent.companyId,
    runId,
    company: { id: agent.companyId },
    agent,
    run: { id: runId, source: "on_demand" },
    context,
  };
  const renderedPrompt = renderTemplate(promptTemplate, templateData);

  if (onMeta) {
    await onMeta({
      adapterType: "github_copilot",
      command: `POST ${apiBaseUrl}/chat/completions`,
      cwd,
      commandNotes: [`Model: ${model}`, `Max tokens: ${maxTokens}`],
      env: redactEnvForLogs(env),
      prompt: renderedPrompt,
      promptMetrics: { promptChars: renderedPrompt.length },
      context,
    });
  }

  // Build session messages
  const messages: Array<{ role: string; content: string }> = [];

  const runtimeSessionParams = parseObject(runtime.sessionParams);
  const previousMessages = runtimeSessionParams.messages;
  if (Array.isArray(previousMessages)) {
    for (const msg of previousMessages) {
      if (
        typeof msg === "object" &&
        msg !== null &&
        typeof (msg as Record<string, unknown>).role === "string" &&
        typeof (msg as Record<string, unknown>).content === "string"
      ) {
        messages.push(msg as { role: string; content: string });
      }
    }
  }

  messages.push({ role: "user", content: renderedPrompt });

  const requestBody = {
    model,
    messages,
    max_tokens: maxTokens,
    temperature,
    stream: false,
  };

  const url = `${apiBaseUrl.replace(/\/+$/, "")}/chat/completions`;

  await onLog("stdout", JSON.stringify({ type: "request", model, url }) + "\n");

  const controller = new AbortController();
  const timeoutId = timeoutSec > 0
    ? setTimeout(() => controller.abort(), timeoutSec * 1000)
    : null;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "Copilot-Integration-Id": "paperclip",
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal,
    });

    if (timeoutId) clearTimeout(timeoutId);

    const responseText = await response.text();
    await onLog("stdout", responseText + "\n");

    if (!response.ok) {
      return {
        exitCode: 1,
        signal: null,
        timedOut: false,
        errorMessage: `GitHub Copilot API returned HTTP ${response.status}: ${responseText.slice(0, 500)}`,
        resultJson: { statusCode: response.status, body: responseText },
      };
    }

    const parsed = parseGitHubCopilotResponse(responseText);

    const sessionMessages = [
      ...messages,
      ...(parsed.assistantMessage
        ? [{ role: "assistant" as const, content: parsed.assistantMessage }]
        : []),
    ];

    return {
      exitCode: 0,
      signal: null,
      timedOut: false,
      usage: parsed.usage,
      provider: "github",
      model,
      costUsd: parsed.costUsd,
      resultJson: { stdout: responseText },
      summary: parsed.assistantMessage,
      sessionParams: { messages: sessionMessages },
      sessionDisplayId: runId,
    };
  } catch (err) {
    if (timeoutId) clearTimeout(timeoutId);

    if (err instanceof Error && err.name === "AbortError") {
      return {
        exitCode: null,
        signal: "SIGTERM",
        timedOut: true,
        errorMessage: `Request timed out after ${timeoutSec}s`,
      };
    }

    return {
      exitCode: 1,
      signal: null,
      timedOut: false,
      errorMessage: err instanceof Error ? err.message : String(err),
    };
  }
}

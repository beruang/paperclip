import { asNumber, asString, parseJson } from "@paperclipai/adapter-utils/server-utils";
import type { UsageSummary } from "@paperclipai/adapter-utils";

interface ParsedGitHubCopilotResponse {
  assistantMessage: string | null;
  usage: UsageSummary;
  costUsd: number;
  requestId: string | null;
}

export function parseGitHubCopilotResponse(
  responseText: string,
): ParsedGitHubCopilotResponse {
  const result: ParsedGitHubCopilotResponse = {
    assistantMessage: null,
    usage: { inputTokens: 0, outputTokens: 0, cachedInputTokens: 0 },
    costUsd: 0,
    requestId: null,
  };

  const json = parseJson(responseText);
  if (!json) return result;

  result.requestId = asString(json.id, null);

  const choices = json.choices;
  if (Array.isArray(choices) && choices.length > 0) {
    const firstChoice = choices[0] as Record<string, unknown> | undefined;
    if (firstChoice && typeof firstChoice === "object") {
      const message = firstChoice.message as Record<string, unknown> | undefined;
      if (message && typeof message === "object") {
        result.assistantMessage = asString(message.content, null);
      }
    }
  }

  const usage = json.usage as Record<string, unknown> | undefined;
  if (usage && typeof usage === "object") {
    result.usage.inputTokens = asNumber(usage.prompt_tokens ?? usage.input_tokens, 0);
    result.usage.outputTokens = asNumber(usage.completion_tokens ?? usage.output_tokens, 0);
    result.usage.cachedInputTokens = asNumber(usage.cached_tokens, 0);
  }

  return result;
}

export function isGitHubCopilotUnknownSessionError(
  stdout: string,
  stderr: string,
): boolean {
  const haystack = `${stdout}\n${stderr}`;
  return /session\s+not\s+found|unknown\s+session|invalid\s+session/i.test(
    haystack,
  );
}

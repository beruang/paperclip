import type { TranscriptEntry } from "@paperclipai/adapter-utils";

function safeJsonParse(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (typeof value !== "object" || value === null || Array.isArray(value))
    return null;
  return value as Record<string, unknown>;
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

export function parseGitHubCopilotStdoutLine(
  line: string,
  ts: string,
): TranscriptEntry[] {
  const parsed = asRecord(safeJsonParse(line));
  if (!parsed) {
    const trimmed = line.trim();
    if (!trimmed) return [];
    return [{ kind: "stdout", ts, text: trimmed }];
  }

  const type = asString(parsed.type);

  if (type === "request") {
    const model = asString(parsed.model, "github-copilot");
    return [{ kind: "init", ts, model, sessionId: "" }];
  }

  const choices = parsed.choices;
  if (Array.isArray(choices) && choices.length > 0) {
    const entries: TranscriptEntry[] = [];
    const firstChoice = choices[0] as Record<string, unknown> | undefined;
    if (firstChoice && typeof firstChoice === "object") {
      const message = asRecord(firstChoice.message);
      if (message) {
        const content = asString(message.content);
        if (content) {
          entries.push({ kind: "assistant", ts, text: content });
        }
      }
    }

    const usage = asRecord(parsed.usage);
    if (usage) {
      const inputTokens = (usage.prompt_tokens ?? usage.input_tokens ?? 0) as number;
      const outputTokens = (usage.completion_tokens ?? usage.output_tokens ?? 0) as number;
      entries.push({
        kind: "result",
        ts,
        text: "GitHub Copilot response complete",
        inputTokens,
        outputTokens,
        cachedTokens: 0,
        costUsd: 0,
        subtype: "end",
        isError: false,
        errors: [],
      });
    }

    if (entries.length > 0) return entries;
  }

  if (parsed.error) {
    const errorObj = asRecord(parsed.error);
    const message = errorObj
      ? asString(errorObj.message, "GitHub Copilot API error")
      : "GitHub Copilot API error";
    return [
      {
        kind: "result",
        ts,
        text: message,
        inputTokens: 0,
        outputTokens: 0,
        cachedTokens: 0,
        costUsd: 0,
        subtype: "error",
        isError: true,
        errors: [message],
      },
    ];
  }

  return [{ kind: "stdout", ts, text: line }];
}

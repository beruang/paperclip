import pc from "picocolors";

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

export function printGitHubCopilotStreamEvent(
  raw: string,
  _debug: boolean,
): void {
  const line = raw.trim();
  if (!line) return;

  const parsed = asRecord(safeJsonParse(line));
  if (!parsed) {
    console.log(line);
    return;
  }

  const type = asString(parsed.type);

  if (type === "request") {
    const model = asString(parsed.model, "github-copilot");
    console.log(pc.blue(`GitHub Copilot request → ${model}`));
    return;
  }

  const choices = parsed.choices;
  if (Array.isArray(choices) && choices.length > 0) {
    const firstChoice = choices[0] as Record<string, unknown> | undefined;
    if (firstChoice && typeof firstChoice === "object") {
      const message = asRecord(firstChoice.message);
      if (message) {
        const content = asString(message.content);
        if (content) {
          console.log(pc.green(`assistant: ${content}`));
        }
      }
    }

    const usage = asRecord(parsed.usage);
    if (usage) {
      const promptTokens = usage.prompt_tokens ?? usage.input_tokens ?? 0;
      const completionTokens =
        usage.completion_tokens ?? usage.output_tokens ?? 0;
      console.log(
        pc.blue(`tokens: ${promptTokens} in / ${completionTokens} out`),
      );
    }
    return;
  }

  if (parsed.error) {
    const errorObj = asRecord(parsed.error);
    const message = errorObj
      ? asString(errorObj.message, "GitHub Copilot API error")
      : "GitHub Copilot API error";
    console.log(pc.red(`error: ${message}`));
    return;
  }

  console.log(line);
}

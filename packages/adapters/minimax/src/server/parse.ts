export interface MinimaxParsedResponse {
  assistantMessage: string | undefined;
  usage:
    | {
        inputTokens?: number;
        outputTokens?: number;
        totalTokens?: number;
      }
    | undefined;
  costUsd: number | undefined;
}

export function parseMinimaxResponse(raw: string): MinimaxParsedResponse {
  try {
    const json = JSON.parse(raw);
    const choice = json.choices?.[0];
    const assistantMessage: string | undefined =
      choice?.message?.content ?? undefined;

    let usage: MinimaxParsedResponse["usage"];
    if (json.usage) {
      usage = {
        inputTokens: json.usage.prompt_tokens ?? json.usage.input_tokens,
        outputTokens:
          json.usage.completion_tokens ?? json.usage.output_tokens,
        totalTokens: json.usage.total_tokens,
      };
    }

    return { assistantMessage, usage, costUsd: undefined };
  } catch {
    return { assistantMessage: raw.slice(0, 500), usage: undefined, costUsd: undefined };
  }
}

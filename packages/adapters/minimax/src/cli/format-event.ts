import type { CLIStreamEvent } from "@paperclipai/adapter-utils";

export function printMinimaxStreamEvent(
  line: string,
): CLIStreamEvent | null {
  const trimmed = line.trim();
  if (!trimmed) return null;

  try {
    const json = JSON.parse(trimmed);
    if (json.type === "request") {
      return { type: "status", text: `→ Calling MiniMax ${json.model}…` };
    }
    const content = json.choices?.[0]?.message?.content;
    if (typeof content === "string" && content.length > 0) {
      return { type: "text", text: content };
    }
    return null;
  } catch {
    if (trimmed.length > 0) {
      return { type: "text", text: trimmed };
    }
    return null;
  }
}

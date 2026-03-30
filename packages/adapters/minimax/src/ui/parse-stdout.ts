import type { AdapterUIStreamEvent } from "@paperclipai/adapter-utils";

export function parseStdoutLine(line: string): AdapterUIStreamEvent | null {
  const trimmed = line.trim();
  if (!trimmed) return null;

  try {
    const json = JSON.parse(trimmed);
    if (json.type === "request") {
      return { type: "status", message: `Calling ${json.model} …` };
    }
    // Full API response
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

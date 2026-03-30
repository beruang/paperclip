import type { UIAdapterModule } from "../types";
import { parseStdoutLine } from "@paperclipai/adapter-minimax/ui";
import { MinimaxConfigFields } from "./config-fields";
import { buildMinimaxConfig } from "@paperclipai/adapter-minimax/ui";

function parseMinimaxStdoutLine(line: string, ts: string) {
  const event = parseStdoutLine(line);
  if (!event) return [];
  if (event.type === "status") {
    return [{ kind: "system" as const, ts, text: event.message }];
  }
  return [{ kind: "assistant" as const, ts, text: event.text }];
}

export const minimaxUIAdapter: UIAdapterModule = {
  type: "minimax",
  label: "MiniMax",
  parseStdoutLine: parseMinimaxStdoutLine,
  ConfigFields: MinimaxConfigFields,
  buildAdapterConfig: buildMinimaxConfig,
};

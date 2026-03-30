import type { CreateConfigValues } from "@paperclipai/shared";

export function buildDefaultConfig(): Partial<CreateConfigValues> {
  return {
    adapterType: "minimax",
    model: "MiniMax-Text-01",
    systemPrompt: "",
  };
}

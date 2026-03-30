import type { CreateConfigValues } from "@paperclipai/adapter-utils";

export function buildBytesPlusConfig(v: CreateConfigValues): Record<string, unknown> {
  const ac: Record<string, unknown> = {};
  if (v.cwd) ac.cwd = v.cwd;
  if (v.promptTemplate) ac.promptTemplate = v.promptTemplate;
  if (v.model) ac.model = v.model;
  if ((v as Record<string, unknown>).apiKey) ac.apiKey = (v as Record<string, unknown>).apiKey;
  ac.timeoutSec = 300;
  return ac;
}

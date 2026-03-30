import type { AdapterSessionCodec } from "@paperclipai/adapter-utils";

function readNonEmptyString(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : null;
}

export const sessionCodec: AdapterSessionCodec = {
  deserialize(raw: unknown) {
    if (typeof raw !== "object" || raw === null || Array.isArray(raw))
      return null;
    const record = raw as Record<string, unknown>;
    if (!Array.isArray(record.messages)) return null;
    return { messages: record.messages };
  },
  serialize(params: Record<string, unknown> | null) {
    if (!params || !Array.isArray(params.messages)) return null;
    return { messages: params.messages };
  },
  getDisplayId(params: Record<string, unknown> | null) {
    if (!params) return null;
    return readNonEmptyString(params.displayId);
  },
};

export { execute } from "./execute.js";
export { testEnvironment } from "./test.js";
export { parseGlmResponse, isGlmUnknownSessionError } from "./parse.js";

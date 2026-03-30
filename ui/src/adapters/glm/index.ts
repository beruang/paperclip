import type { UIAdapterModule } from "../types";
import { parseGlmStdoutLine } from "@paperclipai/adapter-glm/ui";
import { GlmConfigFields } from "./config-fields";
import { buildGlmConfig } from "@paperclipai/adapter-glm/ui";

export const glmUIAdapter: UIAdapterModule = {
  type: "glm",
  label: "GLM (Zhipu AI)",
  parseStdoutLine: parseGlmStdoutLine,
  ConfigFields: GlmConfigFields,
  buildAdapterConfig: buildGlmConfig,
};

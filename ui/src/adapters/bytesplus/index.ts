import type { UIAdapterModule } from "../types";
import { parseBytesPlusStdoutLine } from "@paperclipai/adapter-bytesplus/ui";
import { BytesPlusConfigFields } from "./config-fields";
import { buildBytesPlusConfig } from "@paperclipai/adapter-bytesplus/ui";

export const bytesPlusUIAdapter: UIAdapterModule = {
  type: "bytesplus",
  label: "BytesPlus (ByteDance)",
  parseStdoutLine: parseBytesPlusStdoutLine,
  ConfigFields: BytesPlusConfigFields,
  buildAdapterConfig: buildBytesPlusConfig,
};

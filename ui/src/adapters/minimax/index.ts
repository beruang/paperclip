import type { UIAdapterRegistration } from "../types.js";
import { MinimaxConfigFields } from "./config-fields.js";

export const minimaxUIAdapter: UIAdapterRegistration = {
  type: "minimax",
  label: "MiniMax",
  ConfigFields: MinimaxConfigFields,
};

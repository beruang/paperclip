import type { UIAdapterModule } from "../types";
import { parseGitHubCopilotStdoutLine } from "@paperclipai/adapter-github-copilot/ui";
import { GitHubCopilotConfigFields } from "./config-fields";
import { buildGitHubCopilotConfig } from "@paperclipai/adapter-github-copilot/ui";

export const gitHubCopilotUIAdapter: UIAdapterModule = {
  type: "github_copilot",
  label: "GitHub Copilot",
  parseStdoutLine: parseGitHubCopilotStdoutLine,
  ConfigFields: GitHubCopilotConfigFields,
  buildAdapterConfig: buildGitHubCopilotConfig,
};

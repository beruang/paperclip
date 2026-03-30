export const type = "github_copilot";
export const label = "GitHub Copilot";

export const models: Array<{ id: string; label: string }> = [
  { id: "gpt-4o", label: "GPT-4o" },
  { id: "gpt-4o-mini", label: "GPT-4o Mini" },
  { id: "gpt-4.1", label: "GPT-4.1" },
  { id: "gpt-4.1-mini", label: "GPT-4.1 Mini" },
  { id: "gpt-4.1-nano", label: "GPT-4.1 Nano" },
  { id: "claude-3.5-sonnet", label: "Claude 3.5 Sonnet" },
  { id: "claude-3.7-sonnet", label: "Claude 3.7 Sonnet" },
  { id: "o3-mini", label: "o3-mini" },
  { id: "o4-mini", label: "o4-mini" },
  { id: "gemini-2.0-flash", label: "Gemini 2.0 Flash" },
];

export const agentConfigurationDoc = `# github_copilot agent configuration

Adapter: github_copilot

Use when:
- You want Paperclip to use the GitHub Copilot API (Models API) as the agent runtime
- You have a GitHub Copilot subscription with API access
- You want access to multiple model providers (OpenAI, Anthropic, Google) through a single GitHub API

Don't use when:
- You need local CLI execution with tool use (use claude_local or codex_local)
- You need webhook-style invocation (use http adapter)
- You only need one-shot shell commands (use process adapter)
- You don't have a GitHub Copilot subscription

Core fields:
- apiKey (string, required): GitHub personal access token with copilot scope (alternatively set via GITHUB_TOKEN env var)
- model (string, required): model ID (e.g. gpt-4o, claude-3.5-sonnet, o3-mini)
- cwd (string, optional): working directory context for the agent
- promptTemplate (string, optional): user prompt template
- maxTokens (number, optional): maximum tokens in the response
- temperature (number, optional): sampling temperature (0.0-1.0)

Operational fields:
- timeoutSec (number, optional): request timeout in seconds (default: 300)

Notes:
- Uses the GitHub Copilot Models API (https://api.github.com/copilot).
- Requires a GitHub personal access token with copilot scope.
- Supports multiple backend models through GitHub's unified API.
- The adapter sends the prompt as a user message and returns the assistant response.
`;

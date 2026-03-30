export const type = "github_copilot";
export const label = "GitHub Copilot";

export const models: Array<{ id: string; label: string }> = [
  { id: "gpt-4.1", label: "GPT-4.1" },
  { id: "gpt-5-mini", label: "GPT-5 Mini" },
  { id: "gpt-5.2", label: "GPT-5.2" },
  { id: "gpt-5.2-codex", label: "GPT-5.2-Codex" },
  { id: "gpt-5.3-codex", label: "GPT-5.3-Codex" },
  { id: "gpt-5.4", label: "GPT-5.4" },
  { id: "gpt-5.4-mini", label: "GPT-5.4 Mini" },
  { id: "claude-haiku-4.5", label: "Claude Haiku 4.5" },
  { id: "claude-opus-4.5", label: "Claude Opus 4.5" },
  { id: "claude-opus-4.6", label: "Claude Opus 4.6" },
  { id: "claude-sonnet-4", label: "Claude Sonnet 4" },
  { id: "claude-sonnet-4.5", label: "Claude Sonnet 4.5" },
  { id: "claude-sonnet-4.6", label: "Claude Sonnet 4.6" },
  { id: "gemini-2.5-pro", label: "Gemini 2.5 Pro" },
  { id: "gemini-3-flash", label: "Gemini 3 Flash" },
  { id: "gemini-3.1-pro", label: "Gemini 3.1 Pro" },
  { id: "grok-code-fast-1", label: "Grok Code Fast 1" },
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

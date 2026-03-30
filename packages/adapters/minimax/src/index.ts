export const type = "minimax";
export const label = "MiniMax";

export const models: Array<{ id: string; label: string }> = [
  { id: "MiniMax-Text-01", label: "MiniMax-Text-01" },
  { id: "abab6.5s-chat", label: "abab6.5s Chat" },
  { id: "abab6.5-chat", label: "abab6.5 Chat" },
  { id: "abab5.5-chat", label: "abab5.5 Chat" },
];

export const agentConfigurationDoc = `# minimax agent configuration

Adapter: minimax

Use when:
- You want Paperclip to use MiniMax AI models via their API
- You need access to MiniMax's language models (MiniMax-Text-01, abab series)
- You want to leverage MiniMax's AI capabilities for coding tasks

Don't use when:
- You need local CLI execution (use claude_local, codex_local, or pi_local)
- You need webhook-style invocation (use http adapter)
- You only need one-shot shell commands (use process adapter)

Core fields:
- apiKey (string, required): MiniMax API key (alternatively set via MINIMAX_API_KEY env var)
- apiBaseUrl (string, optional): API base URL, defaults to https://api.minimax.chat/v1
- model (string, required): MiniMax model ID (e.g. MiniMax-Text-01, abab6.5s-chat)
- cwd (string, optional): working directory context for the agent
- promptTemplate (string, optional): user prompt template
- maxTokens (number, optional): maximum tokens in the response
- temperature (number, optional): sampling temperature (0.0-1.0)

Operational fields:
- timeoutSec (number, optional): request timeout in seconds (default: 300)

Notes:
- MiniMax API is OpenAI-compatible for chat completions.
- API key can be provided via config or MINIMAX_API_KEY environment variable.
- The adapter sends the prompt as a user message and returns the assistant response.
`;

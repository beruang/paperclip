export const type = "bytesplus";
export const label = "BytesPlus (ByteDance)";

export const models: Array<{ id: string; label: string }> = [
  { id: "doubao-pro-256k", label: "Doubao Pro 256K" },
  { id: "doubao-pro-128k", label: "Doubao Pro 128K" },
  { id: "doubao-pro-32k", label: "Doubao Pro 32K" },
  { id: "doubao-pro-4k", label: "Doubao Pro 4K" },
  { id: "doubao-lite-128k", label: "Doubao Lite 128K" },
  { id: "doubao-lite-32k", label: "Doubao Lite 32K" },
  { id: "doubao-lite-4k", label: "Doubao Lite 4K" },
];

export const agentConfigurationDoc = `# bytesplus agent configuration

Adapter: bytesplus

Use when:
- You want Paperclip to use ByteDance's Doubao models via the BytesPlus (Volcengine) API
- You need access to Doubao series models for coding tasks
- You want to leverage ByteDance's AI infrastructure

Don't use when:
- You need local CLI execution (use claude_local, codex_local, or pi_local)
- You need webhook-style invocation (use http adapter)
- You only need one-shot shell commands (use process adapter)

Core fields:
- apiKey (string, required): BytesPlus API key (alternatively set via BYTESPLUS_API_KEY env var)
- apiBaseUrl (string, optional): API base URL, defaults to https://ark.cn-beijing.volces.com/api/v3
- model (string, required): endpoint ID or model name for the Doubao model
- cwd (string, optional): working directory context for the agent
- promptTemplate (string, optional): user prompt template
- maxTokens (number, optional): maximum tokens in the response
- temperature (number, optional): sampling temperature (0.0-1.0)

Operational fields:
- timeoutSec (number, optional): request timeout in seconds (default: 300)

Notes:
- BytesPlus (Volcengine/Ark) API is OpenAI-compatible.
- API key can be provided via config or BYTESPLUS_API_KEY environment variable.
- The model field should contain the endpoint ID from the Volcengine Ark console.
`;

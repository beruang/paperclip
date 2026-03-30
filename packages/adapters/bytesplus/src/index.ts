export const type = "bytesplus";
export const label = "BytesPlus (ByteDance)";

export const models: Array<{ id: string; label: string }> = [
  { id: "dola-seed-2.0-pro", label: "Dola Seed 2.0 Pro" },
  { id: "dola-seed-2.0-lite", label: "Dola Seed 2.0 Lite" },
  { id: "bytedance-seed-code", label: "ByteDance Seed Code" },
  { id: "glm-4.7", label: "GLM-4.7" },
  { id: "kimi-k2.5", label: "Kimi K2.5" },
  { id: "gpt-oss-120b", label: "GPT-OSS 120B" },
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

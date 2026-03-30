export const type = "glm";
export const label = "GLM (Zhipu AI)";

export const models: Array<{ id: string; label: string }> = [
  { id: "glm-5.1", label: "GLM-5.1" },
  { id: "glm-5-turbo", label: "GLM-5-Turbo" },
  { id: "glm-4.7", label: "GLM-4.7" },
  { id: "glm-4.6", label: "GLM-4.6" },
  { id: "glm-4.5-air", label: "GLM-4.5-Air" },
];

export const agentConfigurationDoc = `# glm agent configuration

Adapter: glm

Use when:
- You want Paperclip to use Zhipu AI's GLM models via their OpenAI-compatible API
- You need a Chinese-language-optimized LLM agent
- You want to leverage GLM-4 series models for coding tasks

Don't use when:
- You need local CLI execution (use claude_local, codex_local, or pi_local)
- You need webhook-style invocation (use http adapter)
- You only need one-shot shell commands (use process adapter)

Core fields:
- apiKey (string, required): Zhipu AI API key (alternatively set via GLM_API_KEY env var)
- apiBaseUrl (string, optional): API base URL, defaults to https://open.bigmodel.cn/api/paas/v4
- model (string, required): GLM model ID (e.g. glm-4-plus, glm-4-flash)
- cwd (string, optional): working directory context for the agent
- promptTemplate (string, optional): user prompt template
- maxTokens (number, optional): maximum tokens in the response
- temperature (number, optional): sampling temperature (0.0-1.0)

Operational fields:
- timeoutSec (number, optional): request timeout in seconds (default: 300)

Notes:
- GLM API is OpenAI-compatible and supports streaming responses.
- API key can be provided via config or GLM_API_KEY environment variable.
- The adapter sends the prompt as a user message and returns the assistant response.
`;

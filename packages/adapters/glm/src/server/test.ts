import type {
  AdapterEnvironmentCheck,
  AdapterEnvironmentTestContext,
  AdapterEnvironmentTestResult,
} from "@paperclipai/adapter-utils";
import { asString, parseObject } from "@paperclipai/adapter-utils/server-utils";

function summarizeStatus(
  checks: AdapterEnvironmentCheck[],
): AdapterEnvironmentTestResult["status"] {
  if (checks.some((c) => c.level === "error")) return "fail";
  if (checks.some((c) => c.level === "warn")) return "warn";
  return "pass";
}

const DEFAULT_API_BASE_URL = "https://open.bigmodel.cn/api/paas/v4";

export async function testEnvironment(
  ctx: AdapterEnvironmentTestContext,
): Promise<AdapterEnvironmentTestResult> {
  const checks: AdapterEnvironmentCheck[] = [];
  const config = parseObject(ctx.config);

  const apiKey =
    asString(config.apiKey, "") ||
    asString(parseObject(config.env).GLM_API_KEY, "") ||
    (typeof process !== "undefined" ? process.env.GLM_API_KEY ?? "" : "");

  if (!apiKey) {
    checks.push({
      code: "glm_api_key_missing",
      level: "error",
      message: "GLM API key is not configured.",
      hint: "Set adapterConfig.apiKey or set GLM_API_KEY environment variable.",
    });
  } else {
    checks.push({
      code: "glm_api_key_present",
      level: "info",
      message: "GLM API key is configured.",
    });
  }

  const model = asString(config.model, "").trim();
  if (!model) {
    checks.push({
      code: "glm_model_required",
      level: "error",
      message: "No model configured.",
      hint: 'Set adapterConfig.model (e.g. "glm-4-plus").',
    });
  } else {
    checks.push({
      code: "glm_model_configured",
      level: "info",
      message: `Configured model: ${model}`,
    });
  }

  const apiBaseUrl = asString(config.apiBaseUrl, DEFAULT_API_BASE_URL);
  checks.push({
    code: "glm_api_url",
    level: "info",
    message: `API base URL: ${apiBaseUrl}`,
  });

  // Probe the API with a minimal request if key and model are present
  if (apiKey && model) {
    try {
      const url = `${apiBaseUrl.replace(/\/+$/, "")}/chat/completions`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30_000);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [{ role: "user", content: "Respond with hello." }],
          max_tokens: 16,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        checks.push({
          code: "glm_probe_passed",
          level: "info",
          message: "GLM API probe succeeded.",
        });
      } else {
        const body = await response.text().catch(() => "");
        checks.push({
          code: "glm_probe_failed",
          level: "warn",
          message: `GLM API returned HTTP ${response.status}.`,
          detail: body.slice(0, 240),
          hint: "Verify API key and model are correct.",
        });
      }
    } catch (err) {
      checks.push({
        code: "glm_probe_failed",
        level: "warn",
        message: "GLM API probe failed.",
        detail: err instanceof Error ? err.message : String(err),
        hint: "Verify network connectivity and API base URL.",
      });
    }
  }

  return {
    adapterType: ctx.adapterType,
    status: summarizeStatus(checks),
    checks,
    testedAt: new Date().toISOString(),
  };
}

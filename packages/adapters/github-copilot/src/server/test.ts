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

const DEFAULT_API_BASE_URL = "https://api.githubcopilot.com";

export async function testEnvironment(
  ctx: AdapterEnvironmentTestContext,
): Promise<AdapterEnvironmentTestResult> {
  const checks: AdapterEnvironmentCheck[] = [];
  const config = parseObject(ctx.config);

  const apiKey =
    asString(config.apiKey, "") ||
    asString(parseObject(config.env).GITHUB_TOKEN, "") ||
    (typeof process !== "undefined" ? process.env.GITHUB_TOKEN ?? "" : "");

  if (!apiKey) {
    checks.push({
      code: "github_copilot_token_missing",
      level: "error",
      message: "GitHub token is not configured.",
      hint: "Set adapterConfig.apiKey or set GITHUB_TOKEN environment variable.",
    });
  } else {
    checks.push({
      code: "github_copilot_token_present",
      level: "info",
      message: "GitHub token is configured.",
    });
  }

  const model = asString(config.model, "").trim();
  if (!model) {
    checks.push({
      code: "github_copilot_model_required",
      level: "error",
      message: "No model configured.",
      hint: 'Set adapterConfig.model (e.g. "gpt-4o", "claude-3.5-sonnet").',
    });
  } else {
    checks.push({
      code: "github_copilot_model_configured",
      level: "info",
      message: `Configured model: ${model}`,
    });
  }

  const apiBaseUrl = asString(config.apiBaseUrl, DEFAULT_API_BASE_URL);
  checks.push({
    code: "github_copilot_api_url",
    level: "info",
    message: `API base URL: ${apiBaseUrl}`,
  });

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
          "Copilot-Integration-Id": "paperclip",
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
          code: "github_copilot_probe_passed",
          level: "info",
          message: "GitHub Copilot API probe succeeded.",
        });
      } else {
        const body = await response.text().catch(() => "");
        checks.push({
          code: "github_copilot_probe_failed",
          level: "warn",
          message: `GitHub Copilot API returned HTTP ${response.status}.`,
          detail: body.slice(0, 240),
          hint: "Verify GitHub token has copilot scope and model is available.",
        });
      }
    } catch (err) {
      checks.push({
        code: "github_copilot_probe_failed",
        level: "warn",
        message: "GitHub Copilot API probe failed.",
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

import { generateText } from "ai";

import { makeApiError } from "@/lib/api-error";
import { logger } from "@/lib/logger";
import { createServiceClientSync } from "@/lib/supabase/server";
import { getModel } from "./providers";

import type { ApiError } from "@/lib/api-error";
import type { Json } from "@/types/supabase";

interface RunnerInput {
  runId: string;
  agentId: string;
  systemPrompt: string;
  userMessage: string;
  llmProvider: string;
  llmModel: string;
  temperature?: number;
  maxTokens?: number;
}

interface RunnerResult {
  output: string;
  error?: ApiError;
}

async function writeLog(
  runId: string,
  level: "info" | "warn" | "error",
  message: string,
  metadata?: Record<string, unknown>
) {
  try {
    const supabase = createServiceClientSync();
    await supabase.from("run_logs").insert({ run_id: runId, level, message, metadata: (metadata ?? null) as Json | null });
  } catch (error) {
    logger.error({ error, runId }, "Error al escribir run_log");
  }
}

export async function runAgent(input: RunnerInput): Promise<RunnerResult> {
  const { runId, agentId, systemPrompt, userMessage, llmProvider, llmModel, temperature, maxTokens } =
    input;

  const log = logger.child({ runId, agentId });
  const supabase = createServiceClientSync();

  await supabase
    .from("runs")
    .update({ status: "running", started_at: new Date().toISOString() })
    .eq("id", runId);

  await writeLog(runId, "info", `Iniciando agente con modelo ${llmProvider}/${llmModel}`);
  log.info({ llmProvider, llmModel }, "Iniciando run");

  try {
    const model = getModel(llmProvider, llmModel);

    await writeLog(runId, "info", "Llamando al LLM...", { model: llmModel });

    const { text, usage } = await generateText({
      model,
      system: systemPrompt,
      prompt: userMessage,
      temperature: temperature ?? 0.7,
      maxTokens,
      maxRetries: 0,
    });

    await writeLog(runId, "info", "Respuesta recibida del LLM", {
      inputTokens: usage.promptTokens,
      outputTokens: usage.completionTokens,
    });

    log.info({ usage }, "Run completado");

    await supabase
      .from("runs")
      .update({ status: "completed", output: { text }, finished_at: new Date().toISOString() })
      .eq("id", runId);

    return { output: text };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error desconocido";

    log.error({ error }, "Run fallido");
    await writeLog(runId, "error", `Error al ejecutar el agente: ${message}`);

    await supabase
      .from("runs")
      .update({ status: "failed", error_message: message, finished_at: new Date().toISOString() })
      .eq("id", runId);

    return { output: "", error: makeApiError("RUN_FAILED", message) };
  }
}

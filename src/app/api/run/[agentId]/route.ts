import { NextResponse } from "next/server";
import { z } from "zod";

import { makeApiError } from "@/lib/api-error";
import { runAgent } from "@/lib/ai/runner";
import { logger } from "@/lib/logger";
import { createServiceClient } from "@/lib/supabase/server";

import type { Json } from "@/types/supabase";

const RunRequestSchema = z.object({
  message: z.string().min(1).default("Ejecutar agente"),
  context: z.record(z.unknown()).optional(),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ agentId: string }> }
) {
  const { agentId } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const parsed = RunRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      makeApiError("VALIDATION_ERROR", "Payload inválido", parsed.error.flatten()),
      { status: 400 }
    );
  }

  const supabase = await createServiceClient();

  const { data: agent, error: agentError } = await supabase
    .from("agents")
    .select("*")
    .eq("id", agentId)
    .single();

  if (agentError || !agent) {
    return NextResponse.json(makeApiError("AGENT_NOT_FOUND", "Agente no encontrado"), { status: 404 });
  }

  if (!agent.is_active) {
    return NextResponse.json(makeApiError("AGENT_INACTIVE", "El agente está desactivado"), { status: 400 });
  }

  const { data: run, error: runError } = await supabase
    .from("runs")
    .insert({
      agent_id: agentId,
      status: "pending",
      input_context: (parsed.data.context ?? null) as Json | null,
    })
    .select()
    .single();

  if (runError || !run) {
    logger.error({ runError, agentId }, "Error al crear run");
    return NextResponse.json(makeApiError("DB_ERROR", "Error al crear el run"), { status: 500 });
  }

  const llmConfig = agent.llm_config as { temperature?: number; maxTokens?: number } | null;

  // Ejecutar en background — no esperamos a que termine
  void runAgent({
    runId: run.id,
    agentId,
    systemPrompt: agent.system_prompt,
    userMessage: parsed.data.message,
    llmProvider: agent.llm_provider,
    llmModel: agent.llm_model,
    temperature: llmConfig?.temperature,
    maxTokens: llmConfig?.maxTokens,
  });

  return NextResponse.json({ runId: run.id }, { status: 202 });
}

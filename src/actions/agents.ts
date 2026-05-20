"use server";

import { revalidatePath } from "next/cache";

import { makeApiError } from "@/lib/api-error";
import { createServiceClient } from "@/lib/supabase/server";
import { CreateAgentSchema, UpdateAgentSchema } from "@/schemas/agent";

import type { ApiError } from "@/lib/api-error";
import type { Agent } from "@/schemas/agent";

type ActionResult<T> = { data: T; error?: never } | { data?: never; error: ApiError };

export async function getAgents(): Promise<ActionResult<Agent[]>> {
  try {
    const supabase = await createServiceClient();
    const { data, error } = await supabase
      .from("agents")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) return { error: makeApiError("DB_ERROR", error.message) };
    return { data: data as Agent[] };
  } catch {
    return { error: makeApiError("UNKNOWN_ERROR", "Error al obtener agentes") };
  }
}

export async function getAgent(id: string): Promise<ActionResult<Agent>> {
  try {
    const supabase = await createServiceClient();
    const { data, error } = await supabase.from("agents").select("*").eq("id", id).single();

    if (error) {
      if (error.code === "PGRST116") return { error: makeApiError("AGENT_NOT_FOUND", "Agente no encontrado") };
      return { error: makeApiError("DB_ERROR", error.message) };
    }
    return { data: data as Agent };
  } catch {
    return { error: makeApiError("UNKNOWN_ERROR", "Error al obtener el agente") };
  }
}

export async function createAgent(
  rawData: unknown
): Promise<ActionResult<Agent>> {
  const parsed = CreateAgentSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      error: makeApiError("VALIDATION_ERROR", "Datos inválidos", parsed.error.flatten()),
    };
  }

  try {
    const supabase = await createServiceClient();
    const { data, error } = await supabase
      .from("agents")
      .insert({
        ...parsed.data,
        llm_config: parsed.data.llm_config ?? { temperature: 0.7 },
      })
      .select()
      .single();

    if (error) return { error: makeApiError("DB_ERROR", error.message) };
    revalidatePath("/agents");
    return { data: data as Agent };
  } catch {
    return { error: makeApiError("UNKNOWN_ERROR", "Error al crear el agente") };
  }
}

export async function updateAgent(
  id: string,
  rawData: unknown
): Promise<ActionResult<Agent>> {
  const parsed = UpdateAgentSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      error: makeApiError("VALIDATION_ERROR", "Datos inválidos", parsed.error.flatten()),
    };
  }

  try {
    const supabase = await createServiceClient();
    const { data, error } = await supabase
      .from("agents")
      .update({ ...parsed.data, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      if (error.code === "PGRST116") return { error: makeApiError("AGENT_NOT_FOUND", "Agente no encontrado") };
      return { error: makeApiError("DB_ERROR", error.message) };
    }
    revalidatePath("/agents");
    revalidatePath(`/agents/${id}`);
    return { data: data as Agent };
  } catch {
    return { error: makeApiError("UNKNOWN_ERROR", "Error al actualizar el agente") };
  }
}

export async function deleteAgent(id: string): Promise<ActionResult<{ id: string }>> {
  try {
    const supabase = await createServiceClient();
    const { error } = await supabase.from("agents").delete().eq("id", id);

    if (error) return { error: makeApiError("DB_ERROR", error.message) };
    revalidatePath("/agents");
    return { data: { id } };
  } catch {
    return { error: makeApiError("UNKNOWN_ERROR", "Error al eliminar el agente") };
  }
}

export async function toggleAgentActive(
  id: string,
  isActive: boolean
): Promise<ActionResult<Agent>> {
  return updateAgent(id, { is_active: isActive });
}

"use server";

import { makeApiError } from "@/lib/api-error";
import { createServiceClient } from "@/lib/supabase/server";

import type { ApiError } from "@/lib/api-error";
import type { Run, RunLog } from "@/schemas/run";

type ActionResult<T> = { data: T; error?: never } | { data?: never; error: ApiError };

export async function getRun(id: string): Promise<ActionResult<Run>> {
  try {
    const supabase = await createServiceClient();
    const { data, error } = await supabase.from("runs").select("*").eq("id", id).single();

    if (error) {
      if (error.code === "PGRST116") return { error: makeApiError("RUN_NOT_FOUND", "Run no encontrado") };
      return { error: makeApiError("DB_ERROR", error.message) };
    }
    return { data: data as Run };
  } catch {
    return { error: makeApiError("UNKNOWN_ERROR", "Error al obtener el run") };
  }
}

export async function getRunLogs(runId: string): Promise<ActionResult<RunLog[]>> {
  try {
    const supabase = await createServiceClient();
    const { data, error } = await supabase
      .from("run_logs")
      .select("*")
      .eq("run_id", runId)
      .order("created_at", { ascending: true });

    if (error) return { error: makeApiError("DB_ERROR", error.message) };
    return { data: data as RunLog[] };
  } catch {
    return { error: makeApiError("UNKNOWN_ERROR", "Error al obtener los logs") };
  }
}

export async function getAgentRuns(agentId: string): Promise<ActionResult<Run[]>> {
  try {
    const supabase = await createServiceClient();
    const { data, error } = await supabase
      .from("runs")
      .select("*")
      .eq("agent_id", agentId)
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) return { error: makeApiError("DB_ERROR", error.message) };
    return { data: data as Run[] };
  } catch {
    return { error: makeApiError("UNKNOWN_ERROR", "Error al obtener los runs") };
  }
}

import Link from "next/link";

import { createServiceClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";

export default async function RunsPage() {
  const supabase = await createServiceClient();
  const { data: runs } = await supabase
    .from("runs")
    .select("*, agents(name)")
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Runs</h1>
        <p className="mt-1 text-muted-foreground">Historial de ejecuciones de agentes</p>
      </div>

      {!runs || runs.length === 0 ? (
        <p className="text-muted-foreground">Todavía no hay runs. Ejecutá un agente para empezar.</p>
      ) : (
        <div className="space-y-2">
          {runs.map((run) => {
            const agentName = (run as unknown as { agents?: { name: string } | null }).agents?.name;
            return (
              <Link
                key={run.id}
                href={`/runs/${run.id}`}
                className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-accent"
              >
                <div className="space-y-0.5">
                  <p className="font-mono text-sm">{run.id.slice(0, 8)}...</p>
                  <p className="text-xs text-muted-foreground">{agentName ?? run.agent_id}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge
                    variant={
                      run.status === "completed"
                        ? "default"
                        : run.status === "failed"
                          ? "destructive"
                          : "secondary"
                    }
                  >
                    {run.status}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {new Date(run.created_at).toLocaleString("es-AR")}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

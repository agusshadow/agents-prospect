import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Bot } from "lucide-react";

import { getAgent } from "@/actions/agents";
import { getRun, getRunLogs } from "@/actions/runs";
import { RunLogsLive } from "@/components/app/runs/run-logs-live";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import type { RunStatus } from "@/schemas/run";

interface RunPageProps {
  params: Promise<{ id: string }>;
}

export default async function RunPage({ params }: RunPageProps) {
  const { id } = await params;

  const runResult = await getRun(id);

  if (!runResult.data) {
    if (runResult.error?.code === "RUN_NOT_FOUND") notFound();
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
        {runResult.error?.message ?? "Error desconocido"}
      </div>
    );
  }

  const run = runResult.data;

  const [{ data: logs }, { data: agent }] = await Promise.all([
    getRunLogs(id),
    getAgent(run.agent_id),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={agent ? `/agents/${agent.id}` : "/agents"}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="font-mono text-xl font-bold">Run {id.slice(0, 8)}...</h1>
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
          </div>
          {agent && (
            <div className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
              <Bot className="h-3.5 w-3.5" />
              <Link href={`/agents/${agent.id}`} className="hover:underline">
                {agent.name}
              </Link>
              <span>·</span>
              <span>{new Date(run.created_at).toLocaleString("es-AR")}</span>
            </div>
          )}
        </div>
      </div>

      <RunLogsLive
        runId={id}
        initialLogs={logs ?? []}
        initialStatus={run.status as RunStatus}
      />

      {run.output && (
        <div className="space-y-2">
          <h2 className="font-semibold">Output</h2>
          <pre className="whitespace-pre-wrap rounded-lg border bg-muted p-4 text-xs">
            {JSON.stringify(run.output, null, 2)}
          </pre>
        </div>
      )}

      {run.error_message && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          {run.error_message}
        </div>
      )}
    </div>
  );
}

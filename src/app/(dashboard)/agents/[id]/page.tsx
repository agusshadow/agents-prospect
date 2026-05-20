import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, Edit, Layers } from "lucide-react";

import { getAgent } from "@/actions/agents";
import { getAgentRuns } from "@/actions/runs";
import { AgentForm } from "@/components/app/agents/agent-form";
import { RunAgentButton } from "@/components/app/agents/run-agent-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AgentDetailPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ edit?: string }>;
}

export default async function AgentDetailPage({ params, searchParams }: AgentDetailPageProps) {
  const { id } = await params;
  const { edit } = await searchParams;

  const agentResult = await getAgent(id);

  if (!agentResult.data) {
    if (agentResult.error?.code === "AGENT_NOT_FOUND") notFound();
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
        {agentResult.error?.message ?? "Error desconocido"}
      </div>
    );
  }

  const agent = agentResult.data;

  const { data: runs } = await getAgentRuns(id);

  if (edit === "true") {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Editar agente</h1>
          <p className="mt-1 text-muted-foreground">{agent.name}</p>
        </div>
        <AgentForm agent={agent} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">{agent.name}</h1>
            <Badge variant={agent.is_active ? "default" : "secondary"}>
              {agent.is_active ? "Activo" : "Inactivo"}
            </Badge>
          </div>
          {agent.description && <p className="text-muted-foreground">{agent.description}</p>}
          <p className="text-sm text-muted-foreground">
            {agent.llm_provider}/{agent.llm_model}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/agents/${id}?edit=true`}>
              <Edit className="h-4 w-4" />
              Editar
            </Link>
          </Button>
          <RunAgentButton agentId={id} agentName={agent.name} />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            <Layers className="h-4 w-4" />
            System Prompt
          </CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="whitespace-pre-wrap font-mono text-xs text-muted-foreground">
            {agent.system_prompt}
          </pre>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <Clock className="h-4 w-4" />
          Runs recientes
        </h2>
        {!runs || runs.length === 0 ? (
          <p className="text-sm text-muted-foreground">Sin runs todavía. Ejecutá el agente para empezar.</p>
        ) : (
          <div className="space-y-2">
            {runs.map((run) => (
              <Link
                key={run.id}
                href={`/runs/${run.id}`}
                className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-accent"
              >
                <span className="font-mono text-xs text-muted-foreground">{run.id.slice(0, 8)}...</span>
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

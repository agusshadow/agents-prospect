import Link from "next/link";
import { Plus } from "lucide-react";

import { getAgents } from "@/actions/agents";
import { AgentCard } from "@/components/app/agents/agent-card";
import { Button } from "@/components/ui/button";

export default async function AgentsPage() {
  const { data: agents, error } = await getAgents();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Agentes</h1>
          <p className="mt-1 text-muted-foreground">
            {agents ? `${agents.length} agente${agents.length !== 1 ? "s" : ""} configurados` : ""}
          </p>
        </div>
        <Button asChild>
          <Link href="/agents/new">
            <Plus className="h-4 w-4" />
            Nuevo agente
          </Link>
        </Button>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          Error al cargar agentes: {error.message}
        </div>
      )}

      {agents && agents.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-20 text-center">
          <p className="text-muted-foreground">Todavía no hay agentes creados.</p>
          <Button asChild className="mt-4">
            <Link href="/agents/new">
              <Plus className="h-4 w-4" />
              Crear el primer agente
            </Link>
          </Button>
        </div>
      )}

      {agents && agents.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {agents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      )}
    </div>
  );
}

import Link from "next/link";
import { Bot, Plus } from "lucide-react";

import { getAgents } from "@/actions/agents";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function DashboardPage() {
  const { data: agents } = await getAgents();
  const activeAgents = agents?.filter((a) => a.is_active).length ?? 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="mt-1 text-muted-foreground">Resumen de la plataforma</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Agentes</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{agents?.length ?? 0}</div>
            <p className="text-xs text-muted-foreground">{activeAgents} activos</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Acciones rápidas</h2>
      </div>
      <div className="flex gap-3">
        <Button asChild>
          <Link href="/agents/new">
            <Plus className="h-4 w-4" />
            Nuevo agente
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/agents">Ver todos los agentes</Link>
        </Button>
      </div>
    </div>
  );
}

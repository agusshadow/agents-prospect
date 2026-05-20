import Link from "next/link";
import { Bot, Play } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import type { Agent } from "@/schemas/agent";

interface AgentCardProps {
  agent: Agent;
}

export function AgentCard({ agent }: AgentCardProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-start gap-3 space-y-0">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <Bot className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1 space-y-1">
          <CardTitle className="flex items-center gap-2 text-base">
            {agent.name}
            <Badge variant={agent.is_active ? "default" : "secondary"} className="text-xs">
              {agent.is_active ? "Activo" : "Inactivo"}
            </Badge>
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            {agent.llm_provider}/{agent.llm_model}
          </p>
        </div>
      </CardHeader>
      {agent.description && (
        <CardContent className="flex-1">
          <p className="line-clamp-2 text-sm text-muted-foreground">{agent.description}</p>
        </CardContent>
      )}
      <CardFooter className="gap-2">
        <Button variant="outline" size="sm" asChild className="flex-1">
          <Link href={`/agents/${agent.id}`}>Ver detalle</Link>
        </Button>
        <Button size="sm" asChild className="flex-1">
          <Link href={`/agents/${agent.id}`}>
            <Play className="h-3 w-3" />
            Ejecutar
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

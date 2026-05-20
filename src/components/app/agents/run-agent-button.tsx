"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Play } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

interface RunAgentButtonProps {
  agentId: string;
}

export function RunAgentButton({ agentId }: RunAgentButtonProps) {
  const router = useRouter();
  const [isRunning, setIsRunning] = useState(false);

  async function handleRun() {
    setIsRunning(true);
    try {
      const response = await fetch(`/api/run/${agentId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "Ejecutar agente" }),
      });

      const data = (await response.json()) as unknown;

      if (!response.ok) {
        const error = data as { message?: string };
        toast.error(`Error: ${error.message ?? "Error al iniciar el run"}`);
        return;
      }

      const result = data as { runId: string };
      toast.success("Run iniciado");
      router.push(`/runs/${result.runId}`);
    } catch {
      toast.error("Error de conexión");
    } finally {
      setIsRunning(false);
    }
  }

  return (
    <Button onClick={handleRun} disabled={isRunning}>
      <Play className="h-4 w-4" />
      {isRunning ? "Iniciando..." : "Ejecutar ahora"}
    </Button>
  );
}

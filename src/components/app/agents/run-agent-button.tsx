"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Play } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface RunAgentButtonProps {
  agentId: string;
  agentName: string;
}

export function RunAgentButton({ agentId, agentName }: RunAgentButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  async function handleRun() {
    if (!message.trim()) {
      toast.error("Escribí un mensaje para el agente");
      return;
    }

    setIsRunning(true);
    try {
      const response = await fetch(`/api/run/${agentId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: message.trim() }),
      });

      const data = (await response.json()) as unknown;

      if (!response.ok) {
        const error = data as { message?: string };
        toast.error(`Error: ${error.message ?? "Error al iniciar el run"}`);
        return;
      }

      const result = data as { runId: string };
      setOpen(false);
      toast.success("Run iniciado — redirigiendo a los logs...");
      router.push(`/runs/${result.runId}`);
    } catch {
      toast.error("Error de conexión");
    } finally {
      setIsRunning(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Play className="h-4 w-4" />
          Ejecutar ahora
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Ejecutar: {agentName}</DialogTitle>
          <DialogDescription>
            Escribí el mensaje que va a recibir el agente como input.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Label htmlFor="run-message">Mensaje</Label>
          <Textarea
            id="run-message"
            rows={5}
            placeholder={`Ej: Analizar empresa: Mercado Libre`}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                void handleRun();
              }
            }}
            autoFocus
          />
          <p className="text-xs text-muted-foreground">Ctrl+Enter para ejecutar</p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isRunning}>
            Cancelar
          </Button>
          <Button onClick={handleRun} disabled={isRunning || !message.trim()}>
            <Play className="h-4 w-4" />
            {isRunning ? "Iniciando..." : "Ejecutar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

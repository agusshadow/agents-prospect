"use client";

import { useEffect } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AgentError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center gap-4 py-20 text-center">
      <AlertCircle className="h-10 w-10 text-destructive" />
      <p className="font-semibold">Error al cargar el agente</p>
      <p className="text-sm text-muted-foreground">{error.message}</p>
      <Button variant="outline" onClick={reset}>
        <RefreshCw className="h-4 w-4" />
        Reintentar
      </Button>
    </div>
  );
}

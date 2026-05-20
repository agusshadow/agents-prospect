"use client";

import { useEffect } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center p-8">
      <div className="flex max-w-md flex-col items-center gap-4 text-center">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <h1 className="text-2xl font-bold">Algo salió mal</h1>
        <p className="text-muted-foreground">
          {error.message ?? "Error inesperado. Por favor intentá de nuevo."}
        </p>
        <Button onClick={reset}>
          <RefreshCw className="h-4 w-4" />
          Reintentar
        </Button>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { AlertCircle, RefreshCw, Wifi, WifiOff } from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import type { RunLog, RunStatus } from "@/schemas/run";

interface RunLogsLiveProps {
  runId: string;
  initialLogs: RunLog[];
  initialStatus: RunStatus;
}

const LOG_LEVEL_COLORS: Record<string, string> = {
  info: "text-blue-400",
  warn: "text-yellow-400",
  error: "text-red-400",
};

export function RunLogsLive({ runId, initialLogs, initialStatus }: RunLogsLiveProps) {
  const [logs, setLogs] = useState<RunLog[]>(initialLogs);
  const [status, setStatus] = useState<RunStatus>(initialStatus);
  const [connected, setConnected] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  const isFinished = status === "completed" || status === "failed" || status === "cancelled";

  useEffect(() => {
    if (isFinished) return;

    const channel = supabase
      .channel(`run-logs-${runId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "run_logs", filter: `run_id=eq.${runId}` },
        (payload) => {
          setLogs((previous) => [...previous, payload.new as RunLog]);
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "runs", filter: `id=eq.${runId}` },
        (payload) => {
          const updated = payload.new as { status: RunStatus };
          setStatus(updated.status);
        }
      )
      .subscribe((state) => {
        setConnected(state === "SUBSCRIBED");
      });

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [runId, isFinished, supabase]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  function handleReconnect() {
    window.location.reload();
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        {isFinished ? (
          <Badge variant={status === "completed" ? "default" : "destructive"}>{status}</Badge>
        ) : connected ? (
          <div className="flex items-center gap-1.5 text-xs text-green-500">
            <Wifi className="h-3 w-3" />
            En vivo
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs text-destructive">
              <WifiOff className="h-3 w-3" />
              Desconectado
            </div>
            <Button size="sm" variant="outline" onClick={handleReconnect} className="h-6 text-xs">
              <RefreshCw className="h-3 w-3" />
              Reconectar
            </Button>
          </div>
        )}
      </div>

      <div className="h-[600px] overflow-y-auto rounded-lg border bg-zinc-950 p-4 font-mono text-xs">
        {logs.length === 0 ? (
          <p className="text-zinc-500">Esperando logs...</p>
        ) : (
          <div className="space-y-1">
            {logs.map((log) => (
              <div key={log.id} className="flex gap-3">
                <span className="shrink-0 text-zinc-500">
                  {new Date(log.created_at).toLocaleTimeString("es-AR")}
                </span>
                <span className={`shrink-0 uppercase ${LOG_LEVEL_COLORS[log.level] ?? "text-zinc-400"}`}>
                  [{log.level}]
                </span>
                <span className="text-zinc-200">{log.message}</span>
              </div>
            ))}
          </div>
        )}
        {!isFinished && connected && (
          <div className="mt-2 flex items-center gap-1.5 text-zinc-500">
            <span className="animate-pulse">▋</span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {!connected && !isFinished && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>Se perdió la conexión en tiempo real. Los logs pueden estar incompletos.</span>
        </div>
      )}
    </div>
  );
}

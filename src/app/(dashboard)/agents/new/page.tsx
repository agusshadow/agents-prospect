import { AgentForm } from "@/components/app/agents/agent-form";

export default function NewAgentPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Nuevo agente</h1>
        <p className="mt-1 text-muted-foreground">Configurá un agente con su system prompt y modelo LLM</p>
      </div>
      <AgentForm />
    </div>
  );
}

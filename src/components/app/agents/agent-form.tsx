"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { createAgent, updateAgent } from "@/actions/agents";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CreateAgentSchema } from "@/schemas/agent";
import { z } from "zod";

import type { Agent } from "@/schemas/agent";

type CreateAgentFormData = z.input<typeof CreateAgentSchema>;

const LLM_OPTIONS = [
  { provider: "google", model: "gemini-2.0-flash", label: "Gemini 2.0 Flash (gratis)" },
  { provider: "google", model: "gemini-2.0-flash-lite", label: "Gemini 2.0 Flash Lite (más rápido)" },
  { provider: "google", model: "gemini-2.5-flash-preview-05-20", label: "Gemini 2.5 Flash Preview" },
  { provider: "google", model: "gemini-2.5-pro-preview-05-06", label: "Gemini 2.5 Pro Preview" },
] as const;

interface AgentFormProps {
  agent?: Agent;
}

export function AgentForm({ agent }: AgentFormProps) {
  const router = useRouter();
  const isEditing = !!agent;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    } = useForm<CreateAgentFormData>({
    resolver: zodResolver(CreateAgentSchema),
    defaultValues: agent
      ? {
          name: agent.name,
          description: agent.description ?? undefined,
          system_prompt: agent.system_prompt,
          llm_provider: agent.llm_provider,
          llm_model: agent.llm_model,
          is_active: agent.is_active,
        }
      : {
          llm_provider: "google",
          llm_model: "gemini-2.0-flash",
          is_active: true,
        },
  });

  const selectedModel = watch("llm_model");

  async function onSubmit(data: CreateAgentFormData) {
    const result = isEditing
      ? await updateAgent(agent.id, data)
      : await createAgent(data);

    if (result.error) {
      toast.error(`Error: ${result.error.message}`);
      return;
    }

    toast.success(isEditing ? "Agente actualizado" : "Agente creado correctamente");
    router.push(isEditing ? `/agents/${agent.id}` : "/agents");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Nombre *</Label>
        <Input id="name" placeholder="Ej: Agente de outreach" {...register("name")} />
        {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descripción</Label>
        <Input
          id="description"
          placeholder="Qué hace este agente"
          {...register("description")}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="system_prompt">System Prompt *</Label>
        <Textarea
          id="system_prompt"
          rows={8}
          placeholder="Eres un agente de prospección comercial..."
          {...register("system_prompt")}
        />
        {errors.system_prompt && (
          <p className="text-xs text-destructive">{errors.system_prompt.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Modelo LLM *</Label>
        <Select
          value={selectedModel}
          onValueChange={(value) => {
            const option = LLM_OPTIONS.find((o) => o.model === value);
            if (option) {
              setValue("llm_model", option.model);
              setValue("llm_provider", option.provider);
            }
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar modelo" />
          </SelectTrigger>
          <SelectContent>
            {LLM_OPTIONS.map((option) => (
              <SelectItem key={option.model} value={option.model}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.llm_model && <p className="text-xs text-destructive">{errors.llm_model.message}</p>}
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Guardando..." : isEditing ? "Guardar cambios" : "Crear agente"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}

import { extendZodWithOpenApi, OpenApiGeneratorV31, OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

import { AgentSchema, CreateAgentSchema, UpdateAgentSchema } from "@/schemas/agent";
import { RunLogSchema, RunSchema } from "@/schemas/run";

export function buildOpenApiSpec() {
  const registry = new OpenAPIRegistry();

  registry.register("Agent", AgentSchema.openapi({ title: "Agent" }));
  registry.register("Run", RunSchema.openapi({ title: "Run" }));
  registry.register("RunLog", RunLogSchema.openapi({ title: "RunLog" }));

  registry.registerPath({
    method: "get",
    path: "/api/agents",
    summary: "Listar agentes",
    responses: {
      200: { description: "Lista de agentes", content: { "application/json": { schema: z.array(AgentSchema) } } },
    },
  });

  registry.registerPath({
    method: "post",
    path: "/api/agents",
    summary: "Crear agente",
    request: { body: { content: { "application/json": { schema: CreateAgentSchema } } } },
    responses: {
      201: { description: "Agente creado", content: { "application/json": { schema: AgentSchema } } },
      400: { description: "Validación fallida" },
    },
  });

  registry.registerPath({
    method: "patch",
    path: "/api/agents/{id}",
    summary: "Actualizar agente",
    request: {
      params: z.object({ id: z.string().uuid() }),
      body: { content: { "application/json": { schema: UpdateAgentSchema } } },
    },
    responses: {
      200: { description: "Agente actualizado", content: { "application/json": { schema: AgentSchema } } },
      404: { description: "Agente no encontrado" },
    },
  });

  registry.registerPath({
    method: "post",
    path: "/api/run/{agentId}",
    summary: "Disparar un run de agente",
    request: {
      params: z.object({ agentId: z.string().uuid() }),
      body: {
        content: {
          "application/json": {
            schema: z.object({
              message: z.string().default("Ejecutar agente"),
              context: z.record(z.unknown()).optional(),
            }),
          },
        },
      },
    },
    responses: {
      202: {
        description: "Run iniciado",
        content: { "application/json": { schema: z.object({ runId: z.string().uuid() }) } },
      },
      404: { description: "Agente no encontrado" },
    },
  });

  const generator = new OpenApiGeneratorV31(registry.definitions);

  return generator.generateDocument({
    openapi: "3.1.0",
    info: { title: "Agents Prospect API", version: "0.1.0" },
    servers: [{ url: "/api" }],
  });
}

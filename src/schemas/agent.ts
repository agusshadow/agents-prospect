import { z } from "zod";

export const LlmProviderSchema = z.enum(["google", "openai", "anthropic"]);
export type LlmProvider = z.infer<typeof LlmProviderSchema>;

export const LlmConfigSchema = z.object({
  temperature: z.number().min(0).max(2).default(0.7),
  maxTokens: z.number().int().positive().optional(),
});
export type LlmConfig = z.infer<typeof LlmConfigSchema>;

export const AgentSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional().nullable(),
  system_prompt: z.string().min(1),
  llm_provider: LlmProviderSchema,
  llm_model: z.string().min(1),
  llm_config: LlmConfigSchema,
  is_active: z.boolean().default(true),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});
export type Agent = z.infer<typeof AgentSchema>;

export const CreateAgentSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional().nullable(),
  system_prompt: z.string().min(1),
  llm_provider: LlmProviderSchema,
  llm_model: z.string().min(1),
  llm_config: LlmConfigSchema.optional(),
  is_active: z.boolean().default(true),
});
export type CreateAgent = z.infer<typeof CreateAgentSchema>;

export const UpdateAgentSchema = CreateAgentSchema.partial();
export type UpdateAgent = z.infer<typeof UpdateAgentSchema>;

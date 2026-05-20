import { z } from "zod";

export const RunStatusSchema = z.enum([
  "pending",
  "running",
  "completed",
  "failed",
  "cancelled",
]);
export type RunStatus = z.infer<typeof RunStatusSchema>;

export const RunSchema = z.object({
  id: z.string().uuid(),
  agent_id: z.string().uuid(),
  status: RunStatusSchema,
  input_context: z.record(z.unknown()).nullable(),
  output: z.record(z.unknown()).nullable(),
  error_message: z.string().nullable(),
  started_at: z.string().datetime().nullable(),
  finished_at: z.string().datetime().nullable(),
  created_at: z.string().datetime(),
});
export type Run = z.infer<typeof RunSchema>;

export const RunLogLevelSchema = z.enum(["info", "warn", "error"]);
export type RunLogLevel = z.infer<typeof RunLogLevelSchema>;

export const RunLogSchema = z.object({
  id: z.string().uuid(),
  run_id: z.string().uuid(),
  level: RunLogLevelSchema,
  message: z.string(),
  metadata: z.record(z.unknown()).nullable(),
  created_at: z.string().datetime(),
});
export type RunLog = z.infer<typeof RunLogSchema>;

export const CreateRunSchema = RunSchema.pick({ agent_id: true, input_context: true });
export type CreateRun = z.infer<typeof CreateRunSchema>;

export const CreateRunLogSchema = RunLogSchema.omit({ id: true, created_at: true });
export type CreateRunLog = z.infer<typeof CreateRunLogSchema>;

import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
    GOOGLE_GENERATIVE_AI_API_KEY: z.string().min(1).optional(),
    OPENAI_API_KEY: z.string().min(1).optional(),
    ANTHROPIC_API_KEY: z.string().min(1).optional(),
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    LOG_LEVEL: z.enum(["trace", "debug", "info", "warn", "error", "fatal"]).default("info"),
  },
  client: {
    NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  },
  runtimeEnv: {
    SUPABASE_SERVICE_ROLE_KEY: process.env["SUPABASE_SERVICE_ROLE_KEY"],
    GOOGLE_GENERATIVE_AI_API_KEY: process.env["GOOGLE_GENERATIVE_AI_API_KEY"],
    OPENAI_API_KEY: process.env["OPENAI_API_KEY"],
    ANTHROPIC_API_KEY: process.env["ANTHROPIC_API_KEY"],
    NODE_ENV: process.env["NODE_ENV"],
    LOG_LEVEL: process.env["LOG_LEVEL"],
    NEXT_PUBLIC_SUPABASE_URL: process.env["NEXT_PUBLIC_SUPABASE_URL"],
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env["NEXT_PUBLIC_SUPABASE_ANON_KEY"],
  },
  skipValidation: !!process.env["SKIP_ENV_VALIDATION"],
});

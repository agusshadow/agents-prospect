-- Fase 1: Tablas base
-- Ejecutar en Supabase SQL Editor (o con supabase db push)

-- Habilitar UUID
create extension if not exists "pgcrypto";

-- =========================================================
-- USERS (2 filas fijas, sin registro público)
-- =========================================================
create table if not exists public.users (
  id          uuid primary key default gen_random_uuid(),
  email       text not null unique,
  name        text not null,
  created_at  timestamptz not null default now()
);

alter table public.users enable row level security;

-- Sin RLS pública — solo acceso via service_role en el backend
create policy "service_role_all" on public.users
  for all using (auth.role() = 'service_role');

-- =========================================================
-- AGENTS
-- =========================================================
create table if not exists public.agents (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  description   text,
  system_prompt text not null,
  llm_provider  text not null default 'google',
  llm_model     text not null default 'gemini-2.0-flash',
  llm_config    jsonb not null default '{"temperature": 0.7}'::jsonb,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table public.agents enable row level security;

create policy "service_role_all" on public.agents
  for all using (auth.role() = 'service_role');

-- Trigger para updated_at automático
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger agents_updated_at
  before update on public.agents
  for each row execute function public.set_updated_at();

-- =========================================================
-- RUNS
-- =========================================================
create table if not exists public.runs (
  id              uuid primary key default gen_random_uuid(),
  agent_id        uuid not null references public.agents(id) on delete cascade,
  status          text not null default 'pending'
                  check (status in ('pending', 'running', 'completed', 'failed', 'cancelled')),
  input_context   jsonb,
  output          jsonb,
  error_message   text,
  started_at      timestamptz,
  finished_at     timestamptz,
  created_at      timestamptz not null default now()
);

alter table public.runs enable row level security;

create policy "service_role_all" on public.runs
  for all using (auth.role() = 'service_role');

create index runs_agent_id_idx on public.runs(agent_id);
create index runs_status_idx on public.runs(status);
create index runs_created_at_idx on public.runs(created_at desc);

-- =========================================================
-- RUN_LOGS (con Realtime habilitado)
-- =========================================================
create table if not exists public.run_logs (
  id          uuid primary key default gen_random_uuid(),
  run_id      uuid not null references public.runs(id) on delete cascade,
  level       text not null default 'info'
              check (level in ('info', 'warn', 'error')),
  message     text not null,
  metadata    jsonb,
  created_at  timestamptz not null default now()
);

alter table public.run_logs enable row level security;

-- Los logs se leen desde el cliente browser via anon key (para Realtime)
create policy "anon_read" on public.run_logs
  for select using (true);

create policy "service_role_all" on public.run_logs
  for all using (auth.role() = 'service_role');

create index run_logs_run_id_idx on public.run_logs(run_id);
create index run_logs_created_at_idx on public.run_logs(created_at asc);

-- Habilitar Realtime para run_logs
-- (también se puede hacer desde el dashboard: Database > Replication > run_logs)
alter publication supabase_realtime add table public.run_logs;
alter publication supabase_realtime add table public.runs;

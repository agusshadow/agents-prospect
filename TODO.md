# TODO — Agents Prospect

## Completado — Fase 1

- [x] Setup inicial Next.js 14 con TypeScript strict
- [x] Configurar shadcn/ui con tema default (componentes manuales: button, badge, card, input, label, textarea, select)
- [x] Configurar ESLint + Prettier + Husky + lint-staged + commitlint
- [x] Configurar Vitest + React Testing Library + Playwright
- [x] Configurar @t3-oss/env-nextjs — todas las env vars tipadas
- [x] Setup Pino para logging de servidor
- [x] Clientes Supabase (browser + server + middleware)
- [x] Schemas Zod: Agent, Run, RunLog — fuente de verdad de tipos
- [x] Tipos Supabase placeholder en src/types/supabase.ts
- [x] Tipo ApiError estándar
- [x] Migraciones SQL: users, agents, runs, run_logs (con Realtime)
- [x] Server Actions: CRUD de agentes + activar/desactivar
- [x] Server Actions: obtener runs y logs
- [x] Endpoint POST /api/run/[agentId] — dispara run manual (202 async)
- [x] Runner base con AI SDK + escritura de run_logs en cada paso
- [x] Provider de LLM: Google Gemini (configurable)
- [x] zod-to-openapi + endpoint GET /api/docs
- [x] Swagger UI en /api-docs (solo dev)
- [x] Layout dashboard con sidebar (Dashboard, Agentes, Runs)
- [x] Página / (dashboard con métricas básicas)
- [x] Página /agents (lista de agentes)
- [x] Página /agents/new (formulario de creación con React Hook Form + Zod)
- [x] Página /agents/[id] (detalle, edición, botón de run, historial de runs)
- [x] Página /runs (historial global)
- [x] Página /runs/[id] — logs en tiempo real via Supabase Realtime
- [x] error.tsx global
- [x] error.tsx por segmento: /agents/[id], /runs/[id]
- [x] not-found.tsx
- [x] Toast de errores con Sonner

## Pendiente — Para arrancar

- [ ] Crear proyecto en Supabase y completar .env con las keys reales
- [ ] Ejecutar migración: supabase/migrations/001_fase1_tables.sql
- [ ] Regenerar src/types/supabase.ts con: npx supabase gen types --lang=typescript --project-id <project-id> > src/types/supabase.ts
- [ ] Agregar GOOGLE_GENERATIVE_AI_API_KEY en .env (Google AI Studio, gratis)
- [ ] Instalar browsers de Playwright: npx playwright install chromium
- [ ] Escribir tests unitarios del runner (Fase 1 — prioritario antes de Fase 2)

## Fase 2 — Campañas (próxima)

- [ ] Tablas: campaigns, prospects, prospect_events, integrations, agent_integrations
- [ ] Agente Scraper (Apollo.io API)
- [ ] Agente Enrichment
- [ ] Agente Outreach (Gmail + WhatsApp Twilio)
- [ ] Agente Scheduler (Google Calendar)
- [ ] Orquestador — lógica de transiciones de estado del prospecto
- [ ] Trigger.dev: cron del orquestador + webhook de respuestas
- [ ] Páginas: /campaigns, /campaigns/new, /campaigns/[id], /prospects/[id], /integrations

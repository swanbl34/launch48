-- ═══════════════════════════════════════════════════════════════════════════
-- Launch48 — Espace client
-- Migration initiale : tables, bucket de stockage, policies.
--
-- À exécuter dans Supabase → SQL Editor (une seule fois).
-- Idempotent : relançable sans casse.
--
-- MODÈLE DE SÉCURITÉ
-- Toutes les tables ont RLS activé et AUCUNE policy pour anon/authenticated.
-- Conséquence : les clés publiques (anon) ne peuvent RIEN lire ni écrire.
-- Seule la clé service_role — utilisée exclusivement côté serveur Next.js —
-- contourne RLS. L'autorisation réelle se fait dans l'app : le token uuid de
-- l'URL /espace/[token] sert de secret porteur, le cookie signé garde /admin.
-- ═══════════════════════════════════════════════════════════════════════════

create extension if not exists "pgcrypto";

-- ───────────────────────────────────────────────────────────────────────────
-- projects — un projet client = un token = une URL d'espace
-- ───────────────────────────────────────────────────────────────────────────
create table if not exists public.projects (
  id            uuid primary key default gen_random_uuid(),
  token         uuid not null unique default gen_random_uuid(),
  company       text not null,
  contact_name  text,
  email         text,
  phone         text,
  pack          text not null default 'standard'
                  check (pack in ('light', 'standard', 'pousse')),
  price         numeric,
  status        text not null default 'onboarding'
                  check (status in ('onboarding', 'production', 'recette', 'livre')),
  kickoff_date  date,
  delivery_date date,
  created_at    timestamptz not null default now()
);

-- Le lookup par token est le chemin chaud de toute l'app.
create index if not exists projects_token_idx on public.projects (token);

-- ───────────────────────────────────────────────────────────────────────────
-- form_answers — réponses du questionnaire, une ligne par projet
-- `data` est un objet jsonb { field_key: valeur } piloté par lib/brief-schema.ts
-- ───────────────────────────────────────────────────────────────────────────
create table if not exists public.form_answers (
  project_id   uuid primary key references public.projects (id) on delete cascade,
  data         jsonb not null default '{}'::jsonb,
  last_step    int not null default 1,
  submitted_at timestamptz,
  updated_at   timestamptz not null default now()
);

-- ───────────────────────────────────────────────────────────────────────────
-- assets — fichiers uploadés, rattachés à un champ du brief via field_key
-- ───────────────────────────────────────────────────────────────────────────
create table if not exists public.assets (
  id           uuid primary key default gen_random_uuid(),
  project_id   uuid not null references public.projects (id) on delete cascade,
  field_key    text not null,
  file_name    text not null,
  storage_path text not null,
  size         int,
  created_at   timestamptz not null default now()
);

create index if not exists assets_project_field_idx
  on public.assets (project_id, field_key);

-- ───────────────────────────────────────────────────────────────────────────
-- tasks — le suivi de production affiché sur le dashboard
-- owner = 'client' → la tâche est cochable par le client depuis son espace
-- ───────────────────────────────────────────────────────────────────────────
create table if not exists public.tasks (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid not null references public.projects (id) on delete cascade,
  phase       text not null,
  label       text not null,
  status      text not null default 'todo'
                check (status in ('todo', 'doing', 'blocked', 'done')),
  order_index int not null default 0,
  owner       text not null default 'launch48'
                check (owner in ('launch48', 'client')),
  done_at     timestamptz
);

create index if not exists tasks_project_order_idx
  on public.tasks (project_id, order_index);

-- ───────────────────────────────────────────────────────────────────────────
-- RLS : activé partout, zéro policy → tout est fermé sauf service_role
-- ───────────────────────────────────────────────────────────────────────────
alter table public.projects     enable row level security;
alter table public.form_answers enable row level security;
alter table public.assets       enable row level security;
alter table public.tasks        enable row level security;

-- Ceinture et bretelles : on retire aussi les droits par défaut du rôle anon.
revoke all on public.projects     from anon, authenticated;
revoke all on public.form_answers from anon, authenticated;
revoke all on public.assets       from anon, authenticated;
revoke all on public.tasks        from anon, authenticated;

-- ───────────────────────────────────────────────────────────────────────────
-- Storage — bucket privé `client-assets`
-- Les fichiers ne sont jamais servis en direct : l'app génère des URLs
-- signées valables 1 h au moment de l'affichage.
-- ───────────────────────────────────────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('client-assets', 'client-assets', false)
on conflict (id) do update set public = false;

-- Aucune policy n'est créée sur storage.objects : par défaut, un bucket privé
-- sans policy n'est accessible qu'à service_role, ce qui est exactement ce
-- qu'on veut. (On ne touche pas à storage.objects : cette table appartient à
-- supabase_storage_admin et un DROP POLICY y échouerait faute de droits.)

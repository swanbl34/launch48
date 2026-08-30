-- ═══════════════════════════════════════════════════════════════════════════
-- Launch48 — Espace client
-- Migration 002 : tâches « envoyables », livrables et dépôt de fichiers.
--
-- À exécuter dans Supabase → SQL Editor, APRÈS migration.sql.
-- Idempotent : relançable sans casse.
--
-- CE QUE ÇA CHANGE
-- Une tâche n'était qu'un intitulé et un statut. Elle devient un message
-- adressé au client : ce qu'il y a à faire, pourquoi, pour quand, et — quand
-- la tâche attend des fichiers — où les déposer.
--
--   description   le « pourquoi », écrit pour le client
--   deliverable   ce qu'on attend concrètement en retour (null = rien à fournir)
--   drive_url     dossier de dépôt propre à la tâche (sinon celui du projet)
--   due_date      échéance
--   milestone     'ouverture' (bloque l'ouverture) | 'livraison' (avant la
--                 mise en ligne) | null (quand tu peux)
--   client_note   le mot laissé par le client sur la tâche
--   submitted_at  quand le client a déclaré avoir fait / déposé
--
-- Et un cinquième statut, `review` : le client a rendu, la validation est de
-- notre côté. Sans lui, « c'est déposé » et « c'est validé » étaient le même
-- état — donc personne ne savait à qui était la balle.
-- ═══════════════════════════════════════════════════════════════════════════

-- ───────────────────────────────────────────────────────────────────────────
-- projects — dossier de dépôt commun à tout le projet
-- ───────────────────────────────────────────────────────────────────────────
alter table public.projects
  add column if not exists drive_url text;

-- ───────────────────────────────────────────────────────────────────────────
-- tasks — le contenu de la demande
-- ───────────────────────────────────────────────────────────────────────────
alter table public.tasks
  add column if not exists description  text,
  add column if not exists deliverable  text,
  add column if not exists drive_url    text,
  add column if not exists due_date     date,
  add column if not exists milestone    text,
  add column if not exists client_note  text,
  add column if not exists submitted_at timestamptz,
  add column if not exists created_at   timestamptz not null default now();

-- Le statut gagne `review`. La contrainte posée par migration.sql porte le nom
-- généré par Postgres pour un CHECK de colonne : <table>_<colonne>_check.
alter table public.tasks drop constraint if exists tasks_status_check;
alter table public.tasks add constraint tasks_status_check
  check (status in ('todo', 'doing', 'blocked', 'review', 'done'));

alter table public.tasks drop constraint if exists tasks_milestone_check;
alter table public.tasks add constraint tasks_milestone_check
  check (milestone is null or milestone in ('ouverture', 'livraison'));

-- Le dashboard client ne lit que ses propres tâches, et l'admin ne cherche que
-- celles qui attendent une validation : cet index couvre les deux.
create index if not exists tasks_project_owner_status_idx
  on public.tasks (project_id, owner, status);

-- Rien à changer côté RLS : les nouvelles colonnes héritent de la table, qui
-- reste fermée à anon et authenticated.

import type { Pack } from './task-templates';

export type ProjectStatus = 'onboarding' | 'production' | 'recette' | 'livre';
export type TaskStatus = 'todo' | 'doing' | 'blocked' | 'review' | 'done';
export type TaskOwner = 'launch48' | 'client';

/**
 * L'échéance d'une tâche, exprimée en jalon plutôt qu'en date.
 *
 * Une date précise vieillit mal — elle glisse, et une date dépassée démoralise
 * plus qu'elle ne mobilise. Le jalon, lui, dit ce qui se passe si la tâche
 * n'est pas faite, et reste vrai quelle que soit la date d'ouverture :
 *
 *   ouverture  la boutique ne peut pas ouvrir sans ça
 *   livraison  ça peut attendre les derniers jours, mais pas au-delà
 *   null       quand tu peux
 *
 * `due_date` existe en plus, pour les rares tâches qui ont une vraie date.
 */
export type TaskMilestone = 'ouverture' | 'livraison';

export type Project = {
  id: string;
  token: string;
  company: string;
  contact_name: string | null;
  email: string | null;
  phone: string | null;
  pack: Pack;
  price: number | null;
  status: ProjectStatus;
  kickoff_date: string | null;
  delivery_date: string | null;
  created_at: string;
  /** Dossier de dépôt commun à tout le projet (Google Drive). */
  drive_url: string | null;
};

/** Valeurs possibles dans form_answers.data, selon le type du champ. */
export type AnswerValue = string | string[] | boolean | null;
export type AnswerMap = Record<string, AnswerValue>;

export type FormAnswers = {
  project_id: string;
  data: AnswerMap;
  last_step: number;
  submitted_at: string | null;
  updated_at: string;
};

export type Asset = {
  id: string;
  project_id: string;
  field_key: string;
  file_name: string;
  storage_path: string;
  size: number | null;
  created_at: string;
};

export type Task = {
  id: string;
  project_id: string;
  phase: string;
  label: string;
  status: TaskStatus;
  order_index: number;
  owner: TaskOwner;
  done_at: string | null;

  /* ── Ajouts de la migration 002 ──────────────────────────────────────────
     Tous nullables : une base sur laquelle 002 n'a pas encore tourné renvoie
     `undefined`, et l'app doit continuer d'afficher les tâches sans broncher. */

  /** Le « pourquoi », écrit pour le client. */
  description: string | null;
  /** Ce qu'on attend en retour. `null` = rien à fournir, juste à faire. */
  deliverable: string | null;
  /** Dossier de dépôt propre à la tâche. Sinon celui du projet. */
  drive_url: string | null;
  due_date: string | null;
  milestone: TaskMilestone | null;
  /** Le mot laissé par le client sur cette tâche. */
  client_note: string | null;
  /** Quand le client a déclaré avoir fait ou déposé. */
  submitted_at: string | null;
  created_at: string | null;
};

export const STATUS_LABELS: Record<ProjectStatus, string> = {
  onboarding: 'Onboarding',
  production: 'Production',
  recette: 'Recette',
  livre: 'Livré',
};

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  todo: 'À faire',
  doing: 'En cours',
  blocked: 'Bloqué',
  review: 'À valider',
  done: 'Terminé',
};

/** Ce que le client lit, qui n'est pas tout à fait ce que l'admin lit. */
export const CLIENT_STATUS_LABELS: Record<TaskStatus, string> = {
  todo: 'À faire',
  doing: 'En cours',
  blocked: 'En attente',
  review: 'Reçu, en cours de vérification',
  done: 'Validé',
};

export const MILESTONE_LABELS: Record<TaskMilestone, string> = {
  ouverture: "Bloque l'ouverture",
  livraison: 'Avant la mise en ligne',
};

/** Ordre de tri : le plus urgent d'abord, « quand tu peux » en dernier. */
export const MILESTONE_ORDER: Record<TaskMilestone | 'aucun', number> = {
  ouverture: 0,
  livraison: 1,
  aucun: 2,
};

export const MILESTONE_TONE: Record<TaskMilestone, 'danger' | 'warn'> = {
  ouverture: 'danger',
  livraison: 'warn',
};

/** Une tâche est-elle encore dans le camp du client ? */
export const isOpenForClient = (t: Task) =>
  t.owner === 'client' && t.status !== 'done' && t.status !== 'review';

/**
 * Les deux temps de l'espace client.
 *
 * `onboarding` : le client ne voit que son questionnaire. Pas de timeline,
 *   pas de tâches — rien qui ne le concerne pas encore. L'objectif de cette
 *   phase est unique : rassembler les éléments manquants.
 *
 * Ensuite (`production`, `recette`, `livre`) : le dashboard complet s'ouvre,
 *   avec l'avancement, les phases et les tâches.
 *
 * Le passage de l'un à l'autre est une décision manuelle, prise depuis
 * l'admin quand tu estimes avoir tout reçu.
 */
export const isOnboarding = (status: ProjectStatus) => status === 'onboarding';

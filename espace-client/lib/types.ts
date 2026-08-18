import type { Pack } from './task-templates';

export type ProjectStatus = 'onboarding' | 'production' | 'recette' | 'livre';
export type TaskStatus = 'todo' | 'doing' | 'blocked' | 'done';
export type TaskOwner = 'launch48' | 'client';

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
  done: 'Terminé',
};

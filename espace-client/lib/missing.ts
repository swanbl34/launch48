/**
 * Calcul des « éléments manquants ».
 *
 * Deux sources, dans cet ordre d'affichage (cf. spec dashboard) :
 *   1. les champs `required` du brief qui sont vides   → bloquants
 *   2. les tâches en status = 'blocked'                → le reste
 */
import { FIELDS, UNKNOWN_KEY, isFileField, type BriefField } from './brief-schema';
import type { AnswerMap, AnswerValue, Asset, Task } from './types';

/** Les champs que le client a marqués « je ne sais pas encore ». */
export function unknownKeys(answers: AnswerMap): string[] {
  const v = answers[UNKNOWN_KEY];
  return Array.isArray(v) ? v : [];
}

export const isDeferred = (key: string, answers: AnswerMap) =>
  unknownKeys(answers).includes(key);

export type MissingItem = {
  id: string;
  label: string;
  /** 'field' → cliquable vers le brief ; 'task' → informatif. */
  kind: 'field' | 'task';
  /** Étape du brief à ouvrir (champs uniquement). */
  step?: number;
  /** Clé à focus (champs uniquement). */
  focus?: string;
  /** Phase de la tâche (tâches uniquement). */
  phase?: string;
};

/**
 * Un champ est-il rempli ?
 *
 * Les fichiers ne vivent pas dans le jsonb : on regarde la table `assets`.
 * Les booléens requis comptent comme répondus dès qu'ils valent true OU false,
 * sauf ceux marqués `blockingWhenFalse` (les « accès transmis ? ») pour
 * lesquels seul `true` lève le blocage.
 */
export function isFilled(
  field: BriefField,
  value: AnswerValue | undefined,
  assets: Asset[],
): boolean {
  if (isFileField(field)) {
    return assets.some((a) => a.field_key === field.key);
  }

  if (field.type === 'bool') {
    if (field.blockingWhenFalse) return value === true;
    return value === true || value === false;
  }

  if (Array.isArray(value)) {
    return value.some((v) => typeof v === 'string' && v.trim() !== '');
  }

  return typeof value === 'string' && value.trim() !== '';
}

/**
 * Les champs bloquants encore vides ET non reportés.
 * Un champ marqué « je ne sais pas encore » sort d'ici — il réapparaît dans
 * deferredFields(), pour rester visible sans bloquer le client.
 */
export function missingRequiredFields(answers: AnswerMap, assets: Asset[]): BriefField[] {
  const deferred = unknownKeys(answers);
  return FIELDS.filter(
    (f) => f.required && !isFilled(f, answers[f.key], assets) && !deferred.includes(f.key),
  );
}

/** Les champs bloquants que le client a explicitement reportés. */
export function deferredFields(answers: AnswerMap, assets: Asset[]): BriefField[] {
  const deferred = unknownKeys(answers);
  return FIELDS.filter(
    (f) => f.required && !isFilled(f, answers[f.key], assets) && deferred.includes(f.key),
  );
}

/** Compteur affiché dans le formulaire : « X champs bloquants restants ». */
export function countMissingRequired(answers: AnswerMap, assets: Asset[]): number {
  return missingRequiredFields(answers, assets).length;
}

/** Manquants d'une étape donnée — pilote la pastille rouge de la barre d'étapes. */
export function missingInStep(step: number, answers: AnswerMap, assets: Asset[]): number {
  const deferred = unknownKeys(answers);
  return FIELDS.filter(
    (f) =>
      f.step === step &&
      f.required &&
      !isFilled(f, answers[f.key], assets) &&
      !deferred.includes(f.key),
  ).length;
}

/** La liste complète affichée sur le dashboard : bloquants d'abord. */
export function computeMissing(
  answers: AnswerMap,
  assets: Asset[],
  tasks: Task[],
): { blocking: MissingItem[]; deferred: MissingItem[]; other: MissingItem[] } {
  const blocking: MissingItem[] = missingRequiredFields(answers, assets).map((f) => ({
    id: `field:${f.key}`,
    label: f.label,
    kind: 'field',
    step: f.step,
    focus: f.key,
  }));

  const deferred: MissingItem[] = deferredFields(answers, assets).map((f) => ({
    id: `deferred:${f.key}`,
    label: f.label,
    kind: 'field',
    step: f.step,
    focus: f.key,
  }));

  const other: MissingItem[] = tasks
    .filter((t) => t.status === 'blocked')
    .map((t) => ({
      id: `task:${t.id}`,
      label: t.label,
      kind: 'task',
      phase: t.phase,
    }));

  return { blocking, deferred, other };
}

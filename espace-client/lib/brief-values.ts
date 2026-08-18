/**
 * Traduction FormData ↔ AnswerMap, pilotée par brief-schema.
 *
 * Les Server Actions reçoivent un FormData brut : ce module le normalise
 * selon le type déclaré de chaque champ, pour que form_answers.data reste
 * homogène (string / string[] / boolean) quoi qu'envoie le navigateur.
 */
import { UNKNOWN_KEY, fieldsForStep, isFileField, type BriefField } from './brief-schema';
import type { AnswerMap, AnswerValue } from './types';

/** Découpe une saisie multi-lignes en liste, en retirant les lignes vides. */
export function parseUrlList(raw: string): string[] {
  return raw
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
}

function readField(field: BriefField, fd: FormData): AnswerValue {
  switch (field.type) {
    case 'bool':
      // Une checkbox absente du FormData = décochée. On envoie un champ caché
      // `__present_<key>` pour distinguer « décoché » de « étape non affichée ».
      return fd.get(`__present_${field.key}`) !== null ? fd.get(field.key) === 'on' : null;

    case 'multiselect':
      return fd.getAll(field.key).map(String).filter(Boolean);

    case 'url_list':
      return parseUrlList(String(fd.get(field.key) ?? ''));

    default:
      return String(fd.get(field.key) ?? '').trim();
  }
}

/**
 * Extrait les réponses d'une étape. On ne touche qu'aux champs de cette
 * étape : les autres réponses sont préservées par le merge côté action.
 *
 * `previousUnknown` est la liste déjà en base : on ne recalcule que les
 * champs de l'étape affichée, sans écraser les reports des autres étapes.
 */
export function readStepAnswers(
  step: number,
  fd: FormData,
  previousUnknown: string[] = [],
): AnswerMap {
  const out: AnswerMap = {};
  const stepFields = fieldsForStep(step);

  for (const field of stepFields) {
    if (isFileField(field)) continue; // les fichiers vivent dans `assets`
    const value = readField(field, fd);
    if (value === null && field.type === 'bool') continue; // pas affiché → pas écrasé
    out[field.key] = value;
  }

  // « Je ne sais pas encore » : on repart de l'existant, on retire les champs
  // de cette étape, puis on rajoute ceux qui sont cochés maintenant.
  const stepKeys = new Set(stepFields.filter((f) => f.allowUnknown).map((f) => f.key));
  const kept = previousUnknown.filter((k) => !stepKeys.has(k));
  const checked = stepFields
    .filter((f) => f.allowUnknown && fd.get(`__unknown_${f.key}`) === 'on')
    .map((f) => f.key);

  out[UNKNOWN_KEY] = [...kept, ...checked];

  return out;
}

/** Rendu lisible d'une réponse (fiche admin, écran de récap). */
export function displayValue(field: BriefField, value: AnswerValue | undefined): string {
  if (value === null || value === undefined || value === '') return '—';
  if (field.type === 'bool') return value === true ? 'Oui' : 'Non';
  if (Array.isArray(value)) return value.length ? value.join(', ') : '—';
  return String(value);
}

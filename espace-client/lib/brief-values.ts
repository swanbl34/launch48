/**
 * Traduction FormData ↔ AnswerMap, pilotée par brief-schema.
 *
 * Les Server Actions reçoivent un FormData brut : ce module le normalise
 * selon le type déclaré de chaque champ, pour que form_answers.data reste
 * homogène (string / string[] / boolean) quoi qu'envoie le navigateur.
 */
import { fieldsForStep, isFileField, type BriefField } from './brief-schema';
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
 */
export function readStepAnswers(step: number, fd: FormData): AnswerMap {
  const out: AnswerMap = {};

  for (const field of fieldsForStep(step)) {
    if (isFileField(field)) continue; // les fichiers vivent dans `assets`
    const value = readField(field, fd);
    if (value === null && field.type === 'bool') continue; // pas affiché → pas écrasé
    out[field.key] = value;
  }

  return out;
}

/** Rendu lisible d'une réponse (fiche admin, écran de récap). */
export function displayValue(field: BriefField, value: AnswerValue | undefined): string {
  if (value === null || value === undefined || value === '') return '—';
  if (field.type === 'bool') return value === true ? 'Oui' : 'Non';
  if (Array.isArray(value)) return value.length ? value.join(', ') : '—';
  return String(value);
}

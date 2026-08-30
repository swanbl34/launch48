/**
 * Liens de dépôt de fichiers (Google Drive).
 *
 * Le client n'envoie pas ses livrables à travers l'app : les photos d'un
 * catalogue de 100 pièces se comptent en gigaoctets, très au-delà du bucket
 * Supabase et de la limite de corps des Server Actions. On ouvre donc un
 * dossier Drive et on y envoie le client.
 *
 * Le lien est saisi en admin — donc par une personne de confiance — mais il
 * est ensuite rendu comme un `href` cliquable dans l'espace client. Une faute
 * de frappe suffirait à produire un `javascript:` ou un `data:` : on n'accepte
 * que du `https:`, vérifié à l'écriture ET à l'affichage.
 */
import type { Project, Task } from './types';

/** Hôtes reconnus comme un dossier de dépôt Google. Informatif seulement. */
const GOOGLE_HOSTS = ['drive.google.com', 'docs.google.com'];

/**
 * Normalise une saisie admin. Retourne `null` si ce n'est pas une URL https
 * exploitable — l'appelant décide alors s'il refuse ou s'il efface le champ.
 */
export function normaliseDepositUrl(raw: string): string | null {
  const value = raw.trim();
  if (!value) return null;

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return null;
  }

  if (url.protocol !== 'https:') return null;
  return url.toString();
}

/**
 * Filtre d'affichage. Une URL stockée avant l'ajout de ce garde-fou, ou écrite
 * à la main en base, ne doit pas devenir un lien exécutable.
 */
export function safeDepositUrl(raw: string | null | undefined): string | null {
  if (!raw) return null;
  return normaliseDepositUrl(raw);
}

/** Est-ce bien un dossier Google Drive, et non un autre hébergeur ? */
export function isGoogleDrive(raw: string | null | undefined): boolean {
  const url = safeDepositUrl(raw);
  if (!url) return false;
  try {
    return GOOGLE_HOSTS.includes(new URL(url).hostname.toLowerCase());
  } catch {
    return false;
  }
}

/**
 * Où le client dépose les fichiers d'une tâche : son dossier dédié s'il en a
 * un, sinon le dossier commun du projet.
 */
export function depositUrlFor(
  task: Pick<Task, 'drive_url'>,
  project: Pick<Project, 'drive_url'>,
): string | null {
  return safeDepositUrl(task.drive_url) ?? safeDepositUrl(project.drive_url);
}

/** Libellé court du bouton, selon qu'on reconnaît Drive ou non. */
export function depositLabel(url: string | null): string {
  if (!url) return 'Déposer les fichiers';
  return isGoogleDrive(url) ? 'Déposer sur le Drive' : 'Déposer les fichiers';
}

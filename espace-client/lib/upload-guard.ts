/**
 * Contrôle des fichiers déposés dans le brief client.
 *
 * MODÈLE DE MENACE
 * L'espace client est ouvert à quiconque détient le token de l'URL. Deux abus
 * sont possibles, et aucun n'était couvert :
 *
 *   1. Type de fichier. Un `.svg` ou un `.html` déposé puis ouvert via son URL
 *      signée s'exécute sur le domaine `*.supabase.co` : SVG et HTML peuvent
 *      embarquer du JavaScript. Ça ne touche pas launch48.fr, mais c'est du XSS
 *      stocké chez notre hébergeur de fichiers, et le lien est partageable.
 *      → On n'accepte qu'une liste fermée de formats, et on vérifie l'extension
 *        ET le type déclaré : le type déclaré vient du client, il ne suffit pas.
 *
 *   2. Volume. Rien ne limitait le nombre de fichiers ni le total par projet :
 *      une boucle de 20 Mo remplit le bucket.
 *      → Plafond en nombre et en octets, vérifié avant chaque écriture.
 *
 * CE QUE ÇA NE FAIT PAS
 * Aucune inspection du contenu réel (nombres magiques) : un fichier renommé
 * `.png` passe. C'est acceptable ici parce que la protection qui compte est en
 * aval — le bucket est privé et servi en pièce jointe, jamais interprété comme
 * une page. La liste blanche sert à écarter ce qui n'a rien à faire dans un
 * brief, pas à garantir l'intégrité binaire.
 */

/** Extension → types MIME acceptés pour cette extension. */
const ALLOWED: Record<string, string[]> = {
  // Images
  '.png': ['image/png'],
  '.jpg': ['image/jpeg'],
  '.jpeg': ['image/jpeg'],
  '.webp': ['image/webp'],
  '.avif': ['image/avif'],
  '.gif': ['image/gif'],
  '.heic': ['image/heic', 'image/heif'],
  // Sources de logo. Le SVG est accepté — c'est le format que le brief
  // réclame — parce que le risque est neutralisé au service et non à l'entrée :
  // `signAssetUrl` force le téléchargement en pièce jointe, donc le XML n'est
  // jamais interprété par un navigateur. Voir lib/data.ts.
  '.svg': ['image/svg+xml', 'text/xml', 'application/xml'],
  '.ai': ['application/postscript', 'application/pdf', 'application/illustrator'],
  '.eps': ['application/postscript', 'application/eps', 'image/eps'],
  '.pdf': ['application/pdf'],
  // Documents de contenu
  '.doc': ['application/msword'],
  '.docx': ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  '.txt': ['text/plain'],
  '.md': ['text/markdown', 'text/plain'],
  '.rtf': ['application/rtf', 'text/rtf'],
  '.xls': ['application/vnd.ms-excel'],
  '.xlsx': ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
  '.csv': ['text/csv', 'application/vnd.ms-excel'],
  // Lots de visuels
  '.zip': ['application/zip', 'application/x-zip-compressed'],
};

/** Taille max par fichier. Doit rester ≤ bodySizeLimit de next.config.ts. */
export const MAX_FILE_BYTES = 20 * 1024 * 1024; // 20 Mo

/** Plafonds par projet, toutes questions confondues. */
export const MAX_FILES_PER_PROJECT = 60;
export const MAX_BYTES_PER_PROJECT = 400 * 1024 * 1024; // 400 Mo

/** Liste lisible, pour l'attribut `accept` et les messages d'erreur. */
export const ACCEPT_ATTRIBUTE = Object.keys(ALLOWED).join(',');

export type RejectionReason =
  | 'empty'
  | 'too-large'
  | 'extension'
  | 'mime'
  | 'project-file-limit'
  | 'project-size-limit';

export type FileVerdict =
  | { ok: true }
  | { ok: false; reason: RejectionReason };

const extensionOf = (name: string): string => {
  const dot = name.lastIndexOf('.');
  return dot === -1 ? '' : name.slice(dot).toLowerCase();
};

/**
 * Valide un fichier isolément : taille, extension, cohérence du type déclaré.
 *
 * Un type déclaré vide (certains navigateurs sur `.ai` ou `.eps`) n'est pas
 * rédhibitoire : l'extension a déjà été validée, et refuser bloquerait des
 * fichiers légitimes. En revanche un type déclaré qui contredit l'extension
 * est refusé — c'est le signe d'un renommage.
 */
export function checkFile(file: File): FileVerdict {
  if (file.size <= 0) return { ok: false, reason: 'empty' };
  if (file.size > MAX_FILE_BYTES) return { ok: false, reason: 'too-large' };

  const allowedTypes = ALLOWED[extensionOf(file.name)];
  if (!allowedTypes) return { ok: false, reason: 'extension' };

  const declared = (file.type || '').toLowerCase();
  if (declared && !allowedTypes.includes(declared)) return { ok: false, reason: 'mime' };

  return { ok: true };
}

/**
 * Vérifie qu'un fichier de plus tient dans les plafonds du projet.
 * `current` vient de la table `assets`, source de vérité du déjà-stocké.
 */
export function checkProjectQuota(
  current: { count: number; bytes: number },
  incomingBytes: number,
): FileVerdict {
  if (current.count + 1 > MAX_FILES_PER_PROJECT) {
    return { ok: false, reason: 'project-file-limit' };
  }
  if (current.bytes + incomingBytes > MAX_BYTES_PER_PROJECT) {
    return { ok: false, reason: 'project-size-limit' };
  }
  return { ok: true };
}

/**
 * Message affiché au client.
 *
 * Sans nom de fichier : les motifs de rejet transitent par l'URL après le
 * redirect (`?rejets=extension,too-large`), et y mettre les noms produirait des
 * URLs interminables. Le motif suffit à savoir quoi faire.
 */
export function rejectionMessage(reason: RejectionReason): string {
  switch (reason) {
    case 'empty':
      return 'Un fichier était vide.';
    case 'too-large':
      return 'Un fichier dépassait 20 Mo. Compresse-le, ou envoie un lien de téléchargement.';
    case 'extension':
    case 'mime':
      return "Un fichier n'était pas dans un format accepté (images, SVG, PDF, AI, EPS, documents Word ou Excel, ZIP). Si tu as un format exotique, envoie-le par email.";
    case 'project-file-limit':
      return `Limite de ${MAX_FILES_PER_PROJECT} fichiers atteinte pour ce projet. Supprimes-en avant d'en ajouter.`;
    case 'project-size-limit':
      return 'Volume total de 400 Mo atteint pour ce projet. Envoie le reste par lien de téléchargement.';
  }
}

/** Motifs valides, pour filtrer ce qui remonte de l'URL. */
const REASONS = new Set<RejectionReason>([
  'empty',
  'too-large',
  'extension',
  'mime',
  'project-file-limit',
  'project-size-limit',
]);

/** Relit le paramètre `?rejets=` en n'en gardant que les motifs connus. */
export function parseRejections(raw: string | undefined): RejectionReason[] {
  if (!raw) return [];
  const seen = new Set<RejectionReason>();
  for (const part of raw.split(',')) {
    const value = part.trim() as RejectionReason;
    if (REASONS.has(value)) seen.add(value);
  }
  return [...seen];
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * BRIQUES COMMUNES — ce qu'on redemande à presque tous les clients.
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Le socle légal, le logo, l'histoire de la marque, les tarifs de livraison :
 * d'un projet à l'autre, ce sont les mêmes demandes, aux mêmes moments, pour
 * les mêmes raisons. Les réécrire à chaque client, c'est perdre une demi-heure
 * et surtout perdre la formulation — celle qui explique *pourquoi* on demande,
 * et qui fait la différence entre une corvée et une décision comprise.
 *
 * Un lot client se compose donc par assemblage :
 *
 *   const TACHES = [
 *     ...SOCLE_LEGAL,
 *     ...ajuste(IDENTITE, { 'Le logo en fichier vectoriel': { milestone: 'ouverture' } }),
 *     ...sans(CATALOGUE, ['Valider les catégories']),
 *     ...mesPropresTaches,
 *   ];
 *
 * Les descriptions ici sont volontairement génériques : aucune ne nomme un
 * client, un produit ou un territoire. C'est `ajuste()` qui personnalise.
 */
import type { TaskTemplate } from '../task-templates';

/* ── Outils d'assemblage ──────────────────────────────────────────────────── */

/**
 * Remplace des champs sur les tâches dont l'intitulé correspond exactement.
 *
 * Lève si un intitulé visé n'existe pas. C'est voulu : une faute de frappe
 * dans une clé produirait sinon un lot où la personnalisation a disparu sans
 * rien signaler, et on ne s'en apercevrait que sur l'écran du client. Ici,
 * ça casse au build.
 */
export function ajuste(
  tasks: TaskTemplate[],
  patches: Record<string, Partial<TaskTemplate>>,
): TaskTemplate[] {
  const known = new Set(tasks.map((t) => t.label));
  for (const label of Object.keys(patches)) {
    if (!known.has(label)) {
      throw new Error(
        `ajuste() : aucune tâche nommée « ${label} » dans ce groupe. ` +
          `Intitulés disponibles : ${[...known].join(' | ')}`,
      );
    }
  }
  return tasks.map((t) => (patches[t.label] ? { ...t, ...patches[t.label] } : t));
}

/** Retire des tâches par intitulé. Lève aussi si un intitulé est inconnu. */
export function sans(tasks: TaskTemplate[], labels: string[]): TaskTemplate[] {
  const known = new Set(tasks.map((t) => t.label));
  for (const label of labels) {
    if (!known.has(label)) {
      throw new Error(`sans() : aucune tâche nommée « ${label} » dans ce groupe.`);
    }
  }
  const drop = new Set(labels);
  return tasks.filter((t) => !drop.has(t.label));
}

/* ═══════════════════════════════════════════════════════════════════════════
   CÔTÉ CLIENT
   ═══════════════════════════════════════════════════════════════════════════ */

/** Obligatoire dès qu'on vend en ligne. Bloque toujours l'ouverture. */
export const SOCLE_LEGAL: TaskTemplate[] = [
  {
    phase: 'legal',
    label: 'Mentions légales, conditions de vente, confidentialité, retours',
    owner: 'client',
    milestone: 'ouverture',
    description:
      "Obligatoires pour vendre en ligne. Les quatre pages existent avec leur mise en page ; elles attendent leur contenu. À faire relire par un professionnel — c'est le document qui fait foi en cas de litige.",
    deliverable: 'Les quatre textes, en document modifiable (Word, Google Docs ou texte brut).',
  },
  {
    phase: 'legal',
    label: "Raison sociale, numéro SIRET, adresse de l'entreprise",
    owner: 'client',
    milestone: 'ouverture',
    description:
      'Ces trois informations doivent figurer sur les mentions légales et sur chaque facture.',
    deliverable: "L'extrait Kbis ou l'avis de situation SIRENE.",
  },
  {
    phase: 'legal',
    label: "L'adresse e-mail de contact publique",
    owner: 'client',
    milestone: 'ouverture',
    description:
      "Tant qu'elle manque, les formulaires de contact restent inactifs — un visiteur qui veut écrire n'a nulle part où le faire.",
  },
];

/** Le minimum pour que le site ne soit pas générique. */
export const IDENTITE: TaskTemplate[] = [
  {
    phase: 'identite',
    label: 'Le logo en fichier vectoriel',
    owner: 'client',
    milestone: 'livraison',
    description:
      "En attendant, le nom s'affiche en texte dans l'en-tête. Un vectoriel reste net à toutes les tailles, du favicon à l'enseigne.",
    deliverable: 'Le logo en .svg, .ai ou .eps — pas un JPEG ni une capture d’écran.',
  },
  {
    phase: 'identite',
    label: 'La licence de la police de la charte',
    owner: 'client',
    milestone: 'livraison',
    description:
      "Les polices de marque sont presque toujours payantes, et la licence web se paye séparément de la licence print. En attendant, le site utilise une police libre très proche — c'est propre, mais ce n'est pas la charte exacte.",
    deliverable: "Les fichiers de police (woff2 de préférence) et la licence d'utilisation web.",
  },
];

/** La voix de la marque. Personne ne peut l'écrire à la place du client. */
export const TEXTES: TaskTemplate[] = [
  {
    phase: 'contenu',
    label: 'Votre histoire',
    owner: 'client',
    milestone: 'livraison',
    description:
      "Face à une marque que personne ne connaît encore, l'histoire de qui l'a créée et pourquoi est un argument que la concurrence n'a pas. Je n'ai pas voulu l'inventer : la page attend votre récit.",
    deliverable: 'Le texte de la page « Notre histoire », même brut, même dicté au téléphone.',
  },
  {
    phase: 'contenu',
    label: "La phrase d'accroche de l'accueil et la baseline",
    owner: 'client',
    milestone: 'livraison',
    description:
      'Les deux premières phrases que lit un visiteur. Ce sont les vôtres à écrire, pas les miennes.',
  },
  {
    phase: 'contenu',
    label: 'Relire les questions fréquentes',
    owner: 'client',
    milestone: 'livraison',
    description:
      "Les réponses sont écrites à partir des objections habituelles de votre métier. À relire : ce sont elles qui désamorcent les hésitations juste avant l'achat.",
  },
];

/** Les visuels d'ambiance, distincts des photos de produits. */
export const PHOTOS_AMBIANCE: TaskTemplate[] = [
  {
    phase: 'photos',
    label: 'Le shooting des visuels d’ambiance',
    owner: 'client',
    milestone: 'livraison',
    description:
      "Chaque emplacement vide s'affiche sur le site sous forme de cadre rayé décrivant la photo attendue — c'est, tel quel, le brief à donner au photographe. Tant qu'ils sont vides, l'accueil et les pages de contenu tiennent debout mais ne convainquent pas.",
    deliverable: 'Les photos en pleine résolution, non recadrées.',
  },
];

/** Le catalogue. Sans lui, une boutique en ligne a l'air abandonnée. */
export const CATALOGUE: TaskTemplate[] = [
  {
    phase: 'stock',
    label: 'Rassembler le stock de départ',
    owner: 'client',
    milestone: 'ouverture',
    description:
      "C'est le plus long, et c'est ce qui fixe la date d'ouverture — bien plus que le développement. Une boutique trop maigre donne l'impression d'être abandonnée, et les visiteurs ne reviennent pas.",
  },
  {
    phase: 'stock',
    label: 'Photographier chaque article',
    owner: 'client',
    milestone: 'ouverture',
    description:
      "Plusieurs angles. Le défaut compris quand il y en a un : le montrer fait vendre, le cacher génère des retours.",
    deliverable: 'Un dossier par article, plusieurs angles, sur fond neutre.',
  },
  {
    phase: 'contenu',
    label: 'Valider les catégories et sous-catégories',
    owner: 'client',
    milestone: 'livraison',
    description:
      "Le découpage proposé pilote les filtres, le menu et les pages de catégorie. À corriger librement, c'est une ligne à changer.",
  },
];

/** Tout ce sans quoi on ne peut pas encaisser une commande. */
export const LOGISTIQUE: TaskTemplate[] = [
  {
    phase: 'logistique',
    label: 'Les zones de livraison et les tarifs',
    owner: 'client',
    milestone: 'ouverture',
    description:
      "Nécessaires pour paramétrer les frais de port. Sans eux, le passage en caisse ne peut pas calculer de total — donc la boutique ne peut pas ouvrir.",
    deliverable: 'La grille tarifaire du transporteur et les formats de colis utilisés.',
  },
  {
    phase: 'logistique',
    label: 'La politique de retours',
    owner: 'client',
    milestone: 'ouverture',
    description:
      "Délai, qui paye le retour, dans quel état l'article doit revenir. C'est une mention obligatoire et le premier point que vérifie un acheteur méfiant.",
  },
  {
    phase: 'logistique',
    label: "Choisir l'outil d'e-mailing",
    owner: 'client',
    milestone: 'livraison',
    description:
      "Pour la newsletter et les alertes de réassort. En phase de lancement, chaque adresse collectée est une vente potentielle : c'est le seul canal qu'on possède vraiment, contrairement aux réseaux sociaux.",
  },
];

/* ═══════════════════════════════════════════════════════════════════════════
   MON CÔTÉ — la fin de projet, identique d'un client à l'autre.
   Affichée au client : elle lui montre à quoi passe le temps qu'il ne voit pas.
   ═══════════════════════════════════════════════════════════════════════════ */

export const MISE_EN_LIGNE: TaskTemplate[] = [
  {
    phase: 'mise_en_ligne',
    label: 'Héberger le site',
    owner: 'launch48',
    description:
      "Et remplacer l'adresse de travail par l'adresse définitive, sinon le plan du site et les liens de partage pointeraient vers mon ordinateur.",
  },
  {
    phase: 'mise_en_ligne',
    label: 'Acheter le domaine et le brancher',
    owner: 'launch48',
    description:
      "Sur l'hébergeur et sur la boutique, pour que le passage en caisse reste sur la même adresse. À faire une fois le nom de la marque tranché.",
  },
  {
    phase: 'mise_en_ligne',
    label: 'Habiller la page de paiement',
    owner: 'launch48',
    description:
      "Logo, couleurs, favicon. Sans ça, le visiteur a l'impression de changer de site au moment de sortir sa carte — c'est là qu'on perd des ventes.",
  },
  {
    phase: 'mise_en_ligne',
    label: 'Ouvrir la boutique au public',
    owner: 'launch48',
    description: "En dernier. C'est le geste qui ouvre officiellement.",
  },
];

export const RECETTE: TaskTemplate[] = [
  {
    phase: 'recette',
    label: 'Passer une vraie commande de bout en bout',
    owner: 'launch48',
    description:
      "Puis l'annuler. C'est le seul moyen de vérifier que tout ce qui est choisi au moment de commander remonte bien sur la commande.",
  },
  {
    phase: 'recette',
    label: 'Contrôler la vitesse et le confort de lecture',
    owner: 'launch48',
    description: "Sur téléphone en priorité : c'est là que se fera l'essentiel du trafic.",
  },
  {
    phase: 'recette',
    label: 'Déclarer le site à Google',
    owner: 'launch48',
    description:
      "Et soumettre le plan du site. Le référencement met des mois à s'installer : plus tôt il démarre, mieux c'est.",
  },
];

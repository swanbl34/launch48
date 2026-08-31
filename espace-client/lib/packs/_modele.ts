/**
 * ═══════════════════════════════════════════════════════════════════════════
 * MODÈLE DE LOT — à copier pour chaque nouveau client.
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *   1. cp lib/packs/_modele.ts lib/packs/<nom-du-client>.ts
 *   2. renomme la constante exportée
 *   3. déclare le lot dans lib/packs/index.ts
 *   4. admin → fiche projet → onglet Tâches → Importer un lot
 *
 * Ce fichier n'est enregistré nulle part : il ne sort pas dans l'admin tant
 * qu'on ne l'a pas ajouté à index.ts. On peut donc le laisser tel quel.
 *
 * ───────────────────────────────────────────────────────────────────────────
 * LES SIX RÈGLES D'ÉCRITURE
 * ───────────────────────────────────────────────────────────────────────────
 *
 * 1. UNE TÂCHE = UNE CHOSE QU'ON PEUT COCHER.
 *    « Préparer le contenu » ne se coche jamais. « Le texte de la page Notre
 *    histoire » se coche. Si une tâche reste rouge deux mois, c'est presque
 *    toujours qu'elle en contenait cinq.
 *
 * 2. LA DESCRIPTION DIT POURQUOI, PAS QUOI.
 *    L'intitulé dit déjà quoi. La description doit répondre à « qu'est-ce qui
 *    se passe si je ne le fais pas », et elle est lue telle quelle par le
 *    client. C'est le champ qui transforme une corvée en décision comprise —
 *    c'est aussi celui qu'on est tenté de bâcler.
 *
 * 3. `deliverable` DÉCLENCHE TOUTE LA MÉCANIQUE DE DÉPÔT.
 *    Rempli → bouton vers le dossier Drive, et la tâche passe par « à valider »
 *    au lieu d'être terminée sur parole. Vide → le client coche, c'est fini.
 *    Ne le remplis que si tu attends vraiment un fichier. Décrire le format
 *    attendu ici évite un aller-retour sur deux ("pas un JPEG", "non recadrée").
 *
 * 4. `milestone` EST UNE CONSÉQUENCE, PAS UNE PRIORITÉ.
 *      'ouverture' → sans ça, la boutique ne peut pas ouvrir. Rien d'autre.
 *      'livraison' → peut attendre les derniers jours, mais pas au-delà.
 *      absent      → quand tu peux.
 *    Si tout est 'ouverture', plus rien n'est urgent. Sur un lot de trente
 *    tâches, une dizaine de bloquants est le maximum crédible.
 *
 * 5. METS TES PROPRES TÂCHES DEDANS.
 *    Le tableau de bord a un bloc « ce sur quoi je travaille ». Sans tâches
 *    `owner: 'launch48'`, il est vide, et le client croit qu'il est seul à
 *    porter le projet. Les tâches déjà faites comptent double : elles
 *    remplissent « ce qui est déjà fait », qui est ce qui rassure.
 *
 * 6. RÉUTILISE `commun.ts` AVANT D'ÉCRIRE.
 *    Le socle légal, le logo, l'histoire, les tarifs de livraison sont les
 *    mêmes partout. `ajuste()` personnalise, `sans()` retire. Réécrire une
 *    brique commune, c'est perdre la formulation qui marchait.
 */
import type { TaskTemplate } from '../task-templates';
import {
  CATALOGUE,
  IDENTITE,
  LOGISTIQUE,
  MISE_EN_LIGNE,
  PHOTOS_AMBIANCE,
  RECETTE,
  SOCLE_LEGAL,
  TEXTES,
} from './commun';

/**
 * Ce qui est déjà livré au moment de l'envoi du lot.
 *
 * Sur un projet qui démarre, laisse le tableau vide. Sur un projet déjà bien
 * avancé — reprise, refonte, point d'étape à mi-parcours — c'est ce bloc qui
 * évite que le client ouvre son espace sur un 0 %.
 */
const ACQUIS: TaskTemplate[] = [
  // {
  //   phase: 'integration',
  //   label: 'Les pages vitrine',
  //   owner: 'launch48',
  //   status: 'done',
  //   description: 'Accueil, à propos, contact : mises en page complètes.',
  // },
];

/** Ce que ce client-là doit fournir, et que les briques communes ne couvrent pas. */
const SPECIFIQUE: TaskTemplate[] = [
  // {
  //   phase: 'stock',
  //   label: 'La liste des allergènes par plat',
  //   owner: 'client',
  //   milestone: 'ouverture',
  //   description:
  //     "Obligatoire à l'affichage. Sans elle, je ne peux pas publier la carte.",
  //   deliverable: 'Un tableau, une ligne par plat.',
  // },
];

/** Ma part, en plus de RECETTE et MISE_EN_LIGNE qui sont communes. */
const MON_COTE: TaskTemplate[] = [
  // {
  //   phase: 'boutique',
  //   label: 'Brancher le module de réservation',
  //   owner: 'launch48',
  //   description: 'Une fois le compte prestataire ouvert.',
  // },
];

/**
 * L'assemblage. L'ordre ici n'a aucune importance pour l'affichage : les
 * tâches sont rangées par phase à l'import, dans l'ordre de `PHASES`.
 * Il compte seulement pour la lisibilité de ce fichier.
 */
export const MODELE: TaskTemplate[] = [
  ...ACQUIS,
  ...SPECIFIQUE,

  ...SOCLE_LEGAL,
  ...IDENTITE,
  ...TEXTES,
  ...PHOTOS_AMBIANCE,
  ...CATALOGUE,
  ...LOGISTIQUE,

  // Exemples de personnalisation. Ajoute `ajuste, sans` à l'import ci-dessus
  // quand tu en as besoin :
  //
  //   ...ajuste(CATALOGUE, {
  //     'Rassembler le stock de départ': {
  //       label: 'Rassembler les 40 premières références',
  //       description: 'En dessous de 40, la boutique a l’air vide.',
  //     },
  //   }),
  //
  //   ...sans(LOGISTIQUE, ['La politique de retours']),

  ...MON_COTE,
  ...RECETTE,
  ...MISE_EN_LIGNE,
];

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * TASK TEMPLATES — les tâches créées automatiquement à l'ouverture d'un projet.
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Édite librement ce fichier : il n'est lu qu'au moment du seed (création du
 * projet en admin) et à l'import d'un lot. Modifier un template ne touche pas
 * les projets existants, qui restent éditables un par un depuis la fiche admin.
 *
 * owner: 'client'  → la tâche apparaît dans « Mes tâches » côté client, avec
 *                    son explication, son livrable et son bouton de dépôt.
 * owner: 'launch48'→ lecture seule côté client.
 *
 * Les lots prêts à l'emploi (contenus, stock, légal…) vivent dans
 * lib/task-packs.ts et s'importent dans un projet existant.
 */
import type { TaskMilestone, TaskStatus } from './types';

export type Phase = {
  /** Clé stockée dans tasks.phase. Immuable une fois en prod. */
  key: string;
  label: string;
};

/**
 * Les phases de la timeline, dans l'ordre d'affichage.
 *
 * Elles couvrent les deux moitiés du projet : ce qu'on construit, et ce que le
 * client rassemble. Aucune n'est imposée — `phaseViews()` ne montre que celles
 * où le projet a réellement des tâches, donc un projet vitrine sans stock ni
 * boutique n'en verra jamais la trace.
 */
export const PHASES: Phase[] = [
  { key: 'cadrage', label: 'Cadrage' },
  { key: 'identite', label: 'Identité de marque' },
  { key: 'design', label: 'Design' },
  { key: 'contenu', label: 'Contenus & textes' },
  { key: 'photos', label: 'Photographies' },
  { key: 'legal', label: 'Textes légaux' },
  { key: 'stock', label: 'Stock & fiches produits' },
  { key: 'logistique', label: 'Logistique & tarifs' },
  { key: 'integration', label: 'Intégration front' },
  { key: 'boutique', label: 'Connexion boutique' },
  { key: 'recette', label: 'Recette' },
  { key: 'mise_en_ligne', label: 'Mise en ligne' },
];

export const phaseLabel = (key: string) =>
  PHASES.find((p) => p.key === key)?.label ?? key;

/** Rang d'une phase, pour trier des tâches venant de phases différentes. */
export const phaseRank = (key: string) => {
  const i = PHASES.findIndex((p) => p.key === key);
  return i === -1 ? PHASES.length : i;
};

export type TaskTemplate = {
  phase: string;
  label: string;
  owner: 'launch48' | 'client';
  /** Le « pourquoi », écrit pour le client. */
  description?: string;
  /** Ce qu'on attend en retour. Absent = rien à fournir, juste à faire. */
  deliverable?: string;
  milestone?: TaskMilestone;
  /** Par défaut 'todo'. Sert aux lots d'acquis (tâches déjà livrées). */
  status?: TaskStatus;
};

export type Pack = 'light' | 'standard' | 'pousse';

export const PACKS: Pack[] = ['light', 'standard', 'pousse'];

/**
 * Template de référence : pack STANDARD.
 * Les deux autres packs en dérivent (voir plus bas) pour éviter la duplication.
 */
const STANDARD: TaskTemplate[] = [
  // Cadrage
  { phase: 'cadrage', label: 'Brief validé', owner: 'client' },
  { phase: 'cadrage', label: 'Accès Shopify', owner: 'client' },
  { phase: 'cadrage', label: 'Accès domaine', owner: 'client' },
  { phase: 'cadrage', label: 'Specs validées', owner: 'launch48' },

  // Design
  { phase: 'design', label: 'Direction graphique', owner: 'launch48' },
  { phase: 'design', label: 'Maquette home', owner: 'launch48' },
  { phase: 'design', label: 'Maquette page produit', owner: 'launch48' },
  { phase: 'design', label: 'Validation client', owner: 'client' },

  // Intégration front
  { phase: 'integration', label: 'Setup Next.js', owner: 'launch48' },
  { phase: 'integration', label: 'Home', owner: 'launch48' },
  { phase: 'integration', label: 'Pages vitrine', owner: 'launch48' },
  { phase: 'integration', label: 'Pages légales', owner: 'launch48' },
  { phase: 'integration', label: 'Responsive', owner: 'launch48' },

  // Connexion boutique
  { phase: 'boutique', label: 'Storefront API', owner: 'launch48' },
  { phase: 'boutique', label: 'Grille produits', owner: 'launch48' },
  { phase: 'boutique', label: 'Page produit + variantes', owner: 'launch48' },
  { phase: 'boutique', label: 'Panier', owner: 'launch48' },
  { phase: 'boutique', label: 'Redirect checkout', owner: 'launch48' },

  // Recette
  { phase: 'recette', label: 'Tests mobile', owner: 'launch48' },
  { phase: 'recette', label: "Tests parcours d'achat", owner: 'launch48' },
  { phase: 'recette', label: 'SEO technique', owner: 'launch48' },
  { phase: 'recette', label: 'Performance', owner: 'launch48' },
  { phase: 'recette', label: 'Retours client', owner: 'client' },

  // Mise en ligne
  { phase: 'mise_en_ligne', label: 'Domaine', owner: 'launch48' },
  { phase: 'mise_en_ligne', label: 'DNS', owner: 'launch48' },
  { phase: 'mise_en_ligne', label: 'Analytics', owner: 'launch48' },
  { phase: 'mise_en_ligne', label: 'Commande test', owner: 'launch48' },
  { phase: 'mise_en_ligne', label: 'Livraison', owner: 'launch48' },
];

/**
 * LIGHT — vitrine sans boutique : on retire la phase « Connexion boutique »
 * et tout ce qui touche au e-commerce.
 */
const LIGHT: TaskTemplate[] = STANDARD.filter(
  (t) =>
    t.phase !== 'boutique' &&
    !['Maquette page produit', 'Accès Shopify', "Tests parcours d'achat", 'Commande test'].includes(
      t.label,
    ),
);

/**
 * POUSSE — standard + les tâches d'accompagnement post-livraison.
 */
const POUSSE: TaskTemplate[] = [
  ...STANDARD,
  { phase: 'boutique', label: 'Filtres et recherche produits', owner: 'launch48' },
  { phase: 'recette', label: 'Tests navigateurs étendus', owner: 'launch48' },
  { phase: 'mise_en_ligne', label: 'Formation à la prise en main', owner: 'launch48' },
  { phase: 'mise_en_ligne', label: 'Fiche Google Business', owner: 'launch48' },
];

export const TASK_TEMPLATES: Record<Pack, TaskTemplate[]> = {
  light: LIGHT,
  standard: STANDARD,
  pousse: POUSSE,
};

/** Une ligne prête à insérer dans `tasks`. */
export type TaskRow = {
  project_id: string;
  phase: string;
  label: string;
  owner: 'launch48' | 'client';
  status: TaskStatus;
  order_index: number;
  description: string | null;
  deliverable: string | null;
  milestone: TaskMilestone | null;
  done_at: string | null;
};

/**
 * Sérialise des templates en lignes prêtes à insérer.
 *
 * Les tâches sont regroupées dans l'ordre des phases puis dans l'ordre de
 * déclaration, ce qui rend le tri en base trivial (order by order_index).
 * `startIndex` permet d'ajouter un lot derrière ce qui existe déjà.
 */
export function rowsFromTemplates(
  templates: TaskTemplate[],
  projectId: string,
  startIndex = 0,
): TaskRow[] {
  const ordered = PHASES.flatMap((p) => templates.filter((t) => t.phase === p.key));

  // Une tâche dont la phase n'existe pas dans PHASES serait silencieusement
  // perdue par le flatMap ci-dessus : on la remet en queue plutôt que de la
  // laisser disparaître.
  const orphans = templates.filter((t) => !PHASES.some((p) => p.key === t.phase));

  return [...ordered, ...orphans].map((t, i) => ({
    project_id: projectId,
    phase: t.phase,
    label: t.label,
    owner: t.owner,
    status: t.status ?? 'todo',
    // pas de 10 → insertion manuelle facile en admin
    order_index: startIndex + (i + 1) * 10,
    description: t.description ?? null,
    deliverable: t.deliverable ?? null,
    milestone: t.milestone ?? null,
    done_at: t.status === 'done' ? new Date().toISOString() : null,
  }));
}

/** Les tâches créées d'office à l'ouverture d'un projet. */
export function seedTasksForPack(pack: Pack, projectId: string): TaskRow[] {
  return rowsFromTemplates(TASK_TEMPLATES[pack] ?? STANDARD, projectId);
}

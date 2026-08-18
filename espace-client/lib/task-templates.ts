/**
 * ═══════════════════════════════════════════════════════════════════════════
 * TASK TEMPLATES — les tâches créées automatiquement à l'ouverture d'un projet.
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Édite librement ce fichier : il n'est lu qu'au moment du seed (création du
 * projet en admin). Modifier un template ne touche pas les projets existants,
 * qui restent éditables un par un depuis la fiche admin.
 *
 * owner: 'client'  → la tâche apparaît en cyan avec le badge « À toi » et le
 *                    client peut la cocher lui-même depuis son dashboard.
 * owner: 'launch48'→ lecture seule côté client.
 */

export type Phase = {
  /** Clé stockée dans tasks.phase. Immuable une fois en prod. */
  key: string;
  label: string;
};

/** Les 6 phases de la timeline, dans l'ordre d'affichage. */
export const PHASES: Phase[] = [
  { key: 'cadrage', label: 'Cadrage' },
  { key: 'design', label: 'Design' },
  { key: 'integration', label: 'Intégration front' },
  { key: 'boutique', label: 'Connexion boutique' },
  { key: 'recette', label: 'Recette' },
  { key: 'mise_en_ligne', label: 'Mise en ligne' },
];

export const phaseLabel = (key: string) =>
  PHASES.find((p) => p.key === key)?.label ?? key;

export type TaskTemplate = {
  phase: string;
  label: string;
  owner: 'launch48' | 'client';
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

/**
 * Sérialise un template en lignes prêtes à insérer.
 * `order_index` est global et suit l'ordre des phases puis l'ordre de
 * déclaration, ce qui rend le tri en base trivial (order by order_index).
 */
export function seedTasksForPack(pack: Pack, projectId: string) {
  const template = TASK_TEMPLATES[pack] ?? STANDARD;
  const byPhase = PHASES.flatMap((p) => template.filter((t) => t.phase === p.key));

  return byPhase.map((t, i) => ({
    project_id: projectId,
    phase: t.phase,
    label: t.label,
    owner: t.owner,
    status: 'todo' as const,
    order_index: (i + 1) * 10, // pas de 10 → insertion manuelle facile en admin
  }));
}

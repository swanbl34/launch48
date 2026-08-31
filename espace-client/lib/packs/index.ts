/**
 * ═══════════════════════════════════════════════════════════════════════════
 * LES LOTS — le catalogue de ce qu'on peut pousser dans un projet.
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Différence avec lib/task-templates.ts : un *pack* (light / standard /
 * pousse) est le squelette de production, créé une fois à l'ouverture du
 * projet. Un *lot* est un paquet de demandes qu'on envoie au client en cours
 * de route — le contenu, le stock, le légal — et qu'on importe quand il
 * devient pertinent, depuis l'onglet Tâches de la fiche admin.
 *
 * L'import est idempotent par intitulé : réimporter un lot n'ajoute que les
 * tâches absentes du projet. On peut donc enrichir un lot ici et le
 * réimporter sans créer de doublons.
 *
 * AJOUTER UN CLIENT
 *   1. cp lib/packs/_modele.ts lib/packs/<client>.ts
 *   2. écris-le en suivant les six règles en tête du modèle
 *   3. ajoute une entrée dans TASK_PACKS ci-dessous
 *
 * L'agent `nouveau-client` (.claude/agents/) fait les trois d'un coup à partir
 * de tes notes de rendez-vous.
 */
import type { TaskTemplate } from '../task-templates';
import { BOUTIQUE_SECONDE_MAIN } from './boutique-seconde-main';

export type TaskPack = {
  /** Clé stable, envoyée par le formulaire d'import. En kebab-case. */
  key: string;
  label: string;
  /** Ce que le lot contient, affiché avant l'import. */
  summary: string;
  tasks: TaskTemplate[];
};

export const TASK_PACKS: TaskPack[] = [
  {
    key: 'boutique-seconde-main',
    label: 'Boutique seconde main — puériculture, retrait en secteurs',
    summary:
      "Le point d'étape du 30 août 2026, en entier : les demandes à la cliente, ce qu'il me reste, et ce qui est déjà livré.",
    tasks: BOUTIQUE_SECONDE_MAIN,
  },
];

export const findPack = (key: string): TaskPack | undefined =>
  TASK_PACKS.find((p) => p.key === key);

export { ajuste, sans } from './commun';

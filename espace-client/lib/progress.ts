/** Avancement global et état des phases, dérivés des tâches. */
import { PHASES, phaseRank } from './task-templates';
import { MILESTONE_ORDER, type Task, type TaskStatus } from './types';

export type PhaseState = 'todo' | 'doing' | 'blocked' | 'review' | 'done';

export type PhaseView = {
  key: string;
  label: string;
  state: PhaseState;
  tasks: Task[];
  done: number;
  total: number;
};

/** % = tâches done / total. 0 si le projet n'a aucune tâche. */
export function globalProgress(tasks: Task[]): number {
  if (tasks.length === 0) return 0;
  const done = tasks.filter((t) => t.status === 'done').length;
  return Math.round((done / tasks.length) * 100);
}

/**
 * Le décompte complet, pour une barre de progression segmentée.
 *
 * Une seule valeur en pourcentage cache l'essentiel : elle ne dit pas si le
 * reste est déjà rendu et en attente de validation, en cours, ou pas commencé.
 * `review` en particulier mérite d'être visible — c'est du travail fait par le
 * client qui n'est simplement pas encore relu.
 */
export type TaskStats = {
  total: number;
  done: number;
  review: number;
  doing: number;
  blocked: number;
  todo: number;
  /** done / total */
  percent: number;
  /** (done + review) / total — la part « rendue », validation comprise. */
  percentSubmitted: number;
};

const countBy = (tasks: Task[], status: TaskStatus) =>
  tasks.filter((t) => t.status === status).length;

export function taskStats(tasks: Task[]): TaskStats {
  const total = tasks.length;
  const done = countBy(tasks, 'done');
  const review = countBy(tasks, 'review');
  const pct = (n: number) => (total === 0 ? 0 : Math.round((n / total) * 100));

  return {
    total,
    done,
    review,
    doing: countBy(tasks, 'doing'),
    blocked: countBy(tasks, 'blocked'),
    todo: countBy(tasks, 'todo'),
    percent: pct(done),
    percentSubmitted: pct(done + review),
  };
}

/**
 * Ce qui reste dans le camp du client — la seule vue qui l'intéresse vraiment.
 *
 * `open` compte ce qu'il lui reste à faire : les tâches rendues (`review`) n'y
 * sont pas, sinon on lui redemanderait éternellement du travail déjà livré.
 */
export type ClientLoad = {
  all: Task[];
  open: Task[];
  submitted: Task[];
  done: Task[];
  /** Les tâches ouvertes qui bloquent l'ouverture. */
  blocking: Task[];
  /** Les tâches ouvertes dont l'échéance est passée. */
  overdue: Task[];
  /** La prochaine échéance datée, s'il y en a une. */
  nextDue: Task | null;
  stats: TaskStats;
};

/** Comparateur d'affichage : jalon d'abord, puis phase, puis ordre manuel. */
export function compareTasks(a: Task, b: Task): number {
  const byMilestone =
    MILESTONE_ORDER[a.milestone ?? 'aucun'] - MILESTONE_ORDER[b.milestone ?? 'aucun'];
  if (byMilestone !== 0) return byMilestone;

  const byPhase = phaseRank(a.phase) - phaseRank(b.phase);
  if (byPhase !== 0) return byPhase;

  return a.order_index - b.order_index;
}

export function clientLoad(tasks: Task[], now = new Date()): ClientLoad {
  const all = tasks.filter((t) => t.owner === 'client').sort(compareTasks);

  const open = all.filter((t) => t.status !== 'done' && t.status !== 'review');
  const today = now.toISOString().slice(0, 10);

  const dated = open
    .filter((t) => !!t.due_date)
    .sort((a, b) => (a.due_date! < b.due_date! ? -1 : 1));

  return {
    all,
    open,
    submitted: all.filter((t) => t.status === 'review'),
    done: all.filter((t) => t.status === 'done'),
    blocking: open.filter((t) => t.milestone === 'ouverture'),
    overdue: dated.filter((t) => t.due_date! < today),
    nextDue: dated.find((t) => t.due_date! >= today) ?? null,
    stats: taskStats(all),
  };
}

/**
 * Une phase est :
 *   done    si toutes ses tâches sont done
 *   blocked si au moins une est blocked (prioritaire, c'est ce qui doit
 *           sauter aux yeux)
 *   review  si tout ce qui n'est pas fini est rendu et attend notre validation
 *   doing   si au moins une est en cours, ou si elle est entamée sans être finie
 *   todo    sinon
 */
export function phaseViews(tasks: Task[]): PhaseView[] {
  // On n'affiche que les phases réellement présentes : le pack light n'a
  // pas de phase « Connexion boutique ».
  return PHASES.filter((p) => tasks.some((t) => t.phase === p.key)).map((p) => {
    const phaseTasks = tasks.filter((t) => t.phase === p.key);
    const done = phaseTasks.filter((t) => t.status === 'done').length;
    const review = phaseTasks.filter((t) => t.status === 'review').length;

    let state: PhaseState = 'todo';
    if (done === phaseTasks.length) state = 'done';
    else if (phaseTasks.some((t) => t.status === 'blocked')) state = 'blocked';
    else if (done + review === phaseTasks.length) state = 'review';
    else if (phaseTasks.some((t) => t.status === 'doing') || done > 0 || review > 0) state = 'doing';

    return { key: p.key, label: p.label, state, tasks: phaseTasks, done, total: phaseTasks.length };
  });
}

/** Phase ouverte par défaut dans l'accordéon : la 1re non terminée. */
export function currentPhaseKey(views: PhaseView[]): string | null {
  return views.find((v) => v.state !== 'done')?.key ?? views.at(-1)?.key ?? null;
}

/**
 * Dernier signe de vie du projet, tous horodatages confondus.
 * Sert la ligne « Dernière mise à jour » du dashboard : sans elle, un client
 * qui revient ne sait pas si quelque chose a bougé depuis sa dernière visite.
 */
export function lastActivity(tasks: Task[]): string | null {
  const stamps = tasks
    .flatMap((t) => [t.done_at, t.submitted_at])
    .filter((v): v is string => !!v)
    .sort();
  return stamps.at(-1) ?? null;
}

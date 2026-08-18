/** Avancement global et état des phases, dérivés des tâches. */
import { PHASES } from './task-templates';
import type { Task } from './types';

export type PhaseState = 'todo' | 'doing' | 'blocked' | 'done';

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
 * Une phase est :
 *   done    si toutes ses tâches sont done
 *   blocked si au moins une est blocked (prioritaire sur doing, c'est ce qui
 *           doit sauter aux yeux)
 *   doing   si au moins une est doing, ou si elle est entamée sans être finie
 *   todo    sinon
 */
export function phaseViews(tasks: Task[]): PhaseView[] {
  // On n'affiche que les phases réellement présentes : le pack light n'a
  // pas de phase « Connexion boutique ».
  return PHASES.filter((p) => tasks.some((t) => t.phase === p.key)).map((p) => {
    const phaseTasks = tasks.filter((t) => t.phase === p.key);
    const done = phaseTasks.filter((t) => t.status === 'done').length;

    let state: PhaseState = 'todo';
    if (done === phaseTasks.length) state = 'done';
    else if (phaseTasks.some((t) => t.status === 'blocked')) state = 'blocked';
    else if (phaseTasks.some((t) => t.status === 'doing') || done > 0) state = 'doing';

    return { key: p.key, label: p.label, state, tasks: phaseTasks, done, total: phaseTasks.length };
  });
}

/** Phase ouverte par défaut dans l'accordéon : la 1re non terminée. */
export function currentPhaseKey(views: PhaseView[]): string | null {
  return views.find((v) => v.state !== 'done')?.key ?? views.at(-1)?.key ?? null;
}

import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

import { AdminTaskRow } from '@/app/admin/_components';
import { isAdmin } from '@/lib/auth';
import { getProjectById, getTasks } from '@/lib/data';
import { phaseViews } from '@/lib/progress';
import { PHASES } from '@/lib/task-templates';
import { addTask } from '../../../actions';

export const metadata: Metadata = { robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

/** Onglet « Tâches » : édition, réordonnancement, ajout. */
export default async function TachesPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ e?: string }>;
}) {
  if (!(await isAdmin())) notFound();

  const { id } = await params;
  const sp = await searchParams;

  const project = await getProjectById(id);
  if (!project) notFound();

  const tasks = await getTasks(project.id);
  const phases = phaseViews(tasks);

  return (
    <div className="stack--lg">
      {sp.e === 'demo' ? (
        <div className="banner banner--error">
          Mode démo (DEMO_MODE=1) : lecture seule, aucune écriture n&apos;est enregistrée.
        </div>
      ) : null}

      <section className="stack" style={{ gap: '0.5rem' }}>
        {phases.map((p) => (
          <details className="accordion" key={p.key} open>
            <summary>
              <span className={`dot dot--${p.state}`} aria-hidden />
              {p.label}
              <span className="accordion__count">
                {p.done}/{p.total}
              </span>
            </summary>
            <div className="accordion__body">
              {p.tasks.map((t) => (
                <AdminTaskRow key={t.id} task={t} projectId={project.id} />
              ))}
            </div>
          </details>
        ))}

        {phases.length === 0 ? (
          <div className="card">
            <p className="small muted">Aucune tâche. Ajoute-en une ci-dessous.</p>
          </div>
        ) : null}
      </section>

      <section className="card stack" style={{ gap: '0.7rem' }}>
        <h2>Ajouter une tâche</h2>
        <form action={addTask} className="row" style={{ gap: '0.4rem', alignItems: 'flex-end' }}>
          <input type="hidden" name="projectId" value={project.id} />
          <div className="field" style={{ flex: '2 1 14rem' }}>
            <label className="field__label tiny" htmlFor="new-label">
              Intitulé
            </label>
            <input id="new-label" name="label" type="text" required placeholder="Ce qu'il y a à faire" />
          </div>
          <div className="field" style={{ flex: '1 1 10rem' }}>
            <label className="field__label tiny" htmlFor="new-phase">
              Phase
            </label>
            <select id="new-phase" name="phase" defaultValue={PHASES[0].key}>
              {PHASES.map((ph) => (
                <option key={ph.key} value={ph.key}>
                  {ph.label}
                </option>
              ))}
            </select>
          </div>
          <div className="field" style={{ flex: '0 1 9rem' }}>
            <label className="field__label tiny" htmlFor="new-owner">
              Porteur
            </label>
            <select id="new-owner" name="owner" defaultValue="launch48">
              <option value="launch48">Launch48</option>
              <option value="client">Client</option>
            </select>
          </div>
          <button className="btn btn--small" type="submit">
            Ajouter
          </button>
        </form>
      </section>
    </div>
  );
}

import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';

import { AppBar } from '@/app/_components/AppBar';
import { Bar } from '@/app/_components/Bar';
import { getAssets, getFormAnswers, getProjectByToken, getTasks } from '@/lib/data';
import { formatDate } from '@/lib/format';
import { computeMissing } from '@/lib/missing';
import { currentPhaseKey, globalProgress, phaseViews } from '@/lib/progress';
import { phaseLabel } from '@/lib/task-templates';
import { STATUS_LABELS, TASK_STATUS_LABELS, isOnboarding, type Task } from '@/lib/types';
import { toggleClientTask } from '../actions';

export const metadata: Metadata = { robots: { index: false, follow: false } };

/** Toujours frais : le client doit voir l'avancement en temps réel. */
export const dynamic = 'force-dynamic';

const CALENDAR_URL = 'https://calendar.app.google/WzzdX11aNdR3DaMm8';
const CONTACT_EMAIL = 'contact@launch48.fr';

export default async function DashboardPage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ brief?: string }>;
}) {
  const { token } = await params;
  const { brief } = await searchParams;

  const project = await getProjectByToken(token);
  if (!project) notFound();

  const [answers, assets, tasks] = await Promise.all([
    getFormAnswers(project.id),
    getAssets(project.id),
    getTasks(project.id),
  ]);

  const { blocking, deferred, other } = computeMissing(answers.data, assets, tasks);
  const totalMissing = blocking.length + other.length;
  // Phase 1 : le suivi n'est pas encore ouvert au client.
  if (isOnboarding(project.status)) redirect(`/espace/${token}`);
  const progress = globalProgress(tasks);
  const phases = phaseViews(tasks);
  const openPhase = currentPhaseKey(phases);

  return (
    <main className="shell stack--lg">
      {/* 1 ── Header ─────────────────────────────────────────────────────── */}
      <AppBar
        brandHref={`/espace/${token}`}
        title={project.company}
        meta={
          <>
            <span className="pill pill--accent">{project.pack}</span>
            <span className="pill">{STATUS_LABELS[project.status]}</span>
          </>
        }
        active={`/espace/${token}/suivi`}
        tabs={[
          { href: `/espace/${token}/suivi`, label: 'Suivi' },
          {
            href: `/espace/${token}/brief`,
            label: 'Mon brief',
            badge: blocking.length,
            tone: 'danger',
          },
        ]}
      />

      <div className="stack" style={{ gap: '0.5rem' }}>
        <h1>{project.company}</h1>
        <p className="muted small">
          Livraison estimée&nbsp;: <strong>{formatDate(project.delivery_date)}</strong>
          {project.kickoff_date ? <> · Démarrage {formatDate(project.kickoff_date)}</> : null}
        </p>
      </div>

      {brief === 'valide' ? (
        <div className="banner">
          <span aria-hidden>✓</span> Brief validé, merci. On enchaîne sur le cadrage.
        </div>
      ) : null}

      {/* 2 ── Avancement ─────────────────────────────────────────────────── */}
      <section className="stack" style={{ gap: '0.5rem' }}>
          <div className="row row--between">
            <span className="section-title">Avancement</span>
            <strong className="small">{progress}%</strong>
          </div>
          <Bar value={progress} thin />
        <p className="tiny muted">
          {tasks.filter((t) => t.status === 'done').length} tâches terminées sur {tasks.length}
        </p>
      </section>

      {/* 3 ── Éléments manquants ─────────────────────────────────────────── */}
      <section
        className={totalMissing === 0 ? 'card card--ok stack' : 'card card--danger stack'}
        style={{ gap: '0.75rem' }}
      >
        {totalMissing === 0 ? (
          <>
            <h2 style={{ color: 'var(--accent-3)' }}>Tout est complet</h2>
            <p className="small muted">
              On a tout ce qu&apos;il faut de ton côté. Production en cours.
            </p>
          </>
        ) : (
          <>
            <div className="row row--between">
              <h2>Éléments manquants</h2>
              <span className="pill pill--danger">{totalMissing}</span>
            </div>
            <p className="small muted">
              C&apos;est ce qui nous manque pour avancer. Le reste est de notre côté.
            </p>

            <ul className="missing-list">
              {blocking.map((item) => (
                <li key={item.id}>
                  <a
                    className="missing-item missing-item--blocking"
                    href={`/espace/${token}/brief?step=${item.step}&focus=${item.focus}`}
                  >
                    <span className="dot dot--blocked" aria-hidden />
                    <span>{item.label}</span>
                    <span className="missing-item__arrow" aria-hidden>
                      →
                    </span>
                  </a>
                </li>
              ))}

              {other.map((item) => (
                <li key={item.id} className="missing-item">
                  <span className="dot dot--blocked" aria-hidden />
                  <span>{item.label}</span>
                  <span className="pill tiny" style={{ marginLeft: 'auto' }}>
                    {phaseLabel(item.phase ?? '')}
                  </span>
                </li>
              ))}
            </ul>

            <a className="btn btn--small" href={`/espace/${token}/brief`}>
              Compléter mon brief
            </a>
          </>
        )}
      </section>

      {deferred.length > 0 ? (
        <section className="card stack" style={{ gap: '0.6rem' }}>
          <div className="row row--between">
            <span className="section-title">À préciser plus tard</span>
            <span className="pill pill--warn tiny">{deferred.length}</span>
          </div>
          <p className="small muted">
            Tu nous as dit ne pas encore avoir ces éléments. Rien ne bloque, on te les
            redemandera au bon moment.
          </p>
          <ul className="missing-list">
            {deferred.map((item) => (
              <li key={item.id}>
                <a
                  className="missing-item missing-item--deferred"
                  href={`/espace/${token}/brief?step=${item.step}&focus=${item.focus}`}
                >
                  <span className="dot dot--todo" aria-hidden />
                  <span>{item.label}</span>
                  <span className="missing-item__arrow" aria-hidden>
                    →
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* 4 ── Timeline de production ─────────────────────────────────────── */}
      {/* Masquées pendant l'onboarding : le client n'a pas à voir un plan de
          production qui n'a pas commencé. */}
      <section className="card stack" style={{ gap: '0.6rem' }}>
        <h2>Production</h2>
        <div className="timeline">
          {phases.map((p) => (
            <div className="timeline__item" key={p.key} data-state={p.state}>
              <span className={`dot dot--${p.state}`} aria-hidden />
              <span className="timeline__label">{p.label}</span>
              <span className="tiny muted">
                {p.done}/{p.total}
              </span>
            </div>
          ))}
          {phases.length === 0 ? (
            <p className="small muted">Les étapes apparaîtront au démarrage du projet.</p>
          ) : null}
        </div>
      </section>

      {/* 5 ── Tâches par phase ───────────────────────────────────────────── */}
      <section className="stack" style={{ gap: '0.5rem' }}>
        <span className="section-title">Le détail</span>
        {phases.map((p) => (
          <details className="accordion" key={p.key} open={p.key === openPhase}>
            <summary>
              <span className={`dot dot--${p.state}`} aria-hidden />
              {p.label}
              <span className="accordion__count">
                {p.done}/{p.total}
              </span>
            </summary>
            <div className="accordion__body">
              {p.tasks.map((task) => (
                <TaskRow key={task.id} task={task} token={token} />
              ))}
            </div>
          </details>
        ))}
      </section>

      {/* 6 ── Contact ────────────────────────────────────────────────────── */}
      <section className="card card--accent stack" style={{ gap: '0.7rem' }}>
        <h2>Une question ?</h2>
        <p className="small muted">
          Réponse dans la journée. Pour tout ce qui se règle mieux à l&apos;oral, prends 15 minutes.
        </p>
        <div className="row">
          <a className="btn btn--small" href={CALENDAR_URL} target="_blank" rel="noreferrer">
            Réserver un créneau
          </a>
          <a className="btn btn--ghost btn--small" href={`mailto:${CONTACT_EMAIL}`}>
            {CONTACT_EMAIL}
          </a>
        </div>
      </section>

      <p className="tiny muted center">
        Ce lien t&apos;est personnel. Ne le partage qu&apos;avec ton équipe.
      </p>
    </main>
  );
}

/**
 * Une ligne de tâche. Les tâches `owner = client` sont cochables : un petit
 * formulaire POST par ligne, aucun JS nécessaire.
 */
function TaskRow({ task, token }: { task: Task; token: string }) {
  const isClient = task.owner === 'client';

  return (
    <div className="task" data-status={task.status}>
      {isClient ? (
        <form action={toggleClientTask} style={{ display: 'contents' }}>
          <input type="hidden" name="token" value={token} />
          <input type="hidden" name="taskId" value={task.id} />
          <button
            type="submit"
            className="btn btn--ghost btn--small"
            style={{ padding: '0.2rem 0.55rem', minWidth: '2rem' }}
            aria-label={
              task.status === 'done'
                ? `Décocher : ${task.label}`
                : `Marquer comme fait : ${task.label}`
            }
          >
            {task.status === 'done' ? '✓' : '○'}
          </button>
          <span className="task__label">{task.label}</span>
          <span className="pill pill--client tiny">À toi</span>
        </form>
      ) : (
        <>
          <span className={`dot dot--${task.status}`} aria-hidden />
          <span className="task__label">{task.label}</span>
          <span className="pill tiny muted">Launch48</span>
        </>
      )}
      {task.status === 'blocked' ? (
        <span className="pill pill--danger tiny">{TASK_STATUS_LABELS.blocked}</span>
      ) : null}
    </div>
  );
}

import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';

import { AppBar } from '@/app/_components/AppBar';
import { Bar, SegmentedBar } from '@/app/_components/Bar';
import { getAssets, getFormAnswers, getProjectByToken, getTasks } from '@/lib/data';
import { formatDate, formatDateTime } from '@/lib/format';
import { computeMissing } from '@/lib/missing';
import {
  clientLoad,
  currentPhaseKey,
  lastActivity,
  phaseViews,
  taskStats,
} from '@/lib/progress';
import { phaseLabel } from '@/lib/task-templates';
import { STATUS_LABELS, TASK_STATUS_LABELS, isOnboarding, type Task } from '@/lib/types';
import { TaskCard } from '../_TaskCard';
import { clientTabs } from '../_tabs';

export const metadata: Metadata = { robots: { index: false, follow: false } };

/** Toujours frais : le client doit voir l'avancement en temps réel. */
export const dynamic = 'force-dynamic';

const CALENDAR_URL = 'https://calendar.app.google/WzzdX11aNdR3DaMm8';
const CONTACT_EMAIL = 'contact@launch48.fr';

/** Combien de tâches en attente on montre ici avant de renvoyer vers la liste. */
const PREVIEW_COUNT = 3;

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

  // Phase 1 : le suivi n'est pas encore ouvert au client.
  if (isOnboarding(project.status)) redirect(`/espace/${token}`);

  const [answers, assets, tasks] = await Promise.all([
    getFormAnswers(project.id),
    getAssets(project.id),
    getTasks(project.id),
  ]);

  const { blocking, deferred, other } = computeMissing(answers.data, assets, tasks);
  const totalMissing = blocking.length + other.length;

  const stats = taskStats(tasks);
  const load = clientLoad(tasks);
  const ours = taskStats(tasks.filter((t) => t.owner === 'launch48'));
  const phases = phaseViews(tasks);
  const openPhase = currentPhaseKey(phases);
  const activity = lastActivity(tasks);

  // La priorité affichée en tête : ce qui bloque d'abord, le reste ensuite.
  const spotlight = [...load.blocking, ...load.open.filter((t) => t.milestone !== 'ouverture')];

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
        tabs={clientTabs(token, { tasks: load.open.length, brief: blocking.length })}
      />

      <div className="stack" style={{ gap: '0.5rem' }}>
        <h1>{project.company}</h1>
        <p className="muted small">
          Livraison estimée&nbsp;: <strong>{formatDate(project.delivery_date)}</strong>
          {project.kickoff_date ? <> · Démarrage {formatDate(project.kickoff_date)}</> : null}
          {activity ? <> · Dernier mouvement {formatDateTime(activity)}</> : null}
        </p>
      </div>

      {brief === 'valide' ? (
        <div className="banner">
          <span aria-hidden>✓</span> Brief validé, merci. On enchaîne sur le cadrage.
        </div>
      ) : null}

      {/* 2 ── Avancement ─────────────────────────────────────────────────── */}
      <section className="card stack progress-hero" style={{ gap: '0.9rem' }}>
        <div className="row row--between">
          <span className="section-title">Avancement</span>
          <span className="progress-hero__figure">
            {stats.percent}
            <span className="progress-hero__unit">%</span>
          </span>
        </div>

        <SegmentedBar done={stats.percent} submitted={stats.percentSubmitted} />

        <div className="statgrid">
          <Stat value={stats.done} label="terminées" tone="ok" />
          <Stat value={stats.review} label="à valider" tone="accent" />
          <Stat value={stats.doing} label="en cours" tone="accent" />
          <Stat value={stats.blocked} label="bloquées" tone="danger" />
        </div>

        {/* Qui porte quoi. C'est la question que se pose vraiment un client
            devant une barre de progression : « est-ce que ça attend après
            moi ? ». La réponse mérite mieux qu'une déduction. */}
        <div className="split">
          <div className="split__side">
            <div className="row row--between">
              <span className="small">Notre part</span>
              <span className="tiny muted">
                {ours.done}/{ours.total}
              </span>
            </div>
            <Bar value={ours.percent} thin />
          </div>
          <div className="split__side">
            <div className="row row--between">
              <span className="small">Ta part</span>
              <span className="tiny muted">
                {load.stats.done}/{load.stats.total}
              </span>
            </div>
            <SegmentedBar
              done={load.stats.percent}
              submitted={load.stats.percentSubmitted}
              thin
            />
          </div>
        </div>
      </section>

      {/* 3 ── Ce qu'on attend de toi ─────────────────────────────────────── */}
      {load.open.length > 0 ? (
        <section className="stack" style={{ gap: '0.7rem' }}>
          <div className="row row--between">
            <span className="section-title">Ce qu&apos;on attend de toi</span>
            <span
              className={load.blocking.length > 0 ? 'pill pill--danger tiny' : 'pill pill--warn tiny'}
            >
              {load.open.length}
            </span>
          </div>

          {load.blocking.length > 0 ? (
            <p className="small muted" style={{ marginTop: '-0.35rem' }}>
              {load.blocking.length} de ces point{load.blocking.length > 1 ? 's' : ''} bloque
              {load.blocking.length > 1 ? 'nt' : ''} l&apos;ouverture. Le reste peut attendre les
              derniers jours.
            </p>
          ) : null}

          {load.overdue.length > 0 ? (
            <div className="banner banner--error">
              <span aria-hidden>!</span> {load.overdue.length} tâche
              {load.overdue.length > 1 ? 's ont' : ' a'} dépassé leur échéance.
            </div>
          ) : null}

          <div className="tcards">
            {spotlight.slice(0, PREVIEW_COUNT).map((task) => (
              <TaskCard key={task.id} task={task} project={project} token={token} back="suivi" />
            ))}
          </div>

          {load.open.length > PREVIEW_COUNT ? (
            <div>
              <a className="btn btn--ghost btn--small" href={`/espace/${token}/taches`}>
                Voir les {load.open.length} tâches →
              </a>
            </div>
          ) : null}
        </section>
      ) : null}

      {load.submitted.length > 0 ? (
        <div className="banner">
          <span aria-hidden>◔</span> {load.submitted.length} élément
          {load.submitted.length > 1 ? 's' : ''} que tu as rendu
          {load.submitted.length > 1 ? 's' : ''} {load.submitted.length > 1 ? 'sont' : 'est'} en
          cours de vérification chez nous.{' '}
          <a href={`/espace/${token}/taches`}>Voir le détail</a>
        </div>
      ) : null}

      {/* 4 ── Éléments manquants du brief ────────────────────────────────── */}
      <section
        className={totalMissing === 0 ? 'card card--ok stack' : 'card card--danger stack'}
        style={{ gap: '0.75rem' }}
      >
        {totalMissing === 0 ? (
          <>
            <h2 style={{ color: 'var(--accent-3)' }}>Ton brief est complet</h2>
            <p className="small muted">
              On a toutes les réponses du questionnaire. Ce qui reste passe par tes tâches.
            </p>
          </>
        ) : (
          <>
            <div className="row row--between">
              <h2>Il manque dans ton brief</h2>
              <span className="pill pill--danger">{totalMissing}</span>
            </div>
            <p className="small muted">
              Des réponses du questionnaire qu&apos;on n&apos;a pas encore.
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

            <div>
              <a className="btn btn--small" href={`/espace/${token}/brief`}>
                Compléter mon brief
              </a>
            </div>
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

      {/* 5 ── Timeline de production ─────────────────────────────────────── */}
      <section className="card stack" style={{ gap: '0.6rem' }}>
        <h2>Les étapes</h2>
        <div className="timeline">
          {phases.map((p) => (
            <div className="timeline__item" key={p.key} data-state={p.state}>
              <span className={`dot dot--${p.state}`} aria-hidden />
              <span className="timeline__label">{p.label}</span>
              <span className="timeline__bar" aria-hidden>
                <Bar value={p.total === 0 ? 0 : (p.done / p.total) * 100} thin />
              </span>
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

      {/* 6 ── Tâches par phase ───────────────────────────────────────────── */}
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

      {/* 7 ── Contact ────────────────────────────────────────────────────── */}
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

function Stat({
  value,
  label,
  tone,
}: {
  value: number;
  label: string;
  tone: 'ok' | 'accent' | 'danger';
}) {
  return (
    <div className="stat" data-tone={value > 0 ? tone : 'none'}>
      <span className="stat__value">{value}</span>
      <span className="stat__label">{label}</span>
    </div>
  );
}

/**
 * Une ligne de tâche dans le détail par phase — lecture seule.
 * Les tâches du client renvoient vers « Mes tâches », où elles sont
 * actionnables avec leur contexte complet.
 */
function TaskRow({ task, token }: { task: Task; token: string }) {
  const isClient = task.owner === 'client';

  return (
    <div className="task" data-status={task.status}>
      <span className={`dot dot--${task.status}`} aria-hidden />
      {isClient ? (
        <a className="task__label" href={`/espace/${token}/taches#tache-${task.id}`}>
          {task.label}
        </a>
      ) : (
        <span className="task__label">{task.label}</span>
      )}

      {isClient ? (
        <span className="pill pill--client tiny">À toi</span>
      ) : (
        <span className="pill tiny muted">Launch48</span>
      )}

      {task.status === 'review' ? (
        <span className="pill pill--accent tiny">{TASK_STATUS_LABELS.review}</span>
      ) : null}
      {task.status === 'blocked' ? (
        <span className="pill pill--danger tiny">{TASK_STATUS_LABELS.blocked}</span>
      ) : null}
    </div>
  );
}

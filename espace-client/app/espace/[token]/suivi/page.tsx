import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';

import { AppBar } from '@/app/_components/AppBar';
import { PhaseIcon } from '@/app/_components/PhaseIcon';
import { Ring } from '@/app/_components/Ring';
import { getAssets, getFormAnswers, getProjectByToken, getTasks } from '@/lib/data';
import { formatDate } from '@/lib/format';
import { computeMissing } from '@/lib/missing';
import {
  clientLoad,
  groupByPhase,
  lastActivity,
  ourLoad,
  taskStats,
  type SideLoad,
} from '@/lib/progress';
import { CLIENT_STATUS_LABELS, type Task } from '@/lib/types';
import { TaskCard } from '../_TaskCard';
import { clientTabs } from '../_tabs';

export const metadata: Metadata = { robots: { index: false, follow: false } };

/** Toujours frais : le client doit voir l'avancement en temps réel. */
export const dynamic = 'force-dynamic';

const CALENDAR_URL = 'https://calendar.app.google/WzzdX11aNdR3DaMm8';
const CONTACT_EMAIL = 'contact@launch48.fr';

/**
 * Le tableau de bord client.
 *
 * Trois blocs, dans cet ordre, et rien d'autre :
 *   1. ce que j'attends de toi   — la seule partie où elle agit
 *   2. ce sur quoi je travaille  — la preuve que ça avance sans elle
 *   3. ce qui est déjà fait      — l'acquis, qui rassure et qui donne l'élan
 *
 * Ce qui a été retiré compte autant que ce qui a été ajouté : le pack, le
 * statut interne du projet, les pourcentages en cascade et les intitulés de
 * phase en jargon. Cette page est lue par quelqu'un qui monte une boutique,
 * pas par quelqu'un qui écrit du logiciel.
 */
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

  // Tant que le projet est en onboarding, le client n'a qu'un objectif :
  // son questionnaire. Le tableau de bord ne s'ouvre qu'ensuite.
  if (project.status === 'onboarding') redirect(`/espace/${token}`);

  const [answers, assets, tasks] = await Promise.all([
    getFormAnswers(project.id),
    getAssets(project.id),
    getTasks(project.id),
  ]);

  const { blocking: briefMissing, deferred } = computeMissing(answers.data, assets, tasks);

  const mine = clientLoad(tasks);
  const ours = ourLoad(tasks);
  const stats = taskStats(tasks);
  const activity = lastActivity(tasks);

  return (
    <main className="shell stack--lg">
      <AppBar
        brandHref={`/espace/${token}`}
        title={project.company}
        tabs={clientTabs(token, { tasks: mine.open.length, brief: briefMissing.length })}
      />

      {brief === 'valide' ? (
        <div className="banner">
          <span aria-hidden>✓</span> Brief validé, merci. On enchaîne.
        </div>
      ) : null}

      {/* ── Où on en est ─────────────────────────────────────────────────── */}
      <section className="hero">
        <Ring done={stats.percent} submitted={stats.percentSubmitted} />

        <div className="hero__text">
          <h1>{project.company}</h1>
          <p className="hero__line">{headline(mine, ours)}</p>
          <p className="hero__meta">
            <strong>{stats.done}</strong> chose{stats.done > 1 ? 's' : ''} faite
            {stats.done > 1 ? 's' : ''}
            {mine.open.length > 0 ? (
              <>
                {' · '}
                <strong>{mine.open.length}</strong> qui t&apos;attend
                {mine.open.length > 1 ? 'ent' : ''}
              </>
            ) : null}
            {ours.open.length > 0 ? (
              <>
                {' · '}
                <strong>{ours.open.length}</strong> de mon côté
              </>
            ) : null}
          </p>
          {project.delivery_date ? (
            <p className="hero__date">
              Site livré le <strong>{formatDate(project.delivery_date)}</strong>
              {activity ? <> · dernier mouvement le {formatDate(activity)}</> : null}
            </p>
          ) : null}
        </div>
      </section>

      {/* ── Les trois blocs, en résumé cliquable ─────────────────────────── */}
      <nav className="buckets" aria-label="Les trois parties du projet">
        <a className="bucket bucket--you" href="#a-toi">
          <span className="bucket__count">{mine.open.length}</span>
          <span className="bucket__label">à toi</span>
          <span className="bucket__note">
            {mine.blocking.length > 0
              ? `dont ${mine.blocking.length} urgent${mine.blocking.length > 1 ? 's' : ''}`
              : 'rien d’urgent'}
          </span>
        </a>
        <a className="bucket bucket--us" href="#a-moi">
          <span className="bucket__count">{ours.open.length}</span>
          <span className="bucket__label">de mon côté</span>
          <span className="bucket__note">
            {ours.doing.length > 0 ? `${ours.doing.length} en cours` : 'en attente'}
          </span>
        </a>
        <a className="bucket bucket--done" href="#fait">
          <span className="bucket__count">{stats.done}</span>
          <span className="bucket__label">déjà fait</span>
          <span className="bucket__note">
            {mine.submitted.length > 0 ? `+ ${mine.submitted.length} à vérifier` : 'et validé'}
          </span>
        </a>
      </nav>

      {/* ── 1 ── Ce que j'attends de toi ─────────────────────────────────── */}
      <section className="stack" id="a-toi" style={{ gap: '0.9rem' }}>
        <header className="block-head block-head--you">
          <h2>Ce que j&apos;attends de toi</h2>
          <span className="pill pill--warn">{mine.open.length}</span>
        </header>

        {mine.open.length === 0 ? (
          <div className="card card--ok">
            <p className="small">
              Rien ne t&apos;attend pour l&apos;instant. Je te préviens dès que j&apos;ai besoin
              de quelque chose.
            </p>
          </div>
        ) : (
          <>
            {mine.blocking.length > 0 ? (
              <p className="block-lead">
                <strong>{mine.blocking.length}</strong> de ces points empêchent la boutique
                d&apos;ouvrir. Ce sont ceux à attaquer en premier — ils sont marqués en rouge.
              </p>
            ) : (
              <p className="block-lead">
                Rien ici ne bloque l&apos;ouverture. À traiter d&apos;ici la mise en ligne.
              </p>
            )}

            {mine.overdue.length > 0 ? (
              <div className="banner banner--error">
                <span aria-hidden>!</span> {mine.overdue.length} point
                {mine.overdue.length > 1 ? 's ont' : ' a'} dépassé la date prévue.
              </div>
            ) : null}

            {groupByPhase(mine.open).map((g) => (
              <div className="theme" key={g.key}>
                <div className="theme__head">
                  <PhaseIcon name={g.icon} />
                  <h3>{g.clientLabel}</h3>
                  <span className="theme__count">{g.tasks.length}</span>
                </div>
                <div className="tcards">
                  {g.tasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      project={project}
                      token={token}
                      back="suivi"
                      showTheme={false}
                      collapsible
                    />
                  ))}
                </div>
              </div>
            ))}
          </>
        )}

        {mine.submitted.length > 0 ? (
          <div className="theme theme--review">
            <div className="theme__head">
              <PhaseIcon name="check" />
              <h3>Reçu, je vérifie</h3>
              <span className="theme__count">{mine.submitted.length}</span>
            </div>
            <div className="tcards">
              {mine.submitted.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  project={project}
                  token={token}
                  back="suivi"
                  showTheme={false}
                  collapsible
                />
              ))}
            </div>
          </div>
        ) : null}

        {briefMissing.length > 0 ? (
          <a className="callout callout--danger" href={`/espace/${token}/brief`}>
            <span className="callout__count">{briefMissing.length}</span>
            <span>
              <strong>réponses manquantes dans ton questionnaire</strong>
              <br />
              Des informations de départ que je n&apos;ai pas encore.
            </span>
            <span className="callout__arrow" aria-hidden>
              →
            </span>
          </a>
        ) : null}

        {deferred.length > 0 ? (
          <a className="callout" href={`/espace/${token}/brief`}>
            <span className="callout__count">{deferred.length}</span>
            <span>
              <strong>points que tu as mis de côté</strong>
              <br />
              Rien ne bloque, je te les redemanderai au bon moment.
            </span>
            <span className="callout__arrow" aria-hidden>
              →
            </span>
          </a>
        ) : null}
      </section>

      {/* ── 2 ── Ce sur quoi je travaille ────────────────────────────────── */}
      <section className="stack" id="a-moi" style={{ gap: '0.9rem' }}>
        <header className="block-head block-head--us">
          <h2>Ce sur quoi je travaille</h2>
          <span className="pill pill--accent">{ours.open.length}</span>
        </header>

        {ours.open.length === 0 ? (
          <div className="card card--ok">
            <p className="small">
              Plus rien de mon côté. Le site n&apos;attend que ton contenu.
            </p>
          </div>
        ) : (
          <>
            <p className="block-lead">
              Tu n&apos;as rien à faire ici — c&apos;est ma part du travail. Elle est là pour
              que tu saches à quoi je passe mon temps.
            </p>

            {groupByPhase(ours.open).map((g) => (
              <div className="theme theme--us" key={g.key}>
                <div className="theme__head">
                  <PhaseIcon name={g.icon} />
                  <h3>{g.clientLabel}</h3>
                  <span className="theme__count">{g.tasks.length}</span>
                </div>
                <ul className="worklist">
                  {g.tasks.map((task) => (
                    <WorkRow key={task.id} task={task} />
                  ))}
                </ul>
              </div>
            ))}
          </>
        )}
      </section>

      {/* ── 3 ── Ce qui est déjà fait ────────────────────────────────────── */}
      <section className="stack" id="fait" style={{ gap: '0.9rem' }}>
        <header className="block-head block-head--done">
          <h2>Ce qui est déjà fait</h2>
          <span className="pill pill--ok">{stats.done}</span>
        </header>

        {stats.done === 0 ? (
          <p className="block-lead">Le projet démarre tout juste.</p>
        ) : (
          <>
            <p className="block-lead">
              {stats.done} chose{stats.done > 1 ? 's' : ''} bouclée
              {stats.done > 1 ? 's' : ''} et validée{stats.done > 1 ? 's' : ''} depuis le début du
              projet.
            </p>

            {groupByPhase(tasks.filter((t) => t.status === 'done')).map((g) => (
              <details className="theme theme--done" key={g.key}>
                <summary className="theme__head">
                  <PhaseIcon name={g.icon} />
                  <h3>{g.clientLabel}</h3>
                  <span className="theme__count">{g.tasks.length}</span>
                </summary>
                <ul className="worklist">
                  {g.tasks.map((task) => (
                    <li className="workrow" key={task.id} data-status="done">
                      <span className="workrow__tick" aria-hidden>
                        ✓
                      </span>
                      <span className="workrow__label">{task.label}</span>
                      {task.description ? (
                        <span className="workrow__why">{task.description}</span>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </details>
            ))}
          </>
        )}
      </section>

      {/* ── Contact ──────────────────────────────────────────────────────── */}
      <section className="card card--accent stack" style={{ gap: '0.7rem' }}>
        <h2>Une question ?</h2>
        <p className="small muted">
          Réponse dans la journée. Pour tout ce qui se règle mieux à l&apos;oral, prends 15
          minutes dans mon agenda.
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
 * La phrase d'accueil, déduite de l'état réel.
 *
 * Écrite pour être vraie dans tous les cas plutôt qu'encourageante dans
 * aucun : un tableau de bord qui dit « ça avance bien » alors que dix points
 * bloquent l'ouverture ne trompe personne longtemps.
 */
function headline(mine: SideLoad, ours: SideLoad): string {
  if (mine.all.length === 0 && ours.all.length === 0) {
    return 'Le projet démarre. Les étapes apparaîtront ici.';
  }
  if (mine.open.length === 0 && ours.open.length === 0) {
    return 'Tout est bouclé des deux côtés.';
  }
  if (mine.blocking.length > 0) {
    return 'Le site est debout. Il attend ton contenu pour pouvoir ouvrir.';
  }
  if (mine.open.length > 0 && ours.open.length === 0) {
    return "Tout est prêt de mon côté. Il ne manque plus que tes éléments.";
  }
  if (mine.open.length === 0) {
    return 'Rien ne t’attend. Je travaille sur la suite.';
  }
  return 'Ça avance des deux côtés.';
}

/** Une ligne de ma part du travail. Lecture seule, jamais actionnable. */
function WorkRow({ task }: { task: Task }) {
  return (
    <li className="workrow" data-status={task.status}>
      <span className={`dot dot--${task.status}`} aria-hidden />
      <span className="workrow__label">{task.label}</span>
      {task.status === 'doing' || task.status === 'blocked' ? (
        <span className={task.status === 'blocked' ? 'pill pill--danger tiny' : 'pill pill--accent tiny'}>
          {CLIENT_STATUS_LABELS[task.status]}
        </span>
      ) : null}
      {task.description ? <span className="workrow__why">{task.description}</span> : null}
    </li>
  );
}

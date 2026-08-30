import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';

import { AppBar } from '@/app/_components/AppBar';
import { SegmentedBar } from '@/app/_components/Bar';
import { safeDepositUrl, isGoogleDrive } from '@/lib/drive';
import { getAssets, getFormAnswers, getProjectByToken, getTasks } from '@/lib/data';
import { countMissingRequired } from '@/lib/missing';
import { clientLoad } from '@/lib/progress';
import { isOnboarding, type Task } from '@/lib/types';
import { TaskCard } from '../_TaskCard';
import { clientTabs } from '../_tabs';

export const metadata: Metadata = { robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

/**
 * « Mes tâches » — tout ce que le client doit fournir, et rien d'autre.
 *
 * Le suivi montre le projet entier, nous compris. Cet écran-ci ne montre que
 * sa part, triée par ce qui bloque le plus. C'est la page qu'on lui envoie en
 * lien direct quand on lui demande quelque chose.
 *
 * Le tri est par jalon et non par phase : quand on a vingt choses à faire, la
 * question n'est pas « à quelle étape du projet ça appartient », c'est
 * « qu'est-ce qui empêche d'ouvrir ».
 */
export default async function TachesPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const project = await getProjectByToken(token);
  if (!project) notFound();

  // Pendant l'onboarding, le client n'a qu'un objectif : son questionnaire.
  if (isOnboarding(project.status)) redirect(`/espace/${token}`);

  const [answers, assets, tasks] = await Promise.all([
    getFormAnswers(project.id),
    getAssets(project.id),
    getTasks(project.id),
  ]);

  const load = clientLoad(tasks);
  const briefMissing = countMissingRequired(answers.data, assets);
  const folder = safeDepositUrl(project.drive_url);

  const groups: { key: string; title: string; hint: string; tasks: Task[]; tone?: string }[] = [
    {
      key: 'ouverture',
      title: "Ça bloque l'ouverture",
      hint: "Sans ces éléments, la boutique ne peut pas ouvrir. C'est ici qu'il faut mettre l'énergie en premier.",
      tasks: load.open.filter((t) => t.milestone === 'ouverture'),
      tone: 'danger',
    },
    {
      key: 'livraison',
      title: 'Avant la mise en ligne',
      hint: 'Ça peut attendre les derniers jours, mais pas au-delà.',
      tasks: load.open.filter((t) => t.milestone === 'livraison'),
      tone: 'warn',
    },
    {
      key: 'libre',
      title: 'Quand tu peux',
      hint: 'Rien ne presse sur ces points.',
      tasks: load.open.filter((t) => !t.milestone),
    },
  ].filter((g) => g.tasks.length > 0);

  return (
    <main className="shell stack--lg">
      <AppBar
        brandHref={`/espace/${token}`}
        title={project.company}
        active={`/espace/${token}/taches`}
        tabs={clientTabs(token, { tasks: load.open.length, brief: briefMissing })}
      />

      <div className="stack" style={{ gap: '0.5rem' }}>
        <h1>Mes tâches</h1>
        <p className="muted small">
          {load.open.length === 0
            ? "Rien ne t'attend pour l'instant. On te préviendra dès qu'on a besoin de quelque chose."
            : `${load.open.length} chose${load.open.length > 1 ? 's' : ''} à faire de ton côté${
                load.blocking.length > 0
                  ? `, dont ${load.blocking.length} qui bloque${load.blocking.length > 1 ? 'nt' : ''} l'ouverture`
                  : ''
              }.`}
        </p>
      </div>

      {/* ── Avancement de SA part ────────────────────────────────────────── */}
      {load.all.length > 0 ? (
        <section className="stack" style={{ gap: '0.5rem' }}>
          <div className="row row--between">
            <span className="section-title">Ta part du projet</span>
            <strong className="small">{load.stats.percent}%</strong>
          </div>
          <SegmentedBar done={load.stats.percent} submitted={load.stats.percentSubmitted} />
          <p className="tiny muted">
            {load.done.length} validée{load.done.length > 1 ? 's' : ''} sur {load.all.length}
            {load.submitted.length > 0
              ? ` · ${load.submitted.length} en cours de vérification chez nous`
              : ''}
          </p>
        </section>
      ) : null}

      {/* ── Le dossier de dépôt commun ───────────────────────────────────── */}
      {folder ? (
        <section className="card card--accent stack" style={{ gap: '0.6rem' }}>
          <span className="section-title">Où déposer tes fichiers</span>
          <p className="small">
            {isGoogleDrive(folder)
              ? "Un dossier Google Drive t'est réservé. Photos, textes, logos : tout y passe. Crée un sous-dossier par tâche si ça t'aide, on s'y retrouvera."
              : "Un dossier de dépôt t'est réservé. Photos, textes, logos : tout y passe."}
          </p>
          <div className="row">
            <a className="btn btn--small" href={folder} target="_blank" rel="noreferrer">
              Ouvrir le dossier ↗
            </a>
          </div>
          <p className="tiny muted">
            Rien ne s&apos;envoie automatiquement : après avoir déposé, reviens cocher la tâche
            pour qu&apos;on sache qu&apos;il y a du nouveau.
          </p>
        </section>
      ) : null}

      {/* ── Ce qu'il reste à faire, par urgence ──────────────────────────── */}
      {groups.map((g) => (
        <section className="stack" style={{ gap: '0.7rem' }} key={g.key}>
          <div className="row row--between">
            <span className="section-title">{g.title}</span>
            <span className={g.tone ? `pill pill--${g.tone} tiny` : 'pill tiny'}>
              {g.tasks.length}
            </span>
          </div>
          <p className="small muted" style={{ marginTop: '-0.35rem' }}>
            {g.hint}
          </p>
          <div className="tcards">
            {g.tasks.map((task) => (
              <TaskCard key={task.id} task={task} project={project} token={token} />
            ))}
          </div>
        </section>
      ))}

      {/* ── Rendu, en attente de notre validation ────────────────────────── */}
      {load.submitted.length > 0 ? (
        <section className="stack" style={{ gap: '0.7rem' }}>
          <div className="row row--between">
            <span className="section-title">Chez nous, en vérification</span>
            <span className="pill pill--accent tiny">{load.submitted.length}</span>
          </div>
          <p className="small muted" style={{ marginTop: '-0.35rem' }}>
            Tu as rendu, on relit. Si quelque chose manque, on te le dit ici même.
          </p>
          <div className="tcards">
            {load.submitted.map((task) => (
              <TaskCard key={task.id} task={task} project={project} token={token} />
            ))}
          </div>
        </section>
      ) : null}

      {/* ── L'acquis ─────────────────────────────────────────────────────── */}
      {load.done.length > 0 ? (
        <details className="accordion">
          <summary>
            <span className="dot dot--done" aria-hidden />
            Ce qui est bouclé
            <span className="accordion__count">{load.done.length}</span>
          </summary>
          <div className="accordion__body">
            {load.done.map((task) => (
              <div className="task" data-status="done" key={task.id} id={`tache-${task.id}`}>
                <span className="dot dot--done" aria-hidden />
                <span className="task__label">{task.label}</span>
              </div>
            ))}
          </div>
        </details>
      ) : null}

      {load.all.length === 0 ? (
        <section className="card card--ok stack" style={{ gap: '0.6rem' }}>
          <h2 style={{ color: 'var(--accent-3)' }}>Rien à faire de ton côté</h2>
          <p className="small muted">
            Aucune tâche ne t&apos;est assignée pour le moment. Dès qu&apos;on a besoin de
            quelque chose, ça apparaîtra ici et tu recevras un e-mail.
          </p>
        </section>
      ) : null}
    </main>
  );
}

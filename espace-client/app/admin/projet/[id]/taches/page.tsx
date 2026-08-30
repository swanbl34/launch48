import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

import { CopyButton } from '@/app/_components/CopyButton';
import { AdminTaskRow, ReviewRow, TaskFields } from '@/app/admin/_components';
import { isAdmin } from '@/lib/auth';
import { getProjectById, getTasks } from '@/lib/data';
import { depositUrlFor, safeDepositUrl } from '@/lib/drive';
import { buildTaskEmail, mailtoLink } from '@/lib/notify';
import { clientLoad, phaseViews } from '@/lib/progress';
import { TASK_PACKS } from '@/lib/task-packs';
import { addTask, importTaskPack } from '../../../actions';

export const metadata: Metadata = { robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

/** Onglet « Tâches » : la file à valider, l'envoi, l'édition, l'import. */
export default async function TachesPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    e?: string;
    saved?: string;
    ajout?: string;
    importe?: string;
    valide?: string;
    renvoye?: string;
  }>;
}) {
  if (!(await isAdmin())) notFound();

  const { id } = await params;
  const sp = await searchParams;

  const project = await getProjectById(id);
  if (!project) notFound();

  const tasks = await getTasks(project.id);
  const phases = phaseViews(tasks);
  const load = clientLoad(tasks);

  const h = await headers();
  const host = h.get('x-forwarded-host') ?? h.get('host') ?? 'localhost:3000';
  const proto = h.get('x-forwarded-proto') ?? (host.startsWith('localhost') ? 'http' : 'https');
  const espaceUrl = `${proto}://${host}/espace/${project.token}`;

  const mail = buildTaskEmail({ project, tasks: load.open, espaceUrl });
  const folder = safeDepositUrl(project.drive_url);

  return (
    <div className="stack--lg">
      {sp.e === 'demo' ? (
        <div className="banner banner--error">
          Mode démo (DEMO_MODE=1) : lecture seule, aucune écriture n&apos;est enregistrée.
        </div>
      ) : null}
      {sp.e === 'lot' ? (
        <div className="banner banner--error">Lot inconnu : rien n&apos;a été importé.</div>
      ) : null}
      {sp.saved ? <div className="banner">Tâche enregistrée.</div> : null}
      {sp.ajout ? <div className="banner">Tâche ajoutée et visible côté client.</div> : null}
      {sp.valide ? <div className="banner">Validé.</div> : null}
      {sp.renvoye ? (
        <div className="banner">
          Renvoyé au client : la tâche est redevenue « à faire » dans son espace.
        </div>
      ) : null}
      {sp.importe ? (
        <div className="banner">
          {sp.importe === '0'
            ? 'Rien à importer : toutes les tâches du lot existaient déjà.'
            : `${sp.importe} tâches importées.`}
        </div>
      ) : null}

      {/* ── 1. Ce que le client a rendu ──────────────────────────────────── */}
      {load.submitted.length > 0 ? (
        <section className="card card--accent stack" style={{ gap: '0.8rem' }}>
          <div className="row row--between">
            <h2>À valider</h2>
            <span className="pill pill--accent">{load.submitted.length}</span>
          </div>
          <p className="small muted">
            Le client a déclaré avoir rendu. Ouvre le dépôt, vérifie, puis valide — ou renvoie
            la tâche si quelque chose manque.
          </p>
          <div className="stack" style={{ gap: '0.5rem' }}>
            {load.submitted.map((t) => (
              <ReviewRow
                key={t.id}
                task={t}
                projectId={project.id}
                depositUrl={depositUrlFor(t, project)}
              />
            ))}
          </div>
        </section>
      ) : null}

      {/* ── 2. Prévenir le client ────────────────────────────────────────── */}
      <section className="card stack" style={{ gap: '0.7rem' }}>
        <div className="row row--between">
          <h2>Prévenir le client</h2>
          <span className={load.open.length > 0 ? 'pill pill--warn' : 'pill pill--ok'}>
            {load.open.length} en attente
          </span>
        </div>

        {load.open.length === 0 ? (
          <p className="small muted">
            Aucune tâche ouverte de son côté. Rien à annoncer pour l&apos;instant.
          </p>
        ) : (
          <>
            <p className="small muted">
              Les tâches sont visibles dans son espace dès leur création — ce bouton ne fait que
              rédiger l&apos;e-mail qui le lui dit, depuis ta propre adresse.
            </p>

            {!folder ? (
              <div className="banner banner--error">
                Aucun dossier de dépôt n&apos;est renseigné sur ce projet. Les tâches qui
                attendent des fichiers afficheront « dossier pas encore ouvert ». Ajoute le lien
                Google Drive depuis l&apos;onglet <strong>Fiche</strong>.
              </div>
            ) : null}

            <div className="row">
              <a className="btn btn--small" href={mailtoLink(project.email, mail)}>
                Rédiger l&apos;e-mail
              </a>
              <CopyButton value={mail.body} label="Copier le texte complet" />
              <CopyButton value={`${espaceUrl}/taches`} label="Copier le lien des tâches" />
            </div>

            {mail.omitted > 0 ? (
              <p className="tiny muted">
                L&apos;e-mail prérempli s&apos;arrête à 12 tâches — au-delà, certains clients
                mail tronquent le lien. Le texte complet est dans le presse-papier.
              </p>
            ) : null}

            <details>
              <summary className="tiny muted" style={{ cursor: 'pointer' }}>
                Relire le message
              </summary>
              <pre className="mailpreview">{mail.body}</pre>
            </details>
          </>
        )}
      </section>

      {/* ── 3. Les tâches, par phase ─────────────────────────────────────── */}
      <section className="stack" style={{ gap: '0.5rem' }}>
        <div className="row row--between">
          <span className="section-title">Toutes les tâches</span>
          <span className="tiny muted">{tasks.length} au total</span>
        </div>

        {phases.map((p) => (
          <details className="accordion" key={p.key} open={p.state !== 'done'}>
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
            <p className="small muted">
              Aucune tâche. Importe un lot ou ajoute-en une ci-dessous.
            </p>
          </div>
        ) : null}
      </section>

      {/* ── 4. Import d'un lot ───────────────────────────────────────────── */}
      <section className="card stack" style={{ gap: '0.7rem' }}>
        <h2>Importer un lot</h2>
        <p className="small muted">
          Des listes prêtes à l&apos;emploi, définies dans <code>lib/task-packs.ts</code>. Seules
          les tâches absentes du projet sont créées : réimporter un lot enrichi n&apos;engendre
          pas de doublons.
        </p>
        <p className="tiny muted">
          Si le projet porte encore les tâches génériques créées à son ouverture et qu&apos;elles
          ne correspondent à rien, supprime-les d&apos;abord : restées à « à faire », elles
          tirent l&apos;avancement vers le bas sans rien décrire.
        </p>

        <form action={importTaskPack} className="stack" style={{ gap: '0.7rem' }}>
          <input type="hidden" name="projectId" value={project.id} />
          <div className="field">
            <label className="field__label" htmlFor="pack">
              Lot
            </label>
            <select id="pack" name="pack" defaultValue={TASK_PACKS[0]?.key ?? ''}>
              {TASK_PACKS.map((p) => (
                <option key={p.key} value={p.key}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          <ul className="small muted" style={{ margin: 0, paddingLeft: '1.1rem' }}>
            {TASK_PACKS.map((p) => (
              <li key={p.key}>
                <strong>{p.label}</strong> — {p.summary}
              </li>
            ))}
          </ul>

          <div>
            <button className="btn btn--small" type="submit">
              Importer
            </button>
          </div>
        </form>
      </section>

      {/* ── 5. Ajout à l'unité ───────────────────────────────────────────── */}
      <section className="card stack" style={{ gap: '0.9rem' }} id="ajouter">
        <h2>Envoyer une tâche</h2>
        <p className="small muted">
          Elle apparaît immédiatement dans l&apos;espace du client, avec son explication et son
          bouton de dépôt s&apos;il y a un livrable.
        </p>
        <form action={addTask} className="stack" style={{ gap: '0.9rem' }}>
          <input type="hidden" name="projectId" value={project.id} />
          <TaskFields idPrefix="new" />
          <div>
            <button className="btn" type="submit">
              Créer la tâche
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import type { Metadata } from 'next';

import { Bar } from '@/app/_components/Bar';
import { Brand } from '@/app/_components/Brand';
import { CopyButton } from '@/app/_components/CopyButton';
import { STEPS, fieldsForStep, isFileField } from '@/lib/brief-schema';
import { displayValue } from '@/lib/brief-values';
import { isAdmin } from '@/lib/auth';
import { getAssets, getFormAnswers, getProjectById, getTasks, signAssetUrl } from '@/lib/data';
import { formatDate, formatDateTime, formatSize } from '@/lib/format';
import { computeMissing, isFilled } from '@/lib/missing';
import { globalProgress, phaseViews } from '@/lib/progress';
import { PACKS, PHASES } from '@/lib/task-templates';
import { STATUS_LABELS, TASK_STATUS_LABELS, type Task } from '@/lib/types';
import { addTask, deleteProject, deleteTask, logout, moveTask, updateProject, updateTask } from '../../actions';

export const metadata: Metadata = { robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default async function ProjectPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string; created?: string; e?: string }>;
}) {
  if (!(await isAdmin())) notFound();

  const { id } = await params;
  const sp = await searchParams;

  const project = await getProjectById(id);
  if (!project) notFound();

  const [answers, assets, tasks] = await Promise.all([
    getFormAnswers(project.id),
    getAssets(project.id),
    getTasks(project.id),
  ]);

  const h = await headers();
  const host = h.get('x-forwarded-host') ?? h.get('host') ?? 'localhost:3000';
  const proto = h.get('x-forwarded-proto') ?? (host.startsWith('localhost') ? 'http' : 'https');
  const espaceUrl = `${proto}://${host}/espace/${project.token}`;

  // URLs signées 1 h, générées à l'affichage. Rien n'est public.
  const signed = new Map<string, string | null>(
    await Promise.all(
      assets.map(async (a) => [a.id, await signAssetUrl(a.storage_path)] as const),
    ),
  );

  const { blocking, other } = computeMissing(answers.data, assets, tasks);
  const progress = globalProgress(tasks);
  const phases = phaseViews(tasks);

  return (
    <main className="shell shell--wide stack--lg">
      <header className="topbar">
        <Brand href="/admin" />
        <div className="row">
          <a className="btn btn--ghost btn--small" href="/admin">
            ← Tous les projets
          </a>
          <form action={logout}>
            <button className="btn btn--ghost btn--small" type="submit">
              Déconnexion
            </button>
          </form>
        </div>
      </header>

      {sp.created ? <div className="banner">Projet créé, tâches initialisées.</div> : null}
      {sp.saved ? <div className="banner">Enregistré.</div> : null}
      {sp.e === 'demo' ? (
        <div className="banner banner--error">
          Mode démo (DEMO_MODE=1) : lecture seule, aucune écriture n&apos;est enregistrée.
        </div>
      ) : null}
      {sp.e === 'confirm' ? (
        <div className="banner banner--error">
          Suppression annulée : le nom saisi ne correspond pas.
        </div>
      ) : null}

      <div className="stack" style={{ gap: '0.5rem' }}>
        <h1>{project.company}</h1>
        <div className="row">
          <span className="pill pill--accent">{project.pack}</span>
          <span className="pill">{STATUS_LABELS[project.status]}</span>
          <span className="pill">{progress}%</span>
          {blocking.length + other.length > 0 ? (
            <span className="pill pill--danger">{blocking.length + other.length} manquants</span>
          ) : (
            <span className="pill pill--ok">complet</span>
          )}
          <span className="tiny muted">créé le {formatDate(project.created_at)}</span>
        </div>
        <Bar value={progress} thin />
      </div>

      {/* ── Lien client ─────────────────────────────────────────────────── */}
      <section className="card card--accent stack" style={{ gap: '0.6rem' }}>
        <span className="section-title">Lien de l&apos;espace client</span>
        <code className="small" style={{ overflowWrap: 'anywhere' }}>
          {espaceUrl}
        </code>
        <div className="row">
          <CopyButton value={espaceUrl} />
          <a className="btn btn--ghost btn--small" href={`/espace/${project.token}`} target="_blank" rel="noreferrer">
            Ouvrir
          </a>
        </div>
      </section>

      {/* ── Fiche projet ────────────────────────────────────────────────── */}
      <section className="card stack" style={{ gap: '0.9rem' }}>
        <h2>Fiche</h2>
        <form action={updateProject} className="stack" style={{ gap: '0.9rem' }}>
          <input type="hidden" name="id" value={project.id} />
          <div className="grid-2">
            <Input name="company" label="Entreprise" defaultValue={project.company} required />
            <Input name="contact_name" label="Interlocuteur" defaultValue={project.contact_name ?? ''} />
            <Input name="email" label="Email" type="email" defaultValue={project.email ?? ''} />
            <Input name="phone" label="Téléphone" type="tel" defaultValue={project.phone ?? ''} />
            <Select
              name="pack"
              label="Pack"
              defaultValue={project.pack}
              options={PACKS.map((p) => ({ value: p, label: p }))}
            />
            <Select
              name="status"
              label="Statut du projet"
              defaultValue={project.status}
              options={Object.entries(STATUS_LABELS).map(([value, label]) => ({ value, label }))}
            />
            <Input name="price" label="Prix (€)" defaultValue={project.price?.toString() ?? ''} />
            <Input name="kickoff_date" label="Démarrage" type="date" defaultValue={project.kickoff_date ?? ''} />
            <Input
              name="delivery_date"
              label="Livraison estimée"
              type="date"
              defaultValue={project.delivery_date ?? ''}
            />
          </div>
          <div>
            <button className="btn" type="submit">
              Enregistrer la fiche
            </button>
          </div>
        </form>
      </section>

      {/* ── Tâches ──────────────────────────────────────────────────────── */}
      <section className="card stack" style={{ gap: '0.8rem' }} id="tasks">
        <h2>Tâches</h2>

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

        <form action={addTask} className="row" style={{ gap: '0.4rem', alignItems: 'flex-end' }}>
          <input type="hidden" name="projectId" value={project.id} />
          <div className="field" style={{ flex: '2 1 14rem' }}>
            <label className="field__label tiny" htmlFor="new-label">
              Nouvelle tâche
            </label>
            <input id="new-label" name="label" type="text" required placeholder="Intitulé" />
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

      {/* ── Réponses du brief ───────────────────────────────────────────── */}
      <section className="card stack" style={{ gap: '0.7rem' }}>
        <div className="row row--between">
          <h2>Brief</h2>
          <span className="tiny muted">
            {answers.submitted_at
              ? `Validé le ${formatDate(answers.submitted_at)}`
              : 'Pas encore validé'}{' '}
            · maj {formatDateTime(answers.updated_at)}
          </span>
        </div>

        {STEPS.map((s) => (
          <details className="accordion" key={s.step}>
            <summary>
              {s.title}
              <span className="accordion__count">
                {fieldsForStep(s.step).filter((f) => isFilled(f, answers.data[f.key], assets)).length}
                /{fieldsForStep(s.step).length}
              </span>
            </summary>
            <div className="accordion__body">
              <dl className="kv">
                {fieldsForStep(s.step).map((f) => {
                  const mine = assets.filter((a) => a.field_key === f.key);
                  return (
                    <div key={f.key} style={{ display: 'contents' }}>
                      <dt>
                        {f.required ? <span style={{ color: 'var(--danger)' }}>• </span> : null}
                        {f.label}
                      </dt>
                      <dd>
                        {isFileField(f) ? (
                          mine.length ? (
                            <ul className="file-list">
                              {mine.map((a) => {
                                const url = signed.get(a.id);
                                return (
                                  <li className="file-item" key={a.id}>
                                    <span className="file-item__name">{a.file_name}</span>
                                    <span className="tiny muted">{formatSize(a.size)}</span>
                                    {url ? (
                                      <a className="tiny" href={url} target="_blank" rel="noreferrer">
                                        Télécharger
                                      </a>
                                    ) : (
                                      <span className="tiny muted">lien indisponible</span>
                                    )}
                                  </li>
                                );
                              })}
                            </ul>
                          ) : (
                            <span className="muted">—</span>
                          )
                        ) : (
                          <span style={{ whiteSpace: 'pre-wrap' }}>
                            {displayValue(f, answers.data[f.key])}
                          </span>
                        )}
                      </dd>
                    </div>
                  );
                })}
              </dl>
            </div>
          </details>
        ))}
      </section>

      {/* ── Zone dangereuse ─────────────────────────────────────────────── */}
      <section className="card card--danger stack" style={{ gap: '0.6rem' }}>
        <h2>Supprimer</h2>
        <p className="small muted">
          Supprime le projet, ses réponses, ses tâches et ses fichiers. Irréversible.
          Tape <strong>{project.company}</strong> pour confirmer.
        </p>
        <form action={deleteProject} className="row" style={{ alignItems: 'flex-end' }}>
          <input type="hidden" name="id" value={project.id} />
          <div className="field" style={{ flex: '1 1 14rem' }}>
            <label className="field__label tiny" htmlFor="confirm">
              Nom de l&apos;entreprise
            </label>
            <input id="confirm" name="confirm" type="text" required autoComplete="off" />
          </div>
          <button className="btn btn--ghost btn--small btn--danger" type="submit">
            Supprimer définitivement
          </button>
        </form>
      </section>
    </main>
  );
}

/* ── Petits helpers de formulaire ─────────────────────────────────────────── */

function Input({
  name,
  label,
  defaultValue,
  type = 'text',
  required,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div className="field">
      <label className="field__label" htmlFor={name}>
        {label}
      </label>
      <input id={name} name={name} type={type} defaultValue={defaultValue} required={required} />
    </div>
  );
}

function Select({
  name,
  label,
  defaultValue,
  options,
}: {
  name: string;
  label: string;
  defaultValue: string;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="field">
      <label className="field__label" htmlFor={name}>
        {label}
      </label>
      <select id={name} name={name} defaultValue={defaultValue}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

/** Une ligne éditable : label, statut, porteur, réordonnancement, suppression. */
function AdminTaskRow({ task, projectId }: { task: Task; projectId: string }) {
  return (
    <div className="admin-task">
      <form action={updateTask} className="row" style={{ gap: '0.4rem', flexWrap: 'nowrap' }}>
        <input type="hidden" name="projectId" value={projectId} />
        <input type="hidden" name="taskId" value={task.id} />
        <input
          name="label"
          type="text"
          defaultValue={task.label}
          aria-label="Intitulé"
          style={{ flex: 1, minWidth: 0 }}
        />
        <select name="status" defaultValue={task.status} aria-label="Statut">
          {Object.entries(TASK_STATUS_LABELS).map(([v, l]) => (
            <option key={v} value={v}>
              {l}
            </option>
          ))}
        </select>
        <select name="owner" defaultValue={task.owner} aria-label="Porteur">
          <option value="launch48">L48</option>
          <option value="client">Client</option>
        </select>
        <button className="icon-btn" type="submit" title="Enregistrer">
          ✓
        </button>
      </form>

      <form action={moveTask}>
        <input type="hidden" name="projectId" value={projectId} />
        <input type="hidden" name="taskId" value={task.id} />
        <button className="icon-btn" type="submit" name="dir" value="up" title="Monter">
          ↑
        </button>
      </form>

      <form action={moveTask}>
        <input type="hidden" name="projectId" value={projectId} />
        <input type="hidden" name="taskId" value={task.id} />
        <button className="icon-btn" type="submit" name="dir" value="down" title="Descendre">
          ↓
        </button>
      </form>

      <form action={deleteTask}>
        <input type="hidden" name="projectId" value={projectId} />
        <input type="hidden" name="taskId" value={task.id} />
        <button className="icon-btn" type="submit" title="Supprimer">
          ✕
        </button>
      </form>
    </div>
  );
}

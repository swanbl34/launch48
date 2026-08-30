/**
 * La carte d'une tâche adressée au client.
 *
 * C'est la brique qui porte tout le système : l'intitulé, le pourquoi, ce
 * qu'on attend en retour, où le déposer, et le bouton qui nous renvoie la
 * balle. Partagée par « Mes tâches » et le dashboard de suivi.
 *
 * Aucun JavaScript : un formulaire par carte, POST + redirect. La carte reste
 * utilisable sur un téléphone en 3G au fond d'un entrepôt de tri — ce qui est
 * exactement le contexte dans lequel un client coche « c'est déposé ».
 */
import { depositLabel, depositUrlFor } from '@/lib/drive';
import { formatDate, formatDateTime } from '@/lib/format';
import { phaseLabel } from '@/lib/task-templates';
import {
  MILESTONE_LABELS,
  MILESTONE_TONE,
  type Project,
  type Task,
} from '@/lib/types';
import { submitClientTask } from './actions';

/** Le client peut-il revenir sur sa déclaration ? Miroir de canReopen() côté action. */
const canReopen = (task: Task) =>
  task.status === 'review' || (task.status === 'done' && !task.deliverable);

/** Une échéance dépassée, pour la tâche encore ouverte. */
const isOverdue = (task: Task) =>
  !!task.due_date &&
  task.status !== 'done' &&
  task.status !== 'review' &&
  task.due_date < new Date().toISOString().slice(0, 10);

export function TaskCard({
  task,
  project,
  token,
  back = 'taches',
}: {
  task: Task;
  project: Project;
  token: string;
  /** Écran vers lequel revenir après l'action. */
  back?: 'taches' | 'suivi';
}) {
  const deposit = depositUrlFor(task, project);
  const submitted = task.status === 'review';
  const done = task.status === 'done';
  const overdue = isOverdue(task);

  return (
    <article className="tcard" id={`tache-${task.id}`} data-status={task.status}>
      {/* ── En-tête ──────────────────────────────────────────────────────── */}
      <header className="tcard__head">
        <span className={`dot dot--${task.status}`} aria-hidden />
        <h3 className="tcard__title">{task.label}</h3>
        <span className="tcard__tags">
          {task.milestone && !done && !submitted ? (
            <span className={`pill pill--${MILESTONE_TONE[task.milestone]} tiny`}>
              {MILESTONE_LABELS[task.milestone]}
            </span>
          ) : null}
          <span className="pill tiny muted">{phaseLabel(task.phase)}</span>
        </span>
      </header>

      {task.description ? <p className="tcard__why">{task.description}</p> : null}

      {task.due_date && !done && !submitted ? (
        <p className={overdue ? 'tiny tcard__due tcard__due--late' : 'tiny tcard__due'}>
          {overdue ? 'Attendu pour le ' : 'Pour le '}
          <strong>{formatDate(task.due_date)}</strong>
        </p>
      ) : null}

      {/* ── Le livrable et son dossier de dépôt ──────────────────────────── */}
      {task.deliverable ? (
        <div className="deliverable">
          <span className="section-title">À nous envoyer</span>
          <p className="small">{task.deliverable}</p>

          {deposit ? (
            <a className="btn btn--small" href={deposit} target="_blank" rel="noreferrer">
              {depositLabel(deposit)} ↗
            </a>
          ) : (
            <p className="tiny muted">
              Le dossier de dépôt n&apos;est pas encore ouvert. On te l&apos;envoie très vite —
              en attendant, rien ne t&apos;empêche de préparer les fichiers.
            </p>
          )}
        </div>
      ) : null}

      {/* ── Le mot laissé par le client ──────────────────────────────────── */}
      {task.client_note ? (
        <p className="tcard__note">
          <span className="section-title">Ton mot</span>
          {task.client_note}
        </p>
      ) : null}

      {/* ── État et actions ──────────────────────────────────────────────── */}
      {submitted ? (
        <p className="tcard__state tcard__state--review">
          <span aria-hidden>◔</span> Reçu{' '}
          {task.submitted_at ? `le ${formatDateTime(task.submitted_at)}` : ''} — on vérifie et on
          te confirme.
        </p>
      ) : null}

      {done ? (
        <p className="tcard__state tcard__state--done">
          <span aria-hidden>✓</span> Validé{task.done_at ? ` le ${formatDate(task.done_at)}` : ''}.
        </p>
      ) : null}

      <form action={submitClientTask} className="tcard__actions">
        <input type="hidden" name="token" value={token} />
        <input type="hidden" name="taskId" value={task.id} />
        <input type="hidden" name="back" value={back} />

        {!done && !submitted ? (
          <button className="btn btn--small" type="submit" name="_intent" value="submit">
            {task.deliverable ? "J'ai déposé les fichiers" : "C'est fait"}
          </button>
        ) : null}

        {canReopen(task) ? (
          <button
            className="btn btn--ghost btn--small"
            type="submit"
            name="_intent"
            value="reopen"
          >
            Finalement, non
          </button>
        ) : null}

        {/* Le mot est replié : il sert rarement, mais quand il sert, il évite
            trois semaines de silence sur une tâche qui coince. */}
        <details className="tcard__notebox">
          <summary className="tiny muted">
            {task.client_note ? 'Modifier ton mot' : 'Laisser un mot'}
          </summary>
          <div className="stack" style={{ gap: '0.45rem', marginTop: '0.5rem' }}>
            <textarea
              name="note"
              rows={3}
              maxLength={600}
              defaultValue={task.client_note ?? ''}
              placeholder="Une question, un blocage, une précision…"
              aria-label={`Un mot sur : ${task.label}`}
            />
            <div>
              <button className="btn btn--ghost btn--small" type="submit" name="_intent" value="note">
                Envoyer le mot
              </button>
            </div>
          </div>
        </details>
      </form>
    </article>
  );
}

/**
 * La carte d'une tâche adressée au client.
 *
 * C'est la brique qui porte tout le système : l'intitulé, le pourquoi, ce
 * qu'on attend en retour, où le déposer, et le bouton qui nous renvoie la
 * balle.
 *
 * Deux formes, pour deux moments :
 *
 *   dépliée (`/taches`)  — on traite sa liste, tout est sous les yeux.
 *   repliable (`/suivi`) — on prend la température. Vingt-quatre cartes
 *     dépliées faisaient dix mille pixels de page : personne ne fait défiler
 *     ça, et l'essentiel — combien, lesquelles sont urgentes — se noyait dans
 *     le détail. En repli, le même bloc tient sur un écran et s'ouvre là où on
 *     veut agir.
 *
 * Aucun JavaScript : un formulaire par carte, POST + redirect, et le repli est
 * un <details> natif. La carte reste utilisable sur un téléphone en 3G au fond
 * d'un entrepôt de tri — ce qui est exactement le contexte dans lequel on
 * coche « c'est déposé ».
 */
import { depositLabel, depositUrlFor } from '@/lib/drive';
import { formatDate, formatDateTime } from '@/lib/format';
import { phaseClientLabel } from '@/lib/task-templates';
import { MILESTONE_LABELS, MILESTONE_TONE, type Project, type Task } from '@/lib/types';
import { submitClientTask } from './actions';

/** Le client peut-il revenir sur sa déclaration ? Miroir de canReopen() côté action. */
const canReopen = (task: Task) =>
  task.status === 'review' || (task.status === 'done' && !task.deliverable);

/** Une échéance dépassée, sur une tâche encore ouverte. */
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
  showTheme = true,
  collapsible = false,
}: {
  task: Task;
  project: Project;
  token: string;
  /** Écran vers lequel revenir après l'action. */
  back?: 'taches' | 'suivi';
  /**
   * Afficher le thème sur la carte.
   *
   * Faux quand les cartes sont déjà rangées sous un en-tête de thème : répéter
   * « Ta marque » sur les quatre cartes du bloc « Ta marque » n'apprend rien.
   */
  showTheme?: boolean;
  /** Replier le détail derrière l'intitulé. */
  collapsible?: boolean;
}) {
  const deposit = depositUrlFor(task, project);
  const submitted = task.status === 'review';
  const done = task.status === 'done';
  const overdue = isOverdue(task);

  const head = (
    <>
      <span className={`dot dot--${task.status}`} aria-hidden />
      <h3 className="tcard__title">{task.label}</h3>
      <span className="tcard__tags">
        {task.deliverable && !done ? (
          <span className="tcard__clip" title="Attend des fichiers" aria-hidden>
            ↑
          </span>
        ) : null}
        {task.milestone && !done && !submitted ? (
          <span className={`pill pill--${MILESTONE_TONE[task.milestone]} tiny`}>
            {MILESTONE_LABELS[task.milestone]}
          </span>
        ) : null}
        {showTheme ? (
          <span className="pill tiny muted">{phaseClientLabel(task.phase)}</span>
        ) : null}
      </span>
    </>
  );

  const body = (
    <>
      {task.description ? <p className="tcard__why">{task.description}</p> : null}

      {task.due_date && !done && !submitted ? (
        <p className={overdue ? 'tiny tcard__due tcard__due--late' : 'tiny tcard__due'}>
          {overdue ? 'Attendu pour le ' : 'Pour le '}
          <strong>{formatDate(task.due_date)}</strong>
        </p>
      ) : null}

      {/* Ce qu'on attend en retour, et où le déposer. */}
      {task.deliverable ? (
        <div className="deliverable">
          <span className="section-title">Ce que tu m&apos;envoies</span>
          <p className="small">{task.deliverable}</p>

          {deposit ? (
            <a className="btn btn--small" href={deposit} target="_blank" rel="noreferrer">
              {depositLabel(deposit)} ↗
            </a>
          ) : (
            <p className="tiny muted">
              Le dossier où déposer n&apos;est pas encore ouvert. Je te l&apos;envoie très vite —
              en attendant, rien ne t&apos;empêche de préparer les fichiers.
            </p>
          )}
        </div>
      ) : null}

      {task.client_note ? (
        <p className="tcard__note">
          <span className="section-title">Ce que tu m&apos;as écrit</span>
          {task.client_note}
        </p>
      ) : null}

      {submitted ? (
        <p className="tcard__state tcard__state--review">
          <span aria-hidden>◔</span> Bien reçu{' '}
          {task.submitted_at ? `le ${formatDateTime(task.submitted_at)}` : ''}. Je regarde et je te
          confirme.
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
          <button className="btn btn--ghost btn--small" type="submit" name="_intent" value="reopen">
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
              <button
                className="btn btn--ghost btn--small"
                type="submit"
                name="_intent"
                value="note"
              >
                Envoyer le mot
              </button>
            </div>
          </div>
        </details>
      </form>
    </>
  );

  if (collapsible) {
    return (
      <details className="tcard tcard--fold" id={`tache-${task.id}`} data-status={task.status}>
        <summary className="tcard__head">{head}</summary>
        <div className="tcard__body">{body}</div>
      </details>
    );
  }

  return (
    <article className="tcard" id={`tache-${task.id}`} data-status={task.status}>
      <header className="tcard__head">{head}</header>
      {body}
    </article>
  );
}

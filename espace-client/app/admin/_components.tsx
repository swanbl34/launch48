/** Briques de formulaire partagées par les écrans admin. */
import { formatDate, formatDateTime } from '@/lib/format';
import { PHASES } from '@/lib/task-templates';
import {
  MILESTONE_LABELS,
  MILESTONE_TONE,
  TASK_STATUS_LABELS,
  type Task,
} from '@/lib/types';
import { deleteTask, moveTask, reviewTask, updateTask } from './actions';

export function Input({
  name,
  label,
  defaultValue,
  type = 'text',
  required,
  placeholder,
  help,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  help?: string;
}) {
  return (
    <div className="field">
      <label className="field__label" htmlFor={name}>
        {label}
      </label>
      {help ? <span className="field__help">{help}</span> : null}
      <input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue}
        required={required}
        placeholder={placeholder}
      />
    </div>
  );
}

export function Select({
  name,
  label,
  defaultValue,
  options,
}: {
  name: string;
  label: string;
  defaultValue: string;
  options: string[];
}) {
  return (
    <div className="field">
      <label className="field__label" htmlFor={name}>
        {label}
      </label>
      <select id={name} name={name} defaultValue={defaultValue}>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

/**
 * Les champs qui composent une tâche envoyée au client.
 *
 * Partagés entre l'édition d'une tâche existante et la création d'une
 * nouvelle : c'est le même objet, il ne doit pas y avoir deux vérités sur ce
 * qu'on peut y mettre.
 */
export function TaskFields({
  idPrefix,
  task,
}: {
  /** Préfixe des `id`, pour que deux formulaires cohabitent sur la page. */
  idPrefix: string;
  task?: Task;
}) {
  const id = (name: string) => `${idPrefix}-${name}`;

  return (
    <>
      <div className="field">
        <label className="field__label" htmlFor={id('label')}>
          Intitulé
        </label>
        <input
          id={id('label')}
          name="label"
          type="text"
          required
          defaultValue={task?.label ?? ''}
          placeholder="Photographier chaque pièce, plusieurs angles"
        />
      </div>

      <div className="field">
        <label className="field__label" htmlFor={id('description')}>
          Le pourquoi
        </label>
        <span className="field__help">
          Lu tel quel par le client, sous l&apos;intitulé. C&apos;est ce qui transforme une
          corvée en décision comprise.
        </span>
        <textarea
          id={id('description')}
          name="description"
          rows={3}
          maxLength={4000}
          defaultValue={task?.description ?? ''}
          placeholder="Y compris le défaut quand il y en a un : le montrer fait vendre, le cacher génère des retours."
        />
      </div>

      <div className="field">
        <label className="field__label" htmlFor={id('deliverable')}>
          Livrable attendu
        </label>
        <span className="field__help">
          Laisse vide si la tâche ne demande aucun fichier. Rempli, elle affiche le bouton de
          dépôt et passe par « à valider » au lieu d&apos;être terminée sur parole.
        </span>
        <textarea
          id={id('deliverable')}
          name="deliverable"
          rows={2}
          maxLength={600}
          defaultValue={task?.deliverable ?? ''}
          placeholder="Un dossier par pièce, 3 angles minimum, le défaut photographié de près."
        />
      </div>

      <div className="grid-2">
        <div className="field">
          <label className="field__label" htmlFor={id('phase')}>
            Phase
          </label>
          <select id={id('phase')} name="phase" defaultValue={task?.phase ?? PHASES[0].key}>
            {PHASES.map((ph) => (
              <option key={ph.key} value={ph.key}>
                {ph.label}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label className="field__label" htmlFor={id('owner')}>
            Porteur
          </label>
          <select id={id('owner')} name="owner" defaultValue={task?.owner ?? 'client'}>
            <option value="client">Client</option>
            <option value="launch48">Launch48</option>
          </select>
        </div>

        <div className="field">
          <label className="field__label" htmlFor={id('milestone')}>
            Jalon
          </label>
          <select id={id('milestone')} name="milestone" defaultValue={task?.milestone ?? ''}>
            <option value="">Quand tu peux</option>
            <option value="ouverture">{MILESTONE_LABELS.ouverture}</option>
            <option value="livraison">{MILESTONE_LABELS.livraison}</option>
          </select>
        </div>

        <div className="field">
          <label className="field__label" htmlFor={id('due_date')}>
            Échéance (optionnelle)
          </label>
          <input
            id={id('due_date')}
            name="due_date"
            type="date"
            defaultValue={task?.due_date ?? ''}
          />
        </div>
      </div>

      <div className="field">
        <label className="field__label" htmlFor={id('drive_url')}>
          Dossier de dépôt propre à la tâche
        </label>
        <span className="field__help">
          Optionnel : sans lui, le client tombe sur le dossier Drive du projet. Utile pour
          isoler un lot de photos. https uniquement.
        </span>
        <input
          id={id('drive_url')}
          name="drive_url"
          type="url"
          inputMode="url"
          defaultValue={task?.drive_url ?? ''}
          placeholder="https://drive.google.com/drive/folders/…"
        />
      </div>
    </>
  );
}

/** Une tâche en admin : repliée par défaut, dépliée elle s'édite entièrement. */
export function AdminTaskRow({ task, projectId }: { task: Task; projectId: string }) {
  const hidden = (
    <>
      <input type="hidden" name="projectId" value={projectId} />
      <input type="hidden" name="taskId" value={task.id} />
    </>
  );

  return (
    <details className="admin-task" id={`tache-${task.id}`}>
      <summary>
        <span className={`dot dot--${task.status}`} aria-hidden />
        <span className="admin-task__label">{task.label}</span>
        <span className="admin-task__pills">
          {task.deliverable ? (
            <span className="pill tiny" title="Attend un livrable">
              📎
            </span>
          ) : null}
          {task.milestone ? (
            <span className={`pill pill--${MILESTONE_TONE[task.milestone]} tiny`}>
              {MILESTONE_LABELS[task.milestone]}
            </span>
          ) : null}
          <span className="pill tiny">{task.owner === 'client' ? 'Client' : 'L48'}</span>
          <span
            className={
              task.status === 'review' ? 'pill pill--accent tiny' : 'pill tiny muted'
            }
          >
            {TASK_STATUS_LABELS[task.status]}
          </span>
        </span>
      </summary>

      <div className="admin-task__body">
        {task.client_note ? (
          <p className="tcard__note">
            <span className="section-title">Mot du client</span>
            {task.client_note}
          </p>
        ) : null}

        <form action={updateTask} className="stack" style={{ gap: '0.9rem' }}>
          {hidden}
          <TaskFields idPrefix={`t-${task.id}`} task={task} />

          <div className="field">
            <label className="field__label" htmlFor={`t-${task.id}-status`}>
              Statut
            </label>
            <select id={`t-${task.id}-status`} name="status" defaultValue={task.status}>
              {Object.entries(TASK_STATUS_LABELS).map(([v, l]) => (
                <option key={v} value={v}>
                  {l}
                </option>
              ))}
            </select>
          </div>

          <div>
            <button className="btn btn--small" type="submit">
              Enregistrer
            </button>
          </div>
        </form>

        {/* Formulaires frères, jamais imbriqués : le HTML l'interdit. */}
        <div className="row admin-task__tools">
          <form action={moveTask}>
            {hidden}
            <button className="icon-btn" type="submit" name="dir" value="up" title="Monter">
              ↑
            </button>
          </form>
          <form action={moveTask}>
            {hidden}
            <button className="icon-btn" type="submit" name="dir" value="down" title="Descendre">
              ↓
            </button>
          </form>
          <form action={deleteTask} style={{ marginLeft: 'auto' }}>
            {hidden}
            <button className="icon-btn" type="submit" title="Supprimer la tâche">
              ✕ Supprimer
            </button>
          </form>
        </div>

        <p className="tiny muted">
          {task.created_at ? <>Créée le {formatDate(task.created_at)}</> : null}
          {task.submitted_at ? <> · Rendue le {formatDateTime(task.submitted_at)}</> : null}
          {task.done_at ? <> · Validée le {formatDateTime(task.done_at)}</> : null}
        </p>
      </div>
    </details>
  );
}

/**
 * La file d'attente : ce que le client a rendu et qu'il faut relire.
 *
 * C'est le seul endroit de l'admin où l'on agit sans réfléchir à la fiche —
 * on ouvre le dossier de dépôt, on regarde, on valide ou on renvoie.
 */
export function ReviewRow({
  task,
  projectId,
  depositUrl,
}: {
  task: Task;
  projectId: string;
  depositUrl: string | null;
}) {
  return (
    <div className="review-row">
      <div className="stack" style={{ gap: '0.3rem' }}>
        <strong>{task.label}</strong>
        <span className="tiny muted">
          Rendu {task.submitted_at ? `le ${formatDateTime(task.submitted_at)}` : ''}
          {task.deliverable ? ` · ${task.deliverable}` : ''}
        </span>
        {task.client_note ? <p className="small tcard__note">{task.client_note}</p> : null}
      </div>

      <div className="row" style={{ gap: '0.4rem' }}>
        {depositUrl ? (
          <a
            className="btn btn--ghost btn--small"
            href={depositUrl}
            target="_blank"
            rel="noreferrer"
          >
            Ouvrir le dépôt ↗
          </a>
        ) : null}
        <form action={reviewTask}>
          <input type="hidden" name="projectId" value={projectId} />
          <input type="hidden" name="taskId" value={task.id} />
          <button className="btn btn--small" type="submit" name="decision" value="ok">
            Valider
          </button>
        </form>
        <form action={reviewTask}>
          <input type="hidden" name="projectId" value={projectId} />
          <input type="hidden" name="taskId" value={task.id} />
          <button
            className="btn btn--ghost btn--small"
            type="submit"
            name="decision"
            value="retour"
          >
            Renvoyer
          </button>
        </form>
      </div>
    </div>
  );
}

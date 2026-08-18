/** Briques de formulaire partagées par les écrans admin. */
import { TASK_STATUS_LABELS, type Task } from '@/lib/types';
import { deleteTask, moveTask, updateTask } from './actions';

export function Input({
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

/** Une ligne éditable : intitulé, statut, porteur, réordonnancement, suppression. */
export function AdminTaskRow({ task, projectId }: { task: Task; projectId: string }) {
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

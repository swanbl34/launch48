/**
 * Le message qui accompagne l'envoi des tâches.
 *
 * Il n'y a volontairement pas de service d'e-mail transactionnel ici : ça
 * voudrait dire un abonnement de plus, un domaine à authentifier, et des
 * messages qui atterrissent en indésirables. L'app compose le texte, ton
 * client mail l'envoie — depuis ta vraie adresse, dans ton vrai fil de
 * discussion avec la cliente.
 */
import { formatDate } from './format';
import { MILESTONE_LABELS, type Project, type Task } from './types';

/** Au-delà, l'URL `mailto:` casse dans certains clients. Le texte complet
 *  reste copiable à côté. */
const MAILTO_MAX_TASKS = 12;

export type TaskEmail = {
  subject: string;
  /** Texte complet, pour le presse-papier. */
  body: string;
  /** Version tronquée, pour l'URL mailto. */
  shortBody: string;
  /** Nombre de tâches omises de la version courte. */
  omitted: number;
};

function line(task: Task): string {
  const parts = [`• ${task.label}`];
  if (task.milestone) parts.push(`  → ${MILESTONE_LABELS[task.milestone]}`);
  if (task.due_date) parts.push(`  → pour le ${formatDate(task.due_date)}`);
  if (task.deliverable) parts.push(`  → à fournir : ${task.deliverable}`);
  return parts.join('\n');
}

export function buildTaskEmail({
  project,
  tasks,
  espaceUrl,
}: {
  project: Project;
  /** Les tâches à annoncer, déjà triées. */
  tasks: Task[];
  /** URL de l'espace client, sans le chemin. */
  espaceUrl: string;
}): TaskEmail {
  const who = project.contact_name?.split(' ')[0] ?? 'bonjour';
  const blocking = tasks.filter((t) => t.milestone === 'ouverture').length;

  const intro = [
    `Bonjour ${who},`,
    '',
    tasks.length === 1
      ? "Il me manque une chose de ton côté pour continuer :"
      : `Il me manque ${tasks.length} choses de ton côté pour continuer :`,
    '',
  ];

  const outro = (extra: string) => [
    extra,
    '',
    'Le détail complet, avec le pourquoi de chaque point et le dossier où déposer les fichiers :',
    `${espaceUrl}/taches`,
    '',
    blocking > 0
      ? `${blocking} de ces points bloquent l'ouverture de la boutique — ce sont ceux à attaquer en premier.`
      : "Rien de tout ça n'est urgent au point de bloquer l'ouverture.",
    '',
    'Coche-les au fur et à mesure depuis ton espace, je vois les mises à jour en direct.',
    '',
    'À bientôt,',
    'Swan',
  ];

  const all = tasks.map(line).join('\n');
  const shortList = tasks.slice(0, MAILTO_MAX_TASKS).map(line).join('\n');
  const omitted = Math.max(0, tasks.length - MAILTO_MAX_TASKS);

  return {
    subject: `${project.company} — ce qu'il me faut de ton côté`,
    body: [...intro, all, '', ...outro('')].join('\n'),
    shortBody: [
      ...intro,
      shortList,
      '',
      ...outro(omitted > 0 ? `…et ${omitted} autre${omitted > 1 ? 's' : ''} point${omitted > 1 ? 's' : ''}.` : ''),
    ].join('\n'),
    omitted,
  };
}

/** L'URL `mailto:` prête à cliquer. */
export function mailtoLink(email: string | null, mail: TaskEmail): string {
  const query = `subject=${encodeURIComponent(mail.subject)}&body=${encodeURIComponent(mail.shortBody)}`;
  return `mailto:${email ?? ''}?${query}`;
}

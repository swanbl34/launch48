import { notFound } from 'next/navigation';

import { AppBar } from '@/app/_components/AppBar';
import { isAdmin } from '@/lib/auth';
import { getAssets, getFormAnswers, getProjectById, getTasks } from '@/lib/data';
import { computeMissing } from '@/lib/missing';
import { clientLoad, globalProgress } from '@/lib/progress';
import { STATUS_LABELS } from '@/lib/types';
import { logout } from '../../actions';

export const dynamic = 'force-dynamic';

/**
 * En-tête et onglets communs à la fiche projet.
 * Les pages enfants rechargent leurs propres données : c'est deux requêtes de
 * plus, mais ça garde chaque écran autonome et lisible.
 */
export default async function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  if (!(await isAdmin())) notFound();

  const { id } = await params;
  const project = await getProjectById(id);
  if (!project) notFound();

  const [answers, assets, tasks] = await Promise.all([
    getFormAnswers(project.id),
    getAssets(project.id),
    getTasks(project.id),
  ]);
  const { blocking, other } = computeMissing(answers.data, assets, tasks);
  const load = clientLoad(tasks);
  const base = `/admin/projet/${project.id}`;

  /* La pastille de l'onglet Tâches signale ce qui demande une action de MA
     part : d'abord ce que le client a rendu et qui attend ma validation, à
     défaut ce qui est bloqué. Un compteur de tâches restantes n'aurait rien
     dit — il resterait allumé tout le projet. */
  const toReview = load.submitted.length;

  return (
    <>
      <AppBar
        brandHref="/admin"
        title={project.company}
        meta={
          <>
            <span className="pill pill--accent">{project.pack}</span>
            <span className="pill">{STATUS_LABELS[project.status]}</span>
            <span className="pill">{globalProgress(tasks)}%</span>
          </>
        }
        action={
          <form action={logout}>
            <button className="btn btn--ghost btn--small" type="submit">
              Déconnexion
            </button>
          </form>
        }
        active={base}
        tabs={[
          { href: base, label: 'Fiche' },
          {
            href: `${base}/taches`,
            label: 'Tâches',
            badge: toReview || other.length,
            tone: toReview > 0 ? 'warn' : 'danger',
          },
          {
            href: `${base}/brief`,
            label: 'Brief',
            badge: blocking.length,
            tone: 'danger',
          },
        ]}
      />
      {children}
    </>
  );
}

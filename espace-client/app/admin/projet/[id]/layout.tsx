import { notFound } from 'next/navigation';

import { AppBar } from '@/app/_components/AppBar';
import { isAdmin } from '@/lib/auth';
import { getAssets, getFormAnswers, getProjectById, getTasks } from '@/lib/data';
import { computeMissing } from '@/lib/missing';
import { globalProgress } from '@/lib/progress';
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
  const { blocking, deferred, other } = computeMissing(answers.data, assets, tasks);
  const base = `/admin/projet/${project.id}`;

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
            badge: other.length,
            tone: 'danger',
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

import { isAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

/**
 * Coquille de l'admin : barre latérale sur desktop, barre horizontale sur
 * mobile. Absente tant qu'on n'est pas connecté, pour que l'écran de login
 * reste nu.
 */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!(await isAdmin())) return <>{children}</>;

  return (
    <div className="admin-shell">
      <aside className="sidebar">
        <a className="brand" href="/admin">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="brand__mark" src="/favicon-fusee.svg" alt="" width={26} height={26} />
          <span className="brand__name">Launch48</span>
        </a>
        <nav className="sidebar__nav">
          <a href="/admin">Projets</a>
          <a href="/admin#nouveau">Nouveau projet</a>
        </nav>
        <span className="sidebar__foot tiny muted">Espace d&apos;administration</span>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}

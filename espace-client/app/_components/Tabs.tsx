/**
 * Navigation par onglets, rendue côté serveur.
 *
 * L'onglet actif est passé en prop plutôt que déduit du pathname : ça évite
 * un composant client (usePathname) pour une information que chaque page
 * connaît déjà.
 */
export type TabItem = {
  href: string;
  label: string;
  /** Pastille de comptage, affichée seulement si > 0. */
  badge?: number;
  /** Couleur de la pastille. */
  tone?: 'danger' | 'warn';
};

export function Tabs({ items, active }: { items: TabItem[]; active: string }) {
  return (
    <nav className="tabs" aria-label="Sections">
      {items.map((t) => (
        <a
          key={t.href}
          href={t.href}
          className="tab"
          aria-current={t.href === active ? 'page' : undefined}
        >
          {t.label}
          {t.badge ? (
            <span className={`tab__badge tab__badge--${t.tone ?? 'danger'}`}>{t.badge}</span>
          ) : null}
        </a>
      ))}
    </nav>
  );
}

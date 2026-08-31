'use client';

import { usePathname } from 'next/navigation';

/**
 * Navigation par onglets.
 *
 * L'onglet actif se déduit du chemin courant, et non d'une prop.
 *
 * Avant, chaque page passait un `active` — ce qui marchait tant que la page
 * rendait elle-même ses onglets. Le jour où la fiche projet les a remontés
 * dans son `layout.tsx`, partagé par Fiche / Tâches / Brief, le layout n'avait
 * plus moyen de savoir sur quel enfant on se trouvait : il passait `active={base}`
 * en dur. Résultat, « Fiche » restait allumé sur les trois onglets.
 *
 * `usePathname` coûte une frontière client sur un composant qui ne rend que
 * des liens. C'est le prix de la seule information dont un layout ne dispose
 * pas côté serveur.
 */
export type TabItem = {
  href: string;
  label: string;
  /** Pastille de comptage, affichée seulement si > 0. */
  badge?: number;
  /** Couleur de la pastille. */
  tone?: 'danger' | 'warn' | 'accent';
};

export function Tabs({ items }: { items: TabItem[] }) {
  const pathname = usePathname();

  return (
    <nav className="tabs" aria-label="Sections">
      {items.map((t) => {
        // Comparaison stricte : /admin/projet/<id> est un préfixe de
        // /admin/projet/<id>/taches, un startsWith allumerait les deux.
        const current = pathname === t.href;
        return (
          <a
            key={t.href}
            href={t.href}
            className="tab"
            aria-current={current ? 'page' : undefined}
          >
            {t.label}
            {t.badge ? (
              <span className={`tab__badge tab__badge--${t.tone ?? 'danger'}`}>{t.badge}</span>
            ) : null}
          </a>
        );
      })}
    </nav>
  );
}

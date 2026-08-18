import { Brand } from './Brand';
import { Tabs, type TabItem } from './Tabs';

/**
 * Barre d'application collante : identité à gauche, contexte à droite,
 * onglets en dessous. Partagée par l'espace client et l'admin.
 */
export function AppBar({
  brandHref,
  title,
  meta,
  tabs,
  active,
  action,
}: {
  brandHref: string;
  title?: string;
  /** Pastilles de contexte (pack, statut…). */
  meta?: React.ReactNode;
  tabs?: TabItem[];
  active?: string;
  /** Bouton aligné à droite (déconnexion, retour…). */
  action?: React.ReactNode;
}) {
  return (
    <header className="appbar">
      <div className="appbar__top">
        <Brand href={brandHref} />
        {title ? <span className="appbar__title">{title}</span> : null}
        <div className="appbar__right">
          {meta}
          {action}
        </div>
      </div>
      {tabs?.length ? <Tabs items={tabs} active={active ?? ''} /> : null}
    </header>
  );
}

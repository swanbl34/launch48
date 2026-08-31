import type { IconName } from '@/lib/task-templates';

/**
 * Un repère visuel par thème.
 *
 * Une liste de vingt-cinq lignes de texte se lit ligne à ligne ; les mêmes
 * lignes avec un pictogramme par thème se balayent d'un coup d'œil. C'est le
 * seul rôle de ces dessins — ils ne portent aucune information que le libellé
 * ne porte pas déjà, d'où le `aria-hidden`.
 *
 * Tracés au trait, `currentColor`, 24×24 : ils prennent la couleur de leur
 * contexte et restent lisibles à 18 comme à 40 pixels.
 */
const PATHS: Record<IconName, React.ReactNode> = {
  flag: (
    <>
      <path d="M5 21V4" />
      <path d="M5 4h11l-1.6 3.5L16 11H5" />
    </>
  ),
  sparkle: (
    <>
      <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z" />
      <path d="M18.5 16.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z" />
    </>
  ),
  pen: (
    <>
      <path d="M4 20l4.5-1 9-9a2.1 2.1 0 0 0-3-3l-9 9z" />
      <path d="M13.5 5.5l3 3" />
    </>
  ),
  text: (
    <>
      <path d="M5 4h14" />
      <path d="M5 9h14" />
      <path d="M5 14h9" />
      <path d="M5 19h6" />
    </>
  ),
  camera: (
    <>
      <path d="M3 8.5A1.5 1.5 0 0 1 4.5 7h2.2l1.2-2h8.2l1.2 2h2.2A1.5 1.5 0 0 1 21 8.5v9A1.5 1.5 0 0 1 19.5 19h-15A1.5 1.5 0 0 1 3 17.5z" />
      <circle cx="12" cy="12.5" r="3.2" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3l7 2.5v6c0 4-3 7.3-7 9.5-4-2.2-7-5.5-7-9.5v-6z" />
      <path d="M9 12l2 2 4-4" />
    </>
  ),
  box: (
    <>
      <path d="M3 8l9-4 9 4v8l-9 4-9-4z" />
      <path d="M3 8l9 4 9-4" />
      <path d="M12 12v8" />
    </>
  ),
  truck: (
    <>
      <path d="M2 6h11v10H2z" />
      <path d="M13 9h4.5l3.5 3.2V16H13z" />
      <circle cx="7" cy="18" r="1.8" />
      <circle cx="17.5" cy="18" r="1.8" />
    </>
  ),
  layers: (
    <>
      <path d="M3 5.5h18v13H3z" />
      <path d="M3 9.5h18" />
      <path d="M7.5 5.5v4" />
    </>
  ),
  bag: (
    <>
      <path d="M5 8h14l-1 12H6z" />
      <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
    </>
  ),
  check: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M8.5 12.2l2.4 2.4 4.6-4.8" />
    </>
  ),
  rocket: (
    <>
      <path d="M12 3c3 2.2 4.6 5.4 4.6 9L12 16l-4.6-4c0-3.6 1.6-6.8 4.6-9z" />
      <circle cx="12" cy="9.5" r="1.8" />
      <path d="M9 16.5L7 21l4-1.6M15 16.5L17 21l-4-1.6" />
    </>
  ),
};

export function PhaseIcon({ name, size = 20 }: { name: IconName; size?: number }) {
  return (
    <svg
      className="picto"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
    >
      {PATHS[name]}
    </svg>
  );
}

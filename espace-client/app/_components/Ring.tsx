/**
 * L'avancement en anneau.
 *
 * Une barre de progression de 5 pixels de haut se lit comme un indicateur de
 * chargement — quelque chose qui se remplit tout seul pendant qu'on regarde
 * ailleurs. L'anneau, lui, se lit comme un état : voilà où en est le projet.
 * C'est le repère visuel principal du tableau de bord, il mérite la place.
 *
 * Deux arcs : la part validée en plein, la part rendue mais pas encore relue
 * en pointillé. Dessiné en SVG pur, sans JavaScript.
 */
export function Ring({
  done,
  submitted,
  size = 132,
}: {
  /** % validé. */
  done: number;
  /** % validé + rendu. Doit être ≥ done. */
  submitted?: number;
  size?: number;
}) {
  const clamp = (n: number) => Math.max(0, Math.min(100, n));
  const d = clamp(done);
  const s = Math.max(d, clamp(submitted ?? done));

  const stroke = Math.max(8, Math.round(size * 0.075));
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const arc = (pct: number) => `${(pct / 100) * circumference} ${circumference}`;

  return (
    <svg
      className="ring"
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label={
        s > d ? `${Math.round(d)} % terminé, ${Math.round(s - d)} % en attente de vérification` : `${Math.round(d)} % terminé`
      }
    >
      <defs>
        <linearGradient id="ring-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--accent-3)" />
          <stop offset="100%" stopColor="var(--accent)" />
        </linearGradient>
      </defs>

      {/* Le tour complet, en creux. */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="color-mix(in srgb, var(--muted), transparent 82%)"
        strokeWidth={stroke}
      />

      {/* L'arc « rendu, pas encore relu ». */}
      {s > d ? (
        <circle
          className="ring__pending"
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--accent-4)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={arc(s)}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      ) : null}

      {/* L'arc validé. */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="url(#ring-grad)"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={arc(d)}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />

      <text
        className="ring__figure"
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="central"
      >
        {Math.round(d)}%
      </text>
    </svg>
  );
}

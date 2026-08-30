export function Bar({ value, thin = false }: { value: number; thin?: boolean }) {
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div
      className={thin ? 'bar bar--thin' : 'bar'}
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className="bar__fill" style={{ width: `${pct}%` }} />
    </div>
  );
}

/**
 * Barre à deux segments : ce qui est validé, puis ce qui est rendu et attend
 * notre relecture.
 *
 * Le second segment n'est pas de la décoration. Un client qui a envoyé ses
 * photos hier et voit toujours le même pourcentage a l'impression que son
 * travail s'est perdu ; ce liseré plus clair lui dit « c'est arrivé, la balle
 * est chez nous ».
 */
export function SegmentedBar({
  done,
  submitted,
  thin = false,
}: {
  /** % validé. */
  done: number;
  /** % validé + rendu. Doit être ≥ done. */
  submitted: number;
  thin?: boolean;
}) {
  const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));
  const d = clamp(done);
  const s = Math.max(d, clamp(submitted));

  return (
    <div
      className={thin ? 'bar bar--thin' : 'bar'}
      role="progressbar"
      aria-valuenow={d}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuetext={s > d ? `${d}% validé, ${s - d}% en attente de validation` : `${d}%`}
    >
      {s > d ? <div className="bar__pending" style={{ width: `${s}%` }} /> : null}
      <div className="bar__fill" style={{ width: `${d}%` }} />
    </div>
  );
}

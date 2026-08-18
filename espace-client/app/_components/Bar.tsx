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

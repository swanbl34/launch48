/** En-tête commun : fusée + wordmark, aux couleurs de launch48.fr. */
export function Brand({ href = 'https://launch48.fr' }: { href?: string }) {
  return (
    <a className="brand" href={href}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="brand__mark" src="/favicon-fusee.svg" alt="" width={26} height={26} />
      <span className="brand__name">Launch48</span>
    </a>
  );
}

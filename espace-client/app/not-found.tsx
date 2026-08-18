export default function NotFound() {
  return (
    <main className="shell">
      <div className="stack center" style={{ paddingTop: '18vh', justifyItems: 'center' }}>
        <h1>Page introuvable</h1>
        <p className="muted" style={{ maxWidth: '38ch' }}>
          Ce lien n&apos;existe pas ou n&apos;est plus valide. Si tu as reçu une invitation,
          vérifie que l&apos;adresse a été copiée en entier.
        </p>
        <a className="btn btn--ghost" href="https://launch48.fr">
          Retour à launch48.fr
        </a>
      </div>
    </main>
  );
}

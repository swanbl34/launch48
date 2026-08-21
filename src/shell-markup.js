/* ═══════════════════════════════════════════════════════════════════════════
   Gabarits du socle — en-tête et pied de page

   Séparés de shell.js parce que ce sont des fonctions pures : elles rendent des
   chaînes, sans toucher au DOM ni à `window`. C'est ce qui permet de les appeler
   côté Node, au moment du build, pour pré-rendre les pages verticales
   (voir vite-plugin-prerender.js). shell.js, lui, lit `window.matchMedia` dès
   son chargement et ne peut pas être importé hors navigateur.

   Toute modification ici change l'en-tête et le pied de page de TOUTES les
   pages du site, statiques comme pré-rendues.
   ═══════════════════════════════════════════════════════════════════════════ */

const NAV_LINKS = [
  { label: 'Réalisations', href: '/offres/' },
  { label: 'Tarifs', href: '/#tarifs' },
  { label: 'Blog', href: '/blog/' },
];

export const renderShellHeader = () => `
  <header class="header" id="top">
    <div class="header__inner">
      <a class="brand" href="/" aria-label="Launch48, accueil">
        <img class="brand__logo" src="/logo-launch48.svg" alt="Launch48" width="430" height="88" />
      </a>
      <nav class="nav" aria-label="Navigation principale">
        <span class="nav__pill" aria-hidden="true"></span>
        ${NAV_LINKS.map((l) => `<a href="${l.href}">${l.label}</a>`).join('')}
      </nav>
      <div class="header__actions">
        <a class="btn btn--primary btn--sm header__cta" href="/devis/"><svg class="header__cta-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6.6 3.4h3l1.5 3.8-2 1.4a10.8 10.8 0 0 0 5.3 5.3l1.4-2 3.8 1.5v3a1.9 1.9 0 0 1-2.1 1.9A15.6 15.6 0 0 1 4.7 5.5a1.9 1.9 0 0 1 1.9-2.1Z" /></svg><span class="header__cta-label">Lancer mon site</span></a>
        <button class="burger" type="button" aria-expanded="false" aria-controls="menu-mobile" aria-label="Ouvrir le menu">
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </button>
      </div>
    </div>
    <div class="menu-mobile" id="menu-mobile" hidden>
      <nav aria-label="Navigation mobile">
        ${NAV_LINKS.map((l) => `<a href="${l.href}"><span>${l.label}</span></a>`).join('')}
        <a href="/#audit"><span>Audit gratuit</span></a>
      </nav>
    </div>
  </header>
`;

export const renderShellFooter = () => `
  <footer class="footer">
    <div class="container footer__top">
      <div class="footer__brand">
        <a class="brand" href="/" aria-label="Launch48, accueil">
          <img class="brand__logo" src="/logo-launch48.svg" alt="Launch48" width="430" height="88" loading="lazy" />
        </a>
        <p class="footer__baseline">
          Des sites internet professionnels livrés en 48h, à prix fixe,
          pour les pros de terrain : artisans, restaurants, santé, commerces locaux.
        </p>
        <a class="footer__mail" href="mailto:contact@launch48.fr">contact@launch48.fr</a>
        <ul class="footer__socials">
          <li>
            <a href="https://www.linkedin.com/company/launch48-fr/" target="_blank" rel="noopener" aria-label="Launch48 sur LinkedIn">
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false" fill="currentColor">
                <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm6 0h3.8v1.7h.05c.53-.95 1.83-1.95 3.76-1.95C20.6 8.75 22 10.9 22 14.1V21h-4v-6.1c0-1.45-.03-3.3-2.02-3.3-2.02 0-2.33 1.57-2.33 3.2V21H9V9Z" />
              </svg>
            </a>
          </li>
          <li>
            <a href="https://www.instagram.com/launch48.fr/" target="_blank" rel="noopener" aria-label="Launch48 sur Instagram">
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.8">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
              </svg>
            </a>
          </li>
        </ul>
      </div>

      <nav class="footer__col" aria-label="L'offre">
        <p class="footer__title">L'offre</p>
        <ul>
          <li><a href="/#tarifs">Tarifs</a></li>
          <li><a href="/#methode">Comment ça marche</a></li>
          <li><a href="/#audit">Audit gratuit</a></li>
          <li><a href="/#faq">Questions fréquentes</a></li>
          <li><a href="/devis/">Demander un devis</a></li>
        </ul>
      </nav>

      <nav class="footer__col" aria-label="Secteurs">
        <p class="footer__title">Secteurs</p>
        <ul>
          <li><a href="/site-restaurant/">Restaurant</a></li>
          <li><a href="/site-consultant/">Consultant</a></li>
          <li><a href="/site-evenementiel/">Événementiel</a></li>
          <li><a href="/site-immobilier-location/">Immobilier</a></li>
          <li><a href="/offres/">Tous les secteurs</a></li>
        </ul>
      </nav>

      <nav class="footer__col" aria-label="Ressources">
        <p class="footer__title">Ressources</p>
        <ul>
          <li><a href="/blog/">Blog</a></li>
          <li><a href="/quiz/">Quiz : votre site convertit-il ?</a></li>
          <li><a href="/partenaires/">Devenir partenaire</a></li>
          <li><a href="/call/">Réserver un appel</a></li>
          <li><a href="mailto:contact@launch48.fr">Nous contacter</a></li>
        </ul>
      </nav>

      <div class="footer__cta">
        <p class="footer__title">Votre site en 48h</p>
        <p class="footer__cta-text">15 minutes d'appel suffisent pour démarrer.</p>
        <a class="btn btn--primary btn--sm btn--block" href="/devis/">Lancer mon site <span class="arrow" aria-hidden="true">→</span></a>
      </div>
    </div>

    <div class="container footer__bottom">
      <p class="footer__copy">© 2026 Launch48. Tous droits réservés.</p>
      <nav class="footer__legal" aria-label="Informations légales">
        <a href="/mentions-legales.html">Mentions légales</a>
        <a href="/politique-confidentialite.html">Politique de confidentialité</a>
        <a href="/cgv.html">CGV</a>
        <!-- Le choix sur la mesure d'audience doit rester révocable à tout
             moment et depuis n'importe quelle page : c'est une obligation, pas
             une courtoisie. L'écouteur est posé par consent.js. -->
        <button class="footer__legal-btn" type="button" data-consent-open>Cookies</button>
      </nav>
      <p class="footer__note">
        Domaine offert pour un nom disponible à l'enregistrement, non premium et non vendu par un tiers.
        Hébergement inclus la 1<sup>re</sup> année, puis renouvelable au tarif annoncé dès le départ.
      </p>
    </div>
  </footer>
`;

/* Launch48 — comportements communs à toutes les pages.
   Barre de navigation en îlot, pastille du menu, menu mobile et apparitions
   au scroll. Chaque page appelle initShell() ; les modules spécifiques
   (scène du hero, carrousels, formulaires) restent dans leur propre fichier. */

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const isDesktop = () => window.matchMedia('(min-width: 900px)').matches;

const setupHeader = () => {
  const header = document.querySelector('.header');
  if (!header) return;

  let ticking = false;
  const update = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 8);
    ticking = false;
  };

  update();
  window.addEventListener(
    'scroll',
    () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    },
    { passive: true }
  );
};

/* ── Menu central : indicateur coulissant + section en cours ─────────────── */
const setupNavPill = () => {
  const nav = document.querySelector('.nav');
  const pill = nav?.querySelector('.nav__pill');
  const links = Array.from(nav?.querySelectorAll('a') || []);
  if (!nav || !pill || !links.length) return;

  let current = null;

  const moveTo = (link) => {
    if (!link || !isDesktop()) {
      nav.style.setProperty('--pill-o', '0');
      return;
    }
    nav.style.setProperty('--pill-x', `${link.offsetLeft}px`);
    nav.style.setProperty('--pill-w', `${link.offsetWidth}px`);
    nav.style.setProperty('--pill-o', '1');
  };

  const reset = () => moveTo(current);

  links.forEach((link) => {
    link.addEventListener('pointerenter', () => moveTo(link));
    link.addEventListener('focus', () => moveTo(link));
  });
  nav.addEventListener('pointerleave', reset);
  nav.addEventListener('focusout', reset);
  window.addEventListener('resize', reset);

  // Section en cours : on suit celle qui occupe le haut de l'écran.
  const sections = links
    .map((link) => {
      const id = link.getAttribute('href');
      const target = id?.startsWith('#') ? document.querySelector(id) : null;
      return target ? { link, target } : null;
    })
    .filter(Boolean);

  if (!sections.length || !('IntersectionObserver' in window)) return;

  // Les liens ne suivent pas l'ordre de la page (Réalisations vient avant
  // Tarifs dans le document) : on trie pour que « la première trouvée » soit
  // bien la section la plus haute.
  sections.sort((a, b) =>
    a.target.compareDocumentPosition(b.target) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
  );

  const setCurrent = (link) => {
    if (current === link) return;
    if (!link) {
      current = null;
      links.forEach((other) => {
        other.classList.remove('is-current');
        other.removeAttribute('aria-current');
      });
      reset();
      return;
    }
    current = link;
    links.forEach((other) => {
      const active = other === link;
      other.classList.toggle('is-current', active);
      if (active) other.setAttribute('aria-current', 'true');
      else other.removeAttribute('aria-current');
    });
    reset();
  };

  // On garde la liste des sections dans la bande de lecture et on retient la
  // plus haute : sinon, deux sections visibles au chargement se disputent
  // l'état « en cours ».
  const inBand = new Set();
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) inBand.add(entry.target);
        else inBand.delete(entry.target);
      });
      const active = sections.find(({ target }) => inBand.has(target));
      setCurrent(active ? active.link : null);
    },
    { rootMargin: '-25% 0px -65% 0px' }
  );

  sections.forEach(({ target }) => observer.observe(target));
};

/* ── Menu mobile ─────────────────────────────────────────────────────────── */
const setupMobileMenu = () => {
  const burger = document.querySelector('.burger');
  const menu = document.querySelector('#menu-mobile');
  if (!burger || !menu) return;

  const close = () => {
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Ouvrir le menu');
    menu.hidden = true;
  };

  burger.addEventListener('click', () => {
    const open = burger.getAttribute('aria-expanded') === 'true';
    if (open) {
      close();
      return;
    }
    burger.setAttribute('aria-expanded', 'true');
    burger.setAttribute('aria-label', 'Fermer le menu');
    menu.hidden = false;
  });

  menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', close));

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !menu.hidden) {
      close();
      burger.focus();
    }
  });

  // Un appui à côté referme le menu : sur mobile, viser la croix n'est pas
  // toujours le réflexe.
  document.addEventListener('pointerdown', (event) => {
    if (menu.hidden) return;
    if (menu.contains(event.target) || burger.contains(event.target)) return;
    close();
  });

  window.addEventListener('resize', () => {
    if (isDesktop() && !menu.hidden) close();
  });
};

/* ── Reveal au scroll (une seule fois, avec stagger sur les groupes) ─────── */
const setupReveal = () => {
  const items = Array.from(document.querySelectorAll('[data-reveal]'));
  if (!items.length) return;

  const showAll = () => items.forEach((item) => item.classList.add('is-visible'));

  if (reduceMotion.matches || !('IntersectionObserver' in window)) {
    showAll();
    return;
  }

  // Décalage en cascade pour les enfants d'un même groupe.
  document.querySelectorAll('[data-stagger]').forEach((group) => {
    group.querySelectorAll(':scope > [data-reveal]').forEach((child, index) => {
      child.style.setProperty('--reveal-delay', `${Math.min(index, 6) * 100}ms`);
    });
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.12 }
  );

  items.forEach((item) => observer.observe(item));

  // Le contenu déjà visible au chargement ne doit pas attendre un scroll.
  reduceMotion.addEventListener?.('change', (event) => {
    if (event.matches) showAll();
  });
};

/* ── Parallaxe lente des halos cyan (desktop uniquement) ─────────────────── */


/* ── Gabarits partagés ───────────────────────────────────────────────────
   La home a son markup en dur dans index.html ; les autres pages passent par
   ces gabarits, soit à la construction (verticales.js), soit en remplaçant
   l'ancien header/footer déjà présent dans le HTML (mountShell).          */

const NAV_LINKS = [
  { label: 'Tarifs', href: '/#tarifs' },
  { label: 'Réalisations', href: '/offres/' },
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
        <a class="btn btn--primary btn--sm" href="/devis/">Lancer mon site</a>
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
      </nav>
      <p class="footer__note">
        Domaine offert pour un nom disponible à l'enregistrement, non premium et non vendu par un tiers.
        Hébergement inclus la 1<sup>re</sup> année, puis renouvelable au tarif annoncé dès le départ.
      </p>
    </div>
  </footer>
`;

/* Remplace l'ancien header/footer d'une page statique par les nouveaux. */
export const mountShell = () => {
  const oldHeader = document.querySelector('.site-header');
  if (oldHeader) oldHeader.outerHTML = renderShellHeader();

  const oldFooter = document.querySelector('.site-footer');
  if (oldFooter) oldFooter.outerHTML = renderShellFooter();
};

export const initShell = () => {
  setupHeader();
  setupNavPill();
  setupMobileMenu();
  setupReveal();
};

export { reduceMotion, isDesktop };

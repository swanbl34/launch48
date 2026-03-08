import './styles.css';
import './verticales.css';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { CONTACT, OFFERS, SITE } from './offers-data';

gsap.registerPlugin(ScrollTrigger);

const app = document.querySelector('#app');
const pageType = document.body.dataset.page || 'home';
const offerSlug = document.body.dataset.offerSlug || '';
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const FALLBACK_OFFER = OFFERS[0];

const setMeta = ({ title, description }) => {
  document.title = title;

  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) metaDescription.setAttribute('content', description);

  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute('content', title);

  const ogDescription = document.querySelector('meta[property="og:description"]');
  if (ogDescription) ogDescription.setAttribute('content', description);

  const ogUrl = document.querySelector('meta[property="og:url"]');
  if (ogUrl) ogUrl.setAttribute('content', window.location.href);
};

const asLink = (label, href, classes = 'btn') => `<a class="${classes}" href="${href}">${label}</a>`;

const offerPath = (slug) => `/${slug}/`;
const verticalMenuLinks = `
  <a href="/offres/">Toutes les offres</a>
  <a href="/site-evenementiel/">Site événementiel</a>
  <a href="/site-consultant/">Site consultant</a>
  <a href="/site-lancement-marque/">Lancement marque</a>
  <a href="/site-restaurant/">Restaurant</a>
  <a href="/site-artiste/">Artiste / portfolio</a>
  <a href="/site-media-podcast/">Média / podcast</a>
  <a href="/site-association/">Association</a>
  <a href="/site-immobilier-location/">Immobilier / location</a>
`;

const renderHeader = (active = 'home') => `
  <header class="site-header" id="top">
    <nav class="nav container" aria-label="Navigation principale">
      <a class="brand" href="/">
        <span class="brand__name">${SITE.name}</span>
      </a>
      <div class="nav__links">
        <a href="/">Accueil</a>
        <a href="/offres/">Offres</a>
        <a href="/#process">Process</a>
        <a href="/#contact">Contact</a>
        <div class="nav-dropdown nav-dropdown--desktop">
          <button class="nav-dropdown__toggle" type="button" aria-expanded="false" aria-controls="nav-verticales-menu-desktop">Verticales</button>
          <div class="nav-dropdown__menu" id="nav-verticales-menu-desktop">
            ${verticalMenuLinks}
          </div>
        </div>
      </div>
      <div class="nav__actions">
        <div class="nav-dropdown nav-dropdown--mobile">
          <button class="nav-dropdown__toggle" type="button" aria-expanded="false" aria-controls="nav-verticales-menu-mobile">Verticales</button>
          <div class="nav-dropdown__menu" id="nav-verticales-menu-mobile">
            ${verticalMenuLinks}
          </div>
        </div>
        <button class="theme-toggle" type="button" aria-label="Basculer thème">Clair</button>
        ${asLink(CONTACT.primaryLabel, CONTACT.primaryHref, 'btn btn--small magnetic')}
      </div>
    </nav>
  </header>
`;

const renderFooter = () => `
  <footer class="site-footer section container">
    <p class="site-footer__name">${SITE.name}</p>
    <a href="mailto:contact@launch48.dev">contact@launch48.dev</a>
    <div class="site-footer__socials">
      ${SITE.socials.map((social) => `<a href="${social.href}" target="_blank" rel="noreferrer">${social.label}</a>`).join('')}
    </div>
    <div class="site-footer__legal">
      ${SITE.legalLinks.map((link) => `<a href="${link.href}">${link.label}</a>`).join('')}
    </div>
  </footer>
`;

const renderOfferCard = (offer, variant = 'compact') => {
  if (variant === 'detailed') {
    return `
      <article class="offer-card" data-reveal>
        <p class="offer-card__label">${offer.name}</p>
        <p class="offer-card__target"><strong>Cible:</strong> ${offer.target}</p>
        <p class="offer-card__benefit"><strong>Bénéfice:</strong> ${offer.benefit}</p>
        <p class="offer-card__price">À partir de ${offer.priceFrom}</p>
        <a class="btn btn--ghost" href="${offerPath(offer.slug)}">Voir l'offre</a>
      </article>
    `;
  }

  return `
    <article class="offer-card" data-reveal>
      <p class="offer-card__label">${offer.name}</p>
      <p class="offer-card__description">${offer.shortDescription}</p>
      <p class="offer-card__price">À partir de ${offer.priceFrom}</p>
      <a class="btn btn--ghost" href="${offerPath(offer.slug)}">Voir l'offre</a>
    </article>
  `;
};

const renderFloatingCta = (label = 'Parler de mon projet') => `
  <div class="floating-cta">
    <a class="btn" href="${CONTACT.primaryHref}">${label}</a>
  </div>
`;

const renderReusableCtaBlock = () => `
  <section class="section cta-inline" data-reveal>
    <div class="container cta-inline__card">
      <div>
        <p class="kicker">CTA contact</p>
        <h2>Un besoin précis ? On vous oriente vers la meilleure offre.</h2>
        <p>Objectif, contexte, budget, timing: vous obtenez une recommandation claire et une proposition adaptée.</p>
      </div>
      <div class="cta-inline__actions">
        ${asLink(CONTACT.primaryLabel, CONTACT.primaryHref, 'btn')}
        ${asLink(CONTACT.secondaryLabel, CONTACT.secondaryHref, 'btn btn--ghost')}
      </div>
    </div>
  </section>
`;

const renderContactCard = ({ kicker, title, text, actions }) => `
  <div class="contact-card" data-reveal>
    <div class="contact-card__content">
      <p class="kicker">${kicker}</p>
      <h2>${title}</h2>
      <p>${text}</p>
    </div>
    <div class="contact-card__actions hero-actions">
      ${actions}
    </div>
  </div>
`;

const renderHome = () => {
  setMeta({
    title: 'Launch48 | Offres web par besoin métier',
    description: 'Des landing pages premium conçues pour des usages concrets: événement, consultant, marque, food, média, association, immobilier.'
  });

  app.innerHTML = `
    ${renderHeader('home')}
    <main id="main">
      <section class="hero section container" data-reveal>
        <p class="kicker">Sites premium orientés conversion</p>
        <h1>Des sites conçus pour votre besoin métier, pas un modèle générique.</h1>
        <p class="lead">Nous structurons des pages claires, crédibles et performantes pour accélérer vos résultats: plus de demandes, plus de réservations, plus d'inscriptions.</p>
        <div class="hero-actions">
          ${asLink('Découvrir toutes les offres', '/offres/', 'btn')}
          ${asLink(CONTACT.secondaryLabel, CONTACT.secondaryHref, 'btn btn--ghost')}
        </div>
        <div class="hero-highlights">
          <p><strong>8 verticales</strong> prêtes à lancer</p>
          <p><strong>Dès 890 €</strong> avec structure claire</p>
          <p><strong>Mobile first</strong> et CTA visibles</p>
        </div>
      </section>

      <section class="section container" id="verticales">
        <div class="section-head" data-reveal>
          <h2>Des sites pensés pour des besoins concrets</h2>
          <p>Nous concevons des sites adaptés à des usages précis : événement, lancement de marque, activité de service, média, restauration, portfolio, association, immobilier, etc.</p>
        </div>
        <div class="offers-grid">
          ${OFFERS.map((offer) => renderOfferCard(offer, 'compact')).join('')}
        </div>
        <div class="section-actions" data-reveal>
          ${asLink('Découvrir toutes les offres', '/offres/', 'btn')}
        </div>
      </section>

      <section class="section container" id="process">
        <div class="section-head" data-reveal>
          <h2>Un process simple, rapide et lisible</h2>
          <p>Chaque projet suit une structure claire pour sécuriser le résultat commercial et raccourcir le délai de mise en ligne.</p>
        </div>
        <div class="step-grid">
          <article class="step-card" data-reveal>
            <p class="step-label">01 • Cadrage</p>
            <h3>Positionnement et structure de page</h3>
            <p>On clarifie l'offre, la cible et le message clé pour construire une base orientée conversion.</p>
          </article>
          <article class="step-card" data-reveal>
            <p class="step-label">02 • Production</p>
            <h3>Design premium et intégration responsive</h3>
            <p>Nous créons une expérience visuelle cohérente, éditable et performante sur mobile comme sur desktop.</p>
          </article>
          <article class="step-card" data-reveal>
            <p class="step-label">03 • Mise en ligne</p>
            <h3>Livraison claire et activation rapide</h3>
            <p>Le site est prêt à convertir avec des CTA stratégiques, une structure lisible et une base évolutive.</p>
          </article>
        </div>
      </section>

      ${renderReusableCtaBlock()}

      <section class="section container" id="contact">
        ${renderContactCard({
          kicker: 'Parlons de votre projet',
          title: 'Vous avez un besoin spécifique ?',
          text: 'Nous pouvons aussi créer une landing page sur-mesure pour votre activité.',
          actions:
            asLink('Discuter de mon projet', CONTACT.primaryHref, 'btn') +
            asLink(CONTACT.secondaryLabel, CONTACT.secondaryHref, 'btn btn--ghost')
        })}
      </section>
    </main>
    ${renderFooter()}
    ${renderFloatingCta('Discuter de mon projet')}
  `;
};

const renderOffersPage = () => {
  setMeta({
    title: 'Offres par verticale | Launch48',
    description: 'Découvrez toutes les offres Launch48 par besoin métier et accédez à la landing page adaptée à votre activité.'
  });

  app.innerHTML = `
    ${renderHeader('offers')}
    <main id="main">
      <section class="hero section container" data-reveal>
        <p class="kicker">Offres par verticale</p>
        <h1>Trouvez l'offre adaptée à votre besoin métier</h1>
        <p class="lead">Nous ne vendons pas simplement un site. Nous concevons des expériences web adaptées à des cas d'usage précis.</p>
        <div class="hero-actions">
          ${asLink(CONTACT.primaryLabel, CONTACT.primaryHref, 'btn')}
          ${asLink('Retour à l\'accueil', '/', 'btn btn--ghost')}
        </div>
      </section>

      <section class="section container">
        <div class="offers-grid offers-grid--detailed">
          ${OFFERS.map((offer) => renderOfferCard(offer, 'detailed')).join('')}
        </div>
      </section>

      <section class="section container" id="contact">
        ${renderContactCard({
          kicker: 'Projet spécifique',
          title: 'Vous avez un besoin spécifique ?',
          text: 'Nous pouvons aussi créer une landing page sur-mesure pour votre activité.',
          actions: asLink('Discuter de mon projet', CONTACT.primaryHref, 'btn')
        })}
      </section>
    </main>
    ${renderFooter()}
    ${renderFloatingCta('Discuter de mon projet')}
  `;
};

const pickOtherNeeds = (slug) => {
  const others = OFFERS.filter((offer) => offer.slug !== slug);
  return others.slice(0, 4);
};

const renderVerticalSection = (section) => `
  <article class="vertical-block" data-reveal>
    <h2>${section.title}</h2>
    <ul>
      ${section.items.map((item) => `<li>${item}</li>`).join('')}
    </ul>
  </article>
`;

const renderPriceBlock = (offer) => `
  <section class="section container">
    <article class="price-card" data-reveal>
      <p class="kicker">Prix</p>
      <h2>À partir de ${offer.priceFrom}</h2>
      <p>${offer.pricingNote}</p>
      <div class="hero-actions">
        ${asLink(CONTACT.primaryLabel, CONTACT.primaryHref, 'btn')}
        ${asLink(CONTACT.secondaryLabel, CONTACT.secondaryHref, 'btn btn--ghost')}
      </div>
    </article>
  </section>
`;

const renderOptionsBlock = (offer) => `
  <section class="section container">
    <article class="vertical-block" data-reveal>
      <h2>Options possibles</h2>
      <ul class="options-grid">
        ${offer.options.map((option) => `<li>${option}</li>`).join('')}
      </ul>
    </article>
  </section>
`;

const renderOtherNeeds = (offer) => `
  <section class="section container">
    <div class="section-head" data-reveal>
      <h2>Autres besoins</h2>
      <p>Comparez rapidement d'autres verticales pour choisir la formule la plus pertinente.</p>
    </div>
    <div class="offers-grid offers-grid--mini">
      ${pickOtherNeeds(offer.slug)
        .map(
          (item) => `
            <article class="offer-card" data-reveal>
              <p class="offer-card__label">${item.name}</p>
              <p class="offer-card__price">À partir de ${item.priceFrom}</p>
              <a class="btn btn--ghost" href="${offerPath(item.slug)}">Voir l'offre</a>
            </article>
          `
        )
        .join('')}
    </div>
  </section>
`;

const renderVerticalPage = (slug) => {
  const offer = OFFERS.find((item) => item.slug === slug) || FALLBACK_OFFER;

  setMeta({
    title: `${offer.name} | Launch48`,
    description: `${offer.shortDescription} Offre à partir de ${offer.priceFrom}.`
  });

  app.innerHTML = `
    ${renderHeader('offers')}
    <main id="main">
      <section class="hero hero--vertical section container" data-reveal>
        <p class="kicker">${offer.hero.eyebrow}</p>
        <h1>${offer.hero.title}</h1>
        <p class="lead">${offer.hero.subtitle}</p>
        <div class="hero-actions">
          ${asLink(offer.hero.primaryCta, CONTACT.primaryHref, 'btn')}
          ${asLink(offer.hero.secondaryCta, offer.hero.secondaryCta.includes('offres') ? '/offres/' : CONTACT.secondaryHref, 'btn btn--ghost')}
        </div>
        <div class="hero-highlights hero-highlights--single">
          <p><strong>${offer.priceFrom}</strong> prix de départ</p>
          <p><strong>Objectif:</strong> clarté, crédibilité et conversion</p>
        </div>
        <div class="hero-media" aria-label="Zone visuelle immersive pour photo ou vidéo de couverture">
          <p>Espace visuel immersif</p>
          <small>Image ou vidéo hero selon votre direction artistique.</small>
        </div>
      </section>

      <section class="section container vertical-stack">
        ${offer.sections.map((section) => renderVerticalSection(section)).join('')}
      </section>

      ${renderReusableCtaBlock()}
      ${renderPriceBlock(offer)}
      ${renderOptionsBlock(offer)}

      <section class="section container">
        ${renderContactCard({
          kicker: 'CTA final',
          title: offer.finalCta,
          text: 'On construit une page alignée avec vos objectifs business, votre image et votre rythme de mise en ligne.',
          actions: asLink(offer.finalCta, CONTACT.primaryHref, 'btn')
        })}
      </section>

      ${renderOtherNeeds(offer)}
    </main>
    ${renderFooter()}
    ${renderFloatingCta('Discuter de mon projet')}
  `;
};

const setupTheme = () => {
  const savedTheme = localStorage.getItem('launch48-theme');
  if (savedTheme === 'light' || savedTheme === 'dark') {
    document.documentElement.dataset.theme = savedTheme;
  }

  const themeButton = document.querySelector('.theme-toggle');
  if (!themeButton) return;

  const updateLabel = () => {
    const currentTheme = document.documentElement.dataset.theme || 'dark';
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    const nextLabel = nextTheme === 'light' ? 'Clair' : 'Sombre';
    themeButton.textContent = nextLabel;
    themeButton.setAttribute('aria-label', `Activer le mode ${nextLabel.toLowerCase()}`);
    themeButton.dataset.nextTheme = nextTheme;
  };

  updateLabel();
  themeButton.addEventListener('click', () => {
    const currentTheme = document.documentElement.dataset.theme || 'dark';
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = nextTheme;
    localStorage.setItem('launch48-theme', nextTheme);
    updateLabel();
  });
};

const setupNavDropdown = () => {
  const dropdowns = Array.from(document.querySelectorAll('.nav-dropdown'));
  if (dropdowns.length === 0) return;

  const closeAll = () => {
    dropdowns.forEach((dropdown) => {
      dropdown.classList.remove('is-open');
      const toggle = dropdown.querySelector('.nav-dropdown__toggle');
      if (toggle) {
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  };

  dropdowns.forEach((dropdown) => {
    const toggle = dropdown.querySelector('.nav-dropdown__toggle');
    if (!toggle) return;

    toggle.addEventListener('click', (event) => {
      event.stopPropagation();
      const willOpen = !dropdown.classList.contains('is-open');
      closeAll();
      dropdown.classList.toggle('is-open', willOpen);
      toggle.setAttribute('aria-expanded', String(willOpen));
    });

    dropdown.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeAll);
    });
  });

  document.addEventListener('click', (event) => {
    if (!dropdowns.some((dropdown) => dropdown.contains(event.target))) {
      closeAll();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeAll();
  });
};

const setupRevealAnimations = () => {
  if (prefersReducedMotion) return;

  gsap.utils.toArray('[data-reveal]').forEach((element) => {
    gsap.fromTo(
      element,
      { autoAlpha: 0, y: 34 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.75,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 84%'
        }
      }
    );
  });
};

const setupBackgroundProgress = () => {
  const root = document.documentElement;
  const onScroll = () => {
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const progress = Math.min(1, window.scrollY / maxScroll);
    root.style.setProperty('--bg-progress', progress.toFixed(4));
  };

  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
};

const setupHeaderScrollState = () => {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 18);
  };

  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
};

const init = () => {
  if (pageType === 'offers') {
    renderOffersPage();
  } else if (pageType === 'vertical') {
    renderVerticalPage(offerSlug);
  } else {
    renderHome();
  }

  setupTheme();
  setupNavDropdown();
  setupBackgroundProgress();
  setupHeaderScrollState();
  setupRevealAnimations();
};

init();

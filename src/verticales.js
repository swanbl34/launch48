import './styles.css';
import './verticales.css';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { CONTACT, OFFERS, SITE, VERTICAL_DETAILS } from './offers-data';

gsap.registerPlugin(ScrollTrigger);

const app = document.querySelector('#app');
const pageType = document.body.dataset.page || 'home';
const offerSlug = document.body.dataset.offerSlug || '';
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const FALLBACK_OFFER = OFFERS[0];
const QUOTE_PROJECT_OPTIONS = [
  { value: 'one-page', label: 'Site vitrine / one-page' },
  ...OFFERS.map((offer) => ({ value: offer.slug, label: offer.name })),
  { value: 'partner', label: 'Partenaire' },
  { value: 'other', label: 'Autre besoin' }
];

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
        <img class="brand__logo" src="/logo-launch48.svg" alt="${SITE.name}" />
      </a>
      <div class="nav__links">
        <a href="/">Accueil</a>
        <a href="/#process">Process</a>
        <a href="/#contact">Contact</a>
        <div class="nav-dropdown nav-dropdown--desktop">
          <div class="nav-dropdown__trigger">
            <a class="nav-dropdown__link" href="/offres/">Secteurs</a>
            <button class="nav-dropdown__toggle" type="button" aria-expanded="false" aria-controls="nav-verticales-menu-desktop" aria-label="Ouvrir le menu Secteurs"></button>
          </div>
          <div class="nav-dropdown__menu" id="nav-verticales-menu-desktop">
            ${verticalMenuLinks}
          </div>
        </div>
      </div>
      <div class="nav__actions">
        <button class="theme-toggle nav-theme-mobile" type="button" role="switch" aria-checked="false" aria-label="Basculer thème">
          <span class="theme-toggle__track" aria-hidden="true">
            <span class="theme-toggle__thumb"></span>
          </span>
        </button>
        <button class="nav-burger" type="button" aria-expanded="false" aria-controls="nav-mobile-panel" aria-label="Ouvrir le menu">
          <span></span>
          <span></span>
          <span></span>
        </button>
        <button class="theme-toggle nav-theme-desktop" type="button" role="switch" aria-checked="false" aria-label="Basculer thème">
          <span class="theme-toggle__track" aria-hidden="true">
            <span class="theme-toggle__thumb"></span>
          </span>
        </button>
        ${asLink(CONTACT.primaryLabel, CONTACT.primaryHref, 'btn btn--small magnetic nav-cta-desktop')}
      </div>
    </nav>
    <div class="nav-mobile container" id="nav-mobile-panel" hidden>
      <div class="nav-mobile__panel">
        <div class="nav-mobile__group">
          <a href="/">Accueil</a>
          <a href="/#process">Process</a>
          <a href="/#contact">Contact</a>
          <a href="/offres/">Secteurs</a>
        </div>
        <div class="nav-mobile__group nav-mobile__group--muted">
          ${verticalMenuLinks}
        </div>
        <div class="nav-mobile__footer">
          ${asLink(CONTACT.primaryLabel, CONTACT.primaryHref, 'btn magnetic')}
        </div>
      </div>
    </div>
  </header>
`;

const renderFooter = () => `
  <footer class="site-footer section container">
    <p class="site-footer__name">${SITE.name}</p>
    <a href="mailto:contact@launch48.fr">contact@launch48.fr</a>
    <div class="site-footer__socials">
      <a href="https://www.linkedin.com/company/launch48-fr/">LinkedIn</a>
      <a href="https://www.instagram.com/launch48.fr/">Instagram</a>
    </div>
    <a class="btn btn--small site-footer__cta" href="/partenaires/">Devenir partenaire</a>
    <div class="site-footer__legal">
      ${SITE.legalLinks.map((link) => `<a href="${link.href}">${link.label}</a>`).join('')}
    </div>
    <a class="site-footer__powered" href="/" aria-label="Accueil Launch48">
      <span>Propulsé par</span>
      <img src="/logo-launch48.svg" alt="" aria-hidden="true" />
    </a>
  </footer>
`;

const getPreviewHref = (offer) => offer.preview?.href || offer.preview?.src || '/illustrations/hero-site-1.svg';
const getPreviewTitle = (offer) => offer.preview?.title || 'Aperçu de site';
const getPreviewAriaLabel = (offer) =>
  offer.preview?.ariaLabel ||
  (offer.preview?.href ? `Ouvrir la preview ${offer.name} dans un nouvel onglet` : "Ouvrir l'aperçu visuel en grand");
const getPreviewCaption = (offer) =>
  offer.preview?.caption || (offer.preview?.href ? 'Ouvrir la preview dans un nouvel onglet' : "Cliquer pour ouvrir l'image");
const getPreviewNote = (offer) => offer.preview?.note || '';
const getPreviewSpotlightContent = (offer) => ({
  kicker: offer.previewSpotlight?.kicker || `Exemple de ${offer.seo?.keyword || 'site internet'}`,
  title: offer.previewSpotlight?.title || `Voir un exemple grand format de ${offer.seo?.keyword || 'site internet'}`,
  text:
    offer.previewSpotlight?.text ||
    `Cette grande preview permet de visualiser plus concrètement la structure, le design et la hiérarchie d'un ${offer.seo?.keyword || 'site internet'} pensé pour convertir.`,
  cta: offer.previewSpotlight?.cta || 'Ouvrir la preview'
});

const renderPreviewSpotlight = (offer) => `
  <section class="section container" id="preview-demo">
    ${(() => {
      const content = getPreviewSpotlightContent(offer);
      return `
    <div class="section-head" data-reveal>
      <p class="kicker">${content.kicker}</p>
      <h2>${content.title}</h2>
      <p>${content.text}</p>
    </div>
    <div class="vertical-preview-spotlight" data-reveal>
      <a
        class="hero-media hero-media--preview vertical-preview-spotlight__media"
        href="${getPreviewHref(offer)}"
        target="_blank"
        rel="noreferrer"
        aria-label="${getPreviewAriaLabel(offer)}"
      >
        <img
          class="hero-media__image"
          src="${offer.preview?.src || '/illustrations/hero-site-1.svg'}"
          alt="${offer.preview?.alt || 'Aperçu visuel du site'}"
          decoding="async"
        />
        <span class="hero-media__caption">
          <strong>${getPreviewTitle(offer)}</strong>
          <small>${getPreviewCaption(offer)}</small>
        </span>
      </a>
      <div class="vertical-preview-spotlight__content">
        <p class="vertical-preview-spotlight__eyebrow">Accès direct</p>
        <h3>Ouvrir la page exemple en plein format</h3>
        <p>Cette capture reprend la démo complète de la verticale pour montrer le niveau de direction visuelle, de hiérarchie et de finition attendu sur ce type de site.</p>
        <div class="hero-actions">
          ${asLink(content.cta, getPreviewHref(offer), 'btn')}
        </div>
        ${getPreviewNote(offer) ? `<p class="vertical-preview-spotlight__note">${getPreviewNote(offer)}</p>` : ''}
      </div>
    </div>
      `;
    })()}
  </section>
`;

const getVerticalDetails = (offer) =>
  VERTICAL_DETAILS[offer.slug] || {
    idealFor: [offer.name],
    painPoints: ["Le besoin existe, mais la page actuelle n'aide pas assez à convertir."],
    outcomes: ['Une page plus claire, plus crédible et plus orientée action.'],
    pillars: [
      {
        label: 'Clarté',
        title: 'Message mieux hiérarchisé',
        text: 'La promesse devient plus lisible et plus rapide à comprendre.'
      }
    ],
    flow: [
      {
        label: '01',
        title: 'Promesse et structure',
        text: "On construit une page pensée pour le besoin métier et l'action attendue."
      }
    ],
    inclusions: ['Design premium', 'Structure claire', 'CTA bien placés']
  };

const renderOfferCard = (offer, variant = 'compact') => {
  if (variant === 'detailed') {
    return `
      <article class="offer-showcase-card" data-reveal>
        <a
          class="offer-showcase-card__media"
          href="${getPreviewHref(offer)}"
          target="_blank"
          rel="noreferrer"
          aria-label="${getPreviewAriaLabel(offer)}"
        >
          <img
            class="offer-showcase-card__image"
            src="${offer.preview?.src || '/illustrations/hero-site-1.svg'}"
            alt="${offer.preview?.alt || `Aperçu ${offer.name}`}"
            loading="lazy"
            decoding="async"
          />
        </a>
        <div class="offer-showcase-card__body">
          <div class="offer-showcase-card__top">
            <p class="offer-showcase-card__name">${offer.name}</p>
          </div>
          <p class="offer-showcase-card__description">${offer.shortDescription}</p>
          <div class="offer-showcase-card__facts">
            <p><strong>Cible</strong>${offer.target}</p>
            <p><strong>Bénéfice</strong>${offer.benefit}</p>
          </div>
          <div class="hero-actions">
            <a class="btn" href="${offerPath(offer.slug)}">Voir l'offre</a>
            <a class="btn btn--ghost" href="${CONTACT.primaryHref}">En parler</a>
          </div>
        </div>
      </article>
    `;
  }

  return `
    <article class="offer-card" data-reveal>
      <p class="offer-card__label">${offer.name}</p>
      <p class="offer-card__description">${offer.shortDescription}</p>
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
        <h2>Un besoin précis ? On vous aide à lancer votre site internet rapidement.</h2>
        <p>Objectif, contexte, budget et timing : vous obtenez une recommandation claire pour créer un site internet professionnel sans agence lourde.</p>
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
          <p><strong>Approche claire</strong> avec structure pensée pour convertir</p>
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
    title: 'Créer un site internet professionnel rapidement | Offres Launch48',
    description: 'Découvrez nos offres pour créer un site internet rapidement : site internet freelance, site internet restaurant rapide, site internet événement, site vitrine immobilier et plus.'
  });

  app.innerHTML = `
    ${renderHeader('offers')}
    <main id="main">
      <section class="hero section container" data-reveal>
        <p class="kicker">Sites internet par verticale</p>
        <h1>Choisissez le bon format pour créer votre site internet rapidement</h1>
        <p class="lead">Launch48 propose des sites internet professionnels pensés par besoin métier : site internet freelance, site internet événement, site internet restaurant rapide, site internet association rapide ou site vitrine immobilier.</p>
        <p class="lead">Les previews ci-dessous sont des exemples de sites créés par Launch48 pour illustrer chaque expertise. Il ne s'agit pas de sites clients existants.</p>
        <div class="hero-actions">
          ${asLink(CONTACT.primaryLabel, CONTACT.primaryHref, 'btn')}
          ${asLink('Retour à l\'accueil', '/', 'btn btn--ghost')}
        </div>
        <div class="hero-highlights">
          <p><strong>Site internet 48h</strong> pour lancer vite</p>
          <p><strong>Alternative agence web</strong> plus simple et plus directe</p>
          <p><strong>Site internet clé en main</strong> pensé conversion</p>
        </div>
      </section>

      <section class="section container offers-showcase">
        <aside class="offers-showcase__intro" data-reveal>
          <p class="kicker">Choisir votre format</p>
          <h2>Chaque site internet répond à une intention d'achat concrète</h2>
          <p>Au lieu de vendre un site internet générique, Launch48 construit des pages adaptées à des usages réels : vendre des billets, générer des rendez-vous, présenter une expertise, valoriser un bien ou lancer une marque.</p>
          <div class="offers-showcase__legend">
            <p><strong>Clarté</strong> message lisible dès les premières secondes</p>
            <p><strong>SEO</strong> bases propres pour lancer un site web vite</p>
            <p><strong>Conversion</strong> CTA et parcours orientés action</p>
          </div>
        </aside>
        <div class="offers-showcase__rail">
          ${OFFERS.map((offer) => renderOfferCard(offer, 'detailed')).join('')}
        </div>
      </section>

      <section class="section container" id="contact">
        ${renderContactCard({
          kicker: 'Projet spécifique',
          title: 'Vous avez un besoin spécifique ?',
          text: 'Nous pouvons aussi créer un site internet professionnel sur-mesure pour votre activité.',
          actions: asLink('Discuter de mon projet', CONTACT.primaryHref, 'btn')
        })}
      </section>
    </main>
    ${renderFooter()}
    ${renderFloatingCta('Discuter de mon projet')}
  `;
};

const renderQuotePage = () => {
  setMeta({
    title: 'Devis site internet en 48h | Launch48',
    description: 'Demandez un devis pour créer un site internet professionnel rapidement : site vitrine, landing page et site internet clé en main.'
  });

  const forfaitParam = new URLSearchParams(window.location.search).get('forfait');

  app.innerHTML = `
    ${renderHeader('quote')}
    <main id="main">
      <section class="section container section--call-embed">
        <div class="quote-layout">
          <article class="quote-panel" data-reveal>
            <p class="kicker">Préparer votre site internet</p>
            <h2>Les infos utiles pour créer votre site internet rapidement</h2>
            <ul class="quote-panel__list">
              <li>Le type de site internet ou de landing page que vous souhaitez lancer</li>
              <li>Le nom du projet ou de l'entreprise si vous l'avez déjà</li>
              <li>Votre objectif principal : vendre, réserver, présenter, générer des leads</li>
              <li>Votre timing et les éventuelles contraintes de lancement</li>
            </ul>
          </article>

          <article class="quote-form-card" data-reveal>
            <form action="https://formspree.io/f/xbdpgvgj" method="POST" class="launch48-form">
              <h3>Créer votre site internet en 48h</h3>
              <p>Décrivez votre besoin pour obtenir un site internet clé en main ou une alternative simple à une agence web.</p>

              <label>
                <span>Nom</span>
                <input type="text" name="name" placeholder="Votre nom" required />
              </label>

              <label>
                <span>Email</span>
                <input type="email" name="email" placeholder="votre@email.com" required />
              </label>

              <label>
                <span>Forfait souhaité</span>
                <select name="forfait" id="forfait-select">
                  <option value="">Pas encore décidé</option>
                  <option value="one-page">One Page — à partir de 590 €</option>
                  <option value="3-pages">Site 3 pages — à partir de 890 €</option>
                  <option value="5-pages">Site 5 pages + — à partir de 1 290 €</option>
                  <option value="sur-mesure">Sur mesure</option>
                </select>
              </label>

              <label>
                <span>Type de site</span>
                <select name="project_type" required>
                  <option value="">Sélectionnez</option>
                  ${QUOTE_PROJECT_OPTIONS.map((option) => `<option value="${option.value}">${option.label}</option>`).join('')}
                </select>
              </label>

              <label>
                <span>Nom du projet / entreprise</span>
                <input type="text" name="project_name" placeholder="Nom du projet" />
              </label>

              <label>
                <span>Avez-vous déjà un nom de domaine ?</span>
                <select name="domain">
                  <option value="no">Non</option>
                  <option value="yes">Oui</option>
                  <option value="not_sure">Je ne sais pas</option>
                </select>
              </label>

              <label>
                <span>Décrivez rapidement votre projet</span>
                <textarea name="message" rows="5" placeholder="Objectif du site, contenu, deadline..."></textarea>
              </label>

              <button type="submit">🚀 Demander mon site</button>
            </form>
          </article>
        </div>
      </section>
    </main>
    ${renderFooter()}
  `;

  if (forfaitParam) {
    const select = document.getElementById('forfait-select');
    if (select) select.value = forfaitParam;
  }
};

const renderCallPage = () => {
  setMeta({
    title: 'Appel decouverte creation site internet | Launch48',
    description: 'Réservez un appel découverte pour parler de votre site internet professionnel, de votre landing page ou de votre besoin de refonte rapide.'
  });

  app.innerHTML = `
    ${renderHeader('call')}
    <main id="main">
      <section class="section container">
        <div class="quote-layout">
          <article class="quote-panel" data-reveal>
            <p class="kicker">Pendant l'appel</p>
            <h2>On clarifie comment lancer votre site internet vite</h2>
            <ul class="quote-panel__list">
              <li>Clarifier votre objectif principal et votre cible</li>
              <li>Identifier le bon format de site internet ou de landing page</li>
              <li>Valider le timing et les contenus disponibles</li>
              <li>Vous orienter vers un devis ou une prochaine étape concrète</li>
            </ul>
          </article>

          <article class="quote-form-card quote-form-card--embed" data-reveal>
            <iframe
              src="https://calendar.google.com/calendar/appointments/schedules/AcZssZ1Jz5-ug680S_o1HDqRhby_Ki01yMTXXV77xMeTjymw6BTE_ptNn6lymrhS9tO4LdVAtlYO6z25?gv=true"
              style="border: 0"
              width="100%"
              height="600"
              frameborder="0"
              title="Réservation d'appel Launch48"
            ></iframe>
          </article>
        </div>
      </section>
    </main>
    ${renderFooter()}
  `;
};

const pickOtherNeeds = (slug) => {
  const others = OFFERS.filter((offer) => offer.slug !== slug);
  return others.slice(0, 4);
};

const renderOptionsBlock = (offer) => `
  <section class="section container">
    <div class="section-head" data-reveal>
      <p class="kicker">Options</p>
      <h2>Options pour aller plus loin avec votre ${offer.seo?.keyword || 'site internet'}</h2>
      <p>On garde un socle simple et performant, puis on ajoute seulement ce qui sert vraiment votre objectif business et votre référencement.</p>
    </div>
    <div class="options-grid options-grid--cards">
      ${offer.options
        .map(
          (option) => `
            <article class="option-card" data-reveal>
              <span class="option-card__label">Option</span>
              <h3>${option}</h3>
              <p>Ajoutable si cela améliore réellement la clarté, la conversion ou l'autonomie du projet.</p>
            </article>
          `
        )
        .join('')}
    </div>
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
  const detail = getVerticalDetails(offer);

  setMeta({
    title: offer.seo?.title || `${offer.name} | Launch48`,
    description: offer.seo?.description || offer.shortDescription
  });

  app.innerHTML = `
    ${renderHeader('offers')}
    <main id="main">
      <section class="vertical-hero section container">
        <div class="vertical-hero__grid">
          <div class="vertical-hero__content" data-reveal>
            <p class="kicker">${offer.hero.eyebrow}</p>
            <h1>${offer.hero.title}</h1>
            <p class="lead">${offer.hero.subtitle}</p>
            <div class="hero-actions">
              ${asLink(offer.hero.primaryCta, CONTACT.primaryHref, 'btn')}
              ${asLink(offer.hero.secondaryCta, offer.hero.secondaryCta.includes('offres') ? '/offres/' : CONTACT.secondaryHref, 'btn btn--ghost')}
            </div>
          </div>

          <div class="vertical-hero__aside" data-reveal>
            <a
              class="hero-media hero-media--preview vertical-hero__preview"
              href="${getPreviewHref(offer)}"
              target="_blank"
              rel="noreferrer"
              aria-label="${getPreviewAriaLabel(offer)}"
            >
              <img
                class="hero-media__image"
                src="${offer.preview?.src || '/illustrations/hero-site-1.svg'}"
                alt="${offer.preview?.alt || 'Aperçu visuel du site'}"
                decoding="async"
              />
              <span class="hero-media__caption">
                <strong>${getPreviewTitle(offer)}</strong>
                <small>${getPreviewCaption(offer)}</small>
              </span>
            </a>
            ${getPreviewNote(offer) ? `<p class="vertical-hero__demo-note">${getPreviewNote(offer)}</p>` : ''}

            <article class="vertical-hero__summary">
              <span class="vertical-hero__summary-label">À partir de</span>
              <strong class="vertical-hero__price">${offer.priceFrom}</strong>
              <p>${offer.benefit}</p>
              <div class="vertical-hero__audience">
                ${detail.idealFor.map((item) => `<span>${item}</span>`).join('')}
              </div>
              <div class="vertical-hero__summary-line">
                <span>Cible</span>
                <p>${offer.target}</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section class="section container vertical-signals">
        <div class="section-head" data-reveal>
          <p class="kicker">Pourquoi cette page fonctionne</p>
          <h2>Pourquoi un ${offer.seo?.keyword || 'site internet'} bien structuré convertit mieux</h2>
          <p>Un bon référencement ne suffit pas. Il faut aussi une page claire, crédible et orientée vers l'action pour transformer les visites en demandes.</p>
        </div>
        <div class="vertical-signals__grid">
          ${detail.pillars
            .map(
              (pillar) => `
                <article class="vertical-signal-card" data-reveal>
                  <span class="vertical-signal-card__label">${pillar.label}</span>
                  <h3>${pillar.title}</h3>
                  <p>${pillar.text}</p>
                </article>
              `
            )
            .join('')}
        </div>
      </section>

      <section class="section container">
        <div class="section-head" data-reveal>
          <p class="kicker">Ce que la page doit changer</p>
          <h2>Ce qu'un ${offer.seo?.keyword || 'site internet'} doit corriger pour mieux convertir</h2>
          <p>Sur ces projets, le vrai sujet n'est pas seulement d'avoir un site. C'est de faire comprendre vite, rassurer au bon moment, puis orienter clairement vers l'action utile.</p>
        </div>
        <div class="vertical-shift">
          <article class="vertical-shift__panel" data-reveal>
            <span class="vertical-shift__eyebrow">Avant</span>
            <h3>Ce qui bloque souvent</h3>
            <ul>
              ${detail.painPoints.map((item) => `<li>${item}</li>`).join('')}
            </ul>
          </article>
          <article class="vertical-shift__panel vertical-shift__panel--accent" data-reveal>
            <span class="vertical-shift__eyebrow">Après</span>
            <h3>Ce que la page doit produire</h3>
            <ul>
              ${detail.outcomes.map((item) => `<li>${item}</li>`).join('')}
            </ul>
          </article>
        </div>
      </section>

      <section class="section container">
        <div class="section-head" data-reveal>
          <p class="kicker">Architecture recommandée</p>
          <h2>La structure recommandée pour un ${offer.seo?.keyword || 'site internet'}</h2>
          <p>Chaque page verticale suit un ordre précis : capter l'attention, clarifier le message, créer la confiance, puis convertir sans friction.</p>
        </div>
        <div class="vertical-blueprint">
          ${detail.flow
            .map(
              (step) => `
                <article class="vertical-blueprint__card" data-reveal>
                  <span class="vertical-blueprint__index">${step.label}</span>
                  <h3>${step.title}</h3>
                  <p>${step.text}</p>
                </article>
              `
            )
            .join('')}
        </div>
      </section>

      ${renderPreviewSpotlight(offer)}

      <section class="section container">
        <div class="vertical-included" data-reveal>
          <div class="vertical-included__intro">
            <p class="kicker">Inclus dans la formule</p>
            <h2>Ce que nous mettons dans votre ${offer.seo?.keyword || 'site internet'}</h2>
            <p>Launch48 pose une base volontairement claire : une page forte, un design assumé, un contenu hiérarchisé et des CTA visibles là où ils doivent l'être.</p>
          </div>
          <div class="vertical-included__list">
            ${detail.inclusions.map((item) => `<span>${item}</span>`).join('')}
          </div>
        </div>
      </section>

      ${renderReusableCtaBlock()}
      ${renderOptionsBlock(offer)}

      <section class="section container">
        ${renderContactCard({
          kicker: 'CTA final',
          title: offer.finalCta,
          text: `On construit un ${offer.seo?.keyword || 'site internet'} aligne avec vos objectifs business, votre image et votre rythme de mise en ligne.`,
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

  const updateLabel = () => {
    const currentTheme = document.documentElement.dataset.theme || 'dark';
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    const currentLabel = currentTheme === 'light' ? 'clair' : 'sombre';
    const nextLabel = nextTheme === 'light' ? 'clair' : 'sombre';
    document.querySelectorAll('.theme-toggle').forEach((themeButton) => {
      themeButton.dataset.theme = currentTheme;
      themeButton.dataset.nextTheme = nextTheme;
      themeButton.setAttribute('aria-checked', String(currentTheme === 'light'));
      themeButton.setAttribute('aria-label', `Activer le mode ${nextLabel}`);
      themeButton.setAttribute('title', `Thème actuel : ${currentLabel}`);
    });
  };

  updateLabel();
  document.querySelectorAll('.theme-toggle').forEach((themeButton) => {
    themeButton.addEventListener('click', () => {
      const currentTheme = document.documentElement.dataset.theme || 'dark';
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.dataset.theme = nextTheme;
      localStorage.setItem('launch48-theme', nextTheme);
      updateLabel();
    });
  });
};

const setupMobileNav = () => {
  const burger = document.querySelector('.nav-burger');
  const panel = document.querySelector('.nav-mobile');
  if (!burger || !panel) return;

  const closeMenu = () => {
    burger.setAttribute('aria-expanded', 'false');
    panel.hidden = true;
  };

  burger.addEventListener('click', () => {
    const isOpen = burger.getAttribute('aria-expanded') === 'true';
    burger.setAttribute('aria-expanded', String(!isOpen));
    panel.hidden = isOpen;
  });

  panel.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });
};

const setupNavDropdown = () => {
  const dropdowns = Array.from(document.querySelectorAll('.nav-dropdown'));
  if (dropdowns.length === 0) return;
  const desktopQuery = window.matchMedia('(min-width: 760px)');

  const closeAll = () => {
    dropdowns.forEach((dropdown) => {
      dropdown.classList.remove('is-open', 'is-hovered');
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
      if (desktopQuery.matches) return;
      event.preventDefault();
      event.stopPropagation();
      const willOpen = !dropdown.classList.contains('is-open');
      closeAll();
      dropdown.classList.toggle('is-open', willOpen);
      toggle.setAttribute('aria-expanded', String(willOpen));
    });

    dropdown.addEventListener('mouseenter', () => {
      if (!desktopQuery.matches) return;
      closeAll();
      dropdown.classList.add('is-hovered');
      toggle.setAttribute('aria-expanded', 'true');
    });

    dropdown.addEventListener('mouseleave', () => {
      if (!desktopQuery.matches) return;
      dropdown.classList.remove('is-hovered');
      toggle.setAttribute('aria-expanded', 'false');
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

const setupResponsiveNavVisibility = () => {
  const desktopOnlyNodes = document.querySelectorAll('.nav-cta-desktop, .nav-theme-desktop');
  if (desktopOnlyNodes.length === 0) return;

  const mediaQuery = window.matchMedia('(min-width: 760px)');
  const sync = () => {
    desktopOnlyNodes.forEach((node) => {
      node.hidden = !mediaQuery.matches;
    });
  };

  sync();
  mediaQuery.addEventListener('change', sync);
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
  } else if (pageType === 'quote') {
    renderQuotePage();
  } else if (pageType === 'call') {
    renderCallPage();
  } else if (pageType === 'vertical') {
    renderVerticalPage(offerSlug);
  } else {
    renderHome();
  }

  setupTheme();
  setupMobileNav();
  setupResponsiveNavVisibility();
  setupNavDropdown();
  setupBackgroundProgress();
  setupHeaderScrollState();
  setupRevealAnimations();
};

init();

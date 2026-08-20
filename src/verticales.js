import './styles.css';
import './verticales.css';
import './shell.css';
import { initShell, renderShellHeader, renderShellFooter } from './shell.js';
import { CONTACT, OFFERS, SITE, VERTICAL_DETAILS } from './offers-data';

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

/* Header et footer viennent du socle : une seule définition pour tout le site. */
const renderHeader = () => renderShellHeader();
const renderFooter = () => renderShellFooter();

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
      <h2 data-reveal-words>${content.title}</h2>
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
        <h2 data-reveal-words>Un besoin précis ? On vous aide à lancer votre site internet rapidement.</h2>
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
      <h2 data-reveal-words>${title}</h2>
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
        <h1 data-reveal-words>Des sites conçus pour votre besoin métier, pas un modèle générique.</h1>
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
          <h2 data-reveal-words>Des sites pensés pour des besoins concrets</h2>
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
          <h2 data-reveal-words>Un process simple, rapide et lisible</h2>
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
        <h1 data-reveal-words>Choisissez le bon format pour créer votre site internet rapidement</h1>
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
          <h2 data-reveal-words>Chaque site internet répond à une intention d'achat concrète</h2>
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

const pickOtherNeeds = (slug) => {
  const others = OFFERS.filter((offer) => offer.slug !== slug);
  return others.slice(0, 4);
};

const renderOptionsBlock = (offer) => `
  <section class="section container">
    <div class="section-head" data-reveal>
      <p class="kicker">Options</p>
      <h2 data-reveal-words>Options pour aller plus loin avec votre ${offer.seo?.keyword || 'site internet'}</h2>
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
      <h2 data-reveal-words>Autres besoins</h2>
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
            <h1 data-reveal-words>${offer.hero.title}</h1>
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
          <h2 data-reveal-words>Pourquoi un ${offer.seo?.keyword || 'site internet'} bien structuré convertit mieux</h2>
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
          <h2 data-reveal-words>Ce qu'un ${offer.seo?.keyword || 'site internet'} doit corriger pour mieux convertir</h2>
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
          <h2 data-reveal-words>La structure recommandée pour un ${offer.seo?.keyword || 'site internet'}</h2>
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
            <h2 data-reveal-words>Ce que nous mettons dans votre ${offer.seo?.keyword || 'site internet'}</h2>
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

const init = () => {
  /* Active la règle `.js [data-reveal]` du socle, qui masque les blocs avant
     leur apparition. Posée juste avant le rendu : le contenu de ces pages est
     injecté par ce script, il n'y a donc aucun risque de voir un bloc
     s'afficher puis disparaître. */
  document.documentElement.classList.add('js');

  if (pageType === 'offers') {
    renderOffersPage();
  } else if (pageType === 'vertical') {
    renderVerticalPage(offerSlug);
  } else {
    renderHome();
  }

  // Header, menu mobile, pastille de nav et apparitions viennent du socle.
  // L'apparition au scroll passe par l'IntersectionObserver de shell.js :
  // GSAP + ScrollTrigger ne servaient qu'à ça, pour 130 kB, et faisaient même
  // doublon avec le socle sur les mêmes éléments.
  initShell();
  setupBackgroundProgress();
};

init();

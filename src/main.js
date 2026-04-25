import './styles.css';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ limitCallbacks: true, ignoreMobileResize: true });

const app = document.querySelector('#app');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const fallbackSlots = {
  'meta.title': 'Launch48',
  'meta.description': 'Contenu indisponible.',
  'brand.name': 'Launch48',
  'hero.title': 'Launch48',
  'hero.subtitle': 'Le fichier content.html est introuvable pour le moment.'
};
const verticalNeeds = [
  {
    title: 'Site événementiel',
    description: 'Promouvoir un événement et orienter efficacement vers la billetterie.',
    price: '1 290 €',
    href: '/site-evenementiel/',
    previewSrc: '/previews/event-demo-home.png',
    previewAlt: 'Aperçu de la démo Event / Festival'
  },
  {
    title: 'Site consultant / freelance / agence',
    description: 'Clarifier votre offre et générer des prises de contact qualifiées.',
    price: '990 €',
    href: '/site-consultant/',
    previewSrc: '/previews/consultant-demo-home.png',
    previewAlt: 'Aperçu de la démo Consultant / Expert B2B'
  },
  {
    title: 'Site lancement de marque / produit',
    description: 'Créer un storytelling fort et un design impactant pour un lancement.',
    price: '1 490 €',
    href: '/site-lancement-marque/',
    previewSrc: '/previews/brand-launch-demo-home.png',
    previewAlt: 'Aperçu de la démo Lancement de marque / Produit'
  },
  {
    title: 'Site restaurant / hospitality',
    description: 'Mettre en valeur un lieu, sa carte et faciliter la réservation.',
    price: '1 090 €',
    href: '/site-restaurant/',
    previewSrc: '/previews/restaurant-demo-home.png',
    previewAlt: 'Aperçu de la démo Restaurant / Food concept'
  },
  {
    title: 'Site artiste / créatif / portfolio',
    description: 'Exposer un univers créatif et professionnaliser la présence en ligne.',
    price: '890 €',
    href: '/site-artiste/',
    previewSrc: '/previews/artist-demo-home.png',
    previewAlt: 'Aperçu de la démo Artiste / Portfolio créatif'
  },
  {
    title: 'Site média / podcast / contenu',
    description: 'Centraliser les formats et structurer une image éditoriale solide.',
    price: '1 190 €',
    href: '/site-media-podcast/',
    previewSrc: '/previews/site-media-podcast-home.jpg',
    previewAlt: 'Aperçu de la démo Média / Podcast'
  },
  {
    title: 'Site association / institutionnel',
    description: 'Présenter une mission, valoriser les actions et orienter vers l’engagement.',
    price: '990 €',
    href: '/site-association/',
    previewSrc: '/previews/association-demo-home.png',
    previewAlt: 'Aperçu de la démo Association / Projet à impact'
  },
  {
    title: 'Site immobilier / location',
    description: 'Valoriser un bien et générer des demandes qualifiées.',
    price: '1 090 €',
    href: '/site-immobilier-location/',
    previewSrc: '/previews/real-estate-demo-home.png',
    previewAlt: 'Aperçu de la démo Immobilier premium / Real Estate'
  }
];

const renderShell = () => {
  app.innerHTML = `
    <div class="cursor" aria-hidden="true"></div>
    <header class="site-header" id="top">
      <nav class="nav container" aria-label="Navigation principale">
        <a class="brand" href="#top">
          <img class="brand__logo" src="/logo-launch48.svg" alt="Launch48" />
        </a>
        <div class="nav__links">
          <a data-slot="nav.link1.label" data-slot-href="nav.link1.href"></a>
          <a data-slot="nav.link2.label" data-slot-href="nav.link2.href"></a>
          <a data-slot="nav.link3.label" data-slot-href="nav.link3.href"></a>
          <a data-slot="nav.link4.label" data-slot-href="nav.link4.href"></a>
          <div class="nav-dropdown nav-dropdown--desktop">
            <div class="nav-dropdown__trigger">
              <a class="nav-dropdown__link" href="/offres/">Secteurs</a>
              <button class="nav-dropdown__toggle" type="button" aria-expanded="false" aria-controls="nav-verticales-menu-desktop" aria-label="Ouvrir le menu Secteurs"></button>
            </div>
            <div class="nav-dropdown__menu" id="nav-verticales-menu-desktop">
              <a href="/offres/">Toutes les offres</a>
              <a href="/site-evenementiel/">Site événementiel</a>
              <a href="/site-consultant/">Site consultant</a>
              <a href="/site-lancement-marque/">Lancement marque</a>
              <a href="/site-restaurant/">Restaurant</a>
              <a href="/site-artiste/">Artiste / portfolio</a>
              <a href="/site-media-podcast/">Média / podcast</a>
              <a href="/site-association/">Association</a>
              <a href="/site-immobilier-location/">Immobilier / location</a>
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
          <a class="btn btn--small magnetic nav-cta-desktop" data-slot="nav.cta.label" data-slot-href="nav.cta.href"></a>
        </div>
      </nav>
      <div class="nav-mobile container" id="nav-mobile-panel" hidden>
        <div class="nav-mobile__panel">
          <div class="nav-mobile__group">
            <a data-slot="nav.link1.label" data-slot-href="nav.link1.href"></a>
            <a data-slot="nav.link2.label" data-slot-href="nav.link2.href"></a>
            <a data-slot="nav.link3.label" data-slot-href="nav.link3.href"></a>
            <a data-slot="nav.link4.label" data-slot-href="nav.link4.href"></a>
            <a href="/offres/">Secteurs</a>
          </div>
          <div class="nav-mobile__group nav-mobile__group--muted">
            <a href="/site-evenementiel/">Site événementiel</a>
            <a href="/site-consultant/">Site consultant</a>
            <a href="/site-lancement-marque/">Lancement marque</a>
            <a href="/site-restaurant/">Restaurant</a>
            <a href="/site-artiste/">Artiste / portfolio</a>
            <a href="/site-media-podcast/">Média / podcast</a>
            <a href="/site-association/">Association</a>
            <a href="/site-immobilier-location/">Immobilier / location</a>
        </div>
        <div class="nav-mobile__footer">
          <a class="btn magnetic" data-slot="nav.cta.label" data-slot-href="nav.cta.href"></a>
        </div>
      </div>
      </div>
    </header>

    <main id="main">
      <section class="hero section container" id="hero">
        <div class="hero-deco" aria-hidden="true">
          <div class="hero-orb--a" data-hero-orb-a></div>
          <div class="hero-orb--b" data-hero-orb-b></div>
          <div class="hero-ring" data-hero-ring></div>
          <div class="hero-cross hc-1"></div>
          <div class="hero-cross hc-2"></div>
          <div class="hero-cross hc-3"></div>
          <span class="hero-float hf-1" data-speed="0.08" data-mouse-depth="0.3">Landing page</span>
          <span class="hero-float hf-2" data-speed="0.12" data-mouse-depth="0.4">One page</span>
          <span class="hero-float hf-3" data-speed="0.05" data-mouse-depth="0.2">Vitrine</span>
          <span class="hero-float hf-4" data-speed="0.15" data-mouse-depth="0.35">Événement</span>
          <span class="hero-float hf-5" data-speed="0.18" data-mouse-depth="0.25">Portfolio</span>
          <span class="hero-float hf-6" data-speed="0.10" data-mouse-depth="0.3">E-commerce</span>
          <span class="hero-float hf-7" data-speed="0.14" data-mouse-depth="0.4">Food</span>
        </div>
        <div class="hero__content">
          <p class="hero__eyebrow" data-slot="hero.eyebrow"></p>
          <h1 class="hero__title" data-typewriter-segments="Un site pro, livré en 48h."></h1>
          <p class="hero__subtitle" data-slot="hero.subtitle"></p>
          <div class="hero__cta">
            <a class="btn magnetic" data-slot="hero.primaryCta.label" data-slot-href="hero.primaryCta.href"></a>
            <a class="btn btn--ghost" data-slot="hero.secondaryCta.label" data-slot-href="hero.secondaryCta.href"></a>
          </div>
        </div>
      </section>

      <section class="process section container" id="process">
        <div class="process-sticky">
          <h2 data-slot="process.title"></h2>
          <p class="section-intro" data-slot="process.subtitle"></p>
          <div class="process__progress" aria-hidden="true">
            <span class="process__progress-fill"></span>
            <span class="process__progress-rocket">
              <svg class="process__progress-rocket-icon" viewBox="0 0 72 28" role="presentation" focusable="false" aria-hidden="true">
                <defs>
                  <linearGradient id="rocket-body" x1="0%" y1="50%" x2="100%" y2="50%">
                    <stop offset="0%" stop-color="#dff8ff" />
                    <stop offset="55%" stop-color="#7fdcff" />
                    <stop offset="100%" stop-color="#4f87ff" />
                  </linearGradient>
                </defs>
                <path d="M2 14c2.5-2.8 5.8-4.4 9.8-4.8-2.6 1.6-4 3.2-4.3 4.8.3 1.6 1.7 3.2 4.3 4.8-4-.4-7.3-2-9.8-4.8Z" fill="rgba(255,255,255,0.92)" />
                <path d="M6 14c1.5-1.6 3.6-2.6 6.2-3-1.7 1-2.7 2-2.9 3 .2 1 1.2 2 2.9 3-2.6-.4-4.7-1.4-6.2-3Z" fill="rgba(223,248,255,0.9)" />
                <path d="M14 14c4-7 13-11 27-10l10 1 4 9-4 9-10 1C27 25 18 21 14 14Z" fill="url(#rocket-body)" />
                <path d="M43 6 54 4l-4 6Z" fill="#8fb7ff" />
                <path d="M43 22 54 24l-4-6Z" fill="#63ffe0" />
                <circle cx="34" cy="14" r="4.2" fill="#132338" />
                <circle cx="34" cy="14" r="2.2" fill="#dff8ff" />
                <path d="M55 8h10l4 6-4 6H55l3-6-3-6Z" fill="#dff8ff" />
              </svg>
            </span>
          </div>
          <div class="process-grid">
            <article class="process-step">
              <span class="process-step__label" data-slot="process.day0.label"></span>
              <h3 data-slot="process.day0.title"></h3>
              <p data-slot="process.day0.text"></p>
            </article>
            <article class="process-step">
              <span class="process-step__label" data-slot="process.day1.label"></span>
              <h3 data-slot="process.day1.title"></h3>
              <p data-slot="process.day1.text"></p>
            </article>
            <article class="process-step">
              <span class="process-step__label" data-slot="process.day2.label"></span>
              <h3 data-slot="process.day2.title"></h3>
              <p data-slot="process.day2.text"></p>
            </article>
          </div>
        </div>
      </section>

      <section class="vertical-needs section container" id="vertical-needs">
        <div class="vertical-needs__head">
          <h2>Des sites pensés pour des besoins concrets</h2>
          <p class="section-intro">Nous concevons des sites adaptés à des usages précis : événement, lancement de marque, activité de service, média, restauration, portfolio, association, immobilier, etc.</p>
        </div>
        <div class="vertical-needs__grid">
          ${verticalNeeds
            .map(
              (item) => `
                <a class="needs-card needs-card--link" href="${item.href}">
                  <div class="needs-card__media">
                    <img class="needs-card__image" src="${item.previewSrc}" alt="${item.previewAlt}" loading="lazy" decoding="async" />
                  </div>
                  <h3>${item.title}</h3>
                  <p>${item.description}</p>
                  <span class="btn btn--ghost needs-card__cta">Voir l'offre</span>
                </a>
              `
            )
            .join('')}
        </div>
        <div class="vertical-needs__footer">
          <a class="btn magnetic" href="/offres/">Découvrir toutes les offres</a>
        </div>
      </section>

      <section class="proof section" id="proof">
        <div class="container">
          <h2 data-slot="proof.title"></h2>
          <p class="section-intro" data-slot="proof.subtitle"></p>
        </div>
        <div class="proof-track-wrap">
          <div class="proof-track container">
            <article class="proof-card">
              <div class="proof-card__content">
                <div class="proof-card__meta-row">
                  <span class="proof-card__meta" data-slot="proof.item1.meta"></span>
                  <span class="proof-card__kpi" data-slot="proof.item1.kpi"></span>
                </div>
                <h3 data-slot="proof.item1.title"></h3>
                <p data-slot="proof.item1.text"></p>
                <ul class="proof-card__points">
                  <li data-slot="proof.item1.point1"></li>
                  <li data-slot="proof.item1.point2"></li>
                </ul>
              </div>
              <img class="proof-card__illustration" data-slot-src="proof.item1.illustration" data-slot-alt="proof.item1.illustrationAlt" loading="lazy" decoding="async" />
            </article>
            <article class="proof-card">
              <div class="proof-card__content">
                <div class="proof-card__meta-row">
                  <span class="proof-card__meta" data-slot="proof.item2.meta"></span>
                  <span class="proof-card__kpi" data-slot="proof.item2.kpi"></span>
                </div>
                <h3 data-slot="proof.item2.title"></h3>
                <p data-slot="proof.item2.text"></p>
                <ul class="proof-card__points">
                  <li data-slot="proof.item2.point1"></li>
                  <li data-slot="proof.item2.point2"></li>
                </ul>
              </div>
              <img class="proof-card__illustration" data-slot-src="proof.item2.illustration" data-slot-alt="proof.item2.illustrationAlt" loading="lazy" decoding="async" />
            </article>
            <article class="proof-card">
              <div class="proof-card__content">
                <div class="proof-card__meta-row">
                  <span class="proof-card__meta" data-slot="proof.item3.meta"></span>
                  <span class="proof-card__kpi" data-slot="proof.item3.kpi"></span>
                </div>
                <h3 data-slot="proof.item3.title"></h3>
                <p data-slot="proof.item3.text"></p>
                <ul class="proof-card__points">
                  <li data-slot="proof.item3.point1"></li>
                  <li data-slot="proof.item3.point2"></li>
                </ul>
              </div>
              <img class="proof-card__illustration" data-slot-src="proof.item3.illustration" data-slot-alt="proof.item3.illustrationAlt" loading="lazy" decoding="async" />
            </article>
            <article class="proof-card">
              <div class="proof-card__content">
                <div class="proof-card__meta-row">
                  <span class="proof-card__meta" data-slot="proof.item4.meta"></span>
                  <span class="proof-card__kpi" data-slot="proof.item4.kpi"></span>
                </div>
                <h3 data-slot="proof.item4.title"></h3>
                <p data-slot="proof.item4.text"></p>
                <ul class="proof-card__points">
                  <li data-slot="proof.item4.point1"></li>
                  <li data-slot="proof.item4.point2"></li>
                </ul>
              </div>
              <img class="proof-card__illustration" data-slot-src="proof.item4.illustration" data-slot-alt="proof.item4.illustrationAlt" loading="lazy" decoding="async" />
            </article>
          </div>
        </div>
      </section>

      <section class="reviews section container" id="reviews" hidden>
        <div class="reviews__head">
          <h2 data-slot="reviews.title"></h2>
          <p class="section-intro" data-slot="reviews.subtitle"></p>
        </div>
        <div class="reviews__grid">
          <article class="review-card">
            <div class="review-card__person">
              <img class="review-card__avatar" data-slot-src="reviews.item1.photo" data-slot-alt="reviews.item1.photoAlt" loading="lazy" decoding="async" />
              <div class="review-card__meta">
                <strong data-slot="reviews.item1.name"></strong>
                <span data-slot="reviews.item1.role"></span>
              </div>
            </div>
            <p class="review-card__quote" data-slot="reviews.item1.quote"></p>
          </article>
          <article class="review-card">
            <div class="review-card__person">
              <img class="review-card__avatar" data-slot-src="reviews.item2.photo" data-slot-alt="reviews.item2.photoAlt" loading="lazy" decoding="async" />
              <div class="review-card__meta">
                <strong data-slot="reviews.item2.name"></strong>
                <span data-slot="reviews.item2.role"></span>
              </div>
            </div>
            <p class="review-card__quote" data-slot="reviews.item2.quote"></p>
          </article>
          <article class="review-card">
            <div class="review-card__person">
              <img class="review-card__avatar" data-slot-src="reviews.item3.photo" data-slot-alt="reviews.item3.photoAlt" loading="lazy" decoding="async" />
              <div class="review-card__meta">
                <strong data-slot="reviews.item3.name"></strong>
                <span data-slot="reviews.item3.role"></span>
              </div>
            </div>
            <p class="review-card__quote" data-slot="reviews.item3.quote"></p>
          </article>
        </div>
      </section>

      <section class="offer section container" id="offer">
        <div class="offer-layout">
          <div class="offer-panel">
            <h2 data-slot="offer.title"></h2>
            <p class="section-intro" data-slot="offer.subtitle"></p>
            <div class="offer-panel__meter" aria-hidden="true">
              <span class="offer-panel__meter-fill"></span>
            </div>
          </div>

          <div class="offer-rail">
            <article class="offer-card offer-card--block" data-offer-index="01">
              <span class="offer-card__index" aria-hidden="true">01</span>
              <h3 data-slot="offer.item1.title"></h3>
              <p data-slot="offer.item1.text"></p>
            </article>
            <article class="offer-card offer-card--block" data-offer-index="02">
              <span class="offer-card__index" aria-hidden="true">02</span>
              <h3 data-slot="offer.item2.title"></h3>
              <p data-slot="offer.item2.text"></p>
            </article>
            <article class="offer-card offer-card--block" data-offer-index="03">
              <span class="offer-card__index" aria-hidden="true">03</span>
              <h3 data-slot="offer.item3.title"></h3>
              <p data-slot="offer.item3.text"></p>
            </article>
            <article class="offer-card offer-card--block" data-offer-index="04">
              <span class="offer-card__index" aria-hidden="true">04</span>
              <h3 data-slot="offer.item4.title"></h3>
              <p data-slot="offer.item4.text"></p>
            </article>
          </div>
        </div>
      </section>

      <section class="workflow section container" id="workflow">
        <h2 data-slot="workflow.title"></h2>
        <div class="workflow-grid">
          <article>
            <h3 data-slot="workflow.step1.title"></h3>
            <p data-slot="workflow.step1.text"></p>
          </article>
          <article>
            <h3 data-slot="workflow.step2.title"></h3>
            <p data-slot="workflow.step2.text"></p>
          </article>
          <article>
            <h3 data-slot="workflow.step3.title"></h3>
            <p data-slot="workflow.step3.text"></p>
          </article>
        </div>
      </section>

      <section class="projects-mosaic section container" id="projects">
        <div class="projects-mosaic__head">
          <h2 data-slot="projects.title"></h2>
          <p class="section-intro" data-slot="projects.subtitle"></p>
        </div>
        <div class="projects-mosaic__grid">
          <a
            class="project-card project-card--feature"
            data-slot-href="projects.item1.href"
            target="_blank"
            rel="noreferrer"
          >
            <img class="project-card__image" data-slot-src="projects.item1.image" data-slot-alt="projects.item1.imageAlt" loading="lazy" decoding="async" />
            <div class="project-card__overlay">
              <span class="project-card__meta" data-slot="projects.item1.meta"></span>
              <h3 data-slot="projects.item1.title"></h3>
              <p data-slot="projects.item1.text"></p>
              <span class="project-card__link" data-slot="projects.item1.cta"></span>
            </div>
          </a>

          <a
            class="project-card"
            data-slot-href="projects.item2.href"
            target="_blank"
            rel="noreferrer"
          >
            <img class="project-card__image" data-slot-src="projects.item2.image" data-slot-alt="projects.item2.imageAlt" loading="lazy" decoding="async" />
            <div class="project-card__overlay">
              <span class="project-card__meta" data-slot="projects.item2.meta"></span>
              <h3 data-slot="projects.item2.title"></h3>
              <p data-slot="projects.item2.text"></p>
              <span class="project-card__link" data-slot="projects.item2.cta"></span>
            </div>
          </a>

          <a
            class="project-card"
            data-slot-href="projects.item3.href"
            target="_blank"
            rel="noreferrer"
          >
            <img class="project-card__image" data-slot-src="projects.item3.image" data-slot-alt="projects.item3.imageAlt" loading="lazy" decoding="async" />
            <div class="project-card__overlay">
              <span class="project-card__meta" data-slot="projects.item3.meta"></span>
              <h3 data-slot="projects.item3.title"></h3>
              <p data-slot="projects.item3.text"></p>
              <span class="project-card__link" data-slot="projects.item3.cta"></span>
            </div>
          </a>

          <a class="project-card project-card--cta" data-slot-href="projects.item4.href">
            <div class="project-card__cta-shell">
              <span class="project-card__meta" data-slot="projects.item4.meta"></span>
              <h3 data-slot="projects.item4.title"></h3>
              <p data-slot="projects.item4.text"></p>
              <span class="project-card__link" data-slot="projects.item4.cta"></span>
            </div>
          </a>
        </div>
      </section>

      <section class="pricing section container" id="pricing">
        <div class="pricing-head">
          <span class="kicker">Tarifs</span>
          <h2>Des forfaits taillés<br>pour votre besoin</h2>
          <p>Domaine + hébergement offerts la première année. Prix TTC.</p>
        </div>
        <div class="pricing-cards">
          <div class="pc">
            <div class="pc__name">One Page</div>
            <div class="pc__sub">1 page scrollable</div>
            <div class="pc__price-label">à partir de</div>
            <div class="pc__price">590 €</div>
            <div class="pc__price-note">TTC — domaine + hébergement an 1 offerts</div>
            <hr class="pc__divider">
            <div class="pc__features">
              <div class="pc__feat">Design mobile-first</div>
              <div class="pc__feat">Structure conversion</div>
              <div class="pc__feat">SEO technique de base</div>
              <div class="pc__feat">Formulaire de contact</div>
            </div>
            <div class="pc__tags">
              <span class="pc__tag">Freelance</span>
              <span class="pc__tag">Événement</span>
              <span class="pc__tag">Lancement</span>
            </div>
            <a href="/devis/?forfait=one-page" class="pc__cta">Demander un devis</a>
          </div>
          <div class="pc pc--featured">
            <div class="pc__badge">Best-seller</div>
            <div class="pc__name">Site 3 pages</div>
            <div class="pc__sub">Home + principale + conversion</div>
            <div class="pc__price-label">à partir de</div>
            <div class="pc__price">890 €</div>
            <div class="pc__price-note">TTC — domaine + hébergement an 1 offerts</div>
            <hr class="pc__divider">
            <div class="pc__features">
              <div class="pc__feat">Design mobile-first</div>
              <div class="pc__feat">Structure conversion</div>
              <div class="pc__feat">SEO technique de base</div>
              <div class="pc__feat">Formulaire de contact</div>
              <div class="pc__feat">1 objectif par page</div>
            </div>
            <div class="pc__tags">
              <span class="pc__tag">PME</span>
              <span class="pc__tag">Restaurant</span>
              <span class="pc__tag">Artisan</span>
              <span class="pc__tag">Créateur</span>
            </div>
            <a href="/devis/?forfait=3-pages" class="pc__cta">Demander un devis</a>
          </div>
          <div class="pc">
            <div class="pc__name">Site 5 pages +</div>
            <div class="pc__sub">3 pages + pages secondaires</div>
            <div class="pc__price-label">à partir de</div>
            <div class="pc__price">1 290 €</div>
            <div class="pc__price-note">TTC — domaine + hébergement an 1 offerts</div>
            <hr class="pc__divider">
            <div class="pc__features">
              <div class="pc__feat">Tout le forfait 3 pages</div>
              <div class="pc__feat">Pages verticales métier</div>
              <div class="pc__feat">FAQ / Équipe / Blog</div>
              <div class="pc__feat">Architecture SEO étendue</div>
            </div>
            <div class="pc__tags">
              <span class="pc__tag">Cabinet</span>
              <span class="pc__tag">Agence</span>
              <span class="pc__tag">Immobilier</span>
              <span class="pc__tag">Événement</span>
            </div>
            <a href="/devis/?forfait=5-pages" class="pc__cta">Demander un devis</a>
          </div>
          <div class="pc pc--custom">
            <div class="pc__body">
              <div class="pc__name">Sur mesure</div>
              <div class="pc__sub">Besoin spécifique ? E-commerce, refonte, intégration CRM… On s'adapte à votre projet.</div>
            </div>
            <a href="/devis/?forfait=sur-mesure" class="pc__cta">Nous contacter</a>
          </div>
        </div>
      </section>

      <section class="faq section container" id="faq">
        <h2 data-slot="faq.title"></h2>
        <div class="faq-list">
          ${[1, 2, 3, 4, 5, 6]
            .map(
              (index) => `
                <article class="faq-item">
                  <button class="faq-question" aria-expanded="false" aria-controls="faq-answer-${index}" id="faq-question-${index}">
                    <span data-slot="faq.q${index}.question"></span>
                    <span class="faq-icon" aria-hidden="true">+</span>
                  </button>
                  <div class="faq-answer" role="region" aria-labelledby="faq-question-${index}" id="faq-answer-${index}">
                    <p data-slot="faq.q${index}.answer"></p>
                  </div>
                </article>
              `
            )
            .join('')}
        </div>
      </section>

      <section class="contact section container" id="contact">
        <div class="contact-card">
          <p class="contact-card__eyebrow" data-slot="contact.eyebrow"></p>
          <h2 data-slot="contact.title"></h2>
          <p class="contact-card__text" data-slot="contact.text"></p>
          <div class="contact-card__cta">
            <a class="btn magnetic" data-slot="contact.primaryCta.label" data-slot-href="contact.primaryCta.href"></a>
            <a class="btn btn--ghost" data-slot="contact.secondaryCta.label" data-slot-href="contact.secondaryCta.href"></a>
          </div>
        </div>
      </section>
    </main>

    <footer class="site-footer section container">
      <p class="site-footer__name" data-slot="footer.name"></p>
      <a data-slot="footer.email" data-slot-href="footer.email"></a>
      <div class="site-footer__socials">
        <a data-slot="footer.social1.label" data-slot-href="footer.social1.href"></a>
        <a data-slot="footer.social2.label" data-slot-href="footer.social2.href"></a>
        <a data-slot="footer.social3.label" data-slot-href="footer.social3.href"></a>
      </div>
      <a class="btn btn--small site-footer__cta" href="/partenaires/">Devenir partenaire</a>
      <div class="site-footer__legal">
        <a data-slot="footer.legal1.label" data-slot-href="footer.legal1.href"></a>
        <a data-slot="footer.legal2.label" data-slot-href="footer.legal2.href"></a>
        <a data-slot="footer.legal3.label" data-slot-href="footer.legal3.href"></a>
      </div>
      <a class="site-footer__powered" href="/" aria-label="Accueil Launch48">
        <span>Propulsé par</span>
        <img src="/logo-launch48.svg" alt="" aria-hidden="true" />
      </a>
    </footer>
  `;
};

const parseSlotsFromHtml = (html) => {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const slots = {};
  doc.querySelectorAll('[data-slot]').forEach((element) => {
    const key = element.getAttribute('data-slot');
    slots[key] = element.innerHTML.trim();
  });
  return slots;
};

const injectSlots = (slots) => {
  document.querySelectorAll('[data-slot]').forEach((target) => {
    const key = target.getAttribute('data-slot');
    if (slots[key]) {
      target.innerHTML = slots[key];
    }
  });

  document.querySelectorAll('[data-slot-href]').forEach((target) => {
    const hrefKey = target.getAttribute('data-slot-href');
    const value = slots[hrefKey];
    if (!value) return;

    if (hrefKey === 'footer.email' && !value.startsWith('mailto:')) {
      target.setAttribute('href', `mailto:${value}`);
    } else {
      target.setAttribute('href', value);
    }
  });

  document.querySelectorAll('[data-slot-src]').forEach((target) => {
    const srcKey = target.getAttribute('data-slot-src');
    const value = srcKey ? slots[srcKey] : null;
    if (value) {
      target.setAttribute('src', value);
    }
  });

  document.querySelectorAll('[data-slot-alt]').forEach((target) => {
    const altKey = target.getAttribute('data-slot-alt');
    const value = altKey ? slots[altKey] : null;
    if (value) {
      target.setAttribute('alt', value);
    }
  });
};

const cleanupOptionalContent = () => {
  const workflowSection = document.querySelector('.workflow');
  if (workflowSection) {
    const title = workflowSection.querySelector('h2')?.textContent?.trim();
    const steps = Array.from(workflowSection.querySelectorAll('.workflow-grid article')).filter((step) => {
      const heading = step.querySelector('h3')?.textContent?.trim();
      const text = step.querySelector('p')?.textContent?.trim();
      return Boolean(heading || text);
    });

    if (!title || steps.length === 0) {
      workflowSection.remove();
    }
  }

  document.querySelectorAll('.site-footer__socials').forEach((container) => {
    Array.from(container.querySelectorAll('a')).forEach((link) => {
      const hasLabel = link.textContent.trim().length > 0;
      const hasHref = Boolean(link.getAttribute('href'));
      if (!hasLabel || !hasHref) {
        link.remove();
      }
    });

    if (container.children.length === 0) {
      container.remove();
    }
  });

  document.querySelectorAll('.review-card__avatar').forEach((image) => {
    if (!image.getAttribute('src')) {
      image.remove();
    }
  });
};

const applyMeta = (slots) => {
  if (slots['meta.title']) {
    document.title = slots['meta.title'];
  }

  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription && slots['meta.description']) {
    metaDescription.setAttribute('content', slots['meta.description']);
  }

  const ogMap = {
    'og:title': 'meta.ogTitle',
    'og:description': 'meta.ogDescription',
    'og:url': 'meta.ogUrl',
    'og:image': 'meta.ogImage'
  };

  Object.entries(ogMap).forEach(([property, slot]) => {
    const tag = document.querySelector(`meta[property="${property}"]`);
    if (tag && slots[slot]) {
      tag.setAttribute('content', slots[slot]);
    }
  });

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: slots['seo.business.name'] || slots['brand.name'] || 'Launch48',
    url: slots['seo.business.url'] || slots['meta.ogUrl'] || window.location.href,
    email: slots['seo.business.email'] || slots['footer.email'] || '',
    areaServed: slots['seo.business.area'] || 'France',
    makesOffer: {
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name: slots['seo.business.service'] || 'Service digital'
      }
    }
  };

  const oldScript = document.querySelector('#jsonld-business');
  if (oldScript) oldScript.remove();

  const script = document.createElement('script');
  script.id = 'jsonld-business';
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(jsonLd);
  document.head.appendChild(script);
};

const setupTheme = () => {
  const saved = localStorage.getItem('launch48-theme');
  if (saved === 'light' || saved === 'dark') {
    document.documentElement.dataset.theme = saved;
  }

  const updateLabel = () => {
    const current = document.documentElement.dataset.theme || 'dark';
    const nextTheme = current === 'dark' ? 'light' : 'dark';
    const currentLabel = current === 'light' ? 'clair' : 'sombre';
    const nextLabel = nextTheme === 'light' ? 'clair' : 'sombre';
    document.querySelectorAll('.theme-toggle').forEach((toggle) => {
      toggle.dataset.theme = current;
      toggle.dataset.nextTheme = nextTheme;
      toggle.setAttribute('aria-checked', String(current === 'light'));
      toggle.setAttribute('aria-label', `Activer le mode ${nextLabel}`);
      toggle.setAttribute('title', `Thème actuel : ${currentLabel}`);
    });
  };

  updateLabel();
  document.querySelectorAll('.theme-toggle').forEach((toggle) => {
    toggle.addEventListener('click', () => {
      const current = document.documentElement.dataset.theme || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.dataset.theme = next;
      localStorage.setItem('launch48-theme', next);
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

const setupFaq = () => {
  document.querySelectorAll('.faq-question').forEach((button) => {
    button.addEventListener('click', () => {
      const item = button.closest('.faq-item');
      if (!item) return;
      const isOpen = item.classList.contains('is-open');

      document.querySelectorAll('.faq-item').forEach((node) => {
        node.classList.remove('is-open');
        const question = node.querySelector('.faq-question');
        if (question) question.setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        item.classList.add('is-open');
        button.setAttribute('aria-expanded', 'true');
      }
    });
  });
};

const setupCursor = () => {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  const cursor = document.querySelector('.cursor');
  if (!cursor) return;
  document.body.classList.add('has-custom-cursor');

  window.addEventListener('pointermove', (event) => {
    cursor.style.transform = `translate(${event.clientX}px, ${event.clientY}px) translate(-50%, -50%)`;
    cursor.classList.add('is-visible');
  });

  window.addEventListener('pointerleave', () => {
    cursor.classList.remove('is-visible');
  });

  document.querySelectorAll('a, button').forEach((node) => {
    node.addEventListener('mouseenter', () => cursor.classList.add('is-hovering'));
    node.addEventListener('mouseleave', () => cursor.classList.remove('is-hovering'));
  });
};

const setupMagneticButtons = () => {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  document.querySelectorAll('.magnetic').forEach((node) => {
    node.addEventListener('pointermove', (event) => {
      const rect = node.getBoundingClientRect();
      const x = event.clientX - (rect.left + rect.width / 2);
      const y = event.clientY - (rect.top + rect.height / 2);
      node.style.transform = `translate(${x * 0.16}px, ${y * 0.2}px)`;
    });

    node.addEventListener('pointerleave', () => {
      node.style.transform = '';
    });
  });
};

const setupHaptics = () => {
  if (!('vibrate' in navigator)) return;
  document.querySelectorAll('.btn, .faq-question').forEach((node) => {
    node.addEventListener('click', () => navigator.vibrate(12));
  });
};

const scrollToAnchorCenter = (hash, { updateHash = true } = {}) => {
  if (!hash || hash === '#') return;
  const target = document.querySelector(hash);
  if (!target) return;

  const rect = target.getBoundingClientRect();
  const absoluteTop = window.scrollY + rect.top;
  const targetY = Math.max(0, absoluteTop - (window.innerHeight - rect.height) / 2);
  const behavior = prefersReducedMotion ? 'auto' : 'smooth';

  window.scrollTo({ top: targetY, behavior });
  if (updateHash) {
    history.pushState(null, '', hash);
  }
};

const setupCenteredAnchors = () => {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;
      event.preventDefault();
      scrollToAnchorCenter(href);
    });
  });

  if (window.location.hash) {
    window.requestAnimationFrame(() => {
      scrollToAnchorCenter(window.location.hash, { updateHash: false });
    });
  }
};

const setupBackgroundScroll = () => {
  const root = document.documentElement;
  let rafId = null;

  const update = () => {
    rafId = null;
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const progress = Math.min(1, window.scrollY / maxScroll);
    root.style.setProperty('--bg-progress', progress.toFixed(4));
  };

  const onScroll = () => {
    if (rafId !== null) return;
    rafId = window.requestAnimationFrame(update);
  };

  update();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
};

const setupHeaderScrollState = () => {
  const header = document.querySelector('.site-header');
  if (!header) return;

  let ticking = false;
  let isScrolled = false;
  const threshold = 16;

  const update = () => {
    ticking = false;
    const next = window.scrollY > threshold;
    if (next !== isScrolled) {
      header.classList.toggle('is-scrolled', next);
      isScrolled = next;
    }
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(update);
  };

  update();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
};

const setupHeroParallax = () => {
  const heroEl     = document.querySelector('.hero');
  const heroFloats = document.querySelectorAll('.hero-float[data-speed]');
  const heroCross  = document.querySelectorAll('.hero-cross');
  const heroRing   = document.querySelector('[data-hero-ring]');
  const heroOrbA   = document.querySelector('[data-hero-orb-a]');
  const heroOrbB   = document.querySelector('[data-hero-orb-b]');
  if (!heroEl) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const h1 = heroEl.querySelector('.hero__title[data-typewriter-segments]');
    if (h1) {
      const segs = h1.dataset.typewriterSegments.split('|');
      segs.forEach((seg, i) => {
        h1.insertAdjacentText('beforeend', seg);
        if (i < segs.length - 1) h1.insertAdjacentHTML('beforeend', '<br>');
      });
    }
    return;
  }

  // Typewriter
  (function () {
    const el = heroEl.querySelector('.hero__title[data-typewriter-segments]');
    if (!el) return;
    const segments = el.dataset.typewriterSegments.split('|');
    const cursor = document.createElement('span');
    cursor.className = 'type-cursor';
    el.appendChild(cursor);
    let si = 0, ci = 0;
    function typeNext() {
      if (si >= segments.length) return;
      const seg = segments[si];
      if (ci < seg.length) {
        cursor.insertAdjacentText('beforebegin', seg[ci]);
        ci++;
        setTimeout(typeNext, 38);
      } else {
        si++;
        ci = 0;
        if (si < segments.length) {
          cursor.insertAdjacentHTML('beforebegin', '<br>');
          setTimeout(typeNext, 38 * 4);
        }
      }
    }
    setTimeout(typeNext, 320);
  }());

  // Parallax + mouse
  let sy = 0, mx = 0, my = 0, lx = 0, ly = 0, rafId;
  function lp(a, b, t) { return a + (b - a) * t; }

  window.addEventListener('scroll', () => { sy = window.scrollY; }, { passive: true });
  heroEl.addEventListener('mousemove', (e) => {
    const r = heroEl.getBoundingClientRect();
    mx = ((e.clientX - r.left) / r.width  - 0.5) * 2;
    my = ((e.clientY - r.top)  / r.height - 0.5) * 2;
  });
  heroEl.addEventListener('mouseleave', () => { mx = 0; my = 0; });

  function tick() {
    rafId = requestAnimationFrame(tick);
    lx = lp(lx, mx, 0.055);
    ly = lp(ly, my, 0.055);
    const t = performance.now() / 1000;

    heroFloats.forEach((el, i) => {
      const ss    = parseFloat(el.dataset.speed      || 0);
      const md    = parseFloat(el.dataset.mouseDepth || 0.3);
      const phase = i * (Math.PI * 2 / heroFloats.length);
      const freq  = 0.45 + i * 0.07;
      const amp   = 10 + (i % 3) * 5;
      const osc   = Math.sin(t * freq + phase) * amp;
      el.style.transform = `translate(${(lx * md * 40).toFixed(2)}px, ${(sy * ss + ly * md * 28 + osc).toFixed(2)}px)`;
    });

    heroCross.forEach((el, i) => {
      const d = [0.50, 0.20, 0.38][i] || 0.3;
      el.style.transform = `translate(${(lx * d * 16).toFixed(2)}px, ${(ly * d * 10).toFixed(2)}px)`;
    });

    if (heroRing) {
      heroRing.style.transform =
        `translate(calc(-50% + ${(lx * 10).toFixed(2)}px), calc(-50% + ${(sy * 0.04 + ly * 7).toFixed(2)}px)) rotate(${(sy * 0.016 + lx * 2.5).toFixed(2)}deg)`;
    }
    if (heroOrbA) heroOrbA.style.transform = `translate(${(lx * -18).toFixed(2)}px, ${(sy * -0.07 + ly * -12).toFixed(2)}px)`;
    if (heroOrbB) heroOrbB.style.transform = `translate(${(lx *  14).toFixed(2)}px, ${(sy *  0.05 + ly *   9).toFixed(2)}px)`;
  }

  tick();
  window.addEventListener('pagehide', () => cancelAnimationFrame(rafId), { once: true });
};


const setupAnimations = () => {
  if (prefersReducedMotion) {
    document.body.classList.add('reduced-motion');
    return;
  }

  gsap.from('.hero__content > *', {
    opacity: 0,
    y: 30,
    stagger: 0.08,
    duration: 0.8,
    ease: 'power2.out'
  });

  gsap.from('.proof-card', {
    opacity: 0,
    y: 40,
    stagger: 0.12,
    scrollTrigger: {
      trigger: '.proof-track-wrap',
      start: 'top 85%'
    }
  });

  gsap.utils.toArray('.proof-card').forEach((card) => {
    ScrollTrigger.create({
      trigger: card,
      start: 'top center',
      end: 'bottom center',
      toggleClass: { targets: card, className: 'is-current' }
    });
  });

  const offerCards = gsap.utils.toArray('.offer-card');
  const offerSection = document.querySelector('#offer');
  const offerLayout = document.querySelector('.offer-layout');
  const offerMeterFill = document.querySelector('.offer-panel__meter-fill');

  if (offerSection && offerLayout && offerCards.length > 0) {
    gsap.set(offerCards, { autoAlpha: 0, y: 42, scale: 0.97, filter: 'blur(6px)' });

    offerCards.forEach((card) => {
      gsap.to(card, {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        filter: 'blur(0px)',
        ease: 'power2.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 80%',
          end: 'top 60%',
          scrub: true,
          invalidateOnRefresh: true
        }
      });

      ScrollTrigger.create({
        trigger: card,
        start: 'top 48%',
        end: 'bottom 48%',
        toggleClass: { targets: card, className: 'is-current' }
      });
    });

    if (offerMeterFill) {
      gsap.to(offerMeterFill, {
        scaleY: 1,
        transformOrigin: '50% 0%',
        ease: 'none',
        scrollTrigger: {
          trigger: offerSection,
          start: 'top 70%',
          end: 'bottom 40%',
          scrub: true,
          invalidateOnRefresh: true
        }
      });
    }
  }

  const processSection = document.querySelector('#process');
  const processSticky = document.querySelector('.process-sticky');
  const processSteps = gsap.utils.toArray('.process-step');
  const processProgressFill = document.querySelector('.process__progress-fill');
  const processProgressRocket = document.querySelector('.process__progress-rocket');

  if (processSection && processSticky && processProgressFill && processProgressRocket && processSteps.length > 0) {
    const updateProcessProgress = (self) => {
      gsap.set(processProgressFill, {
        scaleX: self.progress,
        transformOrigin: '0% 50%'
      });
      gsap.set(processProgressRocket, {
        left: `${gsap.utils.clamp(2, 98, self.progress * 100)}%`
      });

      const currentIndex = Math.min(processSteps.length - 1, Math.floor(self.progress * processSteps.length));
      processSteps.forEach((step, index) => {
        step.classList.toggle('is-active', index <= currentIndex);
      });
    };

    if (window.innerWidth < 760) {
      ScrollTrigger.create({
        trigger: processSection,
        start: 'center center',
        end: () => `+=${window.innerHeight * 1.45}`,
        pin: processSticky,
        scrub: true,
        pinSpacing: true,
        anticipatePin: 1,
        fastScrollEnd: true,
        invalidateOnRefresh: true,
        onUpdate: updateProcessProgress
      });
    } else {
      ScrollTrigger.create({
        trigger: processSection,
        start: 'top center',
        end: 'bottom center',
        scrub: true,
        fastScrollEnd: true,
        invalidateOnRefresh: true,
        onUpdate: updateProcessProgress
      });
    }
  }

  gsap.from('.pricing', {
    opacity: 0,
    y: 60,
    scrollTrigger: {
      trigger: '.pricing',
      start: 'top 82%'
    }
  });

  gsap.from('.needs-card', {
    opacity: 0,
    y: 28,
    stagger: 0.08,
    scrollTrigger: {
      trigger: '.vertical-needs',
      start: 'top 82%'
    }
  });
};

const loadSlots = async () => {
  try {
    const response = await fetch('/content.html', { cache: 'no-store' });
    if (!response.ok) throw new Error('content.html non disponible');
    const html = await response.text();
    return { slots: parseSlotsFromHtml(html), hasError: false };
  } catch {
    return { slots: fallbackSlots, hasError: true };
  }
};

const init = async () => {
  renderShell();
  const { slots, hasError } = await loadSlots();

  injectSlots(slots);
  cleanupOptionalContent();
  applyMeta(slots);
  setupTheme();
  setupMobileNav();
  setupResponsiveNavVisibility();
  setupNavDropdown();
  setupFaq();
  setupCursor();
  setupMagneticButtons();
  setupHaptics();
  setupCenteredAnchors();
  setupBackgroundScroll();
  setupHeaderScrollState();
  setupHeroParallax();
  setupAnimations();

  if (hasError) {
    const warning = document.createElement('p');
    warning.className = 'content-warning container';
    warning.textContent = 'Impossible de charger public/content.html. Affichage du fallback minimal.';
    document.querySelector('main')?.prepend(warning);
  }
};

init();

import './styles.css';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ limitCallbacks: true, ignoreMobileResize: true });

const app = document.querySelector('#app');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMobileViewport = () => window.matchMedia('(max-width: 759px)').matches;
const contentVersion = '2026-06-18-cabinet-alma';
const slotCacheKey = `launch48:home-slots:${contentVersion}`;
const fallbackSlots = {
  'meta.title': 'Launch48 — Site internet professionnel livré en 48h | Garanti ou remboursé',
  'meta.description': 'Un site pro, clair et en ligne en 48h. À partir de 590€ — domaine + hébergement inclus. Garanti livré en 48h ou remboursement intégral.',
  'brand.name': 'Launch48',
  'nav.link1.label': 'Sprint 48h',
  'nav.link1.href': '#process',
  'nav.link2.label': 'Tarifs',
  'nav.link2.href': '#pricing',
  'nav.cta.label': 'Lancer mon site en 48h →',
  'nav.cta.href': '/devis/',
  'hero.eyebrow': 'Lancé en 48h. Garanti.',
  'hero.subtitle': 'Clair, crédible, prêt à convertir — sans attendre 3 mois.<br>À partir de 590€. Domaine + hébergement inclus. Garanti ou remboursé.',
  'hero.primaryCta.label': 'Lancer mon site en 48h →',
  'hero.primaryCta.href': '/devis/',
  'hero.secondaryCta.label': 'Voir si mon projet est éligible',
  'hero.secondaryCta.href': '/call/',
  'trust.eyebrow': 'Nos engagements',
  'trust.title': "On assume ce qu'on promet.",
  'trust.text': "Si on ne livre pas en 48h — on rembourse. Pas d'excuse, pas de négociation.",
  'trust.item1.label': '48h chrono — ou remboursement intégral',
  'trust.item2.label': '7 jours de retouches illimitées après livraison',
  'trust.item3.label': 'Domaine + hébergement offerts an 1',
  'trust.item4.label': 'Code livré — vous êtes propriétaire, aucune dépendance',
  'beforeAfter.eyebrow': 'Avant / Après',
  'beforeAfter.title': 'En 48h, tout change.',
  'beforeAfter.beforeTitle': 'Avant Launch48',
  'beforeAfter.afterTitle': 'Après Launch48 (en 48h)',
  'beforeAfter.before1': 'Pas de site — ou un site qui vous dessert',
  'beforeAfter.after1': 'Un site pro en ligne — en 48h',
  'beforeAfter.before2': 'Des prospects qui passent sans contacter',
  'beforeAfter.after2': 'Des formulaires qui génèrent des demandes réelles',
  'beforeAfter.before3': 'Une première impression qui ne convainc pas',
  'beforeAfter.after3': "Une crédibilité qui ferme la décision avant même l'appel",
  'proof.title': 'Vite ne veut pas dire bâclé.',
  'proof.subtitle': 'En 48h, vous avez un site qui a un angle clair, un design crédible et une structure qui convertit.',
  'proof.item1.title': 'Cadrage stratégique',
  'proof.item1.text': 'On ne commence pas à designer avant de savoir ce que votre site doit faire exactement. Objectif, cible, message, angle — cadrés avant le premier pixel.',
  'proof.item1.meta': 'Cadrage',
  'proof.item1.kpi': '+ clarté',
  'proof.item1.point1': 'Objectifs business + cible prioritaire clarifiés',
  'proof.item1.point2': 'Angle de promesse et plan de section validés',
  'proof.item1.illustration': '/stock/proof-brief-stock.jpg',
  'proof.item1.illustrationAlt': 'Équipe en réunion autour d’une table pour cadrer un projet web',
  'proof.item2.title': 'Design qui convainc',
  'proof.item2.text': 'Un design qui renforce la crédibilité, pas qui distrait. Mobile fluide, lecture claire, interactions au service du message.',
  'proof.item2.meta': 'Direction artistique',
  'proof.item2.kpi': 'impact visuel',
  'proof.item2.point1': 'Système typo + rythme visuel cohérents',
  'proof.item2.point2': 'Interactions utiles orientées conversion',
  'proof.item2.illustration': '/stock/proof-design-stock.jpg',
  'proof.item2.illustrationAlt': 'Croquis de wireframe et éléments de design sur carnet',
  'proof.item3.title': 'Code propre, site qui dure',
  'proof.item3.text': 'Votre site charge vite, est indexable par Google et tient dans la durée. Pas un one-shot fragile.',
  'proof.item3.meta': 'Exécution frontend',
  'proof.item3.kpi': 'perf + SEO',
  'proof.item3.point1': 'Structure éditable + balises SEO prêtes',
  'proof.item3.point2': 'Animations fluides et chargement optimisé',
  'proof.item3.illustration': '/stock/proof-dev-stock.jpg',
  'proof.item3.illustrationAlt': 'Développeuse travaillant sur un ordinateur portable avec du code affiché',
  'proof.item4.title': 'Vous gardez la main',
  'proof.item4.text': 'À la livraison, tout est à vous : le code, les accès, la mise en ligne. Aucune dépendance. Aucune surprise.',
  'proof.item4.meta': 'Passation',
  'proof.item4.kpi': 'autonomie',
  'proof.item4.point1': 'Base propre et documentée',
  'proof.item4.point2': 'Mise en ligne validée + autonomie complète',
  'proof.item4.illustration': '/stock/proof-delivery-stock.jpg',
  'proof.item4.illustrationAlt': 'Poignée de main pendant la remise d’un projet web',
  'reviews.title': 'Ils avaient un projet. En 48h, ils avaient un site.',
  'reviews.subtitle': 'Trois clients. Trois contextes. Un seul point commun : un site en ligne vite, qui fait le job.',
  'reviews.item1.quote': '“En 48h j’avais un site clair, crédible et prêt à convertir. Le process est ultra fluide.”',
  'reviews.item1.name': 'Melina',
  'reviews.item1.role': 'Consultant indépendant',
  'reviews.item2.quote': '“On devait lancer vite — la page était en ligne en 48h, propre sur mobile et rassurante pour nos prospects.”',
  'reviews.item2.name': 'Kévan',
  'reviews.item2.role': 'Projet événementiel',
  'reviews.item3.quote': '“Enfin un portfolio qui me représente vraiment. Le rendu fait clairement plus premium que mon ancienne version.”',
  'reviews.item3.name': 'Naïka',
  'reviews.item3.role': 'Artiste / créatif',
  'offer.title': 'En 48h, vous avez un site qui fait le travail.',
  'offer.subtitle': "Message clair, design crédible, conversion nette, SEO propre. Tout ce qu'un site doit faire — fait bien, en 48h.",
  'offer.item1.title': 'Promesse lisible',
  'offer.item1.text': "Votre visiteur comprend en 5 secondes ce que vous faites et pourquoi c'est pour lui. Pas de jargon, pas de flou.",
  'offer.item2.title': 'Design crédible',
  'offer.item2.text': "Une première impression qui ferme le doute. Votre site doit sembler aussi sérieux que vous l'êtes.",
  'offer.item3.title': 'Visiteur → contact',
  'offer.item3.text': 'Chaque section pousse vers une action. Pas de pages qui informent sans convertir.',
  'offer.item4.title': 'Visible sur Google',
  'offer.item4.text': 'Structure indexable, balises prêtes, temps de chargement soigné. Google peut vous trouver dès le premier jour.',
  'process.title': '48h, pas 3 mois.',
  'process.subtitle': "Vous ne signez pas un devis et n'attendez plus. En 48h, vous avez un site en ligne.",
  'process.day0.label': 'J0',
  'process.day0.title': 'Cadrage',
  'process.day0.text': "On clarifie votre objectif, votre message et les priorités. Le site a un angle avant d'avoir un design.",
  'process.day1.label': 'J1',
  'process.day1.title': 'Premier rendu',
  'process.day1.text': 'Vous voyez votre site prendre forme. Interactif, commentable, ajustable en temps réel.',
  'process.day2.label': 'J2',
  'process.day2.title': 'En ligne',
  'process.day2.text': 'Derniers ajustements, mise en ligne, remise des accès. Vous êtes live.',
  'projects.title': "Ils nous ont fait confiance. Voilà ce qu'on a livré.",
  'projects.subtitle': 'Chaque projet a un objectif précis et une exécution qui lui correspond. Pas de templates — des sites sur mesure.',
  'pricing.primaryCta.label': 'Lancer mon site en 48h →',
  'pricing.primaryCta.href': '/devis/',
  'contact.eyebrow': 'On démarre ?',
  'contact.title': "Votre projet mérite un site. Dans 48h, il peut l'avoir.",
  'contact.text': 'Partagez votre objectif et votre timing. En quelques heures : une proposition claire, un prix précis, une date de livraison. Votre site peut être en ligne avant la fin de la semaine.',
  'contact.primaryCta.label': 'Lancer mon site en 48h →',
  'contact.primaryCta.href': '/devis/',
  'contact.secondaryCta.label': 'Voir si mon projet est éligible',
  'contact.secondaryCta.href': '/call/',
  'faq.title': 'FAQ',
  'footer.name': 'Launch48',
  'footer.email': 'contact@launch48.fr',
  'footer.social1.label': 'LinkedIn',
  'footer.social1.href': 'https://www.linkedin.com/company/launch48-fr/',
  'footer.social3.label': 'Instagram',
  'footer.social3.href': 'https://www.instagram.com/launch48.fr/'
};

const latestProjectSlots = {
  'projects.item1.meta': 'Événementiel',
  'projects.item1.title': "Gala de l'Excellence Sportive",
  'projects.item1.text': 'Une vitrine événementielle pensée pour donner envie, clarifier les informations clés et pousser vers la billetterie.',
  'projects.item1.cta': 'Voir le projet',
  'projects.item1.href': 'http://galadelexcellence-guyane.fr/',
  'projects.item1.image': '/previews/site-evenementiel-home.jpg',
  'projects.item1.imageAlt': "Capture du site Gala de l'Excellence Sportive",
  'projects.item2.meta': 'Média / podcast',
  'projects.item2.title': 'Tripin',
  'projects.item2.text': "Une homepage éditoriale qui structure les contenus, renforce l'identité du média et valorise les différents formats.",
  'projects.item2.cta': 'Ouvrir le site',
  'projects.item2.href': 'https://www.tripinculture.fr/',
  'projects.item2.image': '/previews/site-media-podcast-home.jpg',
  'projects.item2.imageAlt': 'Capture du site média Tripin',
  'projects.item3.meta': 'Lancement de marque',
  'projects.item3.title': 'Shortify',
  'projects.item3.text': 'Une landing page de lancement plus tendue, pensée pour créer le désir et pousser vers le test ou la prise de contact.',
  'projects.item3.cta': 'Voir le projet',
  'projects.item3.href': 'https://shortify.fr/',
  'projects.item3.image': '/previews/site-lancement-marque-home.png',
  'projects.item3.imageAlt': 'Capture du site Shortify',
  'projects.item4.meta': 'Tourisme / événement',
  'projects.item4.title': 'Crazy Yoles Tour',
  'projects.item4.text': 'Une page immersive pour vendre une expérience catamaran autour du Tour des Yoles en Martinique.',
  'projects.item4.cta': 'Ouvrir le site',
  'projects.item4.href': 'https://www.crazyyolestour.fr/',
  'projects.item4.image': '/previews/crazy-yoles-tour-home.png',
  'projects.item4.imageAlt': 'Capture du site Crazy Yoles Tour',
  'projects.item5.meta': 'BTP / rénovation',
  'projects.item5.title': 'AquaBat Concept',
  'projects.item5.text': "Un site vitrine local qui clarifie les services de travaux, rassure dès l'arrivée et facilite la demande de devis.",
  'projects.item5.cta': 'Ouvrir le site',
  'projects.item5.href': 'https://www.aquabatconcept.fr/',
  'projects.item5.image': '/previews/aquabat-concept-home.png',
  'projects.item5.imageAlt': 'Capture du site AquaBat Concept',
  'projects.item6.meta': 'Santé / cabinet',
  'projects.item6.title': 'Cabinet Alma',
  'projects.item6.text': "Un site médical rassurant qui présente les praticiens, structure les spécialités et facilite la prise de rendez-vous.",
  'projects.item6.cta': 'Ouvrir le site',
  'projects.item6.href': 'https://www.cabinet-alma.fr/',
  'projects.item6.image': '/previews/cabinet-alma-home.jpg',
  'projects.item6.imageAlt': 'Aperçu du site Cabinet Alma, cabinet d’ostéopathie à Ferney-Voltaire',
  'projects.item7.meta': 'Votre projet',
  'projects.item7.title': 'Le prochain peut être le vôtre',
  'projects.item7.text': 'Votre projet est le prochain. En 48h, votre site peut rejoindre cette liste.',
  'projects.item7.cta': 'Discuter de mon projet',
  'projects.item7.href': '/devis/'
};

const readCachedSlots = () => {
  try {
    const cached = window.sessionStorage.getItem(slotCacheKey);
    return cached ? JSON.parse(cached) : null;
  } catch {
    return null;
  }
};

const writeCachedSlots = (slots) => {
  try {
    window.sessionStorage.setItem(slotCacheKey, JSON.stringify(slots));
  } catch {
    // Cache is a progressive enhancement; rendering must not depend on it.
  }
};
const verticalNeeds = [
  {
    title: 'Site événementiel',
    description: 'Vendez vos billets avant le jour J. Un site qui donne envie, clarifie les infos et envoie direct vers la caisse.',
    price: '1 290 €',
    href: '/site-evenementiel/',
    previewSrc: '/previews/event-demo-home.png',
    previewAlt: 'Aperçu de la démo Event / Festival'
  },
  {
    title: 'Site consultant / freelance / agence',
    description: "Transformez vos visites en appels. Un site qui explique clairement ce que vous faites et pourquoi c'est vous qu'il faut appeler.",
    price: '990 €',
    href: '/site-consultant/',
    previewSrc: '/previews/consultant-demo-home.png',
    previewAlt: 'Aperçu de la démo Consultant / Expert B2B'
  },
  {
    title: 'Site lancement de marque / produit',
    description: "Lancez avec impact. Un site de lancement qui crée le désir et pousse vers l'action — le jour où ça compte.",
    price: '1 290 €',
    href: '/site-lancement-marque/',
    previewSrc: '/previews/brand-launch-demo-home.png',
    previewAlt: 'Aperçu de la démo Lancement de marque / Produit'
  },
  {
    title: 'Site restaurant / hospitality',
    description: "Remplissez vos tables. Un site qui montre l'ambiance, la carte et permet de réserver en quelques secondes.",
    price: '590 €',
    href: '/site-restaurant/',
    previewSrc: '/previews/restaurant-demo-home.png',
    previewAlt: 'Aperçu de la démo Restaurant / Food concept'
  },
  {
    title: 'Site artiste / créatif / portfolio',
    description: 'Montrez ce que vous valez. Un portfolio qui donne votre univers, pas juste vos images.',
    price: '590 €',
    href: '/site-artiste/',
    previewSrc: '/previews/artist-demo-home.png',
    previewAlt: 'Aperçu de la démo Artiste / Portfolio créatif'
  },
  {
    title: 'Site média / podcast / contenu',
    description: 'Construisez votre média. Un hub qui centralise vos formats et donne envie de revenir.',
    price: '1 290 €',
    href: '/site-media-podcast/',
    previewSrc: '/previews/site-media-podcast-home.jpg',
    previewAlt: 'Aperçu de la démo Média / Podcast'
  },
  {
    title: 'Site association / institutionnel',
    description: "Donnez envie de rejoindre votre cause. Un site qui parle de votre impact et facilite l'adhésion ou le don.",
    price: '990 €',
    href: '/site-association/',
    previewSrc: '/previews/association-demo-home.png',
    previewAlt: 'Aperçu de la démo Association / Projet à impact'
  },
  {
    title: 'Site immobilier / location',
    description: 'Générez des demandes qualifiées. Un site qui met en valeur vos biens et filtre les contacts sérieux.',
    price: '990 €',
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
          <a href="/quiz/">Quiz</a>
          <a href="/blog/">Blog</a>
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
    </header>

    <div class="nav-mobile" id="nav-mobile-panel" hidden>
      <div class="nav-mobile__panel">
        <div class="nav-mobile__header">
          <p>Menu</p>
          <button class="nav-mobile__close" type="button" aria-label="Fermer le menu">Fermer</button>
        </div>
        <div class="nav-mobile__group">
          <a data-slot="nav.link1.label" data-slot-href="nav.link1.href"></a>
          <a data-slot="nav.link2.label" data-slot-href="nav.link2.href"></a>
          <a href="/quiz/">Quiz conversion</a>
          <a href="/blog/">Blog</a>
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
    <a class="floating-devis-cta" href="/devis/" aria-label="Demander un devis">+</a>

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
          <span class="hero-float hf-8" data-speed="0.09" data-mouse-depth="0.25">Audit express</span>
          <span class="hero-float hf-9" data-speed="0.11" data-mouse-depth="0.28">SEO prêt</span>
        </div>
        <div class="hero__content">
          <p class="hero__eyebrow" data-slot="hero.eyebrow"></p>
          <h1 class="hero__title" data-typewriter-segments="Un site pro, livré en 48h.">Un site pro, livré en 48h.</h1>
          <p class="hero__subtitle" data-slot="hero.subtitle"></p>
          <div class="hero__cta">
            <a class="btn magnetic" data-slot="hero.primaryCta.label" data-slot-href="hero.primaryCta.href" data-mobile-label="Lancer mon site en 48h"></a>
            <a class="btn btn--ghost" data-slot="hero.secondaryCta.label" data-slot-href="hero.secondaryCta.href"></a>
          </div>
        </div>
      </section>

      <section class="quiz-home-cta section container" aria-labelledby="quiz-home-title">
        <div class="quiz-home-cta__panel" data-reveal>
          <div class="quiz-home-cta__content">
            <p class="kicker">Diagnostic gratuit</p>
            <h2 id="quiz-home-title">Votre site vous fait peut-être perdre des clients.</h2>
            <p>7 questions. 60 secondes. Un score immédiat qui identifie exactement ce qui freine vos demandes de devis.</p>
          </div>
          <div class="quiz-home-cta__aside">
            <div class="quiz-home-cta__stats" aria-label="Détails du quiz">
              <span>60 sec</span>
              <span>7 questions</span>
              <span>Score immédiat</span>
            </div>
            <a class="btn magnetic" href="/quiz/">Obtenir mon diagnostic gratuit →</a>
          </div>
        </div>
      </section>

      <section class="process section container" id="process">
        <div class="process-sticky">
          <h2 data-slot="process.title">48h, pas 3 mois.</h2>
          <p class="section-intro" data-slot="process.subtitle">Vous ne signez pas un devis et n'attendez plus. En 48h, vous avez un site en ligne.</p>
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
              <span class="process-step__label" data-slot="process.day0.label">J0</span>
              <h3 data-slot="process.day0.title">Cadrage</h3>
              <p data-slot="process.day0.text">On clarifie votre objectif, votre message et les priorités. Le site a un angle avant d'avoir un design.</p>
            </article>
            <article class="process-step">
              <span class="process-step__label" data-slot="process.day1.label">J1</span>
              <h3 data-slot="process.day1.title">Premier rendu</h3>
              <p data-slot="process.day1.text">Vous voyez votre site prendre forme. Interactif, commentable, ajustable en temps réel.</p>
            </article>
            <article class="process-step">
              <span class="process-step__label" data-slot="process.day2.label">J2</span>
              <h3 data-slot="process.day2.title">En ligne</h3>
              <p data-slot="process.day2.text">Derniers ajustements, mise en ligne, remise des accès. Vous êtes live.</p>
            </article>
          </div>
        </div>
      </section>

      <section class="vertical-needs section container" id="vertical-needs">
        <div class="vertical-needs__head">
          <h2>Votre secteur. Votre objectif. Votre site.</h2>
          <p class="section-intro">Chaque offre est calibrée pour un objectif spécifique. Pas un site générique — un site qui fait exactement ce dont vous avez besoin.</p>
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
          <a class="btn magnetic" href="/offres/">Voir toutes les offres →</a>
        </div>
      </section>

      <section class="before-after section container" aria-labelledby="before-after-title">
        <div class="before-after__head">
          <span class="kicker" data-slot="beforeAfter.eyebrow"></span>
          <h2 id="before-after-title" data-slot="beforeAfter.title"></h2>
        </div>
        <div class="before-after__panel">
          <div class="before-after__column">
            <h3 data-slot="beforeAfter.beforeTitle"></h3>
            <ul>
              <li><span class="before-after__mark before-after__mark--bad" aria-hidden="true">🔴</span><span data-slot="beforeAfter.before1"></span></li>
              <li><span class="before-after__mark before-after__mark--bad" aria-hidden="true">🔴</span><span data-slot="beforeAfter.before2"></span></li>
              <li><span class="before-after__mark before-after__mark--bad" aria-hidden="true">🔴</span><span data-slot="beforeAfter.before3"></span></li>
            </ul>
          </div>
          <div class="before-after__column before-after__column--after">
            <h3 data-slot="beforeAfter.afterTitle"></h3>
            <ul>
              <li><span class="before-after__mark before-after__mark--good" aria-hidden="true">🟢</span><span data-slot="beforeAfter.after1"></span></li>
              <li><span class="before-after__mark before-after__mark--good" aria-hidden="true">🟢</span><span data-slot="beforeAfter.after2"></span></li>
              <li><span class="before-after__mark before-after__mark--good" aria-hidden="true">🟢</span><span data-slot="beforeAfter.after3"></span></li>
            </ul>
          </div>
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

      <section class="reviews section container" id="reviews">
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

          <a
            class="project-card project-card--third"
            data-slot-href="projects.item4.href"
            target="_blank"
            rel="noreferrer"
          >
            <img class="project-card__image" data-slot-src="projects.item4.image" data-slot-alt="projects.item4.imageAlt" loading="lazy" decoding="async" />
            <div class="project-card__overlay">
              <span class="project-card__meta" data-slot="projects.item4.meta"></span>
              <h3 data-slot="projects.item4.title"></h3>
              <p data-slot="projects.item4.text"></p>
              <span class="project-card__link" data-slot="projects.item4.cta"></span>
            </div>
          </a>

          <a
            class="project-card project-card--third"
            data-slot-href="projects.item5.href"
            target="_blank"
            rel="noreferrer"
          >
            <img class="project-card__image" data-slot-src="projects.item5.image" data-slot-alt="projects.item5.imageAlt" loading="lazy" decoding="async" />
            <div class="project-card__overlay">
              <span class="project-card__meta" data-slot="projects.item5.meta"></span>
              <h3 data-slot="projects.item5.title"></h3>
              <p data-slot="projects.item5.text"></p>
              <span class="project-card__link" data-slot="projects.item5.cta"></span>
            </div>
          </a>

          <a
            class="project-card project-card--third"
            data-slot-href="projects.item6.href"
            target="_blank"
            rel="noreferrer"
          >
            <img class="project-card__image" data-slot-src="projects.item6.image" data-slot-alt="projects.item6.imageAlt" loading="lazy" decoding="async" />
            <div class="project-card__overlay">
              <span class="project-card__meta" data-slot="projects.item6.meta"></span>
              <h3 data-slot="projects.item6.title"></h3>
              <p data-slot="projects.item6.text"></p>
              <span class="project-card__link" data-slot="projects.item6.cta"></span>
            </div>
          </a>

          <a class="project-card project-card--cta" data-slot-href="projects.item7.href">
            <div class="project-card__cta-shell">
              <span class="project-card__meta" data-slot="projects.item7.meta"></span>
              <h3 data-slot="projects.item7.title"></h3>
              <p data-slot="projects.item7.text"></p>
              <span class="project-card__link" data-slot="projects.item7.cta"></span>
            </div>
          </a>
        </div>
      </section>

      <section class="pricing section container" id="pricing">
        <div class="pricing-head">
          <span class="kicker">Investissement</span>
          <h2>Un site pro. Un prix clair. Aucune surprise.</h2>
          <p>Tout compris : domaine + hébergement inclus an 1. Prix TTC. Garanti livré en 48h.</p>
        </div>
        <div class="pricing-cards">
          <div class="pc">
            <div class="pc__name">One Page</div>
            <div class="pc__sub">Parfait pour lancer vite — freelance, événement, lancement</div>
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
            <a href="/devis/?forfait=one-page" class="pc__cta">Lancer mon site en 48h →</a>
          </div>
          <div class="pc pc--featured">
            <div class="pc__badge">Best-seller</div>
            <div class="pc__name">Site 3 pages</div>
            <div class="pc__sub">Pour une présence complète — restaurant, artisan, créateur</div>
            <div class="pc__price-label">à partir de</div>
            <div class="pc__price">990 €</div>
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
            <a href="/devis/?forfait=3-pages" class="pc__cta">Lancer mon site en 48h →</a>
          </div>
          <div class="pc">
            <div class="pc__name">Site 5 pages +</div>
            <div class="pc__sub">Pour une architecture solide — cabinet, agence, immobilier</div>
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
            <a href="/devis/?forfait=5-pages" class="pc__cta">Lancer mon site en 48h →</a>
          </div>
          <div class="pc pc--custom">
            <div class="pc__body">
              <div class="pc__name">Sur mesure</div>
              <div class="pc__sub">Projet spécifique ? E-commerce, refonte, CRM, multilingue — on s'adapte à votre besoin.</div>
            </div>
            <a href="/devis/?forfait=sur-mesure" class="pc__cta">Nous contacter</a>
          </div>
        </div>
      </section>

      <section class="trust-strip container" aria-label="Garanties Launch48">
        <div class="trust-strip__intro">
          <span data-slot="trust.eyebrow"></span>
          <h2 data-slot="trust.title"></h2>
          <p data-slot="trust.text"></p>
        </div>
        <div class="trust-strip__grid">
          <article class="trust-metric">
            <span data-slot="trust.item1.label"></span>
          </article>
          <article class="trust-metric">
            <span data-slot="trust.item2.label"></span>
          </article>
          <article class="trust-metric">
            <span data-slot="trust.item3.label"></span>
          </article>
          <article class="trust-metric">
            <span data-slot="trust.item4.label"></span>
          </article>
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
        <a href="/quiz/">Quiz conversion</a>
        <a href="/blog/">Blog</a>
      </div>
      <a class="btn btn--small site-footer__cta" href="/partenaires/">Devenir partenaire</a>
      <div class="site-footer__legal">
        <a data-slot="footer.legal1.label" data-slot-href="footer.legal1.href"></a>
        <a data-slot="footer.legal2.label" data-slot-href="footer.legal2.href"></a>
        <a data-slot="footer.legal3.label" data-slot-href="footer.legal3.href"></a>
      </div>
      <p class="site-footer__note" data-slot="footer.domainFootnote"></p>
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

  panel.querySelectorAll('.nav-mobile__close').forEach((button) => {
    button.addEventListener('click', closeMenu);
  });

  document.addEventListener('click', (event) => {
    if (panel.hidden || panel.contains(event.target) || burger.contains(event.target)) return;
    closeMenu();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });
};

const setupMobileAppNavState = () => {
  const navItems = Array.from(document.querySelectorAll('.mobile-app-nav__item[href^="#"]'));
  if (navItems.length === 0) return;

  const sectionEntries = navItems
    .map((item) => {
      const hash = item.getAttribute('href');
      return hash ? { item, target: document.querySelector(hash) } : null;
    })
    .filter((entry) => entry && entry.target);

  if (sectionEntries.length === 0) return;

  const setCurrent = (currentItem) => {
    navItems.forEach((item) => {
      if (item === currentItem) {
        item.setAttribute('aria-current', 'page');
      } else {
        item.removeAttribute('aria-current');
      }
    });
  };

  const syncCurrent = () => {
    const threshold = window.innerHeight * 0.42;
    const current = sectionEntries.reduce((active, entry) => {
      const rect = entry.target.getBoundingClientRect();
      return rect.top <= threshold ? entry : active;
    }, sectionEntries[0]);

    setCurrent(current.item);
  };

  navItems.forEach((item) => {
    item.addEventListener('click', () => setCurrent(item));
  });

  syncCurrent();
  window.addEventListener('scroll', syncCurrent, { passive: true });
  window.addEventListener('resize', syncCurrent, { passive: true });
};

const setupFloatingDevisCta = () => {
  const cta = document.querySelector('.floating-devis-cta');
  const hero = document.querySelector('#hero');
  if (!cta || !hero) return;

  const update = () => {
    cta.classList.toggle('is-visible', hero.getBoundingClientRect().bottom < 0);
  };

  update();
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
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
  const mobileOffset = 88;
  const desktopOffset = (window.innerHeight - rect.height) / 2;
  const targetY = Math.max(0, absoluteTop - (isMobileViewport() ? mobileOffset : desktopOffset));
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
  if (isMobileViewport()) return;

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

  const renderTypewriterText = (el) => {
    const segments = el.dataset.typewriterSegments.split('|');
    el.textContent = '';
    segments.forEach((seg, i) => {
      el.insertAdjacentText('beforeend', seg);
      if (i < segments.length - 1) el.insertAdjacentHTML('beforeend', '<br>');
    });
  };

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const h1 = heroEl.querySelector('.hero__title[data-typewriter-segments]');
    if (h1) renderTypewriterText(h1);
    return;
  }

  // Typewriter
  (function () {
    const el = heroEl.querySelector('.hero__title[data-typewriter-segments]');
    if (!el) return;
    const fullText = el.dataset.typewriterSegments.replace(/\|/g, ' ');
    const startDelay = isMobileViewport() ? 160 : 320;
    const letterDelay = isMobileViewport() ? 32 : 38;
    const reservedHeight = el.offsetHeight;
    const keepStaticUntilStart = isMobileViewport();
    if (reservedHeight > 0) el.style.minHeight = `${reservedHeight}px`;
    el.setAttribute('aria-label', fullText);
    const segments = el.dataset.typewriterSegments.split('|');
    const cursor = document.createElement('span');
    cursor.className = 'type-cursor';
    cursor.setAttribute('aria-hidden', 'true');
    if (!keepStaticUntilStart) {
      el.textContent = '';
      el.appendChild(cursor);
    }

    const tokens = segments.flatMap((segment, segmentIndex) => {
      const chars = [...segment];
      return segmentIndex < segments.length - 1 ? [...chars, '\n'] : chars;
    });

    const renderUntil = (count) => {
      el.textContent = '';
      const fragment = document.createDocumentFragment();
      tokens.slice(0, count).forEach((token) => {
        fragment.appendChild(token === '\n' ? document.createElement('br') : document.createTextNode(token));
      });
      el.appendChild(fragment);
      el.appendChild(cursor);
    };

    let startedAt = 0;
    function typeNext(now = performance.now()) {
      if (!startedAt) startedAt = now;
      const elapsed = now - startedAt;
      const visibleCount = Math.min(tokens.length, Math.max(1, Math.floor(elapsed / letterDelay)));
      renderUntil(visibleCount);
      if (visibleCount >= tokens.length) {
        el.style.minHeight = '';
        return;
      }
      setTimeout(() => typeNext(), 34);
    }
    setTimeout(() => typeNext(), startDelay);
  }());

  // Parallax + mouse
  let sy = 0, mx = 0, my = 0, lx = 0, ly = 0, rafId;
  function lp(a, b, t) { return a + (b - a) * t; }

  if (isMobileViewport()) {
    return;
  }

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


const setupMobileProcessScroll = () => {
  const processSection = document.querySelector('#process');
  const processSteps = Array.from(document.querySelectorAll('.process-step'));
  const processProgressFill = document.querySelector('.process__progress-fill');
  const processProgressRocket = document.querySelector('.process__progress-rocket');

  if (!processSection || !processProgressFill || !processProgressRocket || processSteps.length === 0) return;

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  let ticking = false;

  const applyProgress = () => {
    ticking = false;

    const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 1;
    const sectionTop = processSection.getBoundingClientRect().top + window.scrollY;
    const sectionHeight = processSection.offsetHeight || 1;
    const startY = sectionTop - viewportHeight * 0.72;
    const endY = sectionTop + sectionHeight - viewportHeight * 0.32;
    const progress = clamp((window.scrollY - startY) / Math.max(1, endY - startY), 0, 1);
    const progressPercent = clamp(2 + progress * 96, 2, 98);
    const currentIndex = Math.min(processSteps.length - 1, Math.floor(progress * processSteps.length));

    processProgressFill.style.transformOrigin = '0% 50%';
    processProgressFill.style.transform = `scaleX(${progress.toFixed(4)})`;
    processProgressRocket.style.left = `${progressPercent.toFixed(2)}%`;
    processProgressRocket.style.transform = 'translate(-50%, -50%) scaleX(-1)';

    processSteps.forEach((step, index) => {
      step.classList.toggle('is-active', index <= currentIndex);
    });
  };

  const requestUpdate = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(applyProgress);
  };

  requestUpdate();
  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate, { passive: true });
  window.addEventListener('pagehide', () => {
    window.removeEventListener('scroll', requestUpdate);
    window.removeEventListener('resize', requestUpdate);
  }, { once: true });
};


const setupAnimations = () => {
  if (prefersReducedMotion) {
    document.body.classList.add('reduced-motion');
    return;
  }

  if (isMobileViewport()) {
    setupMobileProcessScroll();
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
    const response = await fetch(`/content.html?v=${contentVersion}`, {
      cache: 'no-store'
    });
    if (!response.ok) throw new Error('content.html non disponible');
    const html = await response.text();
    return { slots: { ...parseSlotsFromHtml(html), ...latestProjectSlots }, hasError: false };
  } catch {
    return { slots: { ...fallbackSlots, ...latestProjectSlots }, hasError: true };
  }
};

const init = async () => {
  renderShell();
  const initialSlots = readCachedSlots() || { ...fallbackSlots, ...latestProjectSlots };
  injectSlots(initialSlots);
  cleanupOptionalContent();
  applyMeta(initialSlots);

  const { slots, hasError } = await loadSlots();
  if (!hasError) {
    writeCachedSlots(slots);
  }

  injectSlots(slots);
  cleanupOptionalContent();
  applyMeta(slots);
  setupTheme();
  setupMobileNav();
  setupMobileAppNavState();
  setupFloatingDevisCta();
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

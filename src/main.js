import './styles.css';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const app = document.querySelector('#app');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const fallbackSlots = {
  'meta.title': 'Launch48',
  'meta.description': 'Contenu indisponible.',
  'brand.name': 'Launch48',
  'brand.tagline': 'Contenu local de secours',
  'hero.title': 'Launch48',
  'hero.subtitle': 'Le fichier content.html est introuvable pour le moment.'
};

const renderShell = () => {
  app.innerHTML = `
    <div class="cursor" aria-hidden="true"></div>
    <header class="site-header" id="top">
      <nav class="nav container" aria-label="Navigation principale">
        <a class="brand" href="#top">
          <span class="brand__name" data-slot="brand.name"></span>
          <span class="brand__tag" data-slot="brand.tagline"></span>
        </a>
        <div class="nav__links">
          <a data-slot="nav.link1.label" data-slot-href="nav.link1.href"></a>
          <a data-slot="nav.link2.label" data-slot-href="nav.link2.href"></a>
          <a data-slot="nav.link3.label" data-slot-href="nav.link3.href"></a>
          <a data-slot="nav.link4.label" data-slot-href="nav.link4.href"></a>
        </div>
        <div class="nav__actions">
          <button class="theme-toggle" type="button" aria-label="Basculer thème">Theme</button>
          <a class="btn btn--small magnetic" data-slot="nav.cta.label" data-slot-href="nav.cta.href"></a>
        </div>
      </nav>
    </header>

    <main id="main">
      <section class="hero section container" id="hero">
        <p class="hero__eyebrow" data-slot="hero.eyebrow"></p>
        <h1 class="hero__title" data-slot="hero.title"></h1>
        <p class="hero__subtitle" data-slot="hero.subtitle"></p>
        <div class="hero__badges">
          <span class="pill" data-slot="hero.badge1"></span>
          <span class="pill" data-slot="hero.badge2"></span>
          <span class="pill" data-slot="hero.badge3"></span>
        </div>
        <div class="hero__cta">
          <a class="btn magnetic" data-slot="hero.primaryCta.label" data-slot-href="hero.primaryCta.href"></a>
          <a class="btn btn--ghost" data-slot="hero.secondaryCta.label" data-slot-href="hero.secondaryCta.href"></a>
        </div>
        <p class="hero__scroll-hint" data-slot="hero.scrollHint"></p>
      </section>

      <section class="proof section" id="proof">
        <div class="container">
          <h2 data-slot="proof.title"></h2>
          <p class="section-intro" data-slot="proof.subtitle"></p>
        </div>
        <div class="proof-track-wrap">
          <div class="proof-track container">
            <article class="proof-card">
              <h3 data-slot="proof.item1.title"></h3>
              <p data-slot="proof.item1.text"></p>
            </article>
            <article class="proof-card">
              <h3 data-slot="proof.item2.title"></h3>
              <p data-slot="proof.item2.text"></p>
            </article>
            <article class="proof-card">
              <h3 data-slot="proof.item3.title"></h3>
              <p data-slot="proof.item3.text"></p>
            </article>
            <article class="proof-card">
              <h3 data-slot="proof.item4.title"></h3>
              <p data-slot="proof.item4.text"></p>
            </article>
          </div>
        </div>
      </section>

      <section class="offer section container" id="offer">
        <h2 data-slot="offer.title"></h2>
        <p class="section-intro" data-slot="offer.subtitle"></p>
        <div class="offer-stack">
          <article class="offer-card is-active">
            <h3 data-slot="offer.card1.title"></h3>
            <ul>
              <li data-slot="offer.card1.item1"></li>
              <li data-slot="offer.card1.item2"></li>
              <li data-slot="offer.card1.item3"></li>
            </ul>
          </article>
          <article class="offer-card">
            <h3 data-slot="offer.card2.title"></h3>
            <ul>
              <li data-slot="offer.card2.item1"></li>
              <li data-slot="offer.card2.item2"></li>
              <li data-slot="offer.card2.item3"></li>
            </ul>
          </article>
          <article class="offer-card">
            <h3 data-slot="offer.card3.title"></h3>
            <ul>
              <li data-slot="offer.card3.item1"></li>
              <li data-slot="offer.card3.item2"></li>
              <li data-slot="offer.card3.item3"></li>
            </ul>
          </article>
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

      <section class="process section container" id="process">
        <h2 data-slot="process.title"></h2>
        <p class="section-intro" data-slot="process.subtitle"></p>
        <div class="process__progress" aria-hidden="true">
          <span class="process__progress-fill"></span>
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
      </section>

      <section class="pricing section container" id="pricing">
        <h2 data-slot="pricing.title"></h2>
        <p class="pricing__price" data-slot="pricing.price"></p>
        <p class="pricing__note" data-slot="pricing.note"></p>
        <div class="pricing__cta">
          <a class="btn magnetic" data-slot="pricing.primaryCta.label" data-slot-href="pricing.primaryCta.href"></a>
          <a class="btn btn--ghost" data-slot="pricing.secondaryCta.label" data-slot-href="pricing.secondaryCta.href"></a>
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
    </main>

    <footer class="site-footer section container">
      <p class="site-footer__name" data-slot="footer.name"></p>
      <a data-slot="footer.email" data-slot-href="footer.email"></a>
      <div class="site-footer__socials">
        <a data-slot="footer.social1.label" data-slot-href="footer.social1.href"></a>
        <a data-slot="footer.social2.label" data-slot-href="footer.social2.href"></a>
        <a data-slot="footer.social3.label" data-slot-href="footer.social3.href"></a>
      </div>
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

const splitHeroTitle = () => {
  const heroTitle = document.querySelector('.hero__title');
  if (!heroTitle) return [];
  const text = heroTitle.textContent || '';
  heroTitle.innerHTML = text
    .split('')
    .map((char) => `<span class="hero-char">${char === ' ' ? '&nbsp;' : char}</span>`)
    .join('');
  return Array.from(heroTitle.querySelectorAll('.hero-char'));
};

const setupTheme = () => {
  const saved = localStorage.getItem('launch48-theme');
  if (saved === 'light' || saved === 'dark') {
    document.documentElement.dataset.theme = saved;
  }

  const toggle = document.querySelector('.theme-toggle');
  if (!toggle) return;

  const updateLabel = () => {
    const current = document.documentElement.dataset.theme || 'dark';
    toggle.textContent = current === 'dark' ? 'Light' : 'Dark';
  };

  updateLabel();
  toggle.addEventListener('click', () => {
    const current = document.documentElement.dataset.theme || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    localStorage.setItem('launch48-theme', next);
    updateLabel();
  });
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

  window.addEventListener('pointermove', (event) => {
    cursor.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`;
    cursor.classList.add('is-visible');
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

const setupAnimations = () => {
  if (prefersReducedMotion) {
    document.body.classList.add('reduced-motion');
    return;
  }

  const heroChars = splitHeroTitle();
  gsap.from('.hero > *', {
    opacity: 0,
    y: 30,
    stagger: 0.08,
    duration: 0.8,
    ease: 'power2.out'
  });

  if (heroChars.length > 0) {
    gsap.to(heroChars, {
      yPercent: -18,
      stagger: 0.015,
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });

    gsap.to('.hero__title', {
      letterSpacing: '0.05em',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });
  }

  ScrollTrigger.create({
    trigger: document.body,
    start: 'top top',
    end: '+=200',
    onUpdate: (self) => {
      document.querySelector('.site-header')?.classList.toggle('is-scrolled', self.progress > 0.2);
    }
  });

  const proofCards = gsap.utils.toArray('.proof-card');
  const media = gsap.matchMedia();

  media.add('(min-width: 960px)', () => {
    const track = document.querySelector('.proof-track');
    if (proofCards.length < 2 || !track) return;

    gsap.to(proofCards, {
      xPercent: -100 * (proofCards.length - 1),
      ease: 'none',
      scrollTrigger: {
        trigger: '.proof-track-wrap',
        pin: true,
        scrub: 1,
        snap: 1 / (proofCards.length - 1),
        end: () => `+=${track.scrollWidth}`
      }
    });
  });

  media.add('(max-width: 959px)', () => {
    gsap.from('.proof-card', {
      opacity: 0,
      y: 40,
      stagger: 0.1,
      scrollTrigger: {
        trigger: '.proof-track-wrap',
        start: 'top 85%'
      }
    });
  });

  const offerCards = gsap.utils.toArray('.offer-card');
  if (offerCards.length > 1) {
    gsap.set(offerCards.slice(1), { autoAlpha: 0, y: 35 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.offer-stack',
        start: 'top 14%',
        end: `+=${offerCards.length * 360}`,
        scrub: 1,
        pin: true
      }
    });

    offerCards.forEach((card, index) => {
      if (index === 0) return;
      tl.to(offerCards[index - 1], { autoAlpha: 0.15, y: -20, duration: 0.55 }, index * 0.9);
      tl.to(card, { autoAlpha: 1, y: 0, duration: 0.55 }, index * 0.9);
    });
  }

  gsap.to('.process__progress-fill', {
    scaleX: 1,
    transformOrigin: '0% 50%',
    ease: 'none',
    scrollTrigger: {
      trigger: '#process',
      start: 'top 65%',
      end: 'bottom 25%',
      scrub: true
    }
  });

  gsap.utils.toArray('.process-step').forEach((step) => {
    ScrollTrigger.create({
      trigger: step,
      start: 'top 70%',
      end: 'bottom 50%',
      toggleClass: { targets: step, className: 'is-active' }
    });
  });

  gsap.from('.pricing', {
    opacity: 0,
    y: 60,
    scrollTrigger: {
      trigger: '.pricing',
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
  applyMeta(slots);
  setupTheme();
  setupFaq();
  setupCursor();
  setupMagneticButtons();
  setupHaptics();
  setupAnimations();

  if (hasError) {
    const warning = document.createElement('p');
    warning.className = 'content-warning container';
    warning.textContent = 'Impossible de charger public/content.html. Affichage du fallback minimal.';
    document.querySelector('main')?.prepend(warning);
  }
};

init();

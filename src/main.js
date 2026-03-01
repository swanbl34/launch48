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

const renderShell = () => {
  app.innerHTML = `
    <div class="cursor" aria-hidden="true"></div>
    <header class="site-header" id="top">
      <nav class="nav container" aria-label="Navigation principale">
        <a class="brand" href="#top">
          <span class="brand__name" data-slot="brand.name"></span>
        </a>
        <div class="nav__links">
          <a data-slot="nav.link1.label" data-slot-href="nav.link1.href"></a>
          <a data-slot="nav.link2.label" data-slot-href="nav.link2.href"></a>
          <a data-slot="nav.link3.label" data-slot-href="nav.link3.href"></a>
          <a data-slot="nav.link4.label" data-slot-href="nav.link4.href"></a>
        </div>
        <div class="nav__actions">
          <button class="theme-toggle" type="button" aria-label="Basculer thème">Clair</button>
          <a class="btn btn--small magnetic" data-slot="nav.cta.label" data-slot-href="nav.cta.href"></a>
        </div>
      </nav>
    </header>

    <main id="main">
      <section class="hero section container" id="hero">
        <div class="hero__layout">
          <div class="hero__content">
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
          </div>
          <aside class="hero__visual" aria-label="Aperçus de designs de sites">
            <img class="hero__shot hero__shot--a" src="/illustrations/hero-site-1.svg" alt="Aperçu design site premium" loading="lazy" decoding="async" />
            <img class="hero__shot hero__shot--b" src="/illustrations/hero-site-2.svg" alt="Aperçu page web moderne" loading="lazy" decoding="async" />
            <img class="hero__shot hero__shot--c" src="/illustrations/hero-site-3.svg" alt="Aperçu interface service" loading="lazy" decoding="async" />
            <img class="hero__shot hero__shot--d" src="/illustrations/hero-site-4.svg" alt="Aperçu landing page conversion" loading="lazy" decoding="async" />
            <img class="hero__shot hero__shot--e" src="/illustrations/hero-site-5.svg" alt="Aperçu site événementiel" loading="lazy" decoding="async" />
          </aside>
        </div>
      </section>

      <section class="process section container" id="process">
        <div class="process-sticky">
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
      <div class="site-footer__legal">
        <a data-slot="footer.legal1.label" data-slot-href="footer.legal1.href"></a>
        <a data-slot="footer.legal2.label" data-slot-href="footer.legal2.href"></a>
        <a data-slot="footer.legal3.label" data-slot-href="footer.legal3.href"></a>
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

  const toggle = document.querySelector('.theme-toggle');
  if (!toggle) return;

  const updateLabel = () => {
    const current = document.documentElement.dataset.theme || 'dark';
    toggle.textContent = current === 'dark' ? 'Clair' : 'Sombre';
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

const setupAnimations = () => {
  if (prefersReducedMotion) {
    document.body.classList.add('reduced-motion');
    return;
  }

  gsap.from('.hero > *', {
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

  if (processSection && processSticky && processProgressFill && processSteps.length > 0) {
    ScrollTrigger.create({
      trigger: processSection,
      start: 'center center',
      end: () => `+=${window.innerHeight * (window.innerWidth < 760 ? 1.45 : 1.9)}`,
      pin: processSticky,
      scrub: true,
      pinSpacing: true,
      pinType: 'fixed',
      pinReparent: true,
      anticipatePin: 3,
      fastScrollEnd: true,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        gsap.set(processProgressFill, {
          scaleX: self.progress,
          transformOrigin: '0% 50%'
        });

        const currentIndex = Math.min(processSteps.length - 1, Math.floor(self.progress * processSteps.length));
        processSteps.forEach((step, index) => {
          step.classList.toggle('is-active', index <= currentIndex);
        });
      }
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
  setupCenteredAnchors();
  setupBackgroundScroll();
  setupHeaderScrollState();
  setupAnimations();

  if (hasError) {
    const warning = document.createElement('p');
    warning.className = 'content-warning container';
    warning.textContent = 'Impossible de charger public/content.html. Affichage du fallback minimal.';
    document.querySelector('main')?.prepend(warning);
  }
};

init();

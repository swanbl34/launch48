import './home.css';

/* Launch48 — interactions de la home.
   Règle: chaque effet guide l'œil vers le contenu ou le CTA. Rien de bloquant,
   rien de coûteux sur mobile, tout se désactive si l'utilisateur le demande. */

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const isDesktop = () => window.matchMedia('(min-width: 900px)').matches;
const isSmallScreen = () => window.matchMedia('(max-width: 767px)').matches;

/* ── Header : fond + blur une fois qu'on a quitté le haut de page ────────── */
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
const setupGlowParallax = () => {
  const layers = Array.from(document.querySelectorAll('[data-parallax]'));
  if (!layers.length || reduceMotion.matches || isSmallScreen()) return;

  const MAX_OFFSET = 90;
  let ticking = false;

  // Décalage calculé par rapport au centre de l'écran, et borné : un
  // `scrollY * facteur` non borné ferait grandir la hauteur du document.
  const update = () => {
    const viewportHeight = window.innerHeight || 1;
    layers.forEach((layer) => {
      const factor = Number.parseFloat(layer.dataset.parallax) || 0.1;
      const host = layer.parentElement;
      if (!host) return;
      const rect = host.getBoundingClientRect();
      const distance = rect.top + rect.height / 2 - viewportHeight / 2;
      const offset = Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, -distance * factor));
      layer.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
    });
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

/* ── Process : barre de progression + fusée + cartes qui s'activent ──────── */
const setupProcessProgress = () => {
  const section = document.querySelector('.process');
  const fill = document.querySelector('.process-progress__fill');
  const rocket = document.querySelector('.process-progress__rocket');
  const steps = Array.from(document.querySelectorAll('.step'));
  if (!section || !fill || !rocket || !steps.length) return;

  // Sans animation : on montre l'état d'arrivée, rien ne bouge au scroll.
  if (reduceMotion.matches) {
    fill.style.transform = 'scaleX(1)';
    rocket.style.display = 'none';
    steps.forEach((step) => step.classList.add('is-active'));
    return;
  }

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  let ticking = false;

  const update = () => {
    ticking = false;

    const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 1;
    const sectionTop = section.getBoundingClientRect().top + window.scrollY;
    const sectionHeight = section.offsetHeight || 1;
    const start = sectionTop - viewportHeight * 0.72;
    const end = sectionTop + sectionHeight - viewportHeight * 0.32;
    const progress = clamp((window.scrollY - start) / Math.max(1, end - start), 0, 1);

    fill.style.transform = `scaleX(${progress.toFixed(4)})`;
    rocket.style.left = `${clamp(2 + progress * 96, 2, 98).toFixed(2)}%`;

    const currentIndex = Math.min(steps.length - 1, Math.floor(progress * steps.length));
    steps.forEach((step, index) => step.classList.toggle('is-active', index <= currentIndex));
  };

  update();
  const request = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(update);
  };
  window.addEventListener('scroll', request, { passive: true });
  window.addEventListener('resize', request, { passive: true });
};

/* ── FAQ : accordéon accessible ──────────────────────────────────────────── */
const setupFaq = () => {
  const questions = Array.from(document.querySelectorAll('.faq__q'));
  if (!questions.length) return;

  const setState = (button, open) => {
    const panel = document.getElementById(button.getAttribute('aria-controls'));
    button.setAttribute('aria-expanded', String(open));
    button.closest('.faq__item')?.classList.toggle('is-open', open);
    if (panel) panel.hidden = !open;
  };

  questions.forEach((button) => {
    button.addEventListener('click', () => {
      const open = button.getAttribute('aria-expanded') === 'true';
      questions.forEach((other) => setState(other, false));
      setState(button, !open);
    });
  });
};

/* ── Barre d'action mobile : visible entre le hero et le formulaire ─────── */
const setupThumbBar = () => {
  const bar = document.querySelector('.thumb-bar');
  if (!bar || !('IntersectionObserver' in window)) return;

  // Zones où la barre s'efface : le hero (les CTA y sont déjà) et la fin de
  // page (audit + CTA final + footer), pour ne pas doubler l'appel à l'action.
  const mutes = ['.hero', '#audit', '.final', '.footer']
    .map((selector) => document.querySelector(selector))
    .filter(Boolean);
  if (!mutes.length) return;

  const visible = new Set();
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) visible.add(entry.target);
        else visible.delete(entry.target);
      });
      bar.classList.toggle('is-visible', visible.size === 0);
    },
    { threshold: 0 }
  );
  mutes.forEach((node) => observer.observe(node));
};

/* ── Formulaire d'audit : envoi sans quitter la page ─────────────────────── */
const setupAuditForm = () => {
  const form = document.querySelector('.audit__form');
  if (!form) return;

  const status = form.querySelector('.form-status');
  const submit = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const initialLabel = submit.innerHTML;
    submit.disabled = true;
    submit.textContent = 'Envoi…';
    status.classList.remove('is-error');
    status.textContent = '';

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      });
      if (!response.ok) throw new Error('Envoi impossible');

      form.reset();
      status.textContent = 'Merci ! Votre audit arrive par email sous 24h.';
      submit.innerHTML = initialLabel;
      submit.disabled = false;
    } catch {
      status.classList.add('is-error');
      status.innerHTML =
        'L\'envoi a échoué. Écrivez-nous à <a href="mailto:contact@launch48.fr">contact@launch48.fr</a>.';
      submit.innerHTML = initialLabel;
      submit.disabled = false;
    }
  });
};

setupHeader();
setupNavPill();
setupMobileMenu();
setupReveal();
setupGlowParallax();
setupProcessProgress();
setupFaq();
setupThumbBar();
setupAuditForm();

// Signale au garde-fou du <head> que le module a bien démarré.
document.documentElement.dataset.homeReady = '1';

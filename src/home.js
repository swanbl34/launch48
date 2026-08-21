import './shell.css';
import './home.css';
import { initShell, reduceMotion } from './shell.js';

/* Launch48 — interactions de la home.
   Règle: chaque effet guide l'œil vers le contenu ou le CTA. Rien de bloquant,
   rien de coûteux sur mobile, tout se désactive si l'utilisateur le demande. */

const isSmallScreen = () => window.matchMedia('(max-width: 767px)').matches;

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

/* ── Dégradé animé du hero ───────────────────────────────────────────────
   ShaderGradient n'existe qu'en React : on le charge en import() dynamique
   après le premier rendu, pour que React, three et R3F ne retardent ni le
   LCP ni l'interactivité. Rien n'est téléchargé si l'utilisateur limite les
   animations.                                                             */
const setupBackgroundGradient = () => {
  const host = document.querySelector('#bg-gradient');
  if (!host || reduceMotion.matches) return;

  // Desktop seulement : le module pèse 346 Ko et l'effet est peu visible sur
  // un petit écran. Rien n'est téléchargé sur mobile.
  const wide = window.matchMedia('(min-width: 900px)');

  let started = false;
  const load = () => {
    if (started) return;
    started = true;
    import('./bg-gradient.js')
      .then((module) => module.mountBackgroundGradient(host))
      .catch(() => {
        // Le hero reste parfaitement lisible sans le dégradé.
      });
  };

  const schedule = () => {
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(load, { timeout: 2500 });
    } else {
      window.setTimeout(load, 1200);
    }
  };

  if (wide.matches) {
    schedule();
    return;
  }

  // Si l'écran s'élargit ensuite (rotation, fenêtre agrandie), on charge alors.
  wide.addEventListener('change', (event) => {
    if (event.matches) schedule();
  });
};

/* ── Scène du hero : parallaxe de profondeur au pointeur ─────────────────
   On ne fait pivoter que la scène : comme chaque élément a son propre
   translateZ, la perspective déplace les plans proches (fusée, cartes,
   téléphone) plus que les plans lointains (laptop). Le relief est donc
   physique, pas simulé — et l'amplitude reste faible pour ne pas gêner
   la lecture.                                                            */
const setupScenePointer = () => {
  const hero = document.querySelector('.hero');
  const stage = document.querySelector('.scene__stage');
  const scene = document.querySelector('.scene');
  if (!hero || !stage || !scene) return;

  // Souris uniquement : au doigt, ce mouvement n'a pas de sens.
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  if (reduceMotion.matches || !finePointer.matches) return;

  const AMP_X = 3; // basculement haut/bas
  const AMP_Y = 4.8; // rotation gauche/droite
  const EASE = 0.075; // approche progressive, aucun à-coup

  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  let frame = null;

  const render = () => {
    currentX += (targetX - currentX) * EASE;
    currentY += (targetY - currentY) * EASE;

    stage.style.setProperty('--stage-mx', `${currentX.toFixed(3)}deg`);
    stage.style.setProperty('--stage-my', `${currentY.toFixed(3)}deg`);
    scene.style.setProperty('--pointer-x', (currentY / AMP_Y).toFixed(3));

    // On rend la main dès que le mouvement est imperceptible.
    if (Math.abs(targetX - currentX) > 0.008 || Math.abs(targetY - currentY) > 0.008) {
      frame = window.requestAnimationFrame(render);
    } else {
      frame = null;
    }
  };

  const start = () => {
    if (!frame) frame = window.requestAnimationFrame(render);
  };

  hero.addEventListener(
    'pointermove',
    (event) => {
      if (event.pointerType !== 'mouse') return;
      const rect = hero.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = ((event.clientY - rect.top) / rect.height) * 2 - 1;
      targetY = x * AMP_Y;
      targetX = -y * AMP_X;
      start();
    },
    { passive: true }
  );

  // Retour à la pose de repos quand la souris quitte le hero.
  hero.addEventListener('pointerleave', () => {
    targetX = 0;
    targetY = 0;
    start();
  });
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

/* ── CTA final : ouverture en plein écran au scroll ──────────────────────
   On ne pose qu'une variable, --expand, de 0 à 1 : tout le rendu est décidé en
   CSS. Le JS ne touche ni à une taille ni à une position, donc rien ne peut
   partir de travers si la feuille de style change.

   Le découpage de la course : on ouvre sur le premier tiers, on tient plein
   écran sur le tiers du milieu, on referme sur le dernier. Sans ce palier
   central, le panneau se refermerait à l'instant même où il finit de s'ouvrir
   et on n'aurait jamais le temps de lire.                                   */
const setupFinalExpand = () => {
  const section = document.querySelector('.final');
  const track = document.querySelector('.final__track');
  if (!section || !track) return;

  // Seule condition restante : la limitation d'animations. L'ouverture vaut
  // aussi sur téléphone, avec ses propres réglages côté CSS.
  const clamp = (value) => Math.min(1, Math.max(0, value));
  // Adoucit les deux extrémités : en linéaire, le départ et l'arrivée
  // s'aperçoivent comme des ruptures.
  const ease = (t) => t * t * (3 - 2 * t);

  const OPEN_UNTIL = 0.34;
  const HOLD_UNTIL = 0.66;

  let ticking = false;

  const update = () => {
    ticking = false;

    if (reduceMotion.matches) {
      section.style.removeProperty('--expand');
      return;
    }

    const rect = track.getBoundingClientRect();
    const viewportHeight = window.innerHeight || 1;
    // Course utile : la hauteur du rail moins l'écran, c'est-à-dire la distance
    // pendant laquelle le bloc collé reste à l'écran.
    const distance = rect.height - viewportHeight;
    if (distance <= 0) {
      section.style.setProperty('--expand', '0');
      return;
    }

    const progress = clamp(-rect.top / distance);
    let expand;
    if (progress < OPEN_UNTIL) expand = progress / OPEN_UNTIL;
    else if (progress < HOLD_UNTIL) expand = 1;
    else expand = 1 - (progress - HOLD_UNTIL) / (1 - HOLD_UNTIL);

    section.style.setProperty('--expand', ease(clamp(expand)).toFixed(4));
  };

  const request = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(update);
  };

  update();
  window.addEventListener('scroll', request, { passive: true });
  window.addEventListener('resize', request, { passive: true });
  reduceMotion.addEventListener?.('change', request);
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

initShell();
setupGlowParallax();
setupScenePointer();
setupBackgroundGradient();
setupProcessProgress();
setupFinalExpand();
setupFaq();
setupAuditForm();

// Signale au garde-fou du <head> que le module a bien démarré.
document.documentElement.dataset.homeReady = '1';

/* Launch48 — comportements communs à toutes les pages.
   Barre de navigation en îlot, pastille du menu, menu mobile et apparitions
   au scroll. Chaque page appelle initShell() ; les modules spécifiques
   (scène du hero, carrousels, formulaires) restent dans leur propre fichier. */

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const isDesktop = () => window.matchMedia('(min-width: 900px)').matches;

const setupHeader = () => {
  const header = document.querySelector('.header');
  if (!header) return;

  /* Deux seuils distincts. `is-scrolled` se déclenche au moindre défilement et
     resserre la barre en capsule. `is-past-hero` attend qu'on ait quitté le
     premier écran : c'est lui qui déplie le bouton d'appel à l'action sur
     téléphone. Sur les pages sans hero, on se rabat sur une demi-hauteur
     d'écran. */
  const hero = document.querySelector('.hero');

  const pastHero = () => {
    if (hero) {
      // Le bas du hero est passé sous la barre de navigation.
      return hero.getBoundingClientRect().bottom <= header.offsetHeight;
    }
    return window.scrollY > window.innerHeight * 0.45;
  };

  let ticking = false;
  const update = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 8);
    header.classList.toggle('is-past-hero', pastHero());
    ticking = false;
  };

  const request = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(update);
  };

  update();
  window.addEventListener('scroll', request, { passive: true });
  // La hauteur du hero change avec la largeur : le seuil doit suivre.
  window.addEventListener('resize', request, { passive: true });
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

/* ── Curseur personnalisé ────────────────────────────────────────────────
   Un point qui colle au pointeur, et un anneau qui le rattrape avec un léger
   retard. L'anneau s'ouvre au survol de ce qui est cliquable, se resserre au
   clic. Tout est en transform sur deux éléments fixes : aucune mise en page
   n'est recalculée.

   Quatre garde-fous, chacun pour une raison précise :
   - souris uniquement. Au doigt, un curseur n'a pas de sens et le pointeur
     resterait figé là où on a tapé ;
   - le curseur natif n'est masqué qu'une fois le nôtre en place (classe posée
     par ce script). Si le script ne tourne pas, on garde un vrai curseur ;
   - les champs de saisie récupèrent le curseur natif : la barre d'insertion
     indique où l'on va taper, un point ne le fait pas ;
   - au-dessus d'une iframe, le document parent ne reçoit plus d'événements de
     pointeur. Sans traitement, le curseur se figerait au bord du calendrier de
     réservation. On rend donc la main au curseur natif.                    */
const setupCursor = () => {
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  if (!finePointer.matches) return;

  const dot = document.createElement('div');
  dot.className = 'cursor__dot';
  const ring = document.createElement('div');
  ring.className = 'cursor__ring';
  dot.setAttribute('aria-hidden', 'true');
  ring.setAttribute('aria-hidden', 'true');
  /* Les deux éléments naissent invisibles, et le curseur natif n'est PAS encore
     masqué. Tant qu'aucun pointermove n'a eu lieu, on ne connaît pas la
     position réelle de la souris : sans transform, ils se placent en haut à
     gauche de l'écran. Au chargement d'une page — donc après chaque clic sur
     un lien — on voyait un rond cyan dans le coin, et plus aucun curseur là
     où se trouvait vraiment la souris. */
  dot.classList.add('cursor--idle');
  ring.classList.add('cursor--idle');
  document.body.append(ring, dot);

  const INTERACTIVE = 'a, button, summary, label, [role="button"], [tabindex]:not([tabindex="-1"])';
  /* Seuls les champs où l'on saisit du texte reprennent le curseur natif : la
     barre d'insertion y est une information. Les cases et boutons radio en
     sont exclus — nos pastilles de choix sont des <label> recouverts d'un radio
     invisible, et elles doivent garder l'anneau de survol. */
  const NATIVE = [
    'input:not(:is([type="radio"], [type="checkbox"], [type="submit"], [type="button"], [type="hidden"], [type="range"], [type="color"], [type="file"]))',
    'textarea',
    'select',
    'iframe',
    '[contenteditable="true"]',
  ].join(', ');

  let pointerX = 0;
  let pointerY = 0;
  let ringX = 0;
  let ringY = 0;
  let frame = null;
  let ready = false;

  /* Première position connue : on place les deux éléments, on colle l'anneau
     au point (sinon il traverse l'écran depuis son origine à chaque
     chargement), puis on masque le curseur natif et on se montre. */
  const reveal = () => {
    if (ready) return;
    ready = true;
    ringX = pointerX;
    ringY = pointerY;
    ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
    document.documentElement.classList.add('has-cursor');
    dot.classList.remove('cursor--idle');
    ring.classList.remove('cursor--idle');
  };

  /* Retard nul si l'utilisateur limite les animations : le curseur reste, mais
     l'anneau ne traîne plus derrière. */
  const followSpeed = () => (reduceMotion.matches ? 1 : 0.18);

  const render = () => {
    const speed = followSpeed();
    ringX += (pointerX - ringX) * speed;
    ringY += (pointerY - ringY) * speed;
    ring.style.transform = `translate3d(${ringX.toFixed(2)}px, ${ringY.toFixed(2)}px, 0)`;

    // On rend la main dès que l'anneau a rattrapé : pas de boucle permanente.
    if (Math.abs(pointerX - ringX) > 0.3 || Math.abs(pointerY - ringY) > 0.3) {
      frame = window.requestAnimationFrame(render);
    } else {
      frame = null;
    }
  };

  const start = () => {
    if (!frame) frame = window.requestAnimationFrame(render);
  };

  /* Sélection de texte en cours : on rend la main au curseur natif. Pour
     surligner, la barre en I du système est plus précise que n'importe quel
     point — elle montre au caractère près où commence et où finit la
     sélection. */
  let selecting = false;

  const applyState = (eventTarget) => {
    const target = eventTarget instanceof Element ? eventTarget : null;
    const root = document.documentElement;

    if (selecting) {
      root.classList.remove('cursor-hover');
      root.classList.add('cursor-native');
      return;
    }

    root.classList.toggle('cursor-hover', Boolean(target?.closest(INTERACTIVE)));
    root.classList.toggle('cursor-native', Boolean(target?.closest(NATIVE)));
  };

  window.addEventListener(
    'pointermove',
    (event) => {
      if (event.pointerType !== 'mouse') return;
      pointerX = event.clientX;
      pointerY = event.clientY;
      dot.style.transform = `translate3d(${pointerX}px, ${pointerY}px, 0)`;
      // Positionner d'abord, se montrer ensuite : jamais de rendu en (0, 0).
      reveal();
      document.documentElement.classList.remove('cursor-away');

      applyState(event.target);
      start();
    },
    { passive: true }
  );

  /* pointerover en plus de pointermove : en entrant dans une iframe, le
     document parent cesse de recevoir des pointermove — le curseur se figerait
     sur place. pointerover, lui, se déclenche au franchissement de la
     frontière, ce qui suffit à passer la main au curseur natif. */
  document.addEventListener('pointerover', (event) => applyState(event.target), { passive: true });

  document.addEventListener('pointerdown', () => document.documentElement.classList.add('cursor-down'));
  document.addEventListener('pointerup', (event) => {
    document.documentElement.classList.remove('cursor-down');
    selecting = false;
    applyState(event.target);
  });

  document.addEventListener('selectstart', () => {
    selecting = true;
    applyState(null);
  });

  // Sortie de fenêtre : on efface, sinon le curseur reste collé sur un bord.
  document.addEventListener('mouseleave', () => document.documentElement.classList.add('cursor-away'));
  document.addEventListener('mouseenter', () => document.documentElement.classList.remove('cursor-away'));

  /* Si la souris disparaît en cours de route (passage sur un écran tactile,
     souris débranchée), on démonte tout et on rend le curseur natif. */
  finePointer.addEventListener('change', (event) => {
    if (event.matches) return;
    document.documentElement.classList.remove('has-cursor', 'cursor-hover', 'cursor-native', 'cursor-down');
    ready = false;
    ring.remove();
    dot.remove();
  });
};

/* ── Arrivée mot à mot des grands titres ─────────────────────────────────
   Chaque mot monte derrière son propre masque, en cascade. Réservé aux titres
   qui portent une phrase — h1 d'ouverture, titres de section — et pas aux
   intitulés de cartes ou au corps des articles, où l'effet deviendrait lassant.

   Le découpage est fait ici et non dans le HTML : le markup reste lisible, et
   surtout l'état initial du CSS ne cible que les éléments créés par ce script.
   Si celui-ci n'aboutit pas, rien n'est masqué et le texte reste lisible. Le
   textContent est préservé, donc le nom accessible du titre ne change pas.  */
const setupWordReveal = () => {
  const targets = Array.from(document.querySelectorAll('[data-reveal-words]'));
  if (!targets.length) return;

  // Animations limitées, ou pas d'observateur : on ne découpe rien.
  if (reduceMotion.matches || !('IntersectionObserver' in window)) return;

  const mask = (inner) => {
    const box = document.createElement('span');
    box.className = 'word';
    box.appendChild(inner);
    return box;
  };

  const splitTextNode = (node) => {
    /* Découpage sur l'espace simple uniquement. `\s` en JS couvre aussi
       l'espace insécable : s'en servir séparerait « 590 » de « € » et
       autoriserait une coupure de ligne au milieu du montant. */
    const collapsed = node.textContent.replace(/[ \t\r\n]+/g, ' ');
    /* Les espaces de début et de fin doivent survivre : c'est l'un d'eux qui
       sépare « en » du <span class="accent">48h.</span> dans le h1. Les
       supprimer collait le mot à l'élément voisin. En début ou en fin de ligne
       ils sont de toute façon fusionnés par le navigateur. */
    const leading = collapsed.startsWith(' ');
    const trailing = collapsed.length > 1 && collapsed.endsWith(' ');
    const text = collapsed.replace(/^ +| +$/g, '');
    const fragment = document.createDocumentFragment();
    if (!text) return fragment;
    if (leading) fragment.appendChild(document.createTextNode(' '));

    text.split(' ').forEach((part, index, parts) => {
      const inner = document.createElement('span');
      inner.className = 'word__inner';
      inner.textContent = part;
      fragment.appendChild(mask(inner));
      // L'espace reste un vrai nœud texte, hors du masque : sinon les mots se
      // colleraient et la ligne ne pourrait plus se couper.
      if (index < parts.length - 1) fragment.appendChild(document.createTextNode(' '));
    });

    if (trailing) fragment.appendChild(document.createTextNode(' '));
    return fragment;
  };

  targets.forEach((target) => {
    Array.from(target.childNodes).forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        if (!node.textContent.trim()) return;
        node.replaceWith(splitTextNode(node));
        return;
      }
      if (node.nodeType !== Node.ELEMENT_NODE) return;

      // Un <br> doit rester tel quel : enfermé dans un inline-block, il ne
      // provoquerait plus de retour à la ligne.
      if (node.tagName === 'BR') return;

      /* Un élément inline — l'accent coloré du h1, un <strong> — est animé
         d'un seul bloc plutôt que disloqué : ses attributs et son contenu
         restent intacts. Sans ça il apparaîtrait d'un coup, immobile, pendant
         que les mots voisins montent. */
      const inner = document.createElement('span');
      inner.className = 'word__inner';
      const box = mask(inner);
      node.replaceWith(box);
      inner.appendChild(node);
    });

    // Le script ne pose que le rang ; le rythme est décidé en CSS, et diffère
    // selon le contexte du titre.
    target.querySelectorAll('.word').forEach((word, index) => {
      word.style.setProperty('--i', String(index));
    });
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-words-visible');
        observer.unobserve(entry.target);
      });
    },
    // Seuil haut : la phrase doit être franchement à l'écran pour se lancer,
    // sinon elle se joue en bas de cadre et personne ne la voit. Un titre déjà
    // visible au chargement, comme le h1, part immédiatement.
    { threshold: 0.35 }
  );

  targets.forEach((target) => observer.observe(target));
};

/* ── Parallaxe lente des halos cyan (desktop uniquement) ─────────────────── */


/* ── Gabarits partagés ───────────────────────────────────────────────────
   La home a son markup en dur dans index.html ; les autres pages passent par
   ces gabarits, soit à la construction (verticales.js), soit en remplaçant
   l'ancien header/footer déjà présent dans le HTML (mountShell).          */

/* Les gabarits de l'en-tête et du pied de page vivent dans shell-markup.js :
   ce sont des fonctions pures, et le build a besoin de les appeler sous Node.
   On les réexporte ici pour que les modules existants n'aient rien à changer. */
export { renderShellHeader, renderShellFooter } from './shell-markup.js';
import { renderShellHeader, renderShellFooter } from './shell-markup.js';

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
  setupWordReveal();
  setupCursor();
};

export { reduceMotion, isDesktop };

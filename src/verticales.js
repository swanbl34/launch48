import './styles.css';
import './verticales.css';
import './shell.css';
import { initShell } from './shell.js';
import { initConsent } from './consent.js';

/* Bannière de consentement : aucune requête vers Google avant un accord. */
initConsent();

const app = document.querySelector('#app');
const pageType = document.body.dataset.page || 'home';
const offerSlug = document.body.dataset.offerSlug || '';

/* Ne sert plus qu'au repli de `vite dev` : en production, le plugin de
   pré-rendu écrit ces balises dans le fichier au moment du build. */
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

/* Les gabarits vivent dans verticales-render.js — un module pur, appelé aussi
   par vite-plugin-prerender.js pendant le build. Voir l'en-tête de ce fichier
   pour le pourquoi. */

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

const init = async () => {
  /* Le build a normalement déjà écrit le contenu dans #app. On ne rend ici que
     s'il est vide — cas de `vite dev`, où le plugin de pré-rendu ne tourne pas.
     Écraser un contenu pré-rendu serait au mieux inutile, au pire une seconde
     peinture visible. */
  const prerendered = app && app.children.length > 0;

  if (!prerendered) {
    /* La règle `.js [data-reveal]` du socle masque les blocs avant leur
       apparition. Sur une page pré-rendue, elle est déjà posée par le script
       en ligne injecté dans le `<head>` au build ; ici on ne couvre que le
       repli de `vite dev`, où rien n'a été pré-rendu. */
    document.documentElement.classList.add('js');

    /* Import dynamique volontaire : en production ce chemin n'est jamais pris,
       et un import statique ferait télécharger à chaque visiteur les ~55 kB de
       gabarits déjà présents dans le HTML servi. Rollup en fait un fragment
       séparé, qui n'est donc jamais demandé. */
    const { renderPage } = await import('./verticales-render.js');

    const { title, description, html } = renderPage(pageType, offerSlug);
    app.innerHTML = html;
    setMeta({ title, description });
  }

  // Header, menu mobile, pastille de nav et apparitions viennent du socle.
  // L'apparition au scroll passe par l'IntersectionObserver de shell.js :
  // GSAP + ScrollTrigger ne servaient qu'à ça, pour 130 kB, et faisaient même
  // doublon avec le socle sur les mêmes éléments.
  initShell();
  setupBackgroundProgress();

  /* Désarme le garde-fou du script en ligne : les apparitions sont prises en
     charge, la classe `js` peut rester. Sans ce marqueur, tout redeviendrait
     visible d'un coup au bout de 2,5 s. */
  document.documentElement.dataset.verticalReady = '1';
};

init();

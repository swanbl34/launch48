import './shell.css';
import './call.css';
import { initShell, mountShell } from './shell.js';

/* Page de réservation. Le socle fournit header, footer, menu mobile et les
   apparitions au scroll ; il ne reste ici que l'état de chargement du widget. */
mountShell();
initShell();

/* Le widget Google met un instant à répondre, et son fond est blanc : sans
   repère, on regarde un rectangle vide en se demandant si c'est cassé. On
   affiche donc un message tant que l'iframe n'a pas fini de charger.
   `load` se déclenche même pour une iframe d'une autre origine — on n'a pas
   besoin d'accéder à son contenu, seulement de savoir qu'elle est arrivée. */
const frame = document.querySelector('[data-booking-iframe]');
const loading = document.querySelector('[data-booking-loading]');

if (frame && loading) {
  const done = () => loading.remove();

  frame.addEventListener('load', done, { once: true });
  // Ce module étant différé, l'iframe peut avoir chargé avant nous. `load` de
  // la fenêtre attend les iframes : il rattrape ce cas.
  window.addEventListener('load', done, { once: true });

  /* Dernier filet : si au bout de 12 s rien n'a chargé (bloqueur de contenu,
     réseau coupé), on remplace l'attente par le lien direct plutôt que de
     laisser un « Chargement… » éternel. */
  window.setTimeout(() => {
    if (!loading.isConnected) return;
    loading.classList.add('is-stalled');
    loading.innerHTML =
      'Le calendrier met du temps à répondre. <a href="https://calendar.app.google/WzzdX11aNdR3DaMm8" target="_blank" rel="noopener">Ouvrir sur Google Calendar</a>';
  }, 12000);
}

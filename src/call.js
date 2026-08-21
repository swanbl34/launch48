import './shell.css';
import './call.css';
import { initShell, mountShell } from './shell.js';
import { initConsent } from './consent.js';

/* Bannière de consentement : aucune requête vers Google avant un accord. */
initConsent();

/* Page de réservation. Le socle fournit header, footer, menu mobile et les
   apparitions au scroll ; il ne reste ici que l'état de chargement du widget. */
mountShell();
initShell();

/* Chargement du calendrier au clic.

   L'iframe porte `data-src` et non `src` : tant que le visiteur n'a pas cliqué,
   aucune requête ne part chez Google, donc aucun cookie tiers n'est déposé et
   aucune IP n'est transmise. Le clic sur « Afficher les créneaux » est l'accord.

   Le widget met ensuite un instant à répondre, et son fond est blanc : sans
   repère on regarde un rectangle vide en se demandant si c'est cassé. D'où
   l'état de chargement intermédiaire. `load` se déclenche même pour une iframe
   d'une autre origine — on n'a pas besoin d'accéder à son contenu, seulement
   de savoir qu'elle est arrivée. */
const frame = document.querySelector('[data-booking-iframe]');
const loading = document.querySelector('[data-booking-loading]');
const gate = document.querySelector('[data-booking-consent]');
const loadButton = document.querySelector('[data-booking-load]');

if (frame && loading && gate && loadButton) {
  loadButton.addEventListener('click', () => {
    gate.remove();
    loading.hidden = false;
    frame.src = frame.dataset.src;

    const done = () => loading.remove();
    frame.addEventListener('load', done, { once: true });

    /* Filet : si au bout de 12 s rien n'a chargé (bloqueur de contenu, réseau
       coupé), on remplace l'attente par le lien direct plutôt que de laisser
       un « Chargement… » éternel. */
    window.setTimeout(() => {
      if (!loading.isConnected) return;
      loading.classList.add('is-stalled');
      loading.innerHTML =
        'Le calendrier met du temps à répondre. <a href="https://calendar.app.google/WzzdX11aNdR3DaMm8" target="_blank" rel="noopener">Ouvrir sur Google Calendar</a>';
    }, 12000);
  });
}

import './partenaires.css';
import './shell.css';
import { initShell, mountShell } from './shell.js';
import { initConsent } from './consent.js';

/* Bannière de consentement : aucune requête vers Google avant un accord. */
initConsent();

const STORAGE_KEY = 'launch48-partner-access';
const FORM_ENDPOINT = 'https://formspree.io/f/xbdpgvgj';

/* Porte d'entrée de la page partenaire. Le mot de passe partagé a été remplacé
   par une adresse email : ça donne accès et ça laisse une trace du contact, ce
   qu'un mot de passe ne faisait pas.

   Le mot de passe était de toute façon écrit en clair dans le bundle : la porte
   filtre l'accès, elle ne protège rien. C'est pourquoi la page reste en
   noindex — l'email est là pour qualifier, pas pour verrouiller.            */
const setupPartnerGate = () => {
  const gate = document.getElementById('partner-gate');
  const form = document.getElementById('partner-gate-form');
  const input = document.getElementById('partner-email');
  const status = document.getElementById('partner-gate-status');
  const gotcha = document.getElementById('partner-gotcha');

  if (!gate || !form || !input || !status) return;

  const unlock = () => {
    document.body.classList.remove('partners-page--locked');
    document.body.classList.add('partners-page--unlocked');
    // Le focus doit suivre : sinon, au clavier, on reste sur un formulaire qui
    // vient de disparaître de l'écran.
    const heading = document.querySelector('.partners-main h1');
    if (heading) {
      heading.setAttribute('tabindex', '-1');
      heading.focus();
    }
  };

  // Accès déjà donné pendant la session : on ne redemande pas.
  if (sessionStorage.getItem(STORAGE_KEY) === 'granted') {
    document.body.classList.remove('partners-page--locked');
    document.body.classList.add('partners-page--unlocked');
    return;
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    form.classList.add('was-submitted');

    if (!form.checkValidity()) {
      status.classList.add('is-error');
      status.textContent = 'Merci d\'indiquer une adresse email valide.';
      input.focus();
      return;
    }

    const submit = form.querySelector('button[type="submit"]');
    const initialLabel = submit.innerHTML;
    submit.disabled = true;
    submit.textContent = 'Ouverture…';
    status.classList.remove('is-error');
    status.textContent = '';

    /* Champ piège rempli → c'est un robot. On n'envoie rien et on ouvre quand
       même : la page n'a rien à cacher, et un faux positif ne doit pas bloquer
       un vrai visiteur (extension de remplissage automatique, par exemple). */
    const isBot = Boolean(gotcha?.value);

    if (!isBot) {
      const payload = new FormData();
      payload.append('email', input.value.trim());
      payload.append('_subject', 'Accès à la page partenaire');
      payload.append('origine', 'porte-partenaire');

      try {
        await fetch(FORM_ENDPOINT, {
          method: 'POST',
          body: payload,
          headers: { Accept: 'application/json' },
        });
      } catch {
        // L'envoi a échoué, mais l'adresse a été saisie : rien ne justifie de
        // refuser l'accès pour un problème de réseau de notre côté.
      }
    }

    sessionStorage.setItem(STORAGE_KEY, 'granted');
    submit.innerHTML = initialLabel;
    submit.disabled = false;
    unlock();
  });

  // Un message d'erreur qui reste affiché alors qu'on vient de corriger le
  // champ est plus déroutant qu'utile.
  input.addEventListener('input', () => {
    if (!status.classList.contains('is-error') || !form.checkValidity()) return;
    status.classList.remove('is-error');
    status.textContent = '';
  });
};

setupPartnerGate();

/* Header et footer de l'ancienne maquette remplacés par ceux du socle. */
mountShell();
initShell();

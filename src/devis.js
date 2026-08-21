import './shell.css';
import './devis.css';
import { initShell, mountShell } from './shell.js';
import { initConsent } from './consent.js';

/* Bannière de consentement : aucune requête vers Google avant un accord. */
initConsent();

mountShell();
initShell();

const form = document.querySelector('.quote-form');
const slot = document.querySelector('[data-step="2"]');

if (form && slot) {
  const status = form.querySelector('.form-status');
  const submit = form.querySelector('button[type="submit"]');
  const markers = document.querySelectorAll('[data-step-marker]');
  const frame = slot.querySelector('[data-slot-iframe]');
  const loading = slot.querySelector('[data-slot-loading]');

  /* La page Tarifs arrive avec ?forfait=one-page : on coche la pastille
     correspondante, le visiteur trouve sa première question déjà répondue.
     La valeur vient de l'URL, donc on vérifie qu'elle existe vraiment. */
  const forfait = new URLSearchParams(window.location.search).get('forfait');
  if (forfait) {
    const target = form.querySelector(`input[name="forfait"][value="${CSS.escape(forfait)}"]`);
    if (target) target.checked = true;
  }

  const setStep = (step) => {
    markers.forEach((marker) => {
      const index = Number(marker.dataset.stepMarker);
      marker.classList.toggle('is-current', index === step);
      marker.classList.toggle('is-done', index < step);
      if (index === step) marker.setAttribute('aria-current', 'step');
      else marker.removeAttribute('aria-current');
    });
  };

  /* Le widget Google n'est chargé qu'ici : inutile de faire télécharger son
     application à tous les visiteurs de la page, la plupart n'atteindront
     l'étape 2 qu'après avoir écrit. */
  const loadCalendar = () => {
    if (!frame || frame.src) return;
    frame.src = frame.dataset.src;

    if (!loading) return;
    const done = () => loading.remove();
    frame.addEventListener('load', done, { once: true });

    // Si le calendrier ne répond pas, on ne laisse pas un « Chargement… »
    // éternel : on renvoie vers la version plein écran.
    window.setTimeout(() => {
      if (!loading.isConnected) return;
      loading.classList.add('is-stalled');
      loading.innerHTML =
        'Le calendrier met du temps à répondre. <a href="https://calendar.app.google/WzzdX11aNdR3DaMm8" target="_blank" rel="noopener">Ouvrir sur Google Calendar</a>';
    }, 12000);
  };

  const goToSlot = () => {
    form.hidden = true;
    slot.hidden = false;
    setStep(2);
    loadCalendar();

    /* Le focus se déplace sur le titre de l'étape, pas sur la section : au
       clavier et au lecteur d'écran, on annonce « Choisissez votre créneau »,
       et l'anneau de focus reste de la taille d'un titre au lieu d'encadrer
       toute la carte. */
    const heading = slot.querySelector('#slot-title');
    const target = heading || slot;
    target.setAttribute('tabindex', '-1');
    target.focus();
    slot.scrollIntoView({ block: 'start', behavior: 'smooth' });
  };

  /* Le formulaire porte `novalidate` : on veut contrôler le message et poser le
     focus sur le premier champ fautif nous-mêmes, plutôt que de laisser les
     bulles natives décider. */
  const focusFirstInvalid = () => {
    const invalid = form.querySelector(':invalid');
    if (!invalid) return;
    invalid.focus();
    invalid.scrollIntoView({ block: 'center', behavior: 'smooth' });
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    // Le style d'erreur ne s'active qu'à partir de la première tentative :
    // marquer en rouge des champs jamais touchés est gratuit.
    form.classList.add('was-submitted');

    if (!form.checkValidity()) {
      status.classList.add('is-error');
      status.textContent = 'Il manque votre nom, votre email ou ce que vous voulez.';
      focusFirstInvalid();
      return;
    }

    const initialLabel = submit.innerHTML;
    submit.disabled = true;
    submit.textContent = 'Envoi…';
    status.classList.remove('is-error');
    status.textContent = '';

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });
      if (!response.ok) throw new Error('Envoi impossible');
      goToSlot();
    } catch {
      /* L'envoi a échoué, mais rien ne justifie de bloquer la prise de
         rendez-vous pour autant : on passe quand même à l'étape 2 en
         signalant qu'il faudra redire le projet de vive voix. Un visiteur
         prêt à réserver ne doit pas être renvoyé à un formulaire cassé. */
      const intro = slot.querySelector('[data-slot-intro]');
      if (intro) {
        intro.textContent =
          "L'envoi de vos réponses a échoué, mais vous pouvez réserver : on fera le point pendant l'appel.";
      }
      goToSlot();
    } finally {
      submit.innerHTML = initialLabel;
      submit.disabled = false;
    }
  });

  // Un message d'erreur qui reste affiché alors qu'on vient de corriger le
  // champ est plus déroutant qu'utile.
  form.addEventListener('input', () => {
    if (!status.classList.contains('is-error')) return;
    if (!form.checkValidity()) return;
    status.classList.remove('is-error');
    status.textContent = '';
  });
}

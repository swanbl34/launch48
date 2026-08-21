/* ═══════════════════════════════════════════════════════════════════════════
   Consentement à la mesure d'audience

   Règle de base : aucune requête vers Google avant un accord explicite. Le
   script gtag n'est donc pas dans le HTML — il est injecté ici, et seulement
   si le visiteur a accepté. Tant qu'il n'a rien choisi, ou s'il a refusé,
   rien n'est chargé, rien n'est déposé, aucune adresse IP ne part.

   C'est plus strict que le Consent Mode seul (qui charge gtag et envoie des
   pings « sans cookie » dès l'arrivée). On garde quand même les valeurs par
   défaut du Consent Mode v2 : elles sont lues par gtag au moment où il
   démarre, et elles nous protègent si un jour un autre tag Google est ajouté.

   Exigences CNIL respectées ici :
     — refuser coûte exactement le même geste qu'accepter (un clic, un bouton
       de même taille et de même hiérarchie) ;
     — le choix est conservé 6 mois, dans les deux sens : on ne redemande pas
       à chaque page à qui a refusé ;
     — le choix est révocable à tout moment via le lien du pied de page ;
     — la bannière ne bloque pas la lecture et n'a pas de croix ambiguë.
   ═══════════════════════════════════════════════════════════════════════════ */
import './consent.css';

const GA_ID = 'G-BE27RNS6K0';
const STORAGE_KEY = 'l48-consent';
const MAX_AGE_MS = 1000 * 60 * 60 * 24 * 182; // ≈ 6 mois

/* ── Mémoire du choix ─────────────────────────────────────────────────────── */

/**
 * Lit le choix conservé. Renvoie 'granted', 'denied', ou null si rien n'a
 * été choisi — ou si le choix a plus de 6 mois, auquel cas on redemande.
 */
const readChoice = () => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const saved = JSON.parse(raw);
    if (saved.choice !== 'granted' && saved.choice !== 'denied') return null;
    if (!Number.isFinite(saved.at) || Date.now() - saved.at > MAX_AGE_MS) return null;

    return saved.choice;
  } catch {
    // Navigation privée stricte, stockage plein, JSON abîmé : on considère
    // qu'aucun choix n'existe. Le défaut est le refus, donc c'est sans risque.
    return null;
  }
};

const writeChoice = (choice) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ choice, at: Date.now() }));
  } catch {
    // Si on ne peut pas mémoriser, la bannière réapparaîtra : gênant, pas grave.
  }
};

/* ── gtag ─────────────────────────────────────────────────────────────────── */

window.dataLayer = window.dataLayer || [];
function gtag() {
  // eslint-disable-next-line prefer-rest-params
  window.dataLayer.push(arguments);
}

/* Valeurs par défaut du Consent Mode v2, posées avant tout tag. Aucune
   publicité n'est faite sur ce site : ad_* reste refusé en permanence. */
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
  wait_for_update: 500,
});

let gaLoaded = false;

const loadAnalytics = () => {
  if (gaLoaded) return;
  gaLoaded = true;

  // Lève le drapeau posé par un éventuel refus antérieur dans la même page :
  // sans ça, refuser puis réaccepter laisserait gtag muet.
  window[`ga-disable-${GA_ID}`] = false;

  gtag('consent', 'update', { analytics_storage: 'granted' });

  // Le script n'est injecté qu'une fois par page. Après un refus puis un nouvel
  // accord, il est déjà là : le drapeau et l'update ci-dessus suffisent.
  if (!document.querySelector(`script[src*="googletagmanager.com/gtag/js?id=${GA_ID}"]`)) {
    const tag = document.createElement('script');
    tag.async = true;
    tag.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(tag);
  }

  gtag('js', new Date());
  gtag('config', GA_ID, { anonymize_ip: true });
};

/**
 * Efface un cookie, en tâtonnant sur le domaine.
 *
 * On ne peut pas lire le domaine d'un cookie en JavaScript : pour le supprimer,
 * il faut réécrire la même paire (domaine, chemin) avec une date passée. Google
 * Analytics pose les siens sur le domaine le plus haut qu'il peut — `.launch48.fr`
 * et non `www.launch48.fr` — donc on tente chaque suffixe du nom d'hôte, plus la
 * variante sans domaine explicite. Les tentatives qui ne correspondent à rien
 * sont sans effet.
 */
const dropCookie = (name) => {
  const parts = window.location.hostname.split('.');
  const domains = [undefined];

  for (let i = 0; i < parts.length - 1; i += 1) {
    domains.push(parts.slice(i).join('.'), `.${parts.slice(i).join('.')}`);
  }

  const expired = 'expires=Thu, 01 Jan 1970 00:00:00 GMT';
  for (const domain of domains) {
    document.cookie = `${name}=; ${expired}; path=/${domain ? `; domain=${domain}` : ''}`;
  }
};

/**
 * Retrait du consentement, effectif immédiatement.
 *
 * Ne plus charger gtag sur les pages suivantes ne suffit pas : les cookies déjà
 * déposés vivraient jusqu'à leur expiration (2 ans pour `_ga`), et sur la page
 * courante le script resterait actif en mémoire. Le RGPD demande un retrait
 * aussi effectif que l'accord, pas seulement l'arrêt des dépôts futurs. On fait
 * donc les trois choses : couper l'émission, prévenir gtag, effacer les cookies.
 */
const revokeAnalytics = () => {
  // Drapeau documenté par Google : gtag cesse immédiatement d'émettre, même
  // déjà chargé. Il doit rester posé pour le reste de la vie de la page.
  window[`ga-disable-${GA_ID}`] = true;

  gtag('consent', 'update', { analytics_storage: 'denied' });

  // `_ga` est l'identifiant client ; `_ga_<ID>` l'état de session de GA4.
  // `_gid` et `_gat` viennent d'Universal Analytics : ils peuvent traîner
  // d'une visite antérieure, autant les balayer aussi.
  const suffix = GA_ID.replace(/^G-/, '');
  for (const name of ['_ga', `_ga_${suffix}`, '_gid', '_gat', `_gat_gtag_${suffix}`]) {
    dropCookie(name);
  }

  // La page courante a peut-être déjà émis des événements. Le drapeau ci-dessus
  // arrête la suite ; on ne recharge pas la page pour autant, ce serait une
  // sanction disproportionnée pour un clic sur « Refuser ».
  gaLoaded = false;
};

/* ── Bannière ─────────────────────────────────────────────────────────────── */

let banner = null;

const closeBanner = () => {
  if (!banner) return;
  banner.remove();
  banner = null;
};

const buildBanner = () => {
  const el = document.createElement('section');
  el.className = 'consent';
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-modal', 'false'); // la page reste lisible et utilisable
  el.setAttribute('aria-labelledby', 'consent-title');
  el.innerHTML = `
    <div class="consent__inner">
      <div class="consent__text">
        <p class="consent__title" id="consent-title">Mesure d'audience</p>
        <p class="consent__body">
          On aimerait savoir quelles pages vous servent, avec Google Analytics.
          Rien n'est déposé ni envoyé avant votre accord, et refuser n'enlève
          aucune fonctionnalité du site.
          <a href="/politique-confidentialite.html">En savoir plus</a>
        </p>
      </div>
      <div class="consent__actions">
        <button class="consent__btn" type="button" data-consent="denied">Refuser</button>
        <button class="consent__btn" type="button" data-consent="granted">Accepter</button>
      </div>
    </div>
  `;

  el.addEventListener('click', (event) => {
    const button = event.target.closest('[data-consent]');
    if (!button) return;

    const choice = button.dataset.consent;
    writeChoice(choice);
    closeBanner();

    if (choice === 'granted') loadAnalytics();
    else revokeAnalytics();
  });

  return el;
};

const openBanner = () => {
  if (banner) return;
  banner = buildBanner();
  document.body.appendChild(banner);

  // Au clavier, on amène le focus sur le premier bouton : la bannière apparaît
  // en fin de document, sans ça il faudrait traverser toute la page.
  banner.querySelector('[data-consent]')?.focus();
};

/* ── Point d'entrée ───────────────────────────────────────────────────────── */

export const initConsent = () => {
  const choice = readChoice();

  if (choice === 'granted') {
    loadAnalytics();
  } else {
    /* Refus explicite OU consentement absent/périmé : dans les deux cas il n'y
       a pas d'accord valide, donc rien ne doit rester. On efface les cookies
       qu'un accord précédent aurait laissés — sinon un consentement expiré au
       bout de 6 mois continuerait de produire ses effets pendant les 18 mois de
       vie restants du cookie `_ga`. */
    revokeAnalytics();

    // Refus mémorisé : on ne redemande pas avant 6 mois.
    if (choice === null) openBanner();
  }

  /* Lien « Cookies » du pied de page : rouvre la bannière pour changer d'avis.
     Écouteur délégué sur le document, parce que le pied de page est injecté
     par shell.js après le chargement de ce module. */
  document.addEventListener('click', (event) => {
    if (!event.target.closest('[data-consent-open]')) return;
    event.preventDefault();
    openBanner();
  });
};

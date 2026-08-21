/* Entrée minimale pour les pages qui n'ont pas de module à elles — le quiz est
   autonome, avec ses propres styles en ligne. Elle ne charge que la bannière de
   consentement : sans ça, cette page serait la seule sans moyen de choisir. */
import { initConsent } from './consent.js';

initConsent();

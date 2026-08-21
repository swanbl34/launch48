import './legal.css';
import './shell.css';
import { initShell, mountShell } from './shell.js';
import { initConsent } from './consent.js';

/* Bannière de consentement : aucune requête vers Google avant un accord. */
initConsent();

/* Header et footer de l'ancienne maquette remplacés par ceux du socle. */
mountShell();
initShell();

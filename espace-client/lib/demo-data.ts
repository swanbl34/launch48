/**
 * Jeu de données de démonstration — activé par DEMO_MODE=1.
 *
 * Sert à faire tourner l'interface sans Supabase : démo client, revue de
 * design, capture d'écran. Aucune écriture n'est possible dans ce mode.
 * Ne JAMAIS activer DEMO_MODE en production.
 */
import { rowsFromTemplates } from './task-templates';
import { TASK_PACKS } from './task-packs';
import type { Asset, FormAnswers, Project, Task } from './types';

export const DEMO_PROJECT: Project = {
  id: '11111111-1111-4111-8111-111111111111',
  token: '22222222-2222-4222-8222-222222222222',
  company: 'JOLIBOO',
  contact_name: 'Aurélie',
  email: 'aurelie@example.com',
  phone: '06 12 34 56 78',
  pack: 'standard',
  price: 3400,
  status: 'production',
  kickoff_date: '2026-08-14',
  delivery_date: '2026-11-28',
  created_at: '2026-08-12T09:00:00Z',
  drive_url: 'https://drive.google.com/drive/folders/1AwWfK-iN6ZDL9GgB-ffQzXsLQz3nT6GN?usp=sharing',
};

export const DEMO_ANSWERS: FormAnswers = {
  project_id: DEMO_PROJECT.id,
  data: {
    raison_sociale: 'ATELIER VERMEIL SAS',
    forme_juridique: 'SAS',
    siret: '',
    rcs: '',
    adresse_siege: '12 rue des Orfèvres\n75003 Paris',
    email_public: 'bonjour@ateliervermeil.fr',
    telephone_public: '01 42 71 00 00',
    tva_assujetti: true,
    interlocuteur_nom: 'Camille Rousseau',
    interlocuteur_tel: '06 12 34 56 78',

    couleurs_hex: '#1c1a17, #c8a96a',
    polices: '',
    carte_blanche: false,
    sites_aimes: ['https://aesop.com', 'https://officine-universelle.fr'],
    site_deteste: [],
    concurrents: ['https://monsieurparis.com'],
    ambiance: ['épuré', 'luxe'],
    theme: 'sombre',

    accroche: 'Des bijoux en laiton recyclé, façonnés à Paris.',
    a_propos: '',
    avis_clients: '',
    reseaux_sociaux: ['https://instagram.com/ateliervermeil'],
    newsletter: true,

    nb_produits: '18',
    collections: 'Bagues\nColliers\nBoucles d’oreilles',
    variantes: ['taille', 'matière'],
    fourchette_prix: '',
    suivi_stock: true,
    produits_sur_devis: false,
    photos_produits_source: 'à shooter',
    nb_photos_par_produit: '3',

    zones_livraison: ['France', 'UE'],
    transporteurs: ['Colissimo', 'Mondial Relay'],
    frais_port: "offerts au-delà d'un montant",
    moyens_paiement: ['CB / Shopify Payments', 'Apple Pay'],
    politique_retours: '14 jours, retour à la charge du client.',
    emails_shopify_perso: true,

    domaine: 'ateliervermeil.fr',
    acces_registrar: true,
    acces_shopify: false,
    ga4: true,
    meta_pixel: false,
    site_actuel_redirection: '',
    email_pro_contact: 'bonjour@ateliervermeil.fr',
    google_business: '',
    maintenance: true,
    deadline: 'Marché de créateurs le 15 septembre',

    // Champs que le client a marqués « je ne sais pas encore ».
    __unknown: ['siret', 'fourchette_prix'],
  },
  last_step: 4,
  submitted_at: null,
  updated_at: '2026-08-17T16:20:00Z',
};

export const DEMO_ASSETS: Asset[] = [
  { id: 'a1', project_id: DEMO_PROJECT.id, field_key: 'logo', file_name: 'vermeil-logo.svg', storage_path: 'demo/1', size: 24_500, created_at: '2026-08-15T10:00:00Z' },
  { id: 'a2', project_id: DEMO_PROJECT.id, field_key: 'photos_ambiance', file_name: 'atelier-01.jpg', storage_path: 'demo/2', size: 2_400_000, created_at: '2026-08-15T10:01:00Z' },
  { id: 'a3', project_id: DEMO_PROJECT.id, field_key: 'photos_ambiance', file_name: 'atelier-02.jpg', storage_path: 'demo/3', size: 1_800_000, created_at: '2026-08-15T10:02:00Z' },
];

/**
 * Les tâches de démo sont générées depuis le lot réel.
 *
 * Écrire un jeu de démo à la main, c'est garantir qu'il divergera du vrai : on
 * finit par valider une maquette qui ne ressemble plus à ce que le client voit.
 * Ici, la démo EST le lot — enrichir lib/task-packs.ts met l'aperçu à jour tout
 * seul, et ce qu'on regarde est exactement ce qui sera importé.
 *
 * Seules quelques tâches sont forcées dans un autre état, pour que l'interface
 * montre ses cinq statuts plutôt que deux.
 */
const DEMO_STATES: Record<string, { status: Task['status']; client_note?: string }> = {
  'Créer les 5 catégories de la boutique': { status: 'doing' },
  'Le logo en fichier vectoriel': {
    status: 'review',
    client_note: "J'ai déposé le .ai et une version .svg exportée par le graphiste.",
  },
  "Valider l'échelle d'état de la seconde main": { status: 'done' },
};

export const DEMO_TASKS: Task[] = rowsFromTemplates(
  TASK_PACKS[0].tasks,
  DEMO_PROJECT.id,
).map((row, i): Task => {
  const override = DEMO_STATES[row.label];
  const status = override?.status ?? row.status;

  return {
    id: `demo-${i}`,
    project_id: DEMO_PROJECT.id,
    phase: row.phase,
    label: row.label,
    status,
    order_index: row.order_index,
    owner: row.owner,
    done_at: status === 'done' ? '2026-08-26T12:00:00Z' : null,
    description: row.description,
    deliverable: row.deliverable,
    drive_url: null,
    // Une seule échéance datée : de quoi montrer le libellé sans transformer
    // le tableau de bord en calendrier.
    due_date: row.label === 'Photographier chaque pièce, plusieurs angles' ? '2026-09-15' : null,
    milestone: row.milestone,
    client_note: override?.client_note ?? null,
    submitted_at: status === 'review' ? '2026-08-28T09:30:00Z' : null,
    created_at: '2026-08-20T08:00:00Z',
  };
});

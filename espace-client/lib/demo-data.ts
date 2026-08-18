/**
 * Jeu de données de démonstration — activé par DEMO_MODE=1.
 *
 * Sert à faire tourner l'interface sans Supabase : démo client, revue de
 * design, capture d'écran. Aucune écriture n'est possible dans ce mode.
 * Ne JAMAIS activer DEMO_MODE en production.
 */
import type { Asset, FormAnswers, Project, Task } from './types';

export const DEMO_PROJECT: Project = {
  id: '11111111-1111-4111-8111-111111111111',
  token: '22222222-2222-4222-8222-222222222222',
  company: 'Atelier Vermeil',
  contact_name: 'Camille Rousseau',
  email: 'camille@ateliervermeil.fr',
  phone: '06 12 34 56 78',
  pack: 'standard',
  price: 3400,
  status: 'production',
  kickoff_date: '2026-08-14',
  delivery_date: '2026-08-29',
  created_at: '2026-08-12T09:00:00Z',
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

const t = (
  phase: string,
  label: string,
  status: Task['status'],
  owner: Task['owner'],
  order_index: number,
): Task => ({
  id: `${phase}-${order_index}`,
  project_id: DEMO_PROJECT.id,
  phase,
  label,
  status,
  order_index,
  owner,
  done_at: status === 'done' ? '2026-08-16T12:00:00Z' : null,
});

export const DEMO_TASKS: Task[] = [
  t('cadrage', 'Brief validé', 'done', 'client', 10),
  t('cadrage', 'Accès Shopify', 'blocked', 'client', 20),
  t('cadrage', 'Accès domaine', 'done', 'client', 30),
  t('cadrage', 'Specs validées', 'done', 'launch48', 40),
  t('design', 'Direction graphique', 'done', 'launch48', 50),
  t('design', 'Maquette home', 'doing', 'launch48', 60),
  t('design', 'Maquette page produit', 'todo', 'launch48', 70),
  t('design', 'Validation client', 'todo', 'client', 80),
  t('integration', 'Setup Next.js', 'todo', 'launch48', 90),
  t('integration', 'Home', 'todo', 'launch48', 100),
  t('integration', 'Pages vitrine', 'todo', 'launch48', 110),
  t('integration', 'Pages légales', 'todo', 'launch48', 120),
  t('integration', 'Responsive', 'todo', 'launch48', 130),
  t('boutique', 'Storefront API', 'todo', 'launch48', 140),
  t('boutique', 'Grille produits', 'todo', 'launch48', 150),
  t('boutique', 'Page produit + variantes', 'todo', 'launch48', 160),
  t('boutique', 'Panier', 'todo', 'launch48', 170),
  t('boutique', 'Redirect checkout', 'todo', 'launch48', 180),
  t('recette', 'Tests mobile', 'todo', 'launch48', 190),
  t('recette', "Tests parcours d'achat", 'todo', 'launch48', 200),
  t('recette', 'SEO technique', 'todo', 'launch48', 210),
  t('recette', 'Performance', 'todo', 'launch48', 220),
  t('recette', 'Retours client', 'todo', 'client', 230),
  t('mise_en_ligne', 'Domaine', 'todo', 'launch48', 240),
  t('mise_en_ligne', 'DNS', 'todo', 'launch48', 250),
  t('mise_en_ligne', 'Analytics', 'todo', 'launch48', 260),
  t('mise_en_ligne', 'Commande test', 'todo', 'launch48', 270),
  t('mise_en_ligne', 'Livraison', 'todo', 'launch48', 280),
];

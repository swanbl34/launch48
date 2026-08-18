/**
 * ═══════════════════════════════════════════════════════════════════════════
 * BRIEF SCHEMA — source de vérité unique du questionnaire client.
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Ce fichier pilote TOUT :
 *   · le rendu du formulaire            (app/espace/[token]/brief)
 *   · la validation / normalisation     (lib/brief-values.ts)
 *   · le calcul des éléments manquants  (lib/missing.ts)
 *   · l'affichage des réponses en admin (app/admin/projet/[id])
 *
 * Pour ajouter une question : ajoute un objet dans STEPS. Rien d'autre à
 * toucher — le formulaire, le compteur de manquants et la fiche admin
 * s'adaptent automatiquement.
 *
 * ⚠️ Ne renomme jamais une `key` déjà utilisée en production : c'est la clé
 * de stockage dans form_answers.data (jsonb) et dans assets.field_key.
 */

export type FieldType =
  | 'text'
  | 'textarea'
  | 'email'
  | 'tel'
  | 'select'
  | 'multiselect'
  | 'url_list'
  | 'file'
  | 'files'
  | 'bool';

export type BriefField = {
  /** Clé de stockage. Immuable une fois en prod. */
  key: string;
  label: string;
  /** Texte d'aide affiché sous le label. */
  help?: string;
  type: FieldType;
  /** Uniquement pour `select` et `multiselect`. */
  options?: string[];
  /** `true` = champ bloquant : remonte dans « Éléments manquants ». */
  required: boolean;
  /** Numéro d'étape (1-6). */
  step: number;
  /**
   * Cas particulier des booléens de type « accès transmis ? ».
   * Par défaut un `bool` requis est considéré rempli dès qu'il est répondu
   * (true OU false) — « assujetti TVA : non » est une réponse valable.
   * Mais pour « accès registrar transmis : non », la réponse `false` EST
   * le blocage. Ce flag bascule ces champs dans ce second mode.
   */
  blockingWhenFalse?: boolean;
  /** Placeholder de l'input. */
  placeholder?: string;
};

export type BriefStep = {
  step: number;
  title: string;
  /** Sous-titre affiché en tête d'étape. */
  intro: string;
};

export const STEPS: BriefStep[] = [
  {
    step: 1,
    title: 'Entreprise & légal',
    intro: "Les informations qui apparaîtront sur tes mentions légales, CGV et factures.",
  },
  {
    step: 2,
    title: 'Identité graphique',
    intro: "De quoi cadrer la direction artistique. Si tu n'as rien, coche carte blanche.",
  },
  {
    step: 3,
    title: 'Contenus',
    intro: "Les mots et les images qui vont remplir le site.",
  },
  {
    step: 4,
    title: 'Boutique',
    intro: "Ce que tu vends, comment c'est organisé.",
  },
  {
    step: 5,
    title: 'Vente & logistique',
    intro: "Livraison, paiement, retours : le paramétrage de la boutique.",
  },
  {
    step: 6,
    title: 'Technique',
    intro: "Les accès dont on a besoin pour livrer. C'est ici que ça bloque le plus souvent.",
  },
];

export const FIELDS: BriefField[] = [
  // ── Étape 1 — Entreprise & légal ─────────────────────────────────────────
  {
    key: 'raison_sociale',
    label: 'Raison sociale',
    help: "Le nom exact déposé au greffe, pas le nom commercial.",
    type: 'text',
    required: true,
    step: 1,
    placeholder: 'MA MARQUE SAS',
  },
  {
    key: 'forme_juridique',
    label: 'Forme juridique',
    type: 'select',
    options: [
      'SAS',
      'SASU',
      'SARL',
      'EURL',
      'SA',
      'SCI',
      'Micro-entreprise',
      'Entreprise individuelle',
      'Association loi 1901',
      'Autre',
    ],
    required: true,
    step: 1,
  },
  {
    key: 'siret',
    label: 'SIRET',
    help: '14 chiffres.',
    type: 'text',
    required: true,
    step: 1,
    placeholder: '000 000 000 00000',
  },
  {
    key: 'rcs',
    label: 'RCS',
    help: "Ville d'immatriculation + numéro. Laisse vide si non applicable.",
    type: 'text',
    required: false,
    step: 1,
    placeholder: 'RCS Paris 000 000 000',
  },
  {
    key: 'adresse_siege',
    label: 'Adresse du siège',
    type: 'textarea',
    required: true,
    step: 1,
  },
  {
    key: 'email_public',
    label: 'Email public',
    help: "Celui qui sera affiché sur le site et dans les mentions légales.",
    type: 'email',
    required: true,
    step: 1,
  },
  {
    key: 'telephone_public',
    label: 'Téléphone public',
    type: 'tel',
    required: false,
    step: 1,
  },
  {
    key: 'tva_assujetti',
    label: 'Assujetti à la TVA',
    help: "Détermine l'affichage des prix HT/TTC sur la boutique.",
    type: 'bool',
    required: true,
    step: 1,
  },
  {
    key: 'interlocuteur_nom',
    label: 'Interlocuteur unique — nom',
    help: "Une seule personne qui valide. C'est ce qui fait tenir les 48h.",
    type: 'text',
    required: true,
    step: 1,
  },
  {
    key: 'interlocuteur_tel',
    label: 'Interlocuteur unique — téléphone',
    help: "Joignable pendant la production.",
    type: 'tel',
    required: true,
    step: 1,
  },

  // ── Étape 2 — Identité graphique ─────────────────────────────────────────
  {
    key: 'logo',
    label: 'Logo',
    help: 'Format vectoriel de préférence (SVG, AI, EPS). Sinon PNG fond transparent.',
    type: 'file',
    required: true,
    step: 2,
  },
  {
    key: 'logo_variantes',
    label: 'Logo — versions claire et sombre',
    help: "Si tu les as. Sinon on les dérive du fichier principal.",
    type: 'files',
    required: false,
    step: 2,
  },
  {
    key: 'couleurs_hex',
    label: 'Couleurs de marque',
    help: 'Codes hexadécimaux séparés par des virgules.',
    type: 'text',
    required: false,
    step: 2,
    placeholder: '#091019, #46e4ff',
  },
  {
    key: 'polices',
    label: 'Polices',
    help: "Noms des typographies si tu en as déjà. Sinon on propose.",
    type: 'text',
    required: false,
    step: 2,
  },
  {
    key: 'carte_blanche',
    label: 'Carte blanche graphique',
    help: "Coche si tu nous laisses décider de la direction artistique.",
    type: 'bool',
    required: false,
    step: 2,
  },
  {
    key: 'sites_aimes',
    label: '3 sites que tu aimes',
    help: "Une URL par ligne. Dis-nous en un mot ce qui te plaît sur chacun.",
    type: 'url_list',
    required: true,
    step: 2,
  },
  {
    key: 'site_deteste',
    label: '1 site que tu détestes',
    help: 'Aussi utile que ceux que tu aimes.',
    type: 'url_list',
    required: false,
    step: 2,
  },
  {
    key: 'concurrents',
    label: '2 à 3 concurrents',
    type: 'url_list',
    required: false,
    step: 2,
  },
  {
    key: 'ambiance',
    label: 'Ambiance recherchée',
    type: 'multiselect',
    options: ['épuré', 'chaleureux', 'brut', 'luxe', 'coloré', 'minimal'],
    required: false,
    step: 2,
  },
  {
    key: 'theme',
    label: 'Thème',
    type: 'select',
    options: ['sombre', 'clair', 'à décider'],
    required: false,
    step: 2,
  },
  {
    key: 'visuels_existants',
    label: 'Visuels existants à respecter',
    help: "Charte graphique, print, packaging… tout ce qui contraint le design.",
    type: 'files',
    required: false,
    step: 2,
  },

  // ── Étape 3 — Contenus ───────────────────────────────────────────────────
  {
    key: 'accroche',
    label: "Phrase d'accroche",
    help: "Tu vends quoi, à qui, et pourquoi toi plutôt qu'un autre ? Trois lignes suffisent.",
    type: 'textarea',
    required: true,
    step: 3,
  },
  {
    key: 'a_propos',
    label: 'Texte À propos',
    help: "L'histoire de la marque. Brut, on réécrit.",
    type: 'textarea',
    required: false,
    step: 3,
  },
  {
    key: 'photos_ambiance',
    label: "Photos d'ambiance, atelier, équipe",
    help: 'Les fichiers les plus lourds que tu as. On compresse.',
    type: 'files',
    required: false,
    step: 3,
  },
  {
    key: 'avis_clients',
    label: 'Avis clients',
    help: 'Copie-colle 3 à 5 avis avec le prénom de leur auteur.',
    type: 'textarea',
    required: false,
    step: 3,
  },
  {
    key: 'reseaux_sociaux',
    label: 'Réseaux sociaux',
    help: 'Une URL par ligne.',
    type: 'url_list',
    required: false,
    step: 3,
  },
  {
    key: 'newsletter',
    label: 'Bloc newsletter sur le site',
    type: 'bool',
    required: false,
    step: 3,
  },

  // ── Étape 4 — Boutique ───────────────────────────────────────────────────
  {
    key: 'nb_produits',
    label: 'Nombre de produits au lancement',
    type: 'text',
    required: true,
    step: 4,
    placeholder: '12',
  },
  {
    key: 'collections',
    label: 'Collections souhaitées',
    help: "Comment tu veux ranger tes produits. Une collection par ligne.",
    type: 'textarea',
    required: true,
    step: 4,
  },
  {
    key: 'variantes',
    label: 'Variantes existantes',
    type: 'multiselect',
    options: ['taille', 'couleur', 'matière', 'dimensions', 'aucune'],
    required: false,
    step: 4,
  },
  {
    key: 'fourchette_prix',
    label: 'Fourchette de prix',
    type: 'text',
    required: true,
    step: 4,
    placeholder: 'de 25 € à 180 €',
  },
  {
    key: 'suivi_stock',
    label: 'Suivi de stock',
    help: 'Shopify décrémente les quantités et masque les produits épuisés.',
    type: 'bool',
    required: false,
    step: 4,
  },
  {
    key: 'produits_sur_devis',
    label: 'Produits sur devis hors catalogue',
    type: 'bool',
    required: false,
    step: 4,
  },
  {
    key: 'photos_produits_source',
    label: 'Photos produits : qui les fournit',
    help: "Le poste qui fait le plus souvent glisser une livraison.",
    type: 'select',
    options: ['client', 'à shooter', 'à discuter'],
    required: true,
    step: 4,
  },
  {
    key: 'nb_photos_par_produit',
    label: 'Nombre de photos par produit',
    type: 'text',
    required: false,
    step: 4,
    placeholder: '3',
  },

  // ── Étape 5 — Vente & logistique ─────────────────────────────────────────
  {
    key: 'zones_livraison',
    label: 'Zones de livraison',
    type: 'multiselect',
    options: ['France', 'UE', 'Monde'],
    required: false,
    step: 5,
  },
  {
    key: 'transporteurs',
    label: 'Transporteurs',
    type: 'multiselect',
    options: ['Colissimo', 'Mondial Relay', 'retrait sur place', 'autre'],
    required: false,
    step: 5,
  },
  {
    key: 'frais_port',
    label: 'Frais de port',
    type: 'select',
    options: ['fixes', 'par poids', "offerts au-delà d'un montant"],
    required: false,
    step: 5,
  },
  {
    key: 'moyens_paiement',
    label: 'Moyens de paiement',
    type: 'multiselect',
    options: ['CB / Shopify Payments', 'Apple Pay', 'PayPal', 'virement'],
    required: false,
    step: 5,
  },
  {
    key: 'politique_retours',
    label: 'Politique de retours',
    help: 'Délai, conditions, qui paie le retour.',
    type: 'textarea',
    required: false,
    step: 5,
  },
  {
    key: 'emails_shopify_perso',
    label: 'Personnalisation des emails Shopify',
    help: 'Confirmation de commande, expédition… aux couleurs de la marque.',
    type: 'bool',
    required: false,
    step: 5,
  },

  // ── Étape 6 — Technique ──────────────────────────────────────────────────
  {
    key: 'domaine',
    label: 'Nom de domaine',
    type: 'text',
    required: true,
    step: 6,
    placeholder: 'mamarque.fr',
  },
  {
    key: 'acces_registrar',
    label: 'Accès registrar transmis',
    help: "OVH, Gandi, Namecheap… pour pointer les DNS le jour de la mise en ligne.",
    type: 'bool',
    required: true,
    blockingWhenFalse: true,
    step: 6,
  },
  {
    key: 'acces_shopify',
    label: 'Accès collaborateur Shopify transmis',
    type: 'bool',
    required: true,
    blockingWhenFalse: true,
    step: 6,
  },
  {
    key: 'token_storefront',
    label: 'Token Storefront API transmis',
    help: "Shopify → Paramètres → Applications → Développer des applications.",
    type: 'bool',
    required: true,
    blockingWhenFalse: true,
    step: 6,
  },
  {
    key: 'ga4',
    label: 'Google Analytics 4',
    type: 'bool',
    required: false,
    step: 6,
  },
  {
    key: 'meta_pixel',
    label: 'Meta Pixel',
    type: 'bool',
    required: false,
    step: 6,
  },
  {
    key: 'site_actuel_redirection',
    label: 'Site actuel à rediriger',
    help: "L'URL de ton site existant, si tu en as un. On garde le SEO.",
    type: 'text',
    required: false,
    step: 6,
  },
  {
    key: 'email_pro_contact',
    label: 'Email pro pour le formulaire de contact',
    help: "Là où arrivent les messages envoyés depuis le site.",
    type: 'email',
    required: true,
    step: 6,
  },
  {
    key: 'google_business',
    label: 'Google Business Profile',
    help: 'URL de la fiche, si elle existe.',
    type: 'text',
    required: false,
    step: 6,
  },
  {
    key: 'maintenance',
    label: 'Maintenance 49 €/mois',
    help: 'Mises à jour, sauvegardes, corrections. Sans engagement.',
    type: 'bool',
    required: false,
    step: 6,
  },
  {
    key: 'deadline',
    label: 'Deadline réelle',
    help: "Une date, un salon, un lancement… ce qui contraint vraiment.",
    type: 'text',
    required: false,
    step: 6,
  },
];

/** Types de champs stockés dans Supabase Storage plutôt que dans le jsonb. */
export const FILE_TYPES: FieldType[] = ['file', 'files'];

export const isFileField = (f: BriefField) => FILE_TYPES.includes(f.type);

export const TOTAL_STEPS = STEPS.length;

export const fieldsForStep = (step: number) => FIELDS.filter((f) => f.step === step);

export const fieldByKey = (key: string) => FIELDS.find((f) => f.key === key);

/** Nombre total de champs bloquants — sert de dénominateur d'affichage. */
export const REQUIRED_COUNT = FIELDS.filter((f) => f.required).length;

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * LOTS DE TÂCHES — des listes prêtes à pousser dans un projet existant.
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Différence avec lib/task-templates.ts : un *pack* (light / standard /
 * pousse) est le squelette de production, créé une fois à l'ouverture du
 * projet. Un *lot* est un paquet de demandes qu'on envoie au client en cours
 * de route — le contenu, le stock, le légal — et qu'on importe quand il
 * devient pertinent, depuis l'onglet Tâches de la fiche admin.
 *
 * L'import est idempotent par intitulé : réimporter un lot n'ajoute que les
 * tâches absentes du projet. On peut donc enrichir un lot ici et le
 * réimporter sans créer de doublons.
 */
import type { TaskTemplate } from './task-templates';

export type TaskPack = {
  key: string;
  label: string;
  /** Ce que le lot contient, affiché avant l'import. */
  summary: string;
  tasks: TaskTemplate[];
};

/* ═══════════════════════════════════════════════════════════════════════════
   BOUTIQUE SECONDE MAIN — le lot de la boutique de puériculture.
   Repris du point d'étape du 30 août 2026 : ce que la cliente doit fournir,
   et ce qui est déjà livré de notre côté.
   ═══════════════════════════════════════════════════════════════════════════ */

/** Ce qui est déjà debout. Alimente les tâches achevées du dashboard. */
const BOUTIQUE_ACQUIS: TaskTemplate[] = [
  {
    phase: 'cadrage',
    label: 'Les 9 étapes de développement',
    owner: 'launch48',
    status: 'done',
    description:
      "9 sur 9 livrées. On peut parcourir le catalogue, ouvrir une fiche, remplir un panier, choisir son secteur de retrait et aller jusqu'au paiement. Ce qui reste n'est presque plus du développement.",
  },
  {
    phase: 'boutique',
    label: 'Catalogue filtrable',
    owner: 'launch48',
    status: 'done',
    description:
      'Filtres état, taille, univers, sous-catégorie, prix, disponibilité. Tri par nouveautés ou par prix. Articles vendus masqués par défaut.',
  },
  {
    phase: 'boutique',
    label: 'Fiches produit',
    owner: 'launch48',
    status: 'done',
    description:
      "Galerie multi-vues, choix de taille ou de coloris, quantité, échelle d'état pour la seconde main, partage, suggestions d'articles similaires.",
  },
  {
    phase: 'boutique',
    label: 'Panier et retrait par secteur',
    owner: 'launch48',
    status: 'done',
    description:
      "Panier en tiroir, choix du secteur et du jour de retrait avant le paiement. L'information remonte sur chaque commande dans l'admin Shopify.",
  },
  {
    phase: 'boutique',
    label: 'Recherche avec suggestions',
    owner: 'launch48',
    status: 'done',
    description:
      'Suggestions avec photos dès les premières lettres, page de résultats filtrable.',
  },
  {
    phase: 'boutique',
    label: 'Espace client Shopify',
    owner: 'launch48',
    status: 'done',
    description:
      "Connexion par code e-mail, historique des commandes et adresses. Aucun mot de passe à gérer de notre côté.",
  },
  {
    phase: 'boutique',
    label: 'Pilotage du site depuis Shopify',
    owner: 'launch48',
    status: 'done',
    description:
      "Le principe qui fait tenir l'ensemble : vous pilotez le site depuis Shopify, sans passer par moi. Vous posez des étiquettes sur un produit, il apparaît au bon endroit. Vous glissez des articles dans la collection « Page d'accueil », ils s'affichent en vitrine dans l'ordre choisi. Vous créez une catégorie, sa page existe.",
  },
  {
    phase: 'boutique',
    label: 'Connexion à la boutique Shopify',
    owner: 'launch48',
    status: 'done',
    description: 'Devise en euros, pays Martinique. Suivi des stocks activé — indispensable pour les pièces uniques.',
  },
  {
    phase: 'integration',
    label: 'Accueil, seconde main, retrait & livraison, revendre',
    owner: 'launch48',
    status: 'done',
    description:
      "Mises en page complètes. Les textes provisoires sont signalés comme tels à l'écran, pour qu'aucun ne parte en ligne par inadvertance.",
  },
  {
    phase: 'integration',
    label: 'Contact, questions fréquentes, notre histoire',
    owner: 'launch48',
    status: 'done',
    description:
      "Les formulaires ouvrent un e-mail prérempli : aucun abonnement mensuel, aucun outil supplémentaire à payer.",
  },
  {
    phase: 'integration',
    label: 'Mise en page des 4 pages légales',
    owner: 'launch48',
    status: 'done',
    description:
      "Mentions légales, conditions de vente, confidentialité, retours : les quatre pages existent avec leur mise en page. Elles attendent leur contenu.",
  },
  {
    phase: 'recette',
    label: 'Référencement technique',
    owner: 'launch48',
    status: 'done',
    description:
      "Plan du site automatique, descriptions par page, fiches produit balisées pour Google. Les articles vendus sortent du plan du site sans perdre leur adresse.",
  },
];

/** Ce que la cliente doit fournir ou trancher. */
const BOUTIQUE_CLIENTE: TaskTemplate[] = [
  /* ── Cadrage : le déblocage numéro un ─────────────────────────────────── */
  {
    phase: 'cadrage',
    label: "Valider la double authentification Shopify",
    owner: 'client',
    milestone: 'ouverture',
    description:
      "C'est le premier domino. Ce jeton débloque d'un coup la création automatique des 5 catégories et l'import des articles en masse — les outils sont écrits et prêts, ils n'attendent que lui. Tant qu'il manque, rien ne peut avancer côté boutique.",
  },

  /* ── Identité de marque ───────────────────────────────────────────────── */
  {
    phase: 'identite',
    label: 'Trancher définitivement le nom de la marque',
    owner: 'client',
    milestone: 'livraison',
    description:
      "Le site est construit pour que ce changement ne coûte rien : le nom est à un seul endroit. Mais il faut le décider avant d'acheter le domaine, de créer les e-mails et les réseaux sociaux.",
  },
  {
    phase: 'identite',
    label: 'Le logo en fichier vectoriel',
    owner: 'client',
    milestone: 'livraison',
    description: "Aujourd'hui le nom s'affiche en texte dans l'en-tête.",
    deliverable: 'Le logo en .svg, .ai ou .eps — pas un JPEG ni une capture d’écran.',
  },
  {
    phase: 'identite',
    label: 'Les 9 expressions de Boo, détourées',
    owner: 'client',
    milestone: 'livraison',
    description:
      "Une version simplifiée que j'ai dessinée les remplace pour l'instant, sur le panier vide, les recherches sans résultat et la page 404.",
    deliverable: 'Les 9 expressions détourées, fond transparent (PNG ou SVG), une par fichier.',
  },
  {
    phase: 'identite',
    label: 'La licence de la police Agrandir',
    owner: 'client',
    milestone: 'livraison',
    description:
      "Elle est payante. Le site utilise deux polices libres très proches en attendant — c'est propre, mais ce n'est pas la charte exacte.",
    deliverable: "Les fichiers de police (woff2 de préférence) et la licence d'utilisation web.",
  },

  /* ── Contenus & textes ────────────────────────────────────────────────── */
  {
    phase: 'contenu',
    label: 'Votre histoire',
    owner: 'client',
    milestone: 'livraison',
    description:
      "Face à une marque que personne ne connaît encore, l'histoire d'une mère qui a créé ça pour sa fille est un argument que la concurrence n'a pas. Je n'ai pas voulu l'inventer : la page attend votre récit.",
    deliverable: "Le texte de la page « Notre histoire », même brut, même dicté au téléphone.",
  },
  {
    phase: 'contenu',
    label: "Valider l'échelle d'état de la seconde main",
    owner: 'client',
    milestone: 'ouverture',
    description:
      "Trois niveaux : neuf avec étiquette / excellent état / très bon état. J'ai écrit une définition et un exemple pour chacun — ils s'affichent sur toutes les fiches et font foi en cas de litige. À relire mot à mot.",
  },
  {
    phase: 'contenu',
    label: 'Valider les catégories et sous-catégories',
    owner: 'client',
    milestone: 'livraison',
    description:
      "J'ai proposé 12 sous-catégories réparties dans vos 3 univers (bodies & pyjamas, vaisselle & repas, bouées…). À corriger librement, c'est une ligne à changer.",
  },
  {
    phase: 'contenu',
    label: "La phrase d'accroche de l'accueil et la baseline",
    owner: 'client',
    milestone: 'livraison',
    description:
      "Les deux premières phrases que lit un visiteur. Ce sont les vôtres à écrire, pas les miennes.",
  },
  {
    phase: 'contenu',
    label: 'Relire les questions fréquentes',
    owner: 'client',
    milestone: 'livraison',
    description:
      "Six réponses écrites à partir des objections identifiées : hygiène, retrait, paiement, pièce unique, retours, rachat.",
  },

  /* ── Photographies ────────────────────────────────────────────────────── */
  {
    phase: 'photos',
    label: "La photo d'ouverture de l'accueil",
    owner: 'client',
    milestone: 'livraison',
    status: 'done',
    description:
      "Fournie. Deux réserves : elle ne montre ni la Martinique ni un produit de la marque, et il faudra confirmer qu'on a le droit de l'utiliser commercialement.",
  },
  {
    phase: 'photos',
    label: 'Vous, ou les coulisses',
    owner: 'client',
    milestone: 'livraison',
    description:
      "Chaque emplacement vide s'affiche sur le site sous forme de cadre rayé décrivant la photo attendue — c'est, tel quel, le brief à donner au photographe.",
    deliverable: 'La photo en pleine résolution, non recadrée.',
  },
  {
    phase: 'photos',
    label: 'Une ambiance famille en extérieur',
    owner: 'client',
    milestone: 'livraison',
    deliverable: 'La photo en pleine résolution, non recadrée.',
  },
  {
    phase: 'photos',
    label: 'Des pièces pliées, un détail de matière',
    owner: 'client',
    milestone: 'livraison',
    deliverable: 'La photo en pleine résolution, non recadrée.',
  },
  {
    phase: 'photos',
    label: 'Une remise de colis en point relais',
    owner: 'client',
    milestone: 'livraison',
    deliverable: 'La photo en pleine résolution, non recadrée.',
  },
  {
    phase: 'photos',
    label: 'Le tri et le lavage, en coulisses',
    owner: 'client',
    milestone: 'livraison',
    deliverable: 'La photo en pleine résolution, non recadrée.',
  },
  {
    phase: 'photos',
    label: "Un parent qui trie les vêtements de son enfant",
    owner: 'client',
    milestone: 'livraison',
    deliverable: 'La photo en pleine résolution, non recadrée.',
  },

  /* ── Textes légaux ────────────────────────────────────────────────────── */
  {
    phase: 'legal',
    label: 'Mentions légales, conditions de vente, confidentialité, retours',
    owner: 'client',
    milestone: 'ouverture',
    description:
      "Obligatoires pour vendre en ligne. Les quatre pages existent avec leur mise en page ; elles attendent leur contenu. À faire relire par un professionnel.",
    deliverable: 'Les quatre textes, en document modifiable (Word, Google Docs ou texte brut).',
  },
  {
    phase: 'legal',
    label: "Raison sociale, numéro SIRET, adresse de l'entreprise",
    owner: 'client',
    milestone: 'ouverture',
    description:
      "Ces trois informations doivent figurer sur les mentions légales et sur les factures.",
    deliverable: "L'extrait Kbis ou l'avis de situation SIRENE.",
  },
  {
    phase: 'legal',
    label: "L'adresse e-mail de contact publique",
    owner: 'client',
    milestone: 'ouverture',
    description:
      "Tant qu'elle manque, les formulaires de contact et de rachat restent inactifs — un visiteur qui veut vous écrire n'a nulle part où le faire.",
  },

  /* ── Stock & fiches produits ──────────────────────────────────────────── */
  {
    phase: 'stock',
    label: 'Rassembler 80 à 100 pièces minimum',
    owner: 'client',
    milestone: 'ouverture',
    description:
      "C'est le plus long, c'est à commencer maintenant. En dessous de 80 pièces, la boutique a l'air abandonnée et les visiteurs ne reviennent pas. C'est ce qui déterminera la date d'ouverture, bien plus que le développement. Il y a 3 produits de test aujourd'hui.",
  },
  {
    phase: 'stock',
    label: 'Photographier chaque pièce, plusieurs angles',
    owner: 'client',
    milestone: 'ouverture',
    description:
      "Y compris le défaut quand il y en a un : le montrer fait vendre, le cacher génère des retours.",
    deliverable:
      'Un dossier par pièce, plusieurs angles, le défaut photographié de près quand il y en a un.',
  },
  {
    phase: 'stock',
    label: "Confirmer la date d'arrivée du stock neuf",
    owner: 'client',
    milestone: 'livraison',
    description: "Le site annonce « décembre » sur les univers éveil et aquatique.",
  },

  /* ── Logistique & tarifs ──────────────────────────────────────────────── */
  {
    phase: 'logistique',
    label: 'Les 3 points relais : adresses exactes et jours de passage',
    owner: 'client',
    milestone: 'ouverture',
    description:
      "Nord, centre, sud. Les jours affichés aujourd'hui (mercredi, mardi et vendredi, samedi) sont des exemples que j'ai inventés pour travailler : ils partiraient tels quels en ligne.",
    deliverable: 'Les 3 adresses complètes et les jours de passage de chacune, par écrit.',
  },
  {
    phase: 'logistique',
    label: 'Tarifs postaux et formats de boîtes',
    owner: 'client',
    milestone: 'ouverture',
    description: 'Nécessaires pour paramétrer les frais de livraison dans Shopify.',
    deliverable: 'La grille tarifaire postale et les dimensions des boîtes que vous utilisez.',
  },
  {
    phase: 'logistique',
    label: 'La grille de rachat : combien, et payé en quoi',
    owner: 'client',
    milestone: 'ouverture',
    description:
      "La page « Revendre » promet une réponse sous 48 h avec un montant. Ma recommandation : payer en avoir sur la boutique plutôt qu'en espèces, avec un taux plus intéressant — ça préserve la trésorerie et ramène la personne comme cliente.",
    deliverable: 'La grille de prix de rachat par catégorie, et le mode de paiement retenu.',
  },
  {
    phase: 'logistique',
    label: "Choisir l'outil d'e-mailing",
    owner: 'client',
    milestone: 'livraison',
    description:
      "Pour la newsletter et les alertes « prévenez-moi quand cette taille arrive ». Shopify en propose un, inclus dans votre abonnement. En phase de lancement, chaque adresse collectée est une vente potentielle à Noël.",
  },
];

export const TASK_PACKS: TaskPack[] = [
  {
    key: 'boutique-seconde-main',
    label: 'Boutique seconde main — ce que j’attends de la cliente',
    summary:
      "27 demandes à la cliente — dont 10 qui bloquent l'ouverture et 16 qui attendent des fichiers — plus 12 tâches déjà livrées de notre côté. Reprises du point d'étape du 30 août 2026.",
    tasks: [...BOUTIQUE_ACQUIS, ...BOUTIQUE_CLIENTE],
  },
];

export const findPack = (key: string): TaskPack | undefined =>
  TASK_PACKS.find((p) => p.key === key);

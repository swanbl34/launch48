/**
 * Lot « Boutique seconde main » — puériculture d'occasion, retrait en secteurs.
 *
 * Repris du point d'étape du 30 août 2026. Sert aussi d'exemple de référence :
 * il montre les trois façons d'écrire un lot — reprendre une brique commune
 * telle quelle, l'ajuster, ou écrire une tâche propre au client.
 */
import type { TaskTemplate } from '../task-templates';
import {
  CATALOGUE,
  IDENTITE,
  LOGISTIQUE,
  MISE_EN_LIGNE,
  RECETTE,
  SOCLE_LEGAL,
  TEXTES,
  ajuste,
  sans,
} from './commun';

/* ── Ce qui est déjà debout ───────────────────────────────────────────────── */

const ACQUIS: TaskTemplate[] = [
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
    description: 'Suggestions avec photos dès les premières lettres, page de résultats filtrable.',
  },
  {
    phase: 'boutique',
    label: 'Espace client Shopify',
    owner: 'launch48',
    status: 'done',
    description:
      'Connexion par code e-mail, historique des commandes et adresses. Aucun mot de passe à gérer de notre côté.',
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
    description:
      'Devise en euros, pays Martinique. Suivi des stocks activé — indispensable pour les pièces uniques.',
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
      'Les formulaires ouvrent un e-mail prérempli : aucun abonnement mensuel, aucun outil supplémentaire à payer.',
  },
  {
    phase: 'integration',
    label: 'Mise en page des 4 pages légales',
    owner: 'launch48',
    status: 'done',
    description:
      'Mentions légales, conditions de vente, confidentialité, retours : les quatre pages existent avec leur mise en page. Elles attendent leur contenu.',
  },
  {
    phase: 'recette',
    label: 'Référencement technique',
    owner: 'launch48',
    status: 'done',
    description:
      'Plan du site automatique, descriptions par page, fiches produit balisées pour Google. Les articles vendus sortent du plan du site sans perdre leur adresse.',
  },
];

/* ── Les demandes propres à ce client ─────────────────────────────────────── */

const SPECIFIQUE_CLIENT: TaskTemplate[] = [
  {
    phase: 'cadrage',
    label: 'Valider la double authentification Shopify',
    owner: 'client',
    milestone: 'ouverture',
    description:
      "C'est le premier domino. Ce jeton débloque d'un coup la création automatique des 5 catégories et l'import des articles en masse — les outils sont écrits et prêts, ils n'attendent que lui. Tant qu'il manque, rien ne peut avancer côté boutique.",
  },
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
    label: 'Les 9 expressions de Boo, détourées',
    owner: 'client',
    milestone: 'livraison',
    description:
      "Une version simplifiée que j'ai dessinée les remplace pour l'instant, sur le panier vide, les recherches sans résultat et la page 404.",
    deliverable: 'Les 9 expressions détourées, fond transparent (PNG ou SVG), une par fichier.',
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
    phase: 'stock',
    label: "Confirmer la date d'arrivée du stock neuf",
    owner: 'client',
    milestone: 'livraison',
    description: 'Le site annonce « décembre » sur les univers éveil et aquatique.',
  },
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
    label: 'La grille de rachat : combien, et payé en quoi',
    owner: 'client',
    milestone: 'ouverture',
    description:
      "La page « Revendre » promet une réponse sous 48 h avec un montant. Ma recommandation : payer en avoir sur la boutique plutôt qu'en espèces, avec un taux plus intéressant — ça préserve la trésorerie et ramène la personne comme cliente.",
    deliverable: 'La grille de prix de rachat par catégorie, et le mode de paiement retenu.',
  },
];

/**
 * Les six visuels d'ambiance, un par emplacement du site.
 *
 * Le lot commun n'en fait qu'une tâche ; ici ils sont détaillés parce que le
 * shooting est le point le plus fragile du projet — décidé en réunion, mais
 * personne n'en a la charge. Six lignes qu'on peut cocher une par une font un
 * bien meilleur levier qu'une seule qui reste rouge pendant deux mois.
 */
const PHOTOS: TaskTemplate[] = [
  {
    phase: 'photos',
    label: "La photo d'ouverture de l'accueil",
    owner: 'client',
    milestone: 'livraison',
    status: 'done',
    description:
      "Fournie. Deux réserves : elle ne montre ni la Martinique ni un produit de la marque, et il faudra confirmer qu'on a le droit de l'utiliser commercialement.",
  },
  ...[
    'Vous, ou les coulisses',
    'Une ambiance famille en extérieur',
    'Des pièces pliées, un détail de matière',
    'Une remise de colis en point relais',
    'Le tri et le lavage, en coulisses',
    'Un parent qui trie les vêtements de son enfant',
  ].map(
    (label): TaskTemplate => ({
      phase: 'photos',
      label,
      owner: 'client',
      milestone: 'livraison',
      deliverable: 'La photo en pleine résolution, non recadrée.',
    }),
  ),
];

/* ── Ma part, en plus du commun ───────────────────────────────────────────── */

const SPECIFIQUE_L48: TaskTemplate[] = [
  {
    phase: 'boutique',
    label: "Créer l'application Shopify avec droits d'écriture",
    owner: 'launch48',
    status: 'blocked',
    description:
      "En attente de la double authentification. Ce jeton débloque d'un coup la création des 5 catégories et l'import des articles en masse — les outils sont écrits et prêts. Tant qu'il manque, les trois tâches suivantes ne peuvent pas commencer.",
  },
  {
    phase: 'boutique',
    label: 'Créer les 5 catégories de la boutique',
    owner: 'launch48',
    description: 'Seconde main, neuf, vêtements, éveil & repas, aquatique.',
  },
  {
    phase: 'boutique',
    label: 'Importer les articles et poser les étiquettes',
    owner: 'launch48',
    description:
      "En vérifiant que chaque produit a bien son état, son univers, sa taille et son niveau d'état. Sans étiquettes, ni badge seconde main, ni filtres, ni catégories.",
  },
  {
    phase: 'boutique',
    label: 'Vérifier que le diagnostic passe au vert',
    owner: 'launch48',
    description:
      "Étiquettes, catégories, textes des images : tout doit être au vert avant d'ouvrir.",
  },
  {
    phase: 'recette',
    label: 'Vérifier un produit à plusieurs tailles',
    owner: 'launch48',
    description:
      "Le sélecteur de taille est écrit mais n'a jamais rencontré de vrai produit à variantes.",
  },
  {
    phase: 'recette',
    label: 'Simuler un article vendu pendant la navigation',
    owner: 'launch48',
    description:
      "Vérifier que la fiche reste accessible, qu'elle passe en « déjà adopté » et que l'ajout au panier échoue proprement — c'est le cas normal pour des pièces uniques.",
  },
];

/* ── Assemblage ───────────────────────────────────────────────────────────── */

export const BOUTIQUE_SECONDE_MAIN: TaskTemplate[] = [
  ...ACQUIS,

  ...SPECIFIQUE_CLIENT,
  ...SOCLE_LEGAL,

  ...ajuste(IDENTITE, {
    'La licence de la police de la charte': {
      label: 'La licence de la police Agrandir',
      description:
        "Elle est payante. Le site utilise deux polices libres très proches en attendant — c'est propre, mais ce n'est pas la charte exacte.",
    },
  }),

  ...ajuste(TEXTES, {
    'Relire les questions fréquentes': {
      description:
        'Six réponses écrites à partir des objections identifiées : hygiène, retrait, paiement, pièce unique, retours, rachat.',
    },
  }),

  ...PHOTOS,

  ...ajuste(CATALOGUE, {
    'Rassembler le stock de départ': {
      label: 'Rassembler 80 à 100 pièces minimum',
      description:
        "C'est le plus long, c'est à commencer maintenant. En dessous de 80 pièces, la boutique a l'air abandonnée et les visiteurs ne reviennent pas. C'est ce qui déterminera la date d'ouverture, bien plus que le développement. Il y a 3 produits de test aujourd'hui.",
    },
    'Photographier chaque article': {
      label: 'Photographier chaque pièce, plusieurs angles',
      deliverable:
        'Un dossier par pièce, plusieurs angles, le défaut photographié de près quand il y en a un.',
    },
    'Valider les catégories et sous-catégories': {
      description:
        "J'ai proposé 12 sous-catégories réparties dans vos 3 univers (bodies & pyjamas, vaisselle & repas, bouées…). À corriger librement, c'est une ligne à changer.",
    },
  }),

  // La politique de retours est traitée dans les quatre textes légaux : la
  // redemander à part ferait doublon sur l'écran de la cliente.
  ...ajuste(sans(LOGISTIQUE, ['La politique de retours']), {
    'Les zones de livraison et les tarifs': {
      label: 'Tarifs postaux et formats de boîtes',
      description: 'Nécessaires pour paramétrer les frais de livraison dans Shopify.',
    },
  }),

  ...SPECIFIQUE_L48,
  ...RECETTE,
  ...MISE_EN_LIGNE,
];

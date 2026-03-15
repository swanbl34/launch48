export const CONTACT = {
  primaryLabel: 'Demander un devis',
  primaryHref: '/devis/',
  secondaryLabel: 'Réserver un appel découverte',
  secondaryHref: '/call/'
};

export const SITE = {
  name: 'Launch48',
  baseline: 'Landing pages premium orientées résultats',
  legalLinks: [
    { label: 'Mentions légales', href: '/mentions-legales.html' },
    { label: 'Politique de confidentialité', href: '/politique-confidentialite.html' },
    { label: 'CGV', href: '/cgv.html' }
  ]
};

export const OFFERS = [
  {
    slug: 'site-evenementiel',
    name: 'Site événementiel',
    shortDescription: 'Promouvoir un événement, centraliser les infos clés et accélérer les ventes billetterie.',
    target: 'Festivals, soirées, salons, conférences, événements culturels et corporate.',
    benefit: 'Une page claire qui transforme l\'intérêt en inscriptions et billets.',
    priceFrom: '1 290 €',
    hero: {
      eyebrow: 'Offre verticale',
      title: 'Une landing page qui remplit votre événement',
      subtitle: 'Nous structurons un site orienté conversion pour présenter le programme, rassurer les visiteurs et les rediriger rapidement vers la billetterie.',
      primaryCta: 'Créer la landing page de votre événement',
      secondaryCta: 'Voir toutes les offres'
    },
    preview: {
      src: '/illustrations/hero-site-5.svg',
      alt: 'Aperçu d’un site événementiel'
    },
    sections: [
      {
        title: 'Pour qui / cas d\'usage',
        items: ['Événements musicaux', 'Salons et foires', 'Conférences', 'Événements privés premium', 'Événements institutionnels']
      },
      {
        title: 'Ce que le site doit permettre',
        items: ['Donner envie immédiatement', 'Présenter les infos clés', 'Rediriger vers la billetterie', 'Rassurer avec une FAQ', 'Renforcer l\'image de l\'événement', 'Faciliter l\'accès aux infos pratiques']
      },
      {
        title: 'Structure type incluse',
        items: ['Hero photo ou vidéo', 'Date / lieu / promesse', 'CTA billetterie', 'Présentation de l\'événement', 'Galerie photo / vidéo', 'Infos pratiques', 'FAQ', 'Partenaires / sponsors', 'Footer complet']
      },
      {
        title: 'Pourquoi cette formule fonctionne',
        items: ['Pensée pour le mobile', 'Pensée pour la conversion', 'Pensée pour la clarté', 'Pensée pour les campagnes ads / réseaux sociaux']
      }
    ],
    pricingNote: 'Le tarif évolue selon le nombre de sections, les besoins en pages annexes et les options spécifiques.',
    options: ['Compte à rebours', 'Page programmation / line-up', 'Page partenaires', 'Formulaire bénévoles / exposants / presse', 'Carte / accès', 'Multilingue', 'Tracking Meta / Google', 'Intégration newsletter'],
    finalCta: 'Créer la landing page de votre événement'
  },
  {
    slug: 'site-consultant',
    name: 'Site consultant / freelance / agence',
    shortDescription: 'Clarifier votre offre, rassurer vos prospects et générer des prises de rendez-vous qualifiées.',
    target: 'Consultants, freelances, agences, coachs et experts indépendants.',
    benefit: 'Un site qui transforme votre expertise en opportunités commerciales.',
    priceFrom: '990 €',
    hero: {
      eyebrow: 'Offre verticale',
      title: 'Présentez votre expertise avec clarté et impact',
      subtitle: 'Nous construisons une page qui explique votre valeur, crédibilise votre positionnement et pousse à la prise de contact.',
      primaryCta: 'Présenter votre expertise avec plus d\'impact',
      secondaryCta: 'Réserver un appel découverte'
    },
    preview: {
      src: '/illustrations/hero-site-4.svg',
      alt: 'Aperçu d’un site consultant'
    },
    sections: [
      {
        title: 'Les problèmes fréquents',
        items: ['Offre peu claire', 'Manque de crédibilité', 'Site trop vide ou trop générique', 'Absence de tunnel de contact']
      },
      {
        title: 'Ce que le site doit permettre',
        items: ['Clarifier l\'offre', 'Présenter les services', 'Montrer les références / cas clients', 'Rassurer', 'Déclencher une prise de rendez-vous']
      },
      {
        title: 'Structure type incluse',
        items: ['Hero', 'Services / offres', 'Méthode de travail', 'Résultats / références', 'Témoignages', 'FAQ', 'Formulaire ou CTA agenda']
      },
      {
        title: 'Idéal pour',
        items: ['Lancement d\'activité', 'Repositionnement', 'Montée en gamme', 'Prospection']
      }
    ],
    pricingNote: 'Le tarif varie selon le niveau de personnalisation des sections et les intégrations demandées.',
    options: ['Tunnel de prise de rendez-vous', 'Page étude de cas', 'Page offres détaillées', 'Intégration Calendly', 'Blog', 'Lead magnet / téléchargement PDF'],
    finalCta: 'Présenter votre expertise avec plus d\'impact'
  },
  {
    slug: 'site-lancement-marque',
    name: 'Site lancement de marque / produit',
    shortDescription: 'Lancer une marque ou un produit avec un storytelling fort et un design premium orienté désir.',
    target: 'Nouvelles marques, lancements produit, DNVB, collections capsule, campagnes marketing.',
    benefit: 'Une landing page qui met en scène votre différence et oriente vers l\'action.',
    priceFrom: '1 490 €',
    hero: {
      eyebrow: 'Offre verticale',
      title: 'Une landing immersive pour lancer votre marque',
      subtitle: 'Nous créons une expérience visuelle puissante qui structure votre message et convertit vers achat, inscription ou prise de contact.',
      primaryCta: 'Lancer votre marque avec une page à la hauteur',
      secondaryCta: 'Voir toutes les offres'
    },
    preview: {
      src: '/illustrations/hero-site-2.svg',
      alt: 'Aperçu d’une landing page de lancement de marque'
    },
    sections: [
      {
        title: 'Le concept / la marque',
        items: ['Histoire', 'Vision', 'Différence']
      },
      {
        title: 'Le produit / l\'offre',
        items: ['Bénéfices', 'Points forts', 'Éléments différenciants']
      },
      {
        title: 'Expérience visuelle',
        items: ['Galerie', 'Ambiance de marque', 'Assets motion / transitions si pertinent']
      },
      {
        title: 'Objectif du site',
        items: ['Créer le désir', 'Structurer le message', 'Orienter vers achat / prise de contact / inscription']
      },
      {
        title: 'Structure type incluse',
        items: ['Hero immersif', 'Storytelling', 'Présentation produit / offre', 'Arguments clés', 'Visuels / contenus', 'CTA', 'FAQ ou infos utiles', 'Footer']
      }
    ],
    pricingNote: 'Le tarif dépend du niveau de storytelling, du volume de contenus et des options de campagne.',
    options: ['Précommande', 'Formulaire de liste d\'attente', 'Intégration email marketing', 'Mini catalogue', 'Social proof', 'Page campagne ads dédiée'],
    finalCta: 'Lancer votre marque avec une page à la hauteur'
  },
  {
    slug: 'site-restaurant',
    name: 'Site restaurant / food / hospitality',
    shortDescription: 'Valoriser un lieu, son ambiance et sa carte tout en facilitant réservation et contact.',
    target: 'Restaurants, coffee shops, bars, concepts food et lieux hospitality.',
    benefit: 'Un site qui donne envie, inspire confiance et simplifie la réservation.',
    priceFrom: '1 090 €',
    hero: {
      eyebrow: 'Offre verticale',
      title: 'Un site qui donne faim et remplit vos services',
      subtitle: 'Nous créons une vitrine visuelle et claire pour mettre en avant votre univers, vos menus et les informations pratiques essentielles.',
      primaryCta: 'Mettre votre lieu en valeur en ligne',
      secondaryCta: 'Réserver un appel découverte'
    },
    preview: {
      src: '/illustrations/hero-site-1.svg',
      alt: 'Aperçu d’un site restaurant'
    },
    sections: [
      {
        title: 'Présentation du lieu',
        items: ['Identité', 'Ambiance', 'Positionnement']
      },
      {
        title: 'Ce que le site doit permettre',
        items: ['Donner envie', 'Montrer l\'univers', 'Afficher menu / carte', 'Afficher horaires / accès', 'Faciliter réservation ou contact']
      },
      {
        title: 'Structure type incluse',
        items: ['Hero', 'Concept / histoire', 'Galerie', 'Carte / menu', 'Horaires', 'Accès / map', 'FAQ courte', 'Contact / réservation']
      }
    ],
    pricingNote: 'Le tarif varie selon les pages additionnelles, les contenus photos/vidéos et les intégrations externes.',
    options: ['Page privatisation', 'Page événements', 'Menu téléchargeable', 'Réservation intégrée', 'Version multilingue', 'Bloc avis clients'],
    finalCta: 'Mettre votre lieu en valeur en ligne'
  },
  {
    slug: 'site-artiste',
    name: 'Site artiste / créatif / portfolio',
    shortDescription: 'Exposer un univers créatif avec une présence professionnelle, lisible et premium.',
    target: 'Artistes, photographes, vidéastes, designers, DJ, réalisateurs et créatifs indépendants.',
    benefit: 'Une vitrine claire qui valorise les travaux et déclenche des demandes.',
    priceFrom: '890 €',
    hero: {
      eyebrow: 'Offre verticale',
      title: 'Un portfolio qui porte votre signature visuelle',
      subtitle: 'Nous construisons un site qui centralise vos projets, renforce votre crédibilité et fluidifie la prise de contact.',
      primaryCta: 'Créer un portfolio à votre image',
      secondaryCta: 'Voir toutes les offres'
    },
    preview: {
      src: '/illustrations/hero-site-3.svg',
      alt: 'Aperçu d’un portfolio créatif'
    },
    sections: [
      {
        title: 'Présentation',
        items: ['Univers', 'Démarche', 'Style']
      },
      {
        title: 'Galerie / projets',
        items: ['Portfolio', 'Visuels / vidéos', 'Projets sélectionnés']
      },
      {
        title: 'Utilité du site',
        items: ['Centraliser les travaux', 'Envoyer un lien propre', 'Gagner en crédibilité', 'Faciliter les demandes']
      },
      {
        title: 'Structure type incluse',
        items: ['Hero', 'Bio / présentation', 'Galerie', 'Projets', 'Services éventuels', 'Contact', 'Réseaux sociaux']
      }
    ],
    pricingNote: 'Le tarif évolue selon la profondeur du portfolio et les modules spécifiques de diffusion.',
    options: ['Page projet détaillée', 'Page booking', 'EPK / press kit', 'Player audio / vidéo', 'Agenda / dates', 'Boutique simple'],
    finalCta: 'Créer un portfolio à votre image'
  },
  {
    slug: 'site-media-podcast',
    name: 'Site média / podcast / contenu',
    shortDescription: 'Structurer vos contenus, vos formats et votre image éditoriale sur une base claire et professionnelle.',
    target: 'Podcasts, médias indépendants, émissions, chaînes de contenu et projets éditoriaux.',
    benefit: 'Une vitrine éditoriale qui valorise vos épisodes et facilite les partenariats.',
    priceFrom: '1 190 €',
    hero: {
      eyebrow: 'Offre verticale',
      title: 'Donnez une vraie vitrine à votre média',
      subtitle: 'Nous organisons vos formats, vos contenus et vos points de contact pour améliorer lisibilité, crédibilité et conversion.',
      primaryCta: 'Donner une vraie vitrine à votre média',
      secondaryCta: 'Réserver un appel découverte'
    },
    preview: {
      src: '/illustrations/hero-site-4.svg',
      alt: 'Aperçu d’un site média ou podcast'
    },
    sections: [
      {
        title: 'Ce que le site doit permettre',
        items: ['Présenter le concept', 'Valoriser les formats', 'Centraliser vidéos / épisodes / contenus', 'Mettre en avant les partenaires', 'Faciliter les prises de contact']
      },
      {
        title: 'Structure type incluse',
        items: ['Hero', 'Présentation du média', 'Formats / émissions', 'Contenus à la une', 'Partenaires', 'Contact', 'CTA collaboration']
      }
    ],
    pricingNote: 'Le tarif dépend du volume de contenus, des pages de formats et des modules d\'abonnement.',
    options: ['Blog / articles', 'Pages formats détaillées', 'Espace partenaires', 'Formulaire invité / partenariat', 'Newsletter', 'Archive de contenus'],
    finalCta: 'Donner une vraie vitrine à votre média'
  },
  {
    slug: 'site-association',
    name: 'Site association / projet culturel / institutionnel',
    shortDescription: 'Présenter une mission, valoriser l\'impact et orienter vers l\'engagement ou la prise de contact.',
    target: 'Associations, collectifs, projets culturels, structures territoriales et événements institutionnels.',
    benefit: 'Une présence web claire qui renforce la confiance et l\'action.',
    priceFrom: '990 €',
    hero: {
      eyebrow: 'Offre verticale',
      title: 'Présentez votre mission avec clarté et crédibilité',
      subtitle: 'Nous concevons une structure éditoriale qui explique votre impact, valorise vos actions et facilite l\'engagement.',
      primaryCta: 'Présenter votre projet avec plus de clarté',
      secondaryCta: 'Voir toutes les offres'
    },
    preview: {
      src: '/illustrations/hero-site-5.svg',
      alt: 'Aperçu d’un site association ou institutionnel'
    },
    sections: [
      {
        title: 'Présentation de la structure',
        items: ['Mission', 'Vision', 'Impact', 'Historique']
      },
      {
        title: 'Actions / programmes',
        items: ['Ce que vous faites', 'Publics concernés', 'Résultats / temps forts']
      },
      {
        title: 'Ce que le site doit permettre',
        items: ['Expliquer clairement', 'Rassurer', 'Présenter les actions', 'Faciliter le contact', 'Mettre en avant les partenaires']
      },
      {
        title: 'Structure type incluse',
        items: ['Hero', 'Mission', 'Actions / programmes', 'Actualités ou événements', 'Partenaires', 'FAQ', 'Contact']
      }
    ],
    pricingNote: 'Le tarif évolue selon la profondeur éditoriale, les formulaires et les espaces ressources demandés.',
    options: ['Formulaire bénévolat', 'Formulaire adhésion', 'Espace ressources', 'Page dons', 'Agenda', 'Page presse'],
    finalCta: 'Présenter votre projet avec plus de clarté'
  },
  {
    slug: 'site-immobilier-location',
    name: 'Site immobilier / location saisonnière / bien à louer',
    shortDescription: 'Valoriser un bien avec une présentation premium qui rassure et génère des demandes qualifiées.',
    target: 'Locations saisonnières, villas, appartements premium, conciergeries, résidences et petits programmes immobiliers.',
    benefit: 'Une landing claire qui simplifie la réservation et augmente la confiance.',
    priceFrom: '1 090 €',
    hero: {
      eyebrow: 'Offre verticale',
      title: 'Valorisez votre bien avec une page premium',
      subtitle: 'Nous structurons une landing page immersive qui met en avant les atouts du lieu et facilite la demande de réservation.',
      primaryCta: 'Valoriser votre bien avec une page premium',
      secondaryCta: 'Réserver un appel découverte'
    },
    preview: {
      src: '/illustrations/hero-site-1.svg',
      alt: 'Aperçu d’un site immobilier ou location'
    },
    sections: [
      {
        title: 'Présentation du bien',
        items: ['Description', 'Points forts', 'Capacité / localisation']
      },
      {
        title: 'Galerie',
        items: ['Photos / vidéos', 'Détails du lieu']
      },
      {
        title: 'Ce que le site doit permettre',
        items: ['Donner envie', 'Rassurer', 'Détailler les équipements', 'Répondre aux questions', 'Faciliter la réservation ou la demande']
      },
      {
        title: 'Structure type incluse',
        items: ['Hero', 'Présentation', 'Galerie', 'Équipements', 'Localisation', 'FAQ', 'CTA réservation / contact']
      }
    ],
    pricingNote: 'Le tarif varie selon le nombre de biens, les intégrations externes et les versions linguistiques.',
    options: ['Calendrier externe', 'Formulaire de demande', 'Carte', 'Plusieurs biens', 'Version multilingue', 'Page activités autour'],
    finalCta: 'Valoriser votre bien avec une page premium'
  }
];

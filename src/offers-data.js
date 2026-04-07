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
    name: 'Event / Festival',
    shortDescription: 'Démo sectorielle pensée pour présenter un événement, rythmer la programmation et rendre la billetterie évidente dès les premiers scrolls.',
    target: 'Festivals, concerts, conférences, expériences live, salons, formats culturels et activations de marque.',
    benefit: 'Une démo fictive qui montre comment transformer l\'attention en billets, inscriptions ou demandes partenaires.',
    priceFrom: '1 290 €',
    hero: {
      eyebrow: 'Offre verticale',
      title: 'La page event qui met votre rendez-vous en scene',
      subtitle: 'Cette verticale montre comment Launch48 structure une page festival ou événement avec date, lieu, programmation, ambiance et billetterie visibles immédiatement.',
      primaryCta: 'Créer votre site internet événement',
      secondaryCta: 'Voir toutes les offres'
    },
    seo: {
      keyword: 'site internet événement',
      title: 'Site internet événement et landing page événement | Launch48',
      description: 'Créez un site internet événement en 48h : landing page événement pour soirée, concert, conférence, gala ou festival.'
    },
    preview: {
      src: '/previews/event-demo-home.png',
      alt: 'Capture de la démo fictive Event / Festival',
      href: 'https://launch48-preview.vercel.app/event',
      title: 'Démo fictive',
      caption: 'Ouvrir la preview event dans un nouvel onglet',
      note: "Concept fictif créé par Launch48 pour illustrer cette expertise. Il ne s'agit pas d'un site client."
    },
    previewSpotlight: {
      kicker: 'Exemple de site internet evenement',
      title: 'Voir un exemple grand format de site internet evenement',
      text: "Cette grande preview montre comment une landing page événement peut mettre en avant la date, le lieu, la programmation et la billetterie dans une structure plus claire, plus visuelle et plus orientée conversion.",
      cta: 'Ouvrir cet exemple de site événement'
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
    finalCta: 'Créer votre site internet événement'
  },
  {
    slug: 'site-consultant',
    name: 'Consultant / Expert B2B',
    shortDescription: 'Démo B2B conçue pour clarifier une offre, asseoir la crédibilité et faire avancer des prises de rendez-vous qualifiées.',
    target: 'Consultants, experts métier, cabinets, freelances B2B et studios de conseil.',
    benefit: 'Une démo fictive qui montre comment rendre une expertise complexe lisible, crédible et premium.',
    priceFrom: '990 €',
    hero: {
      eyebrow: 'Offre verticale',
      title: 'La page consultant qui clarifie votre valeur en quelques secondes',
      subtitle: 'Cette verticale illustre une structure pensée pour le conseil B2B : promesse nette, expertise cadrée, méthode visible et tunnel de contact sans friction.',
      primaryCta: 'Créer votre site internet freelance',
      secondaryCta: 'Réserver un appel découverte'
    },
    seo: {
      keyword: 'site internet freelance',
      title: 'Site internet freelance et site vitrine freelance rapide | Launch48',
      description: 'Créez un site internet freelance en 48h : site vitrine freelance rapide pour consultant, coach, expert ou agence.'
    },
    preview: {
      src: '/previews/consultant-demo-home.png',
      alt: 'Capture de la démo fictive Consultant / Expert B2B',
      href: 'https://launch48-preview.vercel.app/consultant',
      title: 'Démo fictive',
      caption: 'Ouvrir la preview consultant dans un nouvel onglet',
      note: "Concept fictif créé par Launch48 pour illustrer cette expertise. Il ne s'agit pas d'un site client."
    },
    previewSpotlight: {
      kicker: 'Exemple de site internet freelance',
      title: 'Voir un exemple grand format de site internet freelance',
      text: "Cette preview illustre comment un site internet freelance ou consultant peut clarifier l'offre, valoriser l'expertise, structurer les références et orienter vers une prise de rendez-vous qualifiée.",
      cta: 'Ouvrir cet exemple de site consultant'
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
    finalCta: 'Créer votre site internet freelance'
  },
  {
    slug: 'site-lancement-marque',
    name: 'Site lancement de marque / produit',
    shortDescription: 'Landing page de lancement de marque ou produit pour lancer un site web vite avec un storytelling fort et un design premium orienté désir.',
    target: 'Nouvelles marques, lancements produit, DNVB, collections capsule, campagnes marketing.',
    benefit: 'Une landing page de lancement qui met en scène votre différence et oriente vers l\'action.',
    priceFrom: '1 490 €',
    hero: {
      eyebrow: 'Offre verticale',
      title: 'La landing page de lancement qui installe votre marque',
      subtitle: 'Nous créons une landing page de lancement en 48h pour lancer une marque, un produit ou une campagne avec une expérience visuelle forte et un CTA net.',
      primaryCta: 'Lancer votre marque avec une landing page premium',
      secondaryCta: 'Voir toutes les offres'
    },
    seo: {
      keyword: 'landing page de lancement de marque',
      title: 'Landing page lancement de marque / produit | Launch48',
      description: 'Lancez une marque ou un produit avec une landing page premium et un site internet express livré rapidement.'
    },
    preview: {
      src: '/previews/brand-launch-demo-home.png',
      alt: 'Capture de la démo fictive Lancement de marque / Produit',
      href: 'https://launch48-preview.vercel.app/brand-launch',
      title: 'Démo fictive',
      caption: 'Ouvrir la preview brand launch dans un nouvel onglet',
      note: "Concept fictif créé par Launch48 pour illustrer cette expertise. Il ne s'agit pas d'un site client."
    },
    previewSpotlight: {
      kicker: 'Exemple de landing page de lancement de marque',
      title: 'Voir un exemple grand format de landing page de lancement de marque',
      text: "Cette preview montre comment une landing page de lancement de marque ou produit peut installer un univers fort, hiérarchiser le storytelling et guider naturellement vers l'achat, l'inscription ou la prise de contact.",
      cta: 'Ouvrir cet exemple de landing page'
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
    finalCta: 'Lancer votre marque avec une landing page premium'
  },
  {
    slug: 'site-restaurant',
    name: 'Restaurant / Food concept',
    shortDescription: 'Démo food conçue pour mettre en scène un lieu, sa carte et son identité afin de déclencher réservation, visite ou privatisation.',
    target: 'Restaurants, coffee shops, bars, concepts food, chefs, lieux hospitality et adresses lifestyle.',
    benefit: 'Une démo fictive qui montre comment faire ressentir l\'ambiance et simplifier la réservation.',
    priceFrom: '1 090 €',
    hero: {
      eyebrow: 'Offre verticale',
      title: 'La page food qui donne faim avant meme la reservation',
      subtitle: 'Cette verticale met en avant une structure pensée pour les concepts food : atmosphère forte, carte lisible, infos utiles et CTA réservation bien placés.',
      primaryCta: 'Créer votre site internet restaurant',
      secondaryCta: 'Réserver un appel découverte'
    },
    seo: {
      keyword: 'site internet restaurant rapide',
      title: 'Site internet restaurant rapide et site web commerce local | Launch48',
      description: 'Créez un site internet restaurant rapide : site vitrine restaurant pour restaurant, bar, coffee shop ou commerce local.'
    },
    preview: {
      src: '/previews/restaurant-demo-home.png',
      alt: 'Capture de la démo fictive Restaurant / Food concept',
      href: 'https://launch48-preview.vercel.app/restaurant',
      title: 'Démo fictive',
      caption: 'Ouvrir la preview restaurant dans un nouvel onglet',
      note: "Concept fictif créé par Launch48 pour illustrer cette expertise. Il ne s'agit pas d'un site client."
    },
    previewSpotlight: {
      kicker: 'Exemple de site internet restaurant rapide',
      title: 'Voir un exemple grand format de site internet restaurant',
      text: "Cette grande capture permet de voir comment un site internet restaurant rapide peut transmettre une ambiance, rendre la carte lisible, afficher les informations utiles et simplifier la réservation sur mobile comme sur desktop.",
      cta: 'Ouvrir cet exemple de site restaurant'
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
    finalCta: 'Créer votre site internet restaurant'
  },
  {
    slug: 'site-artiste',
    name: 'Artiste / Portfolio créatif',
    shortDescription: 'Démo portfolio pensée pour exposer un univers, hiérarchiser les projets et transformer un lien en vraie carte de visite créative.',
    target: 'Artistes, photographes, vidéastes, designers, directeurs artistiques, musiciens et créatifs indépendants.',
    benefit: 'Une démo fictive qui montre comment rendre un portfolio plus désirable, plus net et plus mémorable.',
    priceFrom: '890 €',
    hero: {
      eyebrow: 'Offre verticale',
      title: 'Le portfolio creatif qui laisse une vraie impression',
      subtitle: 'Cette verticale illustre une page portfolio où la direction artistique, la sélection des travaux et la lecture mobile servent autant l\'image que la prise de contact.',
      primaryCta: 'Créer votre site portfolio professionnel',
      secondaryCta: 'Voir toutes les offres'
    },
    seo: {
      keyword: 'site portfolio professionnel',
      title: 'Créer un site portfolio professionnel | Launch48',
      description: 'Créez un site portfolio professionnel en 48h pour artiste, photographe, vidéaste, designer ou créatif indépendant.'
    },
    preview: {
      src: '/previews/artist-demo-home.png',
      alt: 'Capture de la démo fictive Artiste / Portfolio créatif',
      href: 'https://launch48-preview.vercel.app/artist',
      title: 'Démo fictive',
      caption: 'Ouvrir la preview portfolio dans un nouvel onglet',
      note: "Concept fictif créé par Launch48 pour illustrer cette expertise. Il ne s'agit pas d'un site client."
    },
    previewSpotlight: {
      kicker: 'Exemple de site portfolio professionnel',
      title: 'Voir un exemple grand format de site portfolio professionnel',
      text: "Cette preview met en avant une direction artistique plus immersive pour montrer comment créer un site portfolio professionnel capable de valoriser un univers, une sélection de projets et une image plus premium.",
      cta: 'Ouvrir cet exemple de portfolio créatif'
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
    finalCta: 'Créer votre site portfolio professionnel'
  },
  {
    slug: 'site-media-podcast',
    name: 'Site média / podcast / contenu',
    shortDescription: 'Site internet média ou podcast professionnel pour structurer vos contenus, mieux présenter vos formats et faciliter les partenariats.',
    target: 'Podcasts, médias indépendants, émissions, chaînes de contenu et projets éditoriaux.',
    benefit: 'Un site média professionnel qui valorise vos contenus et vos collaborations.',
    priceFrom: '1 190 €',
    hero: {
      eyebrow: 'Offre verticale',
      title: 'Le site internet média qui donne du poids à vos contenus',
      subtitle: 'Nous créons un site internet média ou podcast professionnel pour centraliser vos formats, clarifier votre ligne éditoriale et améliorer la conversion.',
      primaryCta: 'Créer votre site média professionnel',
      secondaryCta: 'Réserver un appel découverte'
    },
    seo: {
      keyword: 'site internet média',
      title: 'Site internet média et podcast professionnel | Launch48',
      description: 'Créez un site internet média ou podcast professionnel pour présenter vos formats, contenus phares et opportunités de partenariat.'
    },
    preview: {
      src: '/previews/site-media-podcast-home.jpg',
      alt: 'Capture de la homepage du média Tripin',
      href: 'https://tripin-five.vercel.app/'
    },
    previewSpotlight: {
      kicker: 'Exemple de site internet média',
      title: 'Voir un exemple grand format de site internet média',
      text: "Cette preview montre comment un site internet média ou podcast peut structurer les formats, valoriser les contenus à la une et renforcer la crédibilité d'un projet éditorial auprès du public comme des partenaires.",
      cta: 'Ouvrir cet exemple de site média'
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
    finalCta: 'Créer votre site média professionnel'
  },
  {
    slug: 'site-association',
    name: 'Association / Projet à impact',
    shortDescription: 'Démo à impact conçue pour expliquer une mission, valoriser des actions concrètes et orienter clairement vers adhésion, don ou bénévolat.',
    target: 'Associations, collectifs, projets à impact, structures culturelles, initiatives locales et organisations engagées.',
    benefit: 'Une démo fictive qui montre comment rendre une mission plus claire, plus crédible et plus mobilisatrice.',
    priceFrom: '990 €',
    hero: {
      eyebrow: 'Offre verticale',
      title: 'La page a impact qui transforme une mission en engagement',
      subtitle: 'Cette verticale montre comment structurer un site pour raconter une cause, rendre les actions tangibles et guider vers le bon geste: adhérer, donner, participer ou contacter.',
      primaryCta: 'Créer votre site internet association',
      secondaryCta: 'Voir toutes les offres'
    },
    seo: {
      keyword: 'site internet association rapide',
      title: 'Site internet association rapide | Launch48',
      description: 'Créez un site internet association rapide, clair et plus accessible qu’une agence classique pour présenter mission, actions et engagement.'
    },
    preview: {
      src: '/previews/association-demo-home.png',
      alt: 'Capture de la démo fictive Association / Projet à impact',
      href: 'https://launch48-preview.vercel.app/association',
      title: 'Démo fictive',
      caption: 'Ouvrir la preview association dans un nouvel onglet',
      note: "Concept fictif créé par Launch48 pour illustrer cette expertise. Il ne s'agit pas d'un site client."
    },
    previewSpotlight: {
      kicker: 'Exemple de site internet association rapide',
      title: 'Voir un exemple grand format de site internet association',
      text: "Cette grande preview illustre comment un site internet association rapide peut expliquer une mission, mettre en avant des actions concrètes et orienter clairement vers l'adhésion, le don, le bénévolat ou le contact.",
      cta: 'Ouvrir cet exemple de site association'
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
    finalCta: 'Créer votre site internet association'
  },
  {
    slug: 'site-immobilier-location',
    name: 'Immobilier premium / Real Estate',
    shortDescription: 'Démo premium pensée pour mettre en valeur un bien, son environnement et son niveau de prestation avec un parcours de demande haut de gamme.',
    target: 'Biens premium, villas, locations saisonnières haut de gamme, résidences, conciergeries et agences boutique.',
    benefit: 'Une démo fictive qui montre comment vendre l\'expérience du lieu avant même le premier contact.',
    priceFrom: '1 090 €',
    hero: {
      eyebrow: 'Offre verticale',
      title: 'La page real estate qui valorise un bien comme une destination',
      subtitle: 'Cette verticale illustre une structure immobilière premium avec storytelling du lieu, galerie forte, prestations lisibles et CTA de demande qualifiée.',
      primaryCta: 'Créer votre site vitrine immobilier',
      secondaryCta: 'Réserver un appel découverte'
    },
    seo: {
      keyword: 'site vitrine immobilier',
      title: 'Site vitrine immobilier et site internet agent immobilier | Launch48',
      description: 'Créez un site vitrine immobilier en 48h pour agent immobilier, location saisonnière, villa ou appartement à louer.'
    },
    preview: {
      src: '/previews/real-estate-demo-home.png',
      alt: 'Capture de la démo fictive Immobilier premium / Real Estate',
      href: 'https://launch48-preview.vercel.app/real-estate',
      title: 'Démo fictive',
      caption: 'Ouvrir la preview real estate dans un nouvel onglet',
      note: "Concept fictif créé par Launch48 pour illustrer cette expertise. Il ne s'agit pas d'un site client."
    },
    previewSpotlight: {
      kicker: 'Exemple de site vitrine immobilier',
      title: 'Voir un exemple grand format de site vitrine immobilier',
      text: "Cette preview montre comment un site vitrine immobilier peut valoriser un bien premium, mettre en scène les prestations, rassurer avec les informations clés et générer des demandes plus qualifiées.",
      cta: 'Ouvrir cet exemple de site immobilier'
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
    finalCta: 'Créer votre site vitrine immobilier'
  }
];

export const VERTICAL_DETAILS = {
  'site-evenementiel': {
    idealFor: ['Festivals', 'Concerts', 'Conférences', 'Événements live', 'Salons'],
    painPoints: [
      "Le public voit l'annonce, mais ne comprend pas immédiatement la date, le lieu, le programme et la promesse.",
      "La billetterie est trop faible dans le parcours ou noyée dans le contenu.",
      "Le projet perd en crédibilité faute d'infos pratiques, de partenaires visibles et de structure claire."
    ],
    outcomes: [
      'Une page qui donne envie en quelques secondes et oriente vite vers la billetterie.',
      'Un parcours clair entre promesse, programme, preuves visuelles et informations utiles.',
      'Une présence web qui rassure les visiteurs, les partenaires et les sponsors.'
    ],
    pillars: [
      {
        label: 'Conversion',
        title: 'Billetterie prioritaire',
        text: "Chaque bloc ramène vers l'action clé: acheter, réserver ou s'inscrire."
      },
      {
        label: 'Clarté',
        title: 'Infos utiles sans friction',
        text: 'Date, lieu, accès, programmation, FAQ et contacts sont hiérarchisés proprement.'
      },
      {
        label: 'Image',
        title: "Désir + crédibilité",
        text: "Direction visuelle, photos, partenaires et ambiance renforcent la valeur perçue de l'événement."
      }
    ],
    flow: [
      {
        label: '01',
        title: 'Promesse, date, lieu, CTA',
        text: "On ouvre avec l'essentiel: ce qui se passe, pourquoi venir, quand, où, et comment réserver."
      },
      {
        label: '02',
        title: 'Programme et moments forts',
        text: 'On structure la programmation pour donner envie sans perdre le visiteur dans une page confuse.'
      },
      {
        label: '03',
        title: 'Preuves et réassurance',
        text: 'Galerie, partenaires, FAQ, accès et éléments de confiance rassurent avant la décision.'
      },
      {
        label: '04',
        title: 'Rappel fort à la conversion',
        text: "On ferme la page avec un CTA très lisible pour capter les ventes et les inscriptions de dernière minute."
      }
    ],
    inclusions: [
      'Hero de lancement pensé mobile',
      'Bloc billetterie / inscription bien visible',
      'Structure programme ou temps forts',
      'Section infos pratiques',
      'FAQ orientée objections',
      'Footer complet et CTA répétés'
    ]
  },
  'site-consultant': {
    idealFor: ['Consultants', 'Experts B2B', 'Cabinets', 'Freelances', 'Studios conseil'],
    painPoints: [
      "L'offre semble floue, trop large ou trop abstraite pour déclencher un rendez-vous.",
      'Le site manque de structure et ne transforme pas vraiment la crédibilité en prise de contact.',
      "La promesse est noyée dans un discours trop long, trop vague ou trop générique."
    ],
    outcomes: [
      'Une page qui explique clairement votre valeur en quelques secondes.',
      'Un parcours qui rassure avec méthode, références, résultats et CTA bien placés.',
      'Une présence plus premium qui soutient repositionnement, montée en gamme et prospection.'
    ],
    pillars: [
      {
        label: 'Positionnement',
        title: 'Offre plus nette',
        text: 'On clarifie qui vous aidez, sur quoi, et avec quelle promesse concrète.'
      },
      {
        label: 'Crédibilité',
        title: 'Preuve mieux cadrée',
        text: 'Références, méthode, résultats et signaux de sérieux sont mis au bon endroit.'
      },
      {
        label: 'Lead gen',
        title: 'Prise de contact naturelle',
        text: "La page guide vers l'appel, le devis ou le formulaire sans forcer artificiellement."
      }
    ],
    flow: [
      {
        label: '01',
        title: 'Promesse + cible + angle',
        text: 'On pose un positionnement lisible immédiatement, sans jargon et sans ambiguïté.'
      },
      {
        label: '02',
        title: 'Offres et méthode',
        text: 'On montre comment vous intervenez, ce que vous apportez et comment se passe la collaboration.'
      },
      {
        label: '03',
        title: 'Preuves sociales et résultats',
        text: 'On injecte les éléments qui transforment la confiance en intention de contact.'
      },
      {
        label: '04',
        title: 'CTA rendez-vous ou devis',
        text: 'On conclut avec un tunnel simple et assumé vers la prochaine étape.'
      }
    ],
    inclusions: [
      'Hero avec promesse métier forte',
      'Bloc offres / services lisibles',
      'Méthode de travail structurée',
      'Preuves, cas ou références',
      'FAQ de réassurance',
      'CTA prise de rendez-vous'
    ]
  },
  'site-lancement-marque': {
    idealFor: ['Lancement de marque', 'Produit', 'DNVB', 'Drop', 'Campagne'],
    painPoints: [
      "Le lancement manque de scène, donc le message n'imprime pas.",
      'Le site présente le produit, mais ne crée ni désir ni tension narrative.',
      "Le trafic arrive, mais la page ne transforme pas l'attention en action claire."
    ],
    outcomes: [
      'Une page qui installe immédiatement un univers et une promesse différenciante.',
      'Un storytelling qui donne du relief au produit, à la marque et au moment de lancement.',
      "Un parcours net vers achat, précommande, liste d'attente ou prise de contact."
    ],
    pillars: [
      {
        label: 'Storytelling',
        title: 'Narration de lancement',
        text: 'Le site devient une scène qui installe le ton, la tension et la différence de la marque.'
      },
      {
        label: 'Désir',
        title: 'Impact visuel assumé',
        text: "Le design sert l'envie, la mémorisation et la valeur perçue."
      },
      {
        label: 'Action',
        title: 'CTA parfaitement aligné',
        text: 'Précommande, liste d’attente ou vente: la page pousse vers un objectif unique et net.'
      }
    ],
    flow: [
      {
        label: '01',
        title: 'Univers + angle de marque',
        text: 'On ouvre sur une direction forte, pas sur une simple fiche produit.'
      },
      {
        label: '02',
        title: 'Produit, bénéfices, différence',
        text: 'On structure les arguments pour créer de la tension et de la préférence.'
      },
      {
        label: '03',
        title: 'Visuels, rythme, crédibilité',
        text: 'On construit un tempo premium entre images, preuves et informations utiles.'
      },
      {
        label: '04',
        title: 'Conversion de campagne',
        text: "On ferme avec un CTA puissant pensé pour capter l'élan du lancement."
      }
    ],
    inclusions: [
      'Hero immersif et direction visuelle forte',
      'Storytelling de marque ou de produit',
      'Blocs bénéfices et différenciation',
      'Sections visuelles éditorialisées',
      'CTA principal répété',
      'Base prête pour campagne ou ads'
    ]
  },
  'site-restaurant': {
    idealFor: ['Restaurants', 'Bars', 'Coffee shops', 'Food concepts', 'Hospitality'],
    painPoints: [
      "Le lieu a du charme, mais le site ne transmet ni l'ambiance ni le niveau perçu.",
      'Les visiteurs trouvent mal les horaires, la carte, la réservation ou les infos utiles.',
      "La page n'aide pas assez à passer de la curiosité à la réservation."
    ],
    outcomes: [
      'Une vitrine qui donne faim, met le lieu en scène et renforce la désirabilité.',
      'Un accès immédiat aux informations qui comptent vraiment avant de venir.',
      'Une page qui simplifie la réservation, la prise de contact et la découverte du concept.'
    ],
    pillars: [
      {
        label: 'Atmosphère',
        title: 'Un site qui fait ressentir le lieu',
        text: 'Le design doit évoquer une ambiance, pas seulement afficher des blocs de texte.'
      },
      {
        label: 'Utilité',
        title: 'Les infos clés en un regard',
        text: 'Carte, horaires, adresse, réservation et accès deviennent immédiats.'
      },
      {
        label: 'Conversion',
        title: 'Réserver sans hésiter',
        text: 'Le parcours pousse naturellement vers la table, le contact ou la venue.'
      }
    ],
    flow: [
      {
        label: '01',
        title: 'Ambiance, promesse, réservation',
        text: 'On ouvre sur le ton du lieu et sur une action simple pour réserver ou contacter.'
      },
      {
        label: '02',
        title: 'Concept et identité',
        text: 'On raconte juste assez pour donner de la profondeur au lieu et à son positionnement.'
      },
      {
        label: '03',
        title: 'Carte, photos, informations utiles',
        text: 'On fait remonter les éléments qui aident vraiment le visiteur à choisir.'
      },
      {
        label: '04',
        title: 'Rappel réservation / accès',
        text: 'On termine avec un bloc très clair pour convertir la visite en passage à l’action.'
      }
    ],
    inclusions: [
      "Hero visuel orienté désir",
      'Bloc concept / histoire du lieu',
      'Galerie ou visuels clés',
      'Carte / menu / temps forts',
      'Horaires et accès',
      'CTA réservation ou contact'
    ]
  },
  'site-artiste': {
    idealFor: ['Artistes', 'Photographes', 'Vidéastes', 'Designers', 'Créatifs indépendants'],
    painPoints: [
      "Le talent est là, mais la présence en ligne ne lui donne pas le cadre qu'il mérite.",
      'Les projets sont dispersés entre réseaux, drives et liens envoyés à la volée.',
      "Le site ne transforme pas assez la sensibilité artistique en crédibilité professionnelle."
    ],
    outcomes: [
      'Un portfolio qui pose un univers clair et immédiatement identifiable.',
      'Une page qui centralise les travaux, les projets phares et les demandes entrantes.',
      'Une présence plus premium pour booker, partager, exposer ou collaborer.'
    ],
    pillars: [
      {
        label: 'Signature',
        title: 'Un univers qui se lit vite',
        text: 'Le site doit refléter une identité, pas simplement empiler des images.'
      },
      {
        label: 'Sélection',
        title: 'Les bons projets en avant',
        text: 'On hiérarchise les travaux pour montrer la force, la cohérence et la direction.'
      },
      {
        label: 'Professionnalisation',
        title: 'Un lien qu’on envoie avec confiance',
        text: 'Le portfolio devient un support propre pour booker, pitcher ou convaincre.'
      }
    ],
    flow: [
      {
        label: '01',
        title: 'Signature visuelle et accroche',
        text: 'On ouvre avec une direction claire qui annonce le ton et la personnalité.'
      },
      {
        label: '02',
        title: 'Travaux et projets sélectionnés',
        text: 'On met en scène les pièces qui racontent le mieux votre niveau et votre angle.'
      },
      {
        label: '03',
        title: 'Bio, posture, services éventuels',
        text: 'On ajoute juste ce qu’il faut pour donner du contexte sans casser le rythme.'
      },
      {
        label: '04',
        title: 'Contact, booking, réseaux',
        text: 'On simplifie la demande entrante avec un CTA évident et une sortie propre.'
      }
    ],
    inclusions: [
      'Hero signature ou cover forte',
      'Sélection de projets clés',
      'Bloc bio / posture / démarche',
      'Sections services ou booking si utile',
      'CTA contact bien visible',
      'Réseaux et sortie premium'
    ]
  },
  'site-media-podcast': {
    idealFor: ['Podcasts', 'Médias', 'Formats vidéo', 'Éditorial', 'Contenu de marque'],
    painPoints: [
      'Les contenus existent, mais la marque média manque de structure et de hiérarchie.',
      'Les visiteurs comprennent mal les formats, les épisodes ou les opportunités de collaboration.',
      "La page ne donne pas assez de poids éditorial au projet."
    ],
    outcomes: [
      'Une vitrine média plus nette, plus crédible et plus professionnelle.',
      'Des formats mieux présentés pour faciliter écoute, découverte et partage.',
      'Un support plus sérieux pour les partenaires, invités et sponsors.'
    ],
    pillars: [
      {
        label: 'Éditorial',
        title: 'Un média qui se tient',
        text: 'On donne une vraie structure de marque aux contenus et aux formats.'
      },
      {
        label: 'Lisibilité',
        title: 'Formats et contenus mieux présentés',
        text: 'Le visiteur comprend rapidement quoi regarder, écouter ou explorer.'
      },
      {
        label: 'Business',
        title: 'Partenariats facilités',
        text: 'La page soutient aussi la prise de contact, les invités et les collaborations.'
      }
    ],
    flow: [
      {
        label: '01',
        title: 'Concept et ligne éditoriale',
        text: "On pose l'identité du média et la promesse des formats dès l'entrée."
      },
      {
        label: '02',
        title: 'Formats, émissions, contenus phares',
        text: 'On hiérarchise ce que le visiteur doit découvrir en premier.'
      },
      {
        label: '03',
        title: 'Crédibilité, partenaires, relais',
        text: 'On ajoute les bons signaux de poids éditorial et d’attractivité.'
      },
      {
        label: '04',
        title: 'CTA collaboration ou contact',
        text: 'On ferme avec un parcours simple vers partenariat, invitation ou prise de contact.'
      }
    ],
    inclusions: [
      'Hero média ou podcast',
      'Bloc concept et formats',
      'Mise en avant de contenus phares',
      'Section partenaires / collabs',
      'CTA contact / partenariat',
      'Base évolutive pour archive ou newsletter'
    ]
  },
  'site-association': {
    idealFor: ['Associations', 'Collectifs', 'Projets à impact', 'Culturel', 'Initiatives locales'],
    painPoints: [
      "La mission est forte, mais le site ne l'explique pas assez clairement.",
      "Les actions existent, mais elles sont peu lisibles pour un visiteur extérieur, un partenaire ou un financeur.",
      "La page n'oriente pas assez vers l'engagement, le contact ou le soutien."
    ],
    outcomes: [
      'Une page qui explique la mission, les actions et la valeur du projet avec clarté.',
      'Une présence plus crédible auprès du public, des partenaires et des institutions.',
      'Un support plus efficace pour engager, faire adhérer, contacter ou soutenir.'
    ],
    pillars: [
      {
        label: 'Mission',
        title: 'Expliquer sans diluer',
        text: 'Le visiteur comprend rapidement qui vous êtes, pourquoi vous existez et ce que vous faites.'
      },
      {
        label: 'Impact',
        title: 'Rendre l’action visible',
        text: 'Les programmes, les résultats et les temps forts deviennent concrets et lisibles.'
      },
      {
        label: 'Engagement',
        title: 'Donner une porte d’entrée',
        text: 'Contact, adhésion, bénévolat, ressource ou partenariat: la prochaine étape est claire.'
      }
    ],
    flow: [
      {
        label: '01',
        title: 'Mission et promesse publique',
        text: 'On pose une entrée claire pour comprendre le projet sans jargon institutionnel.'
      },
      {
        label: '02',
        title: 'Actions, programmes, initiatives',
        text: 'On montre ce que vous faites réellement et pour qui.'
      },
      {
        label: '03',
        title: 'Preuves, partenaires, ressources',
        text: 'On renforce la crédibilité et l’utilité de la structure.'
      },
      {
        label: '04',
        title: 'Engagement ou contact',
        text: 'On conclut avec la meilleure porte d’entrée selon votre objectif principal.'
      }
    ],
    inclusions: [
      'Hero mission claire',
      'Bloc actions ou programmes',
      'Section impact / preuves',
      'Partenaires ou relais',
      'CTA engagement / contact',
      'Structure éditoriale rassurante'
    ]
  },
  'site-immobilier-location': {
    idealFor: ['Biens premium', 'Villa', 'Location haut de gamme', 'Conciergerie', 'Agence boutique'],
    painPoints: [
      "Le bien est attractif, mais la page ne le met pas assez en désir ou en confiance.",
      'Les visiteurs doivent chercher les informations essentielles avant de réserver.',
      "Le site manque de structure pour rassurer et filtrer des demandes de qualité."
    ],
    outcomes: [
      'Une page premium qui valorise les atouts du lieu dès les premières secondes.',
      'Un parcours clair entre photos, caractéristiques, localisation et réservation.',
      'Une meilleure confiance avant la demande, le contact ou la réservation.'
    ],
    pillars: [
      {
        label: 'Désir',
        title: 'Le lieu mieux mis en scène',
        text: 'On vend une expérience, pas seulement une liste de caractéristiques.'
      },
      {
        label: 'Confiance',
        title: 'Les bonnes réponses au bon moment',
        text: 'Capacité, équipements, localisation, FAQ et conditions deviennent immédiats.'
      },
      {
        label: 'Qualification',
        title: 'Demandes plus nettes',
        text: 'La page filtre mieux les visiteurs et facilite les prises de contact utiles.'
      }
    ],
    flow: [
      {
        label: '01',
        title: 'Promesse du lieu + visuel fort',
        text: 'On ouvre sur la meilleure facette du bien et sur une invitation claire à réserver.'
      },
      {
        label: '02',
        title: 'Atouts, équipements, capacité',
        text: 'On fait remonter ce qui aide vraiment à se projeter et à comparer.'
      },
      {
        label: '03',
        title: 'Galerie, environnement, localisation',
        text: 'On donne de la matière pour rassurer et déclencher la préférence.'
      },
      {
        label: '04',
        title: 'Réservation ou demande',
        text: 'On conclut avec un tunnel simple pour capter les demandes sérieuses.'
      }
    ],
    inclusions: [
      'Hero premium orienté projection',
      'Bloc atouts du bien',
      'Galerie et éléments de réassurance',
      'Section équipements / localisation',
      'FAQ et infos utiles',
      'CTA réservation ou demande'
    ]
  }
};

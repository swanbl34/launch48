import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        devis: resolve(__dirname, 'devis/index.html'),
        call: resolve(__dirname, 'call/index.html'),
        quiz: resolve(__dirname, 'quiz/index.html'),
        blog: resolve(__dirname, 'blog/index.html'),
        blogRestaurantConversion: resolve(__dirname, 'blog/site-internet-restaurant-sections-conversion/index.html'),
        partenaires: resolve(__dirname, 'partenaires/index.html'),
        offres: resolve(__dirname, 'offres/index.html'),
        siteEvenementiel: resolve(__dirname, 'site-evenementiel/index.html'),
        siteConsultant: resolve(__dirname, 'site-consultant/index.html'),
        siteLancementMarque: resolve(__dirname, 'site-lancement-marque/index.html'),
        siteRestaurant: resolve(__dirname, 'site-restaurant/index.html'),
        siteArtiste: resolve(__dirname, 'site-artiste/index.html'),
        siteMediaPodcast: resolve(__dirname, 'site-media-podcast/index.html'),
        siteAssociation: resolve(__dirname, 'site-association/index.html'),
        siteImmobilierLocation: resolve(__dirname, 'site-immobilier-location/index.html'),
        mentionsLegales: resolve(__dirname, 'mentions-legales.html'),
        politiqueConfidentialite: resolve(__dirname, 'politique-confidentialite.html'),
        cgv: resolve(__dirname, 'cgv.html')
      }
    }
  }
});

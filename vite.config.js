import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { readFileSync } from 'node:fs';
import prerenderVerticals from './vite-plugin-prerender.js';

/* Les en-têtes de sécurité vivent dans vercel.json, donc ils ne s'appliquent
   qu'en production. On les relit ici pour les rejouer en dev : sans ça, une
   ressource bloquée par la CSP ne se découvre qu'après déploiement.
   Une seule source de vérité, celle que Vercel applique vraiment. */
const productionHeaders = () => {
  const config = JSON.parse(readFileSync(resolve(__dirname, 'vercel.json'), 'utf8'));
  const global = config.headers.find((rule) => rule.source === '/(.*)');

  return Object.fromEntries(
    global.headers
      // HSTS n'a aucun sens sur http://localhost et ferait épingler le domaine.
      .filter((h) => h.key !== 'Strict-Transport-Security')
      .map(({ key, value }) => [
        key,
        key === 'Content-Security-Policy'
          ? value
              // Le HMR de Vite parle en WebSocket : sans ça, la CSP le coupe et
              // le rechargement à chaud ne marche plus en local.
              .replace('connect-src ', 'connect-src ws: wss: ')
              // upgrade-insecure-requests forcerait localhost en https.
              .replace('; upgrade-insecure-requests', '')
          : value,
      ]),
  );
};

export default defineConfig({
  /* Écrit le contenu de /offres/ et des 8 pages sectorielles dans le HTML au
     moment du build, au lieu de le laisser construire par le navigateur. */
  plugins: [prerenderVerticals()],

  server: {
    headers: productionHeaders(),
    /* Vite ne lit pas PORT tout seul : sans ça il reste sur 5173, entre en
       conflit avec un autre serveur de dev et choisit un port au hasard que
       l'outillage ne sait pas retrouver. */
    port: Number(process.env.PORT) || 5173,
  },
  preview: { headers: productionHeaders() },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        devis: resolve(__dirname, 'devis/index.html'),
        call: resolve(__dirname, 'call/index.html'),
        quiz: resolve(__dirname, 'quiz/index.html'),
        blog: resolve(__dirname, 'blog/index.html'),
        blogEvenementGuide: resolve(__dirname, 'blog/creer-site-web-evenement-guide/index.html'),
        blogLancerBlogStackRentable: resolve(__dirname, 'blog/lancer-blog-2026-stack-rentable/index.html'),
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

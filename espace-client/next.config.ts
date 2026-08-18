import path from 'node:path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Le repo contient aussi le site vitrine (Vite) et son package-lock à la
  // racine : sans ça, Next remonte d'un cran pour déduire la racine du
  // workspace et trace les mauvais fichiers.
  turbopack: { root: __dirname },
  // Next 16 génère sinon un AGENTS.md et un CLAUDE.md dans ce dossier.
  // Passe à true si tu veux ces fiches d'aide.
  agentRules: false,
  experimental: {
    serverActions: {
      // Les uploads du brief (logos, photos produits) passent par des Server
      // Actions : la limite par défaut de 1 Mo est bien trop basse.
      bodySizeLimit: '25mb',

      // ⚠️ À décommenter UNIQUEMENT si tu sers cette app derrière un rewrite
      // Vercel depuis launch48.fr (option B du README).
      // Next compare l'Origin au Host pour se protéger du CSRF : derrière un
      // proxy, l'Origin vaut launch48.fr alors que le Host est le domaine
      // .vercel.app, et toutes les Server Actions sont rejetées.
      // Inutile si tu utilises un sous-domaine (option A).
      // allowedOrigins: ['launch48.fr', 'www.launch48.fr'],
    },
  },
};

export default nextConfig;

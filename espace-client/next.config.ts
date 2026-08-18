import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Next 16 génère sinon un AGENTS.md et un CLAUDE.md dans ce dossier.
  // Passe à true si tu veux ces fiches d'aide.
  agentRules: false,
  experimental: {
    // Les uploads du brief (logos, photos produits) passent par des Server
    // Actions : la limite par défaut de 1 Mo est bien trop basse.
    serverActions: { bodySizeLimit: '25mb' },
  },
};

export default nextConfig;

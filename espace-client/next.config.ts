import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    // Les uploads du brief (logos, photos produits) passent par des Server
    // Actions : la limite par défaut de 1 Mo est bien trop basse.
    serverActions: { bodySizeLimit: '25mb' },
  },
};

export default nextConfig;

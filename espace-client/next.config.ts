import path from 'node:path';
import type { NextConfig } from 'next';

/**
 * En-têtes de sécurité de l'espace client.
 *
 * L'app manipule des données clients (coordonnées, brief, fichiers) et un
 * back-office : elle ne doit être ni encadrable, ni indexable, ni autorisée à
 * charger quoi que ce soit d'externe. La CSP est plus stricte que celle du site
 * vitrine parce qu'il n'y a ici aucun tiers légitime — pas d'analytics, pas de
 * widget, pas de police distante.
 *
 * `'unsafe-inline'` sur script-src reste nécessaire : Next injecte ses données
 * d'hydratation dans des balises <script> en ligne, et les nonces demandent un
 * middleware qui n'existe pas ici.
 */
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  // Les URLs signées des fichiers clients pointent vers Supabase.
  "connect-src 'self' https://*.supabase.co",
  "media-src 'self' https://*.supabase.co",
  "form-action 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  'upgrade-insecure-requests',
].join('; ');

const SECURITY_HEADERS = [
  { key: 'Content-Security-Policy', value: CSP },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  // Aucun référent sortant : l'URL de l'espace client CONTIENT le token
  // d'accès. Avec la valeur par défaut, un clic vers un site externe le
  // transmettrait dans l'en-tête Referer.
  { key: 'Referrer-Policy', value: 'no-referrer' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()' },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
  // Le back-office et les espaces clients ne doivent jamais être mis en cache
  // par un proxy partagé.
  { key: 'Cache-Control', value: 'no-store, max-age=0' },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,

  async headers() {
    return [{ source: '/:path*', headers: SECURITY_HEADERS }];
  },

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

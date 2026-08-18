import type { MetadataRoute } from 'next';

/** Aucune page de cette app ne doit être indexée. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', disallow: '/' }],
  };
}

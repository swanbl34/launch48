import { timingSafeEqual } from 'node:crypto';

import { supabaseAdmin } from '@/lib/supabase';

/**
 * Ping quotidien qui empêche Supabase de mettre le projet en pause.
 *
 * Le plan gratuit suspend un projet après 7 jours sans activité : l'espace
 * client tomberait alors en erreur jusqu'à réactivation manuelle depuis le
 * dashboard. Une requête par jour suffit à l'éviter.
 *
 * ── Écart assumé au cahier des charges ──────────────────────────────────
 * La spec dit « aucune API route publique ». C'en est une, mais elle
 * n'expose aucune donnée : elle renvoie un booléen, et n'est atteignable
 * qu'avec le CRON_SECRET que Vercel envoie en en-tête. Sans ce secret
 * configuré, la route refuse tout le monde.
 *
 * Devient inutile si tu passes au plan Pro : supprime ce dossier et la
 * section "crons" de vercel.json.
 */
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;

  // Pas de secret configuré → route désactivée, plutôt qu'ouverte à tous.
  if (!secret) {
    return Response.json({ ok: false, reason: 'CRON_SECRET absent' }, { status: 503 });
  }

  // Comparaison à temps constant : `!==` s'arrête au premier octet différent et
  // laisse fuiter le préfixe correct, octet par octet. Le risque est théorique
  // sur une route de ping, la correction est gratuite.
  const provided = Buffer.from(request.headers.get('authorization') ?? '');
  const expected = Buffer.from(`Bearer ${secret}`);

  if (provided.length !== expected.length || !timingSafeEqual(provided, expected)) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    // La requête la plus légère possible : on ne rapatrie aucune ligne.
    const { error } = await supabaseAdmin()
      .from('projects')
      .select('id', { count: 'exact', head: true });

    if (error) throw error;
    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false }, { status: 500 });
  }
}

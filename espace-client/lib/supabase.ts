/**
 * Client Supabase — SERVEUR UNIQUEMENT.
 *
 * On utilise la clé service_role, qui contourne RLS. Ce module ne doit jamais
 * être importé depuis un composant `'use client'` : il n'expose aucune variable
 * NEXT_PUBLIC_, donc un import client provoquerait une erreur de build plutôt
 * qu'une fuite silencieuse — mais la règle reste : import serveur seulement.
 */
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let cached: SupabaseClient | null = null;

export function supabaseAdmin(): SupabaseClient {
  if (cached) return cached;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      'SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY sont requis. Voir .env.example.',
    );
  }

  cached = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  return cached;
}

export const ASSETS_BUCKET = 'client-assets';

/** Durée de validité des URLs signées servies au client. */
export const SIGNED_URL_TTL = 60 * 60; // 1 h

/** Accès en lecture à Supabase. Serveur uniquement. */
import { supabaseAdmin } from './supabase';
import type { Asset, FormAnswers, Project, Task } from './types';
import { DEMO_ANSWERS, DEMO_ASSETS, DEMO_PROJECT, DEMO_TASKS } from './demo-data';

/**
 * Mode démo : sert un projet fictif sans toucher Supabase.
 * Voir lib/demo-data.ts. À n'activer que localement.
 */
const DEMO = process.env.DEMO_MODE === '1';

/** Un uuid v4 mal formé ne doit pas partir en requête : on 404 avant. */
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export const isUuid = (v: string) => UUID_RE.test(v);

export async function getProjectByToken(token: string): Promise<Project | null> {
  if (!isUuid(token)) return null;
  if (DEMO) return token === DEMO_PROJECT.token ? DEMO_PROJECT : null;

  const { data, error } = await supabaseAdmin()
    .from('projects')
    .select('*')
    .eq('token', token)
    .maybeSingle();

  if (error) throw error;
  return (data as Project) ?? null;
}

export async function getProjectById(id: string): Promise<Project | null> {
  if (!isUuid(id)) return null;
  if (DEMO) return id === DEMO_PROJECT.id ? DEMO_PROJECT : null;

  const { data, error } = await supabaseAdmin()
    .from('projects')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return (data as Project) ?? null;
}

export async function listProjects(): Promise<Project[]> {
  if (DEMO) return [DEMO_PROJECT];
  const { data, error } = await supabaseAdmin()
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as Project[];
}

/**
 * Retourne toujours une ligne exploitable, même si le client n'a jamais
 * ouvert le formulaire (la ligne form_answers n'est créée qu'au 1er save).
 */
export async function getFormAnswers(projectId: string): Promise<FormAnswers> {
  if (DEMO) return DEMO_ANSWERS;
  const { data, error } = await supabaseAdmin()
    .from('form_answers')
    .select('*')
    .eq('project_id', projectId)
    .maybeSingle();

  if (error) throw error;

  return (
    (data as FormAnswers) ?? {
      project_id: projectId,
      data: {},
      last_step: 1,
      submitted_at: null,
      updated_at: new Date().toISOString(),
    }
  );
}

export async function getAssets(projectId: string): Promise<Asset[]> {
  if (DEMO) return DEMO_ASSETS;
  const { data, error } = await supabaseAdmin()
    .from('assets')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return (data ?? []) as Asset[];
}

export async function getTasks(projectId: string): Promise<Task[]> {
  if (DEMO) return DEMO_TASKS;
  const { data, error } = await supabaseAdmin()
    .from('tasks')
    .select('*')
    .eq('project_id', projectId)
    .order('order_index', { ascending: true });

  if (error) throw error;
  return (data ?? []) as Task[];
}

/**
 * URL signée temporaire pour télécharger un asset.
 *
 * `download: true` force un `Content-Disposition: attachment` sur la réponse
 * Supabase. C'est ce qui rend inoffensif un fichier interprétable par le
 * navigateur : un SVG ou un HTML déposé par un client peut contenir du
 * JavaScript, et affiché en ligne il s'exécuterait sur le domaine
 * `*.supabase.co` — avec un lien partageable, qui plus est. En pièce jointe,
 * il est téléchargé, jamais rendu.
 *
 * C'est cette garantie qui nous permet d'accepter le SVG à l'upload, alors
 * que c'est le format vectoriel que le brief réclame pour les logos.
 *
 * ⚠️ Si un jour un asset doit être affiché en ligne (aperçu <img>), il faudra
 * un second chemin restreint aux formats non interprétables (png, jpg, webp) —
 * pas retirer ce `download`.
 */
export async function signAssetUrl(storagePath: string): Promise<string | null> {
  if (DEMO) return null;
  const { ASSETS_BUCKET, SIGNED_URL_TTL } = await import('./supabase');

  const { data, error } = await supabaseAdmin()
    .storage.from(ASSETS_BUCKET)
    .createSignedUrl(storagePath, SIGNED_URL_TTL, { download: true });

  if (error) return null;
  return data?.signedUrl ?? null;
}

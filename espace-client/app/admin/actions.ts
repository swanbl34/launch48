'use server';

/**
 * Server Actions de l'admin.
 *
 * Toutes les actions (hors login) commencent par `await guard()`, qui refuse
 * l'accès si le cookie signé est absent ou expiré. Aucune API route publique.
 */
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { ADMIN_COOKIE, checkPassword, createSessionValue, isAdmin, newToken } from '@/lib/auth';
import { seedTasksForPack, type Pack } from '@/lib/task-templates';
import { ASSETS_BUCKET, supabaseAdmin } from '@/lib/supabase';
import type { ProjectStatus, TaskStatus } from '@/lib/types';

/** En mode démo, aucune écriture : les actions renvoient sur la page d'origine. */
const DEMO = process.env.DEMO_MODE === '1';

async function guard() {
  if (!(await isAdmin())) redirect('/admin');
}

/** Bloque une écriture en mode démo et renvoie où il faut. */
function blockIfDemo(back: string) {
  if (DEMO) redirect(back);
}

/* ── Session ─────────────────────────────────────────────────────────────── */

export async function login(formData: FormData) {
  const password = String(formData.get('password') ?? '');

  if (!checkPassword(password)) {
    redirect('/admin?e=1');
  }

  const store = await cookies();
  store.set(ADMIN_COOKIE, createSessionValue(), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 12,
  });

  redirect('/admin');
}

export async function logout() {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
  redirect('/admin');
}

/* ── Projets ─────────────────────────────────────────────────────────────── */

const asPack = (v: string): Pack =>
  v === 'light' || v === 'pousse' ? v : 'standard';

const asStatus = (v: string): ProjectStatus =>
  v === 'production' || v === 'recette' || v === 'livre' ? v : 'onboarding';

/** Crée le projet, génère son token, et seed les tâches du pack choisi. */
export async function createProject(formData: FormData) {
  await guard();
  blockIfDemo('/admin?e=demo');

  const company = String(formData.get('company') ?? '').trim();
  if (!company) redirect('/admin?e=2');

  const pack = asPack(String(formData.get('pack') ?? 'standard'));
  const priceRaw = String(formData.get('price') ?? '').trim();

  const db = supabaseAdmin();

  const { data: project, error } = await db
    .from('projects')
    .insert({
      token: newToken(),
      company,
      contact_name: String(formData.get('contact_name') ?? '').trim() || null,
      email: String(formData.get('email') ?? '').trim() || null,
      phone: String(formData.get('phone') ?? '').trim() || null,
      pack,
      price: priceRaw ? Number(priceRaw.replace(',', '.')) : null,
      status: 'onboarding',
      kickoff_date: String(formData.get('kickoff_date') ?? '') || null,
      delivery_date: String(formData.get('delivery_date') ?? '') || null,
    })
    .select('id')
    .single();

  if (error || !project) throw error ?? new Error('Création impossible');

  await db.from('tasks').insert(seedTasksForPack(pack, project.id));

  revalidatePath('/admin');
  redirect(`/admin/projet/${project.id}?created=1`);
}

export async function updateProject(formData: FormData) {
  await guard();
  blockIfDemo(`/admin/projet/${String(formData.get('id') ?? '')}?e=demo`);

  const id = String(formData.get('id') ?? '');
  const priceRaw = String(formData.get('price') ?? '').trim();

  await supabaseAdmin()
    .from('projects')
    .update({
      company: String(formData.get('company') ?? '').trim(),
      contact_name: String(formData.get('contact_name') ?? '').trim() || null,
      email: String(formData.get('email') ?? '').trim() || null,
      phone: String(formData.get('phone') ?? '').trim() || null,
      pack: asPack(String(formData.get('pack') ?? '')),
      price: priceRaw ? Number(priceRaw.replace(',', '.')) : null,
      status: asStatus(String(formData.get('status') ?? '')),
      kickoff_date: String(formData.get('kickoff_date') ?? '') || null,
      delivery_date: String(formData.get('delivery_date') ?? '') || null,
    })
    .eq('id', id);

  revalidatePath('/admin');
  revalidatePath(`/admin/projet/${id}`);
  redirect(`/admin/projet/${id}?saved=1`);
}

/** Suppression définitive : projet + tâches + réponses + fichiers. */
export async function deleteProject(formData: FormData) {
  await guard();
  blockIfDemo(`/admin/projet/${String(formData.get('id') ?? '')}?e=demo`);

  const id = String(formData.get('id') ?? '');
  const db = supabaseAdmin();

  // Garde-fou : la suppression n'est acceptée que si le nom de l'entreprise
  // a été retapé à l'identique. Vérifié côté serveur, pas en JS.
  const { data: target } = await db
    .from('projects')
    .select('company')
    .eq('id', id)
    .maybeSingle();

  const confirm = String(formData.get('confirm') ?? '').trim();
  if (!target || confirm !== target.company) {
    redirect(`/admin/projet/${id}?e=confirm`);
  }

  const { data: assets } = await db.from('assets').select('storage_path').eq('project_id', id);
  if (assets?.length) {
    await db.storage.from(ASSETS_BUCKET).remove(assets.map((a) => a.storage_path));
  }

  // Les FK sont en ON DELETE CASCADE : une seule suppression suffit.
  await db.from('projects').delete().eq('id', id);

  revalidatePath('/admin');
  redirect('/admin');
}

/**
 * Fait basculer un projet d'une phase à l'autre.
 *
 * Séparé de updateProject : c'est l'action qui ouvre (ou referme) le
 * dashboard de production côté client, elle mérite son propre bouton plutôt
 * que d'être noyée dans le formulaire de la fiche.
 */
export async function setProjectStatus(formData: FormData) {
  await guard();
  const id = String(formData.get('id') ?? '');
  blockIfDemo(`/admin/projet/${id}?e=demo`);

  const status = asStatus(String(formData.get('status') ?? ''));

  await supabaseAdmin().from('projects').update({ status }).eq('id', id);

  revalidatePath('/admin');
  revalidatePath(`/admin/projet/${id}`, 'layout');
  redirect(`/admin/projet/${id}?phase=${status}`);
}

/* ── Tâches ──────────────────────────────────────────────────────────────── */

const asTaskStatus = (v: string): TaskStatus =>
  v === 'doing' || v === 'blocked' || v === 'done' ? v : 'todo';

export async function updateTask(formData: FormData) {
  await guard();
  blockIfDemo(`/admin/projet/${String(formData.get('projectId') ?? '')}/taches?e=demo`);

  const id = String(formData.get('taskId') ?? '');
  const projectId = String(formData.get('projectId') ?? '');
  const status = asTaskStatus(String(formData.get('status') ?? ''));
  const label = String(formData.get('label') ?? '').trim();
  const owner = String(formData.get('owner') ?? '') === 'client' ? 'client' : 'launch48';

  await supabaseAdmin()
    .from('tasks')
    .update({
      status,
      owner,
      done_at: status === 'done' ? new Date().toISOString() : null,
      ...(label ? { label } : {}),
    })
    .eq('id', id)
    .eq('project_id', projectId);

  revalidatePath(`/admin/projet/${projectId}`, 'layout');
  redirect(`/admin/projet/${projectId}/taches`);
}

export async function addTask(formData: FormData) {
  await guard();
  blockIfDemo(`/admin/projet/${String(formData.get('projectId') ?? '')}/taches?e=demo`);

  const projectId = String(formData.get('projectId') ?? '');
  const label = String(formData.get('label') ?? '').trim();
  const phase = String(formData.get('phase') ?? '').trim();
  if (!label || !phase) redirect(`/admin/projet/${projectId}/taches`);

  const db = supabaseAdmin();

  // On place la tâche en fin de sa phase.
  const { data: last } = await db
    .from('tasks')
    .select('order_index')
    .eq('project_id', projectId)
    .eq('phase', phase)
    .order('order_index', { ascending: false })
    .limit(1);

  await db.from('tasks').insert({
    project_id: projectId,
    phase,
    label,
    owner: String(formData.get('owner') ?? '') === 'client' ? 'client' : 'launch48',
    status: 'todo',
    order_index: (last?.[0]?.order_index ?? 0) + 5,
  });

  revalidatePath(`/admin/projet/${projectId}`, 'layout');
  redirect(`/admin/projet/${projectId}/taches`);
}

export async function deleteTask(formData: FormData) {
  await guard();
  blockIfDemo(`/admin/projet/${String(formData.get('projectId') ?? '')}/taches?e=demo`);

  const projectId = String(formData.get('projectId') ?? '');

  await supabaseAdmin()
    .from('tasks')
    .delete()
    .eq('id', String(formData.get('taskId') ?? ''))
    .eq('project_id', projectId);

  revalidatePath(`/admin/projet/${projectId}`, 'layout');
  redirect(`/admin/projet/${projectId}/taches`);
}

/**
 * Réordonnancement : on échange les `order_index` avec le voisin dans la
 * même phase. Simple, et suffisant pour des listes de cette taille.
 */
export async function moveTask(formData: FormData) {
  await guard();
  blockIfDemo(`/admin/projet/${String(formData.get('projectId') ?? '')}/taches?e=demo`);

  const projectId = String(formData.get('projectId') ?? '');
  const taskId = String(formData.get('taskId') ?? '');
  const dir = String(formData.get('dir') ?? 'up');

  const db = supabaseAdmin();

  const { data: task } = await db
    .from('tasks')
    .select('id, phase, order_index')
    .eq('id', taskId)
    .eq('project_id', projectId)
    .maybeSingle();

  if (task) {
    const { data: neighbour } = await db
      .from('tasks')
      .select('id, order_index')
      .eq('project_id', projectId)
      .eq('phase', task.phase)
      [dir === 'up' ? 'lt' : 'gt']('order_index', task.order_index)
      .order('order_index', { ascending: dir !== 'up' })
      .limit(1);

    const swap = neighbour?.[0];
    if (swap) {
      await db.from('tasks').update({ order_index: swap.order_index }).eq('id', task.id);
      await db.from('tasks').update({ order_index: task.order_index }).eq('id', swap.id);
    }
  }

  revalidatePath(`/admin/projet/${projectId}`, 'layout');
  redirect(`/admin/projet/${projectId}/taches`);
}

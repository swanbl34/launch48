'use server';

/**
 * Server Actions de l'admin.
 *
 * Toutes les actions (hors login) commencent par `await guard()`, qui refuse
 * l'accès si le cookie signé est absent ou expiré. Aucune API route publique.
 */
import { revalidatePath } from 'next/cache';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { ADMIN_COOKIE, checkPassword, createSessionValue, isAdmin, newToken } from '@/lib/auth';
import { checkRateLimit, clearFailures, clientKey, recordFailure } from '@/lib/rate-limit';
import { normaliseDepositUrl } from '@/lib/drive';
import { findPack } from '@/lib/packs';
import { rowsFromTemplates, seedTasksForPack, type Pack } from '@/lib/task-templates';
import { ASSETS_BUCKET, supabaseAdmin } from '@/lib/supabase';
import type { ProjectStatus, TaskMilestone, TaskStatus } from '@/lib/types';

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
  /* L'admin n'a qu'un mot de passe partagé : sans limitation de débit, cette
     action est un oracle qu'on peut interroger en boucle. On refuse AVANT de
     vérifier le mot de passe, pour ne pas non plus donner d'indice de temps. */
  const key = clientKey(await headers());
  const verdict = checkRateLimit(key);

  if (!verdict.allowed) {
    redirect(`/admin?e=throttled&s=${verdict.retryAfterSeconds}`);
  }

  const password = String(formData.get('password') ?? '');

  if (!checkPassword(password)) {
    recordFailure(key);
    redirect('/admin?e=1');
  }

  clearFailures(key);

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
      drive_url: normaliseDepositUrl(String(formData.get('drive_url') ?? '')),
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
 * Régénère le token d'un projet, ce qui invalide immédiatement l'ancien lien.
 *
 * Le token de l'URL /espace/[token] est le seul secret qui garde l'espace
 * client : il n'expire pas, et un lien transmis par email peut être transféré,
 * archivé ou fuiter dans un historique. Sans moyen de le changer, l'accès
 * serait définitif. Cette action est le bouton « révoquer » qui manquait.
 *
 * Les données du projet ne bougent pas — seule la porte change de serrure. Il
 * faut donc renvoyer le nouveau lien au client.
 */
export async function rotateToken(formData: FormData) {
  await guard();
  const id = String(formData.get('id') ?? '');
  blockIfDemo(`/admin/projet/${id}?e=demo`);

  // Garde-fou : l'ancien lien cesse de fonctionner sur-le-champ, ça ne doit pas
  // partir sur un clic malheureux. On redemande le nom de l'entreprise, comme
  // pour la suppression, et on le vérifie côté serveur.
  const db = supabaseAdmin();
  const { data: target } = await db
    .from('projects')
    .select('company')
    .eq('id', id)
    .maybeSingle();

  const confirm = String(formData.get('confirm') ?? '').trim();
  if (!target || confirm !== target.company) {
    redirect(`/admin/projet/${id}?e=rotate-confirm`);
  }

  await db.from('projects').update({ token: newToken() }).eq('id', id);

  revalidatePath('/admin');
  revalidatePath(`/admin/projet/${id}`, 'layout');
  redirect(`/admin/projet/${id}?rotated=1`);
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
  v === 'doing' || v === 'blocked' || v === 'review' || v === 'done' ? v : 'todo';

const asMilestone = (v: string): TaskMilestone | null =>
  v === 'ouverture' || v === 'livraison' ? v : null;

const asOwner = (v: string) => (v === 'client' ? 'client' : 'launch48');

/** Champ texte optionnel : vide → null, pour ne pas stocker des chaînes vides. */
const orNull = (fd: FormData, key: string, max = 4000): string | null => {
  const v = String(fd.get(key) ?? '').trim();
  return v ? v.slice(0, max) : null;
};

/**
 * Les horodatages dérivés du statut.
 *
 * `done_at` marque la validation, `submitted_at` le moment où le client a
 * déclaré avoir rendu. Renvoyer une tâche à `todo` efface les deux : sinon
 * elle réapparaîtrait chez le client avec un « rendu le 18 août » qui ne veut
 * plus rien dire. Passer à `done` depuis `review` conserve `submitted_at`,
 * c'est la trace de qui a bougé en premier.
 */
function stampsFor(
  status: TaskStatus,
  previous: { submitted_at: string | null; done_at: string | null },
) {
  const now = new Date().toISOString();
  // `?? now` et non `now` : corriger une faute de frappe sur une tâche déjà
  // validée ne doit pas déplacer sa date de validation au jour même.
  if (status === 'done') {
    return { done_at: previous.done_at ?? now, submitted_at: previous.submitted_at };
  }
  if (status === 'review') {
    return { done_at: null, submitted_at: previous.submitted_at ?? now };
  }
  return { done_at: null, submitted_at: null };
}

export async function updateTask(formData: FormData) {
  await guard();
  const projectId = String(formData.get('projectId') ?? '');
  blockIfDemo(`/admin/projet/${projectId}/taches?e=demo`);

  const id = String(formData.get('taskId') ?? '');
  const status = asTaskStatus(String(formData.get('status') ?? ''));
  const label = String(formData.get('label') ?? '').trim();
  const phase = String(formData.get('phase') ?? '').trim();

  const db = supabaseAdmin();

  // On relit la tâche pour connaître son submitted_at, et pour vérifier au
  // passage qu'elle appartient bien à ce projet.
  const { data: current } = await db
    .from('tasks')
    .select('id, submitted_at, done_at')
    .eq('id', id)
    .eq('project_id', projectId)
    .maybeSingle();

  if (!current) redirect(`/admin/projet/${projectId}/taches`);

  const driveRaw = String(formData.get('drive_url') ?? '').trim();

  await db
    .from('tasks')
    .update({
      status,
      owner: asOwner(String(formData.get('owner') ?? '')),
      description: orNull(formData, 'description'),
      deliverable: orNull(formData, 'deliverable', 600),
      drive_url: driveRaw ? normaliseDepositUrl(driveRaw) : null,
      due_date: String(formData.get('due_date') ?? '') || null,
      milestone: asMilestone(String(formData.get('milestone') ?? '')),
      ...stampsFor(status, {
        submitted_at: current.submitted_at ?? null,
        done_at: current.done_at ?? null,
      }),
      ...(label ? { label } : {}),
      ...(phase ? { phase } : {}),
    })
    .eq('id', id)
    .eq('project_id', projectId);

  revalidatePath(`/admin/projet/${projectId}`, 'layout');
  redirect(`/admin/projet/${projectId}/taches?saved=1#tache-${id}`);
}

export async function addTask(formData: FormData) {
  await guard();
  const projectId = String(formData.get('projectId') ?? '');
  blockIfDemo(`/admin/projet/${projectId}/taches?e=demo`);

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

  const driveRaw = String(formData.get('drive_url') ?? '').trim();

  await db.from('tasks').insert({
    project_id: projectId,
    phase,
    label,
    owner: asOwner(String(formData.get('owner') ?? '')),
    status: 'todo',
    order_index: (last?.[0]?.order_index ?? 0) + 5,
    description: orNull(formData, 'description'),
    deliverable: orNull(formData, 'deliverable', 600),
    drive_url: driveRaw ? normaliseDepositUrl(driveRaw) : null,
    due_date: String(formData.get('due_date') ?? '') || null,
    milestone: asMilestone(String(formData.get('milestone') ?? '')),
  });

  revalidatePath(`/admin/projet/${projectId}`, 'layout');
  redirect(`/admin/projet/${projectId}/taches?ajout=1`);
}

/**
 * Importe un lot de tâches préparé dans lib/packs/.
 *
 * Idempotent par intitulé : on ne crée que ce qui manque. C'est ce qui permet
 * d'enrichir un lot dans le code et de le réimporter sans se retrouver avec
 * deux fois « Photographier chaque pièce ».
 */
export async function importTaskPack(formData: FormData) {
  await guard();
  const projectId = String(formData.get('projectId') ?? '');
  blockIfDemo(`/admin/projet/${projectId}/taches?e=demo`);

  const pack = findPack(String(formData.get('pack') ?? ''));
  if (!pack) redirect(`/admin/projet/${projectId}/taches?e=lot`);

  const db = supabaseAdmin();

  const { data: existing } = await db
    .from('tasks')
    .select('label, order_index')
    .eq('project_id', projectId);

  const seen = new Set((existing ?? []).map((t) => normaliseLabel(t.label)));
  const maxIndex = (existing ?? []).reduce((m, t) => Math.max(m, t.order_index ?? 0), 0);

  const fresh = pack.tasks.filter((t) => !seen.has(normaliseLabel(t.label)));

  if (fresh.length === 0) {
    redirect(`/admin/projet/${projectId}/taches?importe=0`);
  }

  await db.from('tasks').insert(rowsFromTemplates(fresh, projectId, maxIndex));

  revalidatePath(`/admin/projet/${projectId}`, 'layout');
  redirect(`/admin/projet/${projectId}/taches?importe=${fresh.length}`);
}

/** Comparaison d'intitulés tolérante à la casse, aux accents et aux espaces. */
function normaliseLabel(label: string): string {
  return label
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

/**
 * Validation en un clic depuis la file « à valider ».
 *
 * `decision = ok` valide, `decision = retour` renvoie la tâche au client. Le
 * second cas efface `submitted_at` : la tâche redevient franchement à faire,
 * plutôt que de rester dans un entre-deux illisible côté client.
 */
export async function reviewTask(formData: FormData) {
  await guard();
  const projectId = String(formData.get('projectId') ?? '');
  blockIfDemo(`/admin/projet/${projectId}/taches?e=demo`);

  const id = String(formData.get('taskId') ?? '');
  const accepted = String(formData.get('decision') ?? '') === 'ok';
  const status: TaskStatus = accepted ? 'done' : 'todo';

  const db = supabaseAdmin();
  const { data: current } = await db
    .from('tasks')
    .select('submitted_at, done_at')
    .eq('id', id)
    .eq('project_id', projectId)
    .maybeSingle();

  if (current) {
    await db
      .from('tasks')
      .update({
        status,
        ...stampsFor(status, {
          submitted_at: current.submitted_at ?? null,
          done_at: current.done_at ?? null,
        }),
      })
      .eq('id', id)
      .eq('project_id', projectId);
  }

  revalidatePath(`/admin/projet/${projectId}`, 'layout');
  redirect(`/admin/projet/${projectId}/taches?${accepted ? 'valide' : 'renvoye'}=1`);
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
  redirect(`/admin/projet/${projectId}/taches#tache-${taskId}`);
}

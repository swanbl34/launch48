'use server';

/**
 * Server Actions de l'espace client.
 *
 * Règle de sécurité commune : chaque action reçoit le token depuis un champ
 * caché du formulaire et le résout en projet. Un token inconnu → notFound().
 * Aucune action ne fait confiance à un project_id envoyé par le client.
 */
import { randomUUID } from 'node:crypto';
import { revalidatePath } from 'next/cache';
import { notFound, redirect } from 'next/navigation';

import { TOTAL_STEPS, UNKNOWN_KEY, fieldsForStep, isFileField } from '@/lib/brief-schema';
import { readStepAnswers } from '@/lib/brief-values';
import { getFormAnswers, getProjectByToken } from '@/lib/data';
import { ASSETS_BUCKET, supabaseAdmin } from '@/lib/supabase';
import type { Project } from '@/lib/types';

/** Taille max par fichier. Doit rester ≤ bodySizeLimit de next.config.ts. */
const MAX_FILE_BYTES = 20 * 1024 * 1024; // 20 Mo

/**
 * En mode démo (DEMO_MODE=1) il n'y a pas de base : les actions se contentent
 * de naviguer, sans rien écrire. L'interface reste entièrement parcourable.
 */
const DEMO = process.env.DEMO_MODE === '1';

async function requireProject(token: string): Promise<Project> {
  const project = await getProjectByToken(token);
  if (!project) notFound();
  return project;
}

/** Nettoie un nom de fichier pour un chemin de stockage sûr. */
function safeName(name: string): string {
  return (
    name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9._-]/g, '-')
      .replace(/-+/g, '-')
      .slice(-100) || 'fichier'
  );
}

/** Upload les fichiers d'une étape et enregistre les lignes `assets`. */
async function handleUploads(project: Project, step: number, fd: FormData) {
  const db = supabaseAdmin();

  for (const field of fieldsForStep(step)) {
    if (!isFileField(field)) continue;

    const incoming = fd
      .getAll(field.key)
      .filter((v): v is File => v instanceof File && v.size > 0 && v.size <= MAX_FILE_BYTES);

    if (incoming.length === 0) continue;

    // Un champ `file` (singulier) ne garde qu'un fichier : on remplace.
    if (field.type === 'file') {
      const { data: old } = await db
        .from('assets')
        .select('id, storage_path')
        .eq('project_id', project.id)
        .eq('field_key', field.key);

      if (old?.length) {
        await db.storage.from(ASSETS_BUCKET).remove(old.map((a) => a.storage_path));
        await db.from('assets').delete().in('id', old.map((a) => a.id));
      }
    }

    const files = field.type === 'file' ? incoming.slice(0, 1) : incoming;

    for (const file of files) {
      const path = `${project.id}/${field.key}/${randomUUID()}-${safeName(file.name)}`;

      const { error } = await db.storage
        .from(ASSETS_BUCKET)
        .upload(path, file, { contentType: file.type || 'application/octet-stream', upsert: false });

      if (error) continue; // un fichier qui échoue ne doit pas perdre l'étape

      await db.from('assets').insert({
        project_id: project.id,
        field_key: field.key,
        file_name: file.name,
        storage_path: path,
        size: file.size,
      });
    }
  }
}

/**
 * Action principale du brief : enregistre l'étape courante, puis navigue.
 *
 * L'intention est portée par le bouton cliqué (`_intent`) :
 *   save | next | prev | goto-<n> | submit
 * Tout passe par un POST + redirect : le formulaire fonctionne sans JS.
 */
export async function saveBriefStep(formData: FormData) {
  const token = String(formData.get('token') ?? '');
  const project = await requireProject(token);

  // L'écran de récap est l'étape virtuelle TOTAL_STEPS + 1 : il ne porte
  // aucun champ. Clamper à TOTAL_STEPS ferait lire les champs de l'étape 6
  // dans un formulaire qui ne les contient pas — et les écraserait par du vide.
  const step = Math.min(Math.max(Number(formData.get('step')) || 1, 1), TOTAL_STEPS + 1);
  const isRecap = step > TOTAL_STEPS;
  const intent = String(formData.get('_intent') ?? 'save');

  const existing = await getFormAnswers(project.id);
  const merged = isRecap ? existing.data : { ...existing.data, ...readStepAnswers(step, formData) };

  if (!isRecap) await handleUploads(project, step, formData);

  // Étape suivante à rouvrir au prochain accès.
  const MAX = TOTAL_STEPS + 1; // récap inclus
  let target = step;
  if (intent === 'next') target = Math.min(step + 1, MAX);
  else if (intent === 'prev') target = Math.max(step - 1, 1);
  else if (intent.startsWith('goto-')) {
    const n = Number(intent.slice(5));
    if (Number.isFinite(n)) target = Math.min(Math.max(n, 1), MAX);
  }

  const submitting = intent === 'submit';

  if (DEMO) {
    if (submitting) redirect(`/espace/${token}?brief=valide`);
    redirect(`/espace/${token}/brief?step=${target}`);
  }

  await supabaseAdmin()
    .from('form_answers')
    .upsert(
      {
        project_id: project.id,
        data: merged,
        last_step: target,
        updated_at: new Date().toISOString(),
        // On ne réécrit submitted_at que lors d'une validation explicite :
        // après validation, le brief reste modifiable sans perdre la date.
        ...(submitting ? { submitted_at: existing.submitted_at ?? new Date().toISOString() } : {}),
      },
      { onConflict: 'project_id' },
    );

  revalidatePath(`/espace/${token}`);
  revalidatePath(`/espace/${token}/brief`);

  if (submitting) redirect(`/espace/${token}?brief=valide`);
  if (intent === 'save') redirect(`/espace/${token}/brief?step=${target}&saved=1`);
  redirect(`/espace/${token}/brief?step=${target}`);
}

/** Suppression d'un fichier déjà envoyé. */
export async function deleteAsset(formData: FormData) {
  const token = String(formData.get('token') ?? '');
  const assetId = String(formData.get('assetId') ?? '');
  const step = String(formData.get('step') ?? '1');
  const project = await requireProject(token);

  if (DEMO) redirect(`/espace/${token}/brief?step=${step}`);

  const db = supabaseAdmin();

  // On filtre sur project_id : impossible de supprimer l'asset d'un autre projet.
  const { data: asset } = await db
    .from('assets')
    .select('id, storage_path')
    .eq('id', assetId)
    .eq('project_id', project.id)
    .maybeSingle();

  if (asset) {
    await db.storage.from(ASSETS_BUCKET).remove([asset.storage_path]);
    await db.from('assets').delete().eq('id', asset.id);
  }

  revalidatePath(`/espace/${token}/brief`);
  redirect(`/espace/${token}/brief?step=${step}`);
}

/** Le client coche/décoche une tâche dont il est le porteur. */
export async function toggleClientTask(formData: FormData) {
  const token = String(formData.get('token') ?? '');
  const taskId = String(formData.get('taskId') ?? '');
  const project = await requireProject(token);

  if (DEMO) redirect(`/espace/${token}`);

  const db = supabaseAdmin();

  // owner = 'client' est vérifié en base : le client ne peut pas cocher
  // une tâche Launch48 en forgeant un id.
  const { data: task } = await db
    .from('tasks')
    .select('id, status')
    .eq('id', taskId)
    .eq('project_id', project.id)
    .eq('owner', 'client')
    .maybeSingle();

  if (task) {
    const done = task.status === 'done';
    await db
      .from('tasks')
      .update({
        status: done ? 'todo' : 'done',
        done_at: done ? null : new Date().toISOString(),
      })
      .eq('id', task.id);
  }

  revalidatePath(`/espace/${token}`);
  redirect(`/espace/${token}`);
}

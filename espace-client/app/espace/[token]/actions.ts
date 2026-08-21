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
import {
  checkFile,
  checkProjectQuota,
  type RejectionReason,
} from '@/lib/upload-guard';
import type { Project } from '@/lib/types';

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

/** Nombre et volume déjà stockés pour ce projet, tous champs confondus. */
async function projectUsage(projectId: string): Promise<{ count: number; bytes: number }> {
  const { data } = await supabaseAdmin()
    .from('assets')
    .select('size')
    .eq('project_id', projectId);

  return {
    count: data?.length ?? 0,
    bytes: (data ?? []).reduce((sum, row) => sum + (row.size ?? 0), 0),
  };
}

/**
 * Upload les fichiers d'une étape et enregistre les lignes `assets`.
 *
 * Chaque fichier passe par `checkFile` (format, taille) puis par le plafond du
 * projet. Un fichier refusé ne fait pas échouer l'étape : les réponses texte
 * sont enregistrées quand même, et les motifs de rejet sont renvoyés à
 * l'appelant pour être affichés. Perdre une étape entière de saisie parce
 * qu'un fichier était au mauvais format serait la pire des réponses.
 */
async function handleUploads(
  project: Project,
  step: number,
  fd: FormData,
): Promise<RejectionReason[]> {
  const db = supabaseAdmin();
  const rejections: RejectionReason[] = [];

  // Compteurs tenus à jour au fil des écritures : sans ça, un envoi de 50
  // fichiers en une fois passerait le plafond, chaque fichier voyant l'état
  // d'avant la requête.
  let usage = await projectUsage(project.id);

  for (const field of fieldsForStep(step)) {
    if (!isFileField(field)) continue;

    const submitted = fd.getAll(field.key).filter((v): v is File => v instanceof File);
    if (submitted.length === 0) continue;

    // Un champ vide arrive comme un File de 0 octet : ce n'est pas un rejet,
    // c'est simplement l'absence de fichier.
    const incoming: File[] = [];
    for (const file of submitted) {
      if (file.size === 0) continue;

      const verdict = checkFile(file);
      if (verdict.ok) incoming.push(file);
      else rejections.push(verdict.reason);
    }

    if (incoming.length === 0) continue;

    // Un champ `file` (singulier) ne garde qu'un fichier : on remplace.
    if (field.type === 'file') {
      const { data: old } = await db
        .from('assets')
        .select('id, storage_path, size')
        .eq('project_id', project.id)
        .eq('field_key', field.key);

      if (old?.length) {
        await db.storage.from(ASSETS_BUCKET).remove(old.map((a) => a.storage_path));
        await db.from('assets').delete().in('id', old.map((a) => a.id));

        // Le remplacement libère de la place : sans cette reprise, remplacer un
        // logo dix fois consommerait dix fois le quota.
        usage = {
          count: usage.count - old.length,
          bytes: usage.bytes - old.reduce((sum, a) => sum + (a.size ?? 0), 0),
        };
      }
    }

    const files = field.type === 'file' ? incoming.slice(0, 1) : incoming;

    for (const file of files) {
      const quota = checkProjectQuota(usage, file.size);
      if (!quota.ok) {
        rejections.push(quota.reason);
        continue;
      }

      const path = `${project.id}/${field.key}/${randomUUID()}-${safeName(file.name)}`;

      const { error } = await db.storage
        .from(ASSETS_BUCKET)
        .upload(path, file, {
          contentType: file.type || 'application/octet-stream',
          upsert: false,
        });

      if (error) continue; // un fichier qui échoue ne doit pas perdre l'étape

      await db.from('assets').insert({
        project_id: project.id,
        field_key: field.key,
        file_name: file.name,
        storage_path: path,
        size: file.size,
      });

      usage = { count: usage.count + 1, bytes: usage.bytes + file.size };
    }
  }

  return rejections;
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

  const rejections = isRecap ? [] : await handleUploads(project, step, formData);

  /* Motifs de rejet dédoublonnés, à joindre à l'URL de retour. On ne remonte
     que le motif, pas le nom du fichier : c'est ce qui dit quoi faire, et ça
     tient dans une URL. */
  const rejectionParam = rejections.length
    ? `&rejets=${encodeURIComponent([...new Set(rejections)].join(','))}`
    : '';

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
  revalidatePath(`/espace/${token}/suivi`);
  revalidatePath(`/espace/${token}/brief`);

  /* Un rejet de fichier ramène toujours sur l'étape, même si l'intention était
     de valider : sinon le client quitterait le brief sans savoir qu'un de ses
     fichiers n'est pas passé. */
  if (rejectionParam) {
    redirect(`/espace/${token}/brief?step=${step}&saved=1${rejectionParam}`);
  }

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

  if (DEMO) redirect(`/espace/${token}/suivi`);

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

  revalidatePath(`/espace/${token}/suivi`);
  redirect(`/espace/${token}/suivi`);
}

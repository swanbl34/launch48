import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

import { Bar } from '@/app/_components/Bar';
import { CopyButton } from '@/app/_components/CopyButton';
import { Input, Select } from '@/app/admin/_components';
import { isAdmin } from '@/lib/auth';
import { getAssets, getFormAnswers, getProjectById, getTasks } from '@/lib/data';
import { formatDate } from '@/lib/format';
import { globalProgress } from '@/lib/progress';
import { computeMissing } from '@/lib/missing';
import { PACKS } from '@/lib/task-templates';
import { STATUS_LABELS, isOnboarding } from '@/lib/types';
import { deleteProject, setProjectStatus, updateProject } from '../../actions';

export const metadata: Metadata = { robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

/** Onglet « Fiche » : lien client, informations du projet, suppression. */
export default async function FichePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string; created?: string; e?: string; phase?: string }>;
}) {
  if (!(await isAdmin())) notFound();

  const { id } = await params;
  const sp = await searchParams;

  const project = await getProjectById(id);
  if (!project) notFound();

  const [tasks, answers, assets] = await Promise.all([
    getTasks(project.id),
    getFormAnswers(project.id),
    getAssets(project.id),
  ]);
  const { blocking, deferred } = computeMissing(answers.data, assets, tasks);
  const onboarding = isOnboarding(project.status);

  const h = await headers();
  const host = h.get('x-forwarded-host') ?? h.get('host') ?? 'localhost:3000';
  const proto = h.get('x-forwarded-proto') ?? (host.startsWith('localhost') ? 'http' : 'https');
  const espaceUrl = `${proto}://${host}/espace/${project.token}`;

  return (
    <div className="stack--lg">
      {sp.created ? <div className="banner">Projet créé, tâches initialisées.</div> : null}
      {sp.saved ? <div className="banner">Enregistré.</div> : null}
      {sp.e === 'confirm' ? (
        <div className="banner banner--error">
          Suppression annulée : le nom saisi ne correspond pas.
        </div>
      ) : null}
      {sp.e === 'demo' ? (
        <div className="banner banner--error">
          Mode démo (DEMO_MODE=1) : lecture seule, aucune écriture n&apos;est enregistrée.
        </div>
      ) : null}

      {sp.phase ? (
        <div className="banner">
          Phase mise à jour : <strong>{STATUS_LABELS[project.status]}</strong>.
        </div>
      ) : null}

      <Bar value={globalProgress(tasks)} thin />

      {/* ── Pilotage de la phase ─────────────────────────────────────────── */}
      <section className={onboarding ? 'card stack' : 'card card--ok stack'} style={{ gap: '0.8rem' }}>
        <div className="row row--between">
          <span className="section-title">Phase</span>
          <span className={onboarding ? 'pill pill--warn' : 'pill pill--ok'}>
            {STATUS_LABELS[project.status]}
          </span>
        </div>

        {onboarding ? (
          <>
            <h2>Le client ne voit que son questionnaire</h2>
            <p className="small muted">
              Timeline et tâches lui sont masquées tant que tu n&apos;as pas ouvert la
              production. Passe à l&apos;étape suivante quand tu estimes avoir tout reçu.
            </p>

            <div className="row">
              {blocking.length > 0 ? (
                <span className="pill pill--danger">{blocking.length} éléments manquants</span>
              ) : (
                <span className="pill pill--ok">aucun élément manquant</span>
              )}
              {deferred.length > 0 ? (
                <span className="pill pill--warn">{deferred.length} à préciser</span>
              ) : null}
              <a className="btn btn--ghost btn--small" href={`/admin/projet/${project.id}/brief`}>
                Voir le brief
              </a>
            </div>

            {blocking.length > 0 ? (
              <p className="tiny muted">
                Tu peux passer en production malgré tout : les éléments manquants resteront
                affichés dans l&apos;espace du client.
              </p>
            ) : null}

            <form action={setProjectStatus}>
              <input type="hidden" name="id" value={project.id} />
              <input type="hidden" name="status" value="production" />
              <button className="btn" type="submit">
                Ouvrir la production →
              </button>
            </form>
          </>
        ) : (
          <>
            <h2>Le dashboard complet est ouvert</h2>
            <p className="small muted">
              Le client voit l&apos;avancement, la timeline et ses tâches. Change le statut
              depuis le formulaire ci-dessous, ou reviens à l&apos;onboarding pour tout lui
              masquer à nouveau.
            </p>
            <form action={setProjectStatus}>
              <input type="hidden" name="id" value={project.id} />
              <input type="hidden" name="status" value="onboarding" />
              <button className="btn btn--ghost btn--small" type="submit">
                ← Revenir à l&apos;onboarding
              </button>
            </form>
          </>
        )}
      </section>

      <section className="card card--accent stack" style={{ gap: '0.6rem' }}>
        <span className="section-title">Lien de l&apos;espace client</span>
        <code className="small" style={{ overflowWrap: 'anywhere' }}>
          {espaceUrl}
        </code>
        <div className="row">
          <CopyButton value={espaceUrl} />
          <a
            className="btn btn--ghost btn--small"
            href={`/espace/${project.token}`}
            target="_blank"
            rel="noreferrer"
          >
            Ouvrir
          </a>
        </div>
      </section>

      <section className="card stack" style={{ gap: '0.9rem' }}>
        <h2>Informations</h2>
        <form action={updateProject} className="stack" style={{ gap: '0.9rem' }}>
          <input type="hidden" name="id" value={project.id} />
          <div className="grid-2">
            <Input name="company" label="Entreprise" defaultValue={project.company} required />
            <Input
              name="contact_name"
              label="Interlocuteur"
              defaultValue={project.contact_name ?? ''}
            />
            <Input name="email" label="Email" type="email" defaultValue={project.email ?? ''} />
            <Input name="phone" label="Téléphone" type="tel" defaultValue={project.phone ?? ''} />
            <Select name="pack" label="Pack" defaultValue={project.pack} options={[...PACKS]} />
            <Select
              name="status"
              label="Statut du projet"
              defaultValue={project.status}
              options={Object.keys(STATUS_LABELS)}
            />
            <Input name="price" label="Prix (€)" defaultValue={project.price?.toString() ?? ''} />
            <Input
              name="kickoff_date"
              label="Démarrage"
              type="date"
              defaultValue={project.kickoff_date ?? ''}
            />
            <Input
              name="delivery_date"
              label="Livraison estimée"
              type="date"
              defaultValue={project.delivery_date ?? ''}
            />
          </div>
          <div>
            <button className="btn" type="submit">
              Enregistrer
            </button>
          </div>
        </form>
        <p className="tiny muted">Créé le {formatDate(project.created_at)}</p>
      </section>

      <section className="card card--danger stack" style={{ gap: '0.6rem' }}>
        <h2>Supprimer</h2>
        <p className="small muted">
          Supprime le projet, ses réponses, ses tâches et ses fichiers. Irréversible. Tape{' '}
          <strong>{project.company}</strong> pour confirmer.
        </p>
        <form action={deleteProject} className="row" style={{ alignItems: 'flex-end' }}>
          <input type="hidden" name="id" value={project.id} />
          <div className="field" style={{ flex: '1 1 14rem' }}>
            <label className="field__label tiny" htmlFor="confirm">
              Nom de l&apos;entreprise
            </label>
            <input id="confirm" name="confirm" type="text" required autoComplete="off" />
          </div>
          <button className="btn btn--ghost btn--small btn--danger" type="submit">
            Supprimer définitivement
          </button>
        </form>
      </section>
    </div>
  );
}

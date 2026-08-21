import { headers } from 'next/headers';
import type { Metadata } from 'next';

import { AppBar } from '@/app/_components/AppBar';
import { Bar } from '@/app/_components/Bar';
import { Brand } from '@/app/_components/Brand';
import { CopyButton } from '@/app/_components/CopyButton';
import { isAdmin } from '@/lib/auth';
import { getAssets, getFormAnswers, getTasks, listProjects } from '@/lib/data';
import { formatDate, formatDateTime, formatPrice } from '@/lib/format';
import { computeMissing } from '@/lib/missing';
import { globalProgress } from '@/lib/progress';
import { PACKS } from '@/lib/task-templates';
import { STATUS_LABELS } from '@/lib/types';
import { createProject, login, logout } from './actions';

export const metadata: Metadata = { robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

/** Base absolue pour construire les liens /espace/<token> copiables. */
async function baseUrl(): Promise<string> {
  const h = await headers();
  const host = h.get('x-forwarded-host') ?? h.get('host') ?? 'localhost:3000';
  const proto = h.get('x-forwarded-proto') ?? (host.startsWith('localhost') ? 'http' : 'https');
  return `${proto}://${host}`;
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ e?: string; s?: string }>;
}) {
  const { e, s } = await searchParams;

  if (!(await isAdmin())) return <LoginScreen error={e} retryAfter={s} />;

  const projects = await listProjects();
  const base = await baseUrl();

  // Un projet = 4 lectures. Le volume reste petit (quelques dizaines de
  // projets) : on parallélise et on s'en tient là.
  const rows = await Promise.all(
    projects.map(async (p) => {
      const [answers, assets, tasks] = await Promise.all([
        getFormAnswers(p.id),
        getAssets(p.id),
        getTasks(p.id),
      ]);
      const { blocking, deferred, other } = computeMissing(answers.data, assets, tasks);
      return {
        project: p,
        progress: globalProgress(tasks),
        missing: blocking.length + other.length,
        deferred: deferred.length,
        updatedAt: answers.updated_at,
      };
    }),
  );

  return (
    <main className="shell shell--wide stack--lg">
      <AppBar
        brandHref="/admin"
        meta={<span className="pill">{projects.length} projets</span>}
        action={
          <form action={logout}>
            <button className="btn btn--ghost btn--small" type="submit">
              Déconnexion
            </button>
          </form>
        }
      />

      <h1>Projets</h1>

      {e === 'demo' ? (
        <div className="banner banner--error">
          Mode démo (DEMO_MODE=1) : lecture seule, aucune écriture n&apos;est enregistrée.
        </div>
      ) : null}

      <section className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Client</th>
              <th>Pack</th>
              <th>Statut</th>
              <th>Avancement</th>
              <th>Manquants</th>
              <th>Dernier update</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {rows.map(({ project, progress, missing, deferred, updatedAt }) => (
              <tr key={project.id}>
                <td data-label="Client">
                  <a href={`/admin/projet/${project.id}`}>
                    <strong>{project.company}</strong>
                  </a>
                  {project.contact_name ? (
                    <div className="tiny muted">{project.contact_name}</div>
                  ) : null}
                </td>
                <td data-label="Pack">
                  <span className="pill tiny">{project.pack}</span>
                </td>
                <td data-label="Statut">
                  <span className="pill tiny">{STATUS_LABELS[project.status]}</span>
                </td>
                <td data-label="Avancement" style={{ minWidth: '7rem' }}>
                  <div className="row" style={{ gap: '0.5rem', flexWrap: 'nowrap' }}>
                    <span style={{ flex: 1 }}>
                      <Bar value={progress} thin />
                    </span>
                    <span className="tiny muted">{progress}%</span>
                  </div>
                </td>
                <td data-label="Manquants">
                  <div className="row" style={{ gap: '0.25rem', flexWrap: 'nowrap' }}>
                    {missing > 0 ? (
                      <span className="pill pill--danger tiny">{missing}</span>
                    ) : (
                      <span className="pill pill--ok tiny">0</span>
                    )}
                    {deferred > 0 ? (
                      <span className="pill pill--warn tiny" title="Marqués « je ne sais pas encore »">
                        +{deferred}
                      </span>
                    ) : null}
                  </div>
                </td>
                <td className="tiny muted" data-label="Dernier update">
                  {formatDateTime(updatedAt)}
                </td>
                <td data-label="Lien client">
                  <CopyButton value={`${base}/espace/${project.token}`} label="Lien" />
                </td>
              </tr>
            ))}

            {rows.length === 0 ? (
              <tr>
                <td colSpan={7} className="muted small">
                  Aucun projet. Crée le premier ci-dessous.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </section>

      {/* ── Création ────────────────────────────────────────────────────── */}
      <section className="card stack" style={{ gap: '0.9rem' }} id="nouveau">
        <h2>Nouveau projet</h2>
        <p className="small muted">
          Le token est généré automatiquement et les tâches du pack sont créées d&apos;office.
        </p>

        <form action={createProject} className="stack" style={{ gap: '0.9rem' }}>
          <div className="grid-2">
            <div className="field">
              <label className="field__label" htmlFor="company">
                Entreprise
              </label>
              <input id="company" name="company" type="text" required />
            </div>
            <div className="field">
              <label className="field__label" htmlFor="contact_name">
                Interlocuteur
              </label>
              <input id="contact_name" name="contact_name" type="text" />
            </div>
            <div className="field">
              <label className="field__label" htmlFor="email">
                Email
              </label>
              <input id="email" name="email" type="email" />
            </div>
            <div className="field">
              <label className="field__label" htmlFor="phone">
                Téléphone
              </label>
              <input id="phone" name="phone" type="tel" />
            </div>
            <div className="field">
              <label className="field__label" htmlFor="pack">
                Pack
              </label>
              <select id="pack" name="pack" defaultValue="standard">
                {PACKS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label className="field__label" htmlFor="price">
                Prix (€)
              </label>
              <input id="price" name="price" type="text" inputMode="decimal" />
            </div>
            <div className="field">
              <label className="field__label" htmlFor="kickoff_date">
                Démarrage
              </label>
              <input id="kickoff_date" name="kickoff_date" type="date" />
            </div>
            <div className="field">
              <label className="field__label" htmlFor="delivery_date">
                Livraison estimée
              </label>
              <input id="delivery_date" name="delivery_date" type="date" />
            </div>
          </div>

          <div>
            <button className="btn" type="submit">
              Créer le projet
            </button>
          </div>
        </form>
      </section>

      <p className="tiny muted">
        Créé le {formatDate(projects.at(-1)?.created_at)} pour le plus ancien ·{' '}
        {formatPrice(rows.reduce((acc, r) => acc + (r.project.price ?? 0), 0))} au total
      </p>
    </main>
  );
}

function LoginScreen({ error, retryAfter }: { error?: string; retryAfter?: string }) {
  /* Combien de temps reste-t-il avant de pouvoir réessayer. Affiché en minutes
     pleines : à la seconde près, ça donne l'impression qu'on peut retenter
     tout de suite. */
  const minutes = Math.max(1, Math.ceil(Number(retryAfter ?? 0) / 60));
  return (
    <main className="shell" style={{ maxWidth: '26rem' }}>
      <div className="stack--lg" style={{ paddingTop: '14vh' }}>
        <Brand href="https://launch48.fr" />
        <h1>Admin</h1>

        {error === '1' ? <div className="banner banner--error">Mot de passe incorrect.</div> : null}
        {error === 'throttled' ? (
          <div className="banner banner--error">
            Trop de tentatives. Nouvel essai possible dans {minutes} minute
            {minutes > 1 ? 's' : ''}.
          </div>
        ) : null}
        {error === '2' ? (
          <div className="banner banner--error">Le nom d&apos;entreprise est obligatoire.</div>
        ) : null}

        <form action={login} className="stack">
          <div className="field">
            <label className="field__label" htmlFor="password">
              Mot de passe
            </label>
            <input id="password" name="password" type="password" autoComplete="current-password" required />
          </div>
          <button className="btn" type="submit">
            Entrer
          </button>
        </form>
      </div>
    </main>
  );
}

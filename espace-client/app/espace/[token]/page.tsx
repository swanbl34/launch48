import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

import { getAssets, getFormAnswers, getProjectByToken, getTasks } from '@/lib/data';
import { formatDate } from '@/lib/format';
import { countMissingRequired } from '@/lib/missing';
import { globalProgress } from '@/lib/progress';
import { isOnboarding } from '@/lib/types';

export const metadata: Metadata = { robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

const CALENDAR_URL = 'https://calendar.app.google/WzzdX11aNdR3DaMm8';
const CONTACT_EMAIL = 'contact@launch48.fr';

/**
 * Écran d'accueil — la première chose que voit le client en ouvrant son lien.
 *
 * Un seul message, une seule action. Le contenu de l'action dépend de la
 * phase : remplir son brief pendant l'onboarding, consulter le suivi une
 * fois la production ouverte.
 */
export default async function WelcomePage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ brief?: string }>;
}) {
  const { token } = await params;
  const { brief } = await searchParams;

  const project = await getProjectByToken(token);
  if (!project) notFound();

  const [answers, assets, tasks] = await Promise.all([
    getFormAnswers(project.id),
    getAssets(project.id),
    getTasks(project.id),
  ]);

  const onboarding = isOnboarding(project.status);
  const missing = countMissingRequired(answers.data, assets);
  const started = answers.last_step > 1 || !!answers.submitted_at;
  const progress = globalProgress(tasks);

  return (
    <main className="welcome">
      <div className="welcome__inner">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="welcome__mark" src="/favicon-fusee.svg" alt="" width={64} height={64} />

        <p className="welcome__eyebrow">Espace client Launch48</p>

        <h1 className="welcome__title">{project.company}</h1>

        {brief === 'valide' ? (
          <div className="banner" style={{ justifyContent: 'center' }}>
            <span aria-hidden>✓</span> Brief validé, merci. On prend le relais.
          </div>
        ) : null}

        {onboarding ? (
          <>
            <p className="welcome__lead">
              Bienvenue. On va construire ton site — et tout commence par bien te connaître.
              Six étapes, une vingtaine de minutes. Tout s&apos;enregistre au fur et à mesure,
              tu peux t&apos;arrêter et reprendre quand tu veux.
            </p>

            <a className="btn btn--xl" href={`/espace/${token}/brief`}>
              {started ? "Reprendre l'onboarding →" : "Commencer l'onboarding →"}
            </a>

            {started && missing > 0 ? (
              <p className="welcome__hint">
                Il reste <strong>{missing}</strong> élément{missing > 1 ? 's' : ''} à nous
                fournir.
              </p>
            ) : null}
            {started && missing === 0 ? (
              <p className="welcome__hint">Tout est complet de ton côté. Merci.</p>
            ) : null}
          </>
        ) : (
          <>
            <p className="welcome__lead">
              Bon retour. Ton projet est en production
              {project.delivery_date ? (
                <>
                  , livraison estimée le <strong>{formatDate(project.delivery_date)}</strong>
                </>
              ) : null}
              . Tu peux suivre l&apos;avancement en temps réel.
            </p>

            <div className="welcome__actions">
              <a className="btn btn--xl" href={`/espace/${token}/suivi`}>
                Voir mon projet · {progress}% →
              </a>
              <a className="btn btn--ghost" href={`/espace/${token}/brief`}>
                Mon brief{missing > 0 ? ` · ${missing} manquants` : ''}
              </a>
            </div>
          </>
        )}

        <p className="welcome__foot tiny muted">
          Une question ?{' '}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          {' · '}
          <a href={CALENDAR_URL} target="_blank" rel="noreferrer">
            réserver 15 minutes
          </a>
        </p>
      </div>
    </main>
  );
}

import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

import { STEPS, fieldsForStep, isFileField } from '@/lib/brief-schema';
import { displayValue } from '@/lib/brief-values';
import { isAdmin } from '@/lib/auth';
import { getAssets, getFormAnswers, getProjectById, signAssetUrl } from '@/lib/data';
import { formatDate, formatDateTime, formatSize } from '@/lib/format';
import { deferredFields, isDeferred, isFilled, missingRequiredFields } from '@/lib/missing';

export const metadata: Metadata = { robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

/** Onglet « Brief » : toutes les réponses du client + ses fichiers. */
export default async function BriefAdminPage({ params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) notFound();

  const { id } = await params;
  const project = await getProjectById(id);
  if (!project) notFound();

  const [answers, assets] = await Promise.all([getFormAnswers(project.id), getAssets(project.id)]);

  // URLs signées 1 h, générées à l'affichage. Rien n'est public.
  const signed = new Map<string, string | null>(
    await Promise.all(assets.map(async (a) => [a.id, await signAssetUrl(a.storage_path)] as const)),
  );

  const missing = missingRequiredFields(answers.data, assets);
  const deferred = deferredFields(answers.data, assets);

  return (
    <div className="stack--lg">
      <div className="row row--between">
        <div className="row">
          {missing.length > 0 ? (
            <span className="pill pill--danger">{missing.length} bloquants</span>
          ) : (
            <span className="pill pill--ok">aucun bloquant</span>
          )}
          {deferred.length > 0 ? (
            <span className="pill pill--warn">{deferred.length} à préciser</span>
          ) : null}
        </div>
        <span className="tiny muted">
          {answers.submitted_at ? `Validé le ${formatDate(answers.submitted_at)}` : 'Pas encore validé'}
          {' · maj '}
          {formatDateTime(answers.updated_at)}
        </span>
      </div>

      {deferred.length > 0 ? (
        <section className="card stack" style={{ gap: '0.5rem' }}>
          <span className="section-title">Le client ne sait pas encore</span>
          <ul className="missing-list">
            {deferred.map((f) => (
              <li className="missing-item missing-item--deferred" key={f.key}>
                <span className="dot dot--todo" aria-hidden />
                <span>{f.label}</span>
                <span className="pill tiny" style={{ marginLeft: 'auto' }}>
                  étape {f.step}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="stack" style={{ gap: '0.5rem' }}>
        {STEPS.map((s) => (
          <details className="accordion" key={s.step} open={s.step === 1}>
            <summary>
              {s.title}
              <span className="accordion__count">
                {fieldsForStep(s.step).filter((f) => isFilled(f, answers.data[f.key], assets)).length}
                /{fieldsForStep(s.step).length}
              </span>
            </summary>
            <div className="accordion__body">
              <dl className="kv">
                {fieldsForStep(s.step).map((f) => {
                  const mine = assets.filter((a) => a.field_key === f.key);
                  const skipped = isDeferred(f.key, answers.data);
                  return (
                    <div key={f.key} style={{ display: 'contents' }}>
                      <dt>
                        {f.required ? <span style={{ color: 'var(--danger)' }}>• </span> : null}
                        {f.label}
                      </dt>
                      <dd>
                        {skipped ? (
                          <span className="pill pill--warn tiny">ne sait pas encore</span>
                        ) : isFileField(f) ? (
                          mine.length ? (
                            <ul className="file-list">
                              {mine.map((a) => {
                                const url = signed.get(a.id);
                                return (
                                  <li className="file-item" key={a.id}>
                                    <span className="file-item__name">{a.file_name}</span>
                                    <span className="tiny muted">{formatSize(a.size)}</span>
                                    {url ? (
                                      <a className="tiny" href={url} target="_blank" rel="noreferrer">
                                        Télécharger
                                      </a>
                                    ) : (
                                      <span className="tiny muted">lien indisponible</span>
                                    )}
                                  </li>
                                );
                              })}
                            </ul>
                          ) : (
                            <span className="muted">—</span>
                          )
                        ) : (
                          <span style={{ whiteSpace: 'pre-wrap' }}>
                            {displayValue(f, answers.data[f.key])}
                          </span>
                        )}
                      </dd>
                    </div>
                  );
                })}
              </dl>
            </div>
          </details>
        ))}
      </section>
    </div>
  );
}

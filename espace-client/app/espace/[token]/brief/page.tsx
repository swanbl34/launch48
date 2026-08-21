import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

import { AppBar } from '@/app/_components/AppBar';
import { Bar } from '@/app/_components/Bar';
import {
  REQUIRED_COUNT,
  STEPS,
  TOTAL_STEPS,
  fieldsForStep,
  isFileField,
  type BriefField,
} from '@/lib/brief-schema';
import { displayValue } from '@/lib/brief-values';
import { getAssets, getFormAnswers, getProjectByToken } from '@/lib/data';
import { formatDate, formatSize } from '@/lib/format';
import {
  countMissingRequired,
  deferredFields,
  isDeferred,
  isFilled,
  missingInStep,
  missingRequiredFields,
} from '@/lib/missing';
import { isOnboarding, type AnswerMap, type AnswerValue, type Asset } from '@/lib/types';
import { ACCEPT_ATTRIBUTE, parseRejections, rejectionMessage } from '@/lib/upload-guard';
import { deleteAsset, saveBriefStep } from '../actions';

export const metadata: Metadata = { robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

/** L'étape virtuelle de récapitulatif, juste après la dernière vraie étape. */
const RECAP_STEP = TOTAL_STEPS + 1;

export default async function BriefPage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ step?: string; focus?: string; saved?: string; rejets?: string }>;
}) {
  const { token } = await params;
  const sp = await searchParams;

  const project = await getProjectByToken(token);
  if (!project) notFound();

  const [answers, assets] = await Promise.all([
    getFormAnswers(project.id),
    getAssets(project.id),
  ]);

  // Reprise automatique à last_step si aucune étape n'est demandée.
  const requested = sp.step ? Number(sp.step) : answers.last_step;
  const step = Math.min(Math.max(Number.isFinite(requested) ? requested : 1, 1), RECAP_STEP);

  const rejections = parseRejections(sp.rejets);
  const missingCount = countMissingRequired(answers.data, assets);
  const answeredRequired = countAnsweredRequired(missingCount);
  const meta = STEPS.find((s) => s.step === step);

  return (
    <main className="shell stack--lg">
      <AppBar
        brandHref={`/espace/${token}`}
        title={project.company}
        active={`/espace/${token}/brief`}
        action={
          isOnboarding(project.status) ? (
            <a className="btn btn--ghost btn--small" href={`/espace/${token}`}>
              ← Accueil
            </a>
          ) : undefined
        }
        tabs={
          isOnboarding(project.status)
            ? undefined
            : [
                { href: `/espace/${token}`, label: 'Suivi' },
                {
                  href: `/espace/${token}/brief`,
                  label: 'Mon brief',
                  badge: missingCount,
                  tone: 'danger',
                },
              ]
        }
      />

      {answers.submitted_at ? (
        <div className="banner">
          <span aria-hidden>✓</span> Brief validé le {formatDate(answers.submitted_at)}. Tu peux
          encore tout modifier, on suit les changements.
        </div>
      ) : null}

      {sp.saved ? (
        <div className="banner">
          <span aria-hidden>✓</span> Enregistré.
        </div>
      ) : null}

      {/* Fichiers refusés. Tes réponses texte ont bien été enregistrées : on le
          dit explicitement, sinon le réflexe est de croire que tout est perdu
          et de ressaisir l'étape. */}
      {rejections.length ? (
        <div className="banner banner--error stack" style={{ gap: '0.4rem' }}>
          <strong>Tes réponses sont enregistrées, mais certains fichiers n&apos;ont pas pu l&apos;être :</strong>
          <ul style={{ margin: 0, paddingLeft: '1.1rem' }}>
            {rejections.map((reason) => (
              <li key={reason}>{rejectionMessage(reason)}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {/* Progression + compteur de bloquants */}
      <section className="stack" style={{ gap: '0.55rem' }}>
        <div className="row row--between">
          <span className="section-title">
            {step === RECAP_STEP ? 'Récapitulatif' : `Étape ${step} sur ${TOTAL_STEPS}`}
          </span>
          <span className={missingCount > 0 ? 'pill pill--danger' : 'pill pill--ok'}>
            {missingCount > 0
              ? `${missingCount} champ${missingCount > 1 ? 's' : ''} bloquant${missingCount > 1 ? 's' : ''} restant${missingCount > 1 ? 's' : ''}`
              : 'Aucun champ bloquant'}
          </span>
        </div>

        <Bar value={answeredRequired} />

        <nav className="steps" aria-label="Étapes du brief">
          {STEPS.map((s) => {
            const n = missingInStep(s.step, answers.data, assets);
            return (
              <a
                key={s.step}
                className="step-chip"
                href={`/espace/${token}/brief?step=${s.step}`}
                aria-current={s.step === step ? 'step' : undefined}
              >
                {s.title}
                {n > 0 ? <span className="step-chip__badge">{n}</span> : null}
              </a>
            );
          })}
          <a
            className="step-chip"
            href={`/espace/${token}/brief?step=${RECAP_STEP}`}
            aria-current={step === RECAP_STEP ? 'step' : undefined}
          >
            Récap
          </a>
        </nav>
      </section>

      {step === RECAP_STEP ? (
        <Recap token={token} answers={answers.data} assets={assets} submitted={!!answers.submitted_at} />
      ) : (
        <form action={saveBriefStep} className="stack--lg">
          {/* Pas d'encType ici : React le règle seul pour un formulaire à Server
              Action (multipart dès qu'un input file est présent), et une valeur
              explicite déclenche un avertissement console. */}
          <input type="hidden" name="token" value={token} />
          <input type="hidden" name="step" value={step} />

          <div className="stack" style={{ gap: '0.35rem' }}>
            <h1>{meta?.title}</h1>
            <p className="muted small">{meta?.intro}</p>
          </div>

          <div className="fields">
            {fieldsForStep(step).map((field) => (
              <Field
                key={field.key}
                field={field}
                value={answers.data[field.key]}
                assets={assets.filter((a) => a.field_key === field.key)}
                focused={sp.focus === field.key}
                deferred={isDeferred(field.key, answers.data)}
              />
            ))}
          </div>

          <div className="form-nav">
            {step > 1 ? (
              <button className="btn btn--ghost btn--small" name="_intent" value="prev" type="submit">
                ← Précédent
              </button>
            ) : null}
            <button className="btn btn--ghost btn--small" name="_intent" value="save" type="submit">
              Enregistrer
            </button>
            <span className="spacer" />
            <button className="btn" name="_intent" value="next" type="submit">
              {step === TOTAL_STEPS ? 'Voir le récap →' : 'Suivant →'}
            </button>
          </div>

          <p className="tiny muted center">
            Tout est enregistré à chaque changement d&apos;étape. Tu peux fermer et revenir plus tard.
          </p>
        </form>
      )}

      {/* Hors du <form> principal : cibles des boutons ✕ de chaque fichier. */}
      {step !== RECAP_STEP
        ? fieldsForStep(step)
            .filter(isFileField)
            .flatMap((f) => assets.filter((a) => a.field_key === f.key))
            .map((a) => <DeleteAssetForm key={a.id} assetId={a.id} token={token} step={step} />)
        : null}
    </main>
  );
}

/** % de champs bloquants déjà remplis — alimente la barre de progression. */
function countAnsweredRequired(missing: number): number {
  if (REQUIRED_COUNT === 0) return 100;
  return ((REQUIRED_COUNT - missing) / REQUIRED_COUNT) * 100;
}

/* ─────────────────────────────────────────────────────────────────────────
   Rendu d'un champ, piloté par son `type` déclaré dans brief-schema.
   ───────────────────────────────────────────────────────────────────────── */
function Field({
  field,
  value,
  assets,
  focused,
  deferred,
}: {
  field: BriefField;
  value: AnswerValue | undefined;
  assets: Asset[];
  focused: boolean;
  deferred: boolean;
}) {
  const filled = isFilled(field, value, assets);
  const cls = ['field', focused && 'field--focused', deferred && 'field--deferred']
    .filter(Boolean)
    .join(' ');

  return (
    <div className={cls} id={`field-${field.key}`}>
      <label className="field__label" htmlFor={field.key}>
        {field.required && !filled && !deferred ? (
          <span className="field__req" aria-label="Champ bloquant" title="Champ bloquant" />
        ) : null}
        {field.label}
      </label>
      {field.help ? <p className="field__help">{field.help}</p> : null}

      <Control field={field} value={value} assets={assets} />

      {/* Échappatoire : la question reste posée, mais elle ne bloque plus. */}
      {field.allowUnknown ? (
        <label className="unknown-toggle">
          <input type="checkbox" name={`__unknown_${field.key}`} defaultChecked={deferred} />
          <span>Je ne sais pas encore</span>
        </label>
      ) : null}
    </div>
  );
}

function Control({
  field,
  value,
  assets,
}: {
  field: BriefField;
  value: AnswerValue | undefined;
  assets: Asset[];
}) {
  const str = typeof value === 'string' ? value : '';
  const list = Array.isArray(value) ? value : [];

  switch (field.type) {
    case 'textarea':
      return (
        <textarea id={field.key} name={field.key} defaultValue={str} placeholder={field.placeholder} />
      );

    case 'url_list':
      return (
        <textarea
          id={field.key}
          name={field.key}
          defaultValue={list.join('\n')}
          placeholder={'https://exemple.fr\nhttps://autre-exemple.fr'}
          style={{ minHeight: '5.5rem' }}
        />
      );

    case 'select':
      return (
        <select id={field.key} name={field.key} defaultValue={str}>
          <option value="">— À choisir —</option>
          {(field.options ?? []).map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      );

    case 'multiselect':
      return (
        <div className="choice-grid" role="group" aria-labelledby={field.key}>
          {(field.options ?? []).map((o) => (
            <label className="choice" key={o}>
              <input type="checkbox" name={field.key} value={o} defaultChecked={list.includes(o)} />
              {o}
            </label>
          ))}
        </div>
      );

    case 'bool':
      return (
        <label className="switch">
          {/* Champ témoin : distingue « décoché » de « étape non affichée ». */}
          <input type="hidden" name={`__present_${field.key}`} value="1" />
          <input type="checkbox" id={field.key} name={field.key} defaultChecked={value === true} />
          <span className="switch__track" aria-hidden />
          <span className="small muted">{value === true ? 'Oui' : 'Non'}</span>
        </label>
      );

    case 'file':
    case 'files':
      return (
        <div className="dropzone">
          {assets.length > 0 ? (
            <ul className="file-list">
              {assets.map((a) => (
                <li className="file-item" key={a.id}>
                  <span aria-hidden>📎</span>
                  <span className="file-item__name">{a.file_name}</span>
                  <span className="tiny muted">{formatSize(a.size)}</span>
                  {/* Formulaire imbriqué interdit en HTML : on cible un form
                      frère déclaré plus bas via l'attribut `form`. */}
                  <button
                    type="submit"
                    form={`del-${a.id}`}
                    className="btn btn--ghost btn--small btn--danger"
                    style={{ padding: '0.15rem 0.5rem' }}
                    aria-label={`Supprimer ${a.file_name}`}
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          ) : null}

          <input
            type="file"
            id={field.key}
            name={field.key}
            multiple={field.type === 'files'}
            /* Même liste que la validation serveur (lib/upload-guard.ts) : le
               navigateur filtre pour le confort, le serveur décide. Le SVG en
               est volontairement absent. */
            accept={ACCEPT_ATTRIBUTE}
          />
          <p className="tiny muted">
            {field.type === 'files' ? 'Plusieurs fichiers possibles. ' : ''}20 Mo par fichier
            maximum.
          </p>
        </div>
      );

    default:
      return (
        <input
          type={field.type === 'email' ? 'email' : field.type === 'tel' ? 'tel' : 'text'}
          id={field.key}
          name={field.key}
          defaultValue={str}
          placeholder={field.placeholder}
        />
      );
  }
}

/**
 * Les <form> imbriqués sont interdits en HTML : ces formulaires de
 * suppression sont donc rendus APRÈS le formulaire principal, et les boutons
 * ✕ situés dans la dropzone les ciblent via l'attribut `form="del-<id>"`.
 */
function DeleteAssetForm({ assetId, token, step }: { assetId: string; token: string; step: number }) {
  return (
    <form id={`del-${assetId}`} action={deleteAsset} hidden>
      <input type="hidden" name="token" value={token} />
      <input type="hidden" name="assetId" value={assetId} />
      <input type="hidden" name="step" value={step} />
    </form>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   Écran final : ce qui manque + validation.
   ───────────────────────────────────────────────────────────────────────── */
function Recap({
  token,
  answers,
  assets,
  submitted,
}: {
  token: string;
  answers: AnswerMap;
  assets: Asset[];
  submitted: boolean;
}) {
  const missing = missingRequiredFields(answers, assets);
  const deferred = deferredFields(answers, assets);

  return (
    <div className="stack--lg">
      <div className="stack" style={{ gap: '0.35rem' }}>
        <h1>Presque fini</h1>
        <p className="muted small">
          {missing.length === 0
            ? 'Tous les champs bloquants sont remplis. Tu peux valider.'
            : "Tu peux valider même incomplet : ces éléments remonteront dans ton suivi. Et si tu n'as pas encore la réponse, coche « Je ne sais pas encore » sur la question."}
        </p>
      </div>

      {missing.length > 0 ? (
        <section className="card card--danger stack" style={{ gap: '0.7rem' }}>
          <div className="row row--between">
            <h2>Il manque encore</h2>
            <span className="pill pill--danger">{missing.length}</span>
          </div>
          <ul className="missing-list">
            {missing.map((f) => (
              <li key={f.key}>
                <a
                  className="missing-item missing-item--blocking"
                  href={`/espace/${token}/brief?step=${f.step}&focus=${f.key}`}
                >
                  <span className="dot dot--blocked" aria-hidden />
                  <span>{f.label}</span>
                  <span className="missing-item__arrow" aria-hidden>
                    →
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <section className="card card--ok">
          <h2 style={{ color: 'var(--accent-3)' }}>Brief complet</h2>
        </section>
      )}

      {deferred.length > 0 ? (
        <section className="card stack" style={{ gap: '0.6rem' }}>
          <div className="row row--between">
            <h2>À préciser plus tard</h2>
            <span className="pill pill--warn">{deferred.length}</span>
          </div>
          <p className="small muted">
            Tu as indiqué ne pas encore avoir ces éléments. On avance sans, et on te les
            redemandera au bon moment.
          </p>
          <ul className="missing-list">
            {deferred.map((f) => (
              <li key={f.key}>
                <a
                  className="missing-item missing-item--deferred"
                  href={`/espace/${token}/brief?step=${f.step}&focus=${f.key}`}
                >
                  <span className="dot dot--todo" aria-hidden />
                  <span>{f.label}</span>
                  <span className="missing-item__arrow" aria-hidden>
                    →
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* Relecture rapide de toutes les réponses */}
      <section className="stack" style={{ gap: '0.5rem' }}>
        <span className="section-title">Tes réponses</span>
        {STEPS.map((s) => (
          <details className="accordion" key={s.step}>
            <summary>
              {s.title}
              <span className="accordion__count">
                {fieldsForStep(s.step).filter((f) => isFilled(f, answers[f.key], assets)).length}/
                {fieldsForStep(s.step).length}
              </span>
            </summary>
            <div className="accordion__body">
              <dl className="kv">
                {fieldsForStep(s.step).map((f) => (
                  <RecapRow key={f.key} field={f} value={answers[f.key]} assets={assets} />
                ))}
              </dl>
            </div>
          </details>
        ))}
      </section>

      <form action={saveBriefStep}>
        <input type="hidden" name="token" value={token} />
        <input type="hidden" name="step" value={RECAP_STEP} />
        <div className="form-nav">
          <button className="btn btn--ghost btn--small" name="_intent" value={`goto-${TOTAL_STEPS}`} type="submit">
            ← Revenir au formulaire
          </button>
          <span className="spacer" />
          <button className="btn" name="_intent" value="submit" type="submit">
            {submitted ? 'Enregistrer les modifications' : 'Valider mon brief'}
          </button>
        </div>
      </form>
    </div>
  );
}

function RecapRow({
  field,
  value,
  assets,
}: {
  field: BriefField;
  value: AnswerValue | undefined;
  assets: Asset[];
}) {
  const mine = assets.filter((a) => a.field_key === field.key);
  const filled = isFilled(field, value, assets);

  return (
    <>
      <dt>{field.label}</dt>
      <dd style={filled ? undefined : { color: 'var(--muted)' }}>
        {isFileField(field)
          ? mine.length
            ? mine.map((a) => a.file_name).join(', ')
            : '—'
          : displayValue(field, value)}
      </dd>
    </>
  );
}

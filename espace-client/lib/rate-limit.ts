/**
 * Limitation de débit — protection de l'écran de connexion admin.
 *
 * POURQUOI
 * L'admin est gardé par un unique mot de passe partagé. Sans limitation, une
 * Server Action est appelable en boucle : quelques milliers de tentatives par
 * minute suffisent à casser un mot de passe faible, et rien dans Vercel ne
 * l'empêche par défaut. C'est le point le plus attaquable de l'application.
 *
 * COMMENT
 * Fenêtre glissante en mémoire, indexée sur l'IP. Au-delà de MAX_ATTEMPTS
 * échecs dans WINDOW_MS, on refuse pendant BLOCK_MS — sans même vérifier le
 * mot de passe, pour ne pas offrir d'oracle de temps. Une connexion réussie
 * remet le compteur à zéro.
 *
 * LIMITE ASSUMÉE
 * La mémoire est locale à l'instance serverless : plusieurs instances = autant
 * de compteurs, et un redémarrage les efface. Ça ne bloque donc pas un attaquant
 * distribué de façon absolue — mais ça fait passer une attaque par
 * dictionnaire de « quelques minutes » à « plusieurs mois », ce qui suffit
 * largement ici. Pour une garantie stricte et partagée entre instances, il
 * faudrait un compteur externe (Upstash Redis, ou une table Supabase).
 * L'interface ci-dessous est faite pour qu'un tel remplacement ne touche que
 * ce fichier.
 */

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 1000 * 60 * 10; // 10 min pour accumuler les échecs
const BLOCK_MS = 1000 * 60 * 15; // 15 min de blocage ensuite

/** Au-delà, on purge : borne la mémoire si quelqu'un fait tourner les IP. */
const MAX_TRACKED_KEYS = 10_000;

type Entry = {
  /** Horodatages des échecs encore dans la fenêtre. */
  failures: number[];
  /** Fin du blocage, si blocage en cours. */
  blockedUntil: number;
};

const attempts = new Map<string, Entry>();

/** Retire les entrées dont plus rien n'est actif. */
function sweep(now: number): void {
  for (const [key, entry] of attempts) {
    const stale =
      entry.blockedUntil < now && entry.failures.every((t) => now - t > WINDOW_MS);
    if (stale) attempts.delete(key);
  }
}

export type RateLimitVerdict =
  | { allowed: true }
  | { allowed: false; retryAfterSeconds: number };

/**
 * À appeler AVANT de vérifier le mot de passe. Ne consomme rien : dit
 * seulement si la clé a encore droit à un essai.
 */
export function checkRateLimit(key: string): RateLimitVerdict {
  const now = Date.now();
  const entry = attempts.get(key);

  if (!entry) return { allowed: true };

  if (entry.blockedUntil > now) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((entry.blockedUntil - now) / 1000),
    };
  }

  return { allowed: true };
}

/** À appeler après un échec d'authentification. */
export function recordFailure(key: string): void {
  const now = Date.now();

  if (attempts.size > MAX_TRACKED_KEYS) sweep(now);

  const entry = attempts.get(key) ?? { failures: [], blockedUntil: 0 };
  entry.failures = [...entry.failures.filter((t) => now - t < WINDOW_MS), now];

  if (entry.failures.length >= MAX_ATTEMPTS) {
    entry.blockedUntil = now + BLOCK_MS;
    entry.failures = []; // le blocage remplace le décompte
  }

  attempts.set(key, entry);
}

/** À appeler après une authentification réussie. */
export function clearFailures(key: string): void {
  attempts.delete(key);
}

/**
 * Identifie l'appelant à partir des en-têtes de la requête.
 *
 * Sur Vercel, `x-forwarded-for` est renseigné par le proxy et le premier
 * élément est l'IP réelle du client — les valeurs qu'un client tenterait
 * d'injecter lui-même sont ajoutées après. En local, aucun en-tête : on
 * retombe sur une clé unique, ce qui limite globalement et convient au dev.
 */
export function clientKey(headerList: Headers): string {
  const forwarded = headerList.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0]!.trim();
  return headerList.get('x-real-ip') ?? 'local';
}

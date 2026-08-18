/**
 * Auth admin — cookie signé, pas de session en base.
 *
 * Le cookie contient `<expiration>.<HMAC-SHA256(expiration)>`. Sans le secret
 * serveur, il est infalsifiable ; et comme l'expiration est dans la charge
 * signée, on ne peut pas la rallonger côté client.
 */
import { createHmac, timingSafeEqual, randomUUID } from 'node:crypto';
import { cookies } from 'next/headers';

export const ADMIN_COOKIE = 'l48_admin';
const SESSION_TTL_MS = 1000 * 60 * 60 * 12; // 12 h

function secret(): string {
  const s = process.env.ADMIN_SESSION_SECRET;
  if (!s || s.length < 16) {
    throw new Error('ADMIN_SESSION_SECRET manquant ou trop court. Voir .env.example.');
  }
  return s;
}

function sign(payload: string): string {
  return createHmac('sha256', secret()).update(payload).digest('base64url');
}

/** Comparaison à temps constant, robuste aux longueurs différentes. */
function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

export function createSessionValue(): string {
  const exp = String(Date.now() + SESSION_TTL_MS);
  return `${exp}.${sign(exp)}`;
}

export function verifySessionValue(value: string | undefined): boolean {
  if (!value) return false;

  const dot = value.lastIndexOf('.');
  if (dot <= 0) return false;

  const exp = value.slice(0, dot);
  const mac = value.slice(dot + 1);

  if (!safeEqual(mac, sign(exp))) return false;

  const expMs = Number(exp);
  return Number.isFinite(expMs) && expMs > Date.now();
}

/** Vérifie le mot de passe saisi contre ADMIN_PASSWORD. */
export function checkPassword(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    throw new Error('ADMIN_PASSWORD manquant. Voir .env.example.');
  }
  // On hache les deux côtés : timingSafeEqual exige des longueurs égales, et
  // hacher évite de divulguer la longueur du mot de passe par le timing.
  const h = (v: string) => createHmac('sha256', secret()).update(v).digest('hex');
  return safeEqual(h(input), h(expected));
}

export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  return verifySessionValue(store.get(ADMIN_COOKIE)?.value);
}

export const newToken = () => randomUUID();

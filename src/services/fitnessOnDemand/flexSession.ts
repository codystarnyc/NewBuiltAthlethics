import axios from 'axios';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env';

export interface FlexSession {
  idToken: string;
  accountId: string;
  playerId: string;
  policyKey: string;
}

interface Cached {
  session: FlexSession;
  /** ms epoch — refresh before JWT exp */
  refreshAfter: number;
}

const cache = new Map<string, Cached>();

function flexBaseUrl(): string {
  return env.fitnessOnDemand.flexUrl.replace(/\/$/, '');
}

function parseJwtExpMs(token: string): number {
  const decoded = jwt.decode(token) as { exp?: number } | null;
  if (!decoded?.exp) return Date.now() + 50 * 60_000;
  return decoded.exp * 1000;
}

/**
 * Flex Playback API auth per FOD docs:
 * POST /flex/v1/auth/token (or /Auth/Token) with { clientId, clientSecret, email }.
 * Returns idToken + Brightcove accountId, playerId, policyKey.
 */
async function fetchFlexSession(email: string): Promise<FlexSession> {
  const base = flexBaseUrl();
  if (!base || !env.fitnessOnDemand.clientId || !env.fitnessOnDemand.clientSecret) {
    throw new Error('FOD flex URL, client id, and client secret are required');
  }

  const body = {
    clientId: env.fitnessOnDemand.clientId,
    clientSecret: env.fitnessOnDemand.clientSecret,
    email,
  };

  const paths = ['/auth/token', '/Auth/Token'];
  let lastErr = 'FOD flex auth failed';

  for (const p of paths) {
    const url = `${base}${p}`;
    const { data, status } = await axios.post<{
      success?: boolean;
      message?: string;
      idToken?: string;
      accountId?: string;
      playerId?: string;
      policyKey?: string;
    }>(url, body, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      timeout: 30_000,
      validateStatus: () => true,
    });

    if (status === 200 && data?.idToken && data.accountId && data.policyKey) {
      return {
        idToken: data.idToken,
        accountId: data.accountId,
        playerId: data.playerId ?? '',
        policyKey: data.policyKey,
      };
    }
    lastErr = data?.message ?? `HTTP ${status}`;
  }

  throw new Error(lastErr);
}

/**
 * Cached Flex session for the given app user email.
 * User must be invited to FLEX via FOD Management API or flex auth will fail.
 */
export async function getFlexSession(userEmail: string): Promise<FlexSession> {
  const key = userEmail.toLowerCase();
  const now = Date.now();
  const hit = cache.get(key);
  if (hit && now < hit.refreshAfter) return hit.session;

  const session = await fetchFlexSession(userEmail);
  const expMs = parseJwtExpMs(session.idToken);
  const refreshAfter = Math.min(now + 50 * 60_000, expMs - 60_000);
  cache.set(key, { session, refreshAfter: Math.max(now + 5_000, refreshAfter) });
  return session;
}

export function clearFlexSessionCache(userEmail: string): void {
  cache.delete(userEmail.toLowerCase());
}

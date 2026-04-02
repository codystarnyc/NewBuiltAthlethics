import axios from 'axios';
import { env } from '../../config/env';

export interface FodTokenResponse {
  success?: boolean;
  message?: string;
  idToken?: string;
}

/**
 * Obtain a Fitness On Demand JWT (management / MAPI).
 * POST {managementUrl}/Auth/Token with JSON { clientId, clientSecret }.
 */
export async function getFitnessOnDemandManagementToken(): Promise<string> {
  const base = env.fitnessOnDemand.managementUrl.replace(/\/$/, '');
  if (!base || !env.fitnessOnDemand.clientId || !env.fitnessOnDemand.clientSecret) {
    throw new Error('FOD management URL, client id, and client secret are required');
  }
  const url = `${base}/Auth/Token`;
  const { data, status } = await axios.post<FodTokenResponse>(
    url,
    {
      clientId: env.fitnessOnDemand.clientId,
      clientSecret: env.fitnessOnDemand.clientSecret,
    },
    {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      timeout: 30_000,
      validateStatus: () => true,
    },
  );
  if (status === 200 && data?.idToken) return data.idToken;
  throw new Error(data?.message ?? `FOD auth failed (HTTP ${status})`);
}

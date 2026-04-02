import { apiClient } from './client';
import { ENDPOINTS } from './endpoints';
import type { AuthResponse, LoginRequest, ResetPasswordRequest, SignUpRequest } from './types';

export async function signUp(data: SignUpRequest): Promise<AuthResponse> {
  const res = await apiClient.post<AuthResponse>(ENDPOINTS.auth.signUp, data);
  return res.data;
}

export async function login(data: LoginRequest): Promise<AuthResponse> {
  const res = await apiClient.post<AuthResponse>(ENDPOINTS.auth.login, data);
  return res.data;
}

export async function sendResetPasswordEmail(data: ResetPasswordRequest): Promise<void> {
  await apiClient.post(ENDPOINTS.auth.sendResetPasswordEmail, data);
}

export async function deleteAccount(email: string): Promise<void> {
  await apiClient.post(ENDPOINTS.auth.deleteAccount, { email });
}

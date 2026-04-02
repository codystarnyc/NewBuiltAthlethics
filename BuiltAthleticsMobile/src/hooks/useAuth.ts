import { useMutation } from '@tanstack/react-query';
import * as authApi from '../api/auth';
import { useAuthStore } from '../store/useAuthStore';
import type { LoginRequest, SignUpRequest } from '../api/types';

export function useLogin() {
  const login = useAuthStore((s) => s.login);

  return useMutation({
    mutationFn: (data: LoginRequest) => login(data),
  });
}

export function useSignUp() {
  const signUp = useAuthStore((s) => s.signUp);

  return useMutation({
    mutationFn: (data: SignUpRequest) => signUp(data),
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (email: string) => authApi.sendResetPasswordEmail({ email }),
  });
}

export function useDeleteAccount() {
  const logout = useAuthStore((s) => s.logout);

  return useMutation({
    mutationFn: async (email: string) => {
      await authApi.deleteAccount(email);
      await logout();
    },
  });
}

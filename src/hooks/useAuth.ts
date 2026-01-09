import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import {
  register,
  login,
  logout,
  type AuthApiError,
} from '@/services/auth.service';
import {
  type RegisterRequest,
  type RegisterResponse,
  type LoginRequest,
  type LoginResponse,
} from '@/types/auth';
import { saveTokens, getAccessToken, removeTokens } from '@/utils/token';

export function useRegister() {
  const router = useRouter();

  return useMutation<RegisterResponse, AuthApiError, RegisterRequest>({
    mutationFn: register,
    onSuccess: () => {
      // Redirect to login page after successful registration
      router.push('/');
    },
    retry: false,
  });
}

export function useLogin() {
  const router = useRouter();

  return useMutation<LoginResponse, AuthApiError, LoginRequest>({
    mutationFn: login,
    onSuccess: data => {
      saveTokens({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });

      // Redirect to home page after successful login
      router.push('/');
    },
    retry: false,
  });
}

export function useLogout() {
  const router = useRouter();

  return useMutation<void, AuthApiError, void>({
    mutationFn: async () => {
      const accessToken = getAccessToken();
      if (accessToken) {
        await logout(accessToken);
      }
    },
    onSuccess: () => {
      removeTokens();

      router.push('/login');
    },
    onError: () => {
      removeTokens();
      router.push('/login');
    },
    retry: false,
  });
}

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { authService, type AuthApiError } from '@/services/AuthService.class';
import {
  type RegisterRequest,
  type RegisterResponse,
  type LoginRequest,
  type LoginResponse,
} from '@/types/auth';

export function useRegister() {
  const router = useRouter();

  return useMutation<RegisterResponse, AuthApiError, RegisterRequest>({
    mutationFn: data => authService.register(data),
    onSuccess: async (_, variables) => {
      // Auto-login after successful registration
      const loginData = await authService.login({
        email: variables.email,
        password: variables.password,
      });
      authService.saveTokens({
        accessToken: loginData.accessToken,
        refreshToken: loginData.refreshToken,
      });
      router.push('/');
    },
    retry: false,
  });
}

export function useLogin() {
  const router = useRouter();

  return useMutation<LoginResponse, AuthApiError, LoginRequest>({
    mutationFn: data => authService.login(data),
    onSuccess: data => {
      authService.saveTokens({
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
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      authService.removeTokens();
      router.push('/login');
    },
    onError: () => {
      authService.removeTokens();
      router.push('/login');
    },
    retry: false,
  });
}

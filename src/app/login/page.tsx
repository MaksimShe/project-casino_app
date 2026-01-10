'use client';

import { Input } from '@/shared/Input';
import Image from 'next/image';
import { useState } from 'react';
import { useLogin } from '@/hooks/useAuth';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';
import { validatePassword } from '@/utils/validation';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { AuthError } from '@/shared/AuthError';
import { PasswordInput } from '@/shared/PasswordInput';
import { useForm, Controller } from 'react-hook-form';
import { type LoginRequest } from '@/types/auth';
import { ROUTES } from '@/constants/routes';

export default function Login() {
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const {
    register: registerValue,
    handleSubmit,
    control,
  } = useForm<LoginRequest>();

  const { mutate: login, isPending, error } = useLogin();
  const { isAuthenticated } = useAuthRedirect();

  if (isAuthenticated) {
    return null;
  }

  const togglePasswordFocus = (focused: boolean) => () =>
    setIsPasswordFocused(focused);

  const handleLogin = (data: LoginRequest) => {
    const validation = validatePassword(data.password);
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      return;
    }

    setValidationErrors([]);
    login({
      email: data.email,
      password: data.password,
    });
  };

  return (
    <>
      <AnimatedBackground eyeState={isPasswordFocused} />
      <div className="flex h-[100vh] w-full items-center justify-center">
        <div className="h-fill box-border flex w-[462px] flex-col items-center gap-8 rounded-[var(--main-radius)] bg-[#100F22] p-10 pt-4 max-sm:scale-85">
          <div className="flex w-full flex-col items-center justify-center">
            <Image src="/logo/logo.svg" alt="logo" width={96} height={96} />
            <h1>Blaze casino</h1>
            <h2>Welcome!</h2>
            <form
              onSubmit={handleSubmit(handleLogin)}
              className="mt-10 flex w-full flex-col gap-2"
            >
              <div className="flex w-full flex-col justify-center gap-2">
                <label htmlFor="email">Email</label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email"
                  {...registerValue('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^\S+@\S+$/,
                      message: 'Invalid email',
                    },
                  })}
                  disabled={isPending}
                />
              </div>

              <div className="flex w-full flex-col justify-center gap-2">
                <label htmlFor="password">Password</label>
                <Controller
                  name="password"
                  control={control}
                  rules={{ required: 'Password is required' }}
                  render={({ field }) => (
                    <PasswordInput
                      {...field}
                      disabled={isPending}
                      onFocus={togglePasswordFocus(true)}
                      onBlur={togglePasswordFocus(false)}
                    />
                  )}
                />
              </div>

              <AuthError validationErrors={validationErrors} error={error} />

              <button
                type="submit"
                disabled={isPending}
                className="relative mt-8 flex h-12 w-full items-center justify-center rounded-3xl bg-gradient-to-t from-[#FF0047] to-[#FF417B] font-bold text-white transition-shadow duration-300 hover:shadow-[0_0_18px_0_#FF5A8C] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isPending ? 'Logging in...' : 'Login'}
                <Image
                  src="/logo/login.svg"
                  alt="login logo"
                  width={32}
                  height={32}
                  className="absolute right-2"
                />
              </button>
            </form>
          </div>
          <div className="flex w-full flex-col items-center justify-center gap-4">
            <p className="text-[#51A2FF] transition-colors duration-200 hover:text-[#AAD2FF]">
              <a href={ROUTES.REGISTRATION}>Don`t have an account? Register</a>
            </p>
            <p className="w-full border-t pt-4 text-center text-xs">
              Your account data is stored locally in your browser
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

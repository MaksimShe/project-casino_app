'use client';

import { Input } from '@/shared/Input';
import Image from 'next/image';
import { useState, type FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRegister } from '@/hooks/useAuth';
import { isAuthenticated } from '@/utils/token';
import { validatePassword } from '@/utils/validation';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { AuthError } from '@/shared/AuthError';
import { PasswordInput } from '@/shared/PasswordInput';

export default function Registration() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mounted, setMounted] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const { mutate: register, isPending, error } = useRegister();

  useEffect(() => {
    setMounted(true);
    if (isAuthenticated()) {
      router.push('/');
    }
  }, [router]);

  // Don't render until mounted (prevents hydration mismatch)
  if (!mounted) {
    return null;
  }

  if (isAuthenticated()) {
    return null;
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validation = validatePassword(password);
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      return;
    }

    setValidationErrors([]);
    register({
      username,
      email,
      password,
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
              onSubmit={handleSubmit}
              className="mt-10 flex w-full flex-col gap-2"
            >
              <div className="flex w-full flex-col justify-center gap-2">
                <label htmlFor="username">Username</label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Enter username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  required
                  disabled={isPending}
                />
              </div>

              <div className="flex w-full flex-col justify-center gap-2">
                <label htmlFor="email">Email</label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  disabled={isPending}
                />
              </div>

              <div className="flex w-full flex-col justify-center gap-2">
                <label htmlFor="password">Password</label>
                <PasswordInput
                  value={password}
                  onChange={e => {
                    setPassword(e.target.value);
                    if (validationErrors.length > 0) {
                      setValidationErrors([]);
                    }
                  }}
                  required
                  disabled={isPending}
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
                />
              </div>
              <AuthError validationErrors={validationErrors} error={error} />

              <button
                type="submit"
                disabled={isPending}
                className="mt-8 h-12 w-full rounded-3xl bg-gradient-to-t from-[#FF0047] to-[#FF417B] font-bold text-white transition-shadow duration-300 hover:shadow-[0_0_18px_0_#FF5A8C] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isPending ? 'Creating account...' : 'Sign Up'}
              </button>
            </form>
          </div>
          <div className="flex w-full flex-col items-center justify-center gap-4">
            <p className="text-[#51A2FF] transition-colors duration-200 hover:text-[#AAD2FF]">
              <a href="/login">Already have an account? Login</a>
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

import { type FC } from 'react';
import { type AuthApiError } from '@/services/AuthService.class';

interface Props {
  error: AuthApiError | null;
  validationErrors: string[];
}

export const AuthError: FC<Props> = ({ error, validationErrors }) => {
  return (
    <>
      {validationErrors.length > 0 && (
        <div className="rounded p-3 text-sm text-[var(--system-error-color)]">
          <p className="mb-2 font-semibold">Password requirements:</p>
          <ul className="list-inside list-disc space-y-1">
            {validationErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}
      {error && !validationErrors.length && (
        <div className="rounded p-3 text-sm text-[var(--system-error-color)]">
          {error.message}
        </div>
      )}
    </>
  );
};

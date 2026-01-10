export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validate password according to requirements:
 * - Minimum length: 8-12 characters
 * - At least one uppercase letter (A-Z)
 * - At least one lowercase letter (a-z)
 * - At least one number (0-9)
 * - At least one special character (!@#$%^&*)
 */
export function validatePassword(password: string): PasswordValidationResult {
  const errors: string[] = [];

  // Check length
  if (password.length < 8 || password.length > 18) {
    errors.push('Password must be 8-18 characters long');
  }

  // Check uppercase letter
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter (A-Z)');
  }

  // Check lowercase letter
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter (a-z)');
  }

  // Check number
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number (0-9)');
  }

  // Check special character
  if (!/[!@#$%^&*]/.test(password)) {
    errors.push(
      'Password must contain at least one special character (!@#$%^&*)'
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

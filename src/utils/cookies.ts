/**
 * Cookie utilities for client-side cookie management
 */

interface CookieOptions {
  days?: number;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
}

export const cookieUtils = {
  set(name: string, value: string, options: CookieOptions = {}): void {
    if (typeof window === 'undefined') return;

    const {
      days = 7,
      path = '/',
      domain,
      secure = process.env.NODE_ENV === 'production', // Only secure in production
      sameSite = 'lax',
    } = options;

    let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      cookie += `; expires=${date.toUTCString()}`;
    }

    cookie += `; path=${path}`;

    if (domain) {
      cookie += `; domain=${domain}`;
    }

    if (secure) {
      cookie += '; secure';
    }

    cookie += `; samesite=${sameSite}`;

    document.cookie = cookie;
  },

  get(name: string): string | null {
    if (typeof window === 'undefined') return null;

    const nameEQ = `${encodeURIComponent(name)}=`;
    const cookies = document.cookie.split(';');

    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i];
      while (cookie.charAt(0) === ' ') {
        cookie = cookie.substring(1);
      }
      if (cookie.indexOf(nameEQ) === 0) {
        return decodeURIComponent(
          cookie.substring(nameEQ.length, cookie.length)
        );
      }
    }

    return null;
  },

  remove(name: string, options: Omit<CookieOptions, 'days'> = {}): void {
    if (typeof window === 'undefined') return;

    this.set(name, '', { ...options, days: -1 });
  },
};

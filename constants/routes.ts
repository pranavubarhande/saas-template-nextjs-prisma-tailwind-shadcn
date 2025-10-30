export const ROUTES = {
  home: '/',
  login: '/login',
  register: '/register',
  dashboard: '/dashboard',
  settings: '/settings',
  teams: '/teams',
  billing: '/billing',
} as const;

// Publicly accessible informational pages (no auth required, even if logged in)
export const PUBLIC_ROUTES: string[] = ['/'];

// Auth-only entry pages. If the user is already logged in, redirect away from these.
export const AUTH_ROUTES: string[] = ['/login', '/register'];

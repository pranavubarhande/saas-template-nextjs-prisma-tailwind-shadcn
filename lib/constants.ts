export const APP_NAME = 'SaaS Template';
export const APP_DESCRIPTION =
  'A comprehensive SaaS template with authentication, teams, and billing';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',
  TEAMS: '/teams',
  BILLING: '/billing',
  SETTINGS: '/settings',
  API: {
    AUTH: {
      LOGIN: '/api/auth/login',
      REGISTER: '/api/auth/register',
      LOGOUT: '/api/auth/logout',
      ME: '/api/auth/me',
      REFRESH: '/api/auth/refresh',
    },
    TEAMS: {
      LIST: '/api/teams',
      CREATE: '/api/teams',
      UPDATE: '/api/teams/[id]',
      DELETE: '/api/teams/[id]',
      MEMBERS: '/api/teams/[id]/members',
      INVITE: '/api/teams/[id]/invite',
    },
    STRIPE: {
      CHECKOUT: '/api/stripe/checkout',
      PORTAL: '/api/stripe/portal',
      WEBHOOK: '/api/stripe/webhook',
    },
    BILLING: {
      SUBSCRIPTION: '/api/billing/subscription',
      INVOICES: '/api/billing/invoices',
    },
  },
} as const;

export const TEAM_ROLES = {
  OWNER: 'OWNER',
  ADMIN: 'ADMIN',
  MEMBER: 'MEMBER',
} as const;

export const SUBSCRIPTION_STATUS = {
  INACTIVE: 'INACTIVE',
  ACTIVE: 'ACTIVE',
  PAST_DUE: 'PAST_DUE',
  CANCELED: 'CANCELED',
  UNPAID: 'UNPAID',
  TRIALING: 'TRIALING',
} as const;

export const PLANS = {
  FREE: {
    id: 'FREE',
    name: 'Free',
    price: 0,
    features: ['Up to 3 team members', '1 GB storage', 'Basic support'],
  },
  PRO: {
    id: 'PRO',
    name: 'Pro',
    price: 29,
    features: [
      'Up to 25 team members',
      '10 GB storage',
      'Priority support',
      'Advanced analytics',
    ],
  },
  ENTERPRISE: {
    id: 'ENTERPRISE',
    name: 'Enterprise',
    price: 99,
    features: [
      'Unlimited team members',
      '100 GB storage',
      '24/7 phone support',
      'Custom integrations',
      'SLA guarantee',
    ],
  },
} as const;

export const STRIPE_PRICE_IDS = {
  PRO: 'price_pro_monthly',
  ENTERPRISE: 'price_enterprise_monthly',
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const;

export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  TEAM_NAME_MIN_LENGTH: 3,
  TEAM_NAME_MAX_LENGTH: 50,
  INVITE_TOKEN_LENGTH: 32,
  INVITE_EXPIRY_HOURS: 168, // 7 days
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;

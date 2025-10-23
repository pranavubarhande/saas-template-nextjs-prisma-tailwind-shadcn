export interface User {
  id: string;
  email: string;
  name: string | null;
  password: string; // Only used internally, not exposed in API responses
  role: Role;
  avatar: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Team {
  id: string;
  name: string;
  description: string | null;
  slug: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
  owner: User;
  members: TeamMember[];
  _count?: {
    members: number;
  };
}

export interface TeamMember {
  id: string;
  userId: string;
  teamId: string;
  role: TeamRole;
  joinedAt: Date;
  user: User;
}

export interface TeamInvite {
  id: string;
  email: string;
  role: TeamRole;
  token: string;
  teamId: string;
  invitedBy: string;
  expiresAt: Date;
  createdAt: Date;
  team: Team;
}

export interface Subscription {
  id: string;
  userId: string | null;
  teamId: string | null;
  stripeSubscriptionId: string;
  stripeCustomerId: string | null;
  status: SubscriptionStatus;
  plan: Plan;
  currentPeriodStart: Date | null;
  currentPeriodEnd: Date | null;
  cancelAtPeriodEnd: boolean;
  createdAt: Date;
  updatedAt: Date;
  user?: User | null;
  team?: Team | null;
}

export interface Invoice {
  id: string;
  userId: string;
  subscriptionId: string | null;
  stripeInvoiceId: string | null;
  amount: number;
  currency: string;
  status: string;
  invoicePdf: string | null;
  hostedInvoiceUrl: string | null;
  createdAt: Date;
  user: User;
  subscription?: Subscription | null;
}

export type Role = 'USER' | 'ADMIN' | 'SUPER_ADMIN';
export type TeamRole = 'OWNER' | 'ADMIN' | 'MEMBER';
export type SubscriptionStatus =
  | 'INACTIVE'
  | 'ACTIVE'
  | 'PAST_DUE'
  | 'CANCELED'
  | 'UNPAID'
  | 'TRIALING';
export type Plan = 'FREE' | 'PRO' | 'ENTERPRISE';

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  role: Role;
  avatar: string | null;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
}

// Team Types
export interface CreateTeamData {
  name: string;
  description?: string;
}

export interface UpdateTeamData {
  name?: string;
  description?: string;
}

export interface InviteMemberData {
  email: string;
  role: TeamRole;
}

// Subscription Types
export interface CreateSubscriptionData {
  priceId: string;
  teamId?: string;
}

export interface UpdateSubscriptionData {
  cancelAtPeriodEnd?: boolean;
}

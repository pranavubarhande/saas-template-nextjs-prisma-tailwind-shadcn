import { Team, TeamMember, TeamInvite } from './team.types';

export interface User {
  id: string;
  email: string;
  name: string | null;
  password: string; // Only used internally, not exposed in API responses
  role: Role;
  avatar: string | null;
  createdAt: Date;
  updatedAt: Date;
  teamMemberships?: TeamMember[];
  ownedTeams?: Team[];
  pendingInvites?: TeamInvite[];
}

export type Role = 'USER' | 'ADMIN' | 'SUPER_ADMIN';

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
  pendingInvites?: TeamInvite[];
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
}

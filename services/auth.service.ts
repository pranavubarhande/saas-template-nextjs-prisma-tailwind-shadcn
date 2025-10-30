import { TeamInvite } from '@/types/team.types';
import axiosInstance from './axiosInstance.service';
import {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
  AuthUser,
} from '@/types/user.types';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>(
      '/auth/login',
      credentials
    );
    return response.data;
  },

  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>(
      '/auth/register',
      credentials
    );
    return response.data;
  },

  getCurrentUser: async (): Promise<{ user: AuthUser, pendingInvites: TeamInvite[] }> => {
    const response = await axiosInstance.get<{ user: AuthUser, pendingInvites: TeamInvite[] }>('/users/me');
    if (!response.data.user) {
      throw new Error('Failed to get user');
    }
    return response.data;
  },

  logout: async (): Promise<void> => {
    localStorage.clear();
  },
};

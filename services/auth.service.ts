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

  getCurrentUser: async (): Promise<AuthUser> => {
    const response = await axiosInstance.get<{ user: AuthUser }>('/auth/me');
    if (!response.data.user) {
      throw new Error('Failed to get user');
    }
    return response.data.user;
  },

  logout: async (): Promise<void> => {
    localStorage.clear();
  },
};

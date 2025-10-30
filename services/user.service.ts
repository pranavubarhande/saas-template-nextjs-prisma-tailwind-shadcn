import axiosInstance from './axiosInstance.service';
import { AuthUser } from '@/types/user.types';

export const userService = {
  getUserSettings: async (): Promise<AuthUser> => {
    const response = await axiosInstance.get<{ user: AuthUser }>('/users/me');
    if (!response.data.user) {
      throw new Error('Failed to get user settings');
    }
    return response.data.user;
  },

  updateProfile: async (data: {
    name?: string;
    email?: string;
  }): Promise<AuthUser> => {
    const response = await axiosInstance.patch<{ user: AuthUser }>(
      '/users/me',
      data
    );
    if (!response.data.user) {
      throw new Error('Failed to update profile');
    }
    return response.data.user;
  },

  updatePassword: async (data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<void> => {
    await axiosInstance.put('/users/me', data);
  },

  deleteAccount: async (): Promise<void> => {
    await axiosInstance.delete('/users/me');
  },
};

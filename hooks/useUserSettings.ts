import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { userService } from '@/services/user.service';

// Get current user settings
export function useUserSettings() {
  return useQuery({
    queryKey: ['user-settings'],
    queryFn: userService.getUserSettings,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Update profile mutation
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userService.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-settings'] });
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
  });
}

// Update password mutation
export function useUpdatePassword() {
  return useMutation({
    mutationFn: userService.updatePassword,
  });
}

// Delete account mutation
export function useDeleteAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userService.deleteAccount,
    onSuccess: () => {
      // Clear all cached data and logout
      queryClient.clear();
      localStorage.removeItem('token');
      window.location.href = '/login';
    },
  });
}

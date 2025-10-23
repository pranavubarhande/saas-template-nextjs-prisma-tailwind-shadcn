import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/services/auth.service';

// Register mutation
export function useRegister() {
  return useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
    },
  });
}

// Login mutation
export function useLogin() {
  return useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      console.log(data);
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
    },
  });
}

// Get current user query
export function useCurrentUser() {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: authService.getCurrentUser,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Logout mutation
export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      // Clear token from localStorage
      localStorage.clear();

      // Clear all cached data
      queryClient.clear();

      // Redirect to login page
      window.location.href = '/login';
    },
  });
}

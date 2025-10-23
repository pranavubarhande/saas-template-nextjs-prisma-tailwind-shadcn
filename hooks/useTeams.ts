import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { UpdateTeamData, InviteMemberData } from '@/types';
import { teamsService } from '@/services/teams.service';

// Get user's teams
export function useTeams() {
  return useQuery({
    queryKey: ['teams'],
    queryFn: teamsService.getTeams,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Get specific team
export function useTeam(teamId: string) {
  return useQuery({
    queryKey: ['team', teamId],
    queryFn: () => teamsService.getTeam(teamId),
    enabled: !!teamId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Create team mutation
export function useCreateTeam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: teamsService.createTeam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
  });
}

// Update team mutation
export function useUpdateTeam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ teamId, data }: { teamId: string; data: UpdateTeamData }) =>
      teamsService.updateTeam(teamId, data),
    onSuccess: (updatedTeam) => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      queryClient.invalidateQueries({ queryKey: ['team', updatedTeam.id] });
    },
  });
}

// Delete team mutation
export function useDeleteTeam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: teamsService.deleteTeam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
  });
}

// Get team members
export function useTeamMembers(teamId: string) {
  return useQuery({
    queryKey: ['team-members', teamId],
    queryFn: () => teamsService.getTeamMembers(teamId),
    enabled: !!teamId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Invite member mutation
export function useInviteMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      teamId,
      data,
    }: {
      teamId: string;
      data: InviteMemberData;
    }) => teamsService.inviteMember(teamId, data),
    onSuccess: (_, { teamId }) => {
      queryClient.invalidateQueries({ queryKey: ['team-members', teamId] });
    },
  });
}

// Remove member mutation
export function useRemoveMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ teamId, userId }: { teamId: string; userId: string }) =>
      teamsService.removeMember(teamId, userId),
    onSuccess: (_, { teamId }) => {
      queryClient.invalidateQueries({ queryKey: ['team-members', teamId] });
    },
  });
}

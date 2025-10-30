import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { UpdateTeamData, InviteMemberData, TeamInvite } from '@/types/team.types';
import { teamsService } from '@/services/teams.service';

export const useTeams = () => {
  return useQuery({
    queryKey: ['teams'],
    queryFn: teamsService.getTeams,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useTeam = (teamId: string) => {
  return useQuery({
    queryKey: ['team', teamId],
    queryFn: () => teamsService.getTeam(teamId),
    enabled: !!teamId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateTeam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: teamsService.createTeam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
  });
};

export const useUpdateTeam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ teamId, data }: { teamId: string; data: UpdateTeamData }) =>
      teamsService.updateTeam(teamId, data),
    onSuccess: (updatedTeam) => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      queryClient.invalidateQueries({ queryKey: ['team', updatedTeam.id] });
    },
  });
};

export const useDeleteTeam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: teamsService.deleteTeam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
  });
};

export const useTeamMembers = (teamId: string) => {
  return useQuery({
    queryKey: ['team-members', teamId],
    queryFn: () => teamsService.getTeamMembers(teamId),
    enabled: !!teamId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useTeamInvites = (teamId: string) => {
  return useQuery<TeamInvite[]>({
    queryKey: ['team-invites', teamId],
    queryFn: () => teamsService.getTeamInvites(teamId),
    enabled: !!teamId,
  });
}


export const useInviteMember = () => {
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
      queryClient.invalidateQueries({ queryKey: ['team-invites', teamId] });
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
  });
};

export const useRemoveMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ teamId, userId }: { teamId: string; userId: string }) =>
      teamsService.removeMember(teamId, userId),
    onSuccess: (_, { teamId }) => {
      queryClient.invalidateQueries({ queryKey: ['team-members', teamId] });
    },
  });
};

export const useAcceptInvite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ teamId, inviteId }: { teamId: string; inviteId: string }) =>
      teamsService.acceptInvite(teamId, inviteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
  });
};

import axiosInstance from './axiosInstance.service';
import {
  Team,
  CreateTeamData,
  UpdateTeamData,
  TeamMember,
  InviteMemberData,
  TeamInvite,
} from '@/types/team.types';

export const teamsService = {
  getTeams: async (): Promise<Team[]> => {
    const response = await axiosInstance.get<{ teams: Team[] }>('/teams');
    return response.data.teams;
  },

  getTeam: async (teamId: string): Promise<Team> => {
    const response = await axiosInstance.get<{ team: Team }>(
      `/teams/${teamId}`
    );
    return response.data.team;
  },

  createTeam: async (teamData: CreateTeamData): Promise<Team> => {
    const response = await axiosInstance.post<{ team: Team }>(
      '/teams',
      teamData
    );
    return response.data.team;
  },

  updateTeam: async (teamId: string, data: UpdateTeamData): Promise<Team> => {
    const response = await axiosInstance.patch<{ team: Team }>(
      `/teams/${teamId}`,
      data
    );
    return response.data.team;
  },

  deleteTeam: async (teamId: string): Promise<void> => {
    await axiosInstance.delete(`/teams/${teamId}`);
  },

  getTeamMembers: async (teamId: string): Promise<TeamMember[]> => {
    const response = await axiosInstance.get<{ members: TeamMember[] }>(
      `/teams/${teamId}/members`
    );
    return response.data.members;
  },

  getTeamInvites: async (teamId: string): Promise<TeamInvite[]> => {
    const response = await axiosInstance.get<TeamInvite[]>(`/teams/${teamId}/invites`);
    return response.data;
  },

  inviteMember: async (
    teamId: string,
    data: InviteMemberData
  ): Promise<void> => {
    await axiosInstance.post(`/teams/${teamId}/members`, data);
  },

  removeMember: async (teamId: string, userId: string): Promise<void> => {
    await axiosInstance.delete(`/teams/${teamId}/members/${userId}`);
  },
};

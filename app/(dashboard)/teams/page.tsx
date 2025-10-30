'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Plus,
  MoreHorizontal,
  Users,
  Calendar,
  Edit,
  Trash2,
  UserPlus,
  Crown,
  Shield,
  User,
} from 'lucide-react';
import {
  useTeams,
  useCreateTeam,
  useDeleteTeam,
  useInviteMember,
  useUpdateTeam,
  useTeamMembers,
  useTeamInvites,
  useAcceptInvite,
} from '@/hooks/useTeams';
import { Mail, Clock, Check } from 'lucide-react';
import { useState } from 'react';
import { Team, TeamMember, TeamRole, TeamInvite } from '@/types/team.types';
import { toast } from 'sonner';
import { useCurrentUser } from '@/hooks/useAuth';

function CreateTeamDialog() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const createTeam = useCreateTeam();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTeam.mutateAsync(formData);
      setOpen(false);
      setFormData({ name: '', description: '' });
      toast.success('Team created successfully!');
    } catch {
      toast.error('Failed to create team');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Team
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Team</DialogTitle>
          <DialogDescription>
            Create a new team to collaborate with others.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="col-span-3"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={createTeam.isPending}>
              {createTeam.isPending ? 'Creating...' : 'Create Team'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function EditTeamDialog({ team }: { team: Team }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: team.name,
    description: team.description || '',
  });
  const updateTeam = useUpdateTeam();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateTeam.mutateAsync({ teamId: team.id, data: formData });
      setOpen(false);
      toast.success('Team updated successfully!');
    } catch {
      toast.error('Failed to update team');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Team</DialogTitle>
          <DialogDescription>Update your team information.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                Name
              </Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-description" className="text-right">
                Description
              </Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="col-span-3"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={updateTeam.isPending}>
              {updateTeam.isPending ? 'Updating...' : 'Update Team'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function InviteMemberDialog({ team }: { team: Team }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    role: 'MEMBER' as TeamRole,
  });
  const inviteMember = useInviteMember();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await inviteMember.mutateAsync({ teamId: team.id, data: formData });
      setOpen(false);
      setFormData({ email: '', role: 'MEMBER' });
      toast.success('Invitation sent successfully!');
    } catch {
      toast.error('Failed to send invitation');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <UserPlus className="mr-2 h-4 w-4" />
          Invite Member
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Invite Team Member</DialogTitle>
          <DialogDescription>
            Invite a new member to join {team.name}.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="invite-email" className="text-right">
                Email
              </Label>
              <Input
                id="invite-email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                className="col-span-3"
                placeholder="user@example.com"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="invite-role" className="text-right">
                Role
              </Label>
              <Select
                value={formData.role}
                onValueChange={(value: TeamRole) =>
                  setFormData((prev) => ({ ...prev, role: value }))
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MEMBER">Member</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={inviteMember.isPending}>
              {inviteMember.isPending ? 'Sending...' : 'Send Invitation'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function TeamActions({ team }: { team: Team }) {
  const deleteTeam = useDeleteTeam();

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete ${team.name}?`)) {
      try {
        await deleteTeam.mutateAsync(team.id);
        toast.success('Team deleted successfully!');
      } catch {
        toast.error('Failed to delete team');
      }
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <EditTeamDialog team={team} />
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive" onClick={handleDelete}>
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function TeamMembersDialog({ team }: { team: Team }) {
  const [open, setOpen] = useState(false);
  const { data: members, isLoading: isLoadingMembers } = useTeamMembers(team.id);
  const { data: invites, isLoading: isLoadingInvites } = useTeamInvites(team.id);

  const getRoleIcon = (role: TeamRole) => {
    switch (role) {
      case 'OWNER':
        return <Crown className="h-4 w-4" />;
      case 'ADMIN':
        return <Shield className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getRoleBadgeVariant = (role: TeamRole) => {
    switch (role) {
      case 'OWNER':
        return 'default';
      case 'ADMIN':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Users className="mr-2 h-4 w-4" />
          Members ({team._count?.members || 0})
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Team Members - {team.name}</DialogTitle>
          <DialogDescription>
            Manage team members and their roles.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 w-full overflow-scroll">
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium mb-4">Team Members</h3>
              {isLoadingMembers ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-muted-foreground">Loading members...</div>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Member</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Joined</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {members?.map((member: TeamMember) => (
                      <TableRow key={member.id}>
                        <TableCell className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                            {member.user.avatar ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={member.user.avatar}
                                alt={member.user.name || member.user.email}
                                className="h-8 w-8 rounded-full"
                              />
                            ) : (
                              <span className="text-sm font-medium">
                                {(member.user.name || member.user.email)
                                  .charAt(0)
                                  .toUpperCase()}
                              </span>
                            )}
                          </div>
                          <div>
                            <div className="font-medium">
                              {member.user.name || 'Unknown'}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {member.user.email}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={getRoleBadgeVariant(member.role)}
                            className="flex items-center gap-1 w-fit"
                          >
                            {getRoleIcon(member.role)}
                            {member.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-muted-foreground">
                            {new Date(member.joinedAt).toLocaleDateString()}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Pending Invitations</h3>
              {isLoadingInvites ? (
                <div className="flex items-center justify-center py-4">
                  <div className="text-muted-foreground">Loading invites...</div>
                </div>
              ) : invites?.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  No pending invitations
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Invited On</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invites?.map((invite) => (
                      <TableRow key={invite.id}>
                        <TableCell className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                            <Mail className="h-4 w-4" />
                          </div>
                          <div className="font-medium">{invite.email}</div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={getRoleBadgeVariant(invite.role as TeamRole)}
                            className="flex items-center gap-1 w-fit"
                          >
                            {getRoleIcon(invite.role as TeamRole)}
                            {invite.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-muted-foreground">
                            {new Date(invite.createdAt).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="gap-1">
                            {invite.accepted ? <Check className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                            {invite.accepted ? 'Accepted' : 'Pending'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function PendingInvitesSection() {
  const { data: userData } = useCurrentUser();
  const acceptInvite = useAcceptInvite();

  const handleAcceptInvite = async (teamId: string, inviteId: string) => {
    try {
      await acceptInvite.mutateAsync({ teamId, inviteId });
      toast.success('Invite accepted successfully!');
    } catch {
      toast.error('Failed to accept invite');
    }
  };

  if (!userData?.pendingInvites || userData.pendingInvites.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Pending Team Invites
        </CardTitle>
        <CardDescription>
          You have been invited to join these teams.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {userData.pendingInvites.map((invite: TeamInvite) => (
            <div
              key={invite.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-medium">{invite.team.name}</div>
                  <div className="text-sm text-muted-foreground">
                    Invited as {invite.role.toLowerCase()}
                  </div>
                </div>
              </div>
              <Button
                onClick={() => handleAcceptInvite(invite.teamId, invite.id)}
                disabled={acceptInvite.isPending}
                size="sm"
              >
                <Check className="mr-2 h-4 w-4" />
                {acceptInvite.isPending ? 'Accepting...' : 'Accept'}
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function TeamCard({ team }: { team: Team }) {
  const { data: userData } = useCurrentUser();

  // Find the current user's membership in this team
  const userMembership = team.members.find(member => member.userId === userData?.user?.id);
  const isAdminOrOwner = userMembership?.role === 'ADMIN' || userMembership?.role === 'OWNER' || team.ownerId === userData?.user?.id;

  return (
    <Card className="relative">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{team.name}</CardTitle>
          {isAdminOrOwner && <TeamActions team={team} />}
        </div>
        {team.description && (
          <CardDescription>{team.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            {team._count?.members || 0} members
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {new Date(team.createdAt).toLocaleDateString()}
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <TeamMembersDialog team={team} />
          {isAdminOrOwner && <InviteMemberDialog team={team} />}
        </div>
      </CardContent>
    </Card>
  );
}

export default function TeamsPage() {
  const { data: teams, isLoading } = useTeams();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-muted-foreground">Loading teams...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Teams</h1>
          <p className="text-muted-foreground">
            Manage your teams and collaborate with others.
          </p>
        </div>
        <CreateTeamDialog />
      </div>

      <PendingInvitesSection />

      {teams && teams.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {teams.map((team) => (
            <TeamCard key={team.id} team={team} />
          ))}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>No Teams Yet</CardTitle>
            <CardDescription>
              Create your first team to start collaborating with others.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CreateTeamDialog />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

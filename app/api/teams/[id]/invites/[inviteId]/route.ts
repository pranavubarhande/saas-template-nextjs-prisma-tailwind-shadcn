import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/middlewares/auth.middleware';
import { prisma } from '@/lib/prisma';

export const POST = withAuth(async (
  request: NextRequest,
  user,
  { params }: { params: Promise<{ id: string; inviteId: string }> }
) => {
  try {
    const { id: teamId, inviteId } = await params;

    // Find the invite
    const invite = await prisma.teamInvite.findFirst({
      where: {
        id: inviteId,
        teamId,
        email: user.email,
        accepted: false,
      },
      include: {
        team: true,
      },
    });

    if (!invite) {
      return NextResponse.json(
        { error: 'Invite not found or already accepted' },
        { status: 404 }
      );
    }

    // Check if user is already a member
    const existingMember = await prisma.teamMember.findFirst({
      where: {
        teamId,
        userId: user.id,
      },
    });

    if (existingMember) {
      return NextResponse.json(
        { error: 'You are already a member of this team' },
        { status: 400 }
      );
    }

    // Accept the invite in a transaction
    await prisma.$transaction(async (tx) => {
      // Update invite as accepted
      await tx.teamInvite.update({
        where: { id: inviteId },
        data: { accepted: true },
      });

      // Add user as team member
      await tx.teamMember.create({
        data: {
          userId: user.id,
          teamId,
          role: invite.role,
        },
      });
    });

    return NextResponse.json({
      message: 'Invite accepted successfully',
      team: invite.team,
    });
  } catch (error) {
    console.error('Error accepting team invite:', error);
    return NextResponse.json(
      { error: 'Failed to accept team invite' },
      { status: 500 }
    );
  }
});
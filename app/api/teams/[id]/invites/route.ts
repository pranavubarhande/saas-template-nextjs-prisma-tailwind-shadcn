import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/middlewares/auth.middleware';
import { prisma } from '@/lib/prisma';

export const GET = withAuth(async (
  request: NextRequest,
  user,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id: teamId } = await params;

    // Check if user has access to the team
    const teamMember = await prisma.teamMember.findFirst({
      where: {
        teamId,
        userId: user.id,
      },
    });

    if (!teamMember) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    // Get all invites for the team
    const invites = await prisma.teamInvite.findMany({
      where: { teamId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(invites);
  } catch (error) {
    console.error('Error fetching team invites:', error);
    return NextResponse.json(
      { error: 'Failed to fetch team invites' },
      { status: 500 }
    );
  }
});

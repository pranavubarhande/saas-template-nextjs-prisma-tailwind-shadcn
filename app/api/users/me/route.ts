import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { withAuth } from '@/middlewares/auth.middleware';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';

const updateProfileSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  email: z.string().email().optional(),
});

const updatePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8),
});

export const GET = withAuth(async (request: NextRequest, user) => {
  try {
    const userWithInvites = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        teamMemberships: {
          include: {
            team: true,
          },
        },
        ownedTeams: {
          include: {
            members: {
              include: {
                user: true,
              },
            },
            _count: {
              select: {
                members: true,
              },
            },
          },
        },
      },
    });

    // Get pending invites for this user
    const pendingInvites = await prisma.teamInvite.findMany({
      where: {
        email: user.email,
        accepted: false,
        expiresAt: {
          gt: new Date(),
        },
      },
      include: {
        team: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      user: userWithInvites,
      pendingInvites,
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user data' },
      { status: 500 }
    );
  }
});

export const PATCH = withAuth(async (request: NextRequest, user) => {
  try {
    const body = await request.json();

    // Update profile
    if (body.name || body.email) {
      const updateData = updateProfileSchema.parse(body);

      // Check if email is already taken by another user
      if (updateData.email && updateData.email !== user.email) {
        const existingUser = await prisma.user.findUnique({
          where: { email: updateData.email },
        });

        if (existingUser) {
          return NextResponse.json(
            { error: 'Email is already taken' },
            { status: 400 }
          );
        }
      }

      // Update user
      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: updateData,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          avatar: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return NextResponse.json({
        user: updatedUser,
        message: 'Profile updated successfully',
      });
    }

    return NextResponse.json(
      { error: 'No valid fields to update' },
      { status: 400 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', message: error.issues[0].message },
        { status: 400 }
      );
    }

    console.error('Update user settings error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});

export const PUT = withAuth(async (request: NextRequest, user) => {
  try {
    const body = await request.json();
    const { currentPassword, newPassword } = updatePasswordSchema.parse(body);

    // Verify current password
    const { verifyPassword } = await import('@/lib/auth');
    const isValidPassword = await verifyPassword(
      currentPassword,
      user.password
    );

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 400 }
      );
    }

    // Hash new password and update
    const hashedPassword = await hashPassword(newPassword);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    return NextResponse.json({
      message: 'Password updated successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', message: error.issues[0].message },
        { status: 400 }
      );
    }

    console.error('Update password error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});

export const DELETE = withAuth(async (request: NextRequest, user) => {
  try {
    // Delete user (this will cascade delete related records)
    await prisma.user.delete({
      where: { id: user.id },
    });

    // Clear token from client side
    const response = NextResponse.json({
      message: 'Account deleted successfully',
    });

    return response;
  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});

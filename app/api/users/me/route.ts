import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { authMiddleware } from '@/middlewares/auth.middleware';
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

export async function GET(request: NextRequest) {
  try {
    const authResult = await authMiddleware(request);

    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { user } = authResult;

    // Return user data without password
    const { password, ...userWithoutPassword } = user;

    return NextResponse.json({
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('Get user settings error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const authResult = await authMiddleware(request);

    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { user } = authResult;
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
      });

      const { password, ...userWithoutPassword } = updatedUser;

      return NextResponse.json({
        user: userWithoutPassword,
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
}

export async function PUT(request: NextRequest) {
  try {
    const authResult = await authMiddleware(request);

    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { user } = authResult;
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
}

export async function DELETE(request: NextRequest) {
  try {
    const authResult = await authMiddleware(request);

    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { user } = authResult;

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
}

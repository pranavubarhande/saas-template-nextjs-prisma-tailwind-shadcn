import { NextRequest, NextResponse } from 'next/server';
import { getUserFromToken } from '@/lib/auth';

export async function authMiddleware(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Authorization token required' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const user = await getUserFromToken(token);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    return { user };
  } catch (error) {
    console.error('Auth middleware error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export function withAuth(
  handler: (request: NextRequest, user: unknown) => Promise<NextResponse>
) {
  return async (request: NextRequest) => {
    const authResult = await authMiddleware(request);

    if (authResult instanceof NextResponse) {
      return authResult;
    }

    return handler(request, authResult.user);
  };
}

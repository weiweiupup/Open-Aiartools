import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth-middleware';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { users } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    // 首先尝试NextAuth session
    const session = await auth();
    if (session?.user?.email) {
      // 从数据库获取完整的用户信息
      const user = await db.query.users.findFirst({
        where: eq(users.email, session.user.email),
      });

      if (user) {
        return NextResponse.json({
          user: {
            id: user.id,
            email: user.email,
            username: user.username,
            isEmailVerified: user.isEmailVerified,
            credits: user.credits || 0,
            subscriptionCredits: user.subscriptionCredits || 0,
            subscriptionStatus: user.subscriptionStatus,
            subscriptionPlan: user.subscriptionPlan,
            subscriptionStartDate: user.subscriptionStartDate?.toISOString() || null,
            subscriptionEndDate: user.subscriptionEndDate?.toISOString() || null,
          },
        });
      }
    }

    // 如果NextAuth session不存在，尝试我们自己的JWT token
    const user = await getCurrentUser(request);
    
    if (!user) {
      return NextResponse.json(
        { error: '未认证用户' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        isEmailVerified: user.isEmailVerified,
        credits: user.credits || 0,
        subscriptionCredits: user.subscriptionCredits || 0,
        subscriptionStatus: user.subscriptionStatus,
        subscriptionPlan: user.subscriptionPlan,
        subscriptionStartDate: user.subscriptionStartDate?.toISOString() || null,
        subscriptionEndDate: user.subscriptionEndDate?.toISOString() || null,
      },
    });
  } catch (error) {
    console.error('获取用户信息错误:', error);
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
} 
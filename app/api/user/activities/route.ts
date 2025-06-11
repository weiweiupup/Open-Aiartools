import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { userActivities, users } from '@/lib/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    // 验证用户登录状态
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      );
    }

    // 获取用户ID
    const user = await db.query.users.findFirst({
      where: eq(users.email, session.user.email),
    });

    if (!user) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404 }
      );
    }

    // 获取查询参数
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    // 查询用户活动记录
    const activities = await db
      .select()
      .from(userActivities)
      .where(eq(userActivities.userId, user.id))
      .orderBy(desc(userActivities.createdAt))
      .limit(limit)
      .offset(offset);

    // 格式化活动记录
    const formattedActivities = activities.map(activity => ({
      id: activity.id,
      type: activity.type,
      description: activity.description,
      creditAmount: activity.creditAmount,
      createdAt: activity.createdAt,
      metadata: activity.metadata ? JSON.parse(activity.metadata) : null
    }));

    return NextResponse.json({
      success: true,
      activities: formattedActivities,
      pagination: {
        page,
        limit,
        hasMore: activities.length === limit
      }
    });

  } catch (error) {
    console.error('获取活动记录失败:', error);
    return NextResponse.json(
      { error: '获取活动记录失败' },
      { status: 500 }
    );
  }
} 
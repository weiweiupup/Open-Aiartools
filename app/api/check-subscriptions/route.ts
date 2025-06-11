import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users, userActivities } from '@/lib/schema';
import { eq, and, lt } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    console.log('检查过期订阅...');

    // 查找所有过期的订阅
    const expiredSubscriptions = await db.query.users.findMany({
      where: and(
        eq(users.subscriptionStatus, 'active'),
        lt(users.subscriptionEndDate, new Date())
      ),
    });

    let updatedCount = 0;

    for (const user of expiredSubscriptions) {
      // 清零订阅积分并更新订阅状态
      await db.update(users)
        .set({
          subscriptionCredits: 0,
          subscriptionStatus: 'expired',
          updatedAt: new Date()
        })
        .where(eq(users.id, user.id));

      // 记录订阅过期活动
      await db.insert(userActivities).values({
        userId: user.id,
        type: 'subscription_expired',
        description: 'credit_description.subscription_expired',
        creditAmount: -(user.subscriptionCredits || 0),
        metadata: JSON.stringify({
          expiredDate: new Date().toISOString(),
          previousCredits: user.subscriptionCredits || 0,
          planType: user.subscriptionPlan || 'pro'
        }),
        createdAt: new Date(),
      });

      updatedCount++;
      console.log(`用户 ${user.email} 的订阅已过期，积分已清零`);
    }

    return NextResponse.json({
      success: true,
      message: `已处理 ${updatedCount} 个过期订阅`,
      updatedCount
    });

  } catch (error: any) {
    console.error('检查订阅失败:', error);
    return NextResponse.json(
      { error: error.message || '检查订阅失败' },
      { status: 500 }
    );
  }
}

// 也支持 GET 请求进行手动检查
export async function GET(request: NextRequest) {
  return POST(request);
} 
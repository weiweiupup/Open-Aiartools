import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { db } from '@/lib/db';
import { users, userActivities } from '@/lib/schema';
import { eq, and, like } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json(
        { error: '缺少会话ID' },
        { status: 400 }
      );
    }

    // 获取 Stripe 会话信息
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session) {
      return NextResponse.json(
        { error: '无效的会话ID' },
        { status: 404 }
      );
    }

    // 检查支付状态
    if (session.payment_status !== 'paid') {
      return NextResponse.json(
        { error: '支付未完成' },
        { status: 400 }
      );
    }

    const userId = session.metadata?.userId;
    if (!userId) {
      return NextResponse.json(
        { error: '用户ID缺失' },
        { status: 400 }
      );
    }

    // 获取用户信息
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404 }
      );
    }

    // 检查是否已经处理过此订阅 - 修改检查逻辑
    const existingActivity = await db.query.userActivities.findFirst({
      where: and(
        eq(userActivities.userId, userId),
        like(userActivities.metadata, `%"sessionId":"${sessionId}"%`)
      ),
    });

    if (!existingActivity) {
      const credits = parseInt(session.metadata?.credits || '800');
      const planType = session.metadata?.planType || 'subscription';
      
      // 检查用户是否已经有活跃的订阅
      if (planType === 'subscription') {
        const hasActiveSubscription = user.subscriptionStatus === 'active' && 
                                    user.subscriptionEndDate && 
                                    new Date(user.subscriptionEndDate) > new Date();

        if (hasActiveSubscription) {
          return NextResponse.json(
            { error: 'alreadySubscribed' },
            { status: 400 }
          );
        }
      }
      
      // 计算订阅到期时间（一个月后）
      const subscriptionStartDate = new Date();
      const subscriptionEndDate = new Date();
      subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + 1);

      if (planType === 'subscription') {
        // 处理订阅模式：将积分添加到订阅积分字段
        await db.update(users)
          .set({ 
            subscriptionCredits: credits, // 重置订阅积分
            subscriptionStatus: 'active',
            subscriptionPlan: 'pro',
            subscriptionStartDate: subscriptionStartDate,
            subscriptionEndDate: subscriptionEndDate,
            stripeCustomerId: typeof session.customer === 'string' ? session.customer : null,
            updatedAt: new Date()
          })
          .where(eq(users.id, userId));

        // 记录订阅积分活动 - 使用唯一标识符避免重复
        await db.insert(userActivities).values({
          userId: userId,
          type: 'subscription_activated',
          description: 'credit_description.subscription_activated',
          creditAmount: credits,
          metadata: JSON.stringify({ 
            sessionId,
            planType: 'subscription',
            planId: 'pro',
            subscriptionEndDate: subscriptionEndDate.toISOString(),
            source: 'verify-payment-api', // 标识来源
            timestamp: new Date().toISOString()
          }),
          createdAt: new Date(),
        });
      } else {
        // 处理一次性支付：添加到永久积分
        await db.update(users)
          .set({ 
            credits: user.credits + credits,
            updatedAt: new Date()
          })
          .where(eq(users.id, userId));

        // 记录积分活动
        await db.insert(userActivities).values({
          userId: userId,
          type: 'credit_add',
          description: 'credit_description.purchase_credits',
          creditAmount: credits,
          metadata: JSON.stringify({ 
            sessionId,
            planType: 'test_payment',
            planId: 'pro',
            source: 'verify-payment-api', // 标识来源
            timestamp: new Date().toISOString()
          }),
          createdAt: new Date(),
        });
      }
    } else {
      console.log(`Session ${sessionId} has already been processed, skipping duplicate processing`);
    }

    return NextResponse.json({
      success: true,
      session: {
        id: session.id,
        amount_total: session.amount_total,
        currency: session.currency,
        customer_email: session.customer_email,
        payment_status: session.payment_status,
      }
    });

  } catch (error: any) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { error: error.message || '验证支付失败' },
      { status: 500 }
    );
  }
} 
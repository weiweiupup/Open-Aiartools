import { db } from '@/lib/db';
import { users, userActivities } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export interface CreditDeductionResult {
  success: boolean;
  message: string;
  user?: {
    id: string;
    credits: number;
  };
  credits?: {
    deducted: number;
    remaining: number;
  };
}

export interface ActivityRecord {
  id: string;
  type: string;
  description: string;
  creditAmount: number | null;
  metadata: string | null;
  createdAt: Date | null;
}

// 扣除用户积分
export async function deductCredits(
  userId: string, 
  amount: number, 
  description: string,
  metadata?: any
): Promise<CreditDeductionResult> {
  try {
    // 首先获取用户当前积分
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    
    if (!user) {
      return {
        success: false,
        message: '用户不存在'
      };
    }

    // 计算总积分（订阅积分 + 永久积分）
    const totalCredits = (user.subscriptionCredits || 0) + (user.credits || 0);
    
    // 检查积分是否足够
    if (totalCredits < amount) {
      return {
        success: false,
        message: '积分不足'
      };
    }

    // 优先使用订阅积分
    let remainingAmount = amount;
    let newSubscriptionCredits = user.subscriptionCredits || 0;
    let newPermanentCredits = user.credits || 0;
    
    // 先扣除订阅积分
    if (remainingAmount > 0 && newSubscriptionCredits > 0) {
      const deductFromSubscription = Math.min(remainingAmount, newSubscriptionCredits);
      newSubscriptionCredits -= deductFromSubscription;
      remainingAmount -= deductFromSubscription;
    }
    
    // 如果还有剩余需要扣除，则从永久积分中扣除
    if (remainingAmount > 0) {
      newPermanentCredits -= remainingAmount;
    }

    // 更新用户积分
    await db
      .update(users)
      .set({ 
        credits: newPermanentCredits,
        subscriptionCredits: newSubscriptionCredits,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId));

    // 记录活动
    await db.insert(userActivities).values({
      userId: userId,
      type: 'credit_deduct',
      description: description,
      creditAmount: -amount,
      metadata: metadata ? JSON.stringify({
        ...metadata,
        deductedFromSubscription: (user.subscriptionCredits || 0) - newSubscriptionCredits,
        deductedFromPermanent: (user.credits || 0) - newPermanentCredits
      }) : null
    });

    return {
      success: true,
      message: '积分扣除成功',
      user: {
        id: userId,
        credits: newPermanentCredits + newSubscriptionCredits
      },
      credits: {
        deducted: amount,
        remaining: newPermanentCredits + newSubscriptionCredits
      }
    };
  } catch (error) {
    console.error('扣除积分失败:', error);
    return {
      success: false,
      message: '积分扣除失败'
    };
  }
}

// 增加用户积分
export async function addCredits(
  userId: string,
  amount: number,
  description: string,
  metadata?: any,
  creditType: 'permanent' | 'subscription' = 'permanent'
): Promise<CreditDeductionResult> {
  try {
    // 首先获取用户当前积分
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    
    if (!user) {
      return {
        success: false,
        message: '用户不存在'
      };
    }

    // 根据积分类型增加相应的积分
    let updateData: any = { updatedAt: new Date() };
    
    if (creditType === 'subscription') {
      // 添加订阅积分
      const newSubscriptionCredits = (user.subscriptionCredits || 0) + amount;
      updateData.subscriptionCredits = newSubscriptionCredits;
    } else {
      // 添加永久积分
      const newCredits = user.credits + amount;
      updateData.credits = newCredits;
    }

    await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, userId));

    // 记录活动
    await db.insert(userActivities).values({
      userId: userId,
      type: 'credit_add',
      description: description,
      creditAmount: amount,
      metadata: metadata ? JSON.stringify({
        ...metadata,
        creditType: creditType
      }) : JSON.stringify({ creditType: creditType })
    });

    // 计算总积分
    const totalCredits = (creditType === 'subscription' 
      ? (user.subscriptionCredits || 0) + amount + user.credits
      : user.credits + amount + (user.subscriptionCredits || 0)
    );

    return {
      success: true,
      message: '积分增加成功',
      user: {
        id: userId,
        credits: totalCredits
      },
      credits: {
        deducted: -amount, // 负数表示增加
        remaining: totalCredits
      }
    };
  } catch (error) {
    console.error('增加积分失败:', error);
    return {
      success: false,
      message: '积分增加失败'
    };
  }
}

// 记录用户活动（不涉及积分变化）
export async function recordActivity(
  userId: string,
  type: string,
  description: string,
  metadata?: Record<string, any>
): Promise<boolean> {
  try {
    await db.insert(userActivities).values({
      userId: userId,
      type: type,
      description: description,
      creditAmount: null,
      metadata: metadata ? JSON.stringify(metadata) : null,
    });
    return true;
  } catch (error) {
    console.error('记录用户活动失败:', error);
    return false;
  }
}

// 获取用户活动记录
export async function getUserActivities(
  userId: string,
  limit: number = 20,
  offset: number = 0
): Promise<ActivityRecord[]> {
  try {
    const activities = await db.query.userActivities.findMany({
      where: eq(userActivities.userId, userId),
      orderBy: (userActivities, { desc }) => [desc(userActivities.createdAt)],
      limit: limit,
      offset: offset,
    });

    return activities;
  } catch (error) {
    console.error('获取用户活动失败:', error);
    return [];
  }
}

// 清零用户订阅积分（订阅过期时调用）
export async function clearSubscriptionCredits(
  userId: string,
  reason: string = 'credit_description.subscription_expired'
): Promise<CreditDeductionResult> {
  try {
    // 首先获取用户当前积分
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    
    if (!user) {
      return {
        success: false,
        message: '用户不存在'
      };
    }

    const clearedAmount = user.subscriptionCredits || 0;
    
    if (clearedAmount === 0) {
      return {
        success: true,
        message: '订阅积分已为零，无需清零',
        user: {
          id: userId,
          credits: user.credits
        },
        credits: {
          deducted: 0,
          remaining: user.credits
        }
      };
    }

    // 清零订阅积分
    await db
      .update(users)
      .set({ 
        subscriptionCredits: 0,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId));

    // 记录活动
    await db.insert(userActivities).values({
      userId: userId,
      type: 'subscription_expired',
      description: reason,
      creditAmount: -clearedAmount,
      metadata: JSON.stringify({
        clearedSubscriptionCredits: clearedAmount,
        remainingPermanentCredits: user.credits
      })
    });

    return {
      success: true,
      message: '订阅积分已清零',
      user: {
        id: userId,
        credits: user.credits // 只保留永久积分
      },
      credits: {
        deducted: clearedAmount,
        remaining: user.credits
      }
    };
  } catch (error) {
    console.error('清零订阅积分失败:', error);
    return {
      success: false,
      message: '清零订阅积分失败'
    };
  }
} 
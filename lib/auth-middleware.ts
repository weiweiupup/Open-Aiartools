import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT } from './auth-utils';
import { findUserById } from './user-service';

export interface AuthUser {
  id: string;
  email: string;
  username: string | null;
  isEmailVerified: boolean;
  credits: number;
  subscriptionCredits: number;
  subscriptionStatus: string | null;
  subscriptionPlan: string | null;
  subscriptionStartDate: Date | null;
  subscriptionEndDate: Date | null;
}

// 从请求中获取用户信息
export async function getCurrentUser(request: NextRequest): Promise<AuthUser | null> {
  try {
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return null;
    }

    const payload = verifyJWT(token);
    if (!payload || !payload.userId) {
      return null;
    }

    const user = await findUserById(payload.userId);
    if (!user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      isEmailVerified: user.isEmailVerified,
      credits: user.credits,
      subscriptionCredits: user.subscriptionCredits,
      subscriptionStatus: user.subscriptionStatus,
      subscriptionPlan: user.subscriptionPlan,
      subscriptionStartDate: user.subscriptionStartDate,
      subscriptionEndDate: user.subscriptionEndDate,
    };
  } catch (error) {
    console.error('获取当前用户失败:', error);
    return null;
  }
}

// 认证中间件
export async function requireAuth(request: NextRequest): Promise<{
  isAuthenticated: boolean;
  user?: AuthUser;
  response?: NextResponse;
}> {
  const user = await getCurrentUser(request);
  
  if (!user) {
    return {
      isAuthenticated: false,
      response: NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      ),
    };
  }

  return {
    isAuthenticated: true,
    user,
  };
}

// 邮箱验证中间件
export async function requireEmailVerified(request: NextRequest): Promise<{
  isVerified: boolean;
  user?: AuthUser;
  response?: NextResponse;
}> {
  const authResult = await requireAuth(request);
  
  if (!authResult.isAuthenticated || !authResult.user) {
    return {
      isVerified: false,
      response: authResult.response,
    };
  }

  if (!authResult.user.isEmailVerified) {
    return {
      isVerified: false,
      user: authResult.user,
      response: NextResponse.json(
        { error: '请先验证您的邮箱地址' },
        { status: 403 }
      ),
    };
  }

  return {
    isVerified: true,
    user: authResult.user,
  };
} 
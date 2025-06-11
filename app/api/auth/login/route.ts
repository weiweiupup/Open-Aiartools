import { NextRequest, NextResponse } from 'next/server';
import { findUserByEmail } from '@/lib/user-service';
import { verifyPassword, generateJWT, isValidEmail } from '@/lib/auth-utils';
import { cookies } from 'next/headers';
import { signIn } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // 验证输入
    if (!email || !password) {
      return NextResponse.json(
        { error: '邮箱和密码是必填项' },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: '邮箱格式不正确' },
        { status: 400 }
      );
    }

    // 查找用户
    const user = await findUserByEmail(email.toLowerCase().trim());
    if (!user) {
      return NextResponse.json(
        { error: '邮箱或密码错误' },
        { status: 401 }
      );
    }

    // 验证密码
    if (!user.password) {
      return NextResponse.json(
        { error: '请使用社交账号登录' },
        { status: 401 }
      );
    }

    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: '邮箱或密码错误' },
        { status: 401 }
      );
    }

    // 检查邮箱是否已验证
    if (!user.isEmailVerified) {
      return NextResponse.json(
        { error: '请先验证您的邮箱地址' },
        { status: 401 }
      );
    }

    // 生成JWT令牌
    const token = generateJWT({
      userId: user.id,
      email: user.email,
    });

    // 设置HTTP-only cookie
    const cookieStore = await cookies();
    cookieStore.set('auth-token', token, {
      httpOnly: process.env.NODE_ENV === 'production', // 开发环境允许JavaScript读取
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7天
    });

    // 尝试设置NextAuth session（用于前端状态管理）
    try {
      await signIn('credentials', {
        email: user.email,
        password: password,
        redirect: false,
      });
    } catch (error) {
      // NextAuth登录失败不影响主要登录流程
      console.log('NextAuth signIn error:', error);
    }

    return NextResponse.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        isEmailVerified: user.isEmailVerified,
        credits: user.credits,
      },
    }, { 
      status: 200,
      headers: {
        'Set-Cookie': `authToken=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${7 * 24 * 60 * 60}`
      }
    });
  } catch (error) {
    console.error('登录错误:', error);
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
} 
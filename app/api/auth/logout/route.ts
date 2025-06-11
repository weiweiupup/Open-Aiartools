import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { signOut } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // 清除NextAuth session
    try {
      await signOut({ redirect: false });
    } catch (error) {
      // NextAuth signOut可能会失败，但不影响继续清理
      console.log('NextAuth signOut 错误:', error);
    }

    // 清除我们自己的JWT token cookie
    const cookieStore = await cookies();
    cookieStore.delete('auth-token');

    return NextResponse.json(
      { message: 'Logout successful' },
      {
        status: 200,
        headers: {
          'Set-Cookie': 'authToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Strict'
        }
      }
    );
  } catch (error) {
    console.error('退出登录错误:', error);
    return NextResponse.json(
      { error: '退出登录失败' },
      { status: 500 }
    );
  }
} 
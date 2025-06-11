import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import jwt from 'jsonwebtoken';

export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: '未授权访问' },
        { status: 401 }
      );
    }

    let userId: string;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
      userId = decoded.userId;
    } catch (error) {
      return NextResponse.json(
        { error: '无效的认证令牌' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { username } = body;

    // 验证输入
    if (username !== null && typeof username !== 'string') {
      return NextResponse.json(
        { error: '用户名必须是字符串' },
        { status: 400 }
      );
    }

    // 如果提供了用户名，验证长度
    if (username && username.trim().length > 50) {
      return NextResponse.json(
        { error: '用户名长度不能超过50个字符' },
        { status: 400 }
      );
    }

    // 更新用户信息
    const updatedUser = await db
      .update(users)
      .set({
        username: username ? username.trim() : null,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning({
        id: users.id,
        email: users.email,
        username: users.username,
        isEmailVerified: users.isEmailVerified,
      });

    if (updatedUser.length === 0) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: updatedUser[0],
    });

  } catch (error) {
    console.error('更新个人资料失败:', error);
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
} 
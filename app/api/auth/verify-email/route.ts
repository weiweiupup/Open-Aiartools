import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, deleteVerificationToken, findUserByEmail, verifyUserEmail } from '@/lib/user-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Verification token is missing' },
        { status: 400 }
      );
    }

    // 验证令牌
    const tokenResult = await verifyToken(token, 'email_verification');
    if (!tokenResult.isValid || !tokenResult.email) {
      return NextResponse.json(
        { error: 'Invalid or expired verification token' },
        { status: 400 }
      );
    }

    // 查找用户
    const user = await findUserByEmail(tokenResult.email);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // 如果邮箱已验证，直接返回成功
    if (user.isEmailVerified) {
      await deleteVerificationToken(token);
      return NextResponse.json({
        message: 'Email already verified',
        verified: true,
      });
    }

    // 验证用户邮箱
    const verificationSuccess = await verifyUserEmail(user.id);
    if (!verificationSuccess) {
      return NextResponse.json(
        { error: 'Email verification failed' },
        { status: 500 }
      );
    }

    // 删除验证令牌
    await deleteVerificationToken(token);

    return NextResponse.json({
      message: 'Email verified successfully',
      verified: true,
    });
  } catch (error) {
    console.error('邮箱验证错误:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 
import { NextRequest, NextResponse } from 'next/server';
import { findUserByEmail, createVerificationToken } from '@/lib/user-service';
import { sendEmail, generateVerificationEmailHtml } from '@/lib/email';
import { isValidEmail } from '@/lib/auth-utils';
import { db } from '@/lib/db';
import { verificationTokens } from '@/lib/schema';
import { and, eq, gt } from 'drizzle-orm';

// 限制重发频率（5分钟内只能发送一次）
const RESEND_COOLDOWN_MINUTES = 5;

export async function POST(request: NextRequest) {
  let locale = 'zh'; // 默认语言
  
  try {
    const { email, locale: requestLocale = 'zh' } = await request.json();
    locale = requestLocale;

    // 验证输入
    if (!email) {
      return NextResponse.json(
        { error: locale === 'zh' ? '邮箱地址是必填项' : 'Email address is required' },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: locale === 'zh' ? '邮箱格式不正确' : 'Invalid email format' },
        { status: 400 }
      );
    }

    // 查找用户
    const user = await findUserByEmail(email.toLowerCase().trim());
    if (!user) {
      return NextResponse.json(
        { error: locale === 'zh' ? '用户不存在' : 'User not found' },
        { status: 404 }
      );
    }

    // 检查邮箱是否已验证
    if (user.isEmailVerified) {
      return NextResponse.json(
        { error: locale === 'zh' ? '邮箱已经验证过了' : 'Email is already verified' },
        { status: 400 }
      );
    }

    // 检查是否在冷却期内（防止重复发送）
    const cooldownTime = new Date(Date.now() - RESEND_COOLDOWN_MINUTES * 60 * 1000);
    const recentToken = await db
      .select()
      .from(verificationTokens)
      .where(
        and(
          eq(verificationTokens.email, user.email),
          eq(verificationTokens.type, 'email_verification'),
          gt(verificationTokens.createdAt, cooldownTime)
        )
      )
      .limit(1);

    if (recentToken.length > 0) {
      return NextResponse.json(
        { 
          error: locale === 'zh' 
            ? `请等待${RESEND_COOLDOWN_MINUTES}分钟后再重新发送验证邮件` 
            : `Please wait ${RESEND_COOLDOWN_MINUTES} minutes before resending verification email`
        },
        { status: 429 }
      );
    }

    // 生成新的验证令牌
    const verificationToken = await createVerificationToken(
      user.email,
      'email_verification',
      24
    );

    if (!verificationToken) {
      return NextResponse.json(
        { error: locale === 'zh' ? '生成验证令牌失败' : 'Failed to generate verification token' },
        { status: 500 }
      );
    }

    // 发送验证邮件
    const verificationUrl = `${process.env.NEXTAUTH_URL}/${locale}/auth/verify-email?token=${verificationToken}`;
    const emailHtml = generateVerificationEmailHtml(verificationUrl, locale);
    
    const emailResult = await sendEmail({
      to: user.email,
      subject: locale === 'zh' ? 'Aiartools - 邮箱验证' : 'Aiartools - Email Verification',
      html: emailHtml,
    });

    if (!emailResult.success) {
      console.error('验证邮件发送失败:', emailResult.error);
      return NextResponse.json(
        { error: locale === 'zh' ? '邮件发送失败，请稍后重试' : 'Failed to send email, please try again later' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: locale === 'zh' 
        ? '验证邮件已重新发送，请查收邮箱' 
        : 'Verification email has been resent, please check your inbox',
      cooldownMinutes: RESEND_COOLDOWN_MINUTES
    });

  } catch (error) {
    console.error('重发验证邮件错误:', error);
    return NextResponse.json(
      { error: locale === 'zh' ? '服务器内部错误' : 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: '重发邮箱验证API',
    version: '1.0.0',
    cooldown_minutes: RESEND_COOLDOWN_MINUTES,
    usage: 'POST to /api/auth/resend-verification with email and locale'
  });
} 
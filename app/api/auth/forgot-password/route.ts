import { NextRequest, NextResponse } from 'next/server';
import { findUserByEmail, createVerificationToken } from '@/lib/user-service';
import { sendEmail, generatePasswordResetEmailHtml } from '@/lib/email';
import { isValidEmail } from '@/lib/auth-utils';

export async function POST(request: NextRequest) {
  try {
    const { email, locale = 'zh' } = await request.json();

    // 验证输入
    if (!email) {
      return NextResponse.json(
        { error: '邮箱地址是必填项' },
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
    
    // 无论用户是否存在，都返回成功消息（安全考虑）
    // 这样可以防止恶意用户通过此接口探测哪些邮箱已注册
    
    if (user) {
      // 生成密码重置令牌（24小时有效）
      const resetToken = await createVerificationToken(
        user.email,
        'password_reset',
        24
      );

      if (resetToken) {
        // 发送密码重置邮件
        const resetUrl = `${process.env.NEXTAUTH_URL}/${locale}/auth/reset-password?token=${resetToken}`;
        const emailHtml = generatePasswordResetEmailHtml(resetUrl, locale);
        
        const emailResult = await sendEmail({
          to: user.email,
          subject: locale === 'zh' ? 'Aiartools - 密码重置' : 'Aiartools - Password Reset',
          html: emailHtml,
        });

        if (!emailResult.success) {
          console.error('密码重置邮件发送失败:', emailResult.error);
          return NextResponse.json(
            { error: '邮件发送失败，请稍后重试' },
            { status: 500 }
          );
        }
      }
    }

    return NextResponse.json({
      message: '如果该邮箱地址已注册，您将收到密码重置链接。',
    });
  } catch (error) {
    console.error('找回密码错误:', error);
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
} 
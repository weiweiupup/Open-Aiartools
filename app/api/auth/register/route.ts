import { NextRequest, NextResponse } from 'next/server';
import { createUser, createVerificationToken } from '@/lib/user-service';
import { sendEmail, generateVerificationEmailHtml } from '@/lib/email';
import { isValidEmail, hashPassword } from '@/lib/auth-utils';
import { db } from '@/lib/db';
import { users, userActivities } from '@/lib/schema';

export async function POST(request: NextRequest) {
  try {
    const { email, password, locale = 'zh' } = await request.json();

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

    // 基本密码长度验证
    if (password.length < 6) {
      return NextResponse.json(
        { error: '密码长度至少需要6个字符' },
        { status: 400 }
      );
    }

    // 创建新用户
    const hashedPassword = await hashPassword(password);
    const [newUser] = await db.insert(users).values({
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      username: email.split('@')[0], // 默认用户名为邮箱前缀
      isEmailVerified: false,
      credits: 20, // 注册赠送20积分
    }).returning();

    if (!newUser) {
      return NextResponse.json(
        { error: '用户创建失败，邮箱可能已被注册' },
        { status: 400 }
      );
    }

    // 记录注册赠送积分的活动
    try {
      await db.insert(userActivities).values({
        userId: newUser.id,
        type: 'registration_bonus',
        description: 'credit_description.registration_bonus',
        creditAmount: 20,
        metadata: JSON.stringify({
          source: 'registration_bonus',
          email: newUser.email,
          type: 'registration_bonus',
        })
      });
    } catch (error) {
      console.error('记录注册积分活动失败:', error);
      // 不阻止注册流程，继续执行
    }

    // 立即返回成功响应，不等待邮件发送
    const response = NextResponse.json({
      message: 'Registration successful! Please check your email and click the verification link.',
      user: {
        id: newUser.id,
        email: newUser.email,
        username: newUser.username,
        isEmailVerified: newUser.isEmailVerified,
        credits: newUser.credits,
      },
    }, { status: 201 });

    // 异步发送验证邮件（不阻塞响应）
    Promise.resolve().then(async () => {
      try {
        console.log('开始发送验证邮件:', newUser.email);
        
        // 生成邮箱验证令牌
        const verificationToken = await createVerificationToken(
          newUser.email,
          'email_verification',
          24
        );

        if (!verificationToken) {
          console.error('生成验证令牌失败:', newUser.email);
          return;
        }

        console.log('验证令牌生成成功:', verificationToken);

        // 发送验证邮件
        const verificationUrl = `${process.env.NEXTAUTH_URL}/${locale}/auth/verify-email?token=${verificationToken}`;
        console.log('验证链接:', verificationUrl);
        
        const emailHtml = generateVerificationEmailHtml(verificationUrl, locale);
        
        const emailResult = await sendEmail({
          to: newUser.email,
          subject: locale === 'zh' ? 'Aiartools - 邮箱验证' : 'Aiartools - Email Verification',
          html: emailHtml,
        });

        if (!emailResult.success) {
          console.error('验证邮件发送失败:', newUser.email, emailResult.error);
        } else {
          console.log('验证邮件发送成功:', newUser.email, emailResult.data);
        }
      } catch (error) {
        console.error('异步发送验证邮件错误:', newUser.email, error);
      }
    }).catch((error) => {
      console.error('Promise异步执行错误:', error);
    });

    return response;
  } catch (error) {
    console.error('注册错误:', error);
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
}
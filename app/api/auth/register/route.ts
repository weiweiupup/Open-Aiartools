import { NextRequest, NextResponse } from 'next/server';
import { createUser, createVerificationToken, findUserByEmail } from '@/lib/user-service';
import { sendEmail, generateVerificationEmailHtml } from '@/lib/email';
import { isValidEmail, hashPassword } from '@/lib/auth-utils';
import { db } from '@/lib/db';
import { users, userActivities } from '@/lib/schema';
import { CREDIT_CONFIG, USER_CONFIG } from '@/lib/constants';

export async function POST(request: NextRequest) {
  try {
    const { email, password, locale = 'zh' } = await request.json();

    // 验证输入
    if (!email || !password) {
      return NextResponse.json(
        { error: locale === 'zh' ? '邮箱和密码是必填项' : 'Email and password are required' },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: locale === 'zh' ? '邮箱格式不正确' : 'Invalid email format' },
        { status: 400 }
      );
    }

    // 基本密码长度验证
    if (password.length < USER_CONFIG.MIN_PASSWORD_LENGTH) {
      return NextResponse.json(
        { error: locale === 'zh' ? `密码长度至少需要${USER_CONFIG.MIN_PASSWORD_LENGTH}个字符` : `Password must be at least ${USER_CONFIG.MIN_PASSWORD_LENGTH} characters long` },
        { status: 400 }
      );
    }

    // 检查邮箱是否已存在
    const existingUser = await findUserByEmail(email.toLowerCase().trim());
    if (existingUser) {
      return NextResponse.json(
        { error: locale === 'zh' ? '该邮箱已被注册，请使用其他邮箱或直接登录' : 'This email is already registered. Please use a different email or sign in.' },
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
      credits: CREDIT_CONFIG.REGISTRATION_BONUS, // 使用配置文件中的注册积分
    }).returning();

    if (!newUser) {
      return NextResponse.json(
        { error: locale === 'zh' ? '用户创建失败，请稍后重试' : 'User creation failed, please try again later' },
        { status: 500 }
      );
    }

    // 记录注册赠送积分的活动
    try {
      await db.insert(userActivities).values({
        userId: newUser.id,
        type: 'registration_bonus',
        description: 'credit_description.registration_bonus',
        creditAmount: CREDIT_CONFIG.REGISTRATION_BONUS,
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
    
    // 尝试从请求中获取locale，如果失败则使用默认值
    let errorLocale = 'zh';
    try {
      const body = await request.json();
      errorLocale = body.locale || 'zh';
    } catch {
      // 解析失败时使用默认语言
      errorLocale = 'zh';
    }
    
    // 检查是否是数据库唯一约束错误
    if (error instanceof Error) {
      if (error.message.includes('duplicate key') || error.message.includes('unique constraint')) {
        return NextResponse.json(
          { error: errorLocale === 'zh' ? '该邮箱已被注册，请使用其他邮箱' : 'This email is already registered. Please use a different email.' },
          { status: 400 }
        );
      }
    }
    
    return NextResponse.json(
      { error: errorLocale === 'zh' ? '服务器内部错误，请稍后重试' : 'Internal server error, please try again later' },
      { status: 500 }
    );
  }
}
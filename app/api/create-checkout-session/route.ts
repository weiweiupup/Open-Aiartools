import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { stripe, STRIPE_PLANS } from '@/lib/stripe';
import { db } from '@/lib/db';
import { users } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    console.log('Creating checkout session...');

    // 检查环境变量
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('STRIPE_SECRET_KEY is not configured');
      return NextResponse.json(
        { error: 'Stripe 配置错误' },
        { status: 500 }
      );
    }

    if (!process.env.NEXTAUTH_URL) {
      console.error('NEXTAUTH_URL is not configured');
      return NextResponse.json(
        { error: '应用配置错误' },
        { status: 500 }
      );
    }

    // 检查用户认证
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      );
    }

    console.log('User authenticated:', session.user.email);

    // 获取用户信息
    const user = await db.query.users.findFirst({
      where: eq(users.email, session.user.email),
    });

    if (!user) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404 }
      );
    }

    console.log('User found:', user.id);

    // 检查用户是否已有活跃订阅
    const hasActiveSubscription = user.subscriptionStatus === 'active' && 
                                user.subscriptionEndDate && 
                                new Date(user.subscriptionEndDate) > new Date();

    if (hasActiveSubscription) {
      return NextResponse.json(
        { error: 'alreadySubscribed' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { locale = 'zh' } = body;

    // 只处理 Pro 订阅
    const plan = STRIPE_PLANS.pro;
    console.log('Using plan:', plan);

    // 检查价格 ID
    if (!plan.priceId || plan.priceId === 'price_test_demo') {
      console.warn('Using test configuration - creating one-time payment session for development');
      
      // 在开发环境中，创建一次性支付会话而不是订阅
      const checkoutSession = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: plan.name,
                description: plan.description,
              },
              unit_amount: plan.price,
            },
            quantity: 1,
          },
        ],
        mode: 'payment', // 一次性支付模式
        success_url: `${process.env.NEXTAUTH_URL}/${locale}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXTAUTH_URL}/${locale}?canceled=true`,
        customer_email: user.email,
        metadata: {
          userId: user.id,
          planId: 'pro',
          credits: plan.credits.toString(),
          planType: 'test_payment',
        },
        locale: locale === 'zh' ? 'zh' : 'en',
      });

      console.log('Test checkout session created:', checkoutSession.id);

      return NextResponse.json({ 
        sessionId: checkoutSession.id,
        url: checkoutSession.url 
      });
    }

    // 创建 Stripe Checkout 会话
    console.log('Creating Stripe checkout session...');
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: plan.priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription', // 订阅模式
      success_url: `${process.env.NEXTAUTH_URL}/${locale}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/${locale}?canceled=true`,
      customer_email: user.email,
      metadata: {
        userId: user.id,
        planId: 'pro',
        credits: plan.credits.toString(),
        planType: 'subscription',
      },
      locale: locale === 'zh' ? 'zh' : 'en',
    });

    console.log('Checkout session created:', checkoutSession.id);

    return NextResponse.json({ 
      sessionId: checkoutSession.id,
      url: checkoutSession.url 
    });

  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    
    // 详细的错误处理
    if (error.code === 'resource_missing') {
      return NextResponse.json(
        { error: 'Stripe 价格配置不存在，请联系管理员' },
        { status: 500 }
      );
    }

    if (error.code === 'api_key_invalid') {
      return NextResponse.json(
        { error: 'Stripe API 密钥无效' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: error.message || '创建支付会话失败' },
      { status: 500 }
    );
  }
} 
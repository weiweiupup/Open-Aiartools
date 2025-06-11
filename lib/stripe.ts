import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// 订阅计划配置
export const STRIPE_PLANS = {
  pro: {
    priceId: process.env.STRIPE_PRICE_ID || 'price_test_demo', // 测试用价格 ID
    name: 'Pro Plan',
    price: 599, // $5.99 in cents
    credits: 800,
    description: '专业版方案 - 每月800积分',
    type: 'subscription' as const,
  },
};

export type StripePlan = keyof typeof STRIPE_PLANS; 
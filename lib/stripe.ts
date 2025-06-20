import Stripe from 'stripe';
import { CREDIT_CONFIG } from '@/lib/constants';

// 检查环境变量
if (!process.env.STRIPE_SECRET_KEY) {
  console.error('STRIPE_SECRET_KEY is not configured');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-05-28.basil',
  typescript: true,
});

// 订阅计划配置
export const STRIPE_PLANS = {
  pro: {
    priceId: process.env.STRIPE_PRICE_ID || 'price_test_demo', // 测试用价格 ID
    name: 'Pro Plan',
    price: 599, // $5.99 in cents
    credits: CREDIT_CONFIG.SUBSCRIPTION.PRO_MONTHLY_CREDITS,
    description: `专业版方案 - 每月${CREDIT_CONFIG.SUBSCRIPTION.PRO_MONTHLY_CREDITS}积分`,
    type: 'subscription' as const,
  },
};

export default stripe;

export type StripePlan = keyof typeof STRIPE_PLANS; 
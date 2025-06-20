import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { db } from '@/lib/db';
import { users, userActivities } from '@/lib/schema';
import { addCredits } from '@/lib/credit-service';
import { eq, and, like } from 'drizzle-orm';
import { stripe } from '@/lib/stripe';
import { CREDIT_CONFIG } from '@/lib/constants';
import Stripe from 'stripe';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const sig = request.headers.get('stripe-signature');

    if (!sig) {
      return NextResponse.json({ error: 'No signature' }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    console.log('Received webhook event:', event.type);

    // 处理支付成功事件
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      
      console.log('Checkout session completed:', session.id);
      console.log('Session metadata:', session.metadata);

      if (session.metadata) {
        const { userId, planId, credits, planType } = session.metadata;
        
        // 检查是否已经处理过此会话（避免与verify-payment API重复）
        const existingActivity = await db.query.userActivities.findFirst({
          where: and(
            eq(userActivities.userId, userId),
            like(userActivities.metadata, `%"sessionId":"${session.id}"%`)
          ),
        });

        if (!existingActivity) {
          try {
            // 为用户添加积分，订阅类型使用subscription积分
            const creditType = planType === 'subscription' ? 'subscription' : 'permanent';
            
            await addCredits(
              userId,
              parseInt(credits),
              planType === 'subscription' ? 'credit_description.subscription_activated' : 'credit_description.credit_purchase',
              {
                type: 'payment',
                planId: planId,
                sessionId: session.id,
                amount: session.amount_total ? session.amount_total / 100 : 0,
                currency: session.currency || 'usd',
                source: 'stripe-webhook', // 标识来源
                timestamp: new Date().toISOString()
              },
              creditType
            );

            // 如果是订阅类型，更新用户的订阅状态
            if (planType === 'subscription') {
              // 获取订阅详情
              if (session.subscription && typeof session.subscription === 'string') {
                try {
                  const subscription = await stripe.subscriptions.retrieve(session.subscription);
                  
                  // 更新用户订阅状态
                  await db.update(users)
                    .set({
                      subscriptionStatus: 'active',
                      subscriptionPlan: planId,
                      subscriptionStartDate: new Date((subscription as any).current_period_start * 1000),
                      subscriptionEndDate: new Date((subscription as any).current_period_end * 1000),
                    })
                    .where(eq(users.id, userId));

                  console.log(`Successfully updated subscription status for user ${userId}`);
                } catch (subscriptionError) {
                  console.error('Error retrieving subscription details:', subscriptionError);
                  
                  // 如果无法获取订阅详情，至少设置基本的订阅状态
                  await db.update(users)
                    .set({
                      subscriptionStatus: 'active',
                      subscriptionPlan: planId,
                      subscriptionStartDate: new Date(),
                      // 默认设置为30天后过期，实际会通过其他webhook事件更新
                      subscriptionEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                    })
                    .where(eq(users.id, userId));
                  
                  console.log(`Updated basic subscription status for user ${userId} without detailed subscription info`);
                }
              }
            }

            console.log(`Successfully added ${credits} ${creditType} credits to user ${userId} via webhook`);
          } catch (error) {
            console.error('Error adding credits via webhook:', error);
          }
        } else {
          console.log(`Session ${session.id} has already been processed, skipping webhook processing`);
        }
      }
    }

    // 处理订阅相关事件
    if (event.type === 'invoice.payment_succeeded') {
      const invoice = event.data.object as Stripe.Invoice;
      
      if ((invoice as any).subscription && invoice.billing_reason === 'subscription_cycle') {
        // 这是订阅续费，为用户添加每月积分
        console.log('Subscription renewal payment succeeded:', invoice.id);
        
        // 从 subscription 中获取用户信息
        if (invoice.customer && typeof invoice.customer === 'string') {
          try {
            const customer = await stripe.customers.retrieve(invoice.customer);
            
            if (customer && !customer.deleted && customer.email) {
              const user = await db.query.users.findFirst({
                where: eq(users.email, customer.email),
              });

              if (user) {
                // 为订阅用户每月添加订阅积分
                await addCredits(
                  user.id,
                  CREDIT_CONFIG.SUBSCRIPTION.PRO_MONTHLY_CREDITS,
                  'credit_description.subscription_renewal',
                  {
                    type: 'subscription_renewal',
                    invoiceId: invoice.id,
                    amount: invoice.amount_paid ? invoice.amount_paid / 100 : 0,
                    currency: invoice.currency || 'usd',
                  },
                  'subscription'
                );

                console.log(`Successfully added ${CREDIT_CONFIG.SUBSCRIPTION.PRO_MONTHLY_CREDITS} subscription credits to user ${user.id} for subscription renewal`);
              }
            }
          } catch (error) {
            console.error('Error handling subscription renewal:', error);
          }
        }
      }
    }

    // 处理订阅取消事件
    if (event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object as Stripe.Subscription;
      
      console.log('Subscription deleted:', subscription.id);
      
      if (subscription.customer && typeof subscription.customer === 'string') {
        try {
          const customer = await stripe.customers.retrieve(subscription.customer);
          
          if (customer && !customer.deleted && customer.email) {
            const user = await db.query.users.findFirst({
              where: eq(users.email, customer.email),
            });

            if (user) {
              // 清零订阅积分
              await addCredits(user.id, 0, 'credit_description.subscription_expired', {
                type: 'subscription_expired',
                amount: 0,
                currency: 'usd',
                source: 'stripe-webhook',
                timestamp: new Date().toISOString()
              }, 'subscription');
              
              // 更新订阅状态为取消
              await db.update(users)
                .set({
                  subscriptionStatus: 'canceled',
                  subscriptionEndDate: new Date(), // 设置为当前时间表示已结束
                })
                .where(eq(users.id, user.id));
              
              console.log(`Cleared subscription credits and updated status for user ${user.id} due to subscription cancellation`);
            }
          }
        } catch (error) {
          console.error('Error handling subscription deletion:', error);
        }
      }
    }

    // 处理订阅过期事件
    if (event.type === 'invoice.payment_failed') {
      const invoice = event.data.object as Stripe.Invoice;
      
      if ((invoice as any).subscription && invoice.attempt_count >= 3) {
        // 连续3次支付失败，认为订阅过期
        console.log('Subscription payment failed 3 times:', invoice.id);
        
        if (invoice.customer && typeof invoice.customer === 'string') {
          try {
            const customer = await stripe.customers.retrieve(invoice.customer);
            
            if (customer && !customer.deleted && customer.email) {
              const user = await db.query.users.findFirst({
                where: eq(users.email, customer.email),
              });

              if (user) {
                // 清零订阅积分
                await addCredits(user.id, 0, 'credit_description.subscription_expired', {
                  type: 'subscription_expired',
                  amount: 0,
                  currency: 'usd',
                  source: 'stripe-webhook',
                  timestamp: new Date().toISOString()
                }, 'subscription');
                
                // 更新订阅状态为过期
                await db.update(users)
                  .set({
                    subscriptionStatus: 'expired',
                    subscriptionEndDate: new Date(), // 设置为当前时间表示已过期
                  })
                  .where(eq(users.id, user.id));
                
                console.log(`Cleared subscription credits and updated status for user ${user.id} due to payment failure`);
              }
            }
          } catch (error) {
            console.error('Error handling subscription payment failure:', error);
          }
        }
      }
    }

    return NextResponse.json({ received: true });

  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: error.message || 'Webhook处理失败' },
      { status: 500 }
    );
  }
} 
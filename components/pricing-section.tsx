"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckIcon, StarIcon, Crown } from "lucide-react"
import { useTranslations } from "next-intl"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"

interface PricingSectionProps {
  locale: string
}

interface UserInfo {
  id: string;
  email: string;
  username: string | null;
  isEmailVerified: boolean;
  credits: number;
  subscriptionCredits: number;
  subscriptionStatus: string | null;
  subscriptionPlan: string | null;
  subscriptionStartDate: string | null;
  subscriptionEndDate: string | null;
}

export default function PricingSection({ locale }: PricingSectionProps) {
  const t = useTranslations("pricing")
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isSubscribing, setIsSubscribing] = useState(false)
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [isLoadingUser, setIsLoadingUser] = useState(false)

  // 获取用户信息包括订阅状态
  useEffect(() => {
    const fetchUserInfo = async () => {
      // 等待会话状态确定后再执行
      if (status === 'loading') {
        return
      }
      
      if (!session) {
        setUserInfo(null)
        return
      }

      setIsLoadingUser(true)
      try {
        const response = await fetch('/api/auth/me', {
          method: 'GET',
          credentials: 'include',
        })
        
        if (response.ok) {
          const userData = await response.json()
          setUserInfo(userData.user)
        } else {
          setUserInfo(null)
        }
      } catch (error) {
        console.error('获取用户信息失败:', error)
        setUserInfo(null)
      } finally {
        setIsLoadingUser(false)
      }
    }

    fetchUserInfo()
  }, [session, status])

  // 监听全局认证状态变化事件
  useEffect(() => {
    const handleAuthUpdate = (event: CustomEvent) => {
      console.log('Pricing component: 收到认证状态更新事件', event.detail);
      // 当认证状态变化时，重新获取用户信息
      if (event.detail.status !== 'loading') {
        const fetchUserInfo = async () => {
          if (!event.detail.session) {
            setUserInfo(null)
            return
          }

          setIsLoadingUser(true)
          try {
            const response = await fetch('/api/auth/me', {
              method: 'GET',
              credentials: 'include',
            })
            
            if (response.ok) {
              const userData = await response.json()
              setUserInfo(userData.user)
            } else {
              setUserInfo(null)
            }
          } catch (error) {
            console.error('获取用户信息失败:', error)
            setUserInfo(null)
          } finally {
            setIsLoadingUser(false)
          }
        }

        fetchUserInfo()
      }
    }

    window.addEventListener('authStatusChanged', handleAuthUpdate as EventListener)
    return () => {
      window.removeEventListener('authStatusChanged', handleAuthUpdate as EventListener)
    }
  }, [])

  // 强制刷新用户信息的辅助函数
  const forceRefreshUserInfo = async () => {
    if (status === 'loading') return null;
    
    try {
      const response = await fetch('/api/auth/me', {
        method: 'GET',
        credentials: 'include',
      })
      
      if (response.ok) {
        const userData = await response.json()
        setUserInfo(userData.user)
        return userData.user
      }
      return null
    } catch (error) {
      console.error('刷新用户信息失败:', error)
      return null
    }
  }

  const handleSubscribe = async () => {
    // 检查会话状态是否还在加载中
    if (status === 'loading') {
      toast({
        title: "请稍等",
        description: "正在检查登录状态...",
        variant: "default",
      });
      return;
    }

    // 多重认证状态检查
    if (!session && status === 'unauthenticated') {
      toast({
        title: t("loginRequired"),
        description: t("loginRequiredDesc"),
        variant: "destructive",
      });
      router.push(`/${locale}/auth/login`);
      return;
    }

    // 强制刷新用户信息以确保状态最新
    const currentUserInfo = await forceRefreshUserInfo();
    if (!currentUserInfo) {
      toast({
        title: t("loginRequired"),
        description: t("loginRequiredDesc"),
        variant: "destructive",
      });
      router.push(`/${locale}/auth/login`);
      return;
    }

    setIsSubscribing(true);
    try {
      console.log('Starting subscription process...');
      
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // 确保包含认证cookies
        body: JSON.stringify({
          locale,
        }),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error text:', errorText);
        
        // 特殊处理401未授权错误
        if (response.status === 401) {
          toast({
            title: t("loginRequired"),
            description: t("loginRequiredDesc"),
            variant: "destructive",
          });
          router.push(`/${locale}/auth/login`);
          return;
        }
        
        // 尝试解析为 JSON
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch (parseError) {
          console.error('Failed to parse error response as JSON:', parseError);
          throw new Error(t('invalidResponse'));
        }
        
        const errorMessage = errorData.error === 'alreadySubscribed' 
          ? t('alreadySubscribed')
          : errorData.error || t('createSessionFailed');
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('Checkout session data:', data);

      // 跳转到 Stripe Checkout 页面
      if (data.url) {
        console.log('Redirecting to:', data.url);
        window.location.href = data.url;
      } else {
        throw new Error(t('noPaymentUrl'));
      }
    } catch (error: any) {
      console.error('Error creating checkout session:', error);
      
      let errorMessage = t('subscriptionError');
      
      if (error.message) {
        errorMessage = error.message;
      } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
        errorMessage = t('networkError');
      }
      
      toast({
        title: t("subscriptionFailed"),
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsSubscribing(false);
    }
  };

  const handleFreeSignUp = () => {
    // 跳转到demo页面
    router.push(`/${locale}#demo`);
  };

  const handleContactSales = () => {
    // 新页面打开联系方式页面
    window.open(`/${locale}/blog/contact-us`, '_blank');
  };

  const plans = [
    {
      name: t("free.name"),
      price: t("free.price"),
      originalPrice: null,
      description: t("free.description"),
      features: [t("free.feature1"), t("free.feature2"), t("free.feature3")],
      cta: t("free.cta"),
      popular: false,
      type: "free"
    },
    {
      name: t("pro.name"),
      price: t("pro.price"),
      originalPrice: t("pro.originalPrice"),
      description: t("pro.description"),
      features: [t("pro.feature1"), t("pro.feature2"), t("pro.feature3"), t("pro.feature4")],
      cta: t("subscribe"),
      popular: true,
      type: "pro"
    },
    {
      name: t("enterprise.name"),
      price: t("enterprise.price"),
      originalPrice: null,
      description: t("enterprise.description"),
      features: [t("enterprise.feature1"), t("enterprise.feature3")],
      cta: t("enterprise.cta"),
      popular: false,
      type: "enterprise"
    },
  ]

  const handleButtonClick = (planType: string) => {
    switch (planType) {
      case "free":
        handleFreeSignUp();
        break;
      case "pro":
        handleSubscribe();
        break;
      case "enterprise":
        handleContactSales();
        break;
    }
  };

  return (
    <section id="pricing" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("title")}</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">{t("subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative ${
                plan.popular ? "border-primary shadow-lg scale-105 bg-background" : "bg-background/60 backdrop-blur-sm"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-1">
                    <StarIcon className="w-4 h-4 mr-1" />
                    {t("mostPopular")}
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <div className="mt-4">
                  {plan.originalPrice && (
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <span className="text-lg text-muted-foreground line-through">{plan.originalPrice}</span>
                      <Badge variant="destructive" className="text-xs">{t("saveAmount")}</Badge>
                    </div>
                  )}
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.price !== t("enterprise.price") && <span className="text-muted-foreground">{t('perMonth')}</span>}
                </div>
                <p className="text-muted-foreground mt-2">{plan.description}</p>
              </CardHeader>

              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <CheckIcon className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full ${
                    plan.popular
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                      : ""
                  } ${
                    plan.type === "pro" && userInfo?.subscriptionStatus === 'active'
                      ? "bg-gray-400 hover:bg-gray-500 cursor-not-allowed"
                      : ""
                  }`}
                  variant={plan.popular ? "default" : "outline"}
                  size="lg"
                  onClick={() => handleButtonClick(plan.type)}
                  disabled={
                    (plan.type === "pro" && isSubscribing) || 
                    (plan.type === "pro" && userInfo?.subscriptionStatus === 'active')
                  }
                >
                  {plan.type === "pro" && isSubscribing ? (
                    <>
                      <Crown className="w-4 h-4 mr-2 animate-spin" />
                      {t('processing')}
                    </>
                  ) : plan.type === "pro" && userInfo?.subscriptionStatus === 'active' ? (
                    <>
                      <Crown className="w-4 h-4 mr-2" />
                      {t("subscribedPro")}
                    </>
                  ) : (
                    <>
                      {plan.type === "pro" && <Crown className="w-4 h-4 mr-2" />}
                      {plan.cta}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

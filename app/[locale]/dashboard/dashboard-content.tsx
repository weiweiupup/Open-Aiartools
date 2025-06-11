'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useTranslations } from "next-intl";
import { User, Mail, Calendar, LogOut, Edit, Save, X, Coins, ImageIcon, Plus, Minus, Crown } from 'lucide-react';

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

interface CreditActivity {
  id: string;
  type: string;
  description: string;
  creditAmount: number | null;
  metadata: string | null;
  createdAt: string;
}

interface DashboardContentProps {
  locale: string;
}

export default function DashboardContent({ locale }: DashboardContentProps) {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editUsername, setEditUsername] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [activities, setActivities] = useState<CreditActivity[]>([]);
  const [isLoadingActivities, setIsLoadingActivities] = useState(true);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const t = useTranslations("auth.dashboard");
  const tErrors = useTranslations("auth.errors");
  const tCredit = useTranslations('credit_description');

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // 确保包含cookies
        });
        
        if (response.ok) {
          const userData = await response.json();
          setUser(userData.user);
          setEditUsername(userData.user.username || '');
          // 获取用户数据成功后获取活动记录
          fetchActivities();
        } else if (response.status === 401) {
          // 401 是正常的未登录状态，静默重定向
          router.push(`/${locale}/auth/login`);
        } else {
          // 其他错误状态码才记录
          console.error('获取用户信息失败:', response.status, response.statusText);
          router.push(`/${locale}/auth/login`);
        }
      } catch (error) {
        // 只有真正的网络错误才记录
        if (error instanceof TypeError && error.message.includes('fetch')) {
          console.error('网络连接错误:', error.message);
        } else {
          console.error('未知错误:', error);
        }
        router.push(`/${locale}/auth/login`);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router, locale]);

  const fetchActivities = async () => {
    try {
      const response = await fetch('/api/user/activities?limit=10', {
        method: 'GET',
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        setActivities(data.activities || []);
      } else {
        console.error('获取活动记录失败:', response.status);
      }
    } catch (error) {
      console.error('获取活动记录出错:', error);
    } finally {
      setIsLoadingActivities(false);
    }
  };

  // 格式化时间
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffMinutes = Math.ceil(diffTime / (1000 * 60));
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffMinutes < 60) {
      return `${diffMinutes} ${locale === 'zh' ? '分钟前' : 'minutes ago'}`;
    } else if (diffHours < 24) {
      return `${diffHours} ${locale === 'zh' ? '小时前' : 'hours ago'}`;
    } else if (diffDays < 7) {
      return `${diffDays} ${locale === 'zh' ? '天前' : 'days ago'}`;
    } else {
      return date.toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
  };

  // 获取活动图标
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'credit_deduct':
        return <Minus className="h-4 w-4 text-red-500" />;
      case 'credit_add':
        return <Plus className="h-4 w-4 text-green-500" />;
      case 'registration_bonus':
        return <Plus className="h-4 w-4 text-green-500" />;
      case 'image_generation':
        return <ImageIcon className="h-4 w-4 text-blue-500" />;
      case 'login':
        return <User className="h-4 w-4 text-gray-500" />;
      default:
        return <Coins className="h-4 w-4 text-gray-400" />;
    }
  };

  // 获取活动类型描述
  const getActivityTypeText = (type: string) => {
    switch (type) {
      case 'credit_deduct':
        return t('activityTypes.credit_deduct');
      case 'credit_add':
        return t('activityTypes.credit_add');
      case 'image_generation':
        return t('activityTypes.image_generation');
      case 'login':
        return t('activityTypes.login');
      case 'registration_bonus':
        return t('activityTypes.registration_bonus');
      default:
        return t('activityTypes.other');
    }
  };

  // 格式化活动描述
  const formatActivityDescription = (activity: CreditActivity) => {
    const { description } = activity;
    
    // 如果是翻译键格式
    if (description.startsWith('credit_description.')) {
      const key = description.replace('credit_description.', '');
      
      // 处理特殊的图片编辑格式: credit_description.image_edit:具体内容
      if (key.startsWith('image_edit:')) {
        const content = key.replace('image_edit:', '');
        return `${tCredit('image_edit')}: ${content}`;
      }
      
      // 直接翻译键
      try {
        if (key === 'registration_bonus') {
          return tCredit('registration_bonus');
        } else if (key === 'background_removal') {
          return tCredit('background_removal');
        } else if (key === 'image_edit') {
          return tCredit('image_edit');
        } else if (key === 'subscription_activated') {
          return tCredit('subscription_activated');
        } else if (key === 'purchase_credits') {
          return tCredit('purchase_credits');
        } else if (key === 'subscription_expired') {
          return tCredit('subscription_expired');
        }
      } catch (error) {
        console.log('Translation not found for key:', key);
      }
    }
    
    // 兼容旧格式，直接返回描述
    return description;
  };

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditUsername(user?.username || '');
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      const response = await fetch('/api/auth/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: editUsername.trim() || null,
        }),
      });

      if (response.ok) {
        const updatedData = await response.json();
        setUser(updatedData.user);
        setIsEditing(false);
        // 重新获取活动记录
        fetchActivities();
        toast({
          title: t('profileUpdated'),
          description: t('profileUpdatedDesc'),
        });
      } else {
        const errorData = await response.json();
        toast({
          title: t('updateFailed'),
          description: errorData.error || t('updateError'),
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: t('updateFailed'),
        description: t('networkError'),
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (response.ok) {
        toast({
          title: t('logoutSuccess'),
          description: t('logoutSuccess'),
        });
        router.push(`/${locale}`);
        router.refresh();
      } else {
        toast({
          title: t('logoutFailed'),
          description: t('logoutError'),
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: t('logoutFailed'),
        description: tErrors('networkError'),
        variant: 'destructive',
      });
    }
  };

  const handleSubscribe = async () => {
    setIsSubscribing(true);
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          locale,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // 处理翻译键错误消息
        const errorMessage = data.error === 'alreadySubscribed' 
          ? '您已有活跃订阅，无需重复订阅'
          : data.error || '创建支付会话失败';
        throw new Error(errorMessage);
      }

      // 跳转到 Stripe Checkout 页面
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error: any) {
      console.error('Error creating checkout session:', error);
      toast({
        title: '订阅失败',
        description: error.message || '创建支付会话时发生错误',
        variant: 'destructive',
      });
    } finally {
      setIsSubscribing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
          <p className="mt-2 text-gray-600">{t('welcome')}，{user?.username || t('user')}！</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{t('personalInfo')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start space-x-2">
                  <Mail className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700 break-all leading-relaxed">{user?.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  <span className="text-sm text-gray-700 truncate">{user?.username || t('nameNotSet')}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  <span className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ${
                    user?.isEmailVerified 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {user?.isEmailVerified ? t('verified') : t('unverified')}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-lg">
              <CardTitle className="text-base font-medium">{t('creditBalance')}</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                {/* 永久积分 */}
                <div>
                  <div className="text-xl font-bold text-orange-600">
                    {user?.credits || 0}
                  </div>
                  <p className="text-xs text-gray-500">{t('permanentCredits')}</p>
                </div>
                
                {/* 订阅积分 */}
                {user?.subscriptionStatus === 'active' && (
                  <div>
                    <div className="text-xl font-bold text-blue-600">
                      {user?.subscriptionCredits || 0}
                    </div>
                    <p className="text-xs text-gray-500">{t('subscriptionCredits')}</p>
                  </div>
                )}
                
                {/* 总积分 */}
                <div className="border-t pt-2">
                  <div className="text-lg font-semibold text-green-600">
                    {(user?.credits || 0) + (user?.subscriptionCredits || 0)}
                  </div>
                  <p className="text-xs text-gray-500">{t('totalCredits')}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('subscriptionStatus')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {user?.subscriptionStatus === 'active' ? (
                  <>
                    <div className="flex items-center space-x-2">
                      <Crown className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm font-medium text-green-600">
                        Pro {t('membershipActive')}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {t('expiresAt')}: {user?.subscriptionEndDate ? 
                        new Date(user.subscriptionEndDate).toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US') 
                        : t('unknown')}
                    </div>
                    <div className="text-xs text-gray-500">
                      {t('nextBilling')}: {user?.subscriptionEndDate ? 
                        new Date(user.subscriptionEndDate).toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US') 
                        : t('unknown')}
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-gray-600">
                      {t('freeVersion')}
                    </p>
                    <p className="text-xs text-gray-500">
                      {t('upgradeToGetMoreFeatures')}
                    </p>
                  </>
                )}
                
                {/* 订阅按钮 */}
                <Button 
                  className={`w-full text-sm ${
                    user?.subscriptionStatus === 'active' 
                      ? 'bg-gray-400 hover:bg-gray-500 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
                  } text-white`}
                  onClick={handleSubscribe}
                  disabled={isSubscribing || user?.subscriptionStatus === 'active'}
                  size="sm"
                >
                  <Crown className="h-4 w-4 mr-2" />
                  {isSubscribing ? t('processing') : user?.subscriptionStatus === 'active' ? t('subscribedPro') : t('subscribePro')}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('quickActions')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  size="sm"
                  onClick={handleEditProfile}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  {t('editProfile')}
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-red-600 hover:text-red-700" 
                  size="sm"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  {t('logout')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 编辑个人资料卡片 */}
        {isEditing && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{t('editProfileTitle')}</CardTitle>
              <CardDescription>
                {t('editProfileDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="editUsername">{t('usernameLabel')}</Label>
                  <Input
                    id="editUsername"
                    type="text"
                    placeholder={t('usernamePlaceholder')}
                    value={editUsername}
                    onChange={(e) => setEditUsername(e.target.value)}
                    disabled={isSaving}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editEmail">{t('emailLabel')}</Label>
                  <Input
                    id="editEmail"
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="bg-gray-50"
                  />
                  <p className="text-xs text-gray-500">{t('emailCannotModify')}</p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="flex items-center"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isSaving ? t('saving') : t('save')}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleCancelEdit}
                    disabled={isSaving}
                    className="flex items-center"
                  >
                    <X className="h-4 w-4 mr-2" />
                    {t('cancel')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>{t('recentActivity')}</CardTitle>
            <CardDescription>
              {t('recentActivityDesc')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoadingActivities ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-sm text-gray-500">{t('loadingActivities')}</p>
                </div>
              ) : activities.length > 0 ? (
                activities.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {formatActivityDescription(activity)}
                        </p>
                        {activity.creditAmount && (
                          <span className={`text-sm font-semibold ml-2 ${
                            activity.creditAmount > 0 
                              ? 'text-green-600' 
                              : 'text-red-600'
                          }`}>
                            {activity.creditAmount > 0 ? '+' : ''}{activity.creditAmount} {locale === 'zh' ? '积分' : 'credits'}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-xs text-gray-500">
                          {getActivityTypeText(activity.type)}
                        </p>
                        <p className="text-xs text-gray-400">
                          {formatDate(activity.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <Coins className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm">{t('noActivities')}</p>
                  <p className="text-xs text-gray-400 mt-1">{t('noActivitiesDesc')}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 
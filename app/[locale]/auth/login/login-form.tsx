'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useTranslations } from "next-intl";
import Link from 'next/link';
import OAuthButtons from '@/components/oauth-buttons';
import { signIn } from 'next-auth/react';

interface LoginFormProps {
  locale: string;
}

export default function LoginForm({ locale }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();
  const router = useRouter();
  const t = useTranslations("auth.login");
  const tErrors = useTranslations("auth.errors");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // 登录成功后，首先使用NextAuth signIn进行会话同步
        try {
          await signIn('credentials', {
            email,
            password,
            redirect: false,
          });
        } catch (error) {
          // NextAuth登录失败不影响主要登录流程
          console.log('NextAuth signIn error:', error);
        }

        // 手动触发认证状态更新事件
        window.dispatchEvent(new CustomEvent('authStatusChanged', {
          detail: { 
            session: { user: data.user }, 
            status: 'authenticated' 
          }
        }));

        toast({
          title: t('loginSuccess'),
          description: '欢迎回来！',
        });

        // 稍微延迟跳转，确保状态更新完成
        setTimeout(() => {
          router.push(`/${locale}/dashboard`);
          router.refresh();
        }, 100);

      } else {
        setError(data.error || tErrors('invalidCredentials'));
      }
    } catch (error) {
      setError(tErrors('networkError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 px-4 pt-24 pb-16">
      <div className="max-w-md mx-auto">
        <Card className="w-full">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              {t('title')}
            </CardTitle>
            <CardDescription className="text-center">
              {t('subtitle')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* OAuth 登录按钮 */}
            <OAuthButtons locale={locale} mode="login" />

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t('email')}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t('emailPlaceholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{t('password')}</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder={t('passwordPlaceholder')}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Link
                  href={`/${locale}/auth/forgot-password`}
                  className="text-sm text-primary hover:underline"
                >
                  {t('forgotPassword')}
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? t('loggingIn') : t('loginButton')}
              </Button>
            </form>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">{t('noAccount')} </span>
              <Link
                href={`/${locale}/auth/register`}
                className="text-primary hover:underline"
              >
                {t('registerLink')}
              </Link>
            </div>

            {/* 隐私政策和用户协议 */}
            <div className="text-center text-xs text-muted-foreground space-y-1">
              <p>{t('agreeToTerms')}</p>
              <div className="flex justify-center space-x-4">
                <Link
                  href={`/${locale}/privacy`}
                  className="text-primary hover:underline"
                >
                  {t('privacyPolicy')}
                </Link>
                <span>•</span>
                <Link
                  href={`/${locale}/terms`}
                  className="text-primary hover:underline"
                >
                  {t('termsOfService')}
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 
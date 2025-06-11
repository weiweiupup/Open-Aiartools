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

interface RegisterFormProps {
  locale: string;
}

export default function RegisterForm({ locale }: RegisterFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();
  const router = useRouter();
  const t = useTranslations("auth.register");
  const tErrors = useTranslations("auth.errors");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (password.length < 6) {
      setError(tErrors('passwordTooShort'));
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          locale,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: t('registerSuccess'),
          description: t('verificationEmailSent'),
        });
        router.push(`/${locale}/auth/verify-email-sent`);
      } else {
        setError(data.error || tErrors('networkError'));
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
            {/* OAuth 注册按钮 */}
            <OAuthButtons locale={locale} mode="register" />

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

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? t('registering') : t('registerButton')}
              </Button>
            </form>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">{t('alreadyHaveAccount')} </span>
              <Link
                href={`/${locale}/auth/login`}
                className="text-primary hover:underline"
              >
                {t('loginLink')}
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
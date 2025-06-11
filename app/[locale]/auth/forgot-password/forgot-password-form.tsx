'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, ArrowLeft, Mail } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useTranslations } from "next-intl";
import Link from 'next/link';

interface ForgotPasswordFormProps {
  locale: string;
}

export default function ForgotPasswordForm({ locale }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();
  const router = useRouter();
  const t = useTranslations("auth.forgotPassword");
  const tErrors = useTranslations("auth.errors");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          locale,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        toast({
          title: t('emailSent'),
          description: '请检查您的邮箱以重置密码。',
        });
      } else {
        setError(data.error || tErrors('networkError'));
      }
    } catch (error) {
      setError(tErrors('networkError'));
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-green-100 dark:bg-green-900 p-3">
                <Mail className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">
              {t('emailSentTitle')}
            </CardTitle>
            <CardDescription>
              {t('emailSentDesc')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center text-sm text-muted-foreground">
              <p>{t('checkEmailAt')}</p>
              <p className="font-medium text-foreground mt-1">{email}</p>
            </div>
            
            <div className="text-center text-sm text-muted-foreground">
              <p>{t('noEmailReceived')}</p>
              <Button
                variant="link"
                className="p-0 h-auto text-primary"
                onClick={() => setIsSuccess(false)}
              >
                {t('resendLink')}
              </Button>
            </div>

            <div className="text-center">
              <Link
                href={`/${locale}/auth/login`}
                className="inline-flex items-center text-sm text-primary hover:underline"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t('backToLogin')}
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            {t('title')}
          </CardTitle>
          <CardDescription className="text-center">
            {t('subtitle')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? t('sending') : t('sendResetLink')}
            </Button>
          </form>

          <div className="text-center">
            <Link
              href={`/${locale}/auth/login`}
              className="inline-flex items-center text-sm text-primary hover:underline"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('backToLogin')}
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
  );
} 
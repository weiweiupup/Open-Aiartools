'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useTranslations } from "next-intl";

interface VerifyEmailFormProps {
  locale: string;
}

export default function VerifyEmailForm({ locale }: VerifyEmailFormProps) {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const searchParams = useSearchParams();
  const router = useRouter();
  const t = useTranslations("auth.verifyEmail");
  const tErrors = useTranslations("auth.errors");
  
  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      setStatus('error');
      setMessage(t('invalidToken'));
      return;
    }

    // 验证邮箱
    const verifyEmail = async () => {
      try {
        const response = await fetch(`/api/auth/verify-email?token=${token}`);
        const data = await response.json();

        if (response.ok) {
          setStatus('success');
          setMessage(t('success'));
        } else {
          setStatus('error');
          setMessage(data.error || tErrors('verificationFailed'));
        }
      } catch (error) {
        setStatus('error');
        setMessage(tErrors('networkError'));
      }
    };

    verifyEmail();
  }, [searchParams, t, tErrors]);

  const handleGoToLogin = () => {
    router.push(`/${locale}/auth/login`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            {status === 'loading' && (
              <div className="rounded-full bg-blue-100 p-4">
                <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
              </div>
            )}
            {status === 'success' && (
              <div className="rounded-full bg-green-100 p-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            )}
            {status === 'error' && (
              <div className="rounded-full bg-red-100 p-4">
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
            )}
          </div>
          <CardTitle className="text-2xl font-bold">
            {status === 'loading' && t('verifying')}
            {status === 'success' && t('success')}
            {status === 'error' && t('error')}
          </CardTitle>
          <CardDescription>
            {message}
          </CardDescription>
        </CardHeader>
        
        {status !== 'loading' && (
          <CardContent className="space-y-4">
            {status === 'success' && (
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-sm text-green-800">
                  <p className="font-medium">{t('successTitle')}</p>
                  <ul className="mt-2 space-y-1">
                    <li>• {t('canLogin')}</li>
                    <li>• {t('accessFeatures')}</li>
                    <li>• {t('enjoyService')}</li>
                  </ul>
                </div>
              </div>
            )}
            
            {status === 'error' && (
              <div className="bg-red-50 p-4 rounded-lg">
                <div className="text-sm text-red-800">
                  <p className="font-medium">{t('possibleReasons')}</p>
                  <ul className="mt-2 space-y-1">
                    <li>• {t('linkExpired')}</li>
                    <li>• {t('linkInvalid')}</li>
                    <li>• {t('alreadyVerified')}</li>
                  </ul>
                </div>
              </div>
            )}
          </CardContent>
        )}
        
        {status !== 'loading' && (
          <CardFooter className="flex flex-col space-y-3">
            {status === 'success' && (
              <Button onClick={handleGoToLogin} className="w-full">
                {t('goToDashboard')}
              </Button>
            )}
            
            {status === 'error' && (
              <>
                <Button asChild className="w-full">
                  <Link href={`/${locale}/auth/register`}>
                    {t('registerAgain')}
                  </Link>
                </Button>
                <Link href={`/${locale}/auth/login`} className="text-center text-sm text-blue-600 hover:underline">
                  {t('backToLogin')}
                </Link>
              </>
            )}
          </CardFooter>
        )}
      </Card>
    </div>
  );
} 
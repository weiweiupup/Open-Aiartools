import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, CheckCircle } from 'lucide-react';
import { useTranslations } from "next-intl";
import { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import ResendVerificationEmail from './resend-verification-email';
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";

interface VerifyEmailSentPageProps {
  params: Promise<{
    locale: string;
  }>;
  searchParams?: {
    email?: string;
  };
}

export async function generateMetadata({ params }: VerifyEmailSentPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'auth.verifyEmailSent' });
  
  return {
    title: t('pageTitle'),
  };
}

export default async function VerifyEmailSentPage({ params, searchParams }: VerifyEmailSentPageProps) {
  const { locale } = await params;
  
  // 启用静态渲染
  setRequestLocale(locale);
  
  const t = await getTranslations('auth.verifyEmailSent');
  const email = searchParams?.email;

  return (
    <>
      <Navigation locale={locale} />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100">
              <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              {t('title')}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {t('message')}
            </p>
            {email && (
              <p className="mt-2 text-sm text-blue-600 font-medium">
                {email}
              </p>
            )}
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-blue-800 mb-2">
                  {t('stepsTitle')}
                </h3>
                <ol className="text-sm text-blue-700 space-y-1">
                  <li>1. {t('step1')}</li>
                  <li>2. {t('step2')}</li>
                  <li>3. {t('step3')}</li>
                  <li>4. {t('step4')}</li>
                </ol>
              </div>

              <div className="text-center text-sm text-gray-600">
                <p>{t('checkSpam')}</p>
              </div>

              {/* 重发验证邮件组件 */}
              {email && (
                <ResendVerificationEmail email={email} locale={locale} />
              )}

              <div className="flex flex-col space-y-3 pt-4 border-t">
                <a
                  href={`/${locale}/auth/login`}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {t('backToLogin')}
                </a>
                <a
                  href={`/${locale}/auth/register`}
                  className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {t('differentEmail')}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer locale={locale} />
    </>
  );
} 
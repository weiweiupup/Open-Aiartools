import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, CheckCircle } from 'lucide-react';
import { useTranslations } from "next-intl";
import { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

interface VerifyEmailSentPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: VerifyEmailSentPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'auth.verifyEmailSent' });
  
  return {
    title: t('pageTitle'),
  };
}

export default async function VerifyEmailSentPage({ params }: VerifyEmailSentPageProps) {
  const { locale } = await params;
  
  // Enable static rendering
  setRequestLocale(locale);
  
  const t = await getTranslations({ locale, namespace: 'auth.verifyEmailSent' });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="rounded-full bg-green-100 p-4">
              <Mail className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">{t('title')}</CardTitle>
          <CardDescription>
            {t('message')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium">{t('stepsTitle')}</p>
                <ol className="mt-2 list-decimal list-inside space-y-1">
                  <li>{t('step1')}</li>
                  <li>{t('step2')}</li>
                  <li>{t('step3')}</li>
                  <li>{t('step4')}</li>
                </ol>
              </div>
            </div>
          </div>
          <div className="text-center text-sm text-gray-600">
            <p>{t('checkSpam')}</p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-3">
          <Button asChild className="w-full">
            <Link href={`/${locale}/auth/login`}>
              {t('backToLogin')}
            </Link>
          </Button>
          <Link href={`/${locale}/auth/register`} className="text-center text-sm text-blue-600 hover:underline">
            {t('differentEmail')}
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
} 
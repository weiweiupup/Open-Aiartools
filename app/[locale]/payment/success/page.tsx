'use client';

import { use, useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight, Home } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { toast } from '@/hooks/use-toast';

interface PaymentSuccessPageProps {
  params: Promise<{
    locale: string;
  }>;
}

function PaymentSuccessContent({ locale }: { locale: string }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [sessionData, setSessionData] = useState<any>(null);
  const t = useTranslations('payment.success');

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    
    if (!sessionId) {
      router.push(`/${locale}/`);
      return;
    }

    // 验证支付会话
    const verifySession = async () => {
      try {
        const response = await fetch(`/api/verify-payment?session_id=${sessionId}`);
        const data = await response.json();
        
        if (response.ok) {
          setSessionData(data);
        } else {
          console.error('Payment verification failed:', data.error);
          toast({
            title: 'Payment Verification Error',
            description: data.error || 'Payment verification failed',
            variant: 'destructive'
          });
          router.push(`/${locale}/payment/failed`);
        }
      } catch (error) {
        console.error('Error verifying payment:', error);
        toast({
          title: 'Payment Verification Error',
          description: 'An error occurred while verifying payment',
          variant: 'destructive'
        });
        router.push(`/${locale}/payment/failed`);
      } finally {
        setIsLoading(false);
      }
    };

    verifySession();
  }, [searchParams, router, locale, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t('processing')}</p>
          <p className="text-sm text-gray-500 mt-2">{t('processingDesc')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-green-600">
            {t('title')}
          </CardTitle>
          <p className="text-gray-600 mt-2">
            {t('subtitle')}
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">{t('subscriptionDetails')}</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">{t('subscriptionPlan')}：</span>
                <span className="font-medium">{t('proVersion')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t('monthlyCredits')}：</span>
                <span className="font-medium">{t('credits800')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t('subscriptionFee')}：</span>
                <span className="font-medium">{t('pricePerMonth')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t('status')}：</span>
                <span className="font-medium text-green-600">{t('activated')}</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <Button 
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              onClick={() => router.push(`/${locale}/dashboard`)}
            >
              <Home className="w-4 h-4 mr-2" />
              {t('backToDashboard')}
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => router.push(`/${locale}#demo`)}
            >
              <ArrowRight className="w-4 h-4 mr-2" />
              {t('startUsing')}
            </Button>
          </div>
          
          <div className="text-center text-sm text-gray-500">
            <p>{t('thankYou')}</p>
            <p className="mt-1">{t('autoRenewal')}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function PaymentSuccessPage({ params }: PaymentSuccessPageProps) {
  const { locale } = use(params);

  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <PaymentSuccessContent locale={locale} />
    </Suspense>
  );
} 
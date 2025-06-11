import { getTranslations, setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import VerifyEmailForm from "./verify-email-form";

interface VerifyEmailPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: VerifyEmailPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "auth.verifyEmail" });
  
  return {
    title: t('pageTitle'),
  };
}

export default async function VerifyEmailPage({ params }: VerifyEmailPageProps) {
  const { locale } = await params;
  
  // Enable static rendering
  setRequestLocale(locale);
  
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <VerifyEmailForm locale={locale} />
    </Suspense>
  );
} 
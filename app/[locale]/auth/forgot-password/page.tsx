import { getTranslations } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";
import ForgotPasswordForm from "./forgot-password-form";

interface ForgotPasswordPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: ForgotPasswordPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "auth.forgotPassword" });
  
  return {
    title: t('pageTitle'),
  };
}

export default async function ForgotPasswordPage({ params }: ForgotPasswordPageProps) {
  const { locale } = await params;
  
  // Enable static rendering
  setRequestLocale(locale);
  
  return <ForgotPasswordForm locale={locale} />;
} 
import { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import LoginForm from "./login-form";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";

interface LoginPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: LoginPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'auth.login' });
  
  return {
    title: t('pageTitle'),
  };
}

export default async function LoginPage({ params }: LoginPageProps) {
  const { locale } = await params;
  
  // Enable static rendering
  setRequestLocale(locale);
  
  return (
    <>
      <Navigation locale={locale} />
      <LoginForm locale={locale} />
      <Footer locale={locale} />
    </>
  );
}
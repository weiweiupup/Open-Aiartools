import { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import RegisterForm from "./register-form";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";

interface RegisterPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: RegisterPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'auth.register' });
  
  return {
    title: t('pageTitle'),
  };
}

export default async function RegisterPage({ params }: RegisterPageProps) {
  const { locale } = await params;
  
  // Enable static rendering
  setRequestLocale(locale);
  
  return (
    <>
      <Navigation locale={locale} />
      <RegisterForm locale={locale} />
      <Footer locale={locale} />
    </>
  );
} 
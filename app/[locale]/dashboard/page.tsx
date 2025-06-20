import { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import DashboardContent from "./dashboard-content";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";

interface DashboardPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: DashboardPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'dashboard' });
  
  return {
    title: t('pageTitle'),
  };
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { locale } = await params;
  
  // Enable static rendering
  setRequestLocale(locale);
  
  return (
    <>
      <Navigation locale={locale} />
      <main className="pt-16">
        <DashboardContent locale={locale} />
      </main>
      <Footer locale={locale} />
    </>
  );
} 
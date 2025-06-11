import Navigation from "@/components/navigation"
import HeroSection from "@/components/hero-section"
import FeaturesSection from "@/components/features-section"
import InteractiveDemo from "@/components/interactive-demo"
import PricingSection from "@/components/pricing-section"
import TestimonialsSection from "@/components/testimonials-section"
import FAQSection from "@/components/faq-section"
import BlogSection from "@/components/blog-section"
import Footer from "@/components/footer"
import { ThemeProvider } from "@/components/theme-provider"

export default async function LocalePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <div className="min-h-screen bg-background">
        <Navigation locale={locale} />
        <main>
          <HeroSection locale={locale} />
          <FeaturesSection locale={locale} />
          <InteractiveDemo locale={locale} />
          <PricingSection locale={locale} />
          <TestimonialsSection locale={locale} />
          <FAQSection locale={locale} />
          <BlogSection locale={locale} />
        </main>
        <Footer locale={locale} />
      </div>
    </ThemeProvider>
  )
}

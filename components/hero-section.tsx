"use client"

import { Button } from "@/components/ui/button"
import { ArrowRightIcon, PlayIcon } from "lucide-react"
import ImageComparison from "@/components/image-comparison"
import { useTranslations } from "next-intl"

interface HeroSectionProps {
  locale: string
}

export default function HeroSection({ locale }: HeroSectionProps) {
  const t = useTranslations("hero")

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section className="pt-24 pb-12 md:pt-32 md:pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  {t("headline")}
                </span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">{t("subheadline")}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                onClick={() => scrollToSection("demo")}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
              >
                <PlayIcon className="mr-2 h-5 w-5" />
                {t("tryDemo")}
              </Button>
              <Button size="lg" variant="outline" onClick={() => scrollToSection("pricing")}>
                {t("viewPricing")}
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">1M+</div>
                <div className="text-sm text-muted-foreground">{t("imagesProcessed")}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">50K+</div>
                <div className="text-sm text-muted-foreground">{t("happyUsers")}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">99.9%</div>
                <div className="text-sm text-muted-foreground">{t("uptime")}</div>
              </div>
            </div>
          </div>

          {/* Right Content - Image Comparison */}
          <div className="relative">
            <ImageComparison locale={locale} />
          </div>
        </div>
      </div>
    </section>
  )
}

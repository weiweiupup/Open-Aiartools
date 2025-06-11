"use client"

import { Card, CardContent } from "@/components/ui/card"
import { WandIcon, PaletteIcon, ImageIcon, DownloadIcon } from "lucide-react"
import { useTranslations } from "next-intl"

interface FeaturesSectionProps {
  locale: string
}

export default function FeaturesSection({ locale }: FeaturesSectionProps) {
  const t = useTranslations("features")

  const features = [
    {
      icon: WandIcon,
      title: t("smartKeywords.title"),
      description: t("smartKeywords.description"),
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: PaletteIcon,
      title: t("stylizedFilters.title"),
      description: t("stylizedFilters.description"),
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: ImageIcon,
      title: t("objectManipulation.title"),
      description: t("objectManipulation.description"),
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: DownloadIcon,
      title: t("highResolution.title"),
      description: t("highResolution.description"),
      gradient: "from-orange-500 to-red-500",
    },
  ]

  return (
    <section id="features" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("title")}</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">{t("subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group hover:shadow-lg transition-all duration-300 border-0 bg-background/60 backdrop-blur-sm"
            >
              <CardContent className="p-6 text-center">
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.gradient} mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, ArrowRightIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useTranslations } from "next-intl"

interface BlogSectionProps {
  locale: string
}

export default function BlogSection({ locale }: BlogSectionProps) {
  const t = useTranslations("blog")

  // 博客文章配置，按时间顺序排列（最新的在前）
  const blogPostsConfig = [
    {
      key: "contact",
      link: `/${locale}/blog/contact-us`,
      sortDate: "2025-06-01",
      image: "/images/Get in Touch with Aiartools Team.png"
    },
    {
      key: "editingGuide", 
      link: `/${locale}/blog/how-to-edit-images`,
      sortDate: "2025-06-01",
      image: "/images/How to Edit Images with Aiartools.png"
    },
    {
      key: "introduction",
      link: `/${locale}/blog/introducing-aiartools`,
      sortDate: "2025-05-31",
      image: "/images/Transform Your Images with the Power of AI.png"
    },
  ]

  // 按时间排序（最新的在前）
  const sortedPosts = blogPostsConfig.sort((a, b) => 
    new Date(b.sortDate).getTime() - new Date(a.sortDate).getTime()
  )

  return (
    <section id="blog" className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("title")}</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">{t("subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {sortedPosts.map((postConfig, index) => (
            <Card
              key={index}
              className="group hover:shadow-lg transition-all duration-300 overflow-hidden bg-background/60 backdrop-blur-sm border-0"
            >
              <Link href={postConfig.link}>
                <div className="relative overflow-hidden">
                  <Image
                    src={postConfig.image}
                    alt={t(`posts.${postConfig.key}.title`)}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                      {t(`posts.${postConfig.key}.category`)}
                    </Badge>
                  </div>
                </div>
              </Link>

              <CardContent className="p-6">
                <div className="flex items-center text-sm text-muted-foreground mb-3">
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  {t(`posts.${postConfig.key}.date`)}
                  <span className="mx-2">•</span>
                  {t(`posts.${postConfig.key}.readTime`)}
                </div>

                <Link href={postConfig.link}>
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors cursor-pointer">
                    {t(`posts.${postConfig.key}.title`)}
                  </h3>
                </Link>

                <p className="text-muted-foreground leading-relaxed mb-4">
                  {t(`posts.${postConfig.key}.excerpt`)}
                </p>

                <Link href={postConfig.link}>
                  <Button variant="ghost" className="p-0 h-auto font-semibold text-primary hover:text-primary/80">
                    {t("readMore")}
                    <ArrowRightIcon className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link href={`/${locale}/blog`}>
            <Button size="lg" variant="outline">
              {t("viewAllPosts")}
              <ArrowRightIcon className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

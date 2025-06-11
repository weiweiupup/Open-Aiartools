import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, ArrowRightIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { ThemeProvider } from "@/components/theme-provider"
import { useTranslations } from "next-intl"
import { Metadata } from "next"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  
  const titles = {
    en: "Blog - Aiartools | AI Image Editing Tips & News",
    zh: "博客 - Aiartools | AI图像编辑技巧与新闻"
  }
  
  const descriptions = {
    en: "Discover the latest AI image editing tips, tutorials, and news from Aiartools. Learn how to transform your images with artificial intelligence.",
    zh: "探索来自Aiartools的最新AI图像编辑技巧、教程和新闻。学习如何用人工智能变换您的图像。"
  }

  const title = titles[locale as keyof typeof titles] || titles.en
  const description = descriptions[locale as keyof typeof descriptions] || descriptions.en

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://aiartools.com/${locale}/blog`,
      siteName: "Aiartools",
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
    alternates: {
      canonical: `https://aiartools.com/${locale}/blog`,
      languages: {
        'en': 'https://aiartools.com/en/blog',
        'zh': 'https://aiartools.com/zh/blog',
      },
    },
  }
}

interface BlogPageProps {
  params: Promise<{ locale: string }>
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { locale } = await params

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <div className="min-h-screen bg-background">
        <Navigation locale={locale} />
        <BlogContent locale={locale} />
        <Footer locale={locale} />
      </div>
    </ThemeProvider>
  )
}

function BlogContent({ locale }: { locale: string }) {
  const t = useTranslations("blog")

  // 博客文章配置，按时间顺序排列
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
        <div className="pt-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-16">
              <h1 className="text-4xl font-bold mb-4">{t("title")}</h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">{t("subtitle")}</p>
            </div>

        {/* All Posts */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-6">{t("allPosts")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedPosts.map((postConfig, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 overflow-hidden bg-background/60 backdrop-blur-sm border-0">
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
        </div>
      </div>
    </div>
  )
}

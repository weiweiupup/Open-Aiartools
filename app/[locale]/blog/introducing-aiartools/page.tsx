import { Button } from "@/components/ui/button"
import { ArrowLeftIcon, CalendarIcon, ClockIcon, TagIcon } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { ThemeProvider } from "@/components/theme-provider"
import { Metadata } from "next"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  
  const titles = {
    en: "Introducing Aiartools: Transform Your Images with AI | Aiartools Blog",
    zh: "Aiartools介绍：用AI的力量改变你的图像 | Aiartools 博客"
  }
  
  const descriptions = {
    en: "Discover Aiartools, the revolutionary AI-powered image transformation platform. Edit and transform images using simple text prompts with cutting-edge AI technology.",
    zh: "发现Aiartools，革命性的AI驱动图像转换平台。使用尖端AI技术，通过简单的文本提示编辑和转换图像。"
  }

  const title = titles[locale as keyof typeof titles] || titles.en
  const description = descriptions[locale as keyof typeof descriptions] || descriptions.en

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://aiartools.com/${locale}/blog/introducing-aiartools`,
      siteName: "Aiartools",
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
      type: 'article',
      images: [
        {
          url: 'https://aiartools.com/images/Transform Your Images with the Power of AI.png',
          width: 1000,
          height: 500,
          alt: 'Aiartools Introduction',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['https://aiartools.com/images/Transform Your Images with the Power of AI.png'],
    },
    alternates: {
      canonical: `https://aiartools.com/${locale}/blog/introducing-aiartools`,
      languages: {
        'en': 'https://aiartools.com/en/blog/introducing-aiartools',
        'zh': 'https://aiartools.com/zh/blog/introducing-aiartools',
      },
    },
  }
}

interface BlogPostProps {
  params: Promise<{ locale: string }>
}

export default async function IntroducingAiartools({ params }: BlogPostProps) {
  const { locale } = await params
  const t = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      en: {
        backToHome: "Back to Home",
        backToBlog: "Back to Blog",
        title: "Introducing Aiartools: Transform Your Images with the Power of AI",
        publishDate: "May 31, 2025",
        readTime: "5 min read",
        category: "Product",
        introduction: "Introduction",
        introText:
          "Today, we're excited to introduce Aiartools, a revolutionary AI-powered image transformation platform that allows you to edit and transform your images using simple text prompts. Whether you're a professional designer, a social media manager, or just someone who loves creating beautiful images, Aiartools makes image editing accessible, fun, and incredibly powerful.",
        whatIsAiartools: "What is Aiartools?",
        whatIsText:
          "Aiartools is an AI-powered image editing platform that understands natural language. Instead of learning complex editing software or manipulating dozens of sliders and controls, you simply describe what you want to change about your image, and our AI does the rest. Want to turn a daytime photo into a night scene? Add a cat to your living room photo? Transform your portrait into an anime character? With Aiartools, it's as simple as typing your request.",
        keyFeatures: "Key Features",
        feature1Title: "Smart Keyword Editing",
        feature1Text:
          "Use our powerful built-in keywords or define your own to modify styles, objects, and ambiances. Our AI understands context and can make intelligent edits based on your descriptions.",
        feature2Title: "Stylized Filters",
        feature2Text:
          "Instantly apply styles like 'Anime', 'Cyberpunk', 'Van Gogh', or 'Realistic' with one click. Transform your photos into artwork that matches your creative vision.",
        feature3Title: "Object Manipulation",
        feature3Text:
          "Seamlessly add, remove, or replace objects in your photos. Add a 'cat on the roof' or remove 'unwanted people' from your vacation photos with simple text commands.",
        feature4Title: "High-Resolution Export",
        feature4Text:
          "Export your creations in up to 4K resolution, ready for print and digital use. Our AI maintains image quality even through complex transformations.",
        howItWorks: "How It Works",
        howItWorksText: "Using Aiartools is incredibly simple:",
        step1: "1. Upload your image",
        step1Text: "Start by uploading the image you want to transform. We support all common image formats.",
        step2: "2. Describe your desired changes",
        step2Text: "Tell our AI what you want to change. Be as specific or creative as you like.",
        step3: "3. Generate and download",
        step3Text:
          "Our AI processes your request and generates the transformed image in seconds. Download it and share your creation with the world.",
        useCases: "Use Cases",
        useCasesText: "Aiartools can be used in countless creative ways:",
        useCase1: "• Social media content creation",
        useCase1Text: "Create eye-catching, unique images for your social media posts that stand out from the crowd.",
        useCase2: "• Marketing materials",
        useCase2Text:
          "Quickly generate professional-looking visuals for marketing campaigns without expensive photo shoots.",
        useCase3: "• Personal projects",
        useCase3Text:
          "Transform your personal photos into artistic masterpieces or fun, creative images to share with friends and family.",
        useCase4: "• E-commerce product photography",
        useCase4Text:
          "Enhance product photos or change backgrounds to showcase your products in different environments.",
        gettingStarted: "Getting Started",
        gettingStartedText: "Ready to transform your images with Aiartools? Getting started is easy:",
        gettingStarted1: "1. Sign up for a free account",
        gettingStarted1Text: "Our free plan gives you 5 image generations per month to try out the service.",
        gettingStarted2: "2. Upload your first image",
        gettingStarted2Text: "Choose any image from your collection that you'd like to transform.",
        gettingStarted3: "3. Experiment with prompts",
        gettingStarted3Text: "Try different descriptions to see the amazing transformations our AI can create.",
        conclusion: "Conclusion",
        conclusionText:
          "Aiartools represents the future of image editing – where complex technical skills are replaced by simple, natural language instructions. We're just getting started, and we have an exciting roadmap of new features and capabilities planned for the coming months.",
        conclusionText2:
          "We invite you to join us on this journey and experience the magic of AI-powered image transformation. Sign up today and start creating images limited only by your imagination.",
        tryItNow: "Try Aiartools Now",
      },
      zh: {
        backToHome: "返回首页",
        backToBlog: "返回博客",
        title: "Aiartools介绍：用AI的力量改变你的图像",
        publishDate: "2025年5月31日",
        readTime: "5分钟阅读",
        category: "产品",
        introduction: "介绍",
        introText:
          "今天，我们很高兴地介绍Aiartools，这是一个革命性的AI驱动图像转换平台，允许您使用简单的文本提示编辑和转换图像。无论您是专业设计师、社交媒体经理，还是只是喜欢创建美丽图像的人，Aiartools都使图像编辑变得易于使用、有趣且功能强大。",
        whatIsAiartools: "什么是Aiartools？",
        whatIsText:
          "Aiartools是一个能够理解自然语言的AI驱动图像编辑平台。您无需学习复杂的编辑软件或操作数十个滑块和控件，只需描述您想要对图像进行的更改，我们的AI就会完成其余的工作。想要将白天的照片变成夜景？在您的客厅照片中添加一只猫？将您的肖像转变为动漫角色？使用Aiartools，只需输入您的请求即可。",
        keyFeatures: "主要功能",
        feature1Title: "智能关键词编辑",
        feature1Text:
          "使用我们强大的内置关键词或定义您自己的关键词来修改样式、对象和氛围。我们的AI理解上下文，并可以根据您的描述进行智能编辑。",
        feature2Title: "风格化滤镜",
        feature2Text: "一键应用风格，如'动漫'、'赛博朋克'、'梵高'或'写实'。将您的照片转变为符合您创意愿景的艺术作品。",
        feature3Title: "对象操作",
        feature3Text:
          "无缝添加、删除或替换照片中的对象。通过简单的文本命令在'屋顶上添加猫'或从'度假照片中删除不需要的人'。",
        feature4Title: "高分辨率导出",
        feature4Text:
          "以高达4K的分辨率导出您的作品，可用于打印和数字使用。我们的AI即使在复杂的转换过程中也能保持图像质量。",
        howItWorks: "工作原理",
        howItWorksText: "使用Aiartools非常简单：",
        step1: "1. 上传您的图像",
        step1Text: "首先上传您想要转换的图像。我们支持所有常见的图像格式。",
        step2: "2. 描述您想要的更改",
        step2Text: "告诉我们的AI您想要更改什么。您可以根据自己的喜好具体或创意。",
        step3: "3. 生成和下载",
        step3Text: "我们的AI处理您的请求并在几秒钟内生成转换后的图像。下载它并与世界分享您的创作。",
        useCases: "使用场景",
        useCasesText: "Aiartools可以在无数创意方式中使用：",
        useCase1: "• 社交媒体内容创作",
        useCase1Text: "为您的社交媒体帖子创建引人注目、独特的图像，让您在人群中脱颖而出。",
        useCase2: "• 营销材料",
        useCase2Text: "无需昂贵的摄影拍摄，快速生成专业外观的营销活动视觉效果。",
        useCase3: "• 个人项目",
        useCase3Text: "将您的个人照片转变为艺术杰作或有趣、创意的图像，与朋友和家人分享。",
        useCase4: "• 电子商务产品摄影",
        useCase4Text: "增强产品照片或更改背景，以在不同环境中展示您的产品。",
        gettingStarted: "入门指南",
        gettingStartedText: "准备好用Aiartools转换您的图像了吗？入门很简单：",
        gettingStarted1: "1. 注册免费账户",
        gettingStarted1Text: "我们的免费计划每月提供5次图像生成，让您试用该服务。",
        gettingStarted2: "2. 上传您的第一张图像",
        gettingStarted2Text: "从您的收藏中选择任何您想要转换的图像。",
        gettingStarted3: "3. 尝试不同的提示",
        gettingStarted3Text: "尝试不同的描述，看看我们的AI可以创建的惊人转换。",
        conclusion: "结论",
        conclusionText:
          "Aiartools代表了图像编辑的未来——复杂的技术技能被简单、自然的语言指令所取代。我们才刚刚开始，我们计划在未来几个月内推出令人兴奋的新功能和能力。",
        conclusionText2:
          "我们邀请您加入我们的旅程，体验AI驱动的图像转换的魔力。立即注册并开始创建仅受您想象力限制的图像。",
        tryItNow: "立即试用Aiartools",
      },
    }
    return translations[locale]?.[key] || translations.en[key]
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <div className="min-h-screen bg-background">
        <Navigation locale={locale} />
        <div className="pt-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="max-w-4xl mx-auto">
              {/* Navigation */}
              <div className="flex flex-wrap gap-4 mb-8">
                <Link href={`/${locale}`}>
                  <Button variant="ghost" size="sm">
                    <ArrowLeftIcon className="w-4 h-4 mr-2" />
                    {t("backToHome")}
                  </Button>
                </Link>
                <Link href={`/${locale}/blog`}>
                  <Button variant="ghost" size="sm">
                    <ArrowLeftIcon className="w-4 h-4 mr-2" />
                    {t("backToBlog")}
                  </Button>
                </Link>
              </div>

              {/* Header */}
              <div className="mb-8">
                <h1 className="text-4xl font-bold mb-6">{t("title")}</h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    {t("publishDate")}
                  </div>
                  <div className="flex items-center">
                    <ClockIcon className="w-4 h-4 mr-2" />
                    {t("readTime")}
                  </div>
                  <div className="flex items-center">
                    <TagIcon className="w-4 h-4 mr-2" />
                    {t("category")}
                  </div>
                </div>
              </div>

              {/* Featured Image */}
              <div className="mb-10 rounded-xl overflow-hidden">
                <Image
                  src="/images/Transform Your Images with the Power of AI.png"
                  alt="Aiartools Introduction"
                  width={1000}
                  height={500}
                  className="w-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
                <section>
                  <h2 className="text-2xl font-semibold mb-4">{t("introduction")}</h2>
                  <p className="text-muted-foreground leading-relaxed">{t("introText")}</p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">{t("whatIsAiartools")}</h2>
                  <p className="text-muted-foreground leading-relaxed">{t("whatIsText")}</p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">{t("keyFeatures")}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <h3 className="text-xl font-medium">{t("feature1Title")}</h3>
                      <p className="text-muted-foreground">{t("feature1Text")}</p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-medium">{t("feature2Title")}</h3>
                      <p className="text-muted-foreground">{t("feature2Text")}</p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-medium">{t("feature3Title")}</h3>
                      <p className="text-muted-foreground">{t("feature3Text")}</p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-medium">{t("feature4Title")}</h3>
                      <p className="text-muted-foreground">{t("feature4Text")}</p>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">{t("howItWorks")}</h2>
                  <p className="text-muted-foreground mb-4">{t("howItWorksText")}</p>
                  <div className="space-y-4">
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <h3 className="font-medium mb-2">{t("step1")}</h3>
                      <p className="text-muted-foreground">{t("step1Text")}</p>
                    </div>
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <h3 className="font-medium mb-2">{t("step2")}</h3>
                      <p className="text-muted-foreground">{t("step2Text")}</p>
                    </div>
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <h3 className="font-medium mb-2">{t("step3")}</h3>
                      <p className="text-muted-foreground">{t("step3Text")}</p>
                    </div>
                  </div>
                </section>

                {/* Example Transformations */}
                <section className="my-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="rounded-lg overflow-hidden">
                      <Image
                        src="/images/Original Image.jpg"
                        alt="Before transformation"
                        width={500}
                        height={300}
                        className="w-full object-cover"
                      />
                      <p className="text-center text-sm text-muted-foreground mt-2">Original Image</p>
                    </div>
                    <div className="rounded-lg overflow-hidden">
                      <Image
                        src="/images/AI Transformed.jpg"
                        alt="After transformation"
                        width={500}
                        height={300}
                        className="w-full object-cover"
                      />
                      <p className="text-center text-sm text-muted-foreground mt-2">AI Transformed</p>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">{t("useCases")}</h2>
                  <p className="text-muted-foreground mb-4">{t("useCasesText")}</p>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium">{t("useCase1")}</h3>
                      <p className="text-muted-foreground">{t("useCase1Text")}</p>
                    </div>
                    <div>
                      <h3 className="font-medium">{t("useCase2")}</h3>
                      <p className="text-muted-foreground">{t("useCase2Text")}</p>
                    </div>
                    <div>
                      <h3 className="font-medium">{t("useCase3")}</h3>
                      <p className="text-muted-foreground">{t("useCase3Text")}</p>
                    </div>
                    <div>
                      <h3 className="font-medium">{t("useCase4")}</h3>
                      <p className="text-muted-foreground">{t("useCase4Text")}</p>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">{t("gettingStarted")}</h2>
                  <p className="text-muted-foreground mb-4">{t("gettingStartedText")}</p>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium">{t("gettingStarted1")}</h3>
                      <p className="text-muted-foreground">{t("gettingStarted1Text")}</p>
                    </div>
                    <div>
                      <h3 className="font-medium">{t("gettingStarted2")}</h3>
                      <p className="text-muted-foreground">{t("gettingStarted2Text")}</p>
                    </div>
                    <div>
                      <h3 className="font-medium">{t("gettingStarted3")}</h3>
                      <p className="text-muted-foreground">{t("gettingStarted3Text")}</p>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">{t("conclusion")}</h2>
                  <p className="text-muted-foreground mb-4">{t("conclusionText")}</p>
                  <p className="text-muted-foreground">{t("conclusionText2")}</p>
                </section>

                <div className="text-center my-10">
                  <Link href={`/${locale}`}>
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                    >
                      {t("tryItNow")}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer locale={locale} />
      </div>
    </ThemeProvider>
  )
}

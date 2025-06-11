import { Button } from "@/components/ui/button"
import { ArrowLeftIcon, CalendarIcon, ClockIcon, TagIcon, UploadIcon, SparklesIcon, CheckIcon } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { ThemeProvider } from "@/components/theme-provider"
import { Metadata } from "next"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  
  const titles = {
    en: "Complete Guide: How to Edit Images with Aiartools | AI Image Editing Tutorial",
    zh: "完整指南：如何使用Aiartools编辑图片 | AI图像编辑教程"
  }
  
  const descriptions = {
    en: "Learn how to edit and transform images using Aiartools. Complete step-by-step tutorial with tips, techniques, and examples for AI-powered image editing.",
    zh: "学习如何使用Aiartools编辑和变换图片。包含AI驱动图像编辑的技巧、技术和示例的完整分步教程。"
  }

  const title = titles[locale as keyof typeof titles] || titles.en
  const description = descriptions[locale as keyof typeof descriptions] || descriptions.en

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://aiartools.com/${locale}/blog/how-to-edit-images`,
      siteName: "Aiartools",
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
      type: 'article',
      images: [
        {
          url: 'https://aiartools.com/images/How to Edit Images with Aiartools.png',
          width: 1000,
          height: 400,
          alt: 'How to Edit Images with Aiartools',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['https://aiartools.com/images/How to Edit Images with Aiartools.png'],
    },
    alternates: {
      canonical: `https://aiartools.com/${locale}/blog/how-to-edit-images`,
      languages: {
        'en': 'https://aiartools.com/en/blog/how-to-edit-images',
        'zh': 'https://aiartools.com/zh/blog/how-to-edit-images',
      },
    },
  }
}

interface BlogPostProps {
  params: Promise<{ locale: string }>
}

export default async function HowToEditImages({ params }: BlogPostProps) {
  const { locale } = await params

  const t = (key: string): any => {
    const translations: Record<string, Record<string, any>> = {
      en: {
        backToHome: "Back to Home",
        backToBlog: "Back to Blog",
        title: "Complete Guide: How to Edit Images with Aiartools",
        publishDate: "June 1, 2025",
        readTime: "8 min read",
        category: "Tutorial",
        introduction: "Getting Started with AI Image Editing",
        introText:
          "Welcome to the complete guide on how to edit images using Aiartools! Whether you're a beginner or looking to improve your AI image editing skills, this comprehensive tutorial will walk you through everything you need to know to create stunning image transformations.",
        stepByStep: "Step-by-Step Tutorial",
        step1Title: "Step 1: Upload Your Image",
        step1Text: "The first step is to upload the image you want to transform. Here's how:",
        step1List: [
          "Click the 'Upload Your Image' button in the demo section",
          "Drag and drop your image file or click to browse",
          "Supported formats: JPEG, PNG, WebP, TIFF (up to 5MB for free users)",
          "Wait for the image to upload and appear in the preview",
        ],
        step2Title: "Step 2: Write Your Prompt",
        step2Text: "The key to great results is writing effective prompts. Here are the best practices:",
        step2List: [
          "Be specific and descriptive about what you want to change",
          "Use clear, simple language that describes the desired outcome",
          "Include style references if you want a particular artistic look",
          "Mention objects, colors, lighting, or mood you want to add or modify",
        ],
        promptExamples: "Prompt Examples",
        promptExamplesText: "Here are some effective prompt examples to inspire your creativity:",
        basicPrompts: "Basic Transformations",
        basicPromptsList: [
          "'Make it nighttime' - Changes daytime scenes to night",
          "'Add snow' - Adds snow to any landscape or scene",
          "'Remove background' - Creates a transparent or clean background",
          "'Make it sunny' - Brightens the scene and adds sunlight",
        ],
        stylePrompts: "Style Transformations",
        stylePromptsList: [
          "'Anime style' - Converts photos to anime/manga art style",
          "'Van Gogh painting' - Applies Van Gogh's artistic style",
          "'Cyberpunk style' - Adds futuristic, neon cyberpunk aesthetics",
          "'Watercolor painting' - Transforms to watercolor art style",
        ],
        objectPrompts: "Object Manipulation",
        objectPromptsList: [
          "'Add a cat on the sofa' - Places a cat in the specified location",
          "'Remove the person in red shirt' - Removes specific people from photos",
          "'Change the car to blue' - Modifies object colors",
          "'Add flowers in the garden' - Adds natural elements to scenes",
        ],
        step3Title: "Step 3: Generate and Review",
        step3Text: "Once you've written your prompt, it's time to generate your transformed image:",
        step3List: [
          "Click the 'Generate Image' button to start processing",
          "Wait for the AI to process your request (usually 10-30 seconds)",
          "Review the generated result in the preview panel",
          "If you're not satisfied, try refining your prompt and generate again",
        ],
        advancedTips: "Advanced Tips and Techniques",
        advancedTipsText: "Take your image editing to the next level with these professional tips:",
        tip1Title: "Combine Multiple Effects",
        tip1Text:
          "You can combine multiple transformations in a single prompt: 'Make it sunset with purple sky and add birds flying'",
        tip2Title: "Use Negative Prompts",
        tip2Text: "Specify what you DON'T want: 'Add a garden but no people or cars'",
        tip3Title: "Be Specific About Placement",
        tip3Text:
          "Use directional terms: 'Add a mountain in the background' or 'Put a lamp on the left side of the table'",
        tip4Title: "Experiment with Lighting",
        tip4Text:
          "Lighting can dramatically change mood: 'Golden hour lighting', 'Dramatic shadows', 'Soft morning light'",
        commonKeywords: "Common Keywords and Their Effects",
        keywordsText: "Here are some powerful keywords you can use in your prompts:",
        lightingKeywords: "Lighting Keywords",
        lightingList: [
          "Golden hour - Warm, soft lighting",
          "Blue hour - Cool twilight lighting",
          "Dramatic lighting - High contrast shadows",
          "Soft lighting - Even, gentle illumination",
        ],
        weatherKeywords: "Weather Keywords",
        weatherList: [
          "Sunny - Bright, clear conditions",
          "Cloudy - Overcast sky",
          "Rainy - Wet surfaces and rain effects",
          "Foggy - Misty, atmospheric conditions",
        ],
        styleKeywords: "Style Keywords",
        styleList: [
          "Vintage - Retro, aged appearance",
          "Modern - Clean, contemporary look",
          "Artistic - Painterly, creative effects",
          "Realistic - Photographic quality",
        ],
        troubleshooting: "Troubleshooting Common Issues",
        troubleshootingText: "Having trouble getting the results you want? Here are solutions to common problems:",
        issue1Title: "Results Don't Match My Prompt",
        issue1Solution:
          "Try being more specific in your description. Instead of 'make it better', use 'brighten the colors and add contrast'.",
        issue2Title: "Changes Are Too Subtle",
        issue2Solution:
          "Use stronger descriptive words like 'dramatic', 'vibrant', or 'intense' to make effects more pronounced.",
        issue3Title: "Unwanted Elements Appear",
        issue3Solution:
          "Be more specific about what you want and add negative descriptions: 'add trees but no buildings'.",
        issue4Title: "Image Quality Issues",
        issue4Solution:
          "Ensure your original image is high quality and well-lit. Blurry or dark images may produce poor results.",
        bestPractices: "Best Practices for Success",
        bestPracticesText: "Follow these guidelines to consistently get great results:",
        practice1: "Start with high-quality, well-lit original images",
        practice2: "Write clear, specific prompts with descriptive language",
        practice3: "Experiment with different phrasings if first attempt doesn't work",
        practice4: "Use the quick keyword suggestions for inspiration",
        practice5: "Save successful prompts for future reference",
        practice6: "Don't be afraid to try creative and unusual combinations",
        conclusion: "Start Creating Amazing Images Today",
        conclusionText:
          "With these techniques and tips, you're ready to create stunning image transformations using Aiartools. Remember, the key to success is experimentation and practice. Don't be afraid to try different prompts and approaches – that's how you'll discover the most creative possibilities!",
        conclusionText2:
          "Ready to put these techniques into practice? Head over to our demo section and start transforming your images with the power of AI.",
        tryNow: "Try Aiartools Now",
      },
      zh: {
        backToHome: "返回首页",
        backToBlog: "返回博客",
        title: "完整指南：如何使用Aiartools编辑图片",
        publishDate: "2025年6月1日",
        readTime: "8分钟阅读",
        category: "教程",
        introduction: "AI图像编辑入门",
        introText:
          "欢迎来到使用Aiartools编辑图片的完整指南！无论您是初学者还是想要提高AI图像编辑技能，这个全面的教程将引导您了解创建令人惊叹的图像变换所需的一切知识。",
        stepByStep: "分步教程",
        step1Title: "第1步：上传您的图片",
        step1Text: "第一步是上传您想要变换的图片。操作方法如下：",
        step1List: [
          '点击演示部分的"上传您的图片"按钮',
          "拖拽图片文件或点击浏览",
          "支持格式：JPEG、PNG、WebP、TIFF（免费用户最大5MB）",
          "等待图片上传并在预览中显示",
        ],
        step2Title: "第2步：编写您的提示词",
        step2Text: "获得出色结果的关键是编写有效的提示词。以下是最佳实践：",
        step2List: [
          "对您想要改变的内容要具体和描述性",
          "使用清晰、简单的语言描述期望的结果",
          "如果您想要特定的艺术外观，请包含风格参考",
          "提及您想要添加或修改的对象、颜色、光线或情绪",
        ],
        promptExamples: "提示词示例",
        promptExamplesText: "以下是一些有效的提示词示例，可以激发您的创造力：",
        basicPrompts: "基础变换",
        basicPromptsList: [
          '"变成夜晚" - 将白天场景变为夜晚',
          '"添加雪花" - 为任何风景或场景添加雪',
          '"移除背景" - 创建透明或干净的背景',
          '"变成晴天" - 使场景更明亮并添加阳光',
        ],
        stylePrompts: "风格变换",
        stylePromptsList: [
          '"动漫风格" - 将照片转换为动漫/漫画艺术风格',
          '"梵高画作" - 应用梵高的艺术风格',
          '"赛博朋克风格" - 添加未来主义、霓虹赛博朋克美学',
          '"水彩画" - 转换为水彩艺术风格',
        ],
        objectPrompts: "对象操作",
        objectPromptsList: [
          '"在沙发上添加一只猫" - 在指定位置放置一只猫',
          '"移除穿红衣服的人" - 从照片中移除特定的人',
          '"将汽车改为蓝色" - 修改对象颜色',
          '"在花园中添加花朵" - 为场景添加自然元素',
        ],
        step3Title: "第3步：生成和查看",
        step3Text: "编写好提示词后，就可以生成变换后的图片了：",
        step3List: [
          '点击"生成图片"按钮开始处理',
          "等待AI处理您的请求（通常10-30秒）",
          "在预览面板中查看生成的结果",
          "如果不满意，尝试优化您的提示词并重新生成",
        ],
        advancedTips: "高级技巧和技术",
        advancedTipsText: "使用这些专业技巧将您的图像编辑提升到新水平：",
        tip1Title: "组合多种效果",
        tip1Text: '您可以在单个提示词中组合多种变换："变成日落，紫色天空，添加飞鸟"',
        tip2Title: "使用负面提示",
        tip2Text: '指定您不想要的内容："添加花园但不要人或汽车"',
        tip3Title: "具体说明位置",
        tip3Text: '使用方向术语："在背景中添加山脉"或"在桌子左侧放一盏灯"',
        tip4Title: "尝试不同光线",
        tip4Text: '光线可以显著改变情绪："黄金时刻光线"、"戏剧性阴影"、"柔和晨光"',
        commonKeywords: "常用关键词及其效果",
        keywordsText: "以下是您可以在提示词中使用的一些强大关键词：",
        lightingKeywords: "光线关键词",
        lightingList: [
          "黄金时刻 - 温暖、柔和的光线",
          "蓝调时刻 - 凉爽的黄昏光线",
          "戏剧性光线 - 高对比度阴影",
          "柔和光线 - 均匀、温和的照明",
        ],
        weatherKeywords: "天气关键词",
        weatherList: ["晴朗 - 明亮、清晰的条件", "多云 - 阴天", "下雨 - 湿润表面和雨水效果", "雾天 - 朦胧、大气条件"],
        styleKeywords: "风格关键词",
        styleList: ["复古 - 怀旧、陈旧外观", "现代 - 干净、当代外观", "艺术 - 绘画般、创意效果", "写实 - 摄影质量"],
        troubleshooting: "常见问题故障排除",
        troubleshootingText: "无法获得想要的结果？以下是常见问题的解决方案：",
        issue1Title: "结果与我的提示词不匹配",
        issue1Solution: '尝试在描述中更具体。不要说"让它更好"，而是使用"增亮颜色并添加对比度"。',
        issue2Title: "变化太微妙",
        issue2Solution: '使用更强的描述词，如"戏剧性"、"鲜艳"或"强烈"来使效果更明显。',
        issue3Title: "出现不需要的元素",
        issue3Solution: '更具体地说明您想要什么，并添加负面描述："添加树木但不要建筑物"。',
        issue4Title: "图像质量问题",
        issue4Solution: "确保您的原始图像质量高且光线充足。模糊或暗淡的图像可能产生较差的结果。",
        bestPractices: "成功的最佳实践",
        bestPracticesText: "遵循这些指导原则以持续获得出色结果：",
        practice1: "从高质量、光线充足的原始图像开始",
        practice2: "使用描述性语言编写清晰、具体的提示词",
        practice3: "如果第一次尝试不成功，尝试不同的措辞",
        practice4: "使用快速关键词建议获取灵感",
        practice5: "保存成功的提示词以供将来参考",
        practice6: "不要害怕尝试创意和不寻常的组合",
        conclusion: "今天就开始创建令人惊叹的图像",
        conclusionText:
          "有了这些技术和技巧，您已经准备好使用Aiartools创建令人惊叹的图像变换。记住，成功的关键是实验和练习。不要害怕尝试不同的提示词和方法——这就是您发现最具创意可能性的方式！",
        conclusionText2: "准备将这些技术付诸实践了吗？前往我们的演示部分，开始用AI的力量变换您的图像。",
        tryNow: "立即试用Aiartools",
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
                  src="/images/How to Edit Images with Aiartools.png"
                  alt="How to Edit Images with Aiartools"
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
                  <h2 className="text-2xl font-semibold mb-6">{t("stepByStep")}</h2>

                  {/* Step 1 */}
                  <div className="bg-muted/30 p-6 rounded-lg mb-6">
                    <h3 className="text-xl font-medium mb-3 flex items-center">
                      <UploadIcon className="w-5 h-5 mr-2 text-primary" />
                      {t("step1Title")}
                    </h3>
                    <p className="text-muted-foreground mb-4">{t("step1Text")}</p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-2 pl-4">
                      {(t("step1List") as string[]).map((item: string, index: number) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Step 2 */}
                  <div className="bg-muted/30 p-6 rounded-lg mb-6">
                    <h3 className="text-xl font-medium mb-3 flex items-center">
                      <SparklesIcon className="w-5 h-5 mr-2 text-primary" />
                      {t("step2Title")}
                    </h3>
                    <p className="text-muted-foreground mb-4">{t("step2Text")}</p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-2 pl-4">
                      {(t("step2List") as string[]).map((item: string, index: number) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Step 3 */}
                  <div className="bg-muted/30 p-6 rounded-lg mb-6">
                    <h3 className="text-xl font-medium mb-3 flex items-center">
                      <CheckIcon className="w-5 h-5 mr-2 text-primary" />
                      {t("step3Title")}
                    </h3>
                    <p className="text-muted-foreground mb-4">{t("step3Text")}</p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-2 pl-4">
                      {(t("step3List") as string[]).map((item: string, index: number) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">{t("promptExamples")}</h2>
                  <p className="text-muted-foreground mb-6">{t("promptExamplesText")}</p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Basic Prompts */}
                    <div className="border rounded-lg p-5">
                      <h3 className="font-medium mb-3">{t("basicPrompts")}</h3>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        {(t("basicPromptsList") as string[]).map((item: string, index: number) => (
                          <li key={index} className="flex items-start">
                            <span className="text-primary mr-2">•</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Style Prompts */}
                    <div className="border rounded-lg p-5">
                      <h3 className="font-medium mb-3">{t("stylePrompts")}</h3>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        {(t("stylePromptsList") as string[]).map((item: string, index: number) => (
                          <li key={index} className="flex items-start">
                            <span className="text-primary mr-2">•</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Object Prompts */}
                    <div className="border rounded-lg p-5">
                      <h3 className="font-medium mb-3">{t("objectPrompts")}</h3>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        {(t("objectPromptsList") as string[]).map((item: string, index: number) => (
                          <li key={index} className="flex items-start">
                            <span className="text-primary mr-2">•</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </section>

                {/* Before/After Example */}
                <section className="my-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="rounded-lg overflow-hidden">
                      <Image
                        src="/images/Original Image.jpg"
                        alt="Before editing"
                        width={500}
                        height={300}
                        className="w-full object-cover"
                      />
                      <p className="text-center text-sm text-muted-foreground mt-2">
                        {locale === "zh" ? "编辑前：原始图片" : "Before: Original Image"}
                      </p>
                    </div>
                    <div className="rounded-lg overflow-hidden">
                      <Image
                        src="/images/AI Transformed.jpg"
                        alt="After editing"
                        width={500}
                        height={300}
                        className="w-full object-cover"
                      />
                      <p className="text-center text-sm text-muted-foreground mt-2">
                        {locale === "zh" ? "编辑后：AI变换" : "After: AI Transformed"}
                      </p>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">{t("advancedTips")}</h2>
                  <p className="text-muted-foreground mb-6">{t("advancedTipsText")}</p>

                  <div className="space-y-4">
                    <div className="border-l-4 border-primary pl-4">
                      <h3 className="font-medium mb-2">{t("tip1Title")}</h3>
                      <p className="text-muted-foreground">{t("tip1Text")}</p>
                    </div>
                    <div className="border-l-4 border-primary pl-4">
                      <h3 className="font-medium mb-2">{t("tip2Title")}</h3>
                      <p className="text-muted-foreground">{t("tip2Text")}</p>
                    </div>
                    <div className="border-l-4 border-primary pl-4">
                      <h3 className="font-medium mb-2">{t("tip3Title")}</h3>
                      <p className="text-muted-foreground">{t("tip3Text")}</p>
                    </div>
                    <div className="border-l-4 border-primary pl-4">
                      <h3 className="font-medium mb-2">{t("tip4Title")}</h3>
                      <p className="text-muted-foreground">{t("tip4Text")}</p>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">{t("commonKeywords")}</h2>
                  <p className="text-muted-foreground mb-6">{t("keywordsText")}</p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <h3 className="font-medium mb-3">{t("lightingKeywords")}</h3>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        {(t("lightingList") as string[]).map((item: string, index: number) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <h3 className="font-medium mb-3">{t("weatherKeywords")}</h3>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        {(t("weatherList") as string[]).map((item: string, index: number) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <h3 className="font-medium mb-3">{t("styleKeywords")}</h3>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        {(t("styleList") as string[]).map((item: string, index: number) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">{t("troubleshooting")}</h2>
                  <p className="text-muted-foreground mb-6">{t("troubleshootingText")}</p>

                  <div className="space-y-4">
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                      <h3 className="font-medium mb-2">{t("issue1Title")}</h3>
                      <p className="text-muted-foreground">{t("issue1Solution")}</p>
                    </div>
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                      <h3 className="font-medium mb-2">{t("issue2Title")}</h3>
                      <p className="text-muted-foreground">{t("issue2Solution")}</p>
                    </div>
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                      <h3 className="font-medium mb-2">{t("issue3Title")}</h3>
                      <p className="text-muted-foreground">{t("issue3Solution")}</p>
                    </div>
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                      <h3 className="font-medium mb-2">{t("issue4Title")}</h3>
                      <p className="text-muted-foreground">{t("issue4Solution")}</p>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">{t("bestPractices")}</h2>
                  <p className="text-muted-foreground mb-6">{t("bestPracticesText")}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start space-x-3">
                      <CheckIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{t("practice1")}</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{t("practice2")}</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{t("practice3")}</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{t("practice4")}</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{t("practice5")}</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{t("practice6")}</span>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">{t("conclusion")}</h2>
                  <p className="text-muted-foreground mb-4">{t("conclusionText")}</p>
                  <p className="text-muted-foreground">{t("conclusionText2")}</p>
                </section>

                <div className="text-center my-10">
                  <Link href={`/${locale}#demo`}>
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                    >
                      {t("tryNow")}
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

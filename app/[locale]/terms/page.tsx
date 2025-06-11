import { Button } from "@/components/ui/button"
import { ArrowLeftIcon } from "lucide-react"
import Link from "next/link"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { ThemeProvider } from "@/components/theme-provider"
import { Metadata } from "next"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  
  const titles = {
    en: "Terms of Service - Aiartools | AI-Powered Image Transformation",
    zh: "服务条款 - Aiartools | AI驱动的图像变换工具"
  }
  
  const descriptions = {
    en: "Read our terms of service for using Aiartools. Understand your rights, responsibilities, and our service conditions.",
    zh: "阅读我们使用Aiartools的服务条款。了解您的权利、责任和我们的服务条件。"
  }

  const title = titles[locale as keyof typeof titles] || titles.en
  const description = descriptions[locale as keyof typeof descriptions] || descriptions.en

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://aiartools.com/${locale}/terms`,
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
      canonical: `https://aiartools.com/${locale}/terms`,
      languages: {
        'en': 'https://aiartools.com/en/terms',
        'zh': 'https://aiartools.com/zh/terms',
      },
    },
  }
}

interface TermsPageProps {
  params: Promise<{ locale: string }>
}

export default async function TermsPage({ params }: TermsPageProps) {
  const { locale } = await params
  
  const t = (key: string): string | string[] => {
    const translations: Record<string, Record<string, string | string[]>> = {
      en: {
        backToHome: "Back to Home",
        title: "Terms of Service",
        lastUpdated: "Last updated: May 2025",
        acceptanceTitle: "Acceptance of Terms",
        acceptanceText:
          'By accessing and using Aiartools ("Service"), you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to abide by the above, please do not use this service.',
        serviceDescTitle: "Description of Service",
        serviceDescText: "Aiartools is an AI-powered image transformation service that allows users to:",
        serviceFeatures: [
          "Upload images for AI-powered editing and transformation",
          "Apply various styles, filters, and modifications using text prompts",
          "Download processed images in high resolution",
          "Access advanced features through paid subscriptions",
        ],
        userAccountsTitle: "User Accounts",
        accountCreationTitle: "Account Creation",
        accountCreationList: [
          "You must provide accurate and complete information when creating an account",
          "You are responsible for maintaining the confidentiality of your account credentials",
          "You must be at least 13 years old to create an account",
          "One person or legal entity may maintain no more than one account",
        ],
        accountRespTitle: "Account Responsibility",
        accountRespList: [
          "You are responsible for all activities that occur under your account",
          "You must notify us immediately of any unauthorized use of your account",
          "We reserve the right to suspend or terminate accounts that violate these terms",
        ],
        acceptableUseTitle: "Acceptable Use",
        permittedUsesTitle: "Permitted Uses",
        permittedUsesList: [
          "Personal and commercial image editing and transformation",
          "Creating content for marketing, social media, and creative projects",
          "Educational and research purposes",
        ],
        prohibitedUsesTitle: "Prohibited Uses",
        prohibitedUsesIntro: "You may NOT use our service to:",
        prohibitedUsesList: [
          "Upload or process images containing illegal, harmful, or offensive content",
          "Create deepfakes or misleading content without proper disclosure",
          "Process images of people without their consent",
          "Generate content that violates intellectual property rights",
          "Create content for harassment, discrimination, or hate speech",
          "Attempt to reverse engineer or copy our AI models",
          "Use automated tools to abuse our service or exceed rate limits",
        ],
        subscriptionTitle: "Subscription Plans and Payments",
        freePlanTitle: "Free Plan",
        freePlanList: [
          "Limited to 5 image generations per month",
          "Basic features and keywords only",
          "Watermarked exports",
          "Standard processing priority",
        ],
        paidPlansTitle: "Paid Plans",
        paidPlansList: [
          "Subscriptions are billed monthly or annually",
          "Payments are processed securely through third-party providers",
          "All fees are non-refundable",
        ],
        cancellationTitle: "Cancellation and Refunds",
        cancellationList: [
          "You may cancel your subscription at any time",
          "Cancellation takes effect at the end of the current billing period",
          "No refunds for partial months or unused features",
        ],
        intellectualPropertyTitle: "Intellectual Property",
        yourContentTitle: "Your Content",
        yourContentList: [
          "You retain ownership of images you upload to our service",
          "You grant us a limited license to process your images for service provision",
          "You own the rights to images generated using our service",
          "You are responsible for ensuring you have rights to upload and process images",
        ],
        ourServiceTitle: "Our Service",
        ourServiceList: [
          "We own all rights to our AI models, algorithms, and service technology",
          "Our service is protected by copyright, trademark, and other intellectual property laws",
          "You may not copy, modify, or reverse engineer our service",
        ],
        serviceAvailabilityTitle: "Service Availability and Limitations",
        serviceAvailabilityList: [
          "We strive for 99.9% uptime but do not guarantee uninterrupted service",
          "We may temporarily suspend service for maintenance or updates",
          "Processing times may vary based on server load and image complexity",
          "We reserve the right to implement usage limits to ensure fair access",
          "Some features may be in beta and subject to changes or removal",
        ],
        privacyDataTitle: "Privacy and Data Protection",
        privacyDataText:
          "Your privacy is important to us. Our data handling practices are detailed in our Privacy Policy, which forms part of these terms. Key points include:",
        privacyDataList: [
          "Images are automatically deleted within 24 hours of processing",
          "We do not share your images with third parties",
          "Personal information is protected according to applicable privacy laws",
          "You can request deletion of your data at any time",
        ],
        disclaimersTitle: "Disclaimers and Limitation of Liability",
        disclaimersNotice: "IMPORTANT LEGAL NOTICE:",
        disclaimersList: [
          'Our service is provided "as is" without warranties of any kind',
          "We do not guarantee the accuracy, quality, or suitability of generated images",
          "We are not liable for any damages arising from use of our service",
          "Our total liability is limited to the amount you paid for the service",
          "You use our service at your own risk",
        ],
        terminationTitle: "Termination",
        terminationText1:
          "We may terminate or suspend your account and access to the service at our sole discretion, without prior notice, for conduct that we believe violates these Terms of Service or is harmful to other users, us, or third parties, or for any other reason.",
        terminationText2:
          "Upon termination, your right to use the service will cease immediately. All provisions of these Terms which by their nature should survive termination shall survive termination.",
        changesTitle: "Changes to Terms",
        changesText:
          "We reserve the right to modify these terms at any time. We will notify users of significant changes via email or through our service. Continued use of the service after changes constitutes acceptance of the new terms.",
        governingLawTitle: "Governing Law and Disputes",
        governingLawText1:
          "These Terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction], without regard to its conflict of law provisions.",
        governingLawText2:
          "Any disputes arising from these terms or use of our service shall be resolved through binding arbitration in accordance with the rules of [Arbitration Organization].",
        contactTitle: "Contact Information",
        contactText: "If you have any questions about these Terms of Service, please contact us:",
        contactInfo:
          "Email: wt@wmcircle.cn\nBusiness Hours: Monday - Friday, 9 AM - 5 PM\nResponse Time: We aim to respond within 24 hours",
      },
      zh: {
        backToHome: "返回首页",
        title: "服务条款",
        lastUpdated: "最后更新：2025年5月",
        acceptanceTitle: "条款接受",
        acceptanceText:
          '通过访问和使用Aiartools（"服务"），您接受并同意受本协议条款和条件的约束。如果您不同意遵守上述条款，请不要使用此服务。',
        serviceDescTitle: "服务描述",
        serviceDescText: "Aiartools是一个AI驱动的图像变换服务，允许用户：",
        serviceFeatures: [
          "上传图像进行AI驱动的编辑和变换",
          "使用文本提示应用各种风格、滤镜和修改",
          "下载高分辨率的处理图像",
          "通过付费订阅访问高级功能",
        ],
        userAccountsTitle: "用户账户",
        accountCreationTitle: "账户创建",
        accountCreationList: [
          "创建账户时必须提供准确和完整的信息",
          "您有责任维护账户凭据的机密性",
          "您必须年满13岁才能创建账户",
          "一个人或法律实体最多只能维护一个账户",
        ],
        accountRespTitle: "账户责任",
        accountRespList: [
          "您对在您账户下发生的所有活动负责",
          "您必须立即通知我们任何未经授权使用您账户的情况",
          "我们保留暂停或终止违反这些条款的账户的权利",
        ],
        acceptableUseTitle: "可接受使用",
        permittedUsesTitle: "允许的使用",
        permittedUsesList: ["个人和商业图像编辑和变换", "为营销、社交媒体和创意项目创建内容", "教育和研究目的"],
        prohibitedUsesTitle: "禁止的使用",
        prohibitedUsesIntro: "您不得使用我们的服务来：",
        prohibitedUsesList: [
          "上传或处理包含非法、有害或冒犯性内容的图像",
          "创建深度伪造或误导性内容而不进行适当披露",
          "未经同意处理他人的图像",
          "生成违反知识产权的内容",
          "创建用于骚扰、歧视或仇恨言论的内容",
          "试图逆向工程或复制我们的AI模型",
          "使用自动化工具滥用我们的服务或超出速率限制",
        ],
        subscriptionTitle: "订阅计划和付款",
        freePlanTitle: "免费计划",
        freePlanList: ["每月限制5次图像生成", "仅限基本功能和关键词", "带水印的导出", "标准处理优先级"],
        paidPlansTitle: "付费计划",
        paidPlansList: ["订阅按月或年计费", "付款通过第三方提供商安全处理", "所有费用不可退还"],
        cancellationTitle: "取消和退款",
        cancellationList: [
          "您可以随时取消订阅",
          "取消在当前计费周期结束时生效",
          "初次购买后30天内可获得退款",
          "不退还部分月份或未使用功能的费用",
        ],
        intellectualPropertyTitle: "知识产权",
        yourContentTitle: "您的内容",
        yourContentList: [
          "您保留上传到我们服务的图像的所有权",
          "您授予我们有限许可来处理您的图像以提供服务",
          "您拥有使用我们服务生成的图像的权利",
          "您有责任确保您有权上传和处理图像",
        ],
        ourServiceTitle: "我们的服务",
        ourServiceList: [
          "我们拥有AI模型、算法和服务技术的所有权利",
          "我们的服务受版权、商标和其他知识产权法保护",
          "您不得复制、修改或逆向工程我们的服务",
        ],
        serviceAvailabilityTitle: "服务可用性和限制",
        serviceAvailabilityList: [
          "我们努力实现99.9%的正常运行时间，但不保证不间断服务",
          "我们可能会因维护或更新而暂时暂停服务",
          "处理时间可能因服务器负载和图像复杂性而异",
          "我们保留实施使用限制以确保公平访问的权利",
          "某些功能可能处于测试阶段，可能会发生变化或删除",
        ],
        privacyDataTitle: "隐私和数据保护",
        privacyDataText:
          "您的隐私对我们很重要。我们的数据处理实践在我们的隐私政策中详细说明，该政策构成这些条款的一部分。要点包括：",
        privacyDataList: [
          "图像在处理后24小时内自动删除",
          "我们不与第三方共享您的图像",
          "个人信息根据适用的隐私法律受到保护",
          "您可以随时请求删除您的数据",
        ],
        disclaimersTitle: "免责声明和责任限制",
        disclaimersNotice: "重要法律声明：",
        disclaimersList: [
          '我们的服务按"现状"提供，不提供任何形式的保证',
          "我们不保证生成图像的准确性、质量或适用性",
          "我们不对使用我们服务产生的任何损害承担责任",
          "我们的总责任限于您为服务支付的金额",
          "您使用我们的服务风险自负",
        ],
        terminationTitle: "终止",
        terminationText1:
          "我们可能会自行决定终止或暂停您的账户和对服务的访问，无需事先通知，如果我们认为您的行为违反了这些服务条款或对其他用户、我们或第三方有害，或出于任何其他原因。",
        terminationText2:
          "终止后，您使用服务的权利将立即停止。这些条款中本质上应在终止后继续有效的所有条款将在终止后继续有效。",
        changesTitle: "条款变更",
        changesText:
          "我们保留随时修改这些条款的权利。我们将通过电子邮件或通过我们的服务通知用户重大变更。变更后继续使用服务即表示接受新条款。",
        governingLawTitle: "适用法律和争议",
        governingLawText1: "这些条款应受[您的管辖区]法律管辖和解释，不考虑其法律冲突条款。",
        governingLawText2: "因这些条款或使用我们服务而产生的任何争议应根据[仲裁组织]的规则通过有约束力的仲裁解决。",
        contactTitle: "联系信息",
        contactText: "如果您对这些服务条款有任何疑问，请联系我们：",
        contactInfo:
          "电子邮件：wt@wmcircle.cn\n营业时间：周一至周五，上午9点至下午5点\n响应时间：我们力争在24小时内回复",
      },
    }
    return translations[locale]?.[key] || translations.en[key]
  }

  // 类型保护函数
  const getArrayFromTranslation = (key: string): string[] => {
    const result = t(key);
    return Array.isArray(result) ? result : [];
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <div className="min-h-screen bg-background">
        <Navigation locale={locale} />
        <div className="pt-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="max-w-4xl mx-auto">
              {/* Header */}
              <div className="mb-8">
                <Link href={`/${locale}`}>
                  <Button variant="ghost" className="mb-4">
                    <ArrowLeftIcon className="w-4 h-4 mr-2" />
                    {t("backToHome")}
                  </Button>
                </Link>
                <h1 className="text-4xl font-bold mb-4">{t("title")}</h1>
                <p className="text-muted-foreground">{t("lastUpdated")}</p>
              </div>

              {/* Content */}
              <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
                <section>
                  <h2 className="text-2xl font-semibold mb-4">1. {t("acceptanceTitle")}</h2>
                  <p className="text-muted-foreground leading-relaxed">{t("acceptanceText")}</p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">2. {t("serviceDescTitle")}</h2>
                  <p className="text-muted-foreground mb-4">{t("serviceDescText")}</p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    {getArrayFromTranslation("serviceFeatures").map((item: string, index: number) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">3. {t("userAccountsTitle")}</h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium mb-2">3.1 {t("accountCreationTitle")}</h3>
                      <ul className="list-disc list-inside text-muted-foreground space-y-1">
                        {getArrayFromTranslation("accountCreationList").map((item: string, index: number) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-2">3.2 {t("accountRespTitle")}</h3>
                      <ul className="list-disc list-inside text-muted-foreground space-y-1">
                        {getArrayFromTranslation("accountRespList").map((item: string, index: number) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">4. {t("acceptableUseTitle")}</h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium mb-2">4.1 {t("permittedUsesTitle")}</h3>
                      <ul className="list-disc list-inside text-muted-foreground space-y-1">
                        {getArrayFromTranslation("permittedUsesList").map((item: string, index: number) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-2">4.2 {t("prohibitedUsesTitle")}</h3>
                      <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                        <p className="text-red-800 dark:text-red-200 font-medium mb-2">{t("prohibitedUsesIntro")}</p>
                        <ul className="list-disc list-inside text-red-700 dark:text-red-300 space-y-1">
                          {getArrayFromTranslation("prohibitedUsesList").map((item: string, index: number) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">5. {t("subscriptionTitle")}</h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium mb-2">5.1 {t("freePlanTitle")}</h3>
                      <ul className="list-disc list-inside text-muted-foreground space-y-1">
                        {getArrayFromTranslation("freePlanList").map((item: string, index: number) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-2">5.2 {t("paidPlansTitle")}</h3>
                      <ul className="list-disc list-inside text-muted-foreground space-y-1">
                        {getArrayFromTranslation("paidPlansList").map((item: string, index: number) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-2">5.3 {t("cancellationTitle")}</h3>
                      <ul className="list-disc list-inside text-muted-foreground space-y-1">
                        {getArrayFromTranslation("cancellationList").map((item: string, index: number) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">6. {t("intellectualPropertyTitle")}</h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium mb-2">6.1 {t("yourContentTitle")}</h3>
                      <ul className="list-disc list-inside text-muted-foreground space-y-1">
                        {getArrayFromTranslation("yourContentList").map((item: string, index: number) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-2">6.2 {t("ourServiceTitle")}</h3>
                      <ul className="list-disc list-inside text-muted-foreground space-y-1">
                        {getArrayFromTranslation("ourServiceList").map((item: string, index: number) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">7. {t("serviceAvailabilityTitle")}</h2>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    {getArrayFromTranslation("serviceAvailabilityList").map((item: string, index: number) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">8. {t("privacyDataTitle")}</h2>
                  <p className="text-muted-foreground mb-4">{t("privacyDataText")}</p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    {getArrayFromTranslation("privacyDataList").map((item: string, index: number) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">9. {t("disclaimersTitle")}</h2>
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                    <p className="text-yellow-800 dark:text-yellow-200 mb-4">
                      <strong>{t("disclaimersNotice")}</strong>
                    </p>
                    <ul className="list-disc list-inside text-yellow-700 dark:text-yellow-300 space-y-2">
                      {getArrayFromTranslation("disclaimersList").map((item: string, index: number) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">10. {t("terminationTitle")}</h2>
                  <p className="text-muted-foreground mb-4">{t("terminationText1")}</p>
                  <p className="text-muted-foreground">{t("terminationText2")}</p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">11. {t("changesTitle")}</h2>
                  <p className="text-muted-foreground">{t("changesText")}</p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">12. {t("governingLawTitle")}</h2>
                  <p className="text-muted-foreground mb-4">{t("governingLawText1")}</p>
                  <p className="text-muted-foreground">{t("governingLawText2")}</p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">13. {t("contactTitle")}</h2>
                  <p className="text-muted-foreground mb-4">{t("contactText")}</p>
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <p className="text-muted-foreground whitespace-pre-line">{t("contactInfo")}</p>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
        <Footer locale={locale} />
      </div>
    </ThemeProvider>
  )
}

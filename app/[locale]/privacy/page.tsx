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
    en: "Privacy Policy - Aiartools | AI-Powered Image Transformation",
    zh: "隐私政策 - Aiartools | AI驱动的图像变换工具"
  }
  
  const descriptions = {
    en: "Learn how Aiartools protects your privacy and handles your personal information. Our commitment to data security and transparency.",
    zh: "了解Aiartools如何保护您的隐私并处理您的个人信息。我们对数据安全和透明度的承诺。"
  }

  const title = titles[locale as keyof typeof titles] || titles.en
  const description = descriptions[locale as keyof typeof descriptions] || descriptions.en

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://aiartools.com/${locale}/privacy`,
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
      canonical: `https://aiartools.com/${locale}/privacy`,
      languages: {
        'en': 'https://aiartools.com/en/privacy',
        'zh': 'https://aiartools.com/zh/privacy',
      },
    },
  }
}

interface PrivacyPageProps {
  params: Promise<{ locale: string }>
}

export default async function PrivacyPage({ params }: PrivacyPageProps) {
  const { locale } = await params
  
  const t = (key: string): string | string[] => {
    const translations: Record<string, Record<string, string | string[]>> = {
      en: {
        backToHome: "Back to Home",
        title: "Privacy Policy",
        lastUpdated: "Last updated: May 2025",
        introduction:
          "Welcome to Aiartools (we, our, or us). We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI-powered image transformation service.",
        informationWeCollect: "Information We Collect",
        personalInformation: "Personal Information",
        personalInfoList: [
          "Email address (for account creation and communication)",
          "Name (optional, for personalization)",
          "Payment information (processed securely through third-party providers)",
          "Usage preferences and settings",
        ],
        imageData: "Image Data",
        imageDataList: [
          "Images you upload for AI transformation",
          "Generated/transformed images",
          "Text prompts and editing instructions",
          "Processing metadata and usage statistics",
        ],
        technicalInformation: "Technical Information",
        technicalInfoList: [
          "IP address and device information",
          "Browser type and version",
          "Usage patterns and feature interactions",
          "Error logs and performance data",
        ],
        howWeUseInfo: "How We Use Your Information",
        useInfoList: [
          "Process and transform your images using AI technology",
          "Provide, maintain, and improve our services",
          "Communicate with you about your account and our services",
          "Process payments and manage subscriptions",
          "Analyze usage patterns to enhance user experience",
          "Ensure security and prevent fraud",
          "Comply with legal obligations",
        ],
        imageDataHandling: "Image Data Handling",
        imagePrivacyTitle: "Important: Image Privacy",
        imagePrivacyList: [
          "Temporary Storage: Uploaded images are stored temporarily for processing and are automatically deleted within 24 hours",
          "No Sharing: We never share your images with third parties",
          "Secure Processing: All image processing occurs on secure servers with encryption",
          "No Training Data: Your images are not used to train our AI models without explicit consent",
          "User Control: You can request immediate deletion of your images at any time",
        ],
        informationSharing: "Information Sharing and Disclosure",
        sharingIntro:
          "We do not sell, trade, or rent your personal information. We may share information only in the following circumstances:",
        sharingList: [
          "Service Providers: With trusted third-party providers who assist in operating our service",
          "Legal Requirements: When required by law or to protect our rights and safety",
          "Business Transfers: In connection with a merger, acquisition, or sale of assets",
          "Consent: With your explicit consent for specific purposes",
        ],
        dataSecurity: "Data Security",
        securityIntro: "We implement industry-standard security measures to protect your information:",
        securityList: [
          "Encryption in transit and at rest",
          "Regular security audits and updates",
          "Access controls and authentication",
          "Secure data centers and infrastructure",
          "Employee training on data protection",
        ],
        yourRights: "Your Rights",
        rightsIntro: "You have the following rights regarding your personal information:",
        rightsList: [
          "Access: Request access to your personal information",
          "Correction: Request correction of inaccurate information",
          "Deletion: Request deletion of your personal information",
          "Portability: Request a copy of your data in a portable format",
          "Objection: Object to certain processing of your information",
          "Withdrawal: Withdraw consent where processing is based on consent",
        ],
        internationalTransfers: "International Data Transfers",
        transfersText:
          "Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your information in accordance with applicable data protection laws.",
        childrensPrivacy: "Children's Privacy",
        childrensText:
          "Our service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.",
        changesToPolicy: "Changes to This Policy",
        changesText:
          "We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the Last updated date. We encourage you to review this Privacy Policy periodically.",
        contactUs: "Contact Us",
        contactIntro: "If you have any questions about this Privacy Policy or our data practices, please contact us:",
        contactInfo: "Email: wt@wmcircle.cn\nResponse Time: We aim to respond within 24 hours",
      },
      zh: {
        backToHome: "返回首页",
        title: "隐私政策",
        lastUpdated: "最后更新：2025年5月",
        introduction:
          "欢迎使用Aiartools（我们、我们的或我们）。我们致力于保护您的隐私并确保您个人信息的安全。本隐私政策说明了当您使用我们的AI驱动图像变换服务时，我们如何收集、使用、披露和保护您的信息。",
        informationWeCollect: "我们收集的信息",
        personalInformation: "个人信息",
        personalInfoList: [
          "电子邮件地址（用于账户创建和通信）",
          "姓名（可选，用于个性化）",
          "支付信息（通过第三方提供商安全处理）",
          "使用偏好和设置",
        ],
        imageData: "图像数据",
        imageDataList: ["您上传用于AI变换的图像", "生成/变换后的图像", "文本提示和编辑指令", "处理元数据和使用统计"],
        technicalInformation: "技术信息",
        technicalInfoList: ["IP地址和设备信息", "浏览器类型和版本", "使用模式和功能交互", "错误日志和性能数据"],
        howWeUseInfo: "我们如何使用您的信息",
        useInfoList: [
          "使用AI技术处理和变换您的图像",
          "提供、维护和改进我们的服务",
          "就您的账户和我们的服务与您沟通",
          "处理付款和管理订阅",
          "分析使用模式以增强用户体验",
          "确保安全并防止欺诈",
          "遵守法律义务",
        ],
        imageDataHandling: "图像数据处理",
        imagePrivacyTitle: "重要：图像隐私",
        imagePrivacyList: [
          "临时存储：上传的图像临时存储用于处理，并在24小时内自动删除",
          "不共享：我们绝不与第三方共享您的图像",
          "安全处理：所有图像处理都在带有加密的安全服务器上进行",
          "非训练数据：未经明确同意，您的图像不会用于训练我们的AI模型",
          "用户控制：您可以随时请求立即删除您的图像",
        ],
        informationSharing: "信息共享和披露",
        sharingIntro: "我们不出售、交易或出租您的个人信息。我们仅在以下情况下可能共享信息：",
        sharingList: [
          "服务提供商：与协助运营我们服务的可信第三方提供商",
          "法律要求：当法律要求或为保护我们的权利和安全时",
          "业务转让：与合并、收购或资产出售相关",
          "同意：在您明确同意特定目的时",
        ],
        dataSecurity: "数据安全",
        securityIntro: "我们实施行业标准的安全措施来保护您的信息：",
        securityList: [
          "传输和静态加密",
          "定期安全审计和更新",
          "访问控制和身份验证",
          "安全的数据中心和基础设施",
          "员工数据保护培训",
        ],
        yourRights: "您的权利",
        rightsIntro: "您对个人信息拥有以下权利：",
        rightsList: [
          "访问：请求访问您的个人信息",
          "更正：请求更正不准确的信息",
          "删除：请求删除您的个人信息",
          "可移植性：请求以可移植格式获取您的数据副本",
          "反对：反对对您信息的某些处理",
          "撤回：在基于同意的处理中撤回同意",
        ],
        internationalTransfers: "国际数据传输",
        transfersText:
          "您的信息可能会被传输到您所在国家以外的国家并在那里处理。我们确保根据适用的数据保护法律采取适当的保护措施来保护您的信息。",
        childrensPrivacy: "儿童隐私",
        childrensText:
          "我们的服务不适用于13岁以下的儿童。我们不会故意收集13岁以下儿童的个人信息。如果您是父母或监护人，并且认为您的孩子向我们提供了个人信息，请联系我们。",
        changesToPolicy: "政策变更",
        changesText:
          "我们可能会不时更新本隐私政策。我们将通过在此页面发布新的隐私政策并更新最后更新日期来通知您任何变更。我们鼓励您定期查看本隐私政策。",
        contactUs: "联系我们",
        contactIntro: "如果您对本隐私政策或我们的数据实践有任何疑问，请联系我们：",
        contactInfo: "电子邮件：wt@wmcircle.cn\n响应时间：我们力争在24小时内回复",
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
                  <h2 className="text-2xl font-semibold mb-4">1. {locale === "zh" ? "介绍" : "Introduction"}</h2>
                  <p className="text-muted-foreground leading-relaxed">{t("introduction")}</p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">2. {t("informationWeCollect")}</h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium mb-2">2.1 {t("personalInformation")}</h3>
                      <ul className="list-disc list-inside text-muted-foreground space-y-1">
                        {getArrayFromTranslation("personalInfoList").map((item: string, index: number) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-2">2.2 {t("imageData")}</h3>
                      <ul className="list-disc list-inside text-muted-foreground space-y-1">
                        {getArrayFromTranslation("imageDataList").map((item: string, index: number) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-2">2.3 {t("technicalInformation")}</h3>
                      <ul className="list-disc list-inside text-muted-foreground space-y-1">
                        {getArrayFromTranslation("technicalInfoList").map((item: string, index: number) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">3. {t("howWeUseInfo")}</h2>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    {getArrayFromTranslation("useInfoList").map((item: string, index: number) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">4. {t("imageDataHandling")}</h2>
                  <div className="bg-muted/30 p-6 rounded-lg">
                    <h3 className="text-lg font-medium mb-3">{t("imagePrivacyTitle")}</h3>
                    <ul className="list-disc list-inside text-muted-foreground space-y-2">
                      {getArrayFromTranslation("imagePrivacyList").map((item: string, index: number) => (
                        <li key={index}>
                          <strong>{item.split(":")[0]}:</strong> {item.split(":").slice(1).join(":")}
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">5. {t("informationSharing")}</h2>
                  <p className="text-muted-foreground mb-4">{t("sharingIntro")}</p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    {getArrayFromTranslation("sharingList").map((item: string, index: number) => (
                      <li key={index}>
                        <strong>{item.split(":")[0]}:</strong> {item.split(":").slice(1).join(":")}
                      </li>
                    ))}
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">6. {t("dataSecurity")}</h2>
                  <p className="text-muted-foreground mb-4">{t("securityIntro")}</p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    {getArrayFromTranslation("securityList").map((item: string, index: number) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">7. {t("yourRights")}</h2>
                  <p className="text-muted-foreground mb-4">{t("rightsIntro")}</p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    {getArrayFromTranslation("rightsList").map((item: string, index: number) => (
                      <li key={index}>
                        <strong>{item.split(":")[0]}:</strong> {item.split(":").slice(1).join(":")}
                      </li>
                    ))}
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">8. {t("internationalTransfers")}</h2>
                  <p className="text-muted-foreground">{t("transfersText")}</p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">9. {t("childrensPrivacy")}</h2>
                  <p className="text-muted-foreground">{t("childrensText")}</p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">10. {t("changesToPolicy")}</h2>
                  <p className="text-muted-foreground">{t("changesText")}</p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">11. {t("contactUs")}</h2>
                  <p className="text-muted-foreground mb-4">{t("contactIntro")}</p>
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

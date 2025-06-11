import { Button } from "@/components/ui/button"
import { ArrowLeftIcon } from "lucide-react"
import Link from "next/link"
import Navigation from "@/components/navigation"
import { ThemeProvider } from "@/components/theme-provider"
import Footer from "@/components/footer"
import { Metadata } from "next"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  
  const titles = {
    en: "Cookie Policy - Aiartools | AI-Powered Image Transformation",
    zh: "Cookie政策 - Aiartools | AI驱动的图像变换工具"
  }
  
  const descriptions = {
    en: "Learn about how Aiartools uses cookies to enhance your experience. Understand our cookie types, security measures, and how to manage your preferences.",
    zh: "了解Aiartools如何使用Cookie来增强您的体验。了解我们的Cookie类型、安全措施以及如何管理您的偏好。"
  }

  const title = titles[locale as keyof typeof titles] || titles.en
  const description = descriptions[locale as keyof typeof descriptions] || descriptions.en

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://aiartools.com/${locale}/cookies`,
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
      canonical: `https://aiartools.com/${locale}/cookies`,
      languages: {
        'en': 'https://aiartools.com/en/cookies',
        'zh': 'https://aiartools.com/zh/cookies',
      },
    },
  }
}

interface CookiesPageProps {
  params: Promise<{ locale: string }>
}

export default async function CookiesPage({ params }: CookiesPageProps) {
  const { locale } = await params
  
  const t = (key: string) => {
    const translations: Record<string, Record<string, string | string[]>> = {
      en: {
        backToHome: "Back to Home",
        title: "Cookie Policy",
        lastUpdated: "Last updated: May 2025",
        whatAreCookiesTitle: "What Are Cookies",
        whatAreCookiesText:
          "Cookies are small text files that are stored on your computer or mobile device when you visit our website. They are widely used to make websites work more efficiently and provide information to website owners about how users interact with their sites.",
        howWeUseCookiesTitle: "How We Use Cookies",
        howWeUseCookiesText:
          "Aiartools uses cookies to enhance your experience on our website and service. We use cookies for the following purposes:",
        cookieUsesList: [
          "Essential Functionality: To enable core website features and user authentication",
          "User Preferences: To remember your settings, language preferences, and theme choices",
          "Performance: To analyze how our website is used and improve its performance",
          "Security: To protect against fraud and enhance security",
          "Analytics: To understand user behavior and improve our service",
        ],
        typesOfCookiesTitle: "Types of Cookies We Use",
        essentialCookiesTitle: "Essential Cookies",
        essentialCookiesDesc: "These cookies are necessary for the website to function properly.",
        essentialCookiesList: [
          "Session Management: Keeps you logged in during your session",
          "Security: Protects against cross-site request forgery attacks",
          "Load Balancing: Ensures optimal server performance",
          "Form Data: Remembers form inputs during your session",
        ],
        essentialDuration: "Duration: Session cookies (deleted when you close your browser) or up to 1 year",
        preferenceCookiesTitle: "Preference Cookies",
        preferenceCookiesDesc: "These cookies remember your choices and preferences.",
        preferenceCookiesList: [
          "Language Settings: Remembers your preferred language (English/Chinese)",
          "Theme Preference: Saves your dark/light mode choice",
          "UI Settings: Remembers interface customizations",
          "Cookie Consent: Records your cookie preferences",
        ],
        preferenceDuration: "Duration: Up to 1 year",
        analyticsCookiesTitle: "Analytics Cookies",
        analyticsCookiesDesc: "These cookies help us understand how you use our website.",
        analyticsCookiesList: [
          "Usage Statistics: Tracks page views, session duration, and user flows",
          "Feature Usage: Monitors which features are most popular",
          "Performance Metrics: Measures page load times and errors",
          "A/B Testing: Enables testing of different interface versions",
        ],
        analyticsDuration: "Duration: Up to 2 years",
        marketingCookiesTitle: "Marketing Cookies",
        marketingCookiesDesc: "These cookies are used to deliver relevant advertisements.",
        marketingCookiesList: [
          "Ad Targeting: Shows relevant ads based on your interests",
          "Conversion Tracking: Measures the effectiveness of our marketing campaigns",
          "Retargeting: Shows ads to users who have visited our website",
          "Social Media: Enables sharing and social media integration",
        ],
        marketingDuration: "Duration: Up to 1 year",
        thirdPartyCookiesTitle: "Third-Party Cookies",
        thirdPartyCookiesText: "We may use third-party services that set their own cookies. These include:",
        analyticsServicesTitle: "Analytics Services",
        analyticsServicesList: [
          "Google Analytics: Website traffic and user behavior analysis",
          "Mixpanel: Product analytics and user engagement tracking",
        ],
        paymentProcessorsTitle: "Payment Processors",
        paymentProcessorsList: [
          "Stripe: Secure payment processing and fraud prevention",
          "PayPal: Alternative payment method processing",
        ],
        supportServicesTitle: "Support Services",
        supportServicesList: [
          "Intercom: Customer support chat functionality",
          "Zendesk: Help desk and support ticket management",
        ],
        managingPreferencesTitle: "Managing Your Cookie Preferences",
        browserSettingsTitle: "Browser Settings",
        browserSettingsText: "You can control cookies through your browser settings. Most browsers allow you to:",
        browserSettingsList: [
          "View and delete existing cookies",
          "Block all cookies or cookies from specific websites",
          "Set preferences for accepting cookies",
          "Receive notifications when cookies are set",
        ],
        ourCookiePreferencesTitle: "Our Cookie Preferences",
        ourCookiePreferencesText: "We provide a cookie consent banner that allows you to:",
        ourCookiePreferencesList: [
          "Accept or reject non-essential cookies",
          "Customize your cookie preferences by category",
          "Change your preferences at any time",
          "Learn more about each type of cookie we use",
        ],
        optOutLinksTitle: "Opt-Out Links",
        optOutLinksText: "You can opt out of specific third-party cookies:",
        impactOfDisablingTitle: "Impact of Disabling Cookies",
        impactNote: "Please Note: Disabling certain cookies may affect your experience on our website:",
        impactList: [
          "Essential Cookies: Disabling these may prevent core functionality from working",
          "Preference Cookies: You may need to reset your preferences on each visit",
          "Analytics Cookies: We won't be able to improve our service based on usage data",
          "Marketing Cookies: You may see less relevant advertisements",
        ],
        cookieSecurityTitle: "Cookie Security",
        cookieSecurityText: "We take cookie security seriously and implement the following measures:",
        cookieSecurityList: [
          "Secure Transmission: Cookies are transmitted over secure HTTPS connections",
          "HttpOnly Flags: Sensitive cookies are protected from client-side access",
          "SameSite Attributes: Cookies are protected against cross-site request forgery",
          "Regular Audits: We regularly review and update our cookie practices",
          "Minimal Data: Cookies contain only necessary information",
        ],
        updatesToPolicyTitle: "Updates to This Policy",
        updatesToPolicyText:
          'We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the updated policy on our website and updating the "Last updated" date.',
        contactUsTitle: "Contact Us",
        contactUsText: "If you have any questions about our use of cookies or this Cookie Policy, please contact us:",
        contactInfo:
          "Email: wt@wmcircle.cn\nSubject Line: Cookie Policy Inquiry\nResponse Time: We aim to respond within 24 hours",
      },
      zh: {
        backToHome: "返回首页",
        title: "Cookie政策",
        lastUpdated: "最后更新：2025年5月",
        whatAreCookiesTitle: "什么是Cookie",
        whatAreCookiesText:
          "Cookie是当您访问我们的网站时存储在您的计算机或移动设备上的小文本文件。它们被广泛用于使网站更高效地工作，并向网站所有者提供有关用户如何与其网站交互的信息。",
        howWeUseCookiesTitle: "我们如何使用Cookie",
        howWeUseCookiesText: "Aiartools使用Cookie来增强您在我们网站和服务上的体验。我们将Cookie用于以下目的：",
        cookieUsesList: [
          "基本功能：启用核心网站功能和用户身份验证",
          "用户偏好：记住您的设置、语言偏好和主题选择",
          "性能：分析我们网站的使用情况并改善其性能",
          "安全：防止欺诈并增强安全性",
          "分析：了解用户行为并改进我们的服务",
        ],
        typesOfCookiesTitle: "我们使用的Cookie类型",
        essentialCookiesTitle: "必要Cookie",
        essentialCookiesDesc: "这些Cookie是网站正常运行所必需的。",
        essentialCookiesList: [
          "会话管理：在您的会话期间保持您的登录状态",
          "安全：防止跨站请求伪造攻击",
          "负载均衡：确保最佳服务器性能",
          "表单数据：在您的会话期间记住表单输入",
        ],
        essentialDuration: "持续时间：会话Cookie（关闭浏览器时删除）或最多1年",
        preferenceCookiesTitle: "偏好Cookie",
        preferenceCookiesDesc: "这些Cookie记住您的选择和偏好。",
        preferenceCookiesList: [
          "语言设置：记住您的首选语言（英语/中文）",
          "主题偏好：保存您的深色/浅色模式选择",
          "UI设置：记住界面自定义",
          "Cookie同意：记录您的Cookie偏好",
        ],
        preferenceDuration: "持续时间：最多1年",
        analyticsCookiesTitle: "分析Cookie",
        analyticsCookiesDesc: "这些Cookie帮助我们了解您如何使用我们的网站。",
        analyticsCookiesList: [
          "使用统计：跟踪页面浏览量、会话持续时间和用户流程",
          "功能使用：监控哪些功能最受欢迎",
          "性能指标：测量页面加载时间和错误",
          "A/B测试：启用不同界面版本的测试",
        ],
        analyticsDuration: "持续时间：最多2年",
        marketingCookiesTitle: "营销Cookie",
        marketingCookiesDesc: "这些Cookie用于提供相关广告。",
        marketingCookiesList: [
          "广告定位：根据您的兴趣显示相关广告",
          "转化跟踪：衡量我们营销活动的有效性",
          "重新定位：向访问过我们网站的用户显示广告",
          "社交媒体：启用分享和社交媒体集成",
        ],
        marketingDuration: "持续时间：最多1年",
        thirdPartyCookiesTitle: "第三方Cookie",
        thirdPartyCookiesText: "我们可能使用设置自己Cookie的第三方服务。这些包括：",
        analyticsServicesTitle: "分析服务",
        analyticsServicesList: ["Google Analytics：网站流量和用户行为分析", "Mixpanel：产品分析和用户参与度跟踪"],
        paymentProcessorsTitle: "支付处理器",
        paymentProcessorsList: ["Stripe：安全支付处理和欺诈防护", "PayPal：替代支付方式处理"],
        supportServicesTitle: "支持服务",
        supportServicesList: ["Intercom：客户支持聊天功能", "Zendesk：帮助台和支持票据管理"],
        managingPreferencesTitle: "管理您的Cookie偏好",
        browserSettingsTitle: "浏览器设置",
        browserSettingsText: "您可以通过浏览器设置控制Cookie。大多数浏览器允许您：",
        browserSettingsList: [
          "查看和删除现有Cookie",
          "阻止所有Cookie或来自特定网站的Cookie",
          "设置接受Cookie的偏好",
          "在设置Cookie时接收通知",
        ],
        ourCookiePreferencesTitle: "我们的Cookie偏好",
        ourCookiePreferencesText: "我们提供Cookie同意横幅，允许您：",
        ourCookiePreferencesList: [
          "接受或拒绝非必要Cookie",
          "按类别自定义您的Cookie偏好",
          "随时更改您的偏好",
          "了解更多关于我们使用的每种Cookie类型",
        ],
        optOutLinksTitle: "退出链接",
        optOutLinksText: "您可以退出特定的第三方Cookie：",
        impactOfDisablingTitle: "禁用Cookie的影响",
        impactNote: "请注意：禁用某些Cookie可能会影响您在我们网站上的体验：",
        impactList: [
          "必要Cookie：禁用这些可能会阻止核心功能工作",
          "偏好Cookie：您可能需要在每次访问时重置您的偏好",
          "分析Cookie：我们将无法根据使用数据改进我们的服务",
          "营销Cookie：您可能会看到不太相关的广告",
        ],
        cookieSecurityTitle: "Cookie安全",
        cookieSecurityText: "我们认真对待Cookie安全并实施以下措施：",
        cookieSecurityList: [
          "安全传输：Cookie通过安全的HTTPS连接传输",
          "HttpOnly标志：敏感Cookie受到客户端访问保护",
          "SameSite属性：Cookie受到跨站请求伪造保护",
          "定期审计：我们定期审查和更新我们的Cookie实践",
          "最少数据：Cookie仅包含必要信息",
        ],
        updatesToPolicyTitle: "政策更新",
        updatesToPolicyText:
          "我们可能会不时更新此Cookie政策，以反映我们实践中的变化或出于其他运营、法律或监管原因。我们将通过在我们的网站上发布更新的政策并更新\"最后更新\"日期来通知您任何重大变更。",
        contactUsTitle: "联系我们",
        contactUsText: "如果您对我们使用Cookie或此Cookie政策有任何疑问，请联系我们：",
        contactInfo: "电子邮件：wt@wmcircle.cn\n主题行：Cookie政策咨询\n响应时间：我们力争在24小时内回复",
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
              {/* Header */}
              <div className="mb-8">
                <Link href={`/${locale === 'en' ? 'en' : locale}`}>
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
                {/* 1. What Are Cookies */}
                <section>
                  <h2 className="text-2xl font-semibold mb-4">1. {t("whatAreCookiesTitle")}</h2>
                  <p className="text-muted-foreground leading-relaxed">{t("whatAreCookiesText")}</p>
                </section>

                {/* 2. How We Use Cookies */}
                <section>
                  <h2 className="text-2xl font-semibold mb-4">2. {t("howWeUseCookiesTitle")}</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">{t("howWeUseCookiesText")}</p>
                  <ul className="list-disc pl-6 space-y-2">
                    {(t("cookieUsesList") as string[]).map((item, index) => (
                      <li key={index} className="text-muted-foreground">{item}</li>
                    ))}
                  </ul>
                </section>

                {/* 3. Types of Cookies We Use */}
                <section>
                  <h2 className="text-2xl font-semibold mb-6">3. {t("typesOfCookiesTitle")}</h2>
                  
                  {/* Essential Cookies */}
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-3">3.1 {t("essentialCookiesTitle")}</h3>
                    <p className="text-muted-foreground mb-3">{t("essentialCookiesDesc")}</p>
                    <ul className="list-disc pl-6 space-y-2 mb-3">
                      {(t("essentialCookiesList") as string[]).map((item, index) => (
                        <li key={index} className="text-muted-foreground">{item}</li>
                      ))}
                    </ul>
                    <p className="text-sm text-muted-foreground italic">{t("essentialDuration")}</p>
                  </div>

                  {/* Preference Cookies */}
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-3">3.2 {t("preferenceCookiesTitle")}</h3>
                    <p className="text-muted-foreground mb-3">{t("preferenceCookiesDesc")}</p>
                    <ul className="list-disc pl-6 space-y-2 mb-3">
                      {(t("preferenceCookiesList") as string[]).map((item, index) => (
                        <li key={index} className="text-muted-foreground">{item}</li>
                      ))}
                    </ul>
                    <p className="text-sm text-muted-foreground italic">{t("preferenceDuration")}</p>
                  </div>

                  {/* Analytics Cookies */}
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-3">3.3 {t("analyticsCookiesTitle")}</h3>
                    <p className="text-muted-foreground mb-3">{t("analyticsCookiesDesc")}</p>
                    <ul className="list-disc pl-6 space-y-2 mb-3">
                      {(t("analyticsCookiesList") as string[]).map((item, index) => (
                        <li key={index} className="text-muted-foreground">{item}</li>
                      ))}
                    </ul>
                    <p className="text-sm text-muted-foreground italic">{t("analyticsDuration")}</p>
                  </div>

                  {/* Marketing Cookies */}
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-3">3.4 {t("marketingCookiesTitle")}</h3>
                    <p className="text-muted-foreground mb-3">{t("marketingCookiesDesc")}</p>
                    <ul className="list-disc pl-6 space-y-2 mb-3">
                      {(t("marketingCookiesList") as string[]).map((item, index) => (
                        <li key={index} className="text-muted-foreground">{item}</li>
                      ))}
                    </ul>
                    <p className="text-sm text-muted-foreground italic">{t("marketingDuration")}</p>
                  </div>
                </section>

                {/* 4. Third-Party Cookies */}
                <section>
                  <h2 className="text-2xl font-semibold mb-4">4. {t("thirdPartyCookiesTitle")}</h2>
                  <p className="text-muted-foreground mb-4">{t("thirdPartyCookiesText")}</p>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">{t("analyticsServicesTitle")}</h4>
                      <ul className="list-disc pl-6 space-y-1">
                        {(t("analyticsServicesList") as string[]).map((item, index) => (
                          <li key={index} className="text-muted-foreground">{item}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">{t("paymentProcessorsTitle")}</h4>
                      <ul className="list-disc pl-6 space-y-1">
                        {(t("paymentProcessorsList") as string[]).map((item, index) => (
                          <li key={index} className="text-muted-foreground">{item}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">{t("supportServicesTitle")}</h4>
                      <ul className="list-disc pl-6 space-y-1">
                        {(t("supportServicesList") as string[]).map((item, index) => (
                          <li key={index} className="text-muted-foreground">{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </section>

                {/* 5. Managing Your Cookie Preferences */}
                <section>
                  <h2 className="text-2xl font-semibold mb-4">5. {t("managingPreferencesTitle")}</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold mb-3">5.1 {t("browserSettingsTitle")}</h3>
                      <p className="text-muted-foreground mb-3">{t("browserSettingsText")}</p>
                      <ul className="list-disc pl-6 space-y-2">
                        {(t("browserSettingsList") as string[]).map((item, index) => (
                          <li key={index} className="text-muted-foreground">{item}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold mb-3">5.2 {t("ourCookiePreferencesTitle")}</h3>
                      <p className="text-muted-foreground mb-3">{t("ourCookiePreferencesText")}</p>
                      <ul className="list-disc pl-6 space-y-2">
                        {(t("ourCookiePreferencesList") as string[]).map((item, index) => (
                          <li key={index} className="text-muted-foreground">{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </section>

                {/* 6. Impact of Disabling Cookies */}
                <section>
                  <h2 className="text-2xl font-semibold mb-4">6. {t("impactOfDisablingTitle")}</h2>
                  <p className="text-muted-foreground mb-4 font-medium">{t("impactNote")}</p>
                  <ul className="list-disc pl-6 space-y-2">
                    {(t("impactList") as string[]).map((item, index) => (
                      <li key={index} className="text-muted-foreground">{item}</li>
                    ))}
                  </ul>
                </section>

                {/* 7. Cookie Security */}
                <section>
                  <h2 className="text-2xl font-semibold mb-4">7. {t("cookieSecurityTitle")}</h2>
                  <p className="text-muted-foreground mb-4">{t("cookieSecurityText")}</p>
                  <ul className="list-disc pl-6 space-y-2">
                    {(t("cookieSecurityList") as string[]).map((item, index) => (
                      <li key={index} className="text-muted-foreground">{item}</li>
                    ))}
                  </ul>
                </section>

                {/* 8. Updates to This Policy */}
                <section>
                  <h2 className="text-2xl font-semibold mb-4">8. {t("updatesToPolicyTitle")}</h2>
                  <p className="text-muted-foreground leading-relaxed">{t("updatesToPolicyText")}</p>
                </section>

                {/* 9. Contact Us */}
                <section>
                  <h2 className="text-2xl font-semibold mb-4">9. {t("contactUsTitle")}</h2>
                  <p className="text-muted-foreground mb-4">{t("contactUsText")}</p>
                  <div className="bg-muted p-4 rounded-lg">
                    <pre className="text-sm text-muted-foreground whitespace-pre-wrap">{t("contactInfo")}</pre>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
        {/* Footer */}
        <Footer locale={locale} />
      </div>
    </ThemeProvider>
  )
}

import { Button } from "@/components/ui/button"
import { ArrowLeftIcon, CalendarIcon, ClockIcon, TagIcon, MailIcon, TwitterIcon } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { ThemeProvider } from "@/components/theme-provider"
import { Metadata } from "next"
import CopyButton from "@/components/copy-button"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  
  const titles = {
    en: "Contact Aiartools Team | Get Support & Connect With Us",
    zh: "联系Aiartools团队 | 获取支持并与我们取得联系"
  }
  
  const descriptions = {
    en: "Get in touch with the Aiartools team for support, feedback, or partnerships. Multiple contact methods available including email, social media, and more.",
    zh: "联系Aiartools团队获取支持、反馈或合作机会。多种联系方式可选，包括电子邮件、社交媒体等。"
  }

  const title = titles[locale as keyof typeof titles] || titles.en
  const description = descriptions[locale as keyof typeof descriptions] || descriptions.en

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://aiartools.com/${locale}/blog/contact-us`,
      siteName: "Aiartools",
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
      type: 'article',
      images: [
        {
          url: 'https://aiartools.com/images/Get in Touch with Aiartools Team.png',
          width: 1000,
          height: 400,
          alt: 'Contact Aiartools Team',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['https://aiartools.com/images/Get in Touch with Aiartools Team.png'],
    },
    alternates: {
      canonical: `https://aiartools.com/${locale}/blog/contact-us`,
      languages: {
        'en': 'https://aiartools.com/en/blog/contact-us',
        'zh': 'https://aiartools.com/zh/blog/contact-us',
      },
    },
  }
}

interface BlogPostProps {
  params: Promise<{ locale: string }>
}

export default async function ContactUs({ params }: BlogPostProps) {
  const { locale } = await params
  
  const t = (key: string): any => {
    const translations: Record<string, Record<string, any>> = {
      en: {
        backToHome: "Back to Home",
        backToBlog: "Back to Blog",
        title: "Get in Touch with Aiartools Team",
        publishDate: "June 1, 2025",
        readTime: "3 min read",
        category: "Contact",
        introduction: "We're Here to Help",
        introText:
          "At Aiartools, we value open communication with our users and are always eager to hear your feedback, answer your questions, or assist with any issues you might encounter. This guide outlines the various ways you can reach our team.",
        contactMethods: "Contact Methods",
        emailTitle: "Email Support",
        emailText:
          "For general inquiries, technical support, or feedback, email is the most reliable way to reach us. Our support team typically responds within 24 hours during business days.",
        emailAddress: "wt@wmcircle.cn",
        socialMediaTitle: "Social Media",
        socialMediaText:
          "Follow us on social media to stay updated with the latest news, features, and tips. You can also send us direct messages on these platforms:",
        twitterTitle: "Twitter/X",
        twitterText: "Follow us or send a DM @zyailive",
        twitterLink: "https://x.com/zyailive",
        wechatTitle: "WeChat",
        wechatText: "Add our official WeChat account for updates and support in Chinese:",
        wechatID: "zyailive01",
        businessInquiries: "Business Inquiry",
        businessText:
          "For partnership opportunities, enterprise plans, or media inquiries, please email us with the subject line 'Business Inquiry' at wt@wmcircle.cn.",
        feedbackTitle: "Feedback and Feature Request",
        feedbackText:
          "We're constantly working to improve Aiartools based on user feedback. If you have suggestions for new features or improvements, we'd love to hear from you! Send your ideas to wt@wmcircle.cn with the subject 'Feature Request'.",
        bugReportsTitle: "Bug Reports",
        bugReportsText:
          "If you encounter any issues while using Aiartools, please let us know so we can fix them promptly. When reporting a bug, please include:",
        bugReportsList: [
          "A clear description of the issue",
          "Steps to reproduce the problem",
          "Screenshots (if applicable)",
          "Your device and browser information",
        ],
        responseTimeTitle: "Response Time",
        responseTimeText:
          "We strive to respond to all inquiries within 24 hours during business days. Complex technical issues may require additional time for investigation.",
        officeHoursTitle: "Office Hours",
        officeHoursText: "Our support team is available Monday through Friday, 9:00 AM to 6:00 PM (UTC+8).",
        communityTitle: "Join Our Community",
        communityText:
          "Connect with other Aiartools users to share tips, showcase your creations, and get inspired. Our growing community is a great resource for learning new techniques and getting quick answers.",
        conclusionTitle: "We Look Forward to Hearing from You",
        conclusionText:
          "Your feedback and questions help us make Aiartools better. Don't hesitate to reach out—we're here to help you make the most of our AI image transformation tools.",
        contactCTA: "Contact Us Today",
      },
      zh: {
        backToHome: "返回首页",
        backToBlog: "返回博客",
        title: "联系Aiartools团队",
        publishDate: "2025年6月1日",
        readTime: "3分钟阅读",
        category: "联系我们",
        introduction: "我们随时为您提供帮助",
        introText:
          "在Aiartools，我们重视与用户的开放沟通，并始终渴望听取您的反馈、回答您的问题或协助解决您可能遇到的任何问题。本指南概述了联系我们团队的各种方式。",
        contactMethods: "联系方式",
        emailTitle: "电子邮件支持",
        emailText:
          "对于一般咨询、技术支持或反馈，电子邮件是联系我们最可靠的方式。我们的支持团队通常在工作日24小时内回复。",
        emailAddress: "wt@wmcircle.cn",
        socialMediaTitle: "社交媒体",
        socialMediaText: "在社交媒体上关注我们，了解最新消息、功能和提示。您也可以在这些平台上向我们发送直接消息：",
        twitterTitle: "Twitter/X",
        twitterText: "关注我们或发送私信 @zyailive",
        twitterLink: "https://x.com/zyailive",
        wechatTitle: "微信",
        wechatText: "添加我们的官方微信账号，获取中文更新和支持：",
        wechatID: "zyailive01",
        businessInquiries: "商务咨询",
        businessText: "对于合作机会、企业计划或媒体咨询，请发送电子邮件至wt@wmcircle.cn，主题为'商务咨询'。",
        feedbackTitle: "反馈和功能请求",
        feedbackText:
          "我们不断根据用户反馈改进Aiartools。如果您对新功能或改进有建议，我们很乐意听取您的意见！请将您的想法发送至wt@wmcircle.cn，主题为'功能请求'。",
        bugReportsTitle: "错误报告",
        bugReportsText: "如果您在使用Aiartools时遇到任何问题，请告诉我们，以便我们及时修复。报告错误时，请包括：",
        bugReportsList: ["清晰的问题描述", "重现问题的步骤", "截图（如适用）", "您的设备和浏览器信息"],
        responseTimeTitle: "响应时间",
        responseTimeText: "我们努力在工作日24小时内回复所有咨询。复杂的技术问题可能需要额外的调查时间。",
        officeHoursTitle: "办公时间",
        officeHoursText: "我们的支持团队在周一至周五，上午9:00至下午6:00（UTC+8）提供服务。",
        communityTitle: "加入我们的社区",
        communityText:
          "与其他Aiartools用户联系，分享技巧，展示您的创作，并获得灵感。我们不断成长的社区是学习新技术和获得快速答案的绝佳资源。",
        conclusionTitle: "我们期待您的来信",
        conclusionText:
          "您的反馈和问题帮助我们改进Aiartools。请随时联系我们——我们在这里帮助您充分利用我们的AI图像转换工具。",
        contactCTA: "立即联系我们",
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
                  src="/images/Get in Touch with Aiartools Team.png"
                  alt="Contact Aiartools Team"
                  width={1000}
                  height={400}
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
                  <h2 className="text-2xl font-semibold mb-4">{t("contactMethods")}</h2>

                  {/* Email */}
                  <div className="bg-muted/30 p-6 rounded-lg mb-6">
                    <h3 className="text-xl font-medium mb-3 flex items-center">
                      <MailIcon className="w-5 h-5 mr-2 text-primary" />
                      {t("emailTitle")}
                    </h3>
                    <p className="text-muted-foreground mb-4">{t("emailText")}</p>
                    <div className="bg-background p-4 rounded-md flex items-center justify-between">
                      <span className="font-medium">{t("emailAddress")}</span>
                      <CopyButton text={t("emailAddress")}>
                        Copy
                      </CopyButton>
                    </div>
                  </div>

                  {/* Social Media */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-medium">{t("socialMediaTitle")}</h3>
                    <p className="text-muted-foreground">{t("socialMediaText")}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Twitter */}
                      <div className="border rounded-lg p-5">
                        <div className="flex items-center mb-4">
                          <TwitterIcon className="w-6 h-6 text-blue-400 mr-3" />
                          <h4 className="font-medium">{t("twitterTitle")}</h4>
                        </div>
                        <p className="text-muted-foreground mb-4">{t("twitterText")}</p>
                        <a
                          href={t("twitterLink")}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {t("twitterLink")}
                        </a>
                      </div>

                      {/* WeChat */}
                      <div className="border rounded-lg p-5">
                        <div className="flex items-center mb-4">
                          <svg
                            className="w-6 h-6 text-green-500 mr-3"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M8.69 5.49C9.58 5.19 10.54 5 11.55 5C16.07 5 19.75 7.86 19.75 11.4C19.75 14.94 16.07 17.8 11.55 17.8C10.54 17.8 9.58 17.61 8.69 17.31C8.24 17.15 7.79 17.07 7.35 17.07C6.95 17.07 6.56 17.13 6.18 17.25L4.18 17.91L4.76 16.07C4.91 15.62 4.99 15.15 4.99 14.67C4.99 14.26 4.93 13.86 4.82 13.47C4.29 12.8 4 12.03 4 11.2C4 8.71 6.09 6.61 8.69 5.49ZM2.5 22L5.89 20.55C6.33 20.37 6.79 20.28 7.26 20.28C7.7 20.28 8.15 20.36 8.58 20.52C9.68 20.9 10.87 21.1 12.1 21.1C17.97 21.1 22.75 17.3 22.75 12.6C22.75 7.9 17.97 4.1 12.1 4.1C6.23 4.1 1.45 7.9 1.45 12.6C1.45 13.72 1.74 14.8 2.27 15.77C2.43 16.09 2.5 16.44 2.5 16.8C2.5 17.17 2.44 17.53 2.31 17.87L1.5 20.5L2.5 22Z" />
                          </svg>
                          <h4 className="font-medium">{t("wechatTitle")}</h4>
                        </div>
                        <p className="text-muted-foreground mb-4">{t("wechatText")}</p>
                        <div className="bg-muted/30 p-3 rounded-md text-center font-medium">{t("wechatID")}</div>
                      </div>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">{t("businessInquiries")}</h2>
                  <p className="text-muted-foreground leading-relaxed">{t("businessText")}</p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">{t("feedbackTitle")}</h2>
                  <p className="text-muted-foreground leading-relaxed">{t("feedbackText")}</p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">{t("bugReportsTitle")}</h2>
                  <p className="text-muted-foreground mb-4">{t("bugReportsText")}</p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2 pl-4">
                    {t("bugReportsList").map((item: string, index: number) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </section>

                <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-3">{t("responseTimeTitle")}</h2>
                    <p className="text-muted-foreground">{t("responseTimeText")}</p>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold mb-3">{t("officeHoursTitle")}</h2>
                    <p className="text-muted-foreground">{t("officeHoursText")}</p>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">{t("communityTitle")}</h2>
                  <p className="text-muted-foreground leading-relaxed">{t("communityText")}</p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">{t("conclusionTitle")}</h2>
                  <p className="text-muted-foreground leading-relaxed">{t("conclusionText")}</p>
                </section>

                <div className="text-center my-10">
                  <a href={`mailto:${t("emailAddress")}`}>
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                    >
                      {t("contactCTA")}
                    </Button>
                  </a>
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

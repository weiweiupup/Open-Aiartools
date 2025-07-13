import Head from 'next/head'
import { useTranslations } from 'next-intl'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string
  image?: string
  url?: string
  type?: 'website' | 'article' | 'product'
  locale?: string
  structuredData?: object
}

export default function SEO({
  title: customTitle,
  description: customDescription,
  keywords: customKeywords,
  image = '/images/og-image.png',
  url = 'https://draw2model.com',
  type = 'website',
  locale = 'en',
  structuredData
}: SEOProps) {
  const t = useTranslations('seo')
  
  const title = customTitle || t('title')
  const description = customDescription || t('description')
  const keywords = customKeywords || t('keywords')
  
  // 增强关键词，添加长尾关键词
  const enhancedKeywords = [
    keywords,
    'magic tools ai',
    'free ai photo editor online',
    'background removal tool',
    'ai image enhancement',
    'smart photo editing',
    'artificial intelligence image editor',
    locale === 'zh' ? 'AI图像编辑,智能修图工具,免费在线图片处理,背景移除,AI照片增强' : ''
  ].filter(Boolean).join(',')
  
  // 默认结构化数据
  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Magic Tools - AI Image Editor",
    "description": description,
    "url": url,
    "applicationCategory": "DesignApplication",
    "operatingSystem": "Web Browser",
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    },
    "creator": {
      "@type": "Organization",
      "name": "Magic Tools Team"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "1250",
      "bestRating": "5",
      "worstRating": "1"
    },
    "featureList": [
      "AI-powered image editing",
      "Background removal",
      "Style transfer",
      "Object manipulation",
      "High-quality output"
    ]
  }
  
  const finalStructuredData = structuredData || defaultStructuredData
  
  return (
    <Head>
      {/* 基础 meta 标签 */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={enhancedKeywords} />
      <meta name="author" content="Magic Tools Team" />
      <meta name="creator" content="Magic Tools" />
      <meta name="publisher" content="Magic Tools" />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      
      {/* 增强SEO meta标签 */}
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content="Magic Tools" />
      <meta name="application-name" content="Magic Tools" />
      
      {/* Open Graph meta 标签 */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content="Magic Tools" />
      <meta property="og:locale" content={locale === 'zh' ? 'zh_CN' : 'en_US'} />
      <meta property="og:locale:alternate" content={locale === 'zh' ? 'en_US' : 'zh_CN'} />
      
      {/* Twitter Card meta 标签 */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={title} />
      <meta name="twitter:creator" content="@wangwei577" />
      <meta name="twitter:site" content="@wangwei577" />
      
      {/* 语言相关 */}
      <meta httpEquiv="content-language" content={locale} />
      <link rel="alternate" hrefLang="en" href="https://draw2model.com/en" />
      <link rel="alternate" hrefLang="zh" href="https://draw2model.com/zh" />
      <link rel="alternate" hrefLang="x-default" href="https://draw2model.com/en" />
      
      {/* DNS预解析和预连接 */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//fonts.gstatic.com" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* 额外的 meta 标签 */}
      <meta name="theme-color" content="#6366f1" />
      <meta name="msapplication-TileColor" content="#6366f1" />
      <meta name="msapplication-TileImage" content="/images/favicon.ico" />
      <link rel="canonical" href={url} />
      
      {/* 结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(finalStructuredData)
        }}
      />
      
      {/* 预加载关键资源 */}
      <link rel="preload" href="/images/og-image.png" as="image" />
    </Head>
  )
} 
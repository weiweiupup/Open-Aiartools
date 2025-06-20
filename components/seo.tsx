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
}

export default function SEO({
  title: customTitle,
  description: customDescription,
  keywords: customKeywords,
  image = '/images/og-image.png',
  url = 'https://aiartools.com',
  type = 'website',
  locale = 'en'
}: SEOProps) {
  const t = useTranslations('seo')
  
  const title = customTitle || t('title')
  const description = customDescription || t('description')
  const keywords = customKeywords || t('keywords')
  
  return (
    <Head>
      {/* 基础 meta 标签 */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Aiartools Team" />
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      
      {/* Open Graph meta 标签 */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content="Aiartools" />
      <meta property="og:locale" content={locale} />
      
      {/* Twitter Card meta 标签 */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:creator" content="@aiartools" />
      <meta name="twitter:site" content="@aiartools" />
      
      {/* 语言相关 */}
      <meta httpEquiv="content-language" content={locale} />
      <link rel="alternate" hrefLang="en" href="https://aiartools.com" />
      <link rel="alternate" hrefLang="zh" href="https://aiartools.com/zh" />
      <link rel="alternate" hrefLang="x-default" href="https://aiartools.com" />
      
      {/* 额外的 meta 标签 */}
      <meta name="theme-color" content="#6366f1" />
      <meta name="msapplication-TileColor" content="#6366f1" />
      <link rel="canonical" href={url} />
    </Head>
  )
} 
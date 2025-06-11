import { NextResponse } from 'next/server'

export async function GET() {
  const baseUrl = 'https://aiartools.com'
  const languages = ['en', 'zh']
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  
  <!-- 首页 -->
  <url>
    <loc>${baseUrl}/en</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
    <xhtml:link rel="alternate" hrefLang="en" href="${baseUrl}/en" />
    <xhtml:link rel="alternate" hrefLang="zh" href="${baseUrl}/zh" />
    <xhtml:link rel="alternate" hrefLang="x-default" href="${baseUrl}/en" />
  </url>
  
  <url>
    <loc>${baseUrl}/zh</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
    <xhtml:link rel="alternate" hrefLang="en" href="${baseUrl}/en" />
    <xhtml:link rel="alternate" hrefLang="zh" href="${baseUrl}/zh" />
    <xhtml:link rel="alternate" hrefLang="x-default" href="${baseUrl}/en" />
  </url>
  
  <!-- 功能页面 -->
  ${languages.map(lang => {
    return `
  <url>
    <loc>${baseUrl}/${lang}#features</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <xhtml:link rel="alternate" hrefLang="en" href="${baseUrl}/en#features" />
    <xhtml:link rel="alternate" hrefLang="zh" href="${baseUrl}/zh#features" />
    <xhtml:link rel="alternate" hrefLang="x-default" href="${baseUrl}/en#features" />
  </url>
  
  <url>
    <loc>${baseUrl}/${lang}#demo</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
    <xhtml:link rel="alternate" hrefLang="en" href="${baseUrl}/en#demo" />
    <xhtml:link rel="alternate" hrefLang="zh" href="${baseUrl}/zh#demo" />
    <xhtml:link rel="alternate" hrefLang="x-default" href="${baseUrl}/en#demo" />
  </url>
  
  <url>
    <loc>${baseUrl}/${lang}#pricing</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
    <xhtml:link rel="alternate" hrefLang="en" href="${baseUrl}/en#pricing" />
    <xhtml:link rel="alternate" hrefLang="zh" href="${baseUrl}/zh#pricing" />
    <xhtml:link rel="alternate" hrefLang="x-default" href="${baseUrl}/en#pricing" />
  </url>`
  }).join('')}
  
</urlset>`

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  })
} 
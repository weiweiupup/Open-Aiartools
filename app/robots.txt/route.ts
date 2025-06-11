import { NextResponse } from 'next/server'

export async function GET() {
  const robots = `User-agent: *
Allow: /

# 禁止爬取API路由
Disallow: /api/

# 禁止爬取私有文件
Disallow: /_next/
Disallow: /admin/

# Sitemap位置
Sitemap: https://aiartools.com/sitemap.xml

# 抓取延迟（可选）
Crawl-delay: 1`

  return new NextResponse(robots, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  })
} 
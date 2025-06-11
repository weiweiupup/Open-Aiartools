import createMiddleware from 'next-intl/middleware'

export default createMiddleware({
  // 支持的语言列表
  locales: ['en', 'zh'],
  
  // 默认语言
  defaultLocale: 'en',
  
  // 路径名国际化 - 改为 'always' 让所有语言都有路径前缀
  localePrefix: 'always',
  
  // 自动检测用户浏览器语言
  localeDetection: true,
  
  // 替代语言配置
  alternateLinks: true
})

export const config = {
  // 匹配所有路径，除了API路由和静态文件
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
} 
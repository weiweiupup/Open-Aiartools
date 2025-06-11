import { notFound } from "next/navigation"
import { getRequestConfig } from "next-intl/server"

// 支持的语言列表
const locales = ["en", "zh"]

export default getRequestConfig(async ({ locale }) => {
  if (!locale || !locales.includes(locale)) notFound()

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  }
})

export { locales }

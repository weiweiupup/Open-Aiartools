"use client"

import { useRouter, usePathname } from 'next/navigation'
import { useLocale } from 'next-intl'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { GlobeIcon, CheckIcon } from 'lucide-react'
import { useState, useEffect } from 'react'

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'zh', name: '简体中文', flag: '🇨🇳' },
]

export default function LanguageSwitcher() {
  const router = useRouter()
  const pathname = usePathname()
  const currentLocale = useLocale()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const switchLanguage = (locale: string) => {
    // 获取当前路径，移除语言前缀
    const segments = pathname.split('/').filter(Boolean)
    const pathWithoutLocale = segments.slice(1).join('/')
    
    // 构建新的路径 - 所有语言都有前缀
    const newPath = `/${locale}/${pathWithoutLocale}`.replace(/\/+$/, '') || `/${locale}`
    
    // 导航到新路径
    router.push(newPath)
    
    // 保存用户选择的语言到localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferred-language', locale)
    }
  }

  const getCurrentLanguage = () => {
    return languages.find(lang => lang.code === currentLocale) || languages[0]
  }

  // 自动检测浏览器语言（仅在首次访问时）
  useEffect(() => {
    if (mounted && typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('preferred-language')
      
      if (!savedLanguage) {
        // 检测浏览器语言
        const browserLang = navigator.language.toLowerCase()
        let detectedLang = 'en' // 默认语言
        
        if (browserLang.startsWith('zh')) {
          detectedLang = 'zh'
        }
        
        // 如果检测到的语言与当前语言不同，则切换
        if (detectedLang !== currentLocale && detectedLang !== 'en') {
          switchLanguage(detectedLang)
        }
      }
    }
  }, [mounted, currentLocale])

  if (!mounted) {
    return null
  }

  const currentLang = getCurrentLanguage()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <GlobeIcon className="h-4 w-4" />
          <span className="hidden sm:inline">{currentLang.flag} {currentLang.name}</span>
          <span className="sm:hidden">{currentLang.flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => switchLanguage(language.code)}
            className="flex items-center justify-between cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <span>{language.flag}</span>
              <span>{language.name}</span>
            </span>
            {language.code === currentLocale && (
              <CheckIcon className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 
"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { MoonIcon, SunIcon, MenuIcon, XIcon, GlobeIcon, UserIcon, LogOutIcon, SettingsIcon } from "lucide-react"
import { useTheme } from "next-themes"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { useTranslations } from "next-intl"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import { useSession, signOut } from 'next-auth/react'
import { useAuth } from "./providers"

interface NavigationProps {
  locale: string
}

interface User {
  id: string
  email: string
  username: string | null
  isEmailVerified: boolean
  credits: number
}

export default function Navigation({ locale }: NavigationProps) {
  const { theme, setTheme } = useTheme()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, isLoading, refreshUser } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const t = useTranslations("navigation")
  const tAuth = useTranslations("dashboard")
  const tErrors = useTranslations("auth.errors")
  const { toast } = useToast()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false })
      await refreshUser() // 刷新认证状态
      router.push(`/${locale}`)
      toast({
        title: t("logoutSuccess"),
        description: t("logoutSuccessDesc"),
      })
    } catch (error) {
      toast({
        title: t("logoutFailed"),
        description: t("logoutFailedDesc"),
        variant: "destructive",
      })
    }
  }

  const scrollToSection = (sectionId: string) => {
    // 检查当前路径是否为首页
    const isHomePage = pathname === `/${locale}` || pathname === `/${locale}/`

    if (isHomePage) {
      // 如果在首页，直接滚动到对应部分
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ behavior: "smooth" })
      }
    } else {
      // 如果不在首页，导航到首页的对应锚点
      router.push(`/${locale}#${sectionId}`)
    }
    setIsMenuOpen(false)
  }

  const scrollToTop = () => {
    const isHomePage = pathname === `/${locale}` || pathname === `/${locale}/`

    if (isHomePage) {
      window.scrollTo({ top: 0, behavior: "smooth" })
    } else {
      router.push(`/${locale}`)
    }
    setIsMenuOpen(false)
  }

  const switchLanguage = (newLocale: string) => {
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`)
    router.push(newPath)
  }

  return (
    <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-md border-b z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={scrollToTop}>
              <Image 
                src="/images/logo.png" 
                alt="Aiartools Logo" 
                width={32} 
                height={32}
                className="w-8 h-8"
              />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Aiartools
              </h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <button
                onClick={scrollToTop}
                className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {t("home")}
              </button>
              <button
                onClick={() => scrollToSection("features")}
                className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {t("features")}
              </button>
              <button
                onClick={() => scrollToSection("demo")}
                className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {t("demo")}
              </button>
              <button
                onClick={() => scrollToSection("pricing")}
                className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {t("pricing")}
              </button>
              <button
                onClick={() => scrollToSection("blog")}
                className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {t("blog")}
              </button>
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2">
            {/* Language Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <GlobeIcon className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => switchLanguage("en")}>English</DropdownMenuItem>
                <DropdownMenuItem onClick={() => switchLanguage("zh")}>中文</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Theme Toggle */}
            <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              <SunIcon className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <MoonIcon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>

            {/* User Auth Section */}
            {!isLoading && (
              <>
                {user ? (
                  // 已登录用户菜单
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                        <UserIcon className="h-4 w-4" />
                        <span className="hidden sm:inline-block">
                          {user.username || user.email.split('@')[0]}
                        </span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <div className="px-2 py-2">
                        <p className="text-sm font-medium">{user.username || tAuth('welcome')}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                        {!user.isEmailVerified && (
                          <p className="text-xs text-orange-600 mt-1">{tAuth('unverified')}</p>
                        )}
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => router.push(`/${locale}/dashboard`)}>
                        <SettingsIcon className="mr-2 h-4 w-4" />
                        {t('dashboard')}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout}>
                        <LogOutIcon className="mr-2 h-4 w-4" />
                        {t('logout')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  // 未登录用户按钮
                  <div className="hidden sm:flex items-center space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => router.push(`/${locale}/auth/login`)}
                    >
                      {t('login')}
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => router.push(`/${locale}/auth/register`)}
                    >
                      {t('register')}
                    </Button>
                  </div>
                )}
              </>
            )}

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-background border-t">
              <button
                onClick={scrollToTop}
                className="text-foreground hover:text-primary block px-3 py-2 rounded-md text-base font-medium w-full text-left transition-colors"
              >
                {t("home")}
              </button>
              <button
                onClick={() => scrollToSection("features")}
                className="text-foreground hover:text-primary block px-3 py-2 rounded-md text-base font-medium w-full text-left transition-colors"
              >
                {t("features")}
              </button>
              <button
                onClick={() => scrollToSection("demo")}
                className="text-foreground hover:text-primary block px-3 py-2 rounded-md text-base font-medium w-full text-left transition-colors"
              >
                {t("demo")}
              </button>
              <button
                onClick={() => scrollToSection("pricing")}
                className="text-foreground hover:text-primary block px-3 py-2 rounded-md text-base font-medium w-full text-left transition-colors"
              >
                {t("pricing")}
              </button>
              <button
                onClick={() => scrollToSection("blog")}
                className="text-foreground hover:text-primary block px-3 py-2 rounded-md text-base font-medium w-full text-left transition-colors"
              >
                {t("blog")}
              </button>
              
              {/* Mobile Auth Section */}
              {!isLoading && (
                <>
                  <div className="border-t border-border my-2"></div>
                  {user ? (
                    <>
                      <div className="px-3 py-2">
                        <p className="text-sm font-medium text-foreground">{user.username || tAuth('welcome')}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                        {!user.isEmailVerified && (
                          <p className="text-xs text-orange-600 mt-1">{tAuth('unverified')}</p>
                        )}
                      </div>
                      <button
                        onClick={() => {
                          router.push(`/${locale}/dashboard`)
                          setIsMenuOpen(false)
                        }}
                        className="text-foreground hover:text-primary block px-3 py-2 rounded-md text-base font-medium w-full text-left transition-colors"
                      >
                        {t('dashboard')}
                      </button>
                      <button
                        onClick={() => {
                          handleLogout()
                          setIsMenuOpen(false)
                        }}
                        className="text-foreground hover:text-primary block px-3 py-2 rounded-md text-base font-medium w-full text-left transition-colors"
                      >
                        {t('logout')}
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          router.push(`/${locale}/auth/login`)
                          setIsMenuOpen(false)
                        }}
                        className="text-foreground hover:text-primary block px-3 py-2 rounded-md text-base font-medium w-full text-left transition-colors"
                      >
                        {t('login')}
                      </button>
                      <button
                        onClick={() => {
                          router.push(`/${locale}/auth/register`)
                          setIsMenuOpen(false)
                        }}
                        className="text-foreground hover:text-primary block px-3 py-2 rounded-md text-base font-medium w-full text-left transition-colors"
                      >
                        {t('register')}
                      </button>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

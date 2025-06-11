"use client"

import { Button } from "@/components/ui/button"
import { TwitterIcon, GithubIcon, GlobeIcon } from "lucide-react"
import Link from "next/link"
import { useTranslations } from "next-intl"
import Image from "next/image"

interface FooterProps {
  locale: string
}

export default function Footer({ locale }: FooterProps) {
  const t = useTranslations("footer")
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Image 
                src="/images/logo.png" 
                alt="Aiartools Logo" 
                width={32} 
                height={32}
                className="w-8 h-8"
              />
              <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Aiartools
              </h3>
            </div>
            <p className="text-muted-foreground">{t("description")}</p>
            <div className="flex space-x-4">
              <a href="https://x.com/zyailive" target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="icon">
                  <TwitterIcon className="w-5 h-5" />
                </Button>
              </a>
              <a href="https://github.com/ItusiAI" target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="icon">
                  <GithubIcon className="w-5 h-5" />
                </Button>
              </a>
              <Link href={`/${locale}`}>
                <Button variant="ghost" size="icon">
                  <GlobeIcon className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Product */}
          <div className="space-y-4">
            <h4 className="font-semibold">{t("product.title")}</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <Link href={`/${locale}#features`} className="hover:text-foreground transition-colors">
                  {t("product.features")}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}#demo`} className="hover:text-foreground transition-colors">
                  Demo
                </Link>
              </li>
              <li>
                <Link href={`/${locale}#pricing`} className="hover:text-foreground transition-colors">
                  {t("product.pricing")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="font-semibold">{t("support.title")}</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <Link href={`/${locale}/blog`} className="hover:text-foreground transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/blog/contact-us`} className="hover:text-foreground transition-colors">
                  {t("support.contact")}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/terms`} className="hover:text-foreground transition-colors">
                  {t("terms")}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/privacy`} className="hover:text-foreground transition-colors">
                  {t("privacy")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Friendly Links */}
          <div className="space-y-4">
            <h4 className="font-semibold">{t("friendlyLinks.title")}</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <a 
                  href="https://www.itusi.cn/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-foreground transition-colors"
                >
                  {t("friendlyLinks.itusi")}
                </a>
              </li>
              <li>
                <a 
                  href="https://voicecanvas.org/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-foreground transition-colors"
                >
                  {t("friendlyLinks.voiceCanvas")}
                </a>
              </li>
              <li>
                <a 
                  href="https://pdf2md.site/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-foreground transition-colors"
                >
                  {t("friendlyLinks.pdf2md")}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">
            © {currentYear} Aiartools. {t("copyright")}
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link
              href={`/${locale}/privacy`}
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              {t("privacy")}
            </Link>
            <Link
              href={`/${locale}/terms`}
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              {t("terms")}
            </Link>
            <Link
              href={`/${locale}/cookies`}
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              {t("cookies")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

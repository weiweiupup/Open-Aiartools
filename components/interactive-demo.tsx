"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UploadIcon, SparklesIcon, LoaderIcon, DownloadIcon, AlertTriangleIcon } from "lucide-react"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

interface InteractiveDemoProps {
  locale: string
}

interface User {
  id: string
  email: string
  username: string | null
  isEmailVerified: boolean
  credits: number
  subscriptionCredits?: number
}

// API响应类型
interface ApiResponse {
  success: boolean;
  data?: {
    images?: Array<{
      url: string;
      width?: number;
      height?: number;
      content_type?: string;
    }>;
  };
  error?: string;
  message?: string;
  credits?: {
    deducted: number;
    remaining: number;
  };
}

// 纵横比选项
const getAspectRatios = (t: any) => [
  { value: 'original', label: t('aspectRatios.original') },
  { value: '21:9', label: t('aspectRatios.ultrawide') },
  { value: '16:9', label: t('aspectRatios.widescreen') },
  { value: '4:3', label: t('aspectRatios.standard') },
  { value: '3:2', label: t('aspectRatios.classic') },
  { value: '1:1', label: t('aspectRatios.square') },
  { value: '2:3', label: t('aspectRatios.portraitClassic') },
  { value: '3:4', label: t('aspectRatios.portraitStandard') },
  { value: '9:16', label: t('aspectRatios.portraitWidescreen') },
  { value: '9:21', label: t('aspectRatios.portraitUltrawide') }
]

// 支持的文件格式
const SUPPORTED_FORMATS = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/avif'
]

export default function InteractiveDemo({ locale }: InteractiveDemoProps) {
  const [prompt, setPrompt] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [showDownloadSuccess, setShowDownloadSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [aspectRatio, setAspectRatio] = useState<string>('original')
  const [user, setUser] = useState<User | null>(null)
  const [isLoadingAuth, setIsLoadingAuth] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const t = useTranslations("demo")
  const tError = useTranslations("errors")
  const tLogs = useTranslations("logs")
  const router = useRouter()
  const { toast } = useToast()

  const aspectRatios = getAspectRatios(useTranslations())

  // 检查用户登录状态
  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      // 直接调用API检查认证状态，不预先检查cookie
      // 因为NextAuth的cookie名称可能是动态的
      const response = await fetch('/api/auth/me', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })
      
      if (response.ok) {
        const userData = await response.json()
        setUser(userData.user)
      } else {
        setUser(null)
      }
    } catch (error) {
      setUser(null)
    } finally {
      setIsLoadingAuth(false)
    }
  }

  const handleLoginRequired = (action: string) => {
    toast({
      title: t("loginRequired"),
      description: t("loginRequiredDesc"),
      variant: "destructive"
    })
    router.push(`/${locale}/auth/login`)
  }

  const presetKeywords = [
    { key: "retro", label: t("presetKeywords.retro"), prompt: t("presetPrompts.retro") },
    { key: "cyberpunk", label: t("presetKeywords.cyberpunk"), prompt: t("presetPrompts.cyberpunk") },
    { key: "anime", label: t("presetKeywords.anime"), prompt: t("presetPrompts.anime") },
    { key: "removeBackground", label: t("presetKeywords.removeBackground"), prompt: t("presetPrompts.removeBackground") },
    { key: "colorizeOldPhoto", label: t("presetKeywords.colorizeOldPhoto"), prompt: t("presetPrompts.colorizeOldPhoto") },
  ]

  const handleKeywordClick = (prompt: string) => {
    setPrompt(prompt)
  }

  // 处理上传区域点击
  const handleUploadClick = () => {
    // 检查用户是否已登录
    if (!user) {
      handleLoginRequired("upload")
      return
    }
    
    // 如果已登录，触发文件选择
    fileInputRef.current?.click()
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // 检查文件大小 (限制为5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError(tError("fileTooLarge"))
        return
      }

      // 检查文件类型
      if (!SUPPORTED_FORMATS.includes(file.type)) {
        setError(tError("unsupportedFormat"))
        return
      }

      setError(null)
      setUploadedFile(file)
      
      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleProcess = async () => {
    // 检查用户是否已登录
    if (!user) {
      handleLoginRequired("generate")
      return
    }

    if (!prompt.trim() || !uploadedFile) {
      setError(tError("uploadAndPrompt"))
      return
    }

    setIsProcessing(true)
    setError(null)
    setGeneratedImage(null)

    try {
      const formData = new FormData()
      formData.append('image', uploadedFile)
      formData.append('prompt', prompt)
      formData.append('locale', locale)
      
      // 添加纵横比参数（如果选择了且不是原图比例）
      if (aspectRatio && aspectRatio !== 'original') {
        formData.append('aspect_ratio', aspectRatio)
      }
      
      // 检查是否是背景移除操作
      const isRemoveBackground = prompt.toLowerCase().includes('remove background') || 
                                prompt.toLowerCase().includes('移除背景')
      
      if (isRemoveBackground) {
        formData.append('action', 'remove_background')
      } else {
        formData.append('action', 'smart')
      }

      console.log('发送请求到 API...')
      
      const response = await fetch('/api/edit-image', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      })

      console.log('收到响应，状态:', response.status)
      
      const result: ApiResponse = await response.json()
      console.log('API 响应数据:', result)

      if (!response.ok) {
        throw new Error(result.error || `HTTP错误: ${response.status}`)
      }

      if (!result.success) {
        throw new Error(result.error || '处理失败')
      }

      // 检查响应数据结构
      if (!result.data) {
        throw new Error(tError('invalidData'))
      }

      if (!result.data.images || !Array.isArray(result.data.images)) {
        throw new Error(tError('noImages'))
      }

      if (result.data.images.length === 0) {
        throw new Error(tError('noGeneratedImages'))
      }

      const firstImage = result.data.images[0]
      if (!firstImage || !firstImage.url) {
        throw new Error(tError('invalidImageUrl'))
      }

      console.log(tLogs('successImageUrl'), firstImage.url)
      setGeneratedImage(firstImage.url)

      // 更新用户积分（如果响应中包含积分信息）
      if (result.credits && result.credits.deducted && result.credits.remaining !== undefined) {
        // 重新获取用户信息以确保积分数据正确
        checkAuthStatus();
        
        // 显示积分扣除提示
        toast({
          title: t("generateSuccess"),
          description: `${t("creditsDeducted")} ${result.credits.deducted} 积分，${t("creditsRemaining")} ${result.credits.remaining} 积分`,
          variant: "default"
        })
      }

    } catch (error) {
      console.error(tError('processingError'), error)
      
      // 提供更详细的错误信息
      let errorMessage = tError('processingFailed')
      
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch')) {
          errorMessage = tError('networkFailed')
        } else if (error.message.includes('HTTP错误: 500')) {
          errorMessage = tError('serverError')
        } else if (error.message.includes('HTTP错误: 401')) {
          errorMessage = tError('invalidApiKey')
        } else if (error.message.includes('HTTP错误: 429')) {
          errorMessage = tError('rateLimited')
        } else {
          errorMessage = error.message
        }
      }
      
      setError(errorMessage)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownload = async () => {
    if (!generatedImage) return

    try {
      const response = await fetch(generatedImage)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      
      const link = document.createElement('a')
      link.href = url
      link.download = `aiartools-generated-${Date.now()}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      window.URL.revokeObjectURL(url)

      // 显示成功消息
      setShowDownloadSuccess(true)
      setTimeout(() => {
        setShowDownloadSuccess(false)
      }, 3000)
    } catch (error) {
      console.error('Download error:', error)
      setError(tError('downloadFailed'))
    }
  }

  return (
    <section id="demo" className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("title")}</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">{t("subtitle")}</p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Side - Controls */}
            <div className="space-y-8">
              {/* 用户积分显示 */}
              {user && (
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold mb-1">{t("creditBalance")}</h3>
                        <p className="text-sm text-muted-foreground">{t("creditCost")}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">
                          {(user.credits || 0) + (user.subscriptionCredits || 0)}
                        </div>
                        <div className="text-sm text-muted-foreground">{t("availableCredits")}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Image Upload */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">{t("uploadImage")}</h3>
                  <div 
                    onClick={handleUploadClick}
                    className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer min-h-[200px] flex items-center justify-center"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp,.avif"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    
                    {uploadedImage ? (
                      // 显示已上传的图片
                      <div className="relative w-full h-full flex items-center justify-center">
                        <Image
                          src={uploadedImage}
                          alt="Uploaded image"
                          width={0}
                          height={0}
                          sizes="100vw"
                          className="rounded-lg w-auto h-auto max-w-full max-h-[300px] object-contain"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all duration-200 rounded-lg flex items-center justify-center">
                          <p className="text-white text-sm opacity-0 hover:opacity-100 transition-opacity bg-black bg-opacity-75 px-3 py-1 rounded">
                            {t("clickToChangeImage") || "点击更换图片"}
                          </p>
                        </div>
                      </div>
                    ) : (
                      // 显示上传提示
                      <div>
                        <UploadIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">{t("dragDropOrClick")}</p>
                        <p className="text-sm text-muted-foreground/75 mt-2">{t("fileFormatsSupported")}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Prompt Input */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">{t("describeChange")}</h3>
                  <Input
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={t("promptPlaceholder")}
                    className="mb-4"
                  />

                  {/* Quick Keywords */}
                  <div className="mb-4">
                    <p className="text-sm text-muted-foreground mb-2">{t("quickKeywords")}</p>
                    <div className="flex flex-wrap gap-2">
                      {presetKeywords.map((keyword) => (
                        <Badge
                          key={keyword.key}
                          variant="secondary"
                          className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                          onClick={() => handleKeywordClick(keyword.prompt)}
                        >
                          {keyword.label}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Aspect Ratio Selection */}
                  <div className="mb-6">
                    <label className="text-sm font-medium mb-2 block">{t("aspectRatioLabel")}</label>
                    <Select value={aspectRatio} onValueChange={setAspectRatio}>
                      <SelectTrigger>
                        <SelectValue placeholder={t("aspectRatioPlaceholder")} />
                      </SelectTrigger>
                      <SelectContent>
                        {aspectRatios.map((ratio) => (
                          <SelectItem key={ratio.value} value={ratio.value}>
                            {ratio.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                      <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                    </div>
                  )}

                  {/* Generate Button */}
                  <Button
                    onClick={handleProcess}
                    disabled={isProcessing || !uploadedFile || !prompt.trim()}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    size="lg"
                  >
                    {isProcessing ? (
                      <>
                        <LoaderIcon className="w-5 h-5 mr-2 animate-spin" />
                        {t("processing")}
                      </>
                    ) : (
                      <>
                        <SparklesIcon className="w-5 h-5 mr-2" />
                        {t("generateImage")}
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Right Side - Result */}
            <div>
              <Card className="h-full">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">{t("result")}</h3>
                  <div className="aspect-square bg-muted rounded-lg flex items-center justify-center relative overflow-hidden mb-4">
                    {isProcessing ? (
                      <div className="text-center">
                        <LoaderIcon className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
                        <p className="text-muted-foreground">{t("processingImage")}</p>
                        <p className="text-sm text-muted-foreground mt-2">{t("processingTime")}</p>
                      </div>
                    ) : generatedImage ? (
                      <Image
                        src={generatedImage}
                        alt="Generated result"
                        width={400}
                        height={400}
                        className="rounded-lg object-cover w-full h-full"
                      />
                    ) : (
                      <div className="text-center">
                        <Image
                          src="/placeholder.svg?height=400&width=400"
                          alt="Generated result"
                          width={400}
                          height={400}
                          className="rounded-lg"
                        />
                        <p className="text-sm text-muted-foreground mt-4">{t("resultWillAppear")}</p>
                      </div>
                    )}
                  </div>

                  {/* Download Button and Reminder */}
                  {generatedImage && !isProcessing && (
                    <div className="space-y-3">
                      <Button
                        onClick={handleDownload}
                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                        size="lg"
                      >
                        <DownloadIcon className="w-5 h-5 mr-2" />
                        {t("downloadImage")}
                      </Button>
                      
                      <div className="flex items-start space-x-2 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                        <AlertTriangleIcon className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-amber-800 dark:text-amber-200">
                          {t("downloadReminder")}
                        </p>
                      </div>

                      {showDownloadSuccess && (
                        <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                          <p className="text-sm text-green-800 dark:text-green-200 text-center">
                            ✅ {t("downloadSuccess")}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 
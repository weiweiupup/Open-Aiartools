"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UploadIcon, SparklesIcon, LoaderIcon, DownloadIcon, AlertTriangleIcon, X, ImageIcon } from "lucide-react"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "./providers"

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

// 多图编辑API响应类型
interface MultiImageApiResponse {
  success: boolean;
  data?: {
    images?: Array<{
      url: string;
      width?: number;
      height?: number;
    }>;
    model_used?: string;
    input_count?: number;
    output_count?: number;
    message?: string;
  };
  credits?: {
    remaining: number;
    used: number;
  };
  error?: string;
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

const MAX_FILES = 10
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

export default function InteractiveDemo({ locale }: InteractiveDemoProps) {
  const [editMode, setEditMode] = useState<'single' | 'multi'>('single')
  const [prompt, setPrompt] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [fileUrls, setFileUrls] = useState<Map<File, string>>(new Map()) // 缓存文件URL
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [generatedImages, setGeneratedImages] = useState<string[]>([])
  const [showDownloadSuccess, setShowDownloadSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [aspectRatio, setAspectRatio] = useState<string>('original')
  const { user, isLoading, refreshUser } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const multiFileInputRef = useRef<HTMLInputElement>(null)
  const t = useTranslations("demo")
  const tError = useTranslations("errors")
  const tLogs = useTranslations("logs")
  const router = useRouter()
  const { toast } = useToast()

  const aspectRatios = getAspectRatios(useTranslations())

  // 清理文件URL的函数
  const cleanupFileUrls = (filesToCleanup: File[]) => {
    setFileUrls(prevUrls => {
      const newUrls = new Map(prevUrls)
      filesToCleanup.forEach(file => {
        const url = newUrls.get(file)
        if (url) {
          URL.revokeObjectURL(url)
          newUrls.delete(file)
        }
      })
      return newUrls
    })
  }

  // 获取或创建文件URL
  const getFileUrl = (file: File): string => {
    if (fileUrls.has(file)) {
      return fileUrls.get(file)!
    }
    const url = URL.createObjectURL(file)
    setFileUrls(prev => new Map(prev).set(file, url))
    return url
  }

  // 组件卸载时清理所有URL
  useEffect(() => {
    return () => {
      fileUrls.forEach(url => URL.revokeObjectURL(url))
    }
  }, [fileUrls])

  // 检查用户积分（只在需要时调用）
  const checkUserCredits = async (): Promise<boolean> => {
    if (isLoading) {
      setError(tError('checkingAuth'))
      return false
    }

    if (!user) {
      setError(tError('loginRequired'))
      return false
    }

    const totalCredits = (user.credits || 0) + (user.subscriptionCredits || 0)
    if (totalCredits <= 0) {
      setError(tError('insufficientCredits'))
      return false
    }

    return true
  }

  const handleLoginRequired = (action: string) => {
    toast({
      title: tError("loginRequired"),
      description: tError("loginRequiredDesc"),
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

  // 处理单图上传区域点击
  const handleUploadClick = () => {
    // 检查用户是否已登录
    if (!user) {
      handleLoginRequired("upload")
      return
    }
    
    // 如果已登录，触发文件选择
    fileInputRef.current?.click()
  }

  // 处理多图上传区域点击
  const handleMultiUploadClick = () => {
    // 检查用户是否已登录
    if (!user) {
      handleLoginRequired("upload")
      return
    }
    
    // 如果已登录，触发文件选择
    multiFileInputRef.current?.click()
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // 检查文件大小 (限制为5MB)
      if (file.size > MAX_FILE_SIZE) {
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

  const handleMultiImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    
    if (files.length === 0) return

    // 检查文件数量
    if (uploadedFiles.length + files.length > MAX_FILES) {
      setError(t("maxFilesError", { max: MAX_FILES }))
      return
    }

    // 检查每个文件
    const validFiles: File[] = []
    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) {
        toast({
          title: t("fileTooLargeError"),
          description: t("fileSizeExceeded", { filename: file.name }),
          variant: "destructive",
        })
        continue
      }

      if (!SUPPORTED_FORMATS.includes(file.type)) {
        toast({
          title: t("formatNotSupported"),
          description: t("fileFormatNotSupported", { filename: file.name }),
          variant: "destructive",
        })
        continue
      }

      validFiles.push(file)
    }

    if (validFiles.length > 0) {
      setError(null)
      setUploadedFiles(prev => [...prev, ...validFiles])
    }
  }

  // 移除多图中的某张图片
  const removeMultiImage = (index: number) => {
    const fileToRemove = uploadedFiles[index]
    if (fileToRemove) {
      cleanupFileUrls([fileToRemove])
    }
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }

  // 清空多图
  const clearMultiImages = () => {
    cleanupFileUrls(uploadedFiles)
    setUploadedFiles([])
    setGeneratedImages([])
  }

  const handleProcess = async () => {
    // 检查用户是否已登录
    if (!user) {
      handleLoginRequired("generate")
      return
    }

    if (!prompt.trim()) {
      setError(tError("uploadAndPrompt"))
      return
    }

    // 根据编辑模式检查文件
    if (editMode === 'single' && !uploadedFile) {
      setError(t("uploadSingleImage"))
      return
    }

    if (editMode === 'multi' && uploadedFiles.length === 0) {
      setError(t("uploadAtLeastOneImage"))
      return
    }

    // 检查用户积分
    const hasCredits = await checkUserCredits()
    if (!hasCredits) {
      return
    }

    setIsProcessing(true)
    setError(null)
    
    if (editMode === 'single') {
      setGeneratedImage(null)
    } else {
      setGeneratedImages([])
    }

    try {
      // 静默翻译提示词为英文（用户不会感知到这个过程）
      let translatedPrompt = prompt.trim();
      
      try {
        const translateResponse = await fetch('/api/translate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: prompt.trim(),
            targetLanguage: 'en'
          })
        });

        if (translateResponse.ok) {
          const translateResult = await translateResponse.json();
          if (translateResult.success && translateResult.translatedText) {
            translatedPrompt = translateResult.translatedText;
            // 只在控制台记录翻译信息，用户不会看到
            console.log('原始提示词:', prompt.trim());
            console.log('翻译后提示词:', translatedPrompt);
          }
        } else {
          console.warn('翻译失败，使用原始提示词');
        }
      } catch (translateError) {
        console.warn('翻译服务错误，使用原始提示词:', translateError);
      }

      if (editMode === 'single') {
        // 单图处理逻辑
        const formData = new FormData()
        formData.append('image', uploadedFile!)
        formData.append('prompt', translatedPrompt)
        formData.append('locale', locale)
        
        // 添加纵横比参数（如果选择了且不是原图比例）
        if (aspectRatio && aspectRatio !== 'original') {
          formData.append('aspect_ratio', aspectRatio)
        }
        
        // 检查是否是背景移除操作
        const isRemoveBackground = translatedPrompt.toLowerCase().includes('remove background') || 
                                  translatedPrompt.toLowerCase().includes('移除背景')
        
        if (isRemoveBackground) {
          formData.append('action', 'remove_background')
        } else {
          formData.append('action', 'smart')
        }

        console.log(tLogs('sendingRequest'))
        
        const response = await fetch('/api/edit-image', {
          method: 'POST',
          body: formData,
          credentials: 'include',
        })

        console.log(tLogs('receivedResponse'), response.status)
        
        const result: ApiResponse = await response.json()
        console.log(tLogs('apiResponseData'), result)

        if (!response.ok) {
          throw new Error(result.error || `HTTP错误: ${response.status}`)
        }

        if (!result.success) {
          throw new Error(result.error || t("processingFailed"))
        }

        // 检查响应数据结构
        if (!result.data) {
          throw new Error(t("invalidResponseData"))
        }

        if (!result.data.images || !Array.isArray(result.data.images)) {
          throw new Error(t("noImageDataInResponse"))
        }

        if (result.data.images.length === 0) {
          throw new Error(t("noImagesGenerated"))
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
          await refreshUser();
          
          // 显示积分扣除提示
          toast({
            title: t("generateSuccess"),
            description: `${t("creditsDeducted")} ${result.credits.deducted} 积分，${t("creditsRemaining")} ${result.credits.remaining} 积分`,
            variant: "default"
          })
        }
      } else {
        // 多图处理逻辑
        const formData = new FormData()
        
        // 添加所有图片文件
        uploadedFiles.forEach(file => {
          formData.append('images', file)
        })
        
        formData.append('prompt', translatedPrompt)
        formData.append('locale', locale)
        
        // 添加纵横比参数（如果选择了且不是原图比例）
        if (aspectRatio && aspectRatio !== 'original') {
          formData.append('aspect_ratio', aspectRatio)
        }

        console.log(tLogs('sendingRequest'))
        
        const response = await fetch('/api/edit-multi-images', {
          method: 'POST',
          body: formData,
          credentials: 'include',
        })

        console.log(tLogs('receivedResponse'), response.status)
        
        const result: MultiImageApiResponse = await response.json()
        console.log(tLogs('apiResponseData'), result)

        if (!response.ok) {
          throw new Error(result.error || `HTTP错误: ${response.status}`)
        }

        if (!result.success) {
          throw new Error(result.error || t("processingFailed"))
        }

        // 检查响应数据结构
        if (!result.data) {
          throw new Error(t("invalidResponseData"))
        }

        if (!result.data.images || !Array.isArray(result.data.images)) {
          throw new Error(t("noImageDataInResponse"))
        }

        if (result.data.images.length === 0) {
          throw new Error(t("noImagesGenerated"))
        }

        const imageUrls = result.data.images.map(img => img.url).filter(Boolean)
        console.log('生成的图片URLs:', imageUrls)
        setGeneratedImages(imageUrls)

        // 更新用户积分（如果响应中包含积分信息）
        if (result.credits && result.credits.used && result.credits.remaining !== undefined) {
          // 重新获取用户信息以确保积分数据正确
          await refreshUser();
          
          // 显示积分扣除提示
          toast({
            title: t("editSuccess"),
            description: t("creditsUsed", { used: result.credits.used, remaining: result.credits.remaining }),
            variant: "default"
          })
        }
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

  // 下载多图中的单张图片
  const downloadMultiImage = async (imageUrl: string, index: number) => {
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      
      const link = document.createElement('a')
      link.href = url
      link.download = `aiartools-multi-${index + 1}-${Date.now()}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      window.URL.revokeObjectURL(url)

      toast({
        title: t("downloadSuccess"),
        description: t("downloadImageSuccess", { index: index + 1 }),
      })
    } catch (error) {
      toast({
        title: t("downloadFailed"),
        description: t("downloadRetryLater"),
        variant: "destructive",
      })
    }
  }

  // 批量下载所有多图
  const downloadAllMultiImages = async () => {
    for (let i = 0; i < generatedImages.length; i++) {
      await downloadMultiImage(generatedImages[i], i)
      // 添加延迟避免浏览器阻止多个下载
      await new Promise(resolve => setTimeout(resolve, 500))
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
          {/* 编辑模式切换 */}
          <div className="mb-8">
            <Tabs value={editMode} onValueChange={(value) => setEditMode(value as 'single' | 'multi')} className="w-full">
              <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
                <TabsTrigger value="single" className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  {t("singleImageEdit")}
                </TabsTrigger>
                <TabsTrigger value="multi" className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  {t("multiImageEdit")}
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

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
                        <p className="text-sm text-muted-foreground">
                          {editMode === 'single' ? t("creditCost") : t("multiImageCreditCost")}
                        </p>
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
                  <h3 className="text-lg font-semibold mb-4">
                    {editMode === 'single' ? t("uploadImage") : t("maxImagesNote", { count: MAX_FILES })}
                  </h3>
                  
                  {editMode === 'single' ? (
                    // 单图上传
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
                  ) : (
                    // 多图上传
                    <div className="space-y-4">
                      <div 
                        onClick={handleMultiUploadClick}
                        className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer min-h-[150px] flex items-center justify-center"
                      >
                        <input
                          ref={multiFileInputRef}
                          type="file"
                          accept=".jpg,.jpeg,.png,.webp,.avif"
                          onChange={handleMultiImageUpload}
                          className="hidden"
                          multiple
                          id="multi-image-upload"
                        />
                        
                        <div>
                          <UploadIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                          <p className="text-muted-foreground">{t("dragDropMultiImages")}</p>
                          <p className="text-sm text-muted-foreground/75 mt-2">{t("multiImageFormatsSupported")}</p>
                        </div>
                      </div>

                      {/* 已上传文件列表 */}
                      {uploadedFiles.length > 0 && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{t("uploadedImagesCount", { count: uploadedFiles.length })}</span>
                            <Button variant="outline" size="sm" onClick={clearMultiImages}>
                              {t("clearAllImages")}
                            </Button>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {uploadedFiles.map((file, index) => (
                              <div key={`${file.name}-${file.size}-${file.lastModified}`} className="relative group">
                                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                                  <Image
                                    src={getFileUrl(file)}
                                    alt={`Upload ${index + 1}`}
                                    width={150}
                                    height={150}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={() => removeMultiImage(index)}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                                <p className="text-xs text-center mt-1 truncate">
                                  {file.name}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Prompt Input */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">{t("describeChange")}</h3>
                  <Input
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={editMode === 'single' ? t("promptPlaceholder") : t("multiImagePromptPlaceholder")}
                    className="mb-4"
                  />

                  {/* Quick Keywords - 只在单图编辑模式下显示 */}
                  {editMode === 'single' && (
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
                  )}

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
                    disabled={isProcessing || 
                      (editMode === 'single' && (!uploadedFile || !prompt.trim())) ||
                      (editMode === 'multi' && (uploadedFiles.length === 0 || !prompt.trim()))
                    }
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
                        {editMode === 'single' ? t("generateImage") : t("generateImage")}
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
                  
                  {editMode === 'single' ? (
                    // 单图结果显示
                    <>
                      {isProcessing ? (
                        <div className="text-center py-12">
                          <LoaderIcon className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
                          <p className="text-muted-foreground">{t("processingImage")}</p>
                          <p className="text-sm text-muted-foreground mt-2">{t("processingTime")}</p>
                        </div>
                      ) : generatedImage ? (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="text-md font-semibold">{t("editResult")}</h4>
                          </div>
                          
                          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                            <Image
                              src={generatedImage}
                              alt={t("editResult")}
                              width={400}
                              height={400}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <Button
                            onClick={handleDownload}
                            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                            size="lg"
                          >
                            <DownloadIcon className="w-4 h-4 mr-2" />
                            {t("downloadEditResult")}
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
                      ) : (
                        <div className="text-center py-12">
                          <ImageIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                          <p className="text-muted-foreground">{t("resultWillAppearHere")}</p>
                          <p className="text-sm text-muted-foreground mt-2">{t("uploadAndDescribe")}</p>
                        </div>
                      )}
                    </>
                  ) : (
                    // 多图结果显示
                    <>
                      {isProcessing ? (
                        <div className="text-center py-12">
                          <LoaderIcon className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
                          <p className="text-muted-foreground">{t("processingMultiImages", { count: uploadedFiles.length })}</p>
                          <p className="text-sm text-muted-foreground mt-2">{t("processingTime")}</p>
                        </div>
                      ) : generatedImages.length > 0 ? (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="text-md font-semibold">{t("editResult")}</h4>
                          </div>
                          
                          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                            <Image
                              src={generatedImages[0]}
                              alt={t("editResult")}
                              width={400}
                              height={400}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <Button
                            onClick={() => downloadMultiImage(generatedImages[0], 0)}
                            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                            size="lg"
                          >
                            <DownloadIcon className="w-4 h-4 mr-2" />
                            {t("downloadEditResult")}
                          </Button>
                          
                          <div className="flex items-start space-x-2 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                            <AlertTriangleIcon className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-amber-800 dark:text-amber-200">
                              {t("downloadReminder")}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <ImageIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                          <p className="text-muted-foreground">{t("resultWillAppearHere")}</p>
                          <p className="text-sm text-muted-foreground mt-2">{t("uploadMultiAndDescribe")}</p>
                        </div>
                      )}
                    </>
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
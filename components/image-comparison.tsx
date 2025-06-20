"use client"

import type React from "react"

import { useState, useRef, useCallback, useEffect } from "react"
import Image from "next/image"
import { useTranslations } from "next-intl"

interface ImageComparisonProps {
  locale?: string
}

export default function ImageComparison({ locale }: ImageComparisonProps) {
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const animationFrameRef = useRef<number | null>(null)
  const t = useTranslations("demo")

  const handleMouseDown = useCallback(() => {
    setIsDragging(true)
  }, [])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const updateSliderPosition = useCallback((clientX: number) => {
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100))
    
    // 使用 requestAnimationFrame 来优化性能
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }
    
    animationFrameRef.current = requestAnimationFrame(() => {
      setSliderPosition(percentage)
    })
  }, [])

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return
      e.preventDefault()
      updateSliderPosition(e.clientX)
    },
    [isDragging, updateSliderPosition],
  )

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isDragging) return
      e.preventDefault()
      updateSliderPosition(e.touches[0].clientX)
    },
    [isDragging, updateSliderPosition],
  )

  // 清理动画帧
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  // 图片加载完成后设置状态
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div
        ref={containerRef}
        className={`relative aspect-[4/3] overflow-hidden rounded-2xl shadow-2xl cursor-col-resize transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
        style={{ willChange: 'transform' }}
      >
        {/* Before Image */}
        <div className="absolute inset-0" style={{ transform: 'translateZ(0)' }}>
          <Image
            src="/Original.jpg"
            alt="Original cityscape during daytime"
            fill
            className="object-cover"
            priority
            onLoad={() => setIsLoaded(true)}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
            Original
          </div>
        </div>

        {/* After Image */}
        <div 
          className="absolute inset-0 overflow-hidden" 
          style={{ 
            clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
            transform: 'translateZ(0)',
            willChange: 'clip-path'
          }}
        >
          <Image
            src="/AI Enhanced.jpg"
            alt="AI-transformed cyberpunk cityscape at night"
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
            AI Enhanced
          </div>
        </div>

        {/* Slider */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-col-resize transition-all duration-75 ease-out"
          style={{ 
            left: `${sliderPosition}%`,
            transform: 'translateZ(0)',
            willChange: 'left'
          }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleMouseDown}
        >
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center transition-transform duration-150 hover:scale-110">
            <div className="w-1 h-4 bg-gray-400 rounded-full mx-0.5"></div>
            <div className="w-1 h-4 bg-gray-400 rounded-full mx-0.5"></div>
          </div>
        </div>

        {/* Loading overlay */}
        {!isLoaded && (
          <div className="absolute inset-0 bg-gray-100 animate-pulse rounded-2xl flex items-center justify-center">
            <div className="text-gray-400">Loading...</div>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="text-center mt-4 text-sm text-muted-foreground transition-opacity duration-300">
        {t("sliderInstruction")}
      </div>
    </div>
  )
}

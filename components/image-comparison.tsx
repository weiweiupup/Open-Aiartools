"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import Image from "next/image"
import { useTranslations } from "next-intl"

interface ImageComparisonProps {
  locale?: string
}

export default function ImageComparison({ locale }: ImageComparisonProps) {
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const t = useTranslations("demo")

  const handleMouseDown = useCallback(() => {
    setIsDragging(true)
  }, [])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging || !containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const percentage = (x / rect.width) * 100
      setSliderPosition(Math.max(0, Math.min(100, percentage)))
    },
    [isDragging],
  )

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isDragging || !containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      const x = e.touches[0].clientX - rect.left
      const percentage = (x / rect.width) * 100
      setSliderPosition(Math.max(0, Math.min(100, percentage)))
    },
    [isDragging],
  )

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div
        ref={containerRef}
        className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-2xl cursor-col-resize"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
      >
        {/* Before Image */}
        <div className="absolute inset-0">
          <Image
            src="/Original.jpg"
            alt="Original cityscape during daytime"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
            Original
          </div>
        </div>

        {/* After Image */}
        <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}>
          <Image
            src="/AI Enhanced.jpg"
            alt="AI-transformed cyberpunk cityscape at night"
            fill
            className="object-cover"
          />
          <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
            AI Enhanced
          </div>
        </div>

        {/* Slider */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-col-resize"
          style={{ left: `${sliderPosition}%` }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleMouseDown}
        >
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
            <div className="w-1 h-4 bg-gray-400 rounded-full mx-0.5"></div>
            <div className="w-1 h-4 bg-gray-400 rounded-full mx-0.5"></div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="text-center mt-4 text-sm text-muted-foreground">{t("sliderInstruction")}</div>
    </div>
  )
}

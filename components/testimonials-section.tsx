"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeftIcon, ChevronRightIcon, StarIcon } from "lucide-react"
import Image from "next/image"
import { useTranslations } from "next-intl"

interface TestimonialsSectionProps {
  locale: string
}

export default function TestimonialsSection({ locale }: TestimonialsSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const t = useTranslations("testimonials")

  const testimonials = [
    {
      name: "Alex Doe",
      role: t("testimonial1.role"),
      content: t("testimonial1.content"),
      avatar: "/images/Alex Doe.jpeg",
      rating: 5,
    },
    {
      name: "Li Jing",
      role: t("testimonial2.role"),
      content: t("testimonial2.content"),
      avatar: "/images/lijing.jpg",
      rating: 5,
    },
    {
      name: "Sarah Johnson",
      role: t("testimonial3.role"),
      content: t("testimonial3.content"),
      avatar: "/images/Sarah Johnson.jpg",
      rating: 5,
    },
  ]

  const changeTestimonial = (newIndex: number) => {
    if (isTransitioning || newIndex === currentIndex) return
    
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentIndex(newIndex)
      setTimeout(() => {
        setIsTransitioning(false)
      }, 50)
    }, 150)
  }

  const nextTestimonial = () => {
    const newIndex = (currentIndex + 1) % testimonials.length
    changeTestimonial(newIndex)
  }

  const prevTestimonial = () => {
    const newIndex = (currentIndex - 1 + testimonials.length) % testimonials.length
    changeTestimonial(newIndex)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isTransitioning) {
        nextTestimonial()
      }
    }, 5000)
    return () => clearInterval(interval)
  }, [currentIndex, isTransitioning])

  return (
    <section className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("title")}</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">{t("subtitle")}</p>
        </div>

        <div className="max-w-4xl mx-auto relative">
          <Card className="bg-background/60 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-8 md:p-12">
              <div 
                className={`text-center transition-all duration-300 ease-in-out ${
                  isTransitioning ? 'opacity-0 transform translate-y-2' : 'opacity-100 transform translate-y-0'
                }`}
              >
                {/* Stars */}
                <div className="flex justify-center mb-6">
                  {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                    <StarIcon key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                  ))}
                </div>

                {/* Content */}
                <blockquote className="text-xl md:text-2xl font-medium text-foreground mb-8 leading-relaxed">
                  "{testimonials[currentIndex].content}"
                </blockquote>

                {/* Author */}
                <div className="flex items-center justify-center space-x-4">
                  <Image
                    src={testimonials[currentIndex].avatar || "/placeholder.svg"}
                    alt={testimonials[currentIndex].name}
                    width={60}
                    height={60}
                    className="rounded-full object-cover w-[60px] h-[60px] border-2 border-white shadow-lg"
                    priority={currentIndex === 0}
                  />
                  <div className="text-left">
                    <div className="font-semibold text-lg">{testimonials[currentIndex].name}</div>
                    <div className="text-muted-foreground">{testimonials[currentIndex].role}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-center items-center mt-8 space-x-4">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={prevTestimonial} 
              className="rounded-full transition-all duration-200 hover:scale-105"
              disabled={isTransitioning}
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </Button>

            {/* Dots */}
            <div className="flex space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => changeTestimonial(index)}
                  disabled={isTransitioning}
                  className={`w-3 h-3 rounded-full transition-all duration-300 hover:scale-110 ${
                    index === currentIndex ? "bg-primary" : "bg-muted-foreground/30"
                  }`}
                />
              ))}
            </div>

            <Button 
              variant="outline" 
              size="icon" 
              onClick={nextTestimonial} 
              className="rounded-full transition-all duration-200 hover:scale-105"
              disabled={isTransitioning}
            >
              <ChevronRightIcon className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

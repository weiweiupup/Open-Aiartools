"use client"

import { Button } from "@/components/ui/button"

interface CopyButtonProps {
  text: string
  children: React.ReactNode
}

export default function CopyButton({ text, children }: CopyButtonProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(text)
  }

  return (
    <Button variant="outline" size="sm" onClick={handleCopy}>
      {children}
    </Button>
  )
} 
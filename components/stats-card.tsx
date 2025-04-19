"use client"

import { useEffect, useState, useRef } from "react"
import type { ReactNode } from "react"

interface StatsCardProps {
  icon: ReactNode
  title: string
  value: string
  description: string
}

export function StatsCard({ icon, title, value, description }: StatsCardProps) {
  const [animatedValue, setAnimatedValue] = useState("0")
  const targetValue = Number.parseInt(value.replace(/,/g, ""), 10)
  const cardRef = useRef<HTMLDivElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          animateValue()
        }
      },
      { threshold: 0.1 },
    )

    if (cardRef.current) {
      observer.observe(cardRef.current)
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current)
      }
    }
  }, [])

  const animateValue = () => {
    const duration = 2000 // animation duration in ms
    const steps = 60 // number of steps in the animation
    const stepTime = duration / steps
    let currentStep = 0

    const timer = setInterval(() => {
      currentStep++
      const progress = currentStep / steps
      // Easing function for smoother animation
      const easeOutQuad = 1 - (1 - progress) * (1 - progress)
      const currentValue = Math.floor(easeOutQuad * targetValue)

      // Format the number with commas
      setAnimatedValue(currentValue.toLocaleString())

      if (currentStep === steps) {
        clearInterval(timer)
        // Ensure we end with the exact target value
        setAnimatedValue(value)
      }
    }, stepTime)
  }

  return (
    <div ref={cardRef} className="rounded-xl bg-gray-800/50 p-6 backdrop-blur-sm transition-all hover:bg-gray-800/70">
      <div className="flex items-center gap-4">
        <div className="rounded-full bg-purple-900/30 p-3">{icon}</div>
        <div>
          <h3 className="text-lg font-medium text-white">{title}</h3>
          <p className="text-sm text-gray-400">{description}</p>
        </div>
      </div>
      <div className="mt-4 text-3xl font-bold text-white">{animatedValue}</div>
    </div>
  )
}

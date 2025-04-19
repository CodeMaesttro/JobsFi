"use client"

import { Button } from "@/components/ui/button"
import { useSubscription } from "@/contexts/subscription-context"
import { Clock, Sparkles } from "lucide-react"
import Link from "next/link"

interface EarlyAccessBannerProps {
  jobId?: number
  isEarlyAccess?: boolean
  releaseDate?: string
}

export function EarlyAccessBanner({ jobId, isEarlyAccess, releaseDate }: EarlyAccessBannerProps) {
  const { isSubscribed } = useSubscription()

  if (!isEarlyAccess) return null

  // If user is subscribed, show them the early access content
  if (isSubscribed) {
    return (
      <div className="mb-6 rounded-lg bg-gradient-to-r from-purple-900/30 to-blue-900/30 p-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-yellow-400" />
          <h3 className="font-medium text-white">Early Access</h3>
        </div>
        <p className="mt-1 text-sm text-gray-300">
          You're viewing this job posting before it's publicly available. It will be released to everyone on{" "}
          {releaseDate ? new Date(releaseDate).toLocaleDateString() : "soon"}.
        </p>
      </div>
    )
  }

  // If user is not subscribed, show them a subscription prompt
  return (
    <div className="mb-6 rounded-lg bg-gradient-to-r from-purple-900/30 to-blue-900/30 p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-purple-400" />
            <h3 className="font-medium text-white">Get Early Access to Jobs</h3>
          </div>
          <p className="mt-1 text-sm text-gray-300">
            Subscribe to get early access to job postings before they're publicly available.
          </p>
        </div>
        <Link href="/subscribe">
          <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
            <Sparkles className="mr-2 h-4 w-4" />
            Subscribe Now
          </Button>
        </Link>
      </div>
    </div>
  )
}

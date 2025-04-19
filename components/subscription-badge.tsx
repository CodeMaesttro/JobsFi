"use client"

import { useSubscription } from "@/contexts/subscription-context"
import { Sparkles } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import Link from "next/link"

export function SubscriptionBadge() {
  const { subscription, isSubscribed } = useSubscription()

  if (!isSubscribed) return null

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link href="/subscribe" className="flex items-center">
            <div
              className={`
              flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium
              ${
                subscription?.tier === "unlimited"
                  ? "bg-gradient-to-r from-yellow-500/20 to-amber-500/20 text-yellow-300"
                  : subscription?.tier === "premium"
                    ? "bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-300"
                    : "bg-gray-700/50 text-gray-300"
              }
            `}
            >
              <Sparkles className="h-3 w-3" />
              <span>
                {subscription?.tier === "unlimited"
                  ? "Unlimited"
                  : subscription?.tier === "premium"
                    ? "Premium"
                    : "Subscriber"}
              </span>
            </div>
          </Link>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {subscription?.tier === "unlimited"
              ? "You have unlimited early access to all job postings"
              : subscription?.tier === "premium"
                ? "You have early access to 3 job categories"
                : "You have early access to 1 job category"}
          </p>
          <p className="text-xs text-gray-400">Expires: {new Date(subscription?.endDate || "").toLocaleDateString()}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

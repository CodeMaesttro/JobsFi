"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useWeb3 } from "@/hooks/use-web3"
import { useNotifications } from "@/contexts/notification-context"

// Define subscription tier type
export type SubscriptionTier = "basic" | "premium" | "unlimited"

// Define subscription type
export interface Subscription {
  walletAddress: string
  tier: SubscriptionTier
  categories: string[]
  startDate: string
  endDate: string
  transactionHash: string
  isActive: boolean
}

// Define pricing in ApeChain tokens
export const SUBSCRIPTION_PRICES = {
  basic: 5, // 5 APE tokens for 1 month, 1 category
  premium: 12, // 12 APE tokens for 3 months, 3 categories
  unlimited: 25, // 25 APE tokens for 6 months, all categories
}

// Define subscription context type
interface SubscriptionContextType {
  subscription: Subscription | null
  isSubscribed: boolean
  subscribedCategories: string[]
  subscribe: (tier: SubscriptionTier, categories: string[], paymentAmount: number) => Promise<void>
  cancelSubscription: () => Promise<void>
  isProcessing: boolean
  processingError: string | null
}

// Create context with default values
const SubscriptionContext = createContext<SubscriptionContextType>({
  subscription: null,
  isSubscribed: false,
  subscribedCategories: [],
  subscribe: async () => {},
  cancelSubscription: async () => {},
  isProcessing: false,
  processingError: null,
})

// Create provider component
export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const { isConnected, address } = useWeb3()
  const { addNotification } = useNotifications()
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingError, setProcessingError] = useState<string | null>(null)

  // Check if user has an active subscription
  const isSubscribed = Boolean(subscription?.isActive)

  // Get subscribed categories
  const subscribedCategories = subscription?.categories || []

  // Load subscription from localStorage on mount
  useEffect(() => {
    if (address) {
      try {
        const storedSubscription = localStorage.getItem(`jobsfi_subscription_${address}`)
        if (storedSubscription) {
          const parsedSubscription = JSON.parse(storedSubscription)

          // Check if subscription is still active
          const now = new Date()
          const endDate = new Date(parsedSubscription.endDate)

          if (now > endDate) {
            parsedSubscription.isActive = false
          }

          setSubscription(parsedSubscription)
        }
      } catch (error) {
        console.error("Error loading subscription:", error)
      }
    } else {
      // Clear subscription when wallet disconnects
      setSubscription(null)
    }
  }, [address])

  // Subscribe to job alerts
  const subscribe = async (tier: SubscriptionTier, categories: string[], paymentAmount: number) => {
    if (!isConnected || !address) {
      throw new Error("You must connect your wallet to subscribe")
    }

    try {
      setIsProcessing(true)
      setProcessingError(null)

      // Simulate blockchain transaction
      console.log(`Initiating payment of ${paymentAmount} APE tokens from ${address}`)

      // In a real implementation, we would call the ApeChain contract here
      // const contract = new ethers.Contract(apeChainAddress, apeChainABI, signer)
      // const tx = await contract.subscribe(tier, paymentAmount)
      // await tx.wait()

      // Simulate transaction delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Generate mock transaction hash
      const transactionHash =
        "0x" +
        Array(64)
          .fill(0)
          .map(() => Math.floor(Math.random() * 16).toString(16))
          .join("")

      // Calculate subscription duration based on tier
      let durationMonths = 1
      if (tier === "premium") durationMonths = 3
      if (tier === "unlimited") durationMonths = 6

      const startDate = new Date()
      const endDate = new Date()
      endDate.setMonth(endDate.getMonth() + durationMonths)

      // Create subscription object
      const newSubscription: Subscription = {
        walletAddress: address,
        tier,
        categories: tier === "unlimited" ? ["all"] : categories,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        transactionHash,
        isActive: true,
      }

      // Save subscription to localStorage
      localStorage.setItem(`jobsfi_subscription_${address}`, JSON.stringify(newSubscription))
      setSubscription(newSubscription)

      // Send notification
      addNotification({
        walletAddress: address,
        type: "system",
        title: "Subscription Activated",
        message: `Your ${tier} subscription has been activated! You'll now receive early alerts for new job postings.`,
        data: {
          tier,
          transactionHash,
        },
      })

      console.log(`Subscription successful: ${tier} tier for ${durationMonths} months`)
    } catch (error) {
      console.error("Error subscribing:", error)
      setProcessingError(error instanceof Error ? error.message : "Unknown error during subscription")
      throw error
    } finally {
      setIsProcessing(false)
    }
  }

  // Cancel subscription
  const cancelSubscription = async () => {
    if (!address || !subscription) {
      throw new Error("No active subscription to cancel")
    }

    try {
      setIsProcessing(true)
      setProcessingError(null)

      // In a real implementation, we would call the ApeChain contract here
      // const contract = new ethers.Contract(apeChainAddress, apeChainABI, signer)
      // const tx = await contract.cancelSubscription(subscription.transactionHash)
      // await tx.wait()

      // Simulate transaction delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Update subscription status
      const updatedSubscription = { ...subscription, isActive: false }
      localStorage.setItem(`jobsfi_subscription_${address}`, JSON.stringify(updatedSubscription))
      setSubscription(updatedSubscription)

      // Send notification
      addNotification({
        walletAddress: address,
        type: "system",
        title: "Subscription Cancelled",
        message: "Your subscription has been cancelled. You will no longer receive early job alerts.",
      })

      console.log("Subscription cancelled successfully")
    } catch (error) {
      console.error("Error cancelling subscription:", error)
      setProcessingError(error instanceof Error ? error.message : "Unknown error cancelling subscription")
      throw error
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <SubscriptionContext.Provider
      value={{
        subscription,
        isSubscribed,
        subscribedCategories,
        subscribe,
        cancelSubscription,
        isProcessing,
        processingError,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  )
}

// Custom hook to use the subscription context
export function useSubscription() {
  const context = useContext(SubscriptionContext)
  if (!context) {
    throw new Error("useSubscription must be used within a SubscriptionProvider")
  }
  return context
}

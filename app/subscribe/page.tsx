"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useSubscription, SUBSCRIPTION_PRICES, type SubscriptionTier } from "@/contexts/subscription-context"
import { useWeb3 } from "@/hooks/use-web3"
import { AlertCircle, Bell, Briefcase, Check, Clock, Loader2, Shield, Sparkles, Wallet } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Navbar } from "@/components/navbar"

export default function SubscribePage() {
  const router = useRouter()
  const { isConnected, connectWallet, address } = useWeb3()
  const { subscription, isSubscribed, subscribe, cancelSubscription, isProcessing, processingError } = useSubscription()

  const [selectedTier, setSelectedTier] = useState<SubscriptionTier>("basic")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [showSuccess, setShowSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const categories = [
    "Development",
    "Design",
    "Marketing",
    "Security",
    "Economics",
    "Management",
    "Research",
    "Community",
  ]

  // Handle category selection
  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      // Check if we've reached the limit for the selected tier
      if (selectedTier === "basic" && selectedCategories.length >= 1) {
        setError("Basic tier only allows 1 category. Please upgrade to select more.")
        return
      }
      if (selectedTier === "premium" && selectedCategories.length >= 3) {
        setError("Premium tier only allows 3 categories. Please upgrade to select more.")
        return
      }

      setSelectedCategories([...selectedCategories, category])
      setError(null)
    } else {
      setSelectedCategories(selectedCategories.filter((c) => c !== category))
      setError(null)
    }
  }

  // Handle tier selection
  const handleTierChange = (tier: SubscriptionTier) => {
    setSelectedTier(tier)

    // Reset categories if downgrading
    if (tier === "basic" && selectedCategories.length > 1) {
      setSelectedCategories(selectedCategories.slice(0, 1))
    } else if (tier === "premium" && selectedCategories.length > 3) {
      setSelectedCategories(selectedCategories.slice(0, 3))
    }

    setError(null)
  }

  // Handle subscription
  const handleSubscribe = async () => {
    if (!isConnected) {
      connectWallet()
      return
    }

    // Validate category selection
    if (selectedTier !== "unlimited" && selectedCategories.length === 0) {
      setError("Please select at least one category")
      return
    }

    if (selectedTier === "basic" && selectedCategories.length > 1) {
      setError("Basic tier only allows 1 category")
      return
    }

    if (selectedTier === "premium" && selectedCategories.length > 3) {
      setError("Premium tier only allows 3 categories")
      return
    }

    try {
      // Get price for selected tier
      const price = SUBSCRIPTION_PRICES[selectedTier]

      // Process subscription
      await subscribe(selectedTier, selectedTier === "unlimited" ? ["all"] : selectedCategories, price)

      setShowSuccess(true)

      // Redirect to dashboard after 3 seconds
      setTimeout(() => {
        router.push("/dashboard")
      }, 3000)
    } catch (error) {
      console.error("Subscription error:", error)
      setError(error instanceof Error ? error.message : "Failed to process subscription")
    }
  }

  // Handle subscription cancellation
  const handleCancelSubscription = async () => {
    if (confirm("Are you sure you want to cancel your subscription? You will no longer receive early job alerts.")) {
      try {
        await cancelSubscription()
        alert("Your subscription has been cancelled successfully")
        router.push("/dashboard")
      } catch (error) {
        console.error("Error cancelling subscription:", error)
        setError(error instanceof Error ? error.message : "Failed to cancel subscription")
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-950 to-gray-900">
      <Navbar />

      <main className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-white md:text-4xl">Get Early Access to Job Opportunities</h1>
            <p className="mt-4 text-xl text-gray-300">
              Subscribe to receive alerts for new job postings before they're publicly available
            </p>
          </div>

          {isSubscribed && !showSuccess ? (
            <div className="rounded-xl bg-gray-800/50 p-8 backdrop-blur-sm">
              <div className="mb-6 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
                  <Check className="h-8 w-8 text-green-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">You're Already Subscribed!</h2>
                <p className="mt-2 text-gray-300">
                  You have an active {subscription?.tier} subscription that expires on{" "}
                  {new Date(subscription?.endDate || "").toLocaleDateString()}.
                </p>
              </div>

              <div className="mb-6 rounded-lg bg-gray-700/50 p-4">
                <h3 className="mb-2 font-medium text-white">Your Subscription Details:</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-gray-300">
                    <Clock className="h-4 w-4 text-purple-400" />
                    <span>Started on {new Date(subscription?.startDate || "").toLocaleDateString()}</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-300">
                    <Bell className="h-4 w-4 text-purple-400" />
                    <span>
                      {subscription?.categories.includes("all")
                        ? "All categories"
                        : `Categories: ${subscription?.categories.join(", ")}`}
                    </span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-300">
                    <Shield className="h-4 w-4 text-purple-400" />
                    <span>Transaction: {subscription?.transactionHash.substring(0, 10)}...</span>
                  </li>
                </ul>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Link href="/dashboard">
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 sm:w-auto">
                    Go to Dashboard
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="w-full border-red-400 text-white hover:bg-red-900/20 sm:w-auto"
                  onClick={handleCancelSubscription}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Cancel Subscription"
                  )}
                </Button>
              </div>
            </div>
          ) : showSuccess ? (
            <div className="rounded-xl bg-gray-800/50 p-8 text-center backdrop-blur-sm">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
                <Check className="h-8 w-8 text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">Subscription Successful!</h2>
              <p className="mt-2 text-gray-300">
                Your {selectedTier} subscription has been activated. You'll now receive early alerts for new job
                postings.
              </p>
              <p className="mt-4 text-sm text-gray-400">Redirecting to dashboard...</p>
            </div>
          ) : (
            <>
              {/* Subscription Tiers */}
              <div className="mb-8 grid gap-6 md:grid-cols-3">
                {/* Basic Tier */}
                <Card
                  className={`border-2 ${selectedTier === "basic" ? "border-purple-500" : "border-transparent"} bg-gray-800/70 text-white`}
                >
                  <CardHeader>
                    <CardTitle>Basic</CardTitle>
                    <CardDescription className="text-gray-300">Early access to 1 category</CardDescription>
                    <div className="mt-2 text-3xl font-bold text-white">{SUBSCRIPTION_PRICES.basic} APE</div>
                    <p className="text-sm text-gray-400">per month</p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-400" />
                        <span>1 job category</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-400" />
                        <span>24-hour early access</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-400" />
                        <span>Email notifications</span>
                      </li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className={`w-full ${
                        selectedTier === "basic"
                          ? "bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                          : "bg-gray-700 hover:bg-gray-600"
                      }`}
                      onClick={() => handleTierChange("basic")}
                    >
                      {selectedTier === "basic" ? "Selected" : "Select Basic"}
                    </Button>
                  </CardFooter>
                </Card>

                {/* Premium Tier */}
                <Card
                  className={`border-2 ${selectedTier === "premium" ? "border-purple-500" : "border-transparent"} bg-gray-800/70 text-white relative overflow-hidden`}
                >
                  <div className="absolute -right-12 top-6 rotate-45 bg-purple-500 px-12 py-1 text-xs font-semibold text-white">
                    Popular
                  </div>
                  <CardHeader>
                    <CardTitle>Premium</CardTitle>
                    <CardDescription className="text-gray-300">Early access to 3 categories</CardDescription>
                    <div className="mt-2 text-3xl font-bold text-white">{SUBSCRIPTION_PRICES.premium} APE</div>
                    <p className="text-sm text-gray-400">for 3 months</p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-400" />
                        <span>3 job categories</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-400" />
                        <span>48-hour early access</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-400" />
                        <span>Email & SMS notifications</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-400" />
                        <span>Application priority</span>
                      </li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className={`w-full ${
                        selectedTier === "premium"
                          ? "bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                          : "bg-gray-700 hover:bg-gray-600"
                      }`}
                      onClick={() => handleTierChange("premium")}
                    >
                      {selectedTier === "premium" ? "Selected" : "Select Premium"}
                    </Button>
                  </CardFooter>
                </Card>

                {/* Unlimited Tier */}
                <Card
                  className={`border-2 ${selectedTier === "unlimited" ? "border-purple-500" : "border-transparent"} bg-gray-800/70 text-white`}
                >
                  <CardHeader>
                    <CardTitle>Unlimited</CardTitle>
                    <CardDescription className="text-gray-300">Early access to all categories</CardDescription>
                    <div className="mt-2 text-3xl font-bold text-white">{SUBSCRIPTION_PRICES.unlimited} APE</div>
                    <p className="text-sm text-gray-400">for 6 months</p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-400" />
                        <span>All job categories</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-400" />
                        <span>72-hour early access</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-400" />
                        <span>All notification methods</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-400" />
                        <span>Application priority</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-400" />
                        <span>Resume highlighting</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-yellow-400" />
                        <span className="font-medium text-yellow-400">Premium badge</span>
                      </li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className={`w-full ${
                        selectedTier === "unlimited"
                          ? "bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                          : "bg-gray-700 hover:bg-gray-600"
                      }`}
                      onClick={() => handleTierChange("unlimited")}
                    >
                      {selectedTier === "unlimited" ? "Selected" : "Select Unlimited"}
                    </Button>
                  </CardFooter>
                </Card>
              </div>

              {/* Category Selection (only for Basic and Premium) */}
              {selectedTier !== "unlimited" && (
                <div className="mb-8 rounded-xl bg-gray-800/50 p-6 backdrop-blur-sm">
                  <h2 className="mb-4 text-xl font-bold text-white">
                    Select Job Categories
                    {selectedTier === "basic" && " (Choose 1)"}
                    {selectedTier === "premium" && " (Choose up to 3)"}
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
                    {categories.map((category) => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox
                          id={`category-${category}`}
                          checked={selectedCategories.includes(category)}
                          onCheckedChange={(checked) => handleCategoryChange(category, checked === true)}
                          disabled={
                            !selectedCategories.includes(category) &&
                            ((selectedTier === "basic" && selectedCategories.length >= 1) ||
                              (selectedTier === "premium" && selectedCategories.length >= 3))
                          }
                        />
                        <Label
                          htmlFor={`category-${category}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {category}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Payment Section */}
              <div className="rounded-xl bg-gray-800/50 p-6 backdrop-blur-sm">
                <h2 className="mb-4 text-xl font-bold text-white">Complete Your Subscription</h2>

                {!isConnected ? (
                  <div className="mb-6 rounded-lg bg-purple-900/30 p-6 text-center">
                    <p className="mb-4 text-gray-300">Connect your wallet to complete your subscription</p>
                    <Button
                      onClick={connectWallet}
                      className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                    >
                      <Wallet className="mr-2 h-4 w-4" />
                      Connect Wallet
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="mb-6 rounded-lg bg-gray-700/50 p-4">
                      <h3 className="mb-2 font-medium text-white">Subscription Summary:</h3>
                      <ul className="space-y-2">
                        <li className="flex items-center justify-between">
                          <span className="text-gray-300">Plan:</span>
                          <span className="font-medium text-white">
                            {selectedTier.charAt(0).toUpperCase() + selectedTier.slice(1)}
                          </span>
                        </li>
                        <li className="flex items-center justify-between">
                          <span className="text-gray-300">Duration:</span>
                          <span className="font-medium text-white">
                            {selectedTier === "basic"
                              ? "1 month"
                              : selectedTier === "premium"
                                ? "3 months"
                                : "6 months"}
                          </span>
                        </li>
                        <li className="flex items-center justify-between">
                          <span className="text-gray-300">Categories:</span>
                          <span className="font-medium text-white">
                            {selectedTier === "unlimited"
                              ? "All categories"
                              : selectedCategories.length > 0
                                ? selectedCategories.join(", ")
                                : "None selected"}
                          </span>
                        </li>
                        <li className="flex items-center justify-between border-t border-gray-600 pt-2 mt-2">
                          <span className="text-gray-300">Total:</span>
                          <span className="text-xl font-bold text-white">{SUBSCRIPTION_PRICES[selectedTier]} APE</span>
                        </li>
                      </ul>
                    </div>

                    {error && (
                      <div className="mb-6 rounded-lg bg-red-900/30 p-4 flex items-start gap-2">
                        <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
                        <p className="text-sm text-red-200">{error}</p>
                      </div>
                    )}

                    <Button
                      className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                      onClick={handleSubscribe}
                      disabled={isProcessing || (selectedTier !== "unlimited" && selectedCategories.length === 0)}
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing Payment...
                        </>
                      ) : (
                        <>
                          <Wallet className="mr-2 h-4 w-4" />
                          Pay {SUBSCRIPTION_PRICES[selectedTier]} APE & Subscribe
                        </>
                      )}
                    </Button>

                    <p className="mt-4 text-center text-xs text-gray-400">
                      By subscribing, you authorize a payment of {SUBSCRIPTION_PRICES[selectedTier]} APE tokens from
                      your connected wallet. Subscription will automatically expire after the period ends.
                    </p>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </main>

      <footer className="border-t border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-purple-400" />
              <span className="text-lg font-bold text-white">JobsFi</span>
            </div>
            <p className="text-sm text-gray-400">© {new Date().getFullYear()} Web3Jobs. All rights reserved.</p>
            <div className="flex gap-4">
              <Link href="/about" className="text-sm text-gray-400 hover:text-white">
                About
              </Link>
              <Link href="/privacy" className="text-sm text-gray-400 hover:text-white">
                Privacy
              </Link>
              <Link href="/terms" className="text-sm text-gray-400 hover:text-white">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

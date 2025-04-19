"use client"

import { Button } from "@/components/ui/button"
import { Briefcase, Menu, X } from "lucide-react"
import Link from "next/link"
import { WalletConnect } from "@/components/wallet-connect"
import { NotificationBell } from "@/components/notification-bell"
import { SubscriptionBadge } from "@/components/subscription-badge"
import { useState } from "react"
import { useWeb3 } from "@/hooks/use-web3"

export function Navbar() {
  const { isConnected } = useWeb3()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="container mx-auto px-4 py-4 md:py-6">
      <nav className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 z-10">
          <Briefcase className="h-5 w-5 md:h-6 md:w-6 text-purple-400" />
          <span className="text-lg md:text-xl font-bold text-white">JobsFi</span>
        </Link>

        {/* Mobile menu button */}
        <button className="md:hidden z-10 text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/jobs">
            <Button variant="ghost" className="text-white hover:text-purple-300">
              Browse Jobs
            </Button>
          </Link>
          <Link href="/post-job">
            <Button variant="ghost" className="text-white hover:text-purple-300">
              Post a Job
            </Button>
          </Link>
          {isConnected && (
            <Link href="/dashboard">
              <Button variant="ghost" className="text-white hover:text-purple-300">
                Dashboard
              </Button>
            </Link>
          )}
          {isConnected && <SubscriptionBadge />}
          <WalletConnect />
          {isConnected && <NotificationBell />}
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="fixed inset-0 bg-gray-900/95 z-[5] flex flex-col items-center justify-center space-y-6 md:hidden">
            <div className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-purple-400" />
              <span className="text-lg font-bold text-white">JobsFi</span>
            </div>
            <Link href="/jobs" onClick={() => setIsMenuOpen(false)}>
              <Button variant="ghost" size="lg" className="text-white hover:text-purple-300 text-xl">
                Browse Jobs
              </Button>
            </Link>
            <Link href="/post-job" onClick={() => setIsMenuOpen(false)}>
              <Button variant="ghost" size="lg" className="text-white hover:text-purple-300 text-xl">
                Post a Job
              </Button>
            </Link>
            {isConnected && (
              <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>
                <Button variant="ghost" size="lg" className="text-white hover:text-purple-300 text-xl">
                  Dashboard
                </Button>
              </Link>
            )}
            {isConnected && <SubscriptionBadge />}
            <div className="mt-4">
              <WalletConnect />
            </div>
            {isConnected && (
              <div className="mt-2">
                <NotificationBell />
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  )
}

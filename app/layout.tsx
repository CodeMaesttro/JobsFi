import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { Web3Provider } from "@/components/web3-provider"
import { ThemeProvider } from "@/components/theme-provider"
import { JobProvider } from "@/contexts/job-context"
import { NotificationProvider } from "@/contexts/notification-context"
import { SubscriptionProvider } from "@/contexts/subscription-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "JobsFi",
  description: "Connect, Apply, and Get Hired — The Web3 Way",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark">
          <NotificationProvider>
            <Web3Provider>
              <SubscriptionProvider>
                <JobProvider>{children}</JobProvider>
              </SubscriptionProvider>
            </Web3Provider>
          </NotificationProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

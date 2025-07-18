"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useWeb3 } from "@/hooks/use-web3"

// Define notification type
export interface Notification {
  id: string
  walletAddress: string | null
  type: "application" | "job_status" | "system"
  title: string
  message: string
  read: boolean
  createdAt: string
  data?: any
}

// Define notification context type
interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  addNotification: (notification: Omit<Notification, "id" | "createdAt" | "read">) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  clearNotifications: () => void
}

// Create context with default values
const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  unreadCount: 0,
  addNotification: () => {},
  markAsRead: () => {},
  markAllAsRead: () => {},
  clearNotifications: () => {},
})

// Create provider component
export function NotificationProvider({ children }: { children: ReactNode }) {
  const { address } = useWeb3()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  // Load notifications from localStorage on mount
  useEffect(() => {
    if (address) {
      try {
        const storedNotifications = localStorage.getItem(`jobsfi_notifications_${address}`)
        if (storedNotifications) {
          const parsedNotifications = JSON.parse(storedNotifications)
          setNotifications(parsedNotifications)
          setUnreadCount(parsedNotifications.filter((n: Notification) => !n.read).length)
        }
      } catch (error) {
        console.error("Error loading notifications:", error)
      }
    } else {
      // Clear notifications when wallet disconnects
      setNotifications([])
      setUnreadCount(0)
    }
  }, [address])

  // Save notifications to localStorage when they change
  useEffect(() => {
    if (address) {
      localStorage.setItem(`jobsfi_notifications_${address}`, JSON.stringify(notifications))
      setUnreadCount(notifications.filter((n) => !n.read).length)
    }
  }, [notifications, address])

  // Add a new notification
  const addNotification = (notification: Omit<Notification, "id" | "createdAt" | "read">) => {
    if (!address && !notification.walletAddress) return

    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substring(2, 15),
      createdAt: new Date().toISOString(),
      read: false,
    }

    setNotifications((prev) => [newNotification, ...prev])
  }

  // Mark a notification as read
  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
  }

  // Clear all notifications
  const clearNotifications = () => {
    setNotifications([])
  }

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

// Custom hook to use the notification context
export function useNotifications() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }
  return context
}

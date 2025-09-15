"use client"

import type React from "react"

import { useUser, useClerk } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export function EmailValidator({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser()
  const { signOut } = useClerk()
  const router = useRouter()
  const [isValidating, setIsValidating] = useState(true)

  useEffect(() => {
    if (!isLoaded) return

    if (user) {
      const email = user.emailAddresses[0]?.emailAddress
      const isUIUEmail = email?.endsWith(".uiu.ac.bd")

      if (!isUIUEmail) {
        signOut(() => {
          router.push("/unauthorized")
        })
        return
      }

      syncUserWithDatabase(user)
    }

    setIsValidating(false)
  }, [user, isLoaded, signOut, router])

  const syncUserWithDatabase = async (user: any) => {
    try {
      await fetch("/api/sync-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clerkId: user.id,
          email: user.emailAddresses[0]?.emailAddress,
          name: user.fullName || user.firstName || "Unknown",
        }),
      })
    } catch (error) {
      console.error("Failed to sync user:", error)
    }
  }

  if (isValidating) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return <>{children}</>
}

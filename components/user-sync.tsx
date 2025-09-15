"use client"

import { useUser } from "@clerk/nextjs"
import { useEffect } from "react"

export function UserSync() {
  const { user, isLoaded } = useUser()

  useEffect(() => {
    const syncUser = async () => {
      if (!isLoaded || !user) return

      try {
        const response = await fetch("/api/sync-user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            clerkId: user.id,
            email: user.emailAddresses[0]?.emailAddress,
            firstName: user.firstName,
            lastName: user.lastName,
          }),
        })

        if (!response.ok) {
          console.error("Failed to sync user")
        }
      } catch (error) {
        console.error("User sync error:", error)
      }
    }

    syncUser()
  }, [user, isLoaded])

  return null // This component doesn't render anything
}

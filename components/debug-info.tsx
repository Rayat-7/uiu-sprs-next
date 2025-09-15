"use client"

import { useUser, useAuth } from "@clerk/nextjs"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function DebugInfo() {
  const [showDebug, setShowDebug] = useState(false)
  const { user, isLoaded: userLoaded } = useUser()
  const { isLoaded: authLoaded, isSignedIn } = useAuth()

  if (process.env.NODE_ENV !== "development") {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button onClick={() => setShowDebug(!showDebug)} variant="outline" size="sm" className="mb-2">
        Debug Info
      </Button>

      {showDebug && (
        <Card className="w-80 max-h-96 overflow-auto">
          <CardHeader>
            <CardTitle className="text-sm">Debug Information</CardTitle>
          </CardHeader>
          <CardContent className="text-xs space-y-2">
            <div>
              <strong>Auth Status:</strong>
              <div>Auth Loaded: {authLoaded ? "✅" : "❌"}</div>
              <div>User Loaded: {userLoaded ? "✅" : "❌"}</div>
              <div>Signed In: {isSignedIn ? "✅" : "❌"}</div>
            </div>

            {user && (
              <div>
                <strong>User Info:</strong>
                <div>ID: {user.id}</div>
                <div>Email: {user.emailAddresses[0]?.emailAddress}</div>
                <div>
                  Name: {user.firstName} {user.lastName}
                </div>
                <div>UIU Email: {user.emailAddresses[0]?.emailAddress?.endsWith(".uiu.ac.bd") ? "✅" : "❌"}</div>
              </div>
            )}

            <div>
              <strong>Environment:</strong>
              <div>Clerk Key: {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? "✅" : "❌"}</div>
              <div>Current Path: {window.location.pathname}</div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

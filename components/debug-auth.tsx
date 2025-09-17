"use client"

import { useUser } from "@clerk/nextjs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function DebugAuth() {
  const { user, isLoaded } = useUser()

  if (!isLoaded) return <div>Loading...</div>

  const email = user?.primaryEmailAddress?.emailAddress
  const isValidUIUEmail = email?.toLowerCase().includes(".uiu.ac.bd")

  return (
    <Card className="max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>Debug Authentication</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div>
          <strong>User ID:</strong> {user?.id || "Not found"}
        </div>
        <div>
          <strong>Email:</strong> {email || "Not found"}
        </div>
        <div>
          <strong>First Name:</strong> {user?.firstName || "Not found"}
        </div>
        <div>
          <strong>Last Name:</strong> {user?.lastName || "Not found"}
        </div>
        <div>
          <strong>Is Valid UIU Email:</strong> 
          <span className={isValidUIUEmail ? "text-green-600" : "text-red-600"}>
            {isValidUIUEmail ? " ✓ Yes" : " ✗ No"}
          </span>
        </div>
        <div className="text-xs text-gray-500 mt-4">
          <strong>Email validation rule:</strong> Must contain ".uiu.ac.bd"
        </div>
      </CardContent>
    </Card>
  )
}
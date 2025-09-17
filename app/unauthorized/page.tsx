"use client"

import { DebugAuth } from "@/components/debug-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"
import { useRouter } from "next/navigation"

export default function UnauthorizedPage() {
  const router = useRouter()

  const handleReturnHome = () => {
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center px-4">
      <DebugAuth />
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <CardTitle className="text-2xl text-red-600">Access Denied</CardTitle>
          <CardDescription className="text-lg">You are not authorized to access this application</CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">
            This application is exclusively for United International University students, faculty, and staff with valid
            UIU email addresses.
          </p>
          <p className="text-sm text-gray-500">Valid email format: yourname@department.uiu.ac.bd</p>
          <Button onClick={handleReturnHome} className="w-full bg-blue-600 hover:bg-blue-700">
            Return to Landing Page
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

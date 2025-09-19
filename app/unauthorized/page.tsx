"use client"

import { useEffect, useState } from "react"
import { useClerk } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Home, RefreshCw } from "lucide-react"
import { useRouter } from "next/navigation"

export default function UnauthorizedPage() {
  const { signOut } = useClerk()
  const router = useRouter()
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [isRetrying, setIsRetrying] = useState(false)

  // Ensure user is signed out when this page loads
  useEffect(() => {
    const ensureSignOut = async () => {
      try {
        console.log("Unauthorized - Ensuring user is signed out")
        await signOut()
      } catch (error) {
        console.log("Unauthorized - User might already be signed out", error)
      }
    }
    ensureSignOut()
  }, [signOut])

  const handleReturnHome = async () => {
    setIsSigningOut(true)
    try {
      console.log("Unauthorized - Signing out and redirecting to home")
      await signOut()
      // Clear any cached data
      if (typeof window !== "undefined") {
        window.localStorage.clear()
        window.sessionStorage.clear()
      }
      // Force navigation to home
      window.location.href = "/"
    } catch (error) {
      console.error("Unauthorized - Error during sign out:", error)
      // Force redirect even if signOut fails
      window.location.href = "/"
    }
  }

  const handleRetrySignIn = () => {
    setIsRetrying(true)
    // Clear storage and redirect to sign in
    if (typeof window !== "undefined") {
      window.localStorage.clear()
      window.sessionStorage.clear()
    }
    window.location.href = "/sign-in"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <CardTitle className="text-2xl text-red-600">Access Denied</CardTitle>
          <CardDescription className="text-lg">
            You are not authorized to access this application
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="space-y-4">
            <p className="text-gray-600">
              This application is exclusively for United International University students, faculty, and staff with valid
              UIU email addresses.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">Valid Email Formats:</h3>
              <div className="text-sm text-blue-700 space-y-1">
                <p>• yourname@department.uiu.ac.bd</p>
                <p>• studentid@bscse.uiu.ac.bd</p>
                <p>• facultyname@cse.uiu.ac.bd</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <Button 
              onClick={handleReturnHome} 
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={isSigningOut}
            >
              {isSigningOut ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Signing Out...
                </>
              ) : (
                <>
                  <Home className="h-4 w-4 mr-2" />
                  Return to Landing Page
                </>
              )}
            </Button>
            
            <Button 
              onClick={handleRetrySignIn}
              variant="outline"
              className="w-full"
              disabled={isRetrying}
            >
              {isRetrying ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Redirecting...
                </>
              ) : (
                "Try Signing In Again"
              )}
            </Button>
          </div>
          
          <p className="text-xs text-gray-500">
            If you believe this is an error and you have a valid UIU email, please contact IT support.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}







// "use client"

// import { DebugAuth } from "@/components/debug-auth"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { AlertTriangle } from "lucide-react"
// import { useRouter } from "next/navigation"

// export default function UnauthorizedPage() {
//   const router = useRouter()

//   const handleReturnHome = () => {
//     router.push("/")
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center px-4">
//       <DebugAuth />
//       <Card className="w-full max-w-md">
//         <CardHeader className="text-center">
//           <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
//           <CardTitle className="text-2xl text-red-600">Access Denied</CardTitle>
//           <CardDescription className="text-lg">You are not authorized to access this application</CardDescription>
//         </CardHeader>
//         <CardContent className="text-center space-y-4">
//           <p className="text-gray-600">
//             This application is exclusively for United International University students, faculty, and staff with valid
//             UIU email addresses.
//           </p>
//           <p className="text-sm text-gray-500">Valid email format: yourname@department.uiu.ac.bd</p>
//           <Button onClick={handleReturnHome} className="w-full bg-blue-600 hover:bg-blue-700">
//             Return to Landing Page
//           </Button>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }

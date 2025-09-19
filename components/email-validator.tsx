"use client"

import { useUser, useClerk } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

// Updated isUIUEmail function
function isUIUEmail(email: string): boolean {
  if (!email) return false
  console.log("EmailValidator - Checking email:", email)
  // Check if email contains .uiu.ac.bd (covers all department formats)
  const isValid = email.toLowerCase().includes(".uiu.ac.bd")
  console.log("EmailValidator - Is valid UIU email:", isValid)
  return isValid
}

interface EmailValidatorProps {
  children: React.ReactNode
}

export function EmailValidator({ children }: EmailValidatorProps) {
  const { user, isLoaded } = useUser()
  const { signOut } = useClerk()
  const router = useRouter()
  const [isValidating, setIsValidating] = useState(true)
  const [shouldSyncUser, setShouldSyncUser] = useState(false)
  const [hasRedirected, setHasRedirected] = useState(false)

  useEffect(() => {
    const validateAndSync = async () => {
      console.log("EmailValidator - Starting validation", { isLoaded, hasUser: !!user })
      
      if (!isLoaded) return

      if (!user) {
        console.log("EmailValidator - No user found, redirecting to home")
        router.push("/")
        return
      }

      const email = user.primaryEmailAddress?.emailAddress
      console.log("EmailValidator - User email:", email)
      
      if (!email || !isUIUEmail(email)) {
        console.log("EmailValidator - Invalid email, signing out and redirecting")
        if (!hasRedirected) {
          setHasRedirected(true)
          try {
            await signOut({ redirectUrl: "/unauthorized" })
          } catch (error) {
            console.error("EmailValidator - Error during signOut:", error)
            // Force redirect even if signOut fails
            window.location.href = "/unauthorized"
          }
        }
        return
      }

      console.log("EmailValidator - Email is valid, proceeding with sync")
      // If we reach here, email is valid - sync user
      setShouldSyncUser(true)
      setIsValidating(false)
    }

    validateAndSync()
  }, [isLoaded, user, signOut, router, hasRedirected])

  useEffect(() => {
    const syncUser = async () => {
      if (!shouldSyncUser || !user) return

      console.log("EmailValidator - Syncing user to database")
      
      try {
        const response = await fetch("/api/sync-user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            clerkId: user.id,
            email: user.primaryEmailAddress?.emailAddress,
            firstName: user.firstName,
            lastName: user.lastName,
          }),
        })

        const result = await response.json()
        console.log("EmailValidator - Sync response:", result)

        if (!response.ok) {
          throw new Error(`Failed to sync user: ${result.error}`)
        }

        console.log("EmailValidator - User synced successfully")
        setShouldSyncUser(false)
      } catch (error) {
        console.error("EmailValidator - Error syncing user:", error)
        // If sync fails, sign out and redirect
        if (!hasRedirected) {
          setHasRedirected(true)
          try {
            await signOut({ redirectUrl: "/unauthorized" })
          } catch (signOutError) {
            console.error("EmailValidator - Error during signOut after sync failure:", signOutError)
            window.location.href = "/unauthorized"
          }
        }
      }
    }

    syncUser()
  }, [shouldSyncUser, user, signOut, hasRedirected])

  if (!isLoaded || isValidating || shouldSyncUser) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Validating Access</h2>
            <p className="text-muted-foreground">
              {!isLoaded && "Loading user information..."}
              {isLoaded && isValidating && "Checking email credentials..."}
              {isLoaded && !isValidating && shouldSyncUser && "Setting up your account..."}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}










// "use client"

// import { useUser, useClerk } from "@clerk/nextjs"
// import { useEffect, useState } from "react"
// import { useRouter } from "next/navigation"
// // Updated isUIUEmail function
// function isUIUEmail(email: string): boolean {
//   if (!email) return false
//   // Check if email contains .uiu.ac.bd (covers all department formats)
//   return email.toLowerCase().includes(".uiu.ac.bd")
// }

// interface EmailValidatorProps {
//   children: React.ReactNode
// }

// export function EmailValidator({ children }: EmailValidatorProps) {
//   const { user, isLoaded } = useUser()
//   const { signOut } = useClerk()
//   const router = useRouter()
//   const [isValidating, setIsValidating] = useState(true)
//   const [shouldSyncUser, setShouldSyncUser] = useState(false)

//   useEffect(() => {
//     const validateAndSync = async () => {
//       if (!isLoaded) return

//       if (!user) {
//         router.push("/")
//         return
//       }

//       const email = user.primaryEmailAddress?.emailAddress
      
//       if (!email || !isUIUEmail(email)) {
//         await signOut()
//         router.push("/unauthorized")
//         return
//       }

//       // If we reach here, email is valid - sync user
//       setShouldSyncUser(true)
//       setIsValidating(false)
//     }

//     validateAndSync()
//   }, [isLoaded, user, signOut, router])

//   useEffect(() => {
//     const syncUser = async () => {
//       if (!shouldSyncUser || !user) return

//       try {
//         const response = await fetch("/api/sync-user", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             clerkId: user.id,
//             email: user.primaryEmailAddress?.emailAddress,
//             firstName: user.firstName,
//             lastName: user.lastName,
//           }),
//         })

//         if (!response.ok) {
//           throw new Error("Failed to sync user")
//         }

//         setShouldSyncUser(false)
//       } catch (error) {
//         console.error("Error syncing user:", error)
//         // If sync fails, sign out and redirect
//         await signOut()
//         router.push("/unauthorized")
//       }
//     }

//     syncUser()
//   }, [shouldSyncUser, user, signOut, router])

//   if (!isLoaded || isValidating || shouldSyncUser) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Validating your access...</p>
//         </div>
//       </div>
//     )
//   }

//   return <>{children}</>
// }
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)", "/public(.*)"])
const isPublicAPIRoute = createRouteMatcher(["/api/sync-user"])

// Updated function to check UIU email format
function isUIUEmail(email: string): boolean {
  if (!email) return false
  // Check if email ends with .uiu.ac.bd (covers department.uiu.ac.bd format)
  return email.toLowerCase().includes(".uiu.ac.bd")
}

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth()
  
  // Protect routes that require authentication
  if (isProtectedRoute(req)) {
    await auth.protect()
  }

  // If user is authenticated and not accessing sync API, validate email
  if (userId && !isPublicAPIRoute(req)) {
    // For protected routes, let the EmailValidator component handle validation
    // This middleware will just ensure authentication, not email validation
    // The email validation will happen on the client side with proper Clerk hooks
    
    // If accessing root and authenticated, redirect to public view
    if (req.nextUrl.pathname === "/") {
      return NextResponse.redirect(new URL("/", req.url))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
}










// import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
// import { NextResponse } from "next/server"
// import { prisma } from "@/lib/prisma"

// const isProtectedRoute = createRouteMatcher(["/dashboard(.*)", "/public(.*)"])

// export default clerkMiddleware(async (auth, req) => {
//   const { userId } = await auth()

//   // Protect routes that require authentication
//   if (isProtectedRoute(req)) {
//     await auth.protect()
//   }

//   // If user is authenticated, perform additional checks
//   if (userId) {
//     const user = await auth.user
//     const email = user?.emailAddresses[0]?.emailAddress

//     // Check if email is from UIU domain
//     const isUIUEmail = email?.endsWith("uiu.ac.bd")

//     if (!isUIUEmail) {
//       // Redirect non-UIU users to unauthorized page
//       return NextResponse.redirect(new URL("/unauthorized", req.url))
//     }

//     // Sync user with database
//     try {
//       await prisma.user.upsert({
//         where: { clerkId: userId },
//         update: {
//           email: email!,
//           firstName: user?.firstName,
//           lastName: user?.lastName,
//         },
//         create: {
//           clerkId: userId,
//           email: email!,
//           firstName: user?.firstName,
//           lastName: user?.lastName,
//           role: "STUDENT", // Default role
//         },
//       })
//     } catch (error) {
//       console.error("Error syncing user:", error)
//     }

//     // Redirect authenticated users from landing page to public view
//     if (req.nextUrl.pathname === "/") {
//       return NextResponse.redirect(new URL("/public", req.url))
//     }
//   }

//   return NextResponse.next()
// })

// export const config = {
//   matcher: [
//     "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
//     "/(api|trpc)(.*)",
//   ],
// }

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"])

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect()
  }
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

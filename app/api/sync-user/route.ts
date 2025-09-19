import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const { userId } = await auth()

    if (!userId) {
      console.log("Sync-user API - No userId from auth")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { clerkId, email, firstName, lastName } = body

    console.log("Sync-user API - Request data:", { clerkId, email, firstName, lastName })

    if (!email || clerkId !== userId) {
      console.log("Sync-user API - Invalid request data", { 
        hasEmail: !!email, 
        clerkIdMatch: clerkId === userId 
      })
      return NextResponse.json({ error: "Invalid user data" }, { status: 400 })
    }

    const isUIUEmail = email.toLowerCase().includes(".uiu.ac.bd")
    console.log("Sync-user API - Email validation:", { email, isUIUEmail })
    
    if (!isUIUEmail) {
      console.log("Sync-user API - Invalid UIU email format")
      return NextResponse.json({ error: "Invalid UIU email" }, { status: 403 })
    }

    // Sync user with database
    const syncedUser = await prisma.user.upsert({
      where: { clerkId: userId },
      update: {
        email: email,
        firstName: firstName || "",
        lastName: lastName || "",
      },
      create: {
        clerkId: userId,
        email: email,
        firstName: firstName || "",
        lastName: lastName || "",
        role: "STUDENT", // Default role
      },
    })

    console.log("Sync-user API - User synced successfully:", {
      id: syncedUser.id,
      email: syncedUser.email,
      role: syncedUser.role
    })

    return NextResponse.json({ 
      user: syncedUser,
      message: "User synced successfully"
    })
  } catch (error) {
    console.error("Sync-user API - Error:", error)
    return NextResponse.json({ 
      error: "Failed to sync user",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}











// import { auth } from "@clerk/nextjs/server"
// import { NextResponse } from "next/server"
// import { prisma } from "@/lib/prisma"

// export async function POST(request: Request) {
//   try {
//     const { userId } = await auth()

//     if (!userId) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     const body = await request.json()
//     const { clerkId, email, firstName, lastName } = body

//     if (!email || clerkId !== userId) {
//       return NextResponse.json({ error: "Invalid user data" }, { status: 400 })
//     }

//     const isUIUEmail = email.endsWith(".uiu.ac.bd")
//     if (!isUIUEmail) {
//       return NextResponse.json({ error: "Invalid UIU email" }, { status: 403 })
//     }

//     // Sync user with database
//     const syncedUser = await prisma.user.upsert({
//       where: { clerkId: userId },
//       update: {
//         email: email,
//         firstName: firstName,
//         lastName: lastName,
//       },
//       create: {
//         clerkId: userId,
//         email: email,
//         firstName: firstName,
//         lastName: lastName,
//         role: "STUDENT", // Default role
//       },
//     })

//     return NextResponse.json({ user: syncedUser })
//   } catch (error) {
//     console.error("Error syncing user:", error)
//     return NextResponse.json({ error: "Failed to sync user" }, { status: 500 })
//   }
// }

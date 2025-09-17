import { auth } from "@clerk/nextjs/server"
import { NextResponse, NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"

// Updated isUIUEmail function
function isUIUEmail(email: string): boolean {
  if (!email) return false
  // Check if email contains .uiu.ac.bd (covers all department formats)
  return email.toLowerCase().includes(".uiu.ac.bd")
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { clerkId, email, firstName, lastName } = body

    if (!email || clerkId !== userId) {
      return NextResponse.json({ error: "Invalid user data" }, { status: 400 })
    }

    if (!isUIUEmail(email)) {
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

    return NextResponse.json({ 
      success: true, 
      user: {
        id: syncedUser.id,
        email: syncedUser.email,
        role: syncedUser.role
      }
    })
  } catch (error) {
    console.error("Error syncing user:", error)
    return NextResponse.json({ error: "Failed to sync user" }, { status: 500 })
  }
}
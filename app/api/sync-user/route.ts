import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
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

    const isUIUEmail = email.endsWith(".uiu.ac.bd")
    if (!isUIUEmail) {
      return NextResponse.json({ error: "Invalid UIU email" }, { status: 403 })
    }

    // Sync user with database
    const syncedUser = await prisma.user.upsert({
      where: { clerkId: userId },
      update: {
        email: email,
        firstName: firstName,
        lastName: lastName,
      },
      create: {
        clerkId: userId,
        email: email,
        firstName: firstName,
        lastName: lastName,
        role: "STUDENT", // Default role
      },
    })

    return NextResponse.json({ user: syncedUser })
  } catch (error) {
    console.error("Error syncing user:", error)
    return NextResponse.json({ error: "Failed to sync user" }, { status: 500 })
  }
}

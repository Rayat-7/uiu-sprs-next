import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user || user.role !== "DSW_ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const { message } = body

    if (!message || !message.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Update the report back to IN_PROGRESS status
    const report = await prisma.report.update({
      where: { id: params.id },
      data: {
        status: "IN_PROGRESS",
      },
      include: {
        assignedTo: true,
        student: true,
      },
    })

    // Create update record
    await prisma.reportUpdate.create({
      data: {
        reportId: params.id,
        message: `Changes requested: ${message}`,
        status: "IN_PROGRESS",
        updatedById: user.id,
      },
    })

    // TODO: Send notification to department admin
    // This would integrate with your email service

    return NextResponse.json(report)
  } catch (error) {
    console.error("Error requesting changes:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
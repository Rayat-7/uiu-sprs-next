import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = auth()

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
    const { assignedToId, message } = body

    // Update the report
    const report = await prisma.report.update({
      where: { id: params.id },
      data: {
        assignedToId,
        status: "ASSIGNED_TO_DEPARTMENT",
      },
    })

    // Create update record
    await prisma.reportUpdate.create({
      data: {
        reportId: params.id,
        message,
        status: "ASSIGNED_TO_DEPARTMENT",
        updatedById: user.id,
      },
    })

    return NextResponse.json(report)
  } catch (error) {
    console.error("Error assigning report:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

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

    if (!user || user.role !== "DEPT_ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Update the report to in progress
    const report = await prisma.report.update({
      where: {
        id: params.id,
        assignedToId: user.id, // Ensure the report is assigned to this admin
      },
      data: {
        status: "IN_PROGRESS",
      },
    })

    // Create update record
    await prisma.reportUpdate.create({
      data: {
        reportId: params.id,
        message: "Department admin has accepted the report and started working on the resolution.",
        status: "IN_PROGRESS",
        updatedById: user.id,
      },
    })

    return NextResponse.json(report)
  } catch (error) {
    console.error("Error accepting report:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

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

    if (!user || user.role !== "DEPT_ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const { resolution } = body

    // Update the report to resolved
    const report = await prisma.report.update({
      where: {
        id: params.id,
        assignedToId: user.id, // Ensure the report is assigned to this admin
      },
      data: {
        status: "RESOLVED",
      },
    })

    // Create update record
    await prisma.reportUpdate.create({
      data: {
        reportId: params.id,
        message: `Resolution: ${resolution}`,
        status: "RESOLVED",
        updatedById: user.id,
      },
    })

    return NextResponse.json(report)
  } catch (error) {
    console.error("Error resolving report:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

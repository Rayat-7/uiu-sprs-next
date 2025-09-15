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

    // Update the report to completed
    const report = await prisma.report.update({
      where: { id: params.id },
      data: {
        status: "COMPLETED",
      },
      include: {
        student: true,
      },
    })

    // Create update record
    await prisma.reportUpdate.create({
      data: {
        reportId: params.id,
        message: "Report has been approved and marked as completed. The student has been notified via email.",
        status: "COMPLETED",
        updatedById: user.id,
      },
    })

    // TODO: Send email notification to student
    // This would integrate with your email service (SendGrid, Resend, etc.)

    return NextResponse.json(report)
  } catch (error) {
    console.error("Error approving report:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check if user has submitted a report in the last week
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

    const recentReport = await prisma.report.findFirst({
      where: {
        studentId: user.id,
        createdAt: {
          gte: oneWeekAgo,
        },
      },
    })

    if (recentReport) {
      return NextResponse.json({ error: "You can only submit one report per week" }, { status: 429 })
    }

    const body = await request.json()
    const { title, description, category, priority, fileUrl } = body

    const report = await prisma.report.create({
      data: {
        title,
        description,
        category,
        priority,
        fileUrl,
        studentId: user.id,
        status: "SUBMITTED",
      },
    })

    // Create initial update
    await prisma.reportUpdate.create({
      data: {
        reportId: report.id,
        message: "Report submitted successfully and is awaiting review by DSW administration.",
        status: "SUBMITTED",
        updatedById: user.id,
      },
    })

    return NextResponse.json(report)
  } catch (error) {
    console.error("Error creating report:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

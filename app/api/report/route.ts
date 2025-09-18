import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get reports based on user role
    let reports
    if (user.role === "STUDENT") {
      reports = await prisma.report.findMany({
        where: { studentId: user.id },
        include: {
          updates: {
            include: {
              updatedBy: {
                select: {
                  firstName: true,
                  lastName: true,
                  role: true,
                },
              },
            },
            orderBy: { createdAt: "desc" },
          },
        },
        orderBy: { createdAt: "desc" },
      })
    } else {
      reports = await prisma.report.findMany({
        include: {
          student: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          assignedTo: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          updates: {
            include: {
              updatedBy: {
                select: {
                  firstName: true,
                  lastName: true,
                  role: true,
                },
              },
            },
            orderBy: { createdAt: "desc" },
          },
        },
        orderBy: { createdAt: "desc" },
      })
    }

    return NextResponse.json({ reports })
  } catch (error) {
    console.error("Error fetching reports:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    console.log("Auth userId:", userId) // Debug log

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized - No userId" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    })
    
    console.log("Found user:", user) // Debug log

    if (!user) {
      return NextResponse.json({ error: "User not found in database" }, { status: 404 })
    }

    if (user.role !== "STUDENT") {
      return NextResponse.json({ error: "Only students can submit reports" }, { status: 403 })
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
    console.log("Request body:", body) // Debug log
    
    const { title, description, category, priority, fileUrl } = body

    // Validate required fields
    if (!title || !description || !category) {
      return NextResponse.json({ 
        error: "Title, description, and category are required" 
      }, { status: 400 })
    }

    const report = await prisma.report.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        category,
        priority: priority || "MEDIUM",
        fileUrl,
        studentId: user.id,
        status: "SUBMITTED",
      },
    })
    
    console.log("Created report:", report) // Debug log

    // Create initial update
    await prisma.reportUpdate.create({
      data: {
        reportId: report.id,
        message: "Report submitted successfully and is awaiting review by DSW administration.",
        status: "SUBMITTED",
        updatedById: user.id,
      },
    })

    return NextResponse.json({ 
      success: true, 
      report,
      message: "Report submitted successfully" 
    }, { status: 201 })
  } catch (error) {
    console.error("Error creating report:", error)
    return NextResponse.json({ 
      error: "Internal server error", 
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}










// import { type NextRequest, NextResponse } from "next/server"
// import { auth } from "@clerk/nextjs/server"
// import { prisma } from "@/lib/prisma"

// export async function POST(request: NextRequest) {
//   try {
//     const { userId } = auth()

//     if (!userId) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     const user = await prisma.user.findUnique({
//       where: { clerkId: userId },
//     })

//     if (!user) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 })
//     }

//     // Check if user has submitted a report in the last week
//     const oneWeekAgo = new Date()
//     oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

//     const recentReport = await prisma.report.findFirst({
//       where: {
//         studentId: user.id,
//         createdAt: {
//           gte: oneWeekAgo,
//         },
//       },
//     })

//     if (recentReport) {
//       return NextResponse.json({ error: "You can only submit one report per week" }, { status: 429 })
//     }

//     const body = await request.json()
//     const { title, description, category, priority, fileUrl } = body

//     const report = await prisma.report.create({
//       data: {
//         title,
//         description,
//         category,
//         priority,
//         fileUrl,
//         studentId: user.id,
//         status: "SUBMITTED",
//       },
//     })

//     // Create initial update
//     await prisma.reportUpdate.create({
//       data: {
//         reportId: report.id,
//         message: "Report submitted successfully and is awaiting review by DSW administration.",
//         status: "SUBMITTED",
//         updatedById: user.id,
//       },
//     })

//     return NextResponse.json(report)
//   } catch (error) {
//     console.error("Error creating report:", error)
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 })
//   }
// }

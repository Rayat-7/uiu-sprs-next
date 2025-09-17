import { auth, currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DebugAuth } from "@/components/debug-auth"

function isUIUEmail(email: string): boolean {
  if (!email) return false
  return email.toLowerCase().includes(".uiu.ac.bd")
}

export default async function PublicPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect("/")
  }

  // Get full user data from Clerk
  const clerkUser = await currentUser()
  const email = clerkUser?.emailAddresses?.[0]?.emailAddress

  console.log("Server - User ID:", userId)
  console.log("Server - Clerk User:", clerkUser ? "Found" : "Not found")
  console.log("Server - Email:", email)
  console.log("Server - Email addresses:", clerkUser?.emailAddresses?.map(e => e.emailAddress))
  console.log("Server - Is UIU Email:", isUIUEmail(email || ""))

  if (!email || !isUIUEmail(email)) {
    console.log("Server - Redirecting to unauthorized due to invalid email")
    redirect("/unauthorized")
  }

  // Try to sync user
  try {
    const user = await prisma.user.upsert({
      where: { clerkId: userId },
      update: {
        email: email,
        firstName: clerkUser?.firstName || "",
        lastName: clerkUser?.lastName || "",
      },
      create: {
        clerkId: userId,
        email: email,
        firstName: clerkUser?.firstName || "",
        lastName: clerkUser?.lastName || "",
        role: "STUDENT",
      },
    })

    console.log("Server - User synced:", user.email, user.role)
  } catch (error) {
    console.error("Server - Error syncing user:", error)
  }

  // Fetch reports for display
  const reports = await prisma.report.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      category: true,
      status: true,
      priority: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
  })

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🎉 Welcome to UIU SPRS!</h1>
        
        <Card className="mb-8 bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-green-800">✅ Access Granted!</CardTitle>
          </CardHeader>
          <CardContent className="text-green-700">
            <p>Your UIU email has been validated and you now have access to the system.</p>
          </CardContent>
        </Card>
        
        <DebugAuth />
        
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Server-side Validation Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div><strong>User ID:</strong> {userId}</div>
              <div><strong>Email:</strong> {email}</div>
              <div><strong>First Name:</strong> {clerkUser?.firstName || "Not set"}</div>
              <div><strong>Last Name:</strong> {clerkUser?.lastName || "Not set"}</div>
              <div><strong>Is Valid UIU:</strong> 
                <span className="ml-2 text-green-600 font-semibold">
                  ✅ {isUIUEmail(email || "") ? "Yes" : "No"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Available Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <a 
                href="/dashboard/student" 
                className="block bg-blue-600 text-white px-6 py-3 rounded-lg text-center hover:bg-blue-700 transition-colors"
              >
                Go to Student Dashboard
              </a>
              <p className="text-sm text-gray-600">
                Note: Additional dashboard options will appear in the sidebar based on your role in the database.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Recent Reports ({reports.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {reports.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No reports found. Be the first to submit a report!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reports.map((report) => (
                  <div key={report.id} className="border p-4 rounded-lg bg-white">
                    <h3 className="font-semibold">{report.title}</h3>
                    <p className="text-gray-600 mt-1">{report.description}</p>
                    <div className="text-sm text-gray-500 mt-2 flex space-x-4">
                      <span>Category: {report.category}</span>
                      <span>Status: {report.status}</span>
                      <span>Priority: {report.priority}</span>
                      <span>Date: {new Date(report.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
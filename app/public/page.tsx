import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Filter, TrendingUp, CheckCircle, Clock, AlertCircle } from "lucide-react"
import { formatReportStatus, getReportStatusColor } from "@/lib/utils"

interface SearchParams {
  category?: string
  status?: string
  priority?: string
  search?: string
}

export default async function PublicPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const user = await getCurrentUser()

  // Get all reports for public view (anonymized)
  const reports = await prisma.report.findMany({
    where: {
      ...(searchParams.category && { category: searchParams.category }),
      ...(searchParams.status && { status: searchParams.status }),
      ...(searchParams.priority && { priority: searchParams.priority }),
      ...(searchParams.search && {
        OR: [
          { title: { contains: searchParams.search, mode: 'insensitive' } },
          { description: { contains: searchParams.search, mode: 'insensitive' } },
          { category: { contains: searchParams.search, mode: 'insensitive' } },
        ],
      }),
    },
    include: {
      updates: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  // Calculate statistics
  const totalReports = reports.length
  const completedReports = reports.filter(r => ["COMPLETED", "APPROVED"].includes(r.status)).length
  const inProgressReports = reports.filter(r => ["IN_PROGRESS", "ASSIGNED_TO_DEPARTMENT"].includes(r.status)).length
  const pendingReports = reports.filter(r => r.status === "SUBMITTED").length

  // Get unique categories for filter
  const categories = [...new Set(reports.map(r => r.category))].sort()

  return (
    <div className="min-h-screen bg-background">
      <Sidebar userRole={user.role as any} />
      <Header 
        title="Public Report View" 
        subtitle="Transparent view of all student reports and their resolution status"
      />

      <main className="lg:ml-80 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Statistics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalReports}</div>
                <p className="text-xs text-muted-foreground">All student submissions</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{pendingReports}</div>
                <p className="text-xs text-muted-foreground">Awaiting assignment</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{inProgressReports}</div>
                <p className="text-xs text-muted-foreground">Being resolved</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{completedReports}</div>
                <p className="text-xs text-muted-foreground">Successfully resolved</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Filter className="h-5 w-5" />
                <span>Filter Reports</span>
              </CardTitle>
              <CardDescription>
                Filter and search through all student reports to find specific issues or track resolution patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Search</label>
                  <Input
                    placeholder="Search reports..."
                    defaultValue={searchParams.search || ""}
                    name="search"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Category</label>
                  <Select defaultValue={searchParams.category || ""}>
                    <SelectTrigger>
                      <SelectValue placeholder="All categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Status</label>
                  <Select defaultValue={searchParams.status || ""}>
                    <SelectTrigger>
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All statuses</SelectItem>
                      <SelectItem value="SUBMITTED">Submitted</SelectItem>
                      <SelectItem value="ASSIGNED_TO_DEPARTMENT">Assigned</SelectItem>
                      <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                      <SelectItem value="RESOLVED">Resolved</SelectItem>
                      <SelectItem value="APPROVED">Approved</SelectItem>
                      <SelectItem value="COMPLETED">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Priority</label>
                  <Select defaultValue={searchParams.priority || ""}>
                    <SelectTrigger>
                      <SelectValue placeholder="All priorities" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All priorities</SelectItem>
                      <SelectItem value="LOW">Low</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="HIGH">High</SelectItem>
                      <SelectItem value="URGENT">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reports List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>All Reports ({reports.length})</span>
                <Badge variant="outline" className="text-xs">
                  Last updated: {new Date().toLocaleDateString()}
                </Badge>
              </CardTitle>
              <CardDescription>
                Anonymous view of all student reports. Personal information is hidden to maintain privacy.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {reports.length > 0 ? (
                <div className="space-y-4">
                  {reports.map((report, index) => (
                    <Card key={report.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center space-x-2">
                                <h3 className="font-semibold text-lg">{report.title}</h3>
                                <Badge variant="outline" className="text-xs">
                                  Report #{totalReports - index}
                                </Badge>
                              </div>
                              <p className="text-muted-foreground">
                                {report.description.length > 200
                                  ? `${report.description.substring(0, 200)}...`
                                  : report.description}
                              </p>
                              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                <span>Category: <strong>{report.category}</strong></span>
                                <span>Priority: <strong>{report.priority}</strong></span>
                                <span>Submitted: <strong>{new Date(report.createdAt).toLocaleDateString()}</strong></span>
                                {report.updates && report.updates.length > 0 && (
                                  <span>Last Update: <strong>{new Date(report.updates[0].createdAt).toLocaleDateString()}</strong></span>
                                )}
                              </div>
                            </div>
                            <div className="flex flex-col items-end space-y-2">
                              <Badge className={getReportStatusColor(report.status)} variant="secondary">
                                {formatReportStatus(report.status)}
                              </Badge>
                              <Badge
                                variant={
                                  report.priority === "HIGH" || report.priority === "URGENT" 
                                    ? "destructive" 
                                    : "outline"
                                }
                                className="text-xs"
                              >
                                {report.priority}
                              </Badge>
                            </div>
                          </div>
                          
                          {/* Show latest update if available */}
                          {report.updates && report.updates.length > 0 && (
                            <div className="bg-muted rounded-lg p-3 border-l-4 border-l-primary">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium">Latest Update</span>
                                <Badge className={getReportStatusColor(report.updates[0].status)} variant="secondary" className="text-xs">
                                  {formatReportStatus(report.updates[0].status)}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">{report.updates[0].message}</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Reports Found</h3>
                  <p className="text-muted-foreground">
                    {searchParams.search || searchParams.category || searchParams.status || searchParams.priority
                      ? "Try adjusting your filters to see more results."
                      : "No student reports have been submitted yet."}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}













// import { auth, currentUser } from "@clerk/nextjs/server"
// import { redirect } from "next/navigation"
// import { prisma } from "@/lib/prisma"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { DebugAuth } from "@/components/debug-auth"

// function isUIUEmail(email: string): boolean {
//   if (!email) return false
//   return email.toLowerCase().includes(".uiu.ac.bd")
// }

// export default async function PublicPage() {
//   const { userId } = await auth()

//   if (!userId) {
//     redirect("/")
//   }

//   // Get full user data from Clerk
//   const clerkUser = await currentUser()
//   const email = clerkUser?.emailAddresses?.[0]?.emailAddress

//   console.log("Server - User ID:", userId)
//   console.log("Server - Clerk User:", clerkUser ? "Found" : "Not found")
//   console.log("Server - Email:", email)
//   console.log("Server - Email addresses:", clerkUser?.emailAddresses?.map(e => e.emailAddress))
//   console.log("Server - Is UIU Email:", isUIUEmail(email || ""))

//   if (!email || !isUIUEmail(email)) {
//     console.log("Server - Redirecting to unauthorized due to invalid email")
//     redirect("/unauthorized")
//   }

//   // Try to sync user
//   try {
//     const user = await prisma.user.upsert({
//       where: { clerkId: userId },
//       update: {
//         email: email,
//         firstName: clerkUser?.firstName || "",
//         lastName: clerkUser?.lastName || "",
//       },
//       create: {
//         clerkId: userId,
//         email: email,
//         firstName: clerkUser?.firstName || "",
//         lastName: clerkUser?.lastName || "",
//         role: "STUDENT",
//       },
//     })

//     console.log("Server - User synced:", user.email, user.role)
//   } catch (error) {
//     console.error("Server - Error syncing user:", error)
//   }

//   // Fetch reports for display
//   const reports = await prisma.report.findMany({
//     select: {
//       id: true,
//       title: true,
//       description: true,
//       category: true,
//       status: true,
//       priority: true,
//       createdAt: true,
//     },
//     orderBy: {
//       createdAt: "desc",
//     },
//     take: 10,
//   })

//   return (
//     <div className="min-h-screen bg-gray-50 p-8">
//       <div className="max-w-6xl mx-auto">
//         <h1 className="text-3xl font-bold mb-8">🎉 Welcome to UIU SPRS!</h1>
        
//         <Card className="mb-8 bg-green-50 border-green-200">
//           <CardHeader>
//             <CardTitle className="text-green-800">✅ Access Granted!</CardTitle>
//           </CardHeader>
//           <CardContent className="text-green-700">
//             <p>Your UIU email has been validated and you now have access to the system.</p>
//           </CardContent>
//         </Card>
        
//         <DebugAuth />
        
//         <Card className="mt-8">
//           <CardHeader>
//             <CardTitle>Server-side Validation Results</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-2">
//               <div><strong>User ID:</strong> {userId}</div>
//               <div><strong>Email:</strong> {email}</div>
//               <div><strong>First Name:</strong> {clerkUser?.firstName || "Not set"}</div>
//               <div><strong>Last Name:</strong> {clerkUser?.lastName || "Not set"}</div>
//               <div><strong>Is Valid UIU:</strong> 
//                 <span className="ml-2 text-green-600 font-semibold">
//                   ✅ {isUIUEmail(email || "") ? "Yes" : "No"}
//                 </span>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="mt-8">
//           <CardHeader>
//             <CardTitle>Available Actions</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               <a 
//                 href="/dashboard/student" 
//                 className="block bg-blue-600 text-white px-6 py-3 rounded-lg text-center hover:bg-blue-700 transition-colors"
//               >
//                 Go to Student Dashboard
//               </a>
//               <p className="text-sm text-gray-600">
//                 Note: Additional dashboard options will appear in the sidebar based on your role in the database.
//               </p>
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="mt-8">
//           <CardHeader>
//             <CardTitle>Recent Reports ({reports.length})</CardTitle>
//           </CardHeader>
//           <CardContent>
//             {reports.length === 0 ? (
//               <div className="text-center py-8 text-gray-500">
//                 <p>No reports found. Be the first to submit a report!</p>
//               </div>
//             ) : (
//               <div className="space-y-4">
//                 {reports.map((report) => (
//                   <div key={report.id} className="border p-4 rounded-lg bg-white">
//                     <h3 className="font-semibold">{report.title}</h3>
//                     <p className="text-gray-600 mt-1">{report.description}</p>
//                     <div className="text-sm text-gray-500 mt-2 flex space-x-4">
//                       <span>Category: {report.category}</span>
//                       <span>Status: {report.status}</span>
//                       <span>Priority: {report.priority}</span>
//                       <span>Date: {new Date(report.createdAt).toLocaleDateString()}</span>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   )
// }
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { ReportForm } from "@/components/forms/report-form"
import { ReportsList } from "@/components/reports/reports-list"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Clock, CheckCircle, AlertCircle, TrendingUp } from "lucide-react"

export default async function StudentDashboard() {
  const user = await getCurrentUser()

  // Get user's reports
  const reports = await prisma.report.findMany({
    where: {
      studentId: user.id,
    },
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
        orderBy: {
          createdAt: "desc",
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  // Check if user can submit a new report (one per week limit)
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

  const canSubmitReport = !recentReport

  // Calculate stats
  const totalReports = reports.length
  const pendingReports = reports.filter((r) => !["COMPLETED", "APPROVED"].includes(r.status)).length
  const completedReports = reports.filter((r) => ["COMPLETED", "APPROVED"].includes(r.status)).length
<<<<<<< HEAD
  const inProgressReports = reports.filter((r) => r.status === "IN_PROGRESS").length

  // Calculate next submission date
  const nextSubmissionDate = recentReport 
    ? new Date(recentReport.createdAt.getTime() + 7 * 24 * 60 * 60 * 1000)
    : null
=======
  const inProgressReports = reports.filter((r) => ["IN_PROGRESS", "ASSIGNED_TO_DEPARTMENT"].includes(r.status)).length
>>>>>>> cbf613db0e54aabe58a7987705a55a877d97cc37

  return (
    <div className="min-h-screen bg-background">
      <Sidebar userRole={user.role as any} />
      <Header 
        title="Student Dashboard" 
        subtitle={`Welcome back, ${user.firstName || 'Student'}`}
        notificationCount={pendingReports}
      />

<<<<<<< HEAD
      <main className="lg:ml-80 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalReports}</div>
                <p className="text-xs text-muted-foreground">All time submissions</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{pendingReports}</div>
                <p className="text-xs text-muted-foreground">Awaiting resolution</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{inProgressReports}</div>
                <p className="text-xs text-muted-foreground">Being worked on</p>
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Report Form */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5" />
                    <span>Submit New Report</span>
                  </CardTitle>
                  <CardDescription>
                    Report issues and track their progress transparently
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {!canSubmitReport ? (
                    <div className="text-center py-8 space-y-4">
                      <AlertCircle className="h-12 w-12 text-orange-500 mx-auto" />
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Weekly Limit Reached</h3>
                        <p className="text-gray-600 text-sm mb-4">
                          You can only submit one report per week to ensure quality and prevent spam.
=======
      <div className="flex-1 flex flex-col">
        <Header title="Student Dashboard" userRole={user.role as any} />

        <main className="flex-1 overflow-y-auto p-4 lg:p-6 lg:ml-72">
          <div className="max-w-7xl mx-auto">
            {/* Welcome Section */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, {user.firstName}!
              </h2>
              <p className="text-gray-600">
                Track your reports and submit new issues through the student reporting system.
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-blue-100">Total Reports</CardTitle>
                  <FileText className="h-4 w-4 text-blue-200" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalReports}</div>
                  <p className="text-xs text-blue-100">All time submissions</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-orange-100">Pending</CardTitle>
                  <Clock className="h-4 w-4 text-orange-200" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{pendingReports}</div>
                  <p className="text-xs text-orange-100">Awaiting resolution</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-purple-100">In Progress</CardTitle>
                  <TrendingUp className="h-4 w-4 text-purple-200" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{inProgressReports}</div>
                  <p className="text-xs text-purple-100">Being worked on</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-green-100">Completed</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-200" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{completedReports}</div>
                  <p className="text-xs text-green-100">Successfully resolved</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Report Form */}
              <div className="lg:col-span-1">
                <Card className="h-fit">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FileText className="h-5 w-5 mr-2 text-blue-600" />
                      Submit New Report
                    </CardTitle>
                    <CardDescription>Report issues and track their progress</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {!canSubmitReport ? (
                      <div className="text-center py-8">
                        <AlertCircle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Report Limit Reached</h3>
                        <p className="text-gray-600 text-sm mb-4">
                          You can only submit one report per week. Please wait before submitting another report.
>>>>>>> cbf613db0e54aabe58a7987705a55a877d97cc37
                        </p>
                        <Badge variant="outline" className="text-xs">
                          Next submission: {nextSubmissionDate?.toLocaleDateString()}
                        </Badge>
                      </div>
                    </div>
                  ) : (
                    <ReportForm userId={user.id} />
                  )}
                </CardContent>
              </Card>
            </div>

<<<<<<< HEAD
            {/* Reports List */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="h-5 w-5" />
                    <span>My Reports</span>
                  </CardTitle>
                  <CardDescription>
                    Track the progress of your submitted reports through the resolution process
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ReportsList reports={reports} showStudentInfo={false} />
                </CardContent>
              </Card>
=======
              {/* Reports List */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Clock className="h-5 w-5 mr-2 text-purple-600" />
                      My Reports
                    </CardTitle>
                    <CardDescription>Track the progress of your submitted reports</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ReportsList reports={reports} showStudentInfo={false} />
                  </CardContent>
                </Card>
              </div>
>>>>>>> cbf613db0e54aabe58a7987705a55a877d97cc37
            </div>
          </div>
        </div>
      </main>
    </div>
  )
<<<<<<< HEAD
}













// import { getCurrentUser } from "@/lib/auth"
// import { prisma } from "@/lib/prisma"
// import { Sidebar } from "@/components/layout/sidebar"
// import { Header } from "@/components/layout/header"
// import { ReportForm } from "@/components/forms/report-from"
// import { ReportsList } from "@/components/reports/reports-list"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { FileText, Clock, CheckCircle, AlertCircle } from "lucide-react"

// export default async function StudentDashboard() {
//   const user = await getCurrentUser()

//   // Get user's reports
//   const reports = await prisma.report.findMany({
//     where: {
//       studentId: user.id,
//     },
//     include: {
//       updates: {
//         orderBy: {
//           createdAt: "desc",
//         },
//       },
//     },
//     orderBy: {
//       createdAt: "desc",
//     },
//   })

//   // Check if user can submit a new report (one per week limit)
//   const oneWeekAgo = new Date()
//   oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

//   const recentReport = await prisma.report.findFirst({
//     where: {
//       studentId: user.id,
//       createdAt: {
//         gte: oneWeekAgo,
//       },
//     },
//   })

//   const canSubmitReport = !recentReport

//   // Calculate stats
//   const totalReports = reports.length
//   const pendingReports = reports.filter((r) => !["COMPLETED", "APPROVED"].includes(r.status)).length
//   const completedReports = reports.filter((r) => ["COMPLETED", "APPROVED"].includes(r.status)).length

//   return (
//     <div className="flex h-screen bg-gray-50">
//       <Sidebar userRole={user.role as any} />

//       <div className="flex-1 flex flex-col lg:ml-0">
//         <Header title="Student Dashboard" />

//         <main className="flex-1 overflow-y-auto p-6">
//           <div className="max-w-7xl mx-auto">
//             {/* Stats Cards */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//               <Card>
//                 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                   <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
//                   <FileText className="h-4 w-4 text-muted-foreground" />
//                 </CardHeader>
//                 <CardContent>
//                   <div className="text-2xl font-bold">{totalReports}</div>
//                 </CardContent>
//               </Card>

//               <Card>
//                 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                   <CardTitle className="text-sm font-medium">Pending</CardTitle>
//                   <Clock className="h-4 w-4 text-muted-foreground" />
//                 </CardHeader>
//                 <CardContent>
//                   <div className="text-2xl font-bold text-orange-600">{pendingReports}</div>
//                 </CardContent>
//               </Card>

//               <Card>
//                 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                   <CardTitle className="text-sm font-medium">Completed</CardTitle>
//                   <CheckCircle className="h-4 w-4 text-muted-foreground" />
//                 </CardHeader>
//                 <CardContent>
//                   <div className="text-2xl font-bold text-green-600">{completedReports}</div>
//                 </CardContent>
//               </Card>
//             </div>

//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//               {/* Report Form */}
//               <div className="lg:col-span-1">
//                 <Card>
//                   <CardHeader>
//                     <CardTitle>Submit New Report</CardTitle>
//                     <CardDescription>Report issues and track their progress</CardDescription>
//                   </CardHeader>
//                   <CardContent>
//                     {!canSubmitReport ? (
//                       <div className="text-center py-8">
//                         <AlertCircle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
//                         <h3 className="text-lg font-medium text-gray-900 mb-2">Report Limit Reached</h3>
//                         <p className="text-gray-600 text-sm">
//                           You can only submit one report per week. Please wait before submitting another report.
//                         </p>
//                         <Badge variant="outline" className="mt-4">
//                           Next submission available:{" "}
//                           {new Date(recentReport!.createdAt.getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}
//                         </Badge>
//                       </div>
//                     ) : (
//                       <ReportForm userId={user.id} />
//                     )}
//                   </CardContent>
//                 </Card>
//               </div>

//               {/* Reports List */}
//               <div className="lg:col-span-2">
//                 <Card>
//                   <CardHeader>
//                     <CardTitle>My Reports</CardTitle>
//                     <CardDescription>Track the progress of your submitted reports</CardDescription>
//                   </CardHeader>
//                   <CardContent>
//                     <ReportsList reports={reports} showStudentInfo={false} />
//                   </CardContent>
//                 </Card>
//               </div>
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>
//   )
// }
=======
}
>>>>>>> cbf613db0e54aabe58a7987705a55a877d97cc37

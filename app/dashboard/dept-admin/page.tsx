import { requireRole } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { ReportsList } from "@/components/reports/reports-list"
import { ResolutionForm } from "@/components/forms/resolution-form"
import { AcceptReportForm } from "@/components/forms/accept-report-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
<<<<<<< HEAD
import { FileText, Clock, CheckCircle, AlertCircle, TrendingUp, Building2 } from "lucide-react"
=======
import { FileText, Clock, CheckCircle, AlertCircle, Building2, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
>>>>>>> cbf613db0e54aabe58a7987705a55a877d97cc37

export default async function DeptAdminDashboard() {
  const user = await requireRole(["DEPT_ADMIN"])

  // Get reports assigned to this department admin
  const assignedReports = await prisma.report.findMany({
    where: {
      assignedToId: user.id,
    },
    include: {
      student: {
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
        orderBy: {
          createdAt: "desc",
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  // Separate reports by status
  const newAssignments = assignedReports.filter((r) => r.status === "ASSIGNED_TO_DEPARTMENT")
  const inProgress = assignedReports.filter((r) => r.status === "IN_PROGRESS")
  const resolved = assignedReports.filter((r) => r.status === "RESOLVED")
  const completed = assignedReports.filter((r) => r.status === "APPROVED" || r.status === "COMPLETED")

  // Calculate stats
  const totalAssigned = assignedReports.length
  const pendingAction = newAssignments.length + inProgress.length
  const awaitingApproval = resolved.length
<<<<<<< HEAD
  const thisWeekAssigned = assignedReports.filter(r => {
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return new Date(r.createdAt) > weekAgo
  }).length
=======
  const urgentReports = assignedReports.filter((r) => r.priority === "URGENT" && !["COMPLETED", "APPROVED"].includes(r.status)).length
>>>>>>> cbf613db0e54aabe58a7987705a55a877d97cc37

  return (
    <div className="min-h-screen bg-background">
      <Sidebar userRole={user.role as any} />
      <Header 
        title="Department Admin Dashboard" 
        subtitle={`Welcome ${user.firstName || 'Admin'} - Resolve assigned reports`}
        notificationCount={pendingAction}
      />

<<<<<<< HEAD
      <main className="lg:ml-80 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Assigned</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalAssigned}</div>
                <p className="text-xs text-muted-foreground">All time assignments</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">This Week</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{thisWeekAssigned}</div>
                <p className="text-xs text-muted-foreground">New assignments</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Need Action</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{pendingAction}</div>
                <p className="text-xs text-muted-foreground">Requiring attention</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Awaiting DSW</CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{awaitingApproval}</div>
                <p className="text-xs text-muted-foreground">Pending approval</p>
              </CardContent>
            </Card>
          </div>

          {/* Reports Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building2 className="h-5 w-5" />
                <span>Department Report Management</span>
              </CardTitle>
              <CardDescription>
                Handle reports assigned to your department and provide resolutions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="new" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="new" className="relative">
                    New Assignments
                    {newAssignments.length > 0 && (
                      <Badge variant="destructive" className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
                        {newAssignments.length}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="progress" className="relative">
                    In Progress
                    {inProgress.length > 0 && (
                      <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
                        {inProgress.length}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="resolved" className="relative">
                    Resolved
                    {resolved.length > 0 && (
                      <Badge variant="outline" className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
                        {resolved.length}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                </TabsList>

                <TabsContent value="new" className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">New Assignments</h3>
                      <Badge variant="outline">{newAssignments.length} reports</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Reports assigned to your department that need immediate attention and acknowledgment.
                    </p>
                    
                    {newAssignments.length > 0 ? (
                      <div className="space-y-6">
                        {newAssignments.map((report) => (
                          <Card key={report.id} className="border-l-4 border-l-red-500">
                            <CardContent className="pt-6">
                              <div className="space-y-4">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1 space-y-2">
                                    <h4 className="font-semibold text-lg">{report.title}</h4>
                                    <p className="text-muted-foreground">{report.description}</p>
                                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                      <span>Category: <strong>{report.category}</strong></span>
                                      <span>Priority: <strong>{report.priority}</strong></span>
                                      <span>
                                        Student: <strong>{report.student?.firstName} {report.student?.lastName}</strong>
                                      </span>
                                      <span>
                                        Assigned: <strong>{new Date(report.updatedAt).toLocaleDateString()}</strong>
                                      </span>
                                    </div>
                                    {report.fileUrl && (
                                      <div className="mt-2">
                                        <a
                                          href={report.fileUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-primary hover:underline text-sm font-medium"
                                        >
                                          📎 View Attached Evidence
                                        </a>
                                      </div>
                                    )}
                                  </div>
                                  <Badge
                                    variant={
                                      report.priority === "HIGH" || report.priority === "URGENT" 
                                        ? "destructive" 
                                        : "outline"
                                    }
                                  >
                                    {report.priority}
                                  </Badge>
                                </div>
                                
                                {/* Show latest update from DSW */}
                                {report.updates && report.updates.length > 0 && (
                                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <h5 className="font-medium text-blue-900 mb-2">Assignment Message:</h5>
                                    <p className="text-sm text-blue-800">{report.updates[0].message}</p>
                                    <p className="text-xs text-blue-600 mt-2">
                                      From DSW Admin • {new Date(report.updates[0].createdAt).toLocaleDateString()}
                                    </p>
=======
      <div className="flex-1 flex flex-col">
        <Header title="Department Admin Dashboard" userRole={user.role as any} />

        <main className="flex-1 overflow-y-auto p-4 lg:p-6 lg:ml-72">
          <div className="max-w-7xl mx-auto">
            {/* Welcome Section */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Department Administration Center
              </h2>
              <p className="text-gray-600">
                Manage assigned reports, work on resolutions, and provide feedback to DSW administration.
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-blue-100">Total Assigned</CardTitle>
                  <FileText className="h-4 w-4 text-blue-200" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalAssigned}</div>
                  <p className="text-xs text-blue-100">Reports assigned to you</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-orange-100">Pending Action</CardTitle>
                  <Clock className="h-4 w-4 text-orange-200" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{pendingAction}</div>
                  <p className="text-xs text-orange-100">Need your attention</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-purple-100">Awaiting DSW Approval</CardTitle>
                  <AlertCircle className="h-4 w-4 text-purple-200" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{awaitingApproval}</div>
                  <p className="text-xs text-purple-100">Resolved by you</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-red-100">Urgent Reports</CardTitle>
                  <AlertCircle className="h-4 w-4 text-red-200" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{urgentReports}</div>
                  <p className="text-xs text-red-100">High priority</p>
                </CardContent>
              </Card>
            </div>

            {/* Reports Tabs */}
            <Tabs defaultValue="new" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4 bg-white border">
                <TabsTrigger value="new" className="relative data-[state=active]:bg-red-50 data-[state=active]:text-red-700">
                  New Assignments
                  {newAssignments.length > 0 && (
                    <Badge variant="destructive" className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
                      {newAssignments.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="progress" className="relative data-[state=active]:bg-orange-50 data-[state=active]:text-orange-700">
                  In Progress
                  {inProgress.length > 0 && (
                    <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
                      {inProgress.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="resolved" className="relative data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700">
                  Resolved
                  {resolved.length > 0 && (
                    <Badge variant="outline" className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
                      {resolved.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="completed" className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700">
                  Completed
                </TabsTrigger>
              </TabsList>

              <TabsContent value="new" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <AlertCircle className="h-5 w-5 mr-2 text-red-600" />
                      New Assignments
                    </CardTitle>
                    <CardDescription>Reports assigned to your department that need immediate attention</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {newAssignments.length > 0 ? (
                      <div className="space-y-6">
                        {newAssignments.map((report) => (
                          <div key={report.id} className="border rounded-lg p-6 space-y-4 bg-white shadow-sm">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h3 className="font-semibold text-lg text-gray-900">{report.title}</h3>
                                <p className="text-gray-600 mt-2">{report.description}</p>
                                <div className="flex items-center space-x-6 mt-3 text-sm text-gray-500">
                                  <span className="flex items-center">
                                    <Building2 className="h-4 w-4 mr-1" />
                                    {report.category}
                                  </span>
                                  <span className="flex items-center">
                                    <Users className="h-4 w-4 mr-1" />
                                    {report.student?.firstName} {report.student?.lastName}
                                  </span>
                                  <span className="flex items-center">
                                    <Clock className="h-4 w-4 mr-1" />
                                    {new Date(report.createdAt).toLocaleDateString()}
                                  </span>
                                </div>
                                {report.fileUrl && (
                                  <div className="mt-3">
                                    <a
                                      href={report.fileUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:underline text-sm flex items-center"
                                    >
                                      <FileText className="h-4 w-4 mr-1" />
                                      View Attached File
                                    </a>
>>>>>>> cbf613db0e54aabe58a7987705a55a877d97cc37
                                  </div>
                                )}
                                
                                <AcceptReportForm reportId={report.id} />
                              </div>
<<<<<<< HEAD
                            </CardContent>
                          </Card>
=======
                              <Badge
                                variant={
                                  report.priority === "HIGH" || report.priority === "URGENT" ? "destructive" : "outline"
                                }
                                className="ml-4"
                              >
                                {report.priority}
                              </Badge>
                            </div>
                            <div className="flex space-x-3 pt-4 border-t">
                              <form action={`/api/report/${report.id}/accept`} method="POST" className="inline">
                                <Button
                                  type="submit"
                                  className="bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Accept & Start Working
                                </Button>
                              </form>
                            </div>
                          </div>
>>>>>>> cbf613db0e54aabe58a7987705a55a877d97cc37
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">No New Assignments</h3>
                        <p className="text-muted-foreground">All assigned reports have been acknowledged.</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

<<<<<<< HEAD
                <TabsContent value="progress" className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Reports In Progress</h3>
                      <Badge variant="outline">{inProgress.length} reports</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Reports you are currently working on. Provide resolution details when completed.
                    </p>
                    
                    {inProgress.length > 0 ? (
                      <div className="space-y-6">
                        {inProgress.map((report) => (
                          <Card key={report.id} className="border-l-4 border-l-orange-500">
                            <CardContent className="pt-6">
                              <div className="space-y-4">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1 space-y-2">
                                    <h4 className="font-semibold text-lg">{report.title}</h4>
                                    <p className="text-muted-foreground">{report.description}</p>
                                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                      <span>Category: <strong>{report.category}</strong></span>
                                      <span>
                                        Student: <strong>{report.student?.firstName} {report.student?.lastName}</strong>
                                      </span>
                                      <span>
                                        Started: <strong>{new Date(report.updatedAt).toLocaleDateString()}</strong>
                                      </span>
                                    </div>
                                    {report.fileUrl && (
                                      <div className="mt-2">
                                        <a
                                          href={report.fileUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-primary hover:underline text-sm font-medium"
                                        >
                                          📎 View Attached Evidence
                                        </a>
                                      </div>
                                    )}
                                  </div>
                                  <Badge variant="secondary">In Progress</Badge>
=======
              <TabsContent value="progress" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Clock className="h-5 w-5 mr-2 text-orange-600" />
                      Reports In Progress
                    </CardTitle>
                    <CardDescription>Reports you are currently working on</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {inProgress.length > 0 ? (
                      <div className="space-y-6">
                        {inProgress.map((report) => (
                          <div key={report.id} className="border rounded-lg p-6 space-y-4 bg-white shadow-sm">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h3 className="font-semibold text-lg text-gray-900">{report.title}</h3>
                                <p className="text-gray-600 mt-2">{report.description}</p>
                                <div className="flex items-center space-x-6 mt-3 text-sm text-gray-500">
                                  <span className="flex items-center">
                                    <Building2 className="h-4 w-4 mr-1" />
                                    {report.category}
                                  </span>
                                  <span className="flex items-center">
                                    <Users className="h-4 w-4 mr-1" />
                                    {report.student?.firstName} {report.student?.lastName}
                                  </span>
>>>>>>> cbf613db0e54aabe58a7987705a55a877d97cc37
                                </div>
                                
                                <ResolutionForm reportId={report.id} />
                              </div>
<<<<<<< HEAD
                            </CardContent>
                          </Card>
=======
                              <Badge
                                variant={
                                  report.priority === "HIGH" || report.priority === "URGENT" ? "destructive" : "outline"
                                }
                                className="ml-4"
                              >
                                {report.priority}
                              </Badge>
                            </div>
                            <ResolutionForm reportId={report.id} />
                          </div>
>>>>>>> cbf613db0e54aabe58a7987705a55a877d97cc37
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">No Reports In Progress</h3>
                        <p className="text-muted-foreground">Accept new assignments to start working on them.</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

<<<<<<< HEAD
                <TabsContent value="resolved">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Resolved Reports</h3>
                      <Badge variant="outline">{resolved.length} reports</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Reports you have resolved, awaiting DSW admin approval and student notification.
                    </p>
=======
              <TabsContent value="resolved">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CheckCircle className="h-5 w-5 mr-2 text-purple-600" />
                      Resolved Reports
                    </CardTitle>
                    <CardDescription>Reports you have resolved, awaiting DSW admin approval</CardDescription>
                  </CardHeader>
                  <CardContent>
>>>>>>> cbf613db0e54aabe58a7987705a55a877d97cc37
                    <ReportsList reports={resolved} showStudentInfo={true} />
                  </div>
                </TabsContent>

<<<<<<< HEAD
                <TabsContent value="completed">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Completed Reports</h3>
                      <Badge variant="outline">{completed.length} reports</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Successfully resolved and approved reports with students notified.
                    </p>
=======
              <TabsContent value="completed">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                      Completed Reports
                    </CardTitle>
                    <CardDescription>Successfully resolved and approved reports</CardDescription>
                  </CardHeader>
                  <CardContent>
>>>>>>> cbf613db0e54aabe58a7987705a55a877d97cc37
                    <ReportsList reports={completed} showStudentInfo={true} />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
<<<<<<< HEAD
}
















// import { requireRole } from "@/lib/auth"
// import { prisma } from "@/lib/prisma"
// import { Sidebar } from "@/components/layout/sidebar"
// import { Header } from "@/components/layout/header"
// import { ReportsList } from "@/components/reports/reports-list"
// import { ResolutionForm } from "@/components/forms/resolution-form"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { FileText, Clock, CheckCircle, AlertCircle } from "lucide-react"

// export default async function DeptAdminDashboard() {
//   const user = await requireRole(["DEPT_ADMIN"])

//   // Get reports assigned to this department admin
//   const assignedReports = await prisma.report.findMany({
//     where: {
//       assignedToId: user.id,
//     },
//     include: {
//       student: {
//         select: {
//           firstName: true,
//           lastName: true,
//           email: true,
//         },
//       },
//       updates: {
//         include: {
//           updatedBy: {
//             select: {
//               firstName: true,
//               lastName: true,
//               role: true,
//             },
//           },
//         },
//         orderBy: {
//           createdAt: "desc",
//         },
//       },
//     },
//     orderBy: {
//       createdAt: "desc",
//     },
//   })

//   // Separate reports by status
//   const newAssignments = assignedReports.filter((r) => r.status === "ASSIGNED_TO_DEPARTMENT")
//   const inProgress = assignedReports.filter((r) => r.status === "IN_PROGRESS")
//   const resolved = assignedReports.filter((r) => r.status === "RESOLVED")
//   const completed = assignedReports.filter((r) => r.status === "APPROVED" || r.status === "COMPLETED")

//   // Calculate stats
//   const totalAssigned = assignedReports.length
//   const pendingAction = newAssignments.length + inProgress.length
//   const awaitingApproval = resolved.length

//   return (
//     <div className="flex h-screen bg-gray-50">
//       <Sidebar userRole={user.role as any} />

//       <div className="flex-1 flex flex-col lg:ml-0">
//         <Header title="Department Admin Dashboard" />

//         <main className="flex-1 overflow-y-auto p-6">
//           <div className="max-w-7xl mx-auto">
//             {/* Stats Cards */}
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//               <Card>
//                 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                   <CardTitle className="text-sm font-medium">Total Assigned</CardTitle>
//                   <FileText className="h-4 w-4 text-muted-foreground" />
//                 </CardHeader>
//                 <CardContent>
//                   <div className="text-2xl font-bold">{totalAssigned}</div>
//                 </CardContent>
//               </Card>

//               <Card>
//                 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                   <CardTitle className="text-sm font-medium">Pending Action</CardTitle>
//                   <Clock className="h-4 w-4 text-muted-foreground" />
//                 </CardHeader>
//                 <CardContent>
//                   <div className="text-2xl font-bold text-orange-600">{pendingAction}</div>
//                 </CardContent>
//               </Card>

//               <Card>
//                 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                   <CardTitle className="text-sm font-medium">Awaiting DSW Approval</CardTitle>
//                   <AlertCircle className="h-4 w-4 text-muted-foreground" />
//                 </CardHeader>
//                 <CardContent>
//                   <div className="text-2xl font-bold text-blue-600">{awaitingApproval}</div>
//                 </CardContent>
//               </Card>

//               <Card>
//                 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                   <CardTitle className="text-sm font-medium">Completed</CardTitle>
//                   <CheckCircle className="h-4 w-4 text-muted-foreground" />
//                 </CardHeader>
//                 <CardContent>
//                   <div className="text-2xl font-bold text-green-600">{completed.length}</div>
//                 </CardContent>
//               </Card>
//             </div>

//             {/* Reports Tabs */}
//             <Tabs defaultValue="new" className="space-y-6">
//               <TabsList className="grid w-full grid-cols-4">
//                 <TabsTrigger value="new" className="relative">
//                   New Assignments
//                   {newAssignments.length > 0 && (
//                     <Badge variant="destructive" className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
//                       {newAssignments.length}
//                     </Badge>
//                   )}
//                 </TabsTrigger>
//                 <TabsTrigger value="progress" className="relative">
//                   In Progress
//                   {inProgress.length > 0 && (
//                     <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
//                       {inProgress.length}
//                     </Badge>
//                   )}
//                 </TabsTrigger>
//                 <TabsTrigger value="resolved" className="relative">
//                   Resolved
//                   {resolved.length > 0 && (
//                     <Badge variant="outline" className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
//                       {resolved.length}
//                     </Badge>
//                   )}
//                 </TabsTrigger>
//                 <TabsTrigger value="completed">Completed</TabsTrigger>
//               </TabsList>

//               <TabsContent value="new" className="space-y-6">
//                 <Card>
//                   <CardHeader>
//                     <CardTitle>New Assignments</CardTitle>
//                     <CardDescription>Reports assigned to your department that need immediate attention</CardDescription>
//                   </CardHeader>
//                   <CardContent>
//                     {newAssignments.length > 0 ? (
//                       <div className="space-y-6">
//                         {newAssignments.map((report) => (
//                           <div key={report.id} className="border rounded-lg p-4 space-y-4">
//                             <div className="flex items-start justify-between">
//                               <div className="flex-1">
//                                 <h3 className="font-semibold text-lg">{report.title}</h3>
//                                 <p className="text-gray-600 mt-1">{report.description}</p>
//                                 <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
//                                   <span>Category: {report.category}</span>
//                                   <span>Priority: {report.priority}</span>
//                                   <span>
//                                     Student: {report.student?.firstName} {report.student?.lastName}
//                                   </span>
//                                 </div>
//                                 {report.fileUrl && (
//                                   <div className="mt-2">
//                                     <a
//                                       href={report.fileUrl}
//                                       target="_blank"
//                                       rel="noopener noreferrer"
//                                       className="text-blue-600 hover:underline text-sm"
//                                     >
//                                       View Attached File
//                                     </a>
//                                   </div>
//                                 )}
//                               </div>
//                               <Badge
//                                 variant={
//                                   report.priority === "HIGH" || report.priority === "URGENT" ? "destructive" : "outline"
//                                 }
//                               >
//                                 {report.priority}
//                               </Badge>
//                             </div>
//                             <div className="flex space-x-2">
//                               <form action={`/api/reports/${report.id}/accept`} method="POST">
//                                 <button
//                                   type="submit"
//                                   className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//                                 >
//                                   Accept & Start Working
//                                 </button>
//                               </form>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     ) : (
//                       <div className="text-center py-12">
//                         <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//                         <h3 className="text-lg font-medium text-gray-900 mb-2">No New Assignments</h3>
//                         <p className="text-gray-600">All assigned reports have been acknowledged.</p>
//                       </div>
//                     )}
//                   </CardContent>
//                 </Card>
//               </TabsContent>

//               <TabsContent value="progress" className="space-y-6">
//                 <Card>
//                   <CardHeader>
//                     <CardTitle>Reports In Progress</CardTitle>
//                     <CardDescription>Reports you are currently working on</CardDescription>
//                   </CardHeader>
//                   <CardContent>
//                     {inProgress.length > 0 ? (
//                       <div className="space-y-6">
//                         {inProgress.map((report) => (
//                           <div key={report.id} className="border rounded-lg p-4 space-y-4">
//                             <div className="flex items-start justify-between">
//                               <div className="flex-1">
//                                 <h3 className="font-semibold text-lg">{report.title}</h3>
//                                 <p className="text-gray-600 mt-1">{report.description}</p>
//                                 <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
//                                   <span>Category: {report.category}</span>
//                                   <span>
//                                     Student: {report.student?.firstName} {report.student?.lastName}
//                                   </span>
//                                 </div>
//                               </div>
//                             </div>
//                             <ResolutionForm reportId={report.id} />
//                           </div>
//                         ))}
//                       </div>
//                     ) : (
//                       <div className="text-center py-12">
//                         <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//                         <h3 className="text-lg font-medium text-gray-900 mb-2">No Reports In Progress</h3>
//                         <p className="text-gray-600">Accept new assignments to start working on them.</p>
//                       </div>
//                     )}
//                   </CardContent>
//                 </Card>
//               </TabsContent>

//               <TabsContent value="resolved">
//                 <Card>
//                   <CardHeader>
//                     <CardTitle>Resolved Reports</CardTitle>
//                     <CardDescription>Reports you have resolved, awaiting DSW admin approval</CardDescription>
//                   </CardHeader>
//                   <CardContent>
//                     <ReportsList reports={resolved} showStudentInfo={true} />
//                   </CardContent>
//                 </Card>
//               </TabsContent>

//               <TabsContent value="completed">
//                 <Card>
//                   <CardHeader>
//                     <CardTitle>Completed Reports</CardTitle>
//                     <CardDescription>Successfully resolved and approved reports</CardDescription>
//                   </CardHeader>
//                   <CardContent>
//                     <ReportsList reports={completed} showStudentInfo={true} />
//                   </CardContent>
//                 </Card>
//               </TabsContent>
//             </Tabs>
//           </div>
//         </main>
//       </div>
//     </div>
//   )
// }
=======
}
>>>>>>> cbf613db0e54aabe58a7987705a55a877d97cc37

import { requireRole } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { ReportsList } from "@/components/reports/reports-list"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
<<<<<<< HEAD
import { FileText, Clock, CheckCircle, Building2, Users, TrendingUp } from "lucide-react"
import { AssignmentForm } from "@/components/forms/assignment-form"
import { ApprovalActions } from "@/components/forms/approval-actions"
=======
import { FileText, Clock, CheckCircle, Building2, Users, AlertTriangle } from "lucide-react"
import { AssignmentForm } from "@/components/forms/assignment-form"
import { Button } from "@/components/ui/button"
>>>>>>> cbf613db0e54aabe58a7987705a55a877d97cc37

export default async function DSWAdminDashboard() {
  const user = await requireRole(["DSW_ADMIN"])

  // Get all reports for DSW admin
  const allReports = await prisma.report.findMany({
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
          role: true,
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
  const newReports = allReports.filter((r) => r.status === "SUBMITTED")
  const assignedReports = allReports.filter((r) => 
    r.status === "ASSIGNED_TO_DEPARTMENT" || r.status === "IN_PROGRESS"
  )
  const resolvedReports = allReports.filter((r) => r.status === "RESOLVED")
  const completedReports = allReports.filter((r) => 
    r.status === "APPROVED" || r.status === "COMPLETED"
  )

  // Get department admins for assignment
  const departmentAdmins = await prisma.user.findMany({
    where: {
      role: "DEPT_ADMIN",
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
    },
  })

  // Calculate stats
  const totalReports = allReports.length
  const pendingReports = newReports.length + assignedReports.length
  const awaitingApproval = resolvedReports.length
<<<<<<< HEAD
  const thisWeekReports = allReports.filter(r => {
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return new Date(r.createdAt) > weekAgo
  }).length
=======
  const urgentReports = allReports.filter((r) => r.priority === "URGENT" && !["COMPLETED", "APPROVED"].includes(r.status)).length
>>>>>>> cbf613db0e54aabe58a7987705a55a877d97cc37

  return (
    <div className="min-h-screen bg-background">
      <Sidebar userRole={user.role as any} />
      <Header 
        title="DSW Admin Dashboard" 
        subtitle="Manage and oversee all student reports"
        notificationCount={pendingReports + awaitingApproval}
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
                <CardTitle className="text-sm font-medium">This Week</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{thisWeekReports}</div>
                <p className="text-xs text-muted-foreground">New submissions</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Need Action</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{pendingReports}</div>
                <p className="text-xs text-muted-foreground">Requiring assignment</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Awaiting Approval</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{awaitingApproval}</div>
                <p className="text-xs text-muted-foreground">Ready for review</p>
              </CardContent>
            </Card>
          </div>

          {/* Reports Management Tabs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Report Management</span>
              </CardTitle>
              <CardDescription>
                Oversee the complete lifecycle of student reports from submission to resolution
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="new" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="new" className="relative">
                    New Reports
                    {newReports.length > 0 && (
                      <Badge variant="destructive" className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
                        {newReports.length}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="assigned" className="relative">
                    In Progress
                    {assignedReports.length > 0 && (
                      <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
                        {assignedReports.length}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="resolved" className="relative">
                    Need Approval
                    {resolvedReports.length > 0 && (
                      <Badge variant="outline" className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
                        {resolvedReports.length}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                </TabsList>

                <TabsContent value="new" className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">New Reports - Assign to Department</h3>
                      <Badge variant="outline">{newReports.length} reports</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Review new student reports and assign them to appropriate department administrators for resolution.
                    </p>
                    
                    {newReports.length > 0 ? (
                      <div className="space-y-6">
                        {newReports.map((report) => (
                          <Card key={report.id} className="border-l-4 border-l-blue-500">
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
                                        Submitted: <strong>{new Date(report.createdAt).toLocaleDateString()}</strong>
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
                                <AssignmentForm reportId={report.id} departmentAdmins={departmentAdmins} />
                              </div>
                            </CardContent>
                          </Card>
=======
      <div className="flex-1 flex flex-col">
        <Header title="DSW Admin Dashboard" userRole={user.role as any} />

        <main className="flex-1 overflow-y-auto p-4 lg:p-6 lg:ml-72">
          <div className="max-w-7xl mx-auto">
            {/* Welcome Section */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                DSW Administration Center
              </h2>
              <p className="text-gray-600">
                Manage student reports, assign to departments, and oversee the resolution process.
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
                  <p className="text-xs text-blue-100">All submissions</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-orange-100">Pending Action</CardTitle>
                  <Clock className="h-4 w-4 text-orange-200" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{pendingReports}</div>
                  <p className="text-xs text-orange-100">Need attention</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-purple-100">Awaiting Approval</CardTitle>
                  <Building2 className="h-4 w-4 text-purple-200" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{awaitingApproval}</div>
                  <p className="text-xs text-purple-100">Ready for review</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-red-100">Urgent Reports</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-red-200" />
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
                <TabsTrigger value="new" className="relative data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                  New Reports
                  {newReports.length > 0 && (
                    <Badge variant="destructive" className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
                      {newReports.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="assigned" className="relative data-[state=active]:bg-orange-50 data-[state=active]:text-orange-700">
                  Assigned
                  {assignedReports.length > 0 && (
                    <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
                      {assignedReports.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="resolved" className="relative data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700">
                  Awaiting Approval
                  {resolvedReports.length > 0 && (
                    <Badge variant="outline" className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
                      {resolvedReports.length}
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
                      <FileText className="h-5 w-5 mr-2 text-blue-600" />
                      New Reports - Assign to Department
                    </CardTitle>
                    <CardDescription>Review and assign new reports to appropriate department admins</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {newReports.length > 0 ? (
                      <div className="space-y-6">
                        {newReports.map((report) => (
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
                                  </div>
                                )}
                              </div>
                              <Badge
                                variant={
                                  report.priority === "HIGH" || report.priority === "URGENT" ? "destructive" : "outline"
                                }
                                className="ml-4"
                              >
                                {report.priority}
                              </Badge>
                            </div>
                            <AssignmentForm reportId={report.id} departmentAdmins={departmentAdmins} />
                          </div>
>>>>>>> cbf613db0e54aabe58a7987705a55a877d97cc37
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">No New Reports</h3>
                        <p className="text-muted-foreground">All reports have been assigned to departments.</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

<<<<<<< HEAD
                <TabsContent value="assigned">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Reports In Progress</h3>
                      <Badge variant="outline">{assignedReports.length} reports</Badge>
=======
              <TabsContent value="assigned">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Building2 className="h-5 w-5 mr-2 text-orange-600" />
                      Assigned Reports
                    </CardTitle>
                    <CardDescription>Reports currently being handled by department admins</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ReportsList reports={assignedReports} showStudentInfo={true} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="resolved">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CheckCircle className="h-5 w-5 mr-2 text-purple-600" />
                      Reports Awaiting Approval
                    </CardTitle>
                    <CardDescription>
                      Department admins have resolved these reports and are awaiting your approval
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {resolvedReports.map((report) => (
                        <div key={report.id} className="border rounded-lg p-6 bg-white shadow-sm">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg text-gray-900">{report.title}</h3>
                              <p className="text-gray-600 mt-2">{report.description}</p>
                              <div className="flex items-center space-x-6 mt-3 text-sm text-gray-500">
                                <span className="flex items-center">
                                  <Users className="h-4 w-4 mr-1" />
                                  Resolved by: {report.assignedTo?.firstName} {report.assignedTo?.lastName}
                                </span>
                                <span className="flex items-center">
                                  <FileText className="h-4 w-4 mr-1" />
                                  Student: {report.student?.firstName} {report.student?.lastName}
                                </span>
                              </div>
                            </div>
                            <Badge variant="outline" className="bg-purple-50 text-purple-700">
                              {report.priority}
                            </Badge>
                          </div>
                          {report.updates && report.updates.length > 0 && (
                            <div className="bg-purple-50 rounded-lg p-4 mt-4">
                              <h4 className="font-medium mb-2 text-purple-900">Latest Resolution:</h4>
                              <p className="text-purple-800">{report.updates[0].message}</p>
                              <p className="text-sm text-purple-600 mt-2">
                                Updated on {new Date(report.updates[0].createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          )}
                          <div className="flex space-x-3 mt-6">
                            <form action={`/api/report/${report.id}/approve`} method="POST" className="inline">
                              <Button
                                type="submit"
                                className="bg-green-600 hover:bg-green-700 text-white"
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Approve & Complete
                              </Button>
                            </form>
                            <Button variant="outline" className="border-orange-300 text-orange-700 hover:bg-orange-50">
                              Request Changes
                            </Button>
                          </div>
                        </div>
                      ))}
>>>>>>> cbf613db0e54aabe58a7987705a55a877d97cc37
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Reports currently being handled by department administrators.
                    </p>
                    <ReportsList reports={assignedReports} showStudentInfo={true} />
                  </div>
                </TabsContent>

                <TabsContent value="resolved">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Reports Awaiting Approval</h3>
                      <Badge variant="outline">{resolvedReports.length} reports</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Department administrators have resolved these reports and are awaiting your final approval.
                    </p>
                    
                    {resolvedReports.length > 0 ? (
                      <div className="space-y-4">
                        {resolvedReports.map((report) => (
                          <Card key={report.id} className="border-l-4 border-l-green-500">
                            <CardContent className="pt-6">
                              <div className="space-y-4">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1 space-y-2">
                                    <h4 className="font-semibold text-lg">{report.title}</h4>
                                    <p className="text-muted-foreground">{report.description}</p>
                                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                      <span>
                                        Resolved by: <strong>{report.assignedTo?.firstName} {report.assignedTo?.lastName}</strong>
                                      </span>
                                      <span>
                                        Student: <strong>{report.student?.firstName} {report.student?.lastName}</strong>
                                      </span>
                                    </div>
                                  </div>
                                  <Badge variant="secondary">Resolved</Badge>
                                </div>
                                
                                {report.updates && report.updates.length > 0 && (
                                  <div className="bg-muted rounded-lg p-4">
                                    <h5 className="font-medium mb-2">Resolution Details:</h5>
                                    <p className="text-sm">{report.updates[0].message}</p>
                                    <p className="text-xs text-muted-foreground mt-2">
                                      {new Date(report.updates[0].createdAt).toLocaleDateString()} at {new Date(report.updates[0].createdAt).toLocaleTimeString()}
                                    </p>
                                  </div>
                                )}
                                
                                <ApprovalActions reportId={report.id} />
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">No Reports Awaiting Approval</h3>
                        <p className="text-muted-foreground">All resolved reports have been approved.</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

<<<<<<< HEAD
                <TabsContent value="completed">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Completed Reports</h3>
                      <Badge variant="outline">{completedReports.length} reports</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Successfully resolved and approved reports with student notifications sent.
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
                    <ReportsList reports={completedReports} showStudentInfo={true} />
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
// import { ResolutionForm } from "@/components/forms/resolution-form"
// import { ReportsList } from "@/components/reports/reports-list"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { FileText, Clock, CheckCircle, Building2 } from "lucide-react"
// import { AssignmentForm } from "@/components/forms/assignment-form"

// export default async function DSWAdminDashboard() {
//   const user = await requireRole(["DSW_ADMIN"])

//   // Get all reports for DSW admin
//   const allReports = await prisma.report.findMany({
//     include: {
//       student: {
//         select: {
//           firstName: true,
//           lastName: true,
//           email: true,
//         },
//       },
//       assignedTo: {
//         select: {
//           firstName: true,
//           lastName: true,
//           email: true,
//           role: true,
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
//   const newReports = allReports.filter((r) => r.status === "SUBMITTED")
//   const assignedReports = allReports.filter((r) => r.status === "ASSIGNED_TO_DEPARTMENT" || r.status === "IN_PROGRESS")
//   const resolvedReports = allReports.filter((r) => r.status === "RESOLVED")
//   const completedReports = allReports.filter((r) => r.status === "APPROVED" || r.status === "COMPLETED")

//   // Get department admins for assignment
//   const departmentAdmins = await prisma.user.findMany({
//     where: {
//       role: "DEPT_ADMIN",
//     },
//     select: {
//       id: true,
//       firstName: true,
//       lastName: true,
//       email: true,
//     },
//   })

//   // Calculate stats
//   const totalReports = allReports.length
//   const pendingReports = newReports.length + assignedReports.length
//   const awaitingApproval = resolvedReports.length

//   return (
//     <div className="flex h-screen bg-gray-50">
//       <Sidebar userRole={user.role as any} />

//       <div className="flex-1 flex flex-col lg:ml-0">
//         <Header title="DSW Admin Dashboard" />

//         <main className="flex-1 overflow-y-auto p-6">
//           <div className="max-w-7xl mx-auto">
//             {/* Stats Cards */}
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
//                   <CardTitle className="text-sm font-medium">Pending Action</CardTitle>
//                   <Clock className="h-4 w-4 text-muted-foreground" />
//                 </CardHeader>
//                 <CardContent>
//                   <div className="text-2xl font-bold text-orange-600">{pendingReports}</div>
//                 </CardContent>
//               </Card>

//               <Card>
//                 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                   <CardTitle className="text-sm font-medium">Awaiting Approval</CardTitle>
//                   <Building2 className="h-4 w-4 text-muted-foreground" />
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
//                   <div className="text-2xl font-bold text-green-600">{completedReports.length}</div>
//                 </CardContent>
//               </Card>
//             </div>

//             {/* Reports Tabs */}
//             <Tabs defaultValue="new" className="space-y-6">
//               <TabsList className="grid w-full grid-cols-4">
//                 <TabsTrigger value="new" className="relative">
//                   New Reports
//                   {newReports.length > 0 && (
//                     <Badge variant="destructive" className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
//                       {newReports.length}
//                     </Badge>
//                   )}
//                 </TabsTrigger>
//                 <TabsTrigger value="assigned" className="relative">
//                   Assigned
//                   {assignedReports.length > 0 && (
//                     <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
//                       {assignedReports.length}
//                     </Badge>
//                   )}
//                 </TabsTrigger>
//                 <TabsTrigger value="resolved" className="relative">
//                   Awaiting Approval
//                   {resolvedReports.length > 0 && (
//                     <Badge variant="outline" className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
//                       {resolvedReports.length}
//                     </Badge>
//                   )}
//                 </TabsTrigger>
//                 <TabsTrigger value="completed">Completed</TabsTrigger>
//               </TabsList>

//               <TabsContent value="new" className="space-y-6">
//                 <Card>
//                   <CardHeader>
//                     <CardTitle>New Reports - Assign to Department</CardTitle>
//                     <CardDescription>Review and assign new reports to appropriate department admins</CardDescription>
//                   </CardHeader>
//                   <CardContent>
//                     {newReports.length > 0 ? (
//                       <div className="space-y-6">
//                         {newReports.map((report) => (
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
//                               </div>
//                               <Badge
//                                 variant={
//                                   report.priority === "HIGH" || report.priority === "URGENT" ? "destructive" : "outline"
//                                 }
//                               >
//                                 {report.priority}
//                               </Badge>
//                             </div>
//                             <AssignmentForm reportId={report.id} departmentAdmins={departmentAdmins} />
//                           </div>
//                         ))}
//                       </div>
//                     ) : (
//                       <div className="text-center py-12">
//                         <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//                         <h3 className="text-lg font-medium text-gray-900 mb-2">No New Reports</h3>
//                         <p className="text-gray-600">All reports have been assigned to departments.</p>
//                       </div>
//                     )}
//                   </CardContent>
//                 </Card>
//               </TabsContent>

//               <TabsContent value="assigned">
//                 <Card>
//                   <CardHeader>
//                     <CardTitle>Assigned Reports</CardTitle>
//                     <CardDescription>Reports currently being handled by department admins</CardDescription>
//                   </CardHeader>
//                   <CardContent>
//                     <ReportsList reports={assignedReports} showStudentInfo={true} />
//                   </CardContent>
//                 </Card>
//               </TabsContent>

//               <TabsContent value="resolved">
//                 <Card>
//                   <CardHeader>
//                     <CardTitle>Reports Awaiting Approval</CardTitle>
//                     <CardDescription>
//                       Department admins have resolved these reports and are awaiting your approval
//                     </CardDescription>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="space-y-4">
//                       {resolvedReports.map((report) => (
//                         <div key={report.id} className="border rounded-lg p-4">
//                           <div className="flex items-start justify-between mb-4">
//                             <div className="flex-1">
//                               <h3 className="font-semibold text-lg">{report.title}</h3>
//                               <p className="text-gray-600 mt-1">{report.description}</p>
//                               <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
//                                 <span>
//                                   Resolved by: {report.assignedTo?.firstName} {report.assignedTo?.lastName}
//                                 </span>
//                                 <span>
//                                   Student: {report.student?.firstName} {report.student?.lastName}
//                                 </span>
//                               </div>
//                             </div>
//                           </div>
//                           {report.updates && report.updates.length > 0 && (
//                             <div className="bg-gray-50 rounded p-3 mt-4">
//                               <h4 className="font-medium mb-2">Latest Update:</h4>
//                               <p className="text-gray-700">{report.updates[0].message}</p>
//                             </div>
//                           )}
//                           <div className="flex space-x-2 mt-4">
//                             <form action={`/api/reports/${report.id}/approve`} method="POST">
//                               <button
//                                 type="submit"
//                                 className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
//                               >
//                                 Approve & Complete
//                               </button>
//                             </form>
//                             <button className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
//                               Request Changes
//                             </button>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                     {resolvedReports.length === 0 && (
//                       <div className="text-center py-12">
//                         <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//                         <h3 className="text-lg font-medium text-gray-900 mb-2">No Reports Awaiting Approval</h3>
//                         <p className="text-gray-600">All resolved reports have been approved.</p>
//                       </div>
//                     )}
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
//                     <ReportsList reports={completedReports} showStudentInfo={true} />
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

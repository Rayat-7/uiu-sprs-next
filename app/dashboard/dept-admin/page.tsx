import { requireRole } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { ReportsList } from "@/components/reports/reports-list"
import { ResolutionForm } from "@/components/forms/resolution-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Clock, CheckCircle, AlertCircle, Building2, Users } from "lucide-react"
import { Button } from "@/components/ui/button"

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
  const urgentReports = assignedReports.filter((r) => r.priority === "URGENT" && !["COMPLETED", "APPROVED"].includes(r.status)).length

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userRole={user.role as any} />

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
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No New Assignments</h3>
                        <p className="text-gray-600">All assigned reports have been acknowledged.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

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
                                </div>
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
                            <ResolutionForm reportId={report.id} />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Reports In Progress</h3>
                        <p className="text-gray-600">Accept new assignments to start working on them.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

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
                    <ReportsList reports={resolved} showStudentInfo={true} />
                  </CardContent>
                </Card>
              </TabsContent>

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
                    <ReportsList reports={completed} showStudentInfo={true} />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}
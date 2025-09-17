import { requireRole } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { ReportsList } from "@/components/reports/reports-list"
import { ResolutionForm } from "@/components/forms/resolution-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Clock, CheckCircle, AlertCircle } from "lucide-react"

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

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userRole={user.role as any} />

      <div className="flex-1 flex flex-col lg:ml-0">
        <Header title="Department Admin Dashboard" />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Assigned</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalAssigned}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Action</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">{pendingAction}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Awaiting DSW Approval</CardTitle>
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{awaitingApproval}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completed</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{completed.length}</div>
                </CardContent>
              </Card>
            </div>

            {/* Reports Tabs */}
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
                <Card>
                  <CardHeader>
                    <CardTitle>New Assignments</CardTitle>
                    <CardDescription>Reports assigned to your department that need immediate attention</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {newAssignments.length > 0 ? (
                      <div className="space-y-6">
                        {newAssignments.map((report) => (
                          <div key={report.id} className="border rounded-lg p-4 space-y-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h3 className="font-semibold text-lg">{report.title}</h3>
                                <p className="text-gray-600 mt-1">{report.description}</p>
                                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                                  <span>Category: {report.category}</span>
                                  <span>Priority: {report.priority}</span>
                                  <span>
                                    Student: {report.student?.firstName} {report.student?.lastName}
                                  </span>
                                </div>
                                {report.fileUrl && (
                                  <div className="mt-2">
                                    <a
                                      href={report.fileUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:underline text-sm"
                                    >
                                      View Attached File
                                    </a>
                                  </div>
                                )}
                              </div>
                              <Badge
                                variant={
                                  report.priority === "HIGH" || report.priority === "URGENT" ? "destructive" : "outline"
                                }
                              >
                                {report.priority}
                              </Badge>
                            </div>
                            <div className="flex space-x-2">
                              <form action={`/api/reports/${report.id}/accept`} method="POST">
                                <button
                                  type="submit"
                                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                >
                                  Accept & Start Working
                                </button>
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
                    <CardTitle>Reports In Progress</CardTitle>
                    <CardDescription>Reports you are currently working on</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {inProgress.length > 0 ? (
                      <div className="space-y-6">
                        {inProgress.map((report) => (
                          <div key={report.id} className="border rounded-lg p-4 space-y-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h3 className="font-semibold text-lg">{report.title}</h3>
                                <p className="text-gray-600 mt-1">{report.description}</p>
                                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                                  <span>Category: {report.category}</span>
                                  <span>
                                    Student: {report.student?.firstName} {report.student?.lastName}
                                  </span>
                                </div>
                              </div>
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
                    <CardTitle>Resolved Reports</CardTitle>
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
                    <CardTitle>Completed Reports</CardTitle>
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

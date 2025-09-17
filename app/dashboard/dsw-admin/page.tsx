import { requireRole } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { ResolutionForm } from "@/components/forms/resolution-form"
import { ReportsList } from "@/components/reports/reports-list"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Clock, CheckCircle, Building2 } from "lucide-react"
import { AssignmentForm } from "@/components/forms/assignment-form"

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
  const assignedReports = allReports.filter((r) => r.status === "ASSIGNED_TO_DEPARTMENT" || r.status === "IN_PROGRESS")
  const resolvedReports = allReports.filter((r) => r.status === "RESOLVED")
  const completedReports = allReports.filter((r) => r.status === "APPROVED" || r.status === "COMPLETED")

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

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userRole={user.role as any} />

      <div className="flex-1 flex flex-col lg:ml-0">
        <Header title="DSW Admin Dashboard" />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalReports}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Action</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">{pendingReports}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Awaiting Approval</CardTitle>
                  <Building2 className="h-4 w-4 text-muted-foreground" />
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
                  <div className="text-2xl font-bold text-green-600">{completedReports.length}</div>
                </CardContent>
              </Card>
            </div>

            {/* Reports Tabs */}
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
                  Assigned
                  {assignedReports.length > 0 && (
                    <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
                      {assignedReports.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="resolved" className="relative">
                  Awaiting Approval
                  {resolvedReports.length > 0 && (
                    <Badge variant="outline" className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
                      {resolvedReports.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>

              <TabsContent value="new" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>New Reports - Assign to Department</CardTitle>
                    <CardDescription>Review and assign new reports to appropriate department admins</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {newReports.length > 0 ? (
                      <div className="space-y-6">
                        {newReports.map((report) => (
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
                              </div>
                              <Badge
                                variant={
                                  report.priority === "HIGH" || report.priority === "URGENT" ? "destructive" : "outline"
                                }
                              >
                                {report.priority}
                              </Badge>
                            </div>
                            <AssignmentForm reportId={report.id} departmentAdmins={departmentAdmins} />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No New Reports</h3>
                        <p className="text-gray-600">All reports have been assigned to departments.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="assigned">
                <Card>
                  <CardHeader>
                    <CardTitle>Assigned Reports</CardTitle>
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
                    <CardTitle>Reports Awaiting Approval</CardTitle>
                    <CardDescription>
                      Department admins have resolved these reports and are awaiting your approval
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {resolvedReports.map((report) => (
                        <div key={report.id} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg">{report.title}</h3>
                              <p className="text-gray-600 mt-1">{report.description}</p>
                              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                                <span>
                                  Resolved by: {report.assignedTo?.firstName} {report.assignedTo?.lastName}
                                </span>
                                <span>
                                  Student: {report.student?.firstName} {report.student?.lastName}
                                </span>
                              </div>
                            </div>
                          </div>
                          {report.updates && report.updates.length > 0 && (
                            <div className="bg-gray-50 rounded p-3 mt-4">
                              <h4 className="font-medium mb-2">Latest Update:</h4>
                              <p className="text-gray-700">{report.updates[0].message}</p>
                            </div>
                          )}
                          <div className="flex space-x-2 mt-4">
                            <form action={`/api/reports/${report.id}/approve`} method="POST">
                              <button
                                type="submit"
                                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                              >
                                Approve & Complete
                              </button>
                            </form>
                            <button className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
                              Request Changes
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    {resolvedReports.length === 0 && (
                      <div className="text-center py-12">
                        <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Reports Awaiting Approval</h3>
                        <p className="text-gray-600">All resolved reports have been approved.</p>
                      </div>
                    )}
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
                    <ReportsList reports={completedReports} showStudentInfo={true} />
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

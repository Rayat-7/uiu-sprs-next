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
import { FileText, Clock, CheckCircle, AlertCircle, TrendingUp, Building2 } from "lucide-react"

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
  const thisWeekAssigned = assignedReports.filter(r => {
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return new Date(r.createdAt) > weekAgo
  }).length

  return (
    <div className="min-h-screen bg-background">
      <Sidebar userRole={user.role as any} />
      <Header 
        title="Department Admin Dashboard" 
        subtitle={`Welcome ${user.firstName || 'Admin'} - Resolve assigned reports`}
        notificationCount={pendingAction}
      />

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
                                  </div>
                                )}
                                
                                <AcceptReportForm reportId={report.id} />
                              </div>
                            </CardContent>
                          </Card>
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
                                </div>
                                
                                <ResolutionForm reportId={report.id} />
                              </div>
                            </CardContent>
                          </Card>
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

                <TabsContent value="resolved">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Resolved Reports</h3>
                      <Badge variant="outline">{resolved.length} reports</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Reports you have resolved, awaiting DSW admin approval and student notification.
                    </p>
                    <ReportsList reports={resolved} showStudentInfo={true} />
                  </div>
                </TabsContent>

                <TabsContent value="completed">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Completed Reports</h3>
                      <Badge variant="outline">{completed.length} reports</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Successfully resolved and approved reports with students notified.
                    </p>
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
}

















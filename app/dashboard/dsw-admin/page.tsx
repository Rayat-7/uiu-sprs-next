import { requireRole } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { ReportsList } from "@/components/reports/reports-list"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Clock, CheckCircle, Building2, Users, TrendingUp } from "lucide-react"
import { AssignmentForm } from "@/components/forms/assignment-form"
import { ApprovalActions } from "@/components/forms/approval-actions"

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
  const thisWeekReports = allReports.filter(r => {
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return new Date(r.createdAt) > weekAgo
  }).length

  return (
    <div className="min-h-screen bg-background">
      <Sidebar userRole={user.role as any} />
      <Header 
        title="DSW Admin Dashboard" 
        subtitle="Manage and oversee all student reports"
        notificationCount={pendingReports + awaitingApproval}
      />

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

                <TabsContent value="assigned">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Reports In Progress</h3>
                      <Badge variant="outline">{assignedReports.length} reports</Badge>
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

                <TabsContent value="completed">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Completed Reports</h3>
                      <Badge variant="outline">{completedReports.length} reports</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Successfully resolved and approved reports with student notifications sent.
                    </p>
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
}














import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatReportStatus, getReportStatusColor } from "@/lib/utils"
import { Calendar, FileText, Tag } from "lucide-react"
import { EmailValidator } from "@/components/email-validator"

export default async function PublicPage() {
  const user = await getCurrentUser()

  // Fetch all reports for public view (anonymous)
  const reports = await prisma.report.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      category: true,
      status: true,
      priority: true,
      createdAt: true,
      // Don't include student info for anonymity
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 20, // Limit to recent 20 reports
  })

  return (
    <EmailValidator>
      <div className="flex h-screen bg-gray-50">
        <Sidebar userRole={user.role as any} />

        <div className="flex-1 flex flex-col lg:ml-0">
          <Header title="Public Reports View" />

          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-6xl mx-auto">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Recent Reports</h2>
                <p className="text-gray-600">All reports are displayed anonymously to maintain student privacy.</p>
              </div>

              {reports.length === 0 ? (
                <Card>
                  <CardContent className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Reports Yet</h3>
                      <p className="text-gray-600">Be the first to submit a report and help improve UIU!</p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-6">
                  {reports.map((report) => (
                    <Card key={report.id} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg mb-2">{report.title}</CardTitle>
                            <CardDescription className="text-base">
                              {report.description.length > 200
                                ? `${report.description.substring(0, 200)}...`
                                : report.description}
                            </CardDescription>
                          </div>
                          <Badge className={getReportStatusColor(report.status)} variant="secondary">
                            {formatReportStatus(report.status)}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                              <Tag className="h-4 w-4 mr-1" />
                              {report.category}
                            </div>
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {new Date(report.createdAt).toLocaleDateString()}
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
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </EmailValidator>
  )
}

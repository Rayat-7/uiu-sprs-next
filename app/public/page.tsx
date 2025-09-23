import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { GeminiChatbot } from "@/components/gemini-chatbot"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { FileText, Filter, TrendingUp, CheckCircle, Clock, AlertCircle, Search, Calendar, Tag, BarChart3 } from "lucide-react"
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
    <div className="min-h-screen bg-gray-50">
      <Sidebar userRole={user.role as any} />
      <Header 
        title="Community Feed" 
        subtitle="Real-time student reports and their resolution status"
      />

      <main className="lg:ml-80 flex h-[calc(100vh-64px)]">
        {/* Main Content - Report Feed */}
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b border-gray-200 bg-white">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Community Reports</h2>
              <Badge variant="outline" className="text-xs">
                {reports.length} reports found
              </Badge>
            </div>
          </div>

          {/* Scrollable Report List */}
          <div className="flex-1 overflow-y-auto scrollbar-hide p-4 space-y-3">
            {reports.length > 0 ? (
              reports.map((report, index) => (
                <Card key={report.id} className="hover:shadow-md transition-all duration-200 border border-gray-200 bg-white">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                            {String(totalReports - index).padStart(2, '0')}
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Anonymous Student</p>
                            <p className="text-xs text-gray-400 flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              {new Date(report.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Badge className={getReportStatusColor(report.status)} variant="secondary">
                          {formatReportStatus(report.status)}
                        </Badge>
                      </div>

                      {/* Content */}
                      <div className="space-y-2">
                        <h3 className="font-semibold text-base text-gray-900 leading-tight">
                          {report.title}
                        </h3>
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {report.description.length > 200
                            ? `${report.description.substring(0, 200)}...`
                            : report.description}
                        </p>
                      </div>

                      {/* Tags */}
                      <div className="flex items-center space-x-2 flex-wrap">
                        <div className="flex items-center space-x-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs">
                          <Tag className="w-3 h-3" />
                          <span>{report.category}</span>
                        </div>
                        <Badge
                          variant={
                            report.priority === "HIGH" || report.priority === "URGENT" 
                              ? "destructive" 
                              : report.priority === "MEDIUM" 
                                ? "default" 
                                : "secondary"
                          }
                          className="text-xs"
                        >
                          {report.priority}
                        </Badge>
                      </div>

                      {/* Latest Update */}
                      {report.updates && report.updates.length > 0 && (
                        <div className="bg-gray-50 rounded-lg p-3 border-l-4 border-l-blue-500">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium text-gray-600">Latest Update</span>
                            <Badge className={getReportStatusColor(report.updates[0].status)} variant="secondary" className="text-xs">
                              {formatReportStatus(report.updates[0].status)}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-700 line-clamp-2">{report.updates[0].message}</p>
                        </div>
                      )}

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs text-gray-500">
                        <span>Report #{totalReports - index}</span>
                        <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Reports Found</h3>
                  <p className="text-gray-500">
                    {searchParams.search || searchParams.category || searchParams.status || searchParams.priority
                      ? "Try adjusting your filters to see more results."
                      : "No student reports have been submitted yet."}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar - Gemini Chatbot */}
        <div className="w-140 bg-white border-l border-gray-200">
          <GeminiChatbot />
        </div>
      </main>

    </div>
  )
}


"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatReportStatus, getReportStatusColor } from "@/lib/utils"
import { Calendar, FileText, Tag, Eye, User } from "lucide-react"
import { ReportDetailsModal } from "./report-details-modal"

interface Report {
  id: string
  title: string
  description: string
  category: string
  status: string
  priority: string
  fileUrl?: string | null
  createdAt: Date
  student?: {
    firstName: string | null
    lastName: string | null
    email: string
  }
  updates?: Array<{
    id: string
    message: string
    status: string
    createdAt: Date
    updatedBy: {
      firstName: string | null
      lastName: string | null
      role: string
    }
  }>
}

interface ReportsListProps {
  reports: Report[]
  showStudentInfo?: boolean
}

export function ReportsList({ reports, showStudentInfo = false }: ReportsListProps) {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)

  if (reports.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Reports Found</h3>
        <p className="text-gray-600">
          {showStudentInfo ? "No reports have been submitted yet." : "You haven't submitted any reports yet."}
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-4">
        {reports.map((report) => (
          <Card key={report.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">{report.title}</CardTitle>
                  <CardDescription className="text-base">
                    {report.description.length > 150
                      ? `${report.description.substring(0, 150)}...`
                      : report.description}
                  </CardDescription>
                </div>
                <Badge className={getReportStatusColor(report.status)} variant="secondary">
                  {formatReportStatus(report.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Tag className="h-4 w-4 mr-1" />
                    {report.category}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(report.createdAt).toLocaleDateString()}
                  </div>
                  {showStudentInfo && report.student && (
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      {report.student.firstName} {report.student.lastName}
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Badge
                    variant={report.priority === "HIGH" || report.priority === "URGENT" ? "destructive" : "outline"}
                  >
                    {report.priority}
                  </Badge>
                  <Button variant="outline" size="sm" onClick={() => setSelectedReport(report)}>
                    <Eye className="h-4 w-4 mr-1" />
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedReport && (
        <ReportDetailsModal
          report={selectedReport}
          isOpen={!!selectedReport}
          onClose={() => setSelectedReport(null)}
          showStudentInfo={showStudentInfo}
        />
      )}
    </>
  )
}

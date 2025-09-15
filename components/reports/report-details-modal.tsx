"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatReportStatus, getReportStatusColor } from "@/lib/utils"
import { Calendar, FileText, Tag, User, Clock } from "lucide-react"

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

interface ReportDetailsModalProps {
  report: Report
  isOpen: boolean
  onClose: () => void
  showStudentInfo?: boolean
}

export function ReportDetailsModal({ report, isOpen, onClose, showStudentInfo = false }: ReportDetailsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{report.title}</span>
            <Badge className={getReportStatusColor(report.status)} variant="secondary">
              {formatReportStatus(report.status)}
            </Badge>
          </DialogTitle>
          <DialogDescription>Report ID: {report.id}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Report Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Report Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-gray-700">{report.description}</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <h4 className="font-medium mb-1">Category</h4>
                  <div className="flex items-center text-sm text-gray-600">
                    <Tag className="h-4 w-4 mr-1" />
                    {report.category}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Priority</h4>
                  <Badge
                    variant={report.priority === "HIGH" || report.priority === "URGENT" ? "destructive" : "outline"}
                  >
                    {report.priority}
                  </Badge>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Submitted</h4>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(report.createdAt).toLocaleDateString()}
                  </div>
                </div>
                {showStudentInfo && report.student && (
                  <div>
                    <h4 className="font-medium mb-1">Student</h4>
                    <div className="flex items-center text-sm text-gray-600">
                      <User className="h-4 w-4 mr-1" />
                      {report.student.firstName} {report.student.lastName}
                    </div>
                  </div>
                )}
              </div>

              {report.fileUrl && (
                <div>
                  <h4 className="font-medium mb-2">Attached File</h4>
                  <div className="flex items-center text-sm text-blue-600">
                    <FileText className="h-4 w-4 mr-1" />
                    <a href={report.fileUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      View Attachment
                    </a>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Progress Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Progress Timeline</CardTitle>
              <CardDescription>Track the progress of this report through the resolution process</CardDescription>
            </CardHeader>
            <CardContent>
              {report.updates && report.updates.length > 0 ? (
                <div className="space-y-4">
                  {report.updates.map((update, index) => (
                    <div key={update.id} className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-600">{report.updates!.length - index}</span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <Badge className={getReportStatusColor(update.status)} variant="secondary">
                            {formatReportStatus(update.status)}
                          </Badge>
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="h-4 w-4 mr-1" />
                            {new Date(update.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <p className="mt-2 text-gray-700">{update.message}</p>
                        <p className="mt-1 text-sm text-gray-500">
                          Updated by: {update.updatedBy.firstName} {update.updatedBy.lastName}(
                          {update.updatedBy.role.replace("_", " ").toLowerCase()})
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Updates Yet</h3>
                  <p className="text-gray-600">Your report has been submitted and is waiting for review.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}

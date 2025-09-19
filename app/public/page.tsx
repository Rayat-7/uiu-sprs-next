import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { EmailValidator } from "@/components/email-validator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Filter, TrendingUp, CheckCircle, Clock, AlertCircle } from "lucide-react"
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
  let user
  let reports = []
  let totalReports = 0
  let completedReports = 0
  let inProgressReports = 0
  let pendingReports = 0
  let categories: string[] = []

  try {
    user = await getCurrentUser()

    // Get all reports for public view (anonymized)
    reports = await prisma.report.findMany({
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
    totalReports = reports.length
    completedReports = reports.filter(r => ["COMPLETED", "APPROVED"].includes(r.status)).length
    inProgressReports = reports.filter(r => ["IN_PROGRESS", "ASSIGNED_TO_DEPARTMENT"].includes(r.status)).length
    pendingReports = reports.filter(r => r.status === "SUBMITTED").length

    // Get unique categories for filter
    categories = [...new Set(reports.map(r => r.category))].sort()
  } catch (error) {
    console.error("Error loading public page:", error)
    // If there's an error getting the user or data, the EmailValidator will handle it
  }

  return (
    <EmailValidator>
      <div className="min-h-screen bg-background">
        <Sidebar userRole={user?.role as any} />
        <Header 
          title="Public Report View" 
          subtitle="Transparent view of all student reports and their resolution status"
        />

        <main className="lg:ml-80 p-6">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Statistics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalReports}</div>
                  <p className="text-xs text-muted-foreground">All student submissions</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending</CardTitle>
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">{pendingReports}</div>
                  <p className="text-xs text-muted-foreground">Awaiting assignment</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{inProgressReports}</div>
                  <p className="text-xs text-muted-foreground">Being resolved</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completed</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{completedReports}</div>
                  <p className="text-xs text-muted-foreground">Successfully resolved</p>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Filter className="h-5 w-5" />
                  <span>Filter Reports</span>
                </CardTitle>
                <CardDescription>
                  Filter and search through all student reports to find specific issues or track resolution patterns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Search</label>
                    <Input
                      placeholder="Search reports..."
                      defaultValue={searchParams.search || ""}
                      name="search"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Category</label>
                    <Select defaultValue={searchParams.category || ""}>
                      <SelectTrigger>
                        <SelectValue placeholder="All categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All categories</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Status</label>
                    <Select defaultValue={searchParams.status || ""}>
                      <SelectTrigger>
                        <SelectValue placeholder="All statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All statuses</SelectItem>
                        <SelectItem value="SUBMITTED">Submitted</SelectItem>
                        <SelectItem value="ASSIGNED_TO_DEPARTMENT">Assigned</SelectItem>
                        <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                        <SelectItem value="RESOLVED">Resolved</SelectItem>
                        <SelectItem value="APPROVED">Approved</SelectItem>
                        <SelectItem value="COMPLETED">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Priority</label>
                    <Select defaultValue={searchParams.priority || ""}>
                      <SelectTrigger>
                        <SelectValue placeholder="All priorities" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All priorities</SelectItem>
                        <SelectItem value="LOW">Low</SelectItem>
                        <SelectItem value="MEDIUM">Medium</SelectItem>
                        <SelectItem value="HIGH">High</SelectItem>
                        <SelectItem value="URGENT">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reports List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>All Reports ({reports.length})</span>
                  <Badge variant="outline" className="text-xs">
                    Last updated: {new Date().toLocaleDateString()}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Anonymous view of all student reports. Personal information is hidden to maintain privacy.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {reports.length > 0 ? (
                  <div className="space-y-4">
                    {reports.map((report, index) => (
                      <Card key={report.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="pt-6">
                          <div className="space-y-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1 space-y-2">
                                <div className="flex items-center space-x-2">
                                  <h3 className="font-semibold text-lg">{report.title}</h3>
                                  <Badge variant="outline" className="text-xs">
                                    Report #{totalReports - index}
                                  </Badge>
                                </div>
                                <p className="text-muted-foreground">
                                  {report.description.length > 200
                                    ? `${report.description.substring(0, 200)}...`
                                    : report.description}
                                </p>
                                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                  <span>Category: <strong>{report.category}</strong></span>
                                  <span>Priority: <strong>{report.priority}</strong></span>
                                  <span>Submitted: <strong>{new Date(report.createdAt).toLocaleDateString()}</strong></span>
                                  {report.updates && report.updates.length > 0 && (
                                    <span>Last Update: <strong>{new Date(report.updates[0].createdAt).toLocaleDateString()}</strong></span>
                                  )}
                                </div>
                              </div>
                              <div className="flex flex-col items-end space-y-2">
                                <Badge className={getReportStatusColor(report.status)} variant="secondary">
                                  {formatReportStatus(report.status)}
                                </Badge>
                                <Badge
                                  variant={
                                    report.priority === "HIGH" || report.priority === "URGENT" 
                                      ? "destructive" 
                                      : "outline"
                                  }
                                  className="text-xs"
                                >
                                  {report.priority}
                                </Badge>
                              </div>
                            </div>
                            
                            {/* Show latest update if available */}
                            {report.updates && report.updates.length > 0 && (
                              <div className="bg-muted rounded-lg p-3 border-l-4 border-l-primary">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-sm font-medium">Latest Update</span>
                                  <Badge className={getReportStatusColor(report.updates[0].status)} variant="secondary" className="text-xs">
                                    {formatReportStatus(report.updates[0].status)}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">{report.updates[0].message}</p>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Reports Found</h3>
                    <p className="text-muted-foreground">
                      {searchParams.search || searchParams.category || searchParams.status || searchParams.priority
                        ? "Try adjusting your filters to see more results."
                        : "No student reports have been submitted yet."}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </EmailValidator>
  )
}











// import { prisma } from "@/lib/prisma"
// import { getCurrentUser } from "@/lib/auth"
// import { Sidebar } from "@/components/layout/sidebar"
// import { Header } from "@/components/layout/header"
// import { Card, CardContent } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Input } from "@/components/ui/input"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Button } from "@/components/ui/button"
// import { FileText, Filter, TrendingUp, CheckCircle, Clock, AlertCircle, Search, Calendar, Tag } from "lucide-react"
// import { formatReportStatus, getReportStatusColor } from "@/lib/utils"

// interface SearchParams {
//   category?: string
//   status?: string
//   priority?: string
//   search?: string
// }

// export default async function PublicPage({
//   searchParams,
// }: {
//   searchParams: SearchParams
// }) {
//   const user = await getCurrentUser()

//   // Get all reports for public view (anonymized)
//   const reports = await prisma.report.findMany({
//     where: {
//       ...(searchParams.category && { category: searchParams.category }),
//       ...(searchParams.status && { status: searchParams.status }),
//       ...(searchParams.priority && { priority: searchParams.priority }),
//       ...(searchParams.search && {
//         OR: [
//           { title: { contains: searchParams.search, mode: 'insensitive' } },
//           { description: { contains: searchParams.search, mode: 'insensitive' } },
//           { category: { contains: searchParams.search, mode: 'insensitive' } },
//         ],
//       }),
//     },
//     include: {
//       updates: {
//         orderBy: {
//           createdAt: "desc",
//         },
//         take: 1,
//       },
//     },
//     orderBy: {
//       createdAt: "desc",
//     },
//   })

//   // Calculate statistics
//   const totalReports = reports.length
//   const completedReports = reports.filter(r => ["COMPLETED", "APPROVED"].includes(r.status)).length
//   const inProgressReports = reports.filter(r => ["IN_PROGRESS", "ASSIGNED_TO_DEPARTMENT"].includes(r.status)).length
//   const pendingReports = reports.filter(r => r.status === "SUBMITTED").length

//   // Get unique categories for filter
//   const categories = [...new Set(reports.map(r => r.category))].sort()

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Sidebar userRole={user.role as any} />
//       <Header 
//         title="Community Reports" 
//         subtitle="See what issues fellow students are reporting and their resolution status"
//       />

//       <main className="lg:ml-80">
//         <div className="max-w-7xl mx-auto p-6">
//           <div className="flex gap-6">
//             {/* Main Feed */}
//             <div className="flex-1 max-w-2xl">
//               <div className="space-y-4">
//                 {reports.length > 0 ? (
//                   reports.map((report, index) => (
//                     <Card key={report.id} className="hover:shadow-md transition-all duration-300 border border-gray-200 bg-white">
//                       <CardContent className="p-6">
//                         <div className="space-y-4">
//                           {/* Header */}
//                           <div className="flex items-start justify-between">
//                             <div className="flex items-center space-x-3">
//                               <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
//                                 {String(totalReports - index).padStart(2, '0')}
//                               </div>
//                               <div>
//                                 <p className="text-sm text-gray-500">Anonymous Student</p>
//                                 <p className="text-xs text-gray-400 flex items-center">
//                                   <Calendar className="w-3 h-3 mr-1" />
//                                   {new Date(report.createdAt).toLocaleDateString()}
//                                 </p>
//                               </div>
//                             </div>
//                             <Badge className={getReportStatusColor(report.status)} variant="secondary">
//                               {formatReportStatus(report.status)}
//                             </Badge>
//                           </div>

//                           {/* Content */}
//                           <div className="space-y-3">
//                             <h3 className="font-semibold text-lg text-gray-900 leading-tight">
//                               {report.title}
//                             </h3>
//                             <p className="text-gray-700 leading-relaxed">
//                               {report.description.length > 280
//                                 ? `${report.description.substring(0, 280)}...`
//                                 : report.description}
//                             </p>
//                           </div>

//                           {/* Tags */}
//                           <div className="flex items-center space-x-2 flex-wrap">
//                             <div className="flex items-center space-x-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs">
//                               <Tag className="w-3 h-3" />
//                               <span>{report.category}</span>
//                             </div>
//                             <Badge
//                               variant={
//                                 report.priority === "HIGH" || report.priority === "URGENT" 
//                                   ? "destructive" 
//                                   : report.priority === "MEDIUM" 
//                                     ? "default" 
//                                     : "secondary"
//                               }
//                               className="text-xs"
//                             >
//                               {report.priority}
//                             </Badge>
//                           </div>

//                           {/* Latest Update */}
//                           {report.updates && report.updates.length > 0 && (
//                             <div className="bg-gray-50 rounded-lg p-3 border-l-4 border-l-blue-500">
//                               <div className="flex items-center justify-between mb-1">
//                                 <span className="text-xs font-medium text-gray-600">Latest Update</span>
//                                 <Badge className={getReportStatusColor(report.updates[0].status)} variant="secondary" className="text-xs">
//                                   {formatReportStatus(report.updates[0].status)}
//                                 </Badge>
//                               </div>
//                               <p className="text-sm text-gray-700">{report.updates[0].message}</p>
//                             </div>
//                           )}

//                           {/* Engagement Bar */}
//                           <div className="flex items-center justify-between pt-2 border-t border-gray-100">
//                             <div className="text-xs text-gray-500">
//                               Report #{totalReports - index}
//                             </div>
//                             <div className="flex items-center space-x-4 text-xs text-gray-500">
//                               <span>{new Date(report.createdAt).toLocaleDateString()}</span>
//                               {report.updates && report.updates.length > 0 && (
//                                 <span>Updated {new Date(report.updates[0].createdAt).toLocaleDateString()}</span>
//                               )}
//                             </div>
//                           </div>
//                         </div>
//                       </CardContent>
//                     </Card>
//                   ))
//                 ) : (
//                   <Card className="text-center py-16">
//                     <CardContent>
//                       <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
//                       <h3 className="text-lg font-medium text-gray-900 mb-2">No Reports Found</h3>
//                       <p className="text-gray-500">
//                         {searchParams.search || searchParams.category || searchParams.status || searchParams.priority
//                           ? "Try adjusting your filters to see more results."
//                           : "No student reports have been submitted yet."}
//                       </p>
//                     </CardContent>
//                   </Card>
//                 )}
//               </div>
//             </div>

//             {/* Right Sidebar */}
//             <div className="w-80 space-y-6">
//               {/* Stats Card */}
//               {/* <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
//                 <CardContent className="p-6">
//                   <div className="text-center mb-4">
//                     <h3 className="font-semibold text-gray-900 mb-2">Community Stats</h3>
//                     <p className="text-sm text-gray-600">Real-time reporting overview</p>
//                   </div>
//                   <div className="grid grid-cols-2 gap-4">
//                     <div className="text-center p-3 bg-white rounded-lg border border-blue-100">
//                       <div className="flex items-center justify-center mb-2">
//                         <FileText className="h-4 w-4 text-blue-600 mr-1" />
//                       </div>
//                       <div className="text-2xl font-bold text-gray-900">{totalReports}</div>
//                       <div className="text-xs text-gray-600">Total Reports</div>
//                     </div>
//                     <div className="text-center p-3 bg-white rounded-lg border border-green-100">
//                       <div className="flex items-center justify-center mb-2">
//                         <CheckCircle className="h-4 w-4 text-green-600 mr-1" />
//                       </div>
//                       <div className="text-2xl font-bold text-green-600">{completedReports}</div>
//                       <div className="text-xs text-gray-600">Completed</div>
//                     </div>
//                     <div className="text-center p-3 bg-white rounded-lg border border-blue-100">
//                       <div className="flex items-center justify-center mb-2">
//                         <TrendingUp className="h-4 w-4 text-blue-600 mr-1" />
//                       </div>
//                       <div className="text-2xl font-bold text-blue-600">{inProgressReports}</div>
//                       <div className="text-xs text-gray-600">In Progress</div>
//                     </div>
//                     <div className="text-center p-3 bg-white rounded-lg border border-orange-100">
//                       <div className="flex items-center justify-center mb-2">
//                         <AlertCircle className="h-4 w-4 text-orange-600 mr-1" />
//                       </div>
//                       <div className="text-2xl font-bold text-orange-600">{pendingReports}</div>
//                       <div className="text-xs text-gray-600">Pending</div>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card> */}

//               {/* Filters Card */}
//               <Card>
//                 <CardContent className="p-6">
//                   <div className="flex items-center space-x-2 mb-4">
//                     <Filter className="h-4 w-4 text-gray-600" />
//                     <h3 className="font-semibold text-gray-900">Filter Reports</h3>
//                   </div>
//                   <form className="space-y-2">
//                     <div>
//                       <label className="text-xs font-medium text-gray-600 mb-2 block">Search</label>
//                       <div className="relative">
//                         <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
//                         <Input
//                           placeholder="Search reports..."
//                           defaultValue={searchParams.search || ""}
//                           name="search"
//                           className="pl-10 text-sm h-10"
//                         />
//                       </div>
//                     </div>
                    
//                     <div>
//                       <label className="text-xs font-medium text-gray-600 mb-2 block">Category</label>
//                       <Select defaultValue={searchParams.category || ""}>
//                         <SelectTrigger className="h-10 text-sm">
//                           <SelectValue placeholder="All categories" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value="all">All categories</SelectItem>
//                           {categories.map((category) => (
//                             <SelectItem key={category} value={category}>
//                               {category}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                     </div>
                    
//                     <div>
//                       <label className="text-xs font-medium text-gray-600 mb-2 block">Status</label>
//                       <Select defaultValue={searchParams.status || ""}>
//                         <SelectTrigger className="h-10 text-sm">
//                           <SelectValue placeholder="All statuses" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value="all">All statuses</SelectItem>
//                           <SelectItem value="SUBMITTED">Submitted</SelectItem>
//                           <SelectItem value="ASSIGNED_TO_DEPARTMENT">Assigned</SelectItem>
//                           <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
//                           <SelectItem value="RESOLVED">Resolved</SelectItem>
//                           <SelectItem value="APPROVED">Approved</SelectItem>
//                           <SelectItem value="COMPLETED">Completed</SelectItem>
//                         </SelectContent>
//                       </Select>
//                     </div>
                    
//                     <div>
//                       <label className="text-xs font-medium text-gray-600 mb-2 block">Priority</label>
//                       <Select defaultValue={searchParams.priority || ""}>
//                         <SelectTrigger className="h-10 text-sm">
//                           <SelectValue placeholder="All priorities" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value="all">All priorities</SelectItem>
//                           <SelectItem value="LOW">Low</SelectItem>
//                           <SelectItem value="MEDIUM">Medium</SelectItem>
//                           <SelectItem value="HIGH">High</SelectItem>
//                           <SelectItem value="URGENT">Urgent</SelectItem>
//                         </SelectContent>
//                       </Select>
//                     </div>

//                     <Button type="submit" className="w-full h-10 text-sm">
//                       Apply Filters
//                     </Button>
//                   </form>
//                 </CardContent>
//               </Card>

//               {/* Quick Actions */}
//               <Card>
//                 <CardContent className="p-6">
//                   <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
//                   <div className="space-y-2">
//                     <Button variant="outline" className="w-full justify-start text-sm h-10" asChild>
//                       <a href="/dashboard/student">
//                         <FileText className="h-4 w-4 mr-2" />
//                         Submit New Report
//                       </a>
//                     </Button>
//                     <Button variant="outline" className="w-full justify-start text-sm h-10" asChild>
//                       <a href="/dashboard/student">
//                         <Clock className="h-4 w-4 mr-2" />
//                         Track My Reports
//                       </a>
//                     </Button>
//                   </div>
//                 </CardContent>
//               </Card>

//               {/* Recent Activity */}
//               <Card>
//                 <CardContent className="p-6">
//                   <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
//                   <div className="space-y-3">
//                     {reports.slice(0, 3).map((report, index) => (
//                       <div key={report.id} className="flex items-start space-x-3 text-sm">
//                         <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
//                         <div className="flex-1 min-w-0">
//                           <p className="text-gray-900 truncate">{report.title}</p>
//                           <p className="text-gray-500 text-xs">
//                             {new Date(report.createdAt).toLocaleDateString()}
//                           </p>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   )
// }








"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  Home, 
  FileText, 
  Users, 
  Building2, 
  LogOut,
  Shield
} from "lucide-react"
import { useClerk } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"

interface SidebarProps {
  userRole: "STUDENT" | "DSW_ADMIN" | "DEPT_ADMIN"
}

export function Sidebar({ userRole }: SidebarProps) {
  const pathname = usePathname()
  const { signOut } = useClerk()

  const handleSignOut = () => {
    signOut({ redirectUrl: "/" })
  }

  const navigation = [
    {
      name: "Public View",
      href: "/public",
      icon: Home,
      show: true,
      description: "View all reports publicly"
    },
    {
      name: "Student Dashboard",
      href: "/dashboard/student",
      icon: FileText,
      show: true,
      description: "Submit and track your reports"
    },
    {
      name: "DSW Admin Dashboard",
      href: "/dashboard/dsw-admin",
      icon: Users,
      show: userRole === "DSW_ADMIN",
      description: "Manage and assign reports"
    },
    {
      name: "Department Admin Dashboard",
      href: "/dashboard/dept-admin",
      icon: Building2,
      show: userRole === "DEPT_ADMIN",
      description: "Resolve assigned reports"
    },
  ]

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
      <div className="flex min-h-0 flex-1 flex-col bg-white border-r border-gray-200 shadow-sm">
        {/* Header */}
        <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
          <div className="flex flex-shrink-0 items-center px-6 mb-8">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-bold text-gray-900">UIUSPRS</h1>
                <p className="text-sm text-gray-500">Student Reporting System</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="mt-5 flex-1 space-y-2 px-4">
            {navigation.map((item) => {
              if (!item.show) return null
              
              const isActive = pathname === item.href
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <item.icon
                    className={cn(
                      "mr-3 h-5 w-5 flex-shrink-0 transition-colors",
                      isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-500"
                    )}
                    aria-hidden="true"
                  />
                  <div className="flex-1">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{item.description}</div>
                  </div>
                </Link>
              )
            })}
          </nav>

          {/* Role Badge */}
          <div className="px-4 mt-6">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Current Role
              </div>
              <div className="mt-1 text-sm font-medium text-gray-900">
                {userRole === "STUDENT" && "Student"}
                {userRole === "DSW_ADMIN" && "DSW Administrator"}
                {userRole === "DEPT_ADMIN" && "Department Administrator"}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-shrink-0 border-t border-gray-200 p-4">
          <Button
            onClick={handleSignOut}
            variant="ghost"
            className="group flex w-full items-center px-4 py-2 text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-700 rounded-lg transition-all duration-200"
          >
            <LogOut className="mr-3 h-5 w-5 text-gray-400 group-hover:text-red-500" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  )
}
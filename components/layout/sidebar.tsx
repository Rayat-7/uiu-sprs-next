"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  Home, 
  FileText, 
  Users, 
  Building2, 
  Settings,
  LogOut
} from "lucide-react"
import { useClerk } from "@clerk/nextjs"

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
    },
    {
      name: "Student Dashboard",
      href: "/dashboard/student",
      icon: FileText,
      show: true,
    },
    {
      name: "DSW Admin",
      href: "/dashboard/dsw-admin",
      icon: Users,
      show: userRole === "DSW_ADMIN",
    },
    {
      name: "Department Admin",
      href: "/dashboard/dept-admin",
      icon: Building2,
      show: userRole === "DEPT_ADMIN",
    },
  ]

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
      <div className="flex min-h-0 flex-1 flex-col bg-gray-800">
        <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
          <div className="flex flex-shrink-0 items-center px-4">
            <h1 className="text-white text-lg font-semibold">UIUSPRS</h1>
          </div>
          <nav className="mt-5 flex-1 space-y-1 px-2">
            {navigation.map((item) => {
              if (!item.show) return null
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    pathname === item.href
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white",
                    "group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                  )}
                >
                  <item.icon
                    className="mr-3 h-5 w-5 flex-shrink-0"
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
        <div className="flex flex-shrink-0 bg-gray-700 p-4">
          <button
            onClick={handleSignOut}
            className="group flex w-full items-center px-2 py-2 text-sm font-medium text-gray-300 hover:bg-gray-600 hover:text-white rounded-md"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  )
}
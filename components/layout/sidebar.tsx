"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Home, User, Shield, Building2, Menu, X } from "lucide-react"

interface SidebarProps {
  userRole: "STUDENT" | "DSW_ADMIN" | "DEPT_ADMIN"
}

export function Sidebar({ userRole }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

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
      icon: User,
      show: true,
    },
    {
      name: "DSW Admin Dashboard",
      href: "/dashboard/dsw-admin",
      icon: Shield,
      show: userRole === "DSW_ADMIN",
    },
    {
      name: "Department Dashboard",
      href: "/dashboard/dept-admin",
      icon: Building2,
      show: userRole === "DEPT_ADMIN",
    },
  ]

  const visibleNavigation = navigation.filter((item) => item.show)

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button variant="outline" size="sm" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center px-6 py-4 border-b">
            <Shield className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">UIUSPRS</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {visibleNavigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                    isActive ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                  )}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* User role indicator */}
          <div className="px-6 py-4 border-t">
            <div className="text-xs text-gray-500 uppercase tracking-wide">Current Role</div>
            <div className="text-sm font-medium text-gray-900 mt-1">
              {userRole
                .replace("_", " ")
                .toLowerCase()
                .replace(/\b\w/g, (l) => l.toUpperCase())}
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden" onClick={() => setIsOpen(false)} />
      )}
    </>
  )
}

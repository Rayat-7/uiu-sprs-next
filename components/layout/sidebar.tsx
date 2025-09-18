"use client"

import React, { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  Home, 
  FileText, 
  Users, 
  Building2, 
  Menu,
  X,
  LogOut,
  Shield
} from "lucide-react"
import { useClerk } from "@clerk/nextjs"
import { motion, AnimatePresence } from "framer-motion"

interface SidebarProps {
  userRole: "STUDENT" | "DSW_ADMIN" | "DEPT_ADMIN"
}

export function Sidebar({ userRole }: SidebarProps) {
  const pathname = usePathname()
  const { signOut } = useClerk()
  const [isOpen, setIsOpen] = useState(false)

  const handleSignOut = () => {
    signOut({ redirectUrl: "/" })
  }

  const navigation = [
    {
      name: "Public View",
      href: "/public",
      icon: Home,
      show: true,
      description: "View all reports anonymously"
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

  const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className="flex h-full flex-col bg-white border-r border-border">
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-6 border-b border-border">
        <div className="flex items-center space-x-2">
          <Shield className="h-8 w-8 text-primary" />
          <h1 className="text-xl font-bold text-foreground">UIUSPRS</h1>
        </div>
        {isMobile && (
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-md hover:bg-accent"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          if (!item.show) return null
          
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => isMobile && setIsOpen(false)}
              className={cn(
                "group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                pathname === item.href
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
              <div className="flex-1">
                <div>{item.name}</div>
                {!isMobile && (
                  <div className="text-xs opacity-70 mt-1">
                    {item.description}
                  </div>
                )}
              </div>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-border p-4">
        <button
          onClick={handleSignOut}
          className="group flex w-full items-center px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors"
        >
          <LogOut className="mr-3 h-5 w-5" />
          <div>
            <div>Sign Out</div>
            <div className="text-xs opacity-70 mt-1">Return to landing</div>
          </div>
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between h-16 px-4 bg-white border-b border-border">
          <div className="flex items-center space-x-2">
            <Shield className="h-6 w-6 text-primary" />
            <h1 className="text-lg font-semibold text-foreground">UIUSPRS</h1>
          </div>
          <button
            onClick={() => setIsOpen(true)}
            className="p-2 rounded-md hover:bg-accent"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        {/* Mobile Sidebar */}
        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
                className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              />
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "tween", duration: 0.3 }}
                className="fixed inset-y-0 left-0 w-80 z-50 lg:hidden"
              >
                <SidebarContent isMobile />
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-80 lg:flex-col">
        <SidebarContent />
      </div>
    </>
  )
}













// "use client"

// import React, { useState } from "react"
// import Link from "next/link"
// import { usePathname } from "next/navigation"
// import { cn } from "@/lib/utils"
// import { 
//   Home, 
//   FileText, 
//   Users, 
//   Building2, 
//   Menu,
//   X,
//   LogOut,
//   Shield
// } from "lucide-react"
// import { useClerk } from "@clerk/nextjs"
// import { motion, AnimatePresence } from "framer-motion"

// interface SidebarProps {
//   userRole: "STUDENT" | "DSW_ADMIN" | "DEPT_ADMIN"
// }

// export function Sidebar({ userRole }: SidebarProps) {
//   const pathname = usePathname()
//   const { signOut } = useClerk()
//   const [isOpen, setIsOpen] = useState(false)

//   const handleSignOut = () => {
//     signOut({ redirectUrl: "/" })
//   }

//   const navigation = [
//     {
//       name: "Public View",
//       href: "/public",
//       icon: Home,
//       show: true,
//       description: "View all reports anonymously"
//     },
//     {
//       name: "Student Dashboard",
//       href: "/dashboard/student",
//       icon: FileText,
//       show: true,
//       description: "Submit and track your reports"
//     },
//     {
//       name: "DSW Admin",
//       href: "/dashboard/dsw-admin",
//       icon: Users,
//       show: userRole === "DSW_ADMIN",
//       description: "Manage and assign reports"
//     },
//     {
//       name: "Department Admin",
//       href: "/dashboard/dept-admin",
//       icon: Building2,
//       show: userRole === "DEPT_ADMIN",
//       description: "Resolve assigned reports"
//     },
//   ]

//   const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
//     <div className="flex h-full flex-col bg-white border-r border-border">
//       {/* Header */}
//       <div className="flex items-center justify-between h-16 px-6 border-b border-border">
//         <div className="flex items-center space-x-2">
//           <Shield className="h-8 w-8 text-primary" />
//           <h1 className="text-xl font-bold text-foreground">UIUSPRS</h1>
//         </div>
//         {isMobile && (
//           <button
//             onClick={() => setIsOpen(false)}
//             className="p-2 rounded-md hover:bg-accent"
//           >
//             <X className="h-5 w-5" />
//           </button>
//         )}
//       </div>

//       {/* Navigation */}
//       <nav className="flex-1 px-4 py-6 space-y-2">
//         {navigation.map((item) => {
//           if (!item.show) return null
          
//           return (
//             <Link
//               key={item.name}
//               href={item.href}
//               onClick={() => isMobile && setIsOpen(false)}
//               className={cn(
//                 "group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors",
//                 pathname === item.href
//                   ? "bg-primary text-primary-foreground shadow-sm"
//                   : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
//               )}
//             >
//               <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
//               <div className="flex-1">
//                 <div>{item.name}</div>
//                 {!isMobile && (
//                   <div className="text-xs opacity-70 mt-1">
//                     {item.description}
//                   </div>
//                 )}
//               </div>
//             </Link>
//           )
//         })}
//       </nav>

//       {/* Footer */}
//       <div className="border-t border-border p-4">
//         <button
//           onClick={handleSignOut}
//           className="group flex w-full items-center px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors"
//         >
//           <LogOut className="mr-3 h-5 w-5" />
//           <div>
//             <div>Sign Out</div>
//             <div className="text-xs opacity-70 mt-1">Return to landing</div>
//           </div>
//         </button>
//       </div>
//     </div>
//   )

//   return (
//     <>
//       {/* Mobile Menu Button */}
//       <div className="lg:hidden">
//         <div className="flex items-center justify-between h-16 px-4 bg-white border-b border-border">
//           <div className="flex items-center space-x-2">
//             <Shield className="h-6 w-6 text-primary" />
//             <h1 className="text-lg font-semibold text-foreground">UIUSPRS</h1>
//           </div>
//           <button
//             onClick={() => setIsOpen(true)}
//             className="p-2 rounded-md hover:bg-accent"
//           >
//             <Menu className="h-5 w-5" />
//           </button>
//         </div>

//         {/* Mobile Sidebar */}
//         <AnimatePresence>
//           {isOpen && (
//             <>
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//                 onClick={() => setIsOpen(false)}
//                 className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
//               />
//               <motion.div
//                 initial={{ x: "-100%" }}
//                 animate={{ x: 0 }}
//                 exit={{ x: "-100%" }}
//                 transition={{ type: "tween", duration: 0.3 }}
//                 className="fixed inset-y-0 left-0 w-80 z-50 lg:hidden"
//               >
//                 <SidebarContent isMobile />
//               </motion.div>
//             </>
//           )}
//         </AnimatePresence>
//       </div>

//       {/* Desktop Sidebar */}
//       <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-80 lg:flex-col">
//         <SidebarContent />
//       </div>
//     </>
//   )
// }










// "use client"

// import Link from "next/link"
// import { usePathname } from "next/navigation"
// import { cn } from "@/lib/utils"
// import { 
//   Home, 
//   FileText, 
//   Users, 
//   Building2, 
//   Settings,
//   LogOut
// } from "lucide-react"
// import { useClerk } from "@clerk/nextjs"

// interface SidebarProps {
//   userRole: "STUDENT" | "DSW_ADMIN" | "DEPT_ADMIN"
// }

// export function Sidebar({ userRole }: SidebarProps) {
//   const pathname = usePathname()
//   const { signOut } = useClerk()

//   const handleSignOut = () => {
//     signOut({ redirectUrl: "/" })
//   }

//   const navigation = [
//     {
//       name: "Public View",
//       href: "/public",
//       icon: Home,
//       show: true,
//     },
//     {
//       name: "Student Dashboard",
//       href: "/dashboard/student",
//       icon: FileText,
//       show: true,
//     },
//     {
//       name: "DSW Admin",
//       href: "/dashboard/dsw-admin",
//       icon: Users,
//       show: userRole === "DSW_ADMIN",
//     },
//     {
//       name: "Department Admin",
//       href: "/dashboard/dept-admin",
//       icon: Building2,
//       show: userRole === "DEPT_ADMIN",
//     },
//   ]

//   return (
//     <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
//       <div className="flex min-h-0 flex-1 flex-col bg-gray-800">
//         <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
//           <div className="flex flex-shrink-0 items-center px-4">
//             <h1 className="text-white text-lg font-semibold">UIUSPRS</h1>
//           </div>
//           <nav className="mt-5 flex-1 space-y-1 px-2">
//             {navigation.map((item) => {
//               if (!item.show) return null
              
//               return (
//                 <Link
//                   key={item.name}
//                   href={item.href}
//                   className={cn(
//                     pathname === item.href
//                       ? "bg-gray-900 text-white"
//                       : "text-gray-300 hover:bg-gray-700 hover:text-white",
//                     "group flex items-center px-2 py-2 text-sm font-medium rounded-md"
//                   )}
//                 >
//                   <item.icon
//                     className="mr-3 h-5 w-5 flex-shrink-0"
//                     aria-hidden="true"
//                   />
//                   {item.name}
//                 </Link>
//               )
//             })}
//           </nav>
//         </div>
//         <div className="flex flex-shrink-0 bg-gray-700 p-4">
//           <button
//             onClick={handleSignOut}
//             className="group flex w-full items-center px-2 py-2 text-sm font-medium text-gray-300 hover:bg-gray-600 hover:text-white rounded-md"
//           >
//             <LogOut className="mr-3 h-5 w-5" />
//             Sign Out
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }
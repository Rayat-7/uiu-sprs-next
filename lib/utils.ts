import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isUIUEmail(email: string): boolean {
  if (!email) return false
  // Check if email contains .uiu.ac.bd (covers all department formats)
  // This will match: department.uiu.ac.bd, subdept.department.uiu.ac.bd, etc.
  return email.toLowerCase().includes(".uiu.ac.bd")
}

export function getReportStatusColor(status: string) {
  switch (status) {
    case "SUBMITTED":
      return "bg-blue-100 text-blue-800"
    case "ASSIGNED_TO_DEPARTMENT":
      return "bg-yellow-100 text-yellow-800"
    case "IN_PROGRESS":
      return "bg-orange-100 text-orange-800"
    case "RESOLVED":
      return "bg-purple-100 text-purple-800"
    case "APPROVED":
      return "bg-green-100 text-green-800"
    case "COMPLETED":
      return "bg-gray-100 text-gray-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export function formatReportStatus(status: string) {
  return status
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (l) => l.toUpperCase())
}
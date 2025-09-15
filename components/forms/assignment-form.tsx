"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface DepartmentAdmin {
  id: string
  firstName: string | null
  lastName: string | null
  email: string
}

interface AssignmentFormProps {
  reportId: string
  departmentAdmins: DepartmentAdmin[]
}

export function AssignmentForm({ reportId, departmentAdmins }: AssignmentFormProps) {
  const router = useRouter()
  const [isAssigning, setIsAssigning] = useState(false)
  const [selectedAdmin, setSelectedAdmin] = useState("")
  const [message, setMessage] = useState("")

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedAdmin) return

    setIsAssigning(true)

    try {
      const response = await fetch(`/api/reports/${reportId}/assign`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          assignedToId: selectedAdmin,
          message: message || "Report has been assigned to your department for review and resolution.",
        }),
      })

      if (response.ok) {
        router.refresh()
        setSelectedAdmin("")
        setMessage("")
      } else {
        throw new Error("Failed to assign report")
      }
    } catch (error) {
      console.error("Error assigning report:", error)
      alert("Failed to assign report. Please try again.")
    } finally {
      setIsAssigning(false)
    }
  }

  return (
    <form onSubmit={handleAssign} className="space-y-4 bg-gray-50 p-4 rounded-lg">
      <div>
        <Label htmlFor="admin">Assign to Department Admin</Label>
        <Select value={selectedAdmin} onValueChange={setSelectedAdmin}>
          <SelectTrigger>
            <SelectValue placeholder="Select department admin" />
          </SelectTrigger>
          <SelectContent>
            {departmentAdmins.map((admin) => (
              <SelectItem key={admin.id} value={admin.id}>
                {admin.firstName} {admin.lastName} ({admin.email})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="message">Assignment Message (Optional)</Label>
        <Textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Add any specific instructions or notes for the department admin"
          rows={3}
        />
      </div>

      <Button type="submit" disabled={!selectedAdmin || isAssigning} className="w-full">
        {isAssigning ? "Assigning..." : "Assign to Department"}
      </Button>
    </form>
  )
}

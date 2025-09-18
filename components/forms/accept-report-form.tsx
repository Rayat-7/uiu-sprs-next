"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Clock, Loader2 } from "lucide-react"

interface AcceptReportFormProps {
  reportId: string
}

export function AcceptReportForm({ reportId }: AcceptReportFormProps) {
  const router = useRouter()
  const [isAccepting, setIsAccepting] = useState(false)

  const handleAccept = async () => {
    setIsAccepting(true)
    
    try {
      const response = await fetch(`/api/report/${reportId}/accept`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        router.refresh()
      } else {
        throw new Error("Failed to accept report")
      }
    } catch (error) {
      console.error("Error accepting report:", error)
      alert("Failed to accept report. Please try again.")
    } finally {
      setIsAccepting(false)
    }
  }

  return (
    <Card className="bg-blue-50 border-blue-200">
      <CardHeader>
        <CardTitle className="text-lg text-blue-800 flex items-center">
          <Clock className="mr-2 h-5 w-5" />
          Accept Assignment
        </CardTitle>
        <CardDescription>
          Acknowledge this report assignment and begin working on the resolution
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm text-blue-700 bg-blue-100 p-3 rounded-md">
            <p className="font-medium mb-1">Next Steps:</p>
            <ul className="text-xs space-y-1">
              <li>• Review the report details and any attached evidence</li>
              <li>• Investigate the issue within your department</li>
              <li>• Coordinate with relevant team members if needed</li>
              <li>• Provide a resolution once the issue is addressed</li>
            </ul>
          </div>
          
          <Button
            onClick={handleAccept}
            disabled={isAccepting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isAccepting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Accepting Assignment...
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Accept & Start Working
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
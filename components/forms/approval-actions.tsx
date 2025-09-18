"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, MessageCircle, Loader2 } from "lucide-react"

interface ApprovalActionsProps {
  reportId: string
}

export function ApprovalActions({ reportId }: ApprovalActionsProps) {
  const router = useRouter()
  const [isApproving, setIsApproving] = useState(false)
  const [isRequesting, setIsRequesting] = useState(false)
  const [showRequestForm, setShowRequestForm] = useState(false)
  const [requestMessage, setRequestMessage] = useState("")

  const handleApprove = async () => {
    setIsApproving(true)
    
    try {
      const response = await fetch(`/api/report/${reportId}/approve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        router.refresh()
      } else {
        throw new Error("Failed to approve report")
      }
    } catch (error) {
      console.error("Error approving report:", error)
      alert("Failed to approve report. Please try again.")
    } finally {
      setIsApproving(false)
    }
  }

  const handleRequestChanges = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!requestMessage.trim()) return

    setIsRequesting(true)
    
    try {
      const response = await fetch(`/api/report/${reportId}/request-changes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: requestMessage.trim(),
        }),
      })

      if (response.ok) {
        router.refresh()
        setRequestMessage("")
        setShowRequestForm(false)
      } else {
        throw new Error("Failed to request changes")
      }
    } catch (error) {
      console.error("Error requesting changes:", error)
      alert("Failed to request changes. Please try again.")
    } finally {
      setIsRequesting(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex space-x-3">
        <Button
          onClick={handleApprove}
          disabled={isApproving}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          {isApproving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Approving...
            </>
          ) : (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Approve & Complete
            </>
          )}
        </Button>
        
        <Button
          onClick={() => setShowRequestForm(!showRequestForm)}
          variant="outline"
          className="border-orange-300 text-orange-700 hover:bg-orange-50"
        >
          <MessageCircle className="mr-2 h-4 w-4" />
          Request Changes
        </Button>
      </div>

      {showRequestForm && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-6">
            <form onSubmit={handleRequestChanges} className="space-y-4">
              <div>
                <Label htmlFor="changes">What changes are needed?</Label>
                <Textarea
                  id="changes"
                  value={requestMessage}
                  onChange={(e) => setRequestMessage(e.target.value)}
                  placeholder="Please specify what needs to be improved or changed in the resolution..."
                  rows={3}
                  required
                />
              </div>
              
              <div className="flex space-x-2">
                <Button
                  type="submit"
                  disabled={!requestMessage.trim() || isRequesting}
                  size="sm"
                  variant="outline"
                  className="border-orange-300 text-orange-700 hover:bg-orange-100"
                >
                  {isRequesting ? (
                    <>
                      <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Request"
                  )}
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setShowRequestForm(false)
                    setRequestMessage("")
                  }}
                  size="sm"
                  variant="ghost"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface ResolutionFormProps {
  reportId: string
}

export function ResolutionForm({ reportId }: ResolutionFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [resolution, setResolution] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!resolution.trim()) return

    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/reports/${reportId}/resolve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resolution: resolution.trim(),
        }),
      })

      if (response.ok) {
        router.refresh()
        setResolution("")
      } else {
        throw new Error("Failed to submit resolution")
      }
    } catch (error) {
      console.error("Error submitting resolution:", error)
      alert("Failed to submit resolution. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="bg-green-50 border-green-200">
      <CardHeader>
        <CardTitle className="text-lg text-green-800">Submit Resolution</CardTitle>
        <CardDescription>Provide details about how this issue was resolved</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="resolution">Resolution Details</Label>
            <Textarea
              id="resolution"
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
              placeholder="Describe the steps taken to resolve this issue, what was done, and any follow-up actions..."
              rows={4}
              required
            />
          </div>

          <Button
            type="submit"
            disabled={!resolution.trim() || isSubmitting}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            {isSubmitting ? "Submitting Resolution..." : "Mark as Resolved"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

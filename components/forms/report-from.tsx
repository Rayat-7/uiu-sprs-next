"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, X, Loader2, CheckCircle } from "lucide-react"
import { useUser } from "@clerk/nextjs"

interface ReportFormProps {
  userId: string
}

export function ReportForm({ userId }: ReportFormProps) {
  const router = useRouter()
  const { user } = useUser()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    priority: "MEDIUM",
  })

  const categories = [
    "Academic Issues",
    "Facility Problems", 
    "Administrative Issues",
    "IT Support",
    "Library Services",
    "Cafeteria/Food Services",
    "Transportation",
    "Hostel/Accommodation",
    "Financial Issues",
    "Other",
  ]

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB")
        return
      }
      setSelectedFile(file)
    }
  }

  const removeFile = () => {
    setSelectedFile(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      console.log("Submitting form with data:", formData)
      console.log("User ID:", userId)
      console.log("Clerk User:", user)

      // Validate form data
      if (!formData.title.trim()) {
        throw new Error("Title is required")
      }
      if (!formData.description.trim()) {
        throw new Error("Description is required")
      }
      if (!formData.category) {
        throw new Error("Category is required")
      }

      // In a real app, you would upload the file to a storage service first
      // For now, we'll just store the filename
      const fileUrl = selectedFile ? `/uploads/${selectedFile.name}` : null

      const response = await fetch("/api/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title.trim(),
          description: formData.description.trim(),
          category: formData.category,
          priority: formData.priority,
          fileUrl,
        }),
      })

      const result = await response.json()
      console.log("Response:", response.status, result)

      if (response.ok) {
        setSubmitStatus('success')
        // Reset form
        setFormData({
          title: "",
          description: "",
          category: "",
          priority: "MEDIUM",
        })
        setSelectedFile(null)
        
        // Refresh the page to show the new report
        setTimeout(() => {
          router.refresh()
        }, 1500)
      } else {
        throw new Error(result.error || `HTTP ${response.status}`)
      }
    } catch (error) {
      console.error("Error submitting report:", error)
      setSubmitStatus('error')
      alert(`Failed to submit report: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="title">Report Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Brief description of the issue"
          required
          disabled={isSubmitting}
        />
      </div>

      <div>
        <Label htmlFor="category">Category *</Label>
        <Select 
          value={formData.category} 
          onValueChange={(value) => setFormData({ ...formData, category: value })}
          disabled={isSubmitting}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="priority">Priority</Label>
        <Select 
          value={formData.priority} 
          onValueChange={(value) => setFormData({ ...formData, priority: value })}
          disabled={isSubmitting}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="LOW">Low</SelectItem>
            <SelectItem value="MEDIUM">Medium</SelectItem>
            <SelectItem value="HIGH">High</SelectItem>
            <SelectItem value="URGENT">Urgent</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Provide detailed information about the issue, including when it occurred, what you expected vs what happened, and any relevant context"
          rows={4}
          required
          disabled={isSubmitting}
        />
      </div>

      <div>
        <Label>Attach Evidence (Optional)</Label>
        <div className="mt-2">
          {!selectedFile ? (
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 disabled:opacity-50">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-4 text-gray-500" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">PNG, JPG, PDF up to 5MB</p>
              </div>
              <input 
                type="file" 
                className="hidden" 
                accept=".png,.jpg,.jpeg,.pdf" 
                onChange={handleFileChange} 
                disabled={isSubmitting}
              />
            </label>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center space-x-2">
                  <div className="text-sm font-medium">{selectedFile.name}</div>
                  <div className="text-xs text-gray-500">({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)</div>
                </div>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  onClick={removeFile}
                  disabled={isSubmitting}
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full" 
        disabled={isSubmitting || !formData.title.trim() || !formData.description.trim() || !formData.category}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting Report...
          </>
        ) : submitStatus === 'success' ? (
          <>
            <CheckCircle className="mr-2 h-4 w-4" />
            Report Submitted Successfully!
          </>
        ) : (
          "Submit Report"
        )}
      </Button>

      {submitStatus === 'success' && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm text-green-800">
            Your report has been submitted successfully! You can track its progress in the reports list below.
          </p>
        </div>
      )}
    </form>
  )
}










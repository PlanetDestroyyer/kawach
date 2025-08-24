"use client"

import { useState } from "react"
import { ArrowLeft, Camera, FileText, AlertTriangle, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

export default function IncidentReportPage() {
  const [description, setDescription] = useState("")
  const [incidentType, setIncidentType] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!description.trim() || !incidentType) {
      alert("Please fill in all required fields")
      return
    }

    setIsSubmitting(true)
    // Simulate API call
    setTimeout(() => {
      alert("Report submitted successfully. Authorities have been notified.")
      setDescription("")
      setIncidentType("")
      setIsSubmitting(false)
    }, 2000)
  }

  const handleFileUpload = () => {
    // Simulate file upload
    alert("File upload feature would open camera/gallery here")
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="px-6 py-4 border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <Link href="/">
            <Button variant="ghost" size="sm" className="p-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-destructive" />
            <h1 className="text-xl font-semibold text-foreground">Report Incident</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-6 py-6 space-y-6">
        {/* Info Card */}
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-start gap-3">
            <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900 mb-1">Confidential Reporting</h3>
              <p className="text-sm text-blue-700">
                Your report will be handled confidentially. Include as much detail as possible to help authorities
                respond effectively.
              </p>
            </div>
          </div>
        </Card>

        {/* Form */}
        <div className="space-y-6">
          {/* Incident Type */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              Type of Incident *
            </label>
            <Select value={incidentType} onValueChange={setIncidentType}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select incident type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="harassment">Harassment</SelectItem>
                <SelectItem value="stalking">Stalking</SelectItem>
                <SelectItem value="violence">Violence</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              Describe the Incident *
            </label>
            <Textarea
              placeholder="Please provide details about what happened, when, where, and any other relevant information..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-32 resize-none"
            />
            <p className="text-xs text-muted-foreground">{description.length}/500 characters</p>
          </div>

          {/* Upload Media */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Camera className="h-4 w-4 text-accent" />
              Upload Evidence (Optional)
            </label>
            <Card className="p-4 border-dashed border-2 border-muted-foreground/25 hover:border-accent/50 transition-colors">
              <Button
                variant="ghost"
                onClick={handleFileUpload}
                className="w-full h-auto p-4 flex flex-col items-center gap-2 text-muted-foreground hover:text-accent"
              >
                <Camera className="h-8 w-8" />
                <div className="text-center">
                  <p className="font-medium">Upload Photo or Video</p>
                  <p className="text-xs">Tap to add evidence (photos, videos, audio)</p>
                </div>
              </Button>
            </Card>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !description.trim() || !incidentType}
            className="w-full h-12 bg-destructive hover:bg-destructive/90 text-white font-semibold"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Submitting Report...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                Submit Report
              </div>
            )}
          </Button>
        </div>

        {/* Emergency Note */}
        <Card className="p-4 bg-red-50 border-red-200">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-red-900 mb-1">Emergency Situation?</h3>
              <p className="text-sm text-red-700 mb-2">
                If you're in immediate danger, call emergency services or use the SOS button.
              </p>
              <Link href="/sos">
                <Button size="sm" variant="destructive">
                  Go to SOS
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </main>
    </div>
  )
}

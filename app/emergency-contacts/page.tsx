"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

export default function EmergencyContactsPage() {
  const [userData, setUserData] = useState<{ name: string; email: string } | null>(null)
  const [formData, setFormData] = useState({
    aadharNumber: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
  })

  useEffect(() => {
    const storedData = localStorage.getItem("userData")
    if (storedData) {
      setUserData(JSON.parse(storedData))
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Store complete user data and navigate to dashboard
    const completeData = { ...userData, ...formData }
    localStorage.setItem("completeUserData", JSON.stringify(completeData))
    window.location.href = "/dashboard"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Emergency Setup</CardTitle>
          <CardDescription className="text-gray-600">
            {userData?.name && `Hi ${userData.name}! `}
            Please provide your identification and emergency contact details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="aadharNumber" className="text-sm font-medium text-gray-700">
                Aadhar Card Number
              </Label>
              <Input
                id="aadharNumber"
                name="aadharNumber"
                type="text"
                placeholder="Enter your 12-digit Aadhar number"
                value={formData.aadharNumber}
                onChange={handleInputChange}
                maxLength={12}
                pattern="[0-9]{12}"
                required
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emergencyContactName" className="text-sm font-medium text-gray-700">
                Emergency Contact Name
              </Label>
              <Input
                id="emergencyContactName"
                name="emergencyContactName"
                type="text"
                placeholder="Enter emergency contact's name"
                value={formData.emergencyContactName}
                onChange={handleInputChange}
                required
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emergencyContactPhone" className="text-sm font-medium text-gray-700">
                Emergency Contact Phone
              </Label>
              <Input
                id="emergencyContactPhone"
                name="emergencyContactPhone"
                type="tel"
                placeholder="Enter emergency contact's phone number"
                value={formData.emergencyContactPhone}
                onChange={handleInputChange}
                pattern="[0-9]{10}"
                maxLength={10}
                required
                className="w-full"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5"
              disabled={!formData.aadharNumber || !formData.emergencyContactName || !formData.emergencyContactPhone}
            >
              Complete Setup
            </Button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">Your information is encrypted and stored securely</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

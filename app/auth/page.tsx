"use client"

import type React from "react"
import { Shield, User, Mail, CreditCard, Phone, ArrowRight, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function AuthPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    aadharNumber: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyContactRelation: "",
  })
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1)
    } else {
      // Complete onboarding
      localStorage.setItem("isAuthenticated", "true")
      localStorage.setItem("userProfile", JSON.stringify(formData))
      router.push("/")
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const goBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-dark flex items-center justify-center px-6">
      <Card className="w-full max-w-md p-8 bg-card/90 backdrop-blur-sm border-border/50 glow-purple-soft">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="h-12 w-12 text-secondary glow-purple-soft" />
            <h1 className="text-3xl font-bold text-foreground font-sans">SAFE GUARD</h1>
          </div>
          <p className="text-muted-foreground">
            {currentStep === 1 ? "Create your safety profile" : "Complete your verification"}
          </p>

          <div className="flex justify-center gap-2 mt-4">
            <div className={`w-3 h-3 rounded-full ${currentStep >= 1 ? "bg-secondary" : "bg-muted"}`} />
            <div className={`w-3 h-3 rounded-full ${currentStep >= 2 ? "bg-secondary" : "bg-muted"}`} />
          </div>
        </div>

        {currentStep === 1 && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground font-medium">
                Full Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="pl-10 bg-background/50 border-border/50 focus:border-secondary"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground font-medium">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="pl-10 bg-background/50 border-border/50 focus:border-secondary"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold py-3 glow-purple-soft transition-all duration-300"
            >
              Continue <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
        )}

        {currentStep === 2 && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="aadhar" className="text-foreground font-medium">
                Aadhar Card Number
              </Label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="aadhar"
                  type="text"
                  placeholder="XXXX XXXX XXXX"
                  value={formData.aadharNumber}
                  onChange={(e) => handleInputChange("aadharNumber", e.target.value)}
                  className="pl-10 bg-background/50 border-border/50 focus:border-secondary"
                  maxLength={14}
                  required
                />
              </div>
              <p className="text-xs text-muted-foreground">For identity verification and emergency services</p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Emergency Contact</h3>

              <div className="space-y-2">
                <Label htmlFor="emergencyName" className="text-foreground font-medium">
                  Contact Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="emergencyName"
                    type="text"
                    placeholder="Emergency contact name"
                    value={formData.emergencyContactName}
                    onChange={(e) => handleInputChange("emergencyContactName", e.target.value)}
                    className="pl-10 bg-background/50 border-border/50 focus:border-secondary"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergencyPhone" className="text-foreground font-medium">
                  Phone Number
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="emergencyPhone"
                    type="tel"
                    placeholder="+91 XXXXX XXXXX"
                    value={formData.emergencyContactPhone}
                    onChange={(e) => handleInputChange("emergencyContactPhone", e.target.value)}
                    className="pl-10 bg-background/50 border-border/50 focus:border-secondary"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="relation" className="text-foreground font-medium">
                  Relationship
                </Label>
                <select
                  id="relation"
                  value={formData.emergencyContactRelation}
                  onChange={(e) => handleInputChange("emergencyContactRelation", e.target.value)}
                  className="w-full px-3 py-2 bg-background/50 border border-border/50 rounded-md text-foreground focus:border-secondary"
                  required
                >
                  <option value="">Select relationship</option>
                  <option value="Parent">Parent</option>
                  <option value="Spouse">Spouse</option>
                  <option value="Sibling">Sibling</option>
                  <option value="Friend">Friend</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={goBack}
                className="flex-1 border-border/50 hover:bg-background/50 bg-transparent"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold py-3 glow-purple-soft transition-all duration-300"
              >
                Complete Setup
              </Button>
            </div>
          </form>
        )}

        {/* Emergency Access */}
        <div className="mt-6 pt-6 border-t border-border/50">
          <Button
            variant="outline"
            onClick={() => router.push("/")}
            className="w-full border-destructive/50 text-destructive hover:bg-destructive/10 transition-all duration-300"
          >
            Emergency Access (Skip Setup)
          </Button>
        </div>
      </Card>
    </div>
  )
}

"use client"

import { useState } from "react"
import { ArrowLeft, User, Droplets, Award as IdCard, Globe, Shield, Phone, Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

export default function SettingsScreen() {
  const [autoSOS, setAutoSOS] = useState(true)
  const [fakeCallTimer, setFakeCallTimer] = useState(false)
  const [alertTone, setAlertTone] = useState(true)
  const [language, setLanguage] = useState("english")

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="flex items-center gap-4 px-6 py-4 border-b border-border">
        <Link href="/">
          <Button variant="ghost" size="sm" className="p-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-xl font-semibold text-foreground">Settings</h1>
      </header>

      {/* Main Content */}
      <main className="px-6 py-6 space-y-6 pb-24">
        {/* User Profile Section */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">Profile Information</h2>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-sm font-medium text-foreground mb-2 block">
                Full Name
              </Label>
              <Input id="name" placeholder="Enter your full name" defaultValue="Sarah Johnson" className="w-full" />
            </div>

            <div>
              <Label
                htmlFor="bloodGroup"
                className="text-sm font-medium text-foreground mb-2 block flex items-center gap-2"
              >
                <Droplets className="h-4 w-4 text-red-500" />
                Blood Group
              </Label>
              <Select defaultValue="o-positive">
                <SelectTrigger>
                  <SelectValue placeholder="Select blood group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="a-positive">A+</SelectItem>
                  <SelectItem value="a-negative">A-</SelectItem>
                  <SelectItem value="b-positive">B+</SelectItem>
                  <SelectItem value="b-negative">B-</SelectItem>
                  <SelectItem value="ab-positive">AB+</SelectItem>
                  <SelectItem value="ab-negative">AB-</SelectItem>
                  <SelectItem value="o-positive">O+</SelectItem>
                  <SelectItem value="o-negative">O-</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label
                htmlFor="emergencyId"
                className="text-sm font-medium text-foreground mb-2 block flex items-center gap-2"
              >
                <IdCard className="h-4 w-4 text-blue-500" />
                Emergency ID
              </Label>
              <Input
                id="emergencyId"
                placeholder="Enter emergency ID number"
                defaultValue="EMG-2024-001"
                className="w-full"
              />
            </div>
          </div>
        </Card>

        {/* Safety Preferences Section */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
              <Shield className="h-5 w-5 text-accent" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">Safety Preferences</h2>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Phone className="h-4 w-4 text-red-500" />
                  <Label className="text-sm font-medium text-foreground">Auto-SOS on Power Off</Label>
                </div>
                <p className="text-xs text-muted-foreground">
                  Automatically send SOS when phone battery is critically low
                </p>
              </div>
              <Switch checked={autoSOS} onCheckedChange={setAutoSOS} className="ml-4" />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Phone className="h-4 w-4 text-blue-500" />
                  <Label className="text-sm font-medium text-foreground">Fake Call Timer</Label>
                </div>
                <p className="text-xs text-muted-foreground">Enable timer for fake call feature (30 seconds delay)</p>
              </div>
              <Switch checked={fakeCallTimer} onCheckedChange={setFakeCallTimer} className="ml-4" />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Volume2 className="h-4 w-4 text-orange-500" />
                  <Label className="text-sm font-medium text-foreground">Alert Tone</Label>
                </div>
                <p className="text-xs text-muted-foreground">Play loud alert sound when SOS is activated</p>
              </div>
              <Switch checked={alertTone} onCheckedChange={setAlertTone} className="ml-4" />
            </div>
          </div>
        </Card>

        {/* Language & Accessibility Section */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
              <Globe className="h-5 w-5 text-blue-500" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">Language & Accessibility</h2>
          </div>

          <div>
            <Label className="text-sm font-medium text-foreground mb-2 block">App Language</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="spanish">Español</SelectItem>
                <SelectItem value="french">Français</SelectItem>
                <SelectItem value="german">Deutsch</SelectItem>
                <SelectItem value="hindi">हिंदी</SelectItem>
                <SelectItem value="chinese">中文</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* App Information */}
        <Card className="p-6">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">Safe Guard v2.1.0</p>
            <p className="text-xs text-muted-foreground">Your safety is our priority. Stay safe, stay connected.</p>
          </div>
        </Card>
      </main>
    </div>
  )
}

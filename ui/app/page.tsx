"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Shield,
  MapPin,
  Users,
  AlertTriangle,
  Phone,
  Volume2,
  Navigation,
  Clock,
  Signal,
  Lightbulb,
  Settings,
  ChevronDown,
  Plus,
  Upload,
  Zap,
  MessageCircle,
  Trash2,
  Camera,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function SafetyAppHome() {
  const [activeSection, setActiveSection] = useState("home")
  const [isLocationSharing, setIsLocationSharing] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  const [safetyPreferences, setSafetyPreferences] = useState({
    autoSOS: true,
    fakeCallTimer: false,
    alertTone: true,
  })

  const [selectedLanguage, setSelectedLanguage] = useState("English")
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false)

  const [expandedSections, setExpandedSections] = useState({
    selfDefense: false,
    personalSafety: false,
    digitalSafety: false,
  })

  useEffect(() => {
    const authStatus = localStorage.getItem("isAuthenticated")
    if (!authStatus) {
      router.push("/auth")
    } else {
      setIsAuthenticated(true)
    }
  }, [router])

  const [trustedContacts, setTrustedContacts] = useState([
    { id: 1, name: "Mom", phone: "+1 234-567-8901", relation: "Mother" },
    { id: 2, name: "Sarah", phone: "+1 234-567-8902", relation: "Best Friend" },
  ])
  const [newContact, setNewContact] = useState({ name: "", phone: "", relation: "" })
  const [showAddContact, setShowAddContact] = useState(false)

  const [incidentReport, setIncidentReport] = useState({
    type: "",
    description: "",
    files: [] as File[],
  })

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId)
    const element = document.getElementById(sectionId)
    element?.scrollIntoView({ behavior: "smooth" })
  }

  const addContact = () => {
    if (newContact.name && newContact.phone && trustedContacts.length < 5) {
      setTrustedContacts([
        ...trustedContacts,
        {
          id: Date.now(),
          ...newContact,
        },
      ])
      setNewContact({ name: "", phone: "", relation: "" })
      setShowAddContact(false)
    }
  }

  const removeContact = (id: number) => {
    setTrustedContacts(trustedContacts.filter((contact) => contact.id !== id))
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setIncidentReport((prev) => ({ ...prev, files: [...prev.files, ...files] }))
  }

  const submitIncidentReport = () => {
    console.log("[v0] Submitting incident report:", incidentReport)
    // Reset form
    setIncidentReport({ type: "", description: "", files: [] })
    alert("Incident report submitted successfully!")
  }

  const handleSendSOS = () => {
    console.log("[v0] Sending SOS to emergency contacts...")
    alert(
      "🚨 SOS Alert Sent!\n\nYour location has been shared with:\n• Mom (+1 234-567-8901)\n• Sarah (+1 234-567-8902)\n• Emergency Services (100)",
    )
  }

  const handleFakeCall = () => {
    console.log("[v0] Initiating fake call...")
    alert("📞 Fake Call Initiated\n\nIncoming call from: Mom\nThis will help you exit uncomfortable situations safely.")
  }

  const handleLoudSiren = () => {
    console.log("[v0] Activating loud siren...")
    alert("🚨 LOUD SIREN ACTIVATED!\n\nHigh-volume alarm is now playing to attract attention and deter threats.")
  }

  const handleEmergencyCall = (number: string, service: string) => {
    console.log(`[v0] Calling ${service}: ${number}`)
    alert(`📞 Calling ${service}\n\nDialing ${number}...\nStay calm and speak clearly about your emergency.`)
  }

  const toggleSafetyPreference = (key: keyof typeof safetyPreferences) => {
    setSafetyPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-secondary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-dark text-foreground relative">
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          size="lg"
          onClick={handleSendSOS}
          className="h-16 w-16 rounded-full bg-gradient-to-br from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold shadow-2xl transition-all duration-300 border-2 border-red-400/50"
        >
          <div className="flex flex-col items-center">
            <Phone className="h-6 w-6" />
            <span className="text-xs font-bold">SOS</span>
          </div>
        </Button>
      </div>

      {/* Main Scrollable Content */}
      <main className="pb-24">
        <section id="home" className="px-6 mb-16 pt-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground font-sans mb-2">Live Location & Safety</h1>
            <p className="text-muted-foreground">Real-time tracking and emergency response</p>
          </div>

          <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Signal className="h-5 w-5 text-green-400" />
              <span className="text-lg font-semibold text-foreground">GPS Active & Tracking</span>
              <div className="ml-auto flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Live • 2s ago</span>
              </div>
            </div>

            <div className="relative h-64 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 overflow-hidden border border-border/50 mb-4">
              {/* Mock Google Maps Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10">
                <div className="absolute inset-0 opacity-20">
                  <div className="grid grid-cols-12 grid-rows-8 h-full w-full">
                    {Array.from({ length: 96 }).map((_, i) => (
                      <div key={i} className="border border-border/10"></div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Street-like patterns for map realism */}
              <div className="absolute inset-0">
                <div className="absolute top-1/4 left-0 right-0 h-0.5 bg-border/30"></div>
                <div className="absolute top-2/4 left-0 right-0 h-0.5 bg-border/30"></div>
                <div className="absolute top-3/4 left-0 right-0 h-0.5 bg-border/30"></div>
                <div className="absolute left-1/4 top-0 bottom-0 w-0.5 bg-border/30"></div>
                <div className="absolute left-2/4 top-0 bottom-0 w-0.5 bg-border/30"></div>
                <div className="absolute left-3/4 top-0 bottom-0 w-0.5 bg-border/30"></div>
              </div>

              {/* Glowing Location Marker */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="relative">
                  <div className="h-12 w-12 bg-blue-500 rounded-full flex items-center justify-center animate-pulse shadow-lg">
                    <Navigation className="h-6 w-6 text-white" />
                  </div>
                  <div className="absolute -inset-3 rounded-full border-2 border-blue-400/30 animate-ping"></div>
                  <div className="absolute -inset-6 rounded-full border border-blue-400/20 animate-pulse"></div>
                </div>
              </div>

              {/* Map Controls */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <Button size="sm" variant="outline" className="h-8 w-8 p-0 bg-card/90 border-border/50">
                  <Plus className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" className="h-8 w-8 p-0 bg-card/90 border-border/50">
                  <span className="text-lg font-bold">-</span>
                </Button>
              </div>
            </div>

            <div className="bg-card/50 rounded-lg p-4 border border-border/30">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-4 w-4 text-accent" />
                <span className="font-medium text-foreground">Downtown Area, City Center</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Accuracy: ±5 meters</span>
                <span>Lat: 40.7128, Lng: -74.0060</span>
              </div>
            </div>
          </Card>

          {/* Location Controls */}
          <div className="grid grid-cols-1 gap-4 mb-8">
            <Button
              onClick={() => setIsLocationSharing(!isLocationSharing)}
              className={`h-14 text-lg font-semibold ${
                isLocationSharing
                  ? "bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              } transition-all duration-300`}
            >
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5" />
                <span>{isLocationSharing ? "Stop Location Sharing" : "Start Location Sharing"}</span>
              </div>
            </Button>

            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="h-12 border-border/50 hover:bg-background/50 transition-all duration-300 bg-transparent"
              >
                <Navigation className="h-4 w-4 mr-2" />
                Get Directions
              </Button>
              <Button
                variant="outline"
                className="h-12 border-border/50 hover:bg-background/50 transition-all duration-300 bg-transparent"
              >
                <Shield className="h-4 w-4 mr-2" />
                Safe Routes
              </Button>
            </div>
          </div>
        </section>

        {/* Quick Access Dashboard */}
        <section className="px-6 mb-16">
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground font-sans mb-2">Quick Access Dashboard</h2>
              <p className="text-muted-foreground">Essential safety features at your fingertips</p>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {/* Trusted Contacts */}
              <Card className="p-8 bg-card/80 backdrop-blur-sm border-border/50 hover:bg-card/90 transition-all duration-300">
                <Button
                  variant="ghost"
                  className="w-full h-auto p-0 hover:bg-transparent"
                  onClick={() => scrollToSection("contacts")}
                >
                  <div className="flex items-center gap-6 w-full">
                    <div className="h-16 w-16 rounded-full bg-secondary/20 flex items-center justify-center">
                      <Users className="h-8 w-8 text-secondary" />
                    </div>
                    <div className="text-left flex-1">
                      <h3 className="font-semibold text-foreground text-xl mb-1">Trusted Contacts</h3>
                      <p className="text-muted-foreground">Manage your emergency contacts and quick dial options</p>
                    </div>
                  </div>
                </Button>
              </Card>

              {/* Report Incident */}
              <Card className="p-8 bg-card/80 backdrop-blur-sm border-border/50 hover:bg-card/90 transition-all duration-300">
                <Button
                  variant="ghost"
                  className="w-full h-auto p-0 hover:bg-transparent"
                  onClick={() => scrollToSection("report")}
                >
                  <div className="flex items-center gap-6 w-full">
                    <div className="h-16 w-16 rounded-full bg-accent/20 flex items-center justify-center">
                      <AlertTriangle className="h-8 w-8 text-accent" />
                    </div>
                    <div className="text-left flex-1">
                      <h3 className="font-semibold text-foreground text-xl mb-1">Report Incident</h3>
                      <p className="text-muted-foreground">Document and report safety concerns with evidence</p>
                    </div>
                  </div>
                </Button>
              </Card>

              {/* Safety Tips */}
              <Card className="p-8 bg-card/80 backdrop-blur-sm border-border/50 hover:bg-card/90 transition-all duration-300">
                <Button
                  variant="ghost"
                  className="w-full h-auto p-0 hover:bg-transparent"
                  onClick={() => scrollToSection("tips")}
                >
                  <div className="flex items-center gap-6 w-full">
                    <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
                      <Lightbulb className="h-8 w-8 text-primary" />
                    </div>
                    <div className="text-left flex-1">
                      <h3 className="font-semibold text-foreground text-xl mb-1">Safety Tips</h3>
                      <p className="text-muted-foreground">Learn self-defense and safety techniques</p>
                    </div>
                  </div>
                </Button>
              </Card>
            </div>
          </div>
        </section>

        <section id="contacts" className="px-6 mb-16">
          <h2 className="text-xl font-bold text-foreground mb-6 font-sans">Trusted Contacts</h2>

          <div className="space-y-4">
            {/* Existing Contacts */}
            {trustedContacts.map((contact) => (
              <Card
                key={contact.id}
                className="p-4 bg-card/80 backdrop-blur-sm border-border/50 hover:bg-card/90 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-secondary/20 flex items-center justify-center">
                      <Users className="h-6 w-6 text-secondary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{contact.name}</h3>
                      <p className="text-sm text-muted-foreground">{contact.phone}</p>
                      <p className="text-xs text-muted-foreground">{contact.relation}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="bg-accent hover:bg-accent/90 text-accent-foreground"
                      onClick={() => handleEmergencyCall(contact.phone, contact.name)}
                    >
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="border-border/50 bg-transparent">
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeContact(contact.id)}
                      className="text-destructive hover:text-destructive/80"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}

            {/* Empty Slots */}
            {Array.from({ length: 5 - trustedContacts.length }).map((_, index) => (
              <Card key={`empty-${index}`} className="p-4 bg-card/40 backdrop-blur-sm border-border/30 border-dashed">
                <div className="flex items-center justify-center py-4">
                  <p className="text-muted-foreground text-sm">Empty Contact Slot</p>
                </div>
              </Card>
            ))}

            {/* Add Contact Button */}
            {trustedContacts.length < 5 && (
              <Button
                onClick={() => setShowAddContact(!showAddContact)}
                className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold py-4 transition-all duration-300"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Trusted Contact
              </Button>
            )}

            {/* Add Contact Form */}
            {showAddContact && (
              <Card className="p-6 bg-card/90 backdrop-blur-sm border-border/50">
                <h3 className="font-semibold text-foreground mb-4">Add New Contact</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="contactName" className="text-foreground">
                      Name
                    </Label>
                    <Input
                      id="contactName"
                      value={newContact.name}
                      onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                      placeholder="Enter contact name"
                      className="bg-background/50 border-border/50 focus:border-secondary"
                    />
                  </div>
                  <div>
                    <Label htmlFor="contactPhone" className="text-foreground">
                      Phone Number
                    </Label>
                    <Input
                      id="contactPhone"
                      value={newContact.phone}
                      onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                      placeholder="Enter phone number"
                      className="bg-background/50 border-border/50 focus:border-secondary"
                    />
                  </div>
                  <div>
                    <Label htmlFor="contactRelation" className="text-foreground">
                      Relationship
                    </Label>
                    <Input
                      id="contactRelation"
                      value={newContact.relation}
                      onChange={(e) => setNewContact({ ...newContact, relation: e.target.value })}
                      placeholder="e.g., Mother, Friend, Partner"
                      className="bg-background/50 border-border/50 focus:border-secondary"
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button onClick={addContact} className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground">
                      Add Contact
                    </Button>
                    <Button
                      onClick={() => setShowAddContact(false)}
                      variant="outline"
                      className="flex-1 border-border/50 bg-transparent"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </section>

        <section id="report" className="px-6 mb-16">
          <h2 className="text-xl font-bold text-foreground mb-6 font-sans">Report Incident</h2>

          <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50">
            <div className="space-y-6">
              {/* Incident Type Dropdown */}
              <div>
                <Label htmlFor="incidentType" className="text-foreground font-medium mb-2 block">
                  Type of Incident
                </Label>
                <div className="relative">
                  <select
                    id="incidentType"
                    value={incidentReport.type}
                    onChange={(e) => setIncidentReport({ ...incidentReport, type: e.target.value })}
                    className="w-full px-4 py-3 bg-background/50 border border-border/50 rounded-md text-foreground focus:border-secondary appearance-none"
                  >
                    <option value="">Select incident type</option>
                    <option value="harassment">Harassment</option>
                    <option value="stalking">Stalking</option>
                    <option value="violence">Violence</option>
                    <option value="other">Other</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="incidentDescription" className="text-foreground font-medium mb-2 block">
                  Describe the Incident
                </Label>
                <Textarea
                  id="incidentDescription"
                  value={incidentReport.description}
                  onChange={(e) => setIncidentReport({ ...incidentReport, description: e.target.value })}
                  placeholder="Please provide detailed information about what happened..."
                  className="min-h-32 bg-background/50 border-border/50 focus:border-secondary resize-none"
                />
              </div>

              {/* File Upload */}
              <div>
                <Label className="text-foreground font-medium mb-2 block">Upload Evidence (Photos/Videos)</Label>
                <div className="border-2 border-dashed border-border/50 rounded-lg p-6 text-center hover:border-secondary/50 transition-colors">
                  <input
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="fileUpload"
                  />
                  <label htmlFor="fileUpload" className="cursor-pointer">
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center">
                        <Upload className="h-6 w-6 text-accent" />
                      </div>
                      <div>
                        <p className="text-foreground font-medium">Click to upload files</p>
                        <p className="text-muted-foreground text-sm">Support images and videos</p>
                      </div>
                    </div>
                  </label>
                </div>

                {/* Uploaded Files */}
                {incidentReport.files.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-sm text-foreground font-medium">Uploaded Files:</p>
                    {incidentReport.files.map((file, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-background/30 rounded">
                        <Camera className="h-4 w-4 text-accent" />
                        <span className="text-sm text-foreground">{file.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <Button
                onClick={submitIncidentReport}
                disabled={!incidentReport.type || !incidentReport.description}
                className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground font-semibold py-3 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Report
              </Button>

              {/* Emergency Info */}
              <Card className="p-4 bg-destructive/10 border-destructive/20">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-destructive mb-1">Emergency Situation?</h4>
                    <p className="text-sm text-muted-foreground">
                      If you're in immediate danger, use the SOS button or call emergency services directly.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </Card>
        </section>

        <section id="tips" className="px-6 mb-16">
          <h2 className="text-xl font-bold text-foreground mb-6 font-sans">Safety Tips & Self-Defense</h2>

          {/* Emergency Quick Dial */}
          <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50 mb-6">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Phone className="h-5 w-5 text-destructive" />
              Emergency Contacts
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <Button
                className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                onClick={() => handleEmergencyCall("100", "Police")}
              >
                <Phone className="h-4 w-4 mr-2" />
                Police: 100
              </Button>
              <Button
                className="bg-accent hover:bg-accent/90 text-accent-foreground"
                onClick={() => handleEmergencyCall("1091", "Women Helpline")}
              >
                <Phone className="h-4 w-4 mr-2" />
                Women Helpline
              </Button>
            </div>
          </Card>

          <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50 mb-6">
            <Button
              variant="ghost"
              className="w-full p-0 h-auto hover:bg-transparent"
              onClick={() => toggleSection("selfDefense")}
            >
              <div className="flex items-center justify-between w-full">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <Zap className="h-5 w-5 text-destructive" />
                  Essential Fighting Techniques
                </h3>
                <ChevronDown
                  className={`h-4 w-4 text-muted-foreground transition-transform ${expandedSections.selfDefense ? "rotate-180" : ""}`}
                />
              </div>
            </Button>

            {expandedSections.selfDefense && (
              <div className="space-y-6 mt-6">
                {/* Quick Strike Techniques */}
                <div className="bg-destructive/10 p-6 rounded-lg border border-destructive/20">
                  <h4 className="font-bold text-destructive mb-4 text-xl">Quick Strike Techniques</h4>

                  <div className="space-y-6">
                    <div className="flex gap-6 p-4 bg-card/50 rounded-lg border border-destructive/10">
                      <div className="w-32 h-32 rounded-lg bg-destructive/20 flex items-center justify-center border-2 border-destructive/30 flex-shrink-0">
                        <div className="text-4xl">👊</div>
                      </div>
                      <div className="flex-1">
                        <h5 className="font-bold text-foreground text-xl mb-2">PALM STRIKE</h5>
                        <p className="text-base text-muted-foreground mb-3">
                          <strong className="text-destructive text-lg">TARGET:</strong> Nose, chin, solar plexus
                        </p>
                        <p className="text-base text-foreground font-medium mb-2">
                          Strike upward with heel of palm. Keep fingers bent back. Use full body weight behind strike.
                        </p>
                        <p className="text-sm text-destructive font-bold bg-destructive/10 p-2 rounded">
                          Can break nose or cause disorientation - EXTREMELY EFFECTIVE
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-6 p-4 bg-card/50 rounded-lg border border-destructive/10">
                      <div className="w-32 h-32 rounded-lg bg-destructive/20 flex items-center justify-center border-2 border-destructive/30 flex-shrink-0">
                        <div className="text-4xl">🦵</div>
                      </div>
                      <div className="flex-1">
                        <h5 className="font-bold text-foreground text-xl mb-2">KNEE STRIKE</h5>
                        <p className="text-base text-muted-foreground mb-3">
                          <strong className="text-destructive text-lg">TARGET:</strong> Groin, stomach, thigh
                        </p>
                        <p className="text-base text-foreground font-medium mb-2">
                          Drive knee upward with explosive force. Grab attacker's shoulders for leverage.
                        </p>
                        <p className="text-sm text-destructive font-bold bg-destructive/10 p-2 rounded">
                          Extremely effective close-range weapon - INCAPACITATING
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-6 p-4 bg-card/50 rounded-lg border border-destructive/10">
                      <div className="w-32 h-32 rounded-lg bg-destructive/20 flex items-center justify-center border-2 border-destructive/30 flex-shrink-0">
                        <div className="text-4xl">💪</div>
                      </div>
                      <div className="flex-1">
                        <h5 className="font-bold text-foreground text-xl mb-2">ELBOW STRIKE</h5>
                        <p className="text-base text-muted-foreground mb-3">
                          <strong className="text-destructive text-lg">TARGET:</strong> Ribs, face, solar plexus
                        </p>
                        <p className="text-base text-foreground font-medium mb-2">
                          Strike backward/sideways with elbow. Use hip rotation for maximum power.
                        </p>
                        <p className="text-sm text-destructive font-bold bg-destructive/10 p-2 rounded">
                          One of the hardest bones in your body - DEVASTATING IMPACT
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Escape Techniques */}
                <div className="bg-primary/10 p-6 rounded-lg border border-primary/20">
                  <h4 className="font-bold text-primary mb-4 text-xl">Escape Techniques</h4>

                  <div className="space-y-6">
                    <div className="p-4 bg-card/50 rounded-lg border border-primary/10">
                      <h5 className="font-bold text-foreground text-xl mb-4">WRIST GRAB ESCAPE</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg">
                            <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                              1
                            </div>
                            <p className="text-base text-foreground font-medium">
                              <strong className="text-primary">ROTATE:</strong> Turn wrist toward attacker's thumb
                              (weakest point)
                            </p>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg">
                            <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                              2
                            </div>
                            <p className="text-base text-foreground font-medium">
                              <strong className="text-primary">PULL:</strong> Yank arm down and away with explosive
                              force
                            </p>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg">
                            <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                              3
                            </div>
                            <p className="text-base text-foreground font-medium">
                              <strong className="text-primary">STRIKE:</strong> Follow immediately with knee or palm
                              strike
                            </p>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg">
                            <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                              4
                            </div>
                            <p className="text-base text-foreground font-medium">
                              <strong className="text-primary">RUN:</strong> Create distance immediately - don't look
                              back
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-card/50 rounded-lg border border-primary/10">
                      <h5 className="font-bold text-foreground text-xl mb-4">BEAR HUG ESCAPE</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h6 className="font-bold text-primary mb-2">FROM BEHIND:</h6>
                          <ul className="space-y-2 text-base">
                            <li className="text-foreground">• Drop your weight and widen stance</li>
                            <li className="text-foreground">• Stomp on attacker's instep</li>
                            <li className="text-foreground">• Elbow strike to ribs/stomach</li>
                            <li className="text-foreground">• Head butt backward if possible</li>
                          </ul>
                        </div>
                        <div>
                          <h6 className="font-bold text-primary mb-2">FROM FRONT:</h6>
                          <ul className="space-y-2 text-base">
                            <li className="text-foreground">• Knee strike to groin</li>
                            <li className="text-foreground">• Head butt to nose/face</li>
                            <li className="text-foreground">• Eye gouge or ear slap</li>
                            <li className="text-foreground">• Push away and run</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Critical Targets */}
                <div className="bg-accent/10 p-6 rounded-lg border border-accent/20">
                  <h4 className="font-bold text-accent mb-4 text-xl">Critical Target Areas</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="p-3 bg-card/50 rounded-lg">
                        <p className="text-base text-foreground font-bold">
                          <strong className="text-accent text-lg">EYES:</strong> Temporary blindness, immediate pain
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Poke, rake, or strike - creates instant escape opportunity
                        </p>
                      </div>
                      <div className="p-3 bg-card/50 rounded-lg">
                        <p className="text-base text-foreground font-bold">
                          <strong className="text-accent text-lg">NOSE:</strong> Extreme pain, bleeding, disorientation
                        </p>
                        <p className="text-sm text-muted-foreground">Palm strike upward - can break cartilage</p>
                      </div>
                      <div className="p-3 bg-card/50 rounded-lg">
                        <p className="text-base text-foreground font-bold">
                          <strong className="text-accent text-lg">GROIN:</strong> Incapacitating pain
                        </p>
                        <p className="text-sm text-muted-foreground">Knee strike or kick - most effective target</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="p-3 bg-card/50 rounded-lg">
                        <p className="text-base text-foreground font-bold">
                          <strong className="text-accent text-lg">THROAT:</strong> Breathing difficulty, panic
                        </p>
                        <p className="text-sm text-muted-foreground">Strike with edge of hand - use caution</p>
                      </div>
                      <div className="p-3 bg-card/50 rounded-lg">
                        <p className="text-base text-foreground font-bold">
                          <strong className="text-accent text-lg">KNEES:</strong> Mobility loss, severe pain
                        </p>
                        <p className="text-sm text-muted-foreground">Kick from side - can disable completely</p>
                      </div>
                      <div className="p-3 bg-card/50 rounded-lg">
                        <p className="text-base text-foreground font-bold">
                          <strong className="text-accent text-lg">INSTEP:</strong> Foot injury, balance loss
                        </p>
                        <p className="text-sm text-muted-foreground">Stomp with heel - easy target when grabbed</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Card>

          <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50 mb-6">
            <Button
              variant="ghost"
              className="w-full p-0 h-auto hover:bg-transparent"
              onClick={() => toggleSection("personalSafety")}
            >
              <div className="flex items-center justify-between w-full">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Personal Safety Guidelines
                </h3>
                <ChevronDown
                  className={`h-4 w-4 text-muted-foreground transition-transform ${expandedSections.personalSafety ? "rotate-180" : ""}`}
                />
              </div>
            </Button>

            {expandedSections.personalSafety && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="w-15 h-15 rounded-lg bg-primary/20 flex items-center justify-center border border-border/50">
                      <Shield className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground text-sm">Stay Alert</h4>
                      <p className="text-xs text-muted-foreground">
                        Trust your instincts and stay aware of your surroundings
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-15 h-15 rounded-lg bg-accent/20 flex items-center justify-center border border-border/50">
                      <Phone className="h-8 w-8 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground text-sm">Emergency Contacts</h4>
                      <p className="text-xs text-muted-foreground">Keep emergency numbers easily accessible</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="w-15 h-15 rounded-lg bg-secondary/20 flex items-center justify-center border border-border/50">
                      <MapPin className="h-8 w-8 text-secondary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground text-sm">Share Location</h4>
                      <p className="text-xs text-muted-foreground">Let trusted friends know your whereabouts</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-15 h-15 rounded-lg bg-primary/20 flex items-center justify-center border border-border/50">
                      <Lightbulb className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground text-sm">Well-lit Areas</h4>
                      <p className="text-xs text-muted-foreground">Avoid isolated areas, especially at night</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Card>

          <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50">
            <Button
              variant="ghost"
              className="w-full p-0 h-auto hover:bg-transparent"
              onClick={() => toggleSection("digitalSafety")}
            >
              <div className="flex items-center justify-between w-full">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-secondary" />
                  Digital Safety Tips
                </h3>
                <ChevronDown
                  className={`h-4 w-4 text-muted-foreground transition-transform ${expandedSections.digitalSafety ? "rotate-180" : ""}`}
                />
              </div>
            </Button>

            {expandedSections.digitalSafety && (
              <div className="space-y-3 mt-4">
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 bg-secondary rounded-full mt-2"></div>
                  <p className="text-sm text-muted-foreground">
                    Don't share personal information with strangers online
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 bg-secondary rounded-full mt-2"></div>
                  <p className="text-sm text-muted-foreground">Use privacy settings on social media platforms</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 bg-secondary rounded-full mt-2"></div>
                  <p className="text-sm text-muted-foreground">Be cautious with location sharing on social apps</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 bg-secondary rounded-full mt-2"></div>
                  <p className="text-sm text-muted-foreground">Report harassment or threats immediately</p>
                </div>
              </div>
            )}
          </Card>
        </section>

        <section id="sos" className="px-6 mb-16">
          <h2 className="text-xl font-bold text-foreground mb-6 font-sans">Emergency Actions</h2>

          <div className="flex justify-center mb-8">
            <Button
              size="lg"
              onClick={handleSendSOS}
              className="h-48 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-2xl transition-all duration-300 border-4 border-purple-400/50 shadow-2xl w-48"
            >
              <div className="flex flex-col items-center gap-3">
                <div className="relative">
                  <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center">
                    <div className="h-12 w-12 rounded-full bg-white/30 flex items-center justify-center">
                      <Phone className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <div className="absolute -top-2 -right-2 h-6 w-6 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-pulse flex items-center justify-center">
                    <div className="h-3 w-3 bg-white rounded-full"></div>
                  </div>
                </div>
                <span>EMERGENCY</span>
              </div>
            </Button>
          </div>

          {/* Emergency Action Cards */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <Card className="p-4 bg-card/80 backdrop-blur-sm border-border/50 hover:bg-card/90 transition-all duration-300">
              <Button variant="ghost" className="w-full h-auto p-0 hover:bg-transparent" onClick={handleFakeCall}>
                <div className="flex flex-col items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center">
                    <Phone className="h-6 w-6 text-accent" />
                  </div>
                  <span className="text-sm font-medium text-foreground">Fake Call</span>
                </div>
              </Button>
            </Card>

            <Card className="p-4 bg-card/80 backdrop-blur-sm border-border/50 hover:bg-card/90 transition-all duration-300">
              <Button variant="ghost" className="w-full h-auto p-0 hover:bg-transparent" onClick={handleLoudSiren}>
                <div className="flex flex-col items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-secondary/20 flex items-center justify-center">
                    <Volume2 className="h-6 w-6 text-secondary" />
                  </div>
                  <span className="text-sm font-medium text-foreground">Loud Siren</span>
                </div>
              </Button>
            </Card>
          </div>

          {/* Emergency Instructions */}
          <Card className="p-4 bg-card/80 backdrop-blur-sm border-border/50">
            <h3 className="font-semibold text-foreground mb-3">Emergency Instructions</h3>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>• Press and hold SOS for 3 seconds to activate</li>
              <li>• Your location will be shared with trusted contacts</li>
              <li>• Emergency services will be notified automatically</li>
              <li>• Stay calm and follow the voice prompts</li>
            </ul>
          </Card>
        </section>

        {/* Comprehensive Settings Section */}
        <section id="settings" className="px-6 mb-16">
          <h2 className="text-xl font-bold text-foreground mb-6 font-sans">Settings</h2>

          <div className="space-y-4">
            {/* User Profile */}
            <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Profile Information
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Name</span>
                  <span className="text-sm text-foreground">Sarah Johnson</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Blood Group</span>
                  <span className="text-sm text-foreground">O+</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Emergency ID</span>
                  <span className="text-sm text-foreground">SG-2024-001</span>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Settings className="h-5 w-5 text-secondary" />
                Safety Preferences
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-foreground">Auto-SOS on Power Off</p>
                    <p className="text-xs text-muted-foreground">Send SOS when phone powers off</p>
                  </div>
                  <button
                    onClick={() => toggleSafetyPreference("autoSOS")}
                    className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${
                      safetyPreferences.autoSOS ? "bg-accent" : "bg-muted"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${
                        safetyPreferences.autoSOS ? "right-0.5" : "left-0.5"
                      }`}
                    ></div>
                  </button>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-foreground">Fake Call Timer</p>
                    <p className="text-xs text-muted-foreground">Set a timer for a fake incoming call</p>
                  </div>
                  <button
                    onClick={() => toggleSafetyPreference("fakeCallTimer")}
                    className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${
                      safetyPreferences.fakeCallTimer ? "bg-accent" : "bg-muted"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${
                        safetyPreferences.fakeCallTimer ? "right-0.5" : "left-0.5"
                      }`}
                    ></div>
                  </button>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-foreground">Alert Tone Volume</p>
                    <p className="text-xs text-muted-foreground">Adjust the volume of alert tones</p>
                  </div>
                  <button
                    onClick={() => toggleSafetyPreference("alertTone")}
                    className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${
                      safetyPreferences.alertTone ? "bg-accent" : "bg-muted"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${
                        safetyPreferences.alertTone ? "right-0.5" : "left-0.5"
                      }`}
                    ></div>
                  </button>
                </div>
              </div>
            </Card>

            {/* Language Settings */}
            <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Settings className="h-5 w-5 text-secondary" />
                Language
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-foreground">Selected Language</p>
                    <p className="text-xs text-muted-foreground">Current language: {selectedLanguage}</p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                    className="border-border/50 bg-transparent"
                  >
                    Change
                  </Button>
                </div>

                {showLanguageDropdown && (
                  <div className="space-y-2">
                    <Button
                      variant="ghost"
                      className="w-full justify-start hover:bg-background/50"
                      onClick={() => {
                        setSelectedLanguage("English")
                        setShowLanguageDropdown(false)
                      }}
                    >
                      English
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start hover:bg-background/50"
                      onClick={() => {
                        setSelectedLanguage("Spanish")
                        setShowLanguageDropdown(false)
                      }}
                    >
                      Spanish
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start hover:bg-background/50"
                      onClick={() => {
                        setSelectedLanguage("French")
                        setShowLanguageDropdown(false)
                      }}
                    >
                      French
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </section>
      </main>
    </div>
  )
}

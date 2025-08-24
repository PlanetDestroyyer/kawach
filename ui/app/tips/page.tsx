"use client"

import { Shield, Phone, ExternalLink, Lightbulb, Eye, Users, AlertTriangle, ArrowLeft, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"

export default function SafetyTips() {
  const safetyTips = [
    {
      icon: Eye,
      title: "Stay Alert & Aware",
      description:
        "Keep your head up, avoid distractions like phones or headphones in unfamiliar areas. Trust your instincts if something feels wrong.",
      category: "Awareness",
    },
    {
      icon: Users,
      title: "Travel in Groups",
      description:
        "When possible, travel with friends or family. There's safety in numbers, especially during evening hours.",
      category: "Prevention",
    },
    {
      icon: Phone,
      title: "Keep Phone Charged",
      description:
        "Always ensure your phone is charged and easily accessible. Consider carrying a portable charger for emergencies.",
      category: "Preparedness",
    },
    {
      icon: Shield,
      title: "Learn Basic Self-Defense",
      description:
        "Take a self-defense class to learn basic techniques. Even simple moves can help you escape dangerous situations.",
      category: "Self-Defense",
    },
    {
      icon: AlertTriangle,
      title: "Share Your Plans",
      description:
        "Always let trusted contacts know where you're going and when you expect to return. Check in regularly.",
      category: "Communication",
    },
    {
      icon: Lightbulb,
      title: "Trust Your Instincts",
      description:
        "If a situation or person makes you uncomfortable, remove yourself immediately. Your intuition is a powerful safety tool.",
      category: "Awareness",
    },
  ]

  const emergencyNumbers = [
    { name: "Police Emergency", number: "100", description: "For immediate police assistance" },
    { name: "Women Helpline", number: "1091", description: "24/7 women in distress helpline" },
    { name: "National Emergency", number: "112", description: "Universal emergency number" },
  ]

  const supportResources = [
    { name: "National Commission for Women", url: "#", description: "Legal support and guidance" },
    { name: "Women Safety Portal", url: "#", description: "Resources and safety information" },
    { name: "Local Women's Shelter", url: "#", description: "Safe accommodation and support" },
    { name: "Legal Aid Services", url: "#", description: "Free legal consultation" },
  ]

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="px-6 py-6 border-b border-border">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="p-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Lightbulb className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold text-foreground">Safety Tips</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-6 py-6 pb-24 space-y-8">
        {/* Emergency Quick Dial */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">Emergency Numbers</h2>
          <div className="grid grid-cols-1 gap-3">
            {emergencyNumbers.map((emergency, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground">{emergency.name}</h3>
                    <p className="text-sm text-muted-foreground">{emergency.description}</p>
                  </div>
                  <Button
                    size="sm"
                    className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4"
                    onClick={() => window.open(`tel:${emergency.number}`)}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    {emergency.number}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Safety Tips */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">Safety Tips & Guidelines</h2>
          <div className="space-y-4">
            {safetyTips.map((tip, index) => (
              <Card key={index} className="p-5 hover:shadow-md transition-shadow">
                <div className="flex gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <tip.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium text-foreground">{tip.title}</h3>
                      <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded-full">{tip.category}</span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{tip.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Support Resources */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">Support Organizations</h2>
          <div className="space-y-3">
            {supportResources.map((resource, index) => (
              <Card key={index} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground">{resource.name}</h3>
                    <p className="text-sm text-muted-foreground">{resource.description}</p>
                  </div>
                  <Button variant="outline" size="sm" className="ml-4 bg-transparent">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Visit
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Educational Note */}
        <Card className="p-5 bg-primary/5 border-primary/20">
          <div className="flex gap-3">
            <Shield className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-medium text-foreground mb-2">Remember</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Your safety is the top priority. These tips are guidelines to help you stay aware and prepared. In any
                emergency situation, don't hesitate to call for help immediately.
              </p>
            </div>
          </div>
        </Card>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
        <div className="flex items-center justify-around py-2">
          <Link href="/">
            <Button variant="ghost" size="sm" className="flex flex-col items-center gap-1 h-auto py-3">
              <Shield className="h-5 w-5" />
              <span className="text-xs">Home</span>
            </Button>
          </Link>

          <Link href="/sos">
            <Button variant="ghost" size="sm" className="flex flex-col items-center gap-1 h-auto py-3">
              <Phone className="h-5 w-5" />
              <span className="text-xs">SOS</span>
            </Button>
          </Link>

          <Link href="/contacts">
            <Button variant="ghost" size="sm" className="flex flex-col items-center gap-1 h-auto py-3">
              <Users className="h-5 w-5" />
              <span className="text-xs">Contacts</span>
            </Button>
          </Link>

          <Button variant="ghost" size="sm" className="flex flex-col items-center gap-1 h-auto py-3 text-primary">
            <Lightbulb className="h-5 w-5" />
            <span className="text-xs">Tips</span>
          </Button>

          <Button variant="ghost" size="sm" className="flex flex-col items-center gap-1 h-auto py-3">
            <Settings className="h-5 w-5" />
            <span className="text-xs">Settings</span>
          </Button>
        </div>
      </nav>
    </div>
  )
}

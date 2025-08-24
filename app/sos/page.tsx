import { Phone, MapPin, Volume2, PhoneCall, Shield, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"

export default function SOSScreen() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="px-6 py-6 flex items-center gap-4">
        <Link href="/">
          <Button variant="ghost" size="sm" className="p-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-destructive" />
          <h1 className="text-xl font-bold text-foreground">Emergency SOS</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-6 pb-24 flex flex-col">
        {/* Primary SOS Button */}
        <div className="flex justify-center mb-8">
          <Button
            size="lg"
            className="h-40 w-40 rounded-full bg-destructive hover:bg-destructive/90 text-destructive-foreground shadow-xl hover:shadow-2xl transition-all duration-200 text-2xl font-bold animate-pulse"
          >
            <div className="flex flex-col items-center gap-2">
              <Phone className="h-12 w-12" />
              <span>SEND SOS</span>
            </div>
          </Button>
        </div>

        {/* Emergency Actions */}
        <div className="space-y-4 mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">Emergency Actions</h2>

          {/* Send Live Location */}
          <Card className="p-4">
            <Button variant="outline" className="w-full h-auto p-4 border-primary hover:bg-primary/5 bg-transparent">
              <div className="flex items-center gap-4 w-full">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div className="text-left flex-1">
                  <h3 className="font-medium text-foreground">Send Live Location</h3>
                  <p className="text-sm text-muted-foreground">Share your location with emergency contacts</p>
                </div>
              </div>
            </Button>
          </Card>

          {/* Fake Call */}
          <Card className="p-4">
            <Button variant="outline" className="w-full h-auto p-4 border-accent hover:bg-accent/5 bg-transparent">
              <div className="flex items-center gap-4 w-full">
                <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <PhoneCall className="h-6 w-6 text-accent" />
                </div>
                <div className="text-left flex-1">
                  <h3 className="font-medium text-foreground">Fake Call</h3>
                  <p className="text-sm text-muted-foreground">Simulate an incoming call to escape</p>
                </div>
              </div>
            </Button>
          </Card>

          {/* Loud Siren */}
          <Card className="p-4">
            <Button variant="outline" className="w-full h-auto p-4 border-orange-500 hover:bg-orange-50 bg-transparent">
              <div className="flex items-center gap-4 w-full">
                <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                  <Volume2 className="h-6 w-6 text-orange-600" />
                </div>
                <div className="text-left flex-1">
                  <h3 className="font-medium text-foreground">Activate Siren</h3>
                  <p className="text-sm text-muted-foreground">Sound loud alarm to attract attention</p>
                </div>
              </div>
            </Button>
          </Card>
        </div>

        {/* Emergency Instructions */}
        <div className="mt-auto">
          <Card className="p-4 bg-muted/50">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Emergency Instructions
            </h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>
                • <strong>Stay Calm:</strong> Take deep breaths and assess your situation
              </p>
              <p>
                • <strong>Find Safety:</strong> Move to a well-lit, populated area if possible
              </p>
              <p>
                • <strong>Call 911:</strong> For immediate police, fire, or medical emergency
              </p>
              <p>
                • <strong>Trust Your Instincts:</strong> If something feels wrong, act on it
              </p>
              <p>
                • <strong>Stay Connected:</strong> Keep your phone charged and accessible
              </p>
            </div>
          </Card>
        </div>
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

          <Button variant="ghost" size="sm" className="flex flex-col items-center gap-1 h-auto py-3 text-destructive">
            <Phone className="h-5 w-5" />
            <span className="text-xs">SOS</span>
          </Button>

          <Button variant="ghost" size="sm" className="flex flex-col items-center gap-1 h-auto py-3">
            <MapPin className="h-5 w-5" />
            <span className="text-xs">Contacts</span>
          </Button>

          <Button variant="ghost" size="sm" className="flex flex-col items-center gap-1 h-auto py-3">
            <Volume2 className="h-5 w-5" />
            <span className="text-xs">Tips</span>
          </Button>

          <Button variant="ghost" size="sm" className="flex flex-col items-center gap-1 h-auto py-3">
            <PhoneCall className="h-5 w-5" />
            <span className="text-xs">Settings</span>
          </Button>
        </div>
      </nav>
    </div>
  )
}

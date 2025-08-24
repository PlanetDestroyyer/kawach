import { ArrowLeft, Phone, MessageCircle, Plus, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"

export default function TrustedContacts() {
  // Sample contacts data - in a real app this would come from a database or state management
  const contacts = [
    { id: 1, name: "Mom", phone: "+1 (555) 123-4567" },
    { id: 2, name: "Sarah Johnson", phone: "+1 (555) 987-6543" },
    { id: 3, name: "Emergency Services", phone: "911" },
  ]

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="px-6 py-6 border-b border-border">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="h-10 w-10 p-0">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-semibold text-foreground">Trusted Contacts</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-6 py-6 pb-24">
        {/* Add Contact Button */}
        <div className="mb-6">
          <Button className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground">
            <Plus className="h-5 w-5 mr-2" />
            Add Emergency Contact
          </Button>
        </div>

        {/* Contacts List */}
        <div className="space-y-4">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Emergency Contacts ({contacts.length}/5)
          </h2>

          {contacts.map((contact) => (
            <Card key={contact.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">{contact.name}</h3>
                    <p className="text-sm text-muted-foreground">{contact.phone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-10 w-10 p-0 border-green-200 hover:bg-green-50 bg-transparent"
                  >
                    <Phone className="h-4 w-4 text-green-600" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-10 w-10 p-0 border-blue-200 hover:bg-blue-50 bg-transparent"
                  >
                    <MessageCircle className="h-4 w-4 text-blue-600" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}

          {/* Empty State for remaining slots */}
          {contacts.length < 5 && (
            <div className="space-y-4">
              {Array.from({ length: 5 - contacts.length }).map((_, index) => (
                <Card key={`empty-${index}`} className="p-4 border-dashed border-2 border-muted">
                  <div className="flex items-center justify-center py-4">
                    <div className="text-center">
                      <Plus className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Add Emergency Contact</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-8 p-4 bg-muted/50 rounded-lg">
          <h3 className="font-medium text-foreground mb-2">Important Notes:</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Add up to 5 trusted emergency contacts</li>
            <li>• These contacts will receive SOS alerts and location updates</li>
            <li>• Verify phone numbers are correct and active</li>
            <li>• Include at least one local emergency service</li>
          </ul>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
        <div className="flex items-center justify-around py-2">
          <Link href="/">
            <Button variant="ghost" size="sm" className="flex flex-col items-center gap-1 h-auto py-3">
              <Users className="h-5 w-5" />
              <span className="text-xs">Home</span>
            </Button>
          </Link>

          <Link href="/sos">
            <Button variant="ghost" size="sm" className="flex flex-col items-center gap-1 h-auto py-3">
              <Phone className="h-5 w-5" />
              <span className="text-xs">SOS</span>
            </Button>
          </Link>

          <Button variant="ghost" size="sm" className="flex flex-col items-center gap-1 h-auto py-3 text-primary">
            <Users className="h-5 w-5" />
            <span className="text-xs">Contacts</span>
          </Button>

          <Button variant="ghost" size="sm" className="flex flex-col items-center gap-1 h-auto py-3">
            <Users className="h-5 w-5" />
            <span className="text-xs">Tips</span>
          </Button>

          <Button variant="ghost" size="sm" className="flex flex-col items-center gap-1 h-auto py-3">
            <Users className="h-5 w-5" />
            <span className="text-xs">Settings</span>
          </Button>
        </div>
      </nav>
    </div>
  )
}

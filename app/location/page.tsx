"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, MapPin, Play, Square, Clock, Target } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"

export default function LiveLocationPage() {
  const [isSharing, setIsSharing] = useState(false)
  const [accuracy, setAccuracy] = useState(12)
  const [lastUpdate, setLastUpdate] = useState(new Date())

  // Simulate location updates
  useEffect(() => {
    if (isSharing) {
      const interval = setInterval(() => {
        setLastUpdate(new Date())
        setAccuracy(Math.floor(Math.random() * 20) + 5)
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [isSharing])

  const handleShareLocation = () => {
    setIsSharing(true)
    setLastUpdate(new Date())
  }

  const handleStopSharing = () => {
    setIsSharing(false)
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
          <h1 className="text-xl font-semibold text-foreground">Live Location</h1>
        </div>
      </header>

      {/* Map View */}
      <div className="flex-1 relative">
        {/* Mock Map Container */}
        <div className="h-full bg-gradient-to-br from-emerald-50 to-emerald-100 relative overflow-hidden">
          {/* Map Grid Pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="grid grid-cols-8 grid-rows-12 h-full w-full">
              {Array.from({ length: 96 }).map((_, i) => (
                <div key={i} className="border border-emerald-300/30" />
              ))}
            </div>
          </div>

          {/* Current Location Marker */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="relative">
              {/* Pulsing Circle */}
              <div
                className={`absolute inset-0 rounded-full bg-primary/30 ${isSharing ? "animate-ping" : ""}`}
                style={{ width: "60px", height: "60px", marginLeft: "-30px", marginTop: "-30px" }}
              />
              {/* Location Pin */}
              <div className="relative z-10 h-8 w-8 bg-primary rounded-full flex items-center justify-center shadow-lg">
                <MapPin className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>

          {/* Mock Street Labels */}
          <div className="absolute top-20 left-6 text-xs text-emerald-700 font-medium">Main Street</div>
          <div className="absolute bottom-32 right-8 text-xs text-emerald-700 font-medium">Oak Avenue</div>
        </div>

        {/* Location Info Card */}
        <Card className="absolute bottom-32 left-4 right-4 p-4 bg-card/95 backdrop-blur-sm font-bold">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Location Accuracy</span>
            </div>
            <span className="text-sm text-primary font-medium">±{accuracy}m</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Last Updated</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {lastUpdate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
        </Card>
      </div>

      {/* Control Panel */}
      <div className="p-6 bg-card border-t border-border">
        {!isSharing ? (
          <div className="space-y-4">
            <Button
              onClick={handleShareLocation}
              className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-semibold text-lg"
            >
              <div className="flex items-center gap-3">
                <Play className="h-6 w-6" />
                Share Live Location
              </div>
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              Your location will be shared with your trusted contacts
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full">
                <div className="h-2 w-2 bg-primary rounded-full animate-pulse" />
                <span className="text-sm font-medium text-primary">Sharing Location</span>
              </div>
            </div>

            <Button onClick={handleStopSharing} variant="destructive" className="w-full h-14 font-semibold text-lg">
              <div className="flex items-center gap-3">
                <Square className="h-5 w-5" />
                Stop Sharing
              </div>
            </Button>

            <p className="text-sm text-muted-foreground text-center">
              Location is being shared with 3 trusted contacts
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

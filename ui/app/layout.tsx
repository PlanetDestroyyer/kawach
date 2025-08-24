import type React from "react"
import "./globals.css"

export const metadata = {
  title: "Safe Guard - Women Safety App",
  description: "Your Safety, Our Priority - A comprehensive women safety application with emergency features",
    generator: 'v0.app'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}

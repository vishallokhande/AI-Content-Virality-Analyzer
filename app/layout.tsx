import type React from "react"
import type { Metadata } from "next"
import { SubscriptionProvider } from "@/contexts/subscription-context"
import { AuthProvider } from "@/contexts/auth-context"
import { Footer } from "@/components/footer"
import { Toaster } from "sonner"
import "./globals.css"

export const metadata: Metadata = {
  title: "ViralScore AI — Content Virality Analyzer",
  description: "Upload your video or post and let AI score its viral potential, explain what works, and suggest edits to maximize reach.",
  icons: {
    icon: [
      { url: "/favicon-32x32.png" },
      { url: "/favicon-16x16.png", sizes: "16x16" },
    ],
    apple: "/apple-touch-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased flex flex-col min-h-screen" suppressHydrationWarning>
        <AuthProvider>
          <SubscriptionProvider>
            <div className="flex-1 flex flex-col">
              {children}
            </div>
            <Footer />
          </SubscriptionProvider>
        </AuthProvider>
        <Toaster position="top-center" />
      </body>
    </html>
  )
}

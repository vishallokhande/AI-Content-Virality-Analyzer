"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { User, Menu, X, Zap, BarChart2, History } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useSubscription } from "@/contexts/subscription-context"
import { useState } from "react"

export function Navigation() {
  const pathname = usePathname()
  const { user, isLoading } = useAuth()
  const { isPro } = useSubscription()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { href: "/analyze", label: "Analyze", icon: Zap },
    { href: "/dashboard", label: "History", icon: History },
    { href: "/upgrade", label: "Pricing", icon: BarChart2 },
  ]

  return (
    <>
      {/* Mobile Navigation */}
      <nav className="md:hidden border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center glow-primary">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg gradient-text">ViralScore</span>
            </Link>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 rounded-lg hover:bg-secondary transition-colors">
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="border-t border-border/50 px-6 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="flex items-center gap-2 py-2 text-muted-foreground hover:text-foreground transition-colors" onClick={() => setMobileMenuOpen(false)}>
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-border/50">
              {!isLoading && (
                <>
                  {user ? (
                    <Link href="/profile" className="flex items-center gap-2 py-2 text-muted-foreground hover:text-foreground transition-colors" onClick={() => setMobileMenuOpen(false)}>
                      <User className="w-4 h-4" />
                      Profile
                    </Link>
                  ) : (
                    <Button className="w-full gradient-primary border-0" asChild>
                      <Link href="/auth/login">Sign In</Link>
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Desktop Navigation */}
      <nav className="hidden md:block border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-xl gradient-text">ViralScore</span>
              <span className="text-xs px-1.5 py-0.5 rounded bg-primary/20 text-primary font-medium">AI</span>
            </Link>

            <div className="flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    pathname === link.href
                      ? "bg-primary/15 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-3">
              {!isLoading && (
                <>
                  {user ? (
                    <div className="flex items-center gap-3">
                      {!isPro && (
                        <Link href="/upgrade">
                          <Button size="sm" variant="outline" className="text-sm border-primary/40 text-primary hover:bg-primary/10 bg-transparent">
                            ✦ Upgrade
                          </Button>
                        </Link>
                      )}
                      <Link
                        href="/profile"
                        className={`p-2 rounded-lg transition-colors ${
                          pathname === "/profile" ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                        }`}
                      >
                        <User className="w-4 h-4" />
                      </Link>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" className="text-sm" asChild>
                        <Link href="/auth/login">Sign In</Link>
                      </Button>
                      <Button size="sm" className="gradient-primary border-0 text-white text-sm" asChild>
                        <Link href="/analyze">Try Free</Link>
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}

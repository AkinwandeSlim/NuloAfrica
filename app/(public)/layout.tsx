"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-warm-ivory-gradient">
      {/* Navigation Bar */}
      <nav className="fixed top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="text-2xl font-bold">
                <span className="text-slate-900">Nulo</span>
                <span className="text-amber-600">Africa</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-slate-700 hover:text-amber-600 transition-colors font-medium">
                Home
              </Link>
              <Link href="/properties" className="text-slate-700 hover:text-amber-600 transition-colors font-medium">
                Properties
              </Link>
              <Link href="/landing" className="text-slate-700 hover:text-amber-600 transition-colors font-medium">
                All Pages
              </Link>
              <Link href="/dashboard" className="text-slate-700 hover:text-amber-600 transition-colors font-medium">
                Dashboard
              </Link>
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <Link href="/signin">
                <Button variant="ghost" className="text-slate-700 hover:text-amber-600 hover:bg-amber-50">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-amber-500 hover:bg-amber-600 text-white rounded-xl shadow-sm">
                  Get Started
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-slate-700 hover:text-amber-600"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-stone-200 bg-white">
              <div className="flex flex-col gap-1 py-4 px-2">
                <Link
                  href="/"
                  className="text-slate-700 hover:text-amber-600 hover:bg-amber-50 transition-colors font-medium px-4 py-2 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="/properties"
                  className="text-slate-700 hover:text-amber-600 hover:bg-amber-50 transition-colors font-medium px-4 py-2 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Properties
                </Link>
                <Link
                  href="/landing"
                  className="text-slate-700 hover:text-amber-600 hover:bg-amber-50 transition-colors font-medium px-4 py-2 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  All Pages
                </Link>
                <Link
                  href="/dashboard"
                  className="text-slate-700 hover:text-amber-600 hover:bg-amber-50 transition-colors font-medium px-4 py-2 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <div className="flex gap-2 pt-4 mt-2 border-t border-stone-200">
                  <Link href="/signin" className="flex-1">
                    <Button variant="outline" className="w-full border-slate-300 text-slate-700 hover:bg-amber-50 hover:text-amber-600 hover:border-amber-500">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/signup" className="flex-1">
                    <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white">
                      Get Started
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-16">{children}</main>
    </div>
  )
}

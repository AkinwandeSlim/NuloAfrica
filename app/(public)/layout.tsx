"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X, Home, Building2, LayoutGrid, User } from "lucide-react"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isActive = (path: string) => pathname === path

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/30 to-white">
      {/* Ultra Modern Navigation Bar */}
      <nav className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-xl shadow-lg border-b border-slate-200/50' 
          : 'bg-white/80 backdrop-blur-md border-b border-slate-200/30'
      }`}>
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex h-20 items-center justify-between">
            {/* Logo with Animation */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-400 rounded-lg blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
                <div className="relative text-2xl lg:text-3xl font-bold tracking-tight">
                  <span className="text-slate-900">Nulo</span>
                  <span className="bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">Africa</span>
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-2">
              <Link href="/">
                <Button 
                  variant="ghost" 
                  className={`gap-2 transition-all duration-300 ${
                    isActive('/') 
                      ? 'text-amber-600 bg-amber-50 hover:bg-amber-100' 
                      : 'text-slate-700 hover:text-amber-600 hover:bg-amber-50'
                  }`}
                >
                  <Home className="h-4 w-4" />
                  Home
                </Button>
              </Link>
              <Link href="/properties">
                <Button 
                  variant="ghost" 
                  className={`gap-2 transition-all duration-300 ${
                    isActive('/properties') 
                      ? 'text-amber-600 bg-amber-50 hover:bg-amber-100' 
                      : 'text-slate-700 hover:text-amber-600 hover:bg-amber-50'
                  }`}
                >
                  <Building2 className="h-4 w-4" />
                  Properties
                </Button>
              </Link>
              <Link href="/landing">
                <Button 
                  variant="ghost" 
                  className={`gap-2 transition-all duration-300 ${
                    isActive('/landing') 
                      ? 'text-amber-600 bg-amber-50 hover:bg-amber-100' 
                      : 'text-slate-700 hover:text-amber-600 hover:bg-amber-50'
                  }`}
                >
                  <LayoutGrid className="h-4 w-4" />
                  All Pages
                </Button>
              </Link>
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <Link href="/signin">
                <Button 
                  variant="ghost" 
                  className="text-slate-700 hover:text-amber-600 hover:bg-amber-50 transition-all duration-300"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  Get Started
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-slate-700 hover:text-amber-600 hover:bg-amber-50 transition-all duration-300"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>

          {/* Mobile Menu with Smooth Animation */}
          <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}>
            <div className="border-t border-slate-200/50 bg-white/95 backdrop-blur-xl">
              <div className="flex flex-col gap-1 py-4 px-2">
                <Link
                  href="/"
                  className={`flex items-center gap-3 transition-all duration-300 font-medium px-4 py-3 rounded-xl ${
                    isActive('/') 
                      ? 'text-amber-600 bg-amber-50' 
                      : 'text-slate-700 hover:text-amber-600 hover:bg-amber-50'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Home className="h-5 w-5" />
                  Home
                </Link>
                <Link
                  href="/properties"
                  className={`flex items-center gap-3 transition-all duration-300 font-medium px-4 py-3 rounded-xl ${
                    isActive('/properties') 
                      ? 'text-amber-600 bg-amber-50' 
                      : 'text-slate-700 hover:text-amber-600 hover:bg-amber-50'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Building2 className="h-5 w-5" />
                  Properties
                </Link>
                <Link
                  href="/landing"
                  className={`flex items-center gap-3 transition-all duration-300 font-medium px-4 py-3 rounded-xl ${
                    isActive('/landing') 
                      ? 'text-amber-600 bg-amber-50' 
                      : 'text-slate-700 hover:text-amber-600 hover:bg-amber-50'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <LayoutGrid className="h-5 w-5" />
                  All Pages
                </Link>
                <div className="flex gap-2 pt-4 mt-2 border-t border-slate-200/50">
                  <Link href="/signin" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full border-slate-300 text-slate-700 hover:bg-amber-50 hover:text-amber-600 hover:border-amber-500 transition-all duration-300">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/signup" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg transition-all duration-300">
                      Get Started
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content with Smooth Transition */}
      <main className="pt-20">{children}</main>
    </div>
  )
}

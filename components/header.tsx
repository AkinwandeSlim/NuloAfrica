"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, Heart, User, Home, Building2, LayoutDashboard, Info, MessageSquare, X } from "lucide-react"
import { useState } from "react"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 transition-transform hover:scale-105">
          <div className="text-2xl font-bold">
            <span className="text-slate-900">Nulo</span> <span className="text-amber-600">Africa</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm font-medium text-slate-700 transition-all hover:text-amber-600 hover:-translate-y-0.5"
          >
            <Home className="h-4 w-4" />
            Home
          </Link>
          <Link
            href="/properties"
            className="flex items-center gap-1.5 text-sm font-medium text-slate-700 transition-all hover:text-amber-600 hover:-translate-y-0.5"
          >
            <Building2 className="h-4 w-4" />
            Properties
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-sm font-medium text-slate-700 transition-all hover:text-amber-600 hover:-translate-y-0.5"
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
          <Link
            href="/about"
            className="flex items-center gap-1.5 text-sm font-medium text-slate-700 transition-all hover:text-amber-600 hover:-translate-y-0.5"
          >
            <Info className="h-4 w-4" />
            About
          </Link>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-2 md:flex">
          <Button
            variant="ghost"
            size="sm"
            className="text-slate-700 hover:text-amber-600 hover:bg-amber-50 transition-all duration-300"
            asChild
          >
            <Link href="/dashboard">
              <Heart className="mr-2 h-4 w-4" />
              Favorites
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-slate-700 hover:text-amber-600 hover:bg-amber-50 transition-all duration-300"
            asChild
          >
            <Link href="/dashboard?tab=messages">
              <MessageSquare className="mr-2 h-4 w-4" />
              Messages
            </Link>
          </Button>
          <Button
            size="sm"
            className="bg-amber-500 hover:bg-amber-600 text-white transition-all duration-300 hover:shadow-lg rounded-xl"
            asChild
          >
            <Link href="/signin">
              <User className="mr-2 h-4 w-4" />
              Sign In
            </Link>
          </Button>
          <Button
            size="sm"
            className="bg-slate-900 hover:bg-slate-800 text-white transition-all duration-300 hover:shadow-lg rounded-xl"
            asChild
          >
            <Link href="/signup">Sign Up</Link>
          </Button>
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
        <div className="border-t border-stone-200 bg-white md:hidden">
          <nav className="container mx-auto flex flex-col gap-1 px-2 py-4">
            <Link 
              href="/" 
              className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-amber-600 hover:bg-amber-50 px-4 py-2 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Home className="h-4 w-4" />
              Home
            </Link>
            <Link
              href="/properties"
              className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-amber-600 hover:bg-amber-50 px-4 py-2 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Building2 className="h-4 w-4" />
              Properties
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-amber-600 hover:bg-amber-50 px-4 py-2 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="/about"
              className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-amber-600 hover:bg-amber-50 px-4 py-2 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Info className="h-4 w-4" />
              About
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-amber-600 hover:bg-amber-50 px-4 py-2 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Heart className="h-4 w-4" />
              Favorites
            </Link>
            <Link
              href="/dashboard?tab=messages"
              className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-amber-600 hover:bg-amber-50 px-4 py-2 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <MessageSquare className="h-4 w-4" />
              Messages
            </Link>
            <div className="flex gap-2 pt-4 mt-2 border-t border-stone-200">
              <Button variant="outline" className="flex-1 border-slate-300 text-slate-700 hover:bg-amber-50 hover:text-amber-600 hover:border-amber-500" asChild>
                <Link href="/signin">Sign In</Link>
              </Button>
              <Button className="flex-1 bg-amber-500 hover:bg-amber-600 text-white" asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}

"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Home, Building2, Heart, MessageSquare, User, LayoutDashboard, 
  LogIn, UserPlus, Shield, MapPin, Search, Star, ArrowRight,
  CheckCircle, Sparkles, Menu, X
} from "lucide-react"

const pages = [
  {
    title: "Home Page",
    description: "Landing page with enhanced search bar, Google Autocomplete, and price range slider",
    href: "/",
    icon: Home,
    color: "bg-orange-500",
    features: ["Google Maps Autocomplete", "Price Range Slider", "Property Type Filter", "Advanced Filters"]
  },
  {
    title: "Properties Listing",
    description: "Browse properties with list/map view toggle and location-based filtering",
    href: "/properties",
    icon: Building2,
    color: "bg-orange-600",
    features: ["List View", "Map View", "Location Filtering", "Distance Sorting"]
  },
  {
    title: "Property Details",
    description: "Detailed property view with image carousel and embedded map",
    href: "/properties/1",
    icon: MapPin,
    color: "bg-amber-500",
    features: ["Image Carousel", "Embedded Map", "Get Directions", "Contact Owner"]
  },
  {
    title: "Favorites",
    description: "View and manage your saved properties",
    href: "/favorites",
    icon: Heart,
    color: "bg-orange-500",
    features: ["Saved Properties Grid", "Remove Favorites", "Empty State", "Hover Animations"]
  },
  {
    title: "Messages",
    description: "Chat interface for property inquiries",
    href: "/messages",
    icon: MessageSquare,
    color: "bg-amber-600",
    features: ["Conversation List", "Chat Interface", "Search Messages", "Online Status"]
  },
  {
    title: "Profile & Settings",
    description: "User profile with editable fields and preferences",
    href: "/profile",
    icon: User,
    color: "bg-orange-600",
    features: ["Editable Profile", "Notification Settings", "Security Actions", "Stats Cards"]
  },
  {
    title: "Dashboard",
    description: "User dashboard with property management",
    href: "/dashboard",
    icon: LayoutDashboard,
    color: "bg-orange-500",
    features: ["Property Stats", "Recent Activity", "Quick Actions", "Analytics"]
  },
  {
    title: "Sign In",
    description: "User authentication page",
    href: "/signin",
    icon: LogIn,
    color: "bg-amber-500",
    features: ["Email/Password Login", "Remember Me", "Forgot Password", "Social Login"]
  },
  {
    title: "Sign Up",
    description: "New user registration",
    href: "/signup",
    icon: UserPlus,
    color: "bg-orange-500",
    features: ["Multi-step Form", "Email Verification", "Terms Agreement", "Profile Setup"]
  },
  {
    title: "Admin Panel",
    description: "Administrative dashboard",
    href: "/admin",
    icon: Shield,
    color: "bg-orange-600",
    features: ["User Management", "Property Approval", "Analytics", "Settings"]
  },
]

const features = [
  {
    title: "Google Maps Integration",
    description: "Location autocomplete, property maps, and directions",
    icon: MapPin,
  },
  {
    title: "Advanced Search",
    description: "Filter by location, price, type with dual-range slider",
    icon: Search,
  },
  {
    title: "Luxury Design",
    description: "Minimalist African luxury aesthetic with gold accents",
    icon: Sparkles,
  },
  {
    title: "Premium UX",
    description: "Smooth animations, glassmorphism, and micro-interactions",
    icon: Star,
  },
]

const popularCities = [
  {
    name: "Nairobi",
    country: "Kenya",
    properties: 234,
    image: "https://images.unsplash.com/photo-1611348524140-53c9a25263d6?w=800&h=600&fit=crop",
    description: "Modern urban living",
  },
  {
    name: "Lagos",
    country: "Nigeria",
    properties: 456,
    image: "https://images.unsplash.com/photo-1619546952812-a6c7c0e8f7c1?w=800&h=600&fit=crop",
    description: "Vibrant city life",
  },
  {
    name: "Cape Town",
    country: "South Africa",
    properties: 389,
    image: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800&h=600&fit=crop",
    description: "Coastal paradise",
  },
  {
    name: "Accra",
    country: "Ghana",
    properties: 178,
    image: "https://images.unsplash.com/photo-1632482238891-e33d6e8e4d0e?w=800&h=600&fit=crop",
    description: "Growing metropolis",
  },
  {
    name: "Marrakech",
    country: "Morocco",
    properties: 267,
    image: "https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=800&h=600&fit=crop",
    description: "Historic charm",
  },
  {
    name: "Kigali",
    country: "Rwanda",
    properties: 145,
    image: "https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800&h=600&fit=crop",
    description: "Clean & modern",
  },
]

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-warm-ivory-gradient">
      {/* Navigation Bar */}
      <nav className="fixed top-0 z-50 w-full glass-nav">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="text-2xl font-bold">
                <span className="text-slate-900">Nulo</span> 
                <span className="text-orange-600">Africa</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-slate-700 hover:text-orange-600 transition-colors font-medium">
                Home
              </Link>
              <Link href="/properties" className="text-slate-700 hover:text-orange-600 transition-colors font-medium">
                Properties
              </Link>
              <Link href="/dashboard" className="text-slate-700 hover:text-orange-600 transition-colors font-medium">
                Dashboard
              </Link>
              <Link href="/landing" className="text-orange-600 font-semibold">
                All Pages
              </Link>
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center gap-4">
              <Link href="/signin">
                <Button variant="ghost" className="text-slate-700 hover:text-orange-600">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-orange-600 hover:bg-orange-700 text-white rounded-xl">
                  Get Started
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-slate-200 bg-white/95 backdrop-blur-md">
              <div className="flex flex-col gap-4 py-4">
                <Link href="/" className="text-slate-700 hover:text-orange-600 transition-colors font-medium">
                  Home
                </Link>
                <Link href="/properties" className="text-slate-700 hover:text-orange-600 transition-colors font-medium">
                  Properties
                </Link>
                <Link href="/dashboard" className="text-slate-700 hover:text-orange-600 transition-colors font-medium">
                  Dashboard
                </Link>
                <Link href="/landing" className="text-orange-600 font-semibold">
                  All Pages
                </Link>
                <div className="flex gap-2 pt-4">
                  <Link href="/signin" className="flex-1">
                    <Button variant="ghost" className="w-full">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/signup" className="flex-1">
                    <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                      Get Started
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <Badge className="mb-4 bg-orange-50 text-orange-700 border-0 px-4 py-2">
              All Pages & Components
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 animate-fade-in-up">
              NuloAfrica Design System
            </h1>
            <p className="text-xl text-slate-600 mb-8 animate-fade-in-up" style={{animationDelay: '0.1s'}}>
              Explore all pages and components of the luxury African real estate platform
            </p>
            <div className="flex flex-wrap gap-4 justify-center animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              <Link href="/">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl px-8 h-12">
                  <Home className="mr-2 h-5 w-5" />
                  Go to Home
                </Button>
              </Link>
              <Link href="/properties">
                <Button variant="outline" className="border-2 border-orange-200 hover:border-orange-400 rounded-xl px-8 h-12">
                  <Building2 className="mr-2 h-5 w-5" />
                  Browse Properties
                </Button>
              </Link>
            </div>

            {/* Glassmorphism Search Bar */}
            <div className="mt-8 flex justify-center animate-fade-in-up" style={{animationDelay: '0.3s'}}>
              <form
                onSubmit={(e) => e.preventDefault()}
                aria-label="Search properties"
                className="w-full max-w-3xl bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-4 md:p-6 flex items-center gap-3 shadow-lg"
              >
                <label htmlFor="query" className="sr-only">Search</label>
                <input
                  id="query"
                  name="query"
                  type="search"
                  placeholder="Search by city, neighbourhood, or property ID"
                  className="flex-1 bg-transparent placeholder-slate-200 text-white focus:outline-none px-4 py-3 rounded-xl"
                />

                <label htmlFor="type" className="sr-only">Property type</label>
                <select
                  id="type"
                  name="type"
                  className="bg-white/5 text-white rounded-xl px-3 py-2 focus:outline-none"
                >
                  <option value="any">Any type</option>
                  <option value="sale">For Sale</option>
                  <option value="rent">For Rent</option>
                </select>

                <Button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white rounded-2xl px-6 py-2">
                  <Search className="mr-2 h-4 w-4" />
                  Search
                </Button>
              </form>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card 
                  key={index}
                  className="bg-white/90 backdrop-blur-sm border-white/50 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  style={{animationDelay: `${0.3 + index * 0.1}s`}}
                >
                  <CardContent className="p-6 text-center">
                    <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-7 w-7 text-orange-600" />
                    </div>
                    <h3 className="font-bold text-slate-900 mb-2">{feature.title}</h3>
                    <p className="text-sm text-slate-600">{feature.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Popular Cities Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-orange-50 text-orange-700 border-0 px-4 py-2">
                <MapPin className="h-3 w-3 inline mr-2" />
                Explore Cities
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                Popular <span className="text-orange-600">Cities</span>
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Discover premium properties in Africa's most vibrant and sought-after cities
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {popularCities.map((city, index) => (
                <Link key={index} href={`/properties?city=${city.name}`}>
                  <Card className="group relative bg-white/90 backdrop-blur-sm border-white/50 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-700 hover:-translate-y-3 cursor-pointer overflow-hidden h-[400px]">
                    {/* Background Image with Overlay */}
                    <div className="absolute inset-0">
                      <img
                        src={city.image || "/placeholder.svg"}
                        alt={city.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
                      
                      {/* Animated Glow */}
                      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    </div>

                    {/* Content */}
                    <CardContent className="relative z-10 h-full flex flex-col justify-end p-8">
                      {/* Property Count Badge */}
                      <Badge className="absolute top-6 right-6 bg-orange-500 text-white border-0 px-4 py-2 shadow-lg">
                        {city.properties} Properties
                      </Badge>

                      {/* City Info */}
                      <div className="space-y-3">
                        <div>
                          <h3 className="text-3xl font-bold text-white mb-1 group-hover:text-orange-400 transition-colors duration-300">
                            {city.name}
                          </h3>
                          <p className="text-orange-400 font-medium flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            {city.country}
                          </p>
                        </div>
                        
                        <p className="text-white/90 text-sm">
                          {city.description}
                        </p>

                        {/* Explore Button */}
                        <div className="flex items-center gap-2 text-white font-semibold pt-4 group-hover:gap-4 transition-all duration-300">
                          <span>Explore Properties</span>
                          <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
                        </div>
                      </div>
                    </CardContent>

                    {/* Decorative Corner */}
                    <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-orange-500/20 to-transparent rounded-br-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* Pages Grid */}
          <div className="mb-12">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-orange-50 text-orange-700 border-0 px-4 py-2">
                <Sparkles className="h-3 w-3 inline mr-2" />
                Design System
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                All <span className="text-orange-600">Pages</span>
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Explore every page and component in our comprehensive design system
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pages.map((page, index) => {
                const Icon = page.icon
                return (
                  <Link key={index} href={page.href}>
                    <Card className="group bg-white/90 backdrop-blur-sm border-white/50 rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer overflow-hidden">
                      {/* Hover Glow */}
                      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-orange-400/20 via-orange-300/10 to-transparent" />
                      
                      <CardContent className="p-6 relative z-10">
                        {/* Icon */}
                        <div className={`w-12 h-12 ${page.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>

                        {/* Title */}
                        <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-orange-600 transition-colors">
                          {page.title}
                        </h3>

                        {/* Description */}
                        <p className="text-sm text-slate-600 mb-4">
                          {page.description}
                        </p>

                        {/* Features */}
                        <div className="space-y-2 mb-4">
                          {page.features.map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                              <CheckCircle className="h-3 w-3 text-orange-500" />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>

                        {/* CTA */}
                        <div className="flex items-center text-orange-600 font-semibold text-sm group-hover:gap-2 transition-all">
                          <span>View Page</span>
                          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Design System Info */}
          <Card className="relative bg-gradient-to-br from-orange-500 to-orange-600 border-0 rounded-3xl shadow-2xl overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-400/20 rounded-full blur-2xl" />
            
            <CardContent className="relative z-10 p-8 md:p-16 text-center text-white">
              <Badge className="mb-6 bg-white/20 text-white border-0 px-6 py-2 backdrop-blur-sm">
                <Sparkles className="h-4 w-4 inline mr-2" />
                Premium Design System
              </Badge>
              
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Built for <span className="text-white/90">Excellence</span>
              </h2>
              
              <p className="text-xl mb-12 text-white/90 max-w-3xl mx-auto leading-relaxed">
                A comprehensive real estate platform built with Next.js, Tailwind CSS, and shadcn/ui. 
                Features Google Maps integration, advanced filtering, and a minimalist African luxury aesthetic.
              </p>
              
              <div className="grid md:grid-cols-3 gap-8 text-left mb-12">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 hover:-translate-y-1">
                  <div className="text-4xl mb-4">🎨</div>
                  <h3 className="text-xl font-bold mb-3">Luxury Styling</h3>
                  <p className="text-sm text-white/80 leading-relaxed">
                    Glassmorphism effects, amber gold accents, warm ivory backgrounds, and premium typography
                  </p>
                </div>
                
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 hover:-translate-y-1">
                  <div className="text-4xl mb-4">✨</div>
                  <h3 className="text-xl font-bold mb-3">Smooth Animations</h3>
                  <p className="text-sm text-white/80 leading-relaxed">
                    Fade-in effects, hover-lift interactions, scale transforms, and buttery smooth transitions
                  </p>
                </div>
                
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 hover:-translate-y-1">
                  <div className="text-4xl mb-4">🗺️</div>
                  <h3 className="text-xl font-bold mb-3">Maps Integration</h3>
                  <p className="text-sm text-white/80 leading-relaxed">
                    Google Maps API with location autocomplete, property markers, and turn-by-turn directions
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 justify-center">
                <Link href="/">
                  <Button size="lg" className="bg-white text-orange-600 hover:bg-white/90 rounded-xl px-8 h-14 text-lg font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105">
                    <Home className="mr-2 h-5 w-5" />
                    Explore Platform
                  </Button>
                </Link>
                <Link href="/properties">
                  <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-orange-600 rounded-xl px-8 h-14 text-lg font-semibold transition-all hover:scale-105">
                    <Building2 className="mr-2 h-5 w-5" />
                    View Properties
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-xl border-t border-stone-200/50 py-8">
        <div className="container mx-auto px-6 text-center">
          <p className="text-slate-600">
            © 2025 <span className="font-semibold text-slate-900">NuloAfrica</span>. Design Showcase.
          </p>
        </div>
      </footer>
    </div>
  )
}

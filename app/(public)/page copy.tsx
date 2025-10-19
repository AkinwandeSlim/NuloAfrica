"use client"

import { useState, useEffect, useRef } from "react"
import { Search, Home, Building2, MapPin, Star, Shield, Users, CheckCircle, ChevronDown, SlidersHorizontal, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Footer } from "@/components/footer"

export default function HomePage() {
  const [location, setLocation] = useState("")
  const [priceRange, setPriceRange] = useState([0, 1000000])
  const [propertyType, setPropertyType] = useState("All Types")
  const [showAdvanced, setShowAdvanced] = useState(false)
  const locationInputRef = useRef<HTMLInputElement>(null)
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)

  // Initialize Google Maps Autocomplete
  useEffect(() => {
    if (typeof window !== 'undefined' && window.google && window.google.maps && locationInputRef.current) {
      try {
        autocompleteRef.current = new google.maps.places.Autocomplete(locationInputRef.current, {
          types: ['(cities)'],
          componentRestrictions: { country: ['ke', 'ng', 'gh', 'za', 'tz', 'rw', 'ma', 'eg'] }, // African countries
        })

        autocompleteRef.current.addListener('place_changed', () => {
          const place = autocompleteRef.current?.getPlace()
          if (place?.formatted_address) {
            setLocation(place.formatted_address)
          }
        })
      } catch (error) {
        console.error('Failed to initialize Google Maps Autocomplete:', error)
      }
    }
  }, [])

  const propertyTypes = ['All Types', 'Apartment', 'House', 'Villa', 'Penthouse', 'Studio', 'Loft']

  const formatPrice = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`
    return `$${value}`
  }

  const popularCities = [
    {
      name: "Lagos",
      country: "Nigeria",
      properties: 456,
      image: "/lagos-victoria-island-skyline.jpg",
      description: "Nigeria's commercial capital with vibrant city life",
    },
    {
      name: "Abuja",
      country: "Nigeria",
      properties: 267,
      image: "/african-cityscape.jpg",
      description: "Nigeria's modern capital city with planned infrastructure",
    },
    {
      name: "Port Harcourt",
      country: "Nigeria",
      properties: 189,
      image: "/contemporary-townhouse-johannesburg.jpg",
      description: "The Garden City - Nigeria's oil and gas hub",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/30 to-white overflow-hidden">
      {/* Hero Section - Ultra Modern with Floating Bubbles */}
      <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50/80 via-white to-slate-50/60 animate-gradient-shift" />
        
        {/* Floating Bubbles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Large Amber Bubble */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-amber-400/20 to-orange-300/10 rounded-full blur-3xl animate-float" style={{animationDuration: '20s'}} />
          
          {/* Medium Slate Bubble */}
          <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-br from-slate-300/15 to-slate-200/10 rounded-full blur-3xl animate-float-delayed" style={{animationDuration: '25s', animationDelay: '2s'}} />
          
          {/* Small Amber Bubble */}
          <div className="absolute bottom-32 left-1/4 w-64 h-64 bg-gradient-to-br from-amber-300/25 to-yellow-200/15 rounded-full blur-2xl animate-float" style={{animationDuration: '18s', animationDelay: '1s'}} />
          
          {/* Tiny Accent Bubble */}
          <div className="absolute top-1/3 right-1/3 w-48 h-48 bg-gradient-to-br from-orange-400/20 to-amber-300/10 rounded-full blur-2xl animate-pulse-slow" style={{animationDuration: '8s'}} />
          
          {/* Bottom Right Bubble */}
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-br from-slate-200/20 to-amber-100/15 rounded-full blur-3xl animate-float-delayed" style={{animationDuration: '22s', animationDelay: '3s'}} />
        </div>
        
        {/* Radial Glow Effect */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-[800px] w-[800px] rounded-full bg-gradient-radial from-amber-200/30 via-transparent to-transparent blur-3xl animate-pulse-slow" style={{animationDuration: '10s'}} />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Headline */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 leading-tight animate-fade-in-up">
              Discover Your Perfect Home in{" "}
              <span className="bg-gradient-to-r from-amber-600 to-amber-500 bg-clip-text text-transparent">
                Africa
              </span>
            </h1>
            
            {/* Subtext */}
            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed animate-fade-in-up" style={{animationDelay: '0.1s', opacity: 0, animationFillMode: 'forwards'}}>
              Luxury properties across the continent, curated for you
            </p>

            {/* Search Bar - Clean & Elegant */}
            <Card className="max-w-3xl mx-auto bg-white/95 backdrop-blur-sm border border-stone-200/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in-up" style={{animationDelay: '0.2s', opacity: 0, animationFillMode: 'forwards'}}>
              <CardContent className="p-4">
                {/* Main Search Row */}
                <div className="flex flex-col md:flex-row gap-3">
                  {/* Location Input */}
                  <div className="flex-1 relative group">
                    <MapPin className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-500 transition-colors" />
                    <input
                      ref={locationInputRef}
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Location"
                      className="w-full h-12 pl-12 pr-4 rounded-xl border border-stone-200 bg-white text-slate-800 placeholder:text-slate-400 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20 transition-all"
                    />
                  </div>

                  {/* Property Type Dropdown */}
                  <div className="md:w-48 relative group">
                    <Building2 className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-500 transition-colors" />
                    <select
                      value={propertyType}
                      onChange={(e) => setPropertyType(e.target.value)}
                      className="w-full h-12 pl-12 pr-10 rounded-xl border border-stone-200 bg-white text-slate-800 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20 transition-all appearance-none cursor-pointer"
                    >
                      {propertyTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>

                  {/* Search Button */}
                  <Link href={`/properties?location=${encodeURIComponent(location)}&type=${propertyType !== 'All Types' ? propertyType : ''}&minPrice=${priceRange[0]}&maxPrice=${priceRange[1]}`}>
                    <Button
                      type="button"
                      className="h-12 px-8 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-medium transition-all duration-200 hover:shadow-lg"
                    >
                      <Search className="mr-2 h-5 w-5" />
                      Search
                    </Button>
                  </Link>
                </div>

                {/* Advanced Filters Toggle */}
                <div className="mt-3 flex items-center justify-center">
                  <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm text-slate-600 hover:text-amber-600 transition-colors"
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                    {showAdvanced ? 'Hide' : 'Advanced Filters'}
                    <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${showAdvanced ? 'rotate-180' : ''}`} />
                  </button>
                </div>

                {/* Advanced Filters - Price Range Slider */}
                {showAdvanced && (
                  <div className="mt-6 pt-6 border-t border-stone-200 animate-fade-in-up">
                    <div className="space-y-4">
                      {/* Price Range */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <label className="text-sm font-semibold text-slate-700">Price Range</label>
                          <span className="text-sm font-medium text-amber-600">
                            {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
                          </span>
                        </div>
                        <div className="relative">
                          {/* Dual Range Slider */}
                          <div className="relative h-2 bg-stone-200 rounded-full">
                            <div 
                              className="absolute h-2 bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-300"
                              style={{
                                left: `${(priceRange[0] / 1000000) * 100}%`,
                                right: `${100 - (priceRange[1] / 1000000) * 100}%`
                              }}
                            />
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="1000000"
                            step="10000"
                            value={priceRange[0]}
                            onChange={(e) => {
                              const value = parseInt(e.target.value)
                              if (value < priceRange[1]) {
                                setPriceRange([value, priceRange[1]])
                              }
                            }}
                            className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-amber-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:transition-transform"
                          />
                          <input
                            type="range"
                            min="0"
                            max="1000000"
                            step="10000"
                            value={priceRange[1]}
                            onChange={(e) => {
                              const value = parseInt(e.target.value)
                              if (value > priceRange[0]) {
                                setPriceRange([priceRange[0], value])
                              }
                            }}
                            className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-amber-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:transition-transform"
                          />
                        </div>
                        {/* Price Labels */}
                        <div className="flex justify-between mt-2 text-xs text-slate-500">
                          <span>$0</span>
                          <span>$250K</span>
                          <span>$500K</span>
                          <span>$750K</span>
                          <span>$1M+</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Quick Filter Pills */}
                <div className="mt-4 flex flex-wrap gap-2 justify-center">
                  <Link href="/properties?type=Apartment">
                    <span className="px-4 py-1.5 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-full text-sm font-medium transition-all cursor-pointer">Apartments</span>
                  </Link>
                  <Link href="/properties?type=House">
                    <span className="px-4 py-1.5 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-full text-sm font-medium transition-all cursor-pointer">Houses</span>
                  </Link>
                  <Link href="/properties?type=Villa">
                    <span className="px-4 py-1.5 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-full text-sm font-medium transition-all cursor-pointer">Villas</span>
                  </Link>
                  <Link href="/properties?minPrice=500000">
                    <span className="px-4 py-1.5 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-full text-sm font-medium transition-all cursor-pointer">Luxury</span>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Trust indicators - Simple & Clean */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-slate-600 animate-fade-in-up" style={{animationDelay: '0.3s', opacity: 0, animationFillMode: 'forwards'}}>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-amber-500" />
                <span>Verified Properties</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-amber-500" />
                <span>50K+ Users</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-amber-500" />
                <span>4.9/5 Rating</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        {/* Background Animation */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 right-20 w-64 h-64 bg-amber-200 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-48 h-48 bg-stone-300 rounded-full blur-2xl animate-bounce" style={{animationDelay: '2s', animationDuration: '4s'}}></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 animate-fade-in-up">
              Everything you need to find your perfect home
            </h2>
            <p className="text-xl text-slate-700 max-w-3xl mx-auto animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              Our intelligent platform combines advanced technology with local expertise 
              to deliver the best rental experience in Africa.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <Card className="group glass-card hover-lift transition-all duration-500 rounded-2xl animate-fade-in-scale hover-glow" style={{animationDelay: '0.4s'}}>
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 glass-button rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:animate-gentle-bounce transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                  <Building2 className="h-10 w-10 text-amber-600 group-hover:animate-pulse" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-amber-600 transition-colors duration-300 letter-spacing-tight">Smart Search</h3>
                <p className="text-slate-700 leading-relaxed text-lg group-hover:text-slate-800 transition-colors duration-300 font-light letter-spacing-wide">
                  AI-powered search that learns your preferences and suggests the perfect properties
                </p>
              </CardContent>
            </Card>

            <Card className="group glass-card hover-lift transition-all duration-500 rounded-2xl animate-fade-in-scale hover-glow" style={{animationDelay: '0.6s'}}>
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 glass-button rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:animate-gentle-bounce transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                  <Shield className="h-10 w-10 text-amber-600 group-hover:animate-pulse" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-amber-600 transition-colors duration-300 letter-spacing-tight">Verified Listings</h3>
                <p className="text-slate-700 leading-relaxed text-lg group-hover:text-slate-800 transition-colors duration-300 font-light letter-spacing-wide">
                  Every property is personally verified by our team to ensure quality and accuracy
                </p>
              </CardContent>
            </Card>

            <Card className="group glass-card hover-lift transition-all duration-500 rounded-2xl animate-fade-in-scale hover-glow" style={{animationDelay: '0.8s'}}>
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 glass-button rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:animate-gentle-bounce transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                  <Users className="h-10 w-10 text-amber-600 group-hover:animate-pulse" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-amber-600 transition-colors duration-300 letter-spacing-tight">24/7 Support</h3>
                <p className="text-slate-700 leading-relaxed text-lg group-hover:text-slate-800 transition-colors duration-300 font-light letter-spacing-wide">
                  Get help whenever you need it with our dedicated support team
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-amber-50 to-stone-50 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-1/4 w-32 h-32 bg-amber-300 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-10 right-1/4 w-40 h-40 bg-stone-400 rounded-full blur-3xl animate-bounce" style={{animationDelay: '1s', animationDuration: '3s'}}></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="animate-fade-in-up hover:scale-110 transition-all duration-300" style={{animationDelay: '0.2s'}}>
              <div className="text-5xl font-bold text-amber-600 mb-2 animate-pulse">50K+</div>
              <div className="text-stone-600 font-medium">Active Users</div>
            </div>
            <div className="animate-fade-in-up hover:scale-110 transition-all duration-300" style={{animationDelay: '0.4s'}}>
              <div className="text-5xl font-bold text-amber-600 mb-2 animate-pulse" style={{animationDelay: '0.5s'}}>1M+</div>
              <div className="text-stone-600 font-medium">Properties Listed</div>
            </div>
            <div className="animate-fade-in-up hover:scale-110 transition-all duration-300" style={{animationDelay: '0.6s'}}>
              <div className="text-5xl font-bold text-amber-600 mb-2 animate-pulse" style={{animationDelay: '1s'}}>24</div>
              <div className="text-stone-600 font-medium">African Cities</div>
            </div>
            <div className="animate-fade-in-up hover:scale-110 transition-all duration-300" style={{animationDelay: '0.8s'}}>
              <div className="text-5xl font-bold text-amber-600 mb-2 animate-pulse" style={{animationDelay: '1.5s'}}>4.9★</div>
              <div className="text-stone-600 font-medium">User Rating</div>
            </div>
                </div>
              </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        {/* Subtle Background Animation */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/2 left-10 w-32 h-32 bg-amber-200 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute top-1/3 right-10 w-24 h-24 bg-stone-300 rounded-full blur-xl animate-bounce" style={{animationDelay: '2s', animationDuration: '3s'}}></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-stone-800 mb-6 animate-fade-in-up">
              How it works
            </h2>
            <p className="text-xl text-stone-600 max-w-3xl mx-auto animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              Get started in minutes with our simple, intuitive process
              </p>
            </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center animate-fade-in-up hover:scale-105 transition-all duration-300" style={{animationDelay: '0.4s'}}>
              <div className="w-16 h-16 bg-amber-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold hover:scale-110 hover:rotate-12 transition-all duration-300 animate-pulse">
                1
              </div>
              <h3 className="text-2xl font-semibold text-stone-800 mb-4 hover:text-amber-600 transition-colors duration-300">Search & Filter</h3>
              <p className="text-stone-600 leading-relaxed text-lg">
                Use our smart search to find properties that match your exact needs and budget
              </p>
                </div>

            <div className="text-center animate-fade-in-up hover:scale-105 transition-all duration-300" style={{animationDelay: '0.6s'}}>
              <div className="w-16 h-16 bg-amber-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold hover:scale-110 hover:rotate-12 transition-all duration-300 animate-pulse" style={{animationDelay: '0.5s'}}>
                2
              </div>
              <h3 className="text-2xl font-semibold text-stone-800 mb-4 hover:text-amber-600 transition-colors duration-300">Schedule Viewing</h3>
              <p className="text-stone-600 leading-relaxed text-lg">
                Book virtual or in-person viewings with property owners directly through our platform
              </p>
            </div>

            <div className="text-center animate-fade-in-up hover:scale-105 transition-all duration-300" style={{animationDelay: '0.8s'}}>
              <div className="w-16 h-16 bg-amber-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold hover:scale-110 hover:rotate-12 transition-all duration-300 animate-pulse" style={{animationDelay: '1s'}}>
                3
                </div>
              <h3 className="text-2xl font-semibold text-stone-800 mb-4 hover:text-amber-600 transition-colors duration-300">Secure Booking</h3>
              <p className="text-stone-600 leading-relaxed text-lg">
                Complete your rental agreement securely with our integrated payment and contract system
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Cities Section */}
      <section className="py-24 bg-gradient-to-br from-slate-50 to-white relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-64 h-64 bg-amber-200/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-48 h-48 bg-slate-300/30 rounded-full blur-2xl animate-bounce" style={{animationDelay: '2s', animationDuration: '4s'}}></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-amber-100 text-amber-700 border-0 px-4 py-2">
              <MapPin className="h-3 w-3 inline mr-2" />
              Explore Nigeria
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Popular <span className="text-amber-600">Cities</span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Discover premium properties in Nigeria's major cities
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
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  </div>

                  {/* Content */}
                  <CardContent className="relative z-10 h-full flex flex-col justify-end p-8">
                    {/* Property Count Badge */}
                    <Badge className="absolute top-6 right-6 bg-amber-500 text-white border-0 px-4 py-2 shadow-lg">
                      {city.properties} Properties
                    </Badge>

                    {/* City Info */}
                    <div className="space-y-3">
                      <div>
                        <h3 className="text-3xl font-bold text-white mb-1 group-hover:text-amber-400 transition-colors duration-300">
                          {city.name}
                        </h3>
                        <p className="text-amber-400 font-medium flex items-center gap-2">
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
                  <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-amber-500/20 to-transparent rounded-br-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gradient-to-br from-amber-50 to-slate-50 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-20 w-48 h-48 bg-amber-300/30 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-10 right-20 w-64 h-64 bg-slate-400/30 rounded-full blur-3xl animate-bounce" style={{animationDelay: '1s', animationDuration: '3s'}}></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 animate-fade-in-up">
              What Our Users Say
            </h2>
            <p className="text-xl text-slate-700 max-w-3xl mx-auto animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              Real stories from satisfied renters across Africa
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { 
                name: "Sarah Johnson", 
                location: "Lagos, Nigeria", 
                rating: 5, 
                review: "Found my dream apartment in just 2 weeks! The platform made it so easy to compare options and the virtual tours were amazing.",
                avatar: "👩🏾‍💼"
              },
              { 
                name: "Ahmed Hassan", 
                location: "Cairo, Egypt", 
                rating: 5, 
                review: "Excellent service and verified listings. The team was incredibly helpful throughout the entire process. Highly recommended!",
                avatar: "👨🏾‍💻"
              },
              { 
                name: "Grace Mwangi", 
                location: "Nairobi, Kenya", 
                rating: 5, 
                review: "The smart search feature is incredible. It learned my preferences and suggested perfect matches. Saved me so much time!",
                avatar: "👩🏾‍🎓"
              },
              { 
                name: "David Okafor", 
                location: "Accra, Ghana", 
                rating: 5, 
                review: "Professional service from start to finish. The property verification process gave me confidence in my choice.",
                avatar: "👨🏾‍💼"
              },
              { 
                name: "Fatima Al-Rashid", 
                location: "Casablanca, Morocco", 
                rating: 5, 
                review: "Beautiful interface and easy to use. Found exactly what I was looking for in my budget. Will definitely use again!",
                avatar: "👩🏾‍🎨"
              },
              { 
                name: "James Mitchell", 
                location: "Cape Town, South Africa", 
                rating: 5, 
                review: "The 24/7 support team was fantastic. They helped me navigate the rental process and answered all my questions promptly.",
                avatar: "👨🏾‍🔬"
              }
            ].map((testimonial, index) => (
              <Card key={index} className="group border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 rounded-2xl animate-fade-in-up bg-white/90 backdrop-blur-sm" style={{animationDelay: `${0.4 + index * 0.1}s`}}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-amber-500 text-lg">★</span>
                    ))}
            </div>
                  <p className="text-slate-700 leading-relaxed mb-6 italic">
                    "{testimonial.review}"
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">{testimonial.avatar}</div>
            <div>
                      <h4 className="font-semibold text-slate-900">{testimonial.name}</h4>
                      <p className="text-slate-600 text-sm">{testimonial.location}</p>
              </div>
            </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-amber-600 to-amber-700 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-20 w-40 h-40 bg-white/20 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-10 right-20 w-32 h-32 bg-amber-200/30 rounded-full blur-xl animate-bounce" style={{animationDelay: '1s', animationDuration: '3s'}}></div>
          <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-white/10 rounded-full blur-lg animate-pulse" style={{animationDelay: '2s', animationDuration: '4s'}}></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 animate-fade-in-up">
            Ready to find your perfect home?
          </h2>
          <p className="text-xl text-amber-100 mb-12 max-w-3xl mx-auto animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            Join thousands of satisfied renters who found their perfect home through Nulo Africa
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/signup">
              <Button 
                size="lg" 
                className="luxury-gradient-button text-white px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl animate-fade-in-up"
                style={{animationDelay: '0.4s'}}
              >
                Start Your Search
              </Button>
            </Link>
            <Link href="/signin">
          <Button
            size="lg"
                variant="outline"
                className="border-2 border-white text-white bg-transparent hover:bg-white hover:text-slate-900 px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl animate-fade-in-up"
                style={{animationDelay: '0.6s'}}
          >
                Sign In
          </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

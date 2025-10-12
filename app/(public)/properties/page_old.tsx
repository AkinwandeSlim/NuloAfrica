"use client"

import { useState, useEffect } from "react"
import dynamic from 'next/dynamic'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { 
  MapPin, Bed, Bath, Square, Heart, Search, SlidersHorizontal, 
  ChevronDown, List, Map as MapIcon, X, Home, Building2, 
  DollarSign, Maximize2, Filter, ArrowUpDown, Loader2
} from "lucide-react"
import Link from "next/link"

// Dynamically import Leaflet Map component to avoid SSR issues
const PropertyMap = dynamic(() => import('@/components/PropertyMapLeaflet'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-slate-100">
      <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
      <p className="ml-3 text-slate-600">Loading map...</p>
    </div>
  )
})

interface Property {
  id: number
  title: string
  location: string
  price: number
  pricePerMonth: number
  beds: number
  baths: number
  sqft: number
  type: string
  image: string
  featured: boolean
  latitude: number
  longitude: number
  description?: string
}

// Sample properties with coordinates - Nigerian Cities
const propertiesData: Property[] = [
  // Lagos Properties
  {
    id: 1,
    title: "Luxury Penthouse Victoria Island",
    location: "Victoria Island, Lagos, Nigeria",
    price: 450000,
    pricePerMonth: 2800,
    beds: 4,
    baths: 4,
    sqft: 3500,
    type: "Penthouse",
    image: "/placeholder.svg?height=400&width=600",
    featured: true,
    latitude: 6.4281,
    longitude: 3.4219,
    description: "Stunning penthouse with ocean views and modern amenities"
  },
  {
    id: 2,
    title: "Modern Duplex Lekki Phase 1",
    location: "Lekki Phase 1, Lagos, Nigeria",
    price: 380000,
    pricePerMonth: 2200,
    beds: 5,
    baths: 5,
    sqft: 4200,
    type: "Duplex",
    image: "/placeholder.svg?height=400&width=600",
    featured: true,
    latitude: 6.4474,
    longitude: 3.4739,
    description: "Spacious duplex in gated estate with 24/7 security"
  },
  {
    id: 3,
    title: "Elegant Apartment Ikoyi",
    location: "Ikoyi, Lagos, Nigeria",
    price: 320000,
    pricePerMonth: 1900,
    beds: 3,
    baths: 3,
    sqft: 2800,
    type: "Apartment",
    image: "/placeholder.svg?height=400&width=600",
    featured: false,
    latitude: 6.4541,
    longitude: 3.4316,
    description: "High-rise luxury apartment in prestigious Ikoyi"
  },
  {
    id: 4,
    title: "Contemporary Villa Banana Island",
    location: "Banana Island, Lagos, Nigeria",
    price: 850000,
    pricePerMonth: 5000,
    beds: 6,
    baths: 7,
    sqft: 6500,
    type: "Villa",
    image: "/placeholder.svg?height=400&width=600",
    featured: true,
    latitude: 6.4333,
    longitude: 3.4333,
    description: "Exclusive waterfront villa with private dock and pool"
  },
  {
    id: 5,
    title: "Serviced Apartment Ikeja GRA",
    location: "Ikeja GRA, Lagos, Nigeria",
    price: 180000,
    pricePerMonth: 1200,
    beds: 2,
    baths: 2,
    sqft: 1800,
    type: "Apartment",
    image: "/placeholder.svg?height=400&width=600",
    featured: false,
    latitude: 6.5833,
    longitude: 3.3500,
    description: "Fully serviced apartment near airport and business district"
  },
  
  // Abuja Properties
  {
    id: 6,
    title: "Executive Mansion Maitama",
    location: "Maitama, Abuja, Nigeria",
    price: 680000,
    pricePerMonth: 4000,
    beds: 7,
    baths: 8,
    sqft: 7200,
    type: "Mansion",
    image: "/placeholder.svg?height=400&width=600",
    featured: true,
    latitude: 9.0820,
    longitude: 7.4951,
    description: "Palatial mansion in Abuja's most prestigious district"
  },
  {
    id: 7,
    title: "Modern Terrace Asokoro",
    location: "Asokoro, Abuja, Nigeria",
    price: 420000,
    pricePerMonth: 2500,
    beds: 4,
    baths: 5,
    sqft: 3800,
    type: "Terrace",
    image: "/placeholder.svg?height=400&width=600",
    featured: true,
    latitude: 9.0333,
    longitude: 7.5333,
    description: "Contemporary terrace house with smart home features"
  },
  {
    id: 8,
    title: "Luxury Apartment Wuse 2",
    location: "Wuse 2, Abuja, Nigeria",
    price: 280000,
    pricePerMonth: 1700,
    beds: 3,
    baths: 3,
    sqft: 2500,
    type: "Apartment",
    image: "/placeholder.svg?height=400&width=600",
    featured: false,
    latitude: 9.0667,
    longitude: 7.4833,
    description: "Prime location apartment in Abuja's commercial hub"
  },
  {
    id: 9,
    title: "Family Home Gwarinpa",
    location: "Gwarinpa, Abuja, Nigeria",
    price: 220000,
    pricePerMonth: 1400,
    beds: 4,
    baths: 4,
    sqft: 3000,
    type: "House",
    image: "/placeholder.svg?height=400&width=600",
    featured: false,
    latitude: 9.1167,
    longitude: 7.4167,
    description: "Spacious family home in well-planned residential area"
  },
  {
    id: 10,
    title: "Penthouse Jabi Lake",
    location: "Jabi, Abuja, Nigeria",
    price: 520000,
    pricePerMonth: 3200,
    beds: 4,
    baths: 4,
    sqft: 4000,
    type: "Penthouse",
    image: "/placeholder.svg?height=400&width=600",
    featured: true,
    latitude: 9.0667,
    longitude: 7.4500,
    description: "Stunning penthouse overlooking Jabi Lake with rooftop terrace"
  },
  
  // Port Harcourt Properties
  {
    id: 11,
    title: "Waterfront Villa Old GRA",
    location: "Old GRA, Port Harcourt, Nigeria",
    price: 480000,
    pricePerMonth: 2900,
    beds: 5,
    baths: 6,
    sqft: 5000,
    type: "Villa",
    image: "/placeholder.svg?height=400&width=600",
    featured: true,
    latitude: 4.8156,
    longitude: 7.0498,
    description: "Elegant waterfront villa with private jetty and garden"
  },
  {
    id: 12,
    title: "Modern Duplex New GRA",
    location: "New GRA, Port Harcourt, Nigeria",
    price: 350000,
    pricePerMonth: 2100,
    beds: 4,
    baths: 4,
    sqft: 3600,
    type: "Duplex",
    image: "/placeholder.svg?height=400&width=600",
    featured: false,
    latitude: 4.8333,
    longitude: 7.0167,
    description: "Contemporary duplex in secure gated community"
  },
  {
    id: 13,
    title: "Executive Apartment Trans Amadi",
    location: "Trans Amadi, Port Harcourt, Nigeria",
    price: 190000,
    pricePerMonth: 1300,
    beds: 3,
    baths: 3,
    sqft: 2200,
    type: "Apartment",
    image: "/placeholder.svg?height=400&width=600",
    featured: false,
    latitude: 4.8000,
    longitude: 7.0333,
    description: "Well-appointed apartment near industrial area"
  },
  {
    id: 14,
    title: "Luxury Bungalow Rumuola",
    location: "Rumuola, Port Harcourt, Nigeria",
    price: 280000,
    pricePerMonth: 1800,
    beds: 4,
    baths: 4,
    sqft: 3200,
    type: "Bungalow",
    image: "/placeholder.svg?height=400&width=600",
    featured: false,
    latitude: 4.8500,
    longitude: 7.0167,
    description: "Spacious bungalow with large compound and parking"
  },
  {
    id: 15,
    title: "Premium Terrace Ada George",
    location: "Ada George, Port Harcourt, Nigeria",
    price: 240000,
    pricePerMonth: 1600,
    beds: 3,
    baths: 4,
    sqft: 2800,
    type: "Terrace",
    image: "/placeholder.svg?height=400&width=600",
    featured: false,
    latitude: 4.8667,
    longitude: 7.0500,
    description: "Modern terrace house in developing residential area"
  },
]

export default function PropertiesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [favorites, setFavorites] = useState<number[]>([])
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  
  // Filters
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000])
  const [selectedType, setSelectedType] = useState<string>("all")
  const [minBeds, setMinBeds] = useState<number>(0)
  const [minBaths, setMinBaths] = useState<number>(0)
  const [sortBy, setSortBy] = useState<'recent' | 'price-low' | 'price-high'>('recent')

  // Filter properties
  const filteredProperties = propertiesData.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesPrice = property.price >= priceRange[0] && property.price <= priceRange[1]
    const matchesType = selectedType === "all" || property.type.toLowerCase() === selectedType.toLowerCase()
    const matchesBeds = property.beds >= minBeds
    const matchesBaths = property.baths >= minBaths
    
    return matchesSearch && matchesPrice && matchesType && matchesBeds && matchesBaths
  }).sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price
    if (sortBy === 'price-high') return b.price - a.price
    return 0
  })

  const toggleFavorite = (id: number) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
    )
  }

  const propertyTypes = ["all", "Villa", "Apartment", "House", "Penthouse", "Bungalow", "Duplex", "Mansion", "Terrace"]

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Search Bar - Sticky at top */}
      <div className="sticky top-16 z-40 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-[1920px] mx-auto px-6 py-3">
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input
              type="text"
              placeholder="Search by location, property name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 h-11 border-slate-300 focus:border-amber-500 focus:ring-amber-500"
            />
          </div>
        </div>
      </div>

      {/* 3-Column Layout */}
      <div className="flex h-[calc(100vh-140px)]">
        {/* LEFT SIDEBAR - Filters */}
        <div className="w-80 bg-white border-r border-slate-200 overflow-y-auto">
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Filters</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setPriceRange([0, 1000000])
                  setSelectedType("all")
                  setMinBeds(0)
                  setMinBaths(0)
                  setSearchQuery("")
                }}
                className="text-amber-600 hover:text-amber-700 text-sm"
              >
                Clear all
              </Button>
            </div>

            {/* Price Range */}
            <div>(
            <div className="mt-4 p-6 bg-white rounded-2xl luxury-shadow-md border border-slate-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Price Range */}
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-amber-600" />
                    Price Range
                  </label>
                  <div className="space-y-3">
                    <Slider
                      value={priceRange}
                      onValueChange={(value) => setPriceRange(value as [number, number])}
                      max={1000000}
                      step={10000}
                      className="w-full"
                    />
                    <div className="flex items-center justify-between text-sm text-slate-600">
                      <span>${(priceRange[0] / 1000).toFixed(0)}k</span>
                      <span>${(priceRange[1] / 1000).toFixed(0)}k</span>
                    </div>
                  </div>
                </div>

                {/* Property Type */}
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                    <Home className="h-4 w-4 text-amber-600" />
                    Property Type
                  </label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border-2 border-slate-200 focus:border-amber-500 transition-all"
                  >
                    {propertyTypes.map(type => (
                      <option key={type} value={type}>
                        {type === "all" ? "All Types" : type}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Bedrooms */}
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                    <Bed className="h-4 w-4 text-amber-600" />
                    Min Bedrooms
                  </label>
                  <div className="flex gap-2">
                    {[0, 1, 2, 3, 4, 5].map(num => (
                      <Button
                        key={num}
                        variant={minBeds === num ? "default" : "outline"}
                        size="sm"
                        onClick={() => setMinBeds(num)}
                        className="flex-1"
                      >
                        {num === 0 ? "Any" : num}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Bathrooms */}
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                    <Bath className="h-4 w-4 text-amber-600" />
                    Min Bathrooms
                  </label>
                  <div className="flex gap-2">
                    {[0, 1, 2, 3, 4].map(num => (
                      <Button
                        key={num}
                        variant={minBaths === num ? "default" : "outline"}
                        size="sm"
                        onClick={() => setMinBaths(num)}
                        className="flex-1"
                      >
                        {num === 0 ? "Any" : num}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Clear Filters */}
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-slate-600">
                  {filteredProperties.length} properties found
                </p>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setPriceRange([0, 1000000])
                    setSelectedType("all")
                    setMinBeds(0)
                    setMinBaths(0)
                    setSearchQuery("")
                  }}
                  className="text-amber-600 hover:text-amber-700"
                >
                  Clear all filters
                </Button>
              </div>
            </div>

            {/* Results Count */}
            <div className="pt-4 border-t border-slate-200">
              <p className="text-sm text-slate-600">
                <span className="font-semibold text-slate-900">{filteredProperties.length}</span> properties found
              </p>
            </div>
          </div>
        </div>

        {/* CENTER - Map */}
        <div className="flex-1 relative">
          <PropertyMap 
            properties={filteredProperties}
            selectedProperty={selectedProperty}
            onPropertySelect={(property) => setSelectedProperty(property)}
          />
        </div>

        {/* RIGHT SIDEBAR - Property Listings */}
        <div className="w-96 bg-white border-l border-slate-200 overflow-y-auto">
          <div className="p-4 space-y-4">
            {/* Sort & Results Count */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">
                {filteredProperties.length} Properties Available
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="h-10 px-3 rounded-lg border-2 border-slate-200 focus:border-amber-500 transition-all"
                >
                  <option value="recent">Most Recent</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Properties Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProperties.map((property) => (
                <Card 
                  key={property.id}
                  className="group overflow-hidden border-0 luxury-shadow-md hover:luxury-shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={property.image}
                      alt={property.title}
                      className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {property.featured && (
                      <Badge className="absolute top-4 left-4 bg-amber-500 text-white border-0">
                        Featured
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleFavorite(property.id)}
                      className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm hover:bg-white transition-all"
                    >
                      <Heart
                        className={`h-5 w-5 transition-all ${
                          favorites.includes(property.id)
                            ? "fill-red-500 text-red-500"
                            : "text-slate-600"
                        }`}
                      />
                    </Button>
                  </div>

                  <CardContent className="p-5">
                    <div className="space-y-3">
                      {/* Title & Location */}
                      <div>
                        <h3 className="font-bold text-lg text-slate-900 mb-1 line-clamp-1">
                          {property.title}
                        </h3>
                        <p className="text-sm text-slate-600 flex items-center gap-1">
                          <MapPin className="h-4 w-4 text-amber-600" />
                          {property.location}
                        </p>
                      </div>

                      {/* Price */}
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-amber-600">
                          ${(property.price / 1000).toFixed(0)}k
                        </span>
                        <span className="text-sm text-slate-500">
                          or ${property.pricePerMonth}/mo
                        </span>
                      </div>

                      {/* Features */}
                      <div className="flex items-center gap-4 text-sm text-slate-600">
                        <div className="flex items-center gap-1">
                          <Bed className="h-4 w-4 text-amber-600" />
                          <span>{property.beds}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Bath className="h-4 w-4 text-amber-600" />
                          <span>{property.baths}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Square className="h-4 w-4 text-amber-600" />
                          <span>{property.sqft.toLocaleString()} sqft</span>
                        </div>
                      </div>

                      {/* CTA */}
                      <Link href={`/properties/${property.id}`}>
                        <Button className="w-full luxury-gradient-button text-white">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* No Results */}
            {filteredProperties.length === 0 && (
              <div className="text-center py-20">
                <Home className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  No properties found
                </h3>
                <p className="text-slate-600 mb-6">
                  Try adjusting your filters or search criteria
                </p>
                <Button
                  onClick={() => {
                    setPriceRange([0, 1000000])
                    setSelectedType("all")
                    setMinBeds(0)
                    setMinBaths(0)
                    setSearchQuery("")
                  }}
                  className="luxury-gradient-button text-white"
                >
                  Clear all filters
                </Button>
              </div>
            )}
          </div>
        ) : (
          /* Map View */
          <div className="h-[calc(100vh-200px)] min-h-[600px] flex">
            {/* Map */}
            <div className="flex-1 relative h-full min-h-[600px]">
              <PropertyMap 
                properties={filteredProperties}
                selectedProperty={selectedProperty}
                onPropertySelect={(property) => setSelectedProperty(property)}
              />
            </div>

            {/* Property Cards Sidebar */}
            <div className="w-96 bg-white border-l border-slate-200 overflow-y-auto h-full">
              <div className="p-4 space-y-4">
                <h3 className="font-bold text-lg text-slate-900">
                  {filteredProperties.length} Properties
                </h3>
                
                {filteredProperties.map((property) => (
                  <Card
                    key={property.id}
                    className={`cursor-pointer transition-all ${
                      selectedProperty?.id === property.id
                        ? "ring-2 ring-amber-500 luxury-shadow-lg"
                        : "hover:luxury-shadow-md"
                    }`}
                    onClick={() => setSelectedProperty(property)}
                  >
                    <div className="relative">
                      <img
                        src={property.image}
                        alt={property.title}
                        className="w-full h-32 object-cover"
                      />
                      {property.featured && (
                        <Badge className="absolute top-2 left-2 bg-amber-500 text-white border-0 text-xs">
                          Featured
                        </Badge>
                      )}
                    </div>

                    <CardContent className="p-4">
                      <h4 className="font-semibold text-slate-900 mb-1 line-clamp-1">
                        {property.title}
                      </h4>
                      <p className="text-xs text-slate-600 mb-2 flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {property.location}
                      </p>
                      <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-lg font-bold text-amber-600">
                          ${(property.price / 1000).toFixed(0)}k
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-600">
                        <div className="flex items-center gap-1">
                          <Bed className="h-3 w-3" />
                          {property.beds}
                        </div>
                        <div className="flex items-center gap-1">
                          <Bath className="h-3 w-3" />
                          {property.baths}
                        </div>
                        <div className="flex items-center gap-1">
                          <Square className="h-3 w-3" />
                          {property.sqft.toLocaleString()}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

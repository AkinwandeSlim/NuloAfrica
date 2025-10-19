"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import dynamic from 'next/dynamic'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  MapPin, Bed, Bath, Square, Heart, Search, 
  Home, Loader2, X, SlidersHorizontal, Wifi, Car, 
  Dumbbell, Shield, Waves, Wind, Zap, Dog, Filter
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "sonner"

// Dynamically import Leaflet Map component to avoid SSR issues
const PropertyMap = dynamic(() => import('@/components/PropertyMapLeaflet'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-slate-100">
      <Loader2 className="h-8 w-8 animate-spin text-[#FF6600]" />
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
    image: "/luxury-apartment-lagos.jpg",
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
    image: "/modern-villa-living-room.jpg",
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
    image: "/apartment-accra.jpg",
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
    pricePerMonth: 4500,
    beds: 6,
    baths: 7,
    sqft: 6500,
    type: "Villa",
    image: "/beachfront-property-kenya.jpg",
    featured: true,
    latitude: 6.4167,
    longitude: 3.4333,
    description: "Ultra-luxury waterfront villa on exclusive Banana Island"
  },
  {
    id: 5,
    title: "Cozy Apartment Surulere",
    location: "Surulere, Lagos, Nigeria",
    price: 180000,
    pricePerMonth: 1200,
    beds: 2,
    baths: 2,
    sqft: 1800,
    type: "Apartment",
    image: "/apartment-accra.jpg",
    featured: false,
    latitude: 6.4969,
    longitude: 3.3547,
    description: "Affordable apartment in vibrant Surulere neighborhood"
  },
  // Abuja Properties
  {
    id: 6,
    title: "Executive Mansion Maitama",
    location: "Maitama, Abuja, Nigeria",
    price: 920000,
    pricePerMonth: 5000,
    beds: 7,
    baths: 8,
    sqft: 7500,
    type: "Mansion",
    image: "/modern-villa-pool.jpg",
    featured: true,
    latitude: 9.0833,
    longitude: 7.4833,
    description: "Opulent mansion in Abuja's most prestigious district"
  },
  {
    id: 7,
    title: "Modern Terrace Wuse 2",
    location: "Wuse 2, Abuja, Nigeria",
    price: 280000,
    pricePerMonth: 1700,
    beds: 3,
    baths: 4,
    sqft: 2500,
    type: "Terrace",
    image: "/contemporary-townhouse-johannesburg.jpg",
    featured: false,
    latitude: 9.0667,
    longitude: 7.4833,
    description: "Contemporary terrace house in central business district"
  },
  {
    id: 8,
    title: "Spacious Duplex Asokoro",
    location: "Asokoro, Abuja, Nigeria",
    price: 650000,
    pricePerMonth: 3800,
    beds: 5,
    baths: 6,
    sqft: 5200,
    type: "Duplex",
    image: "/modern-villa-bathroom.jpg",
    featured: true,
    latitude: 9.0333,
    longitude: 7.5333,
    description: "Luxurious duplex in diplomatic enclave"
  },
  {
    id: 9,
    title: "Family House Gwarinpa",
    location: "Gwarinpa, Abuja, Nigeria",
    price: 220000,
    pricePerMonth: 1400,
    beds: 4,
    baths: 3,
    sqft: 3000,
    type: "House",
    image: "/modern-villa-living-room.jpg",
    featured: false,
    latitude: 9.1167,
    longitude: 7.4167,
    description: "Comfortable family home in residential estate"
  },
  {
    id: 10,
    title: "Premium Penthouse Jabi",
    location: "Jabi, Abuja, Nigeria",
    price: 420000,
    pricePerMonth: 2600,
    beds: 4,
    baths: 4,
    sqft: 4000,
    type: "Penthouse",
    image: "/modern-villa-living-room.jpg",
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
    image: "/beachfront-property-kenya.jpg",
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
    image: "/modern-villa-pool.jpg",
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
    image: "/apartment-accra.jpg",
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
    image: "/modern-villa-bathroom.jpg",
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
    image: "/contemporary-townhouse-johannesburg.jpg",
    featured: false,
    latitude: 4.8667,
    longitude: 7.0500,
    description: "Modern terrace house in developing residential area"
  },
]

export default function PropertiesPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user, loading } = useAuth()
  
  const [searchQuery, setSearchQuery] = useState("")
  const [favorites, setFavorites] = useState<number[]>([])
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [showFilterSidebar, setShowFilterSidebar] = useState(false)
  
  // Filters
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000])
  const [selectedType, setSelectedType] = useState<string>("all")
  const [minBeds, setMinBeds] = useState<number>(0)
  const [minBaths, setMinBaths] = useState<number>(0)
  const [sortBy, setSortBy] = useState<'recent' | 'price-low' | 'price-high'>('recent')
  
  // Advanced Filters
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([])

  // Read URL parameters and set filters
  useEffect(() => {
    const location = searchParams.get('location')
    const type = searchParams.get('type')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const bedrooms = searchParams.get('bedrooms')
    const bathrooms = searchParams.get('bathrooms')

    if (location) setSearchQuery(location)
    if (type) setSelectedType(type)
    if (minPrice) setPriceRange(prev => [parseInt(minPrice), prev[1]])
    if (maxPrice) setPriceRange(prev => [prev[0], parseInt(maxPrice)])
    if (bedrooms && bedrooms !== 'Any') setMinBeds(parseInt(bedrooms.replace('+', '')))
    if (bathrooms && bathrooms !== 'Any') setMinBaths(parseInt(bathrooms.replace('+', '')))
  }, [searchParams])

  // Filter properties
  const filteredProperties = propertiesData.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesPrice = property.price >= priceRange[0] && property.price <= priceRange[1]
    const matchesType = selectedType === "all" || property.type === selectedType
    const matchesBeds = property.beds >= minBeds
    const matchesBaths = property.baths >= minBaths
    
    return matchesSearch && matchesPrice && matchesType && matchesBeds && matchesBaths
  }).sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price
    if (sortBy === 'price-high') return b.price - a.price
    return 0
  })

  const toggleFavorite = (id: number) => {
    // Check if user is authenticated
    if (!user) {
      toast.error("Sign in required", {
        description: "Please sign in to save properties as favorites.",
        action: {
          label: "Sign In",
          onClick: () => router.push('/signin'),
        },
      })
      return
    }

    // Toggle favorite
    const isFavorite = favorites.includes(id)
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
    )

    // Show success toast
    if (isFavorite) {
      toast.info("Removed from favorites", {
        description: "Property removed from your favorites list.",
      })
    } else {
      toast.success("Added to favorites", {
        description: "Property saved to your favorites list.",
      })
    }
  }

  const handlePropertySelect = (property: Property | null) => {
    if (property) {
      const lat = Number(property.latitude)
      const lng = Number(property.longitude)
      
      const hasValidCoords = !isNaN(lat) && 
                            !isNaN(lng) && 
                            lat >= -90 && 
                            lat <= 90 && 
                            lng >= -180 && 
                            lng <= 180
      
      if (hasValidCoords) {
        const cleanProperty = {
          ...property,
          latitude: lat,
          longitude: lng
        }
        setSelectedProperty(cleanProperty)
      } else {
        setSelectedProperty(null)
      }
    } else {
      setSelectedProperty(null)
    }
  }

  const propertyTypes = ["all", "Villa", "Apartment", "House", "Penthouse", "Bungalow", "Duplex", "Mansion", "Terrace"]
  
  const amenities = [
    { id: 'wifi', label: 'WiFi', icon: Wifi },
    { id: 'parking', label: 'Parking', icon: Car },
    { id: 'gym', label: 'Gym', icon: Dumbbell },
    { id: 'security', label: '24/7 Security', icon: Shield },
    { id: 'pool', label: 'Swimming Pool', icon: Waves },
    { id: 'ac', label: 'Air Conditioning', icon: Wind },
    { id: 'generator', label: 'Generator', icon: Zap },
    { id: 'pets', label: 'Pet Friendly', icon: Dog },
  ]
  
  const preferences = [
    'Furnished',
    'Unfurnished',
    'Serviced',
    'Newly Built',
    'Gated Estate',
    'Close to School',
    'Close to Market',
    'Waterfront'
  ]

  const toggleAmenity = (id: string) => {
    setSelectedAmenities(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    )
  }

  const togglePreference = (pref: string) => {
    setSelectedPreferences(prev =>
      prev.includes(pref) ? prev.filter(p => p !== pref) : [...prev, pref]
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Filter Bar - Fixed below navbar, doesn't scroll */}
      <div className="fixed top-16 left-0 right-0 z-40 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-[1920px] mx-auto px-4 lg:px-6 py-3">
          <div className="flex items-center gap-3">
            {/* Filter Toggle Button */}
            <Button
              variant="outline"
              onClick={() => setShowFilterSidebar(!showFilterSidebar)}
              className={`h-11 px-4 rounded-lg border-2 font-medium transition-all ${
                showFilterSidebar 
                  ? 'border-[#FF6600] bg-[#FF6600] text-white hover:bg-[#FF6600]/90' 
                  : 'border-slate-300 text-slate-700 hover:border-[#FF6600] hover:text-[#FF6600]'
              }`}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            
            {/* Search Bar - Prominent */}
            <div className="relative flex-1 max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                type="text"
                placeholder="Search by location, city, or neighborhood..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-10 h-11 rounded-lg border-slate-300 bg-white hover:border-[#FF6600] focus:border-[#FF6600] focus:ring-2 focus:ring-[#FF6600]/20 transition-all text-sm shadow-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center transition-colors"
                >
                  <X className="h-4 w-4 text-slate-600" />
                </button>
              )}
            </div>

            {/* Quick Filters - Minimal */}
            <div className="hidden lg:flex items-center gap-2">
              <select
                value={minBeds}
                onChange={(e) => setMinBeds(parseInt(e.target.value))}
                className="h-11 px-4 rounded-lg border border-slate-300 bg-white hover:border-[#FF6600] focus:border-[#FF6600] focus:ring-2 focus:ring-[#FF6600]/20 text-sm font-medium transition-all cursor-pointer shadow-sm"
              >
                <option value="0">Beds</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
                <option value="5">5+</option>
              </select>

              <select
                value={minBaths}
                onChange={(e) => setMinBaths(parseInt(e.target.value))}
                className="h-11 px-4 rounded-lg border border-slate-300 bg-white hover:border-[#FF6600] focus:border-[#FF6600] focus:ring-2 focus:ring-[#FF6600]/20 text-sm font-medium transition-all cursor-pointer shadow-sm"
              >
                <option value="0">Baths</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="h-11 px-4 rounded-lg border border-slate-300 bg-white hover:border-[#FF6600] focus:border-[#FF6600] focus:ring-2 focus:ring-[#FF6600]/20 text-sm font-medium transition-all cursor-pointer shadow-sm"
              >
                <option value="recent">Recent</option>
                <option value="price-low">Price ↑</option>
                <option value="price-high">Price ↓</option>
              </select>
            </div>

            {/* Results Count - Right Aligned */}
            <div className="ml-auto flex items-center gap-2 px-4 py-2.5 bg-slate-100 rounded-lg">
              <span className="text-base font-bold text-slate-900">{filteredProperties.length}</span>
              <span className="text-sm text-slate-600 hidden sm:inline">properties</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2-Column Layout: Map (Left) + Listings (Right) - Rentiful Style */}
      {/* Add top padding to account for fixed filter bar */}
      <div className="relative flex h-[calc(100vh-128px)] mt-[68px]">
        {/* Filter Sidebar - Slides in from left */}
        {showFilterSidebar && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/20 z-40 md:hidden"
              onClick={() => setShowFilterSidebar(false)}
            />
            
            {/* Sidebar - Optimized & Aligned */}
            <div className="fixed md:relative left-0 top-20 md:top-0 h-[calc(100vh-80px)] md:h-full w-80 bg-white border-r border-slate-200 shadow-2xl z-50 overflow-y-auto animate-in slide-in-from-left duration-300">
              <div className="p-5 space-y-5">
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Filters</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Refine your search</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowFilterSidebar(false)}
                    className="h-8 w-8 p-0 hover:bg-slate-100"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Price Range */}
                <div className="bg-slate-50 rounded-lg p-4">
                  <label className="text-sm font-semibold text-slate-900 mb-3 block">
                    Price Range
                  </label>
                  <select
                    value={`${priceRange[0]}-${priceRange[1]}`}
                    onChange={(e) => {
                      const [min, max] = e.target.value.split('-').map(Number)
                      setPriceRange([min, max])
                    }}
                    className="w-full h-10 px-3 rounded-lg border border-slate-300 bg-white hover:border-[#FF6600] focus:border-[#FF6600] focus:ring-2 focus:ring-[#FF6600]/20 text-sm font-medium transition-all cursor-pointer"
                  >
                    <option value="0-1000000">Any Price</option>
                    <option value="0-200000">Under $200k</option>
                    <option value="200000-400000">$200k - $400k</option>
                    <option value="400000-600000">$400k - $600k</option>
                    <option value="600000-1000000">$600k+</option>
                  </select>
                </div>

                {/* Property Type */}
                <div>
                  <label className="text-sm font-semibold text-slate-900 mb-3 block">
                    Property Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {propertyTypes.filter(t => t !== 'all').slice(0, 6).map(type => (
                      <Button
                        key={type}
                        variant={selectedType === type ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedType(type)}
                        className={`h-9 text-xs ${
                          selectedType === type 
                            ? 'bg-[#FF6600] hover:bg-[#FF6600]/90 text-white border-[#FF6600]' 
                            : 'border-slate-300 hover:border-[#FF6600] hover:text-[#FF6600] hover:bg-[#FF6600]/5'
                        }`}
                      >
                        {type}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Amenities */}
                <div>
                  <label className="text-sm font-semibold text-slate-900 mb-3 block">
                    Amenities
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {amenities.slice(0, 6).map(amenity => {
                      const Icon = amenity.icon
                      const isSelected = selectedAmenities.includes(amenity.id)
                      return (
                        <button
                          key={amenity.id}
                          onClick={() => toggleAmenity(amenity.id)}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-all text-left ${
                            isSelected
                              ? 'bg-[#FF6600]/10 border-[#FF6600] text-[#FF6600]'
                              : 'bg-white border-slate-200 hover:border-[#FF6600] hover:bg-[#FF6600]/5 text-slate-700'
                          }`}
                        >
                          <Icon className="h-4 w-4 flex-shrink-0" />
                          <span className="text-sm font-medium">{amenity.label}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Preferences */}
                <div>
                  <label className="text-sm font-semibold text-slate-900 mb-3 block">
                    Preferences
                  </label>
                  <div className="space-y-2">
                    {preferences.slice(0, 6).map(pref => (
                      <label key={pref} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 cursor-pointer group transition-colors">
                        <input
                          type="checkbox"
                          checked={selectedPreferences.includes(pref)}
                          onChange={() => togglePreference(pref)}
                          className="w-4 h-4 rounded border-slate-300 text-[#FF6600] focus:ring-[#FF6600] focus:ring-2 cursor-pointer"
                        />
                        <span className="text-sm text-slate-700 group-hover:text-slate-900 font-medium">
                          {pref}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 border-t border-slate-200 space-y-2">
                  <Button
                    onClick={() => setShowFilterSidebar(false)}
                    className="w-full h-11 bg-[#FF6600] hover:bg-[#FF6600]/90 text-white font-semibold shadow-sm"
                  >
                    Show {filteredProperties.length} Properties
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setPriceRange([0, 1000000])
                      setSelectedType("all")
                      setMinBeds(0)
                      setMinBaths(0)
                      setSearchQuery("")
                      setSelectedAmenities([])
                      setSelectedPreferences([])
                    }}
                    className="w-full h-10 border-slate-300 text-slate-700 hover:bg-slate-50"
                  >
                    Clear All
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* LEFT COLUMN - Map */}
        <div className={`hidden md:block sticky top-0 h-full bg-slate-100 transition-all ${
          showFilterSidebar ? 'md:w-[calc(50%-160px)]' : 'md:w-1/2'
        }`}>
          <PropertyMap
            properties={filteredProperties}
            selectedProperty={selectedProperty}
            onPropertySelect={handlePropertySelect}
          />
        </div>

        {/* RIGHT COLUMN - Property Listings */}
        <div className={`flex-1 overflow-y-auto bg-slate-50 transition-all ${
          showFilterSidebar ? 'md:w-[calc(50%+160px)]' : 'md:w-1/2'
        }`}>
          <div className="p-4 space-y-4">
            {filteredProperties.length === 0 ? (
              <div className="text-center py-16 px-4">
                <div className="w-20 h-20 bg-[#FF6600]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Home className="h-10 w-10 text-[#FF6600]" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">No properties found</h3>
                <p className="text-slate-600 mb-4">Try adjusting your filters to see more results</p>
                <Button
                  onClick={() => {
                    setPriceRange([0, 1000000])
                    setSelectedType("all")
                    setMinBeds(0)
                    setMinBaths(0)
                    setSearchQuery("")
                  }}
                  className="bg-[#FF6600] hover:bg-[#FF6600]/90 text-white"
                >
                  Clear All Filters
                </Button>
              </div>
            ) : (
              filteredProperties.map((property) => (
                <Card 
                  key={property.id}
                  className="group cursor-pointer hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-200 hover:border-[#FF6600]/30 bg-white"
                  onClick={() => handlePropertySelect(property)}
                >
                  {/* Image Section */}
                  <div className="relative h-56 overflow-hidden bg-slate-100">
                    <img
                      src={property.image}
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    {property.featured && (
                      <div className="absolute top-3 left-3 bg-[#FF6600] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                        Featured
                      </div>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleFavorite(property.id)
                      }}
                      className="absolute top-3 right-3 w-10 h-10 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all shadow-lg"
                    >
                      <Heart
                        className={`h-5 w-5 transition-all ${
                          favorites.includes(property.id)
                            ? 'fill-red-500 text-red-500'
                            : 'text-slate-600'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Content Section */}
                  <CardContent className="p-5">
                    {/* Price - Most Prominent */}
                    <div className="mb-3">
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-slate-900">
                          ${(property.price / 1000).toFixed(0)}k
                        </span>
                        <span className="text-sm text-slate-500 font-medium">
                          ${property.pricePerMonth}/mo
                        </span>
                      </div>
                    </div>

                    {/* Title & Location */}
                    <div className="mb-4">
                      <h4 className="font-bold text-lg text-slate-900 mb-2 line-clamp-1 group-hover:text-[#FF6600] transition-colors">
                        {property.title}
                      </h4>
                      <p className="text-sm text-slate-600 flex items-center gap-1.5 line-clamp-1">
                        <MapPin className="h-4 w-4 text-slate-400 flex-shrink-0" />
                        {property.location}
                      </p>
                    </div>

                    {/* Property Features - Clean */}
                    <div className="flex items-center gap-5 pb-4 mb-4 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <Bed className="h-5 w-5 text-slate-400" />
                        <span className="text-sm font-semibold text-slate-700">{property.beds} beds</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Bath className="h-5 w-5 text-slate-400" />
                        <span className="text-sm font-semibold text-slate-700">{property.baths} baths</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Square className="h-5 w-5 text-slate-400" />
                        <span className="text-sm font-semibold text-slate-700">{property.sqft} sqft</span>
                      </div>
                    </div>

                    {/* View Details Button */}
                    <div onClick={(e) => e.stopPropagation()}>
                      <Link href={`/properties/${property.id}`}>
                        <Button 
                          className="w-full h-11 bg-slate-900 hover:bg-[#FF6600] text-white font-semibold shadow-sm hover:shadow-md transition-all"
                        >
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Mobile Map - Bottom Sheet Style */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
        <div className="bg-white border-t border-slate-200 shadow-lg">
          <button 
            onClick={() => {
              const mapSection = document.getElementById('mobile-map')
              if (mapSection) {
                mapSection.classList.toggle('hidden')
              }
            }}
            className="w-full p-3 flex items-center justify-between text-slate-700 hover:bg-slate-50"
          >
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-[#FF6600]" />
              <span className="font-semibold">View Map</span>
            </div>
            <span className="text-xs text-slate-500">Tap to toggle</span>
          </button>
          <div id="mobile-map" className="hidden h-[50vh] border-t border-slate-200">
            <PropertyMap
              properties={filteredProperties}
              selectedProperty={selectedProperty}
              onPropertySelect={handlePropertySelect}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

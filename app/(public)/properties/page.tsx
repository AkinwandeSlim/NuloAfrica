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
  Dumbbell, Shield, Waves, Wind, Zap, Dog, Filter,
  List, Map as MapIcon, Columns3
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "sonner"

// Dynamically import Leaflet Map component to avoid SSR issues
const PropertyMap = dynamic(() => import('@/components/PropertyMapLeaflet'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-slate-100">
      <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
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
    pricePerMonth: 5500,
    beds: 6,
    baths: 7,
    sqft: 6500,
    type: "Villa",
    image: "/contemporary-townhouse-johannesburg.jpg",
    featured: true,
    latitude: 6.4167,
    longitude: 3.4333,
    description: "Ultra-luxury villa on exclusive Banana Island"
  },
  // Abuja Properties
  {
    id: 5,
    title: "Executive Mansion Maitama",
    location: "Maitama, Abuja, Nigeria",
    price: 720000,
    pricePerMonth: 4200,
    beds: 5,
    baths: 6,
    sqft: 5800,
    type: "Mansion",
    image: "/luxury-apartment-lagos.jpg",
    featured: true,
    latitude: 9.0820,
    longitude: 7.4951,
    description: "Prestigious mansion in Abuja's most exclusive district"
  },
  {
    id: 6,
    title: "Modern Apartment Wuse 2",
    location: "Wuse 2, Abuja, Nigeria",
    price: 280000,
    pricePerMonth: 1600,
    beds: 3,
    baths: 3,
    sqft: 2400,
    type: "Apartment",
    image: "/apartment-accra.jpg",
    featured: false,
    latitude: 9.0643,
    longitude: 7.4820,
    description: "Contemporary apartment in central business district"
  },
]

type ViewMode = 'list' | 'map' | 'split'

export default function PropertiesPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user } = useAuth()
  
  const [searchQuery, setSearchQuery] = useState("")
  const [favorites, setFavorites] = useState<number[]>([])
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [showFilterSidebar, setShowFilterSidebar] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('split')
  
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

    const isFavorite = favorites.includes(id)
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
    )

    if (isFavorite) {
      toast.info("Removed from favorites")
    } else {
      toast.success("Added to favorites")
    }
  }

  const handlePropertySelect = (property: Property | null) => {
    if (property) {
      const lat = Number(property.latitude)
      const lng = Number(property.longitude)
      
      const hasValidCoords = !isNaN(lat) && !isNaN(lng) && 
                            lat >= -90 && lat <= 90 && 
                            lng >= -180 && lng <= 180
      
      if (hasValidCoords) {
        setSelectedProperty({ ...property, latitude: lat, longitude: lng })
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
    'Furnished', 'Unfurnished', 'Serviced', 'Newly Built',
    'Gated Estate', 'Close to School', 'Close to Market', 'Waterfront'
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

  const formatPrice = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`
    return `$${value}`
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Top Filter Bar - Fixed */}
      <div className="fixed top-16 left-0 right-0 z-40 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-[1920px] mx-auto px-4 lg:px-6 py-3">
          <div className="flex items-center justify-between gap-3">
            {/* Left: Search & Filters */}
            <div className="flex items-center gap-3 flex-1">
              {/* Filter Toggle */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilterSidebar(!showFilterSidebar)}
                className="flex items-center gap-2 h-10 px-4 border-slate-300 hover:bg-slate-50"
              >
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">Filters</span>
              </Button>

              {/* Search Input */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search location, property..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-10 border-slate-300"
                />
              </div>

              {/* Results Count */}
              <span className="hidden md:inline text-sm font-medium text-slate-600">
                {filteredProperties.length} properties
              </span>
            </div>

            {/* Right: View Toggle & Sort */}
            <div className="flex items-center gap-3">
              {/* View Mode Toggle */}
              <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-white text-orange-600 shadow-sm' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="List View"
                >
                  <List className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('split')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'split' 
                      ? 'bg-white text-orange-600 shadow-sm' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Split View"
                >
                  <Columns3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'map' 
                      ? 'bg-white text-orange-600 shadow-sm' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Map View"
                >
                  <MapIcon className="h-4 w-4" />
                </button>
              </div>

              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="h-10 px-3 border border-slate-300 rounded-lg text-sm font-medium bg-white hover:bg-slate-50 cursor-pointer"
              >
                <option value="recent">Most Recent</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Below Fixed Header */}
      <div className="pt-[76px] flex h-screen">
        {/* Filter Sidebar */}
        {showFilterSidebar && (
          <div className="w-80 border-r border-slate-200 bg-white overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">Filters</h3>
                <button
                  onClick={() => setShowFilterSidebar(false)}
                  className="p-1 hover:bg-slate-100 rounded-lg"
                >
                  <X className="h-5 w-5 text-slate-500" />
                </button>
              </div>

              {/* Price Range */}
              <div>
                <label className="text-sm font-semibold text-slate-900 mb-3 block">
                  Price Range
                </label>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Min: {formatPrice(priceRange[0])}</span>
                    <span className="text-slate-600">Max: {formatPrice(priceRange[1])}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1000000"
                    step="10000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Property Type */}
              <div>
                <label className="text-sm font-semibold text-slate-900 mb-3 block">
                  Property Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {propertyTypes.map(type => (
                    <button
                      key={type}
                      onClick={() => setSelectedType(type)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        selectedType === type
                          ? 'bg-orange-500 text-white'
                          : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      {type === 'all' ? 'All Types' : type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bedrooms */}
              <div>
                <label className="text-sm font-semibold text-slate-900 mb-3 block">
                  Bedrooms
                </label>
                <div className="flex gap-2">
                  {[0, 1, 2, 3, 4, 5].map(num => (
                    <button
                      key={num}
                      onClick={() => setMinBeds(num)}
                      className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        minBeds === num
                          ? 'bg-orange-500 text-white'
                          : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      {num === 0 ? 'Any' : `${num}+`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bathrooms */}
              <div>
                <label className="text-sm font-semibold text-slate-900 mb-3 block">
                  Bathrooms
                </label>
                <div className="flex gap-2">
                  {[0, 1, 2, 3, 4].map(num => (
                    <button
                      key={num}
                      onClick={() => setMinBaths(num)}
                      className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        minBaths === num
                          ? 'bg-orange-500 text-white'
                          : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      {num === 0 ? 'Any' : `${num}+`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear Button */}
              <Button
                variant="outline"
                onClick={() => {
                  setPriceRange([0, 1000000])
                  setSelectedType("all")
                  setMinBeds(0)
                  setMinBaths(0)
                  setSearchQuery("")
                }}
                className="w-full"
              >
                Clear All Filters
              </Button>
            </div>
          </div>
        )}

        {/* Listings Column - Scrollable */}
        <div className={`flex-1 overflow-y-auto bg-slate-50 ${
          viewMode === 'map' ? 'hidden' : ''
        } ${viewMode === 'split' ? 'w-1/2' : 'w-full'}`}>
          <div className="p-4">
            {filteredProperties.length === 0 ? (
              <div className="text-center py-16">
                <Home className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">No properties found</h3>
                <p className="text-slate-600">Try adjusting your filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filteredProperties.map((property) => (
                  <Card 
                    key={property.id}
                    className="group cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden border border-slate-200 hover:border-orange-300 bg-white"
                    onClick={() => handlePropertySelect(property)}
                    onMouseEnter={() => handlePropertySelect(property)}
                  >
                    {/* Image */}
                    <div className="relative w-full h-56 overflow-hidden bg-slate-100">
                      <img
                        src={property.image}
                        alt={property.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      {property.featured && (
                        <div className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                          Featured
                        </div>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleFavorite(property.id)
                        }}
                        className="absolute top-3 right-3 w-9 h-9 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center hover:scale-110 transition-all shadow-lg"
                      >
                        <Heart
                          className={`h-4 w-4 transition-all ${
                            favorites.includes(property.id)
                              ? 'fill-red-500 text-red-500'
                              : 'text-slate-600'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Content */}
                    <CardContent className="p-4">
                      {/* Price */}
                      <div className="mb-2">
                        <div className="flex items-baseline gap-2">
                          <span className="text-xl font-bold text-slate-900">
                            ${(property.price / 1000).toFixed(0)}k
                          </span>
                          <span className="text-xs text-slate-500">
                            ${property.pricePerMonth}/mo
                          </span>
                        </div>
                      </div>

                      {/* Title & Location */}
                      <h4 className="font-semibold text-base text-slate-900 mb-1 line-clamp-1 group-hover:text-orange-600 transition-colors">
                        {property.title}
                      </h4>
                      <p className="text-sm text-slate-600 flex items-center gap-1 mb-3 line-clamp-1">
                        <MapPin className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                        {property.location}
                      </p>

                      {/* Features */}
                      <div className="flex items-center gap-4 pb-3 mb-3 border-b border-slate-100">
                        <div className="flex items-center gap-1.5">
                          <Bed className="h-4 w-4 text-slate-400" />
                          <span className="text-xs font-medium text-slate-700">{property.beds}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Bath className="h-4 w-4 text-slate-400" />
                          <span className="text-xs font-medium text-slate-700">{property.baths}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Square className="h-4 w-4 text-slate-400" />
                          <span className="text-xs font-medium text-slate-700">{property.sqft}</span>
                        </div>
                      </div>

                      {/* View Button */}
                      <div onClick={(e) => e.stopPropagation()}>
                        <Link href={`/properties/${property.id}`}>
                          <Button 
                            size="sm"
                            className="w-full h-9 bg-slate-900 hover:bg-orange-500 text-white font-semibold text-sm"
                          >
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Map Column - Sticky/Fixed */}
        {(viewMode === 'split' || viewMode === 'map') && (
          <div className={`${viewMode === 'map' ? 'w-full' : 'w-1/2'} h-[calc(100vh-76px)] sticky top-[76px] border-l border-slate-200`}>
            <PropertyMap
              properties={filteredProperties}
              selectedProperty={selectedProperty}
              onPropertySelect={handlePropertySelect}
            />
          </div>
        )}
      </div>
    </div>
  )
}

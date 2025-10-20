"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import dynamic from 'next/dynamic'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { 
  MapPin, Bed, Bath, Square, Heart, Search, 
  Home, Loader2, X, SlidersHorizontal, Wifi, Car, 
  Dumbbell, Shield, Waves, Wind, Zap, Dog, Filter,
  List, Map as MapIcon, Columns3, ChevronDown, DollarSign,
  Star, Bookmark, MoreHorizontal, Tag, Eye,
  Calendar, TrendingDown, CheckCircle2
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "sonner"
import { PropertyFiltersModal } from "@/components/PropertyFiltersModal"
import { SaveFavoriteModal } from "@/components/SaveFavoriteModalSimple"

// Dynamically import Mapbox component to avoid SSR issues
const PropertyMap = dynamic(() => import('@/components/PropertyMapbox'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-slate-900">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500 mx-auto mb-3" />
        <p className="text-white font-medium">Loading interactive map...</p>
      </div>
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
  // Phase 2 enhancements
  viewingNow?: number
  lastUpdated?: string
  landlord?: {
    name: string
    avatar?: string
    rating: number
    reviews: number
  }
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
    description: "Stunning penthouse with ocean views and modern amenities",
    viewingNow: 5,
    lastUpdated: "2 hours ago",
    landlord: {
      name: "Chinedu O.",
      rating: 4.8,
      reviews: 23
    }
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
    description: "Spacious duplex in gated estate with 24/7 security",
    viewingNow: 3,
    lastUpdated: "1 hour ago",
    landlord: {
      name: "Amaka N.",
      rating: 4.9,
      reviews: 31
    }
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
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [showSaveFavoriteModal, setShowSaveFavoriteModal] = useState(false)
  const [pendingFavoriteId, setPendingFavoriteId] = useState<number | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('split')
  const [showPriceDropdown, setShowPriceDropdown] = useState(false)
  const [showBedsDropdown, setShowBedsDropdown] = useState(false)
  const [showBathsDropdown, setShowBathsDropdown] = useState(false)
  const [showTypeDropdown, setShowTypeDropdown] = useState(false)
  const [showMoreDropdown, setShowMoreDropdown] = useState(false)
  
  // Filters
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000])
  const [selectedType, setSelectedType] = useState<string>("all")
  const [minBeds, setMinBeds] = useState<number>(0)
  const [minBaths, setMinBaths] = useState<number>(0)
  const [sortBy, setSortBy] = useState<'recent' | 'price-low' | 'price-high'>('recent')
  
  // Advanced Filters
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([])

  // REMOVED: Problematic click-outside handler
  // Dropdowns now close only via Apply/Reset buttons or clicking another filter

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
    // If not logged in, show the save favorite modal
    if (!user) {
      setPendingFavoriteId(id)
      setShowSaveFavoriteModal(true)
      return
    }

    // If logged in, toggle favorite normally
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

  // Handle save favorite with email (quick signup)
  const handleSaveWithEmail = async (email: string) => {
    // TODO: Implement quick signup API call
    // For now, save to localStorage and show success
    if (pendingFavoriteId) {
      const localFavorites = JSON.parse(localStorage.getItem('favorites') || '[]')
      localFavorites.push(pendingFavoriteId)
      localStorage.setItem('favorites', JSON.stringify(localFavorites))
      localStorage.setItem('userEmail', email)
      
      setFavorites(prev => [...prev, pendingFavoriteId])
      toast.success("Property saved! Check your email to complete signup.")
    }
    setShowSaveFavoriteModal(false)
    setPendingFavoriteId(null)
  }

  // Handle continue browsing without account
  const handleContinueBrowsing = () => {
    // Save to localStorage only
    if (pendingFavoriteId) {
      const localFavorites = JSON.parse(localStorage.getItem('favorites') || '[]')
      localFavorites.push(pendingFavoriteId)
      localStorage.setItem('favorites', JSON.stringify(localFavorites))
      
      setFavorites(prev => [...prev, pendingFavoriteId])
      toast.success("Property saved locally")
    }
    setShowSaveFavoriteModal(false)
    setPendingFavoriteId(null)
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
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Modern Inline Filter Bar - Fixed */}
      <div className="fixed top-16 left-0 right-0 z-[100] bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-[1920px] mx-auto px-4 lg:px-6">
          <div className="flex items-center gap-3 py-3">
            {/* Simple Filter Chips - No Dropdowns! */}
            <div className="flex items-center gap-2 flex-1 overflow-x-auto scrollbar-hide">
              
              {/* All Filters Button - Opens Modal */}
              <button
                onClick={() => setShowFilterModal(true)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap border-2 ${
                  minBeds > 0 || minBaths > 0 || selectedType !== 'all' || priceRange[0] > 0 || priceRange[1] < 1000000
                    ? 'bg-orange-500 text-white border-orange-500 hover:bg-orange-600'
                    : 'bg-white text-slate-700 border-slate-300 hover:border-orange-500'
                }`}
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span>All Filters</span>
                {(minBeds > 0 || minBaths > 0 || selectedType !== 'all' || priceRange[0] > 0 || priceRange[1] < 1000000) && (
                  <span className="ml-1 px-2 py-0.5 bg-white/20 rounded-full text-xs font-bold">
                    {[minBeds > 0, minBaths > 0, selectedType !== 'all', priceRange[0] > 0 || priceRange[1] < 1000000].filter(Boolean).length}
                  </span>
                )}
              </button>

              {/* Active Filter Tags */}
              {minBeds > 0 && (
                <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-orange-50 text-orange-600 text-sm font-medium border border-orange-200">
                  <Bed className="h-3.5 w-3.5" />
                  <span>{minBeds}+ beds</span>
                  <button onClick={() => setMinBeds(0)} className="ml-1 hover:bg-orange-100 rounded-full p-0.5">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
              
              {minBaths > 0 && (
                <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-orange-50 text-orange-600 text-sm font-medium border border-orange-200">
                  <Bath className="h-3.5 w-3.5" />
                  <span>{minBaths}+ baths</span>
                  <button onClick={() => setMinBaths(0)} className="ml-1 hover:bg-orange-100 rounded-full p-0.5">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
              
              {selectedType !== 'all' && (
                <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-orange-50 text-orange-600 text-sm font-medium border border-orange-200">
                  <Home className="h-3.5 w-3.5" />
                  <span>{selectedType}</span>
                  <button onClick={() => setSelectedType('all')} className="ml-1 hover:bg-orange-100 rounded-full p-0.5">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
              
              {(priceRange[0] > 0 || priceRange[1] < 1000000) && (
                <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-orange-50 text-orange-600 text-sm font-medium border border-orange-200">
                  <DollarSign className="h-3.5 w-3.5" />
                  <span>{formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}</span>
                  <button onClick={() => setPriceRange([0, 1000000])} className="ml-1 hover:bg-orange-100 rounded-full p-0.5">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}

              {/* Quick Toggle Chips */}
              <button
                onClick={() => {
                  const isActive = selectedAmenities.includes('pets')
                  const amenities = isActive
                    ? selectedAmenities.filter(a => a !== 'pets')
                    : [...selectedAmenities, 'pets']
                  setSelectedAmenities(amenities)
                }}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap border ${
                  selectedAmenities.includes('pets')
                    ? 'bg-orange-500 text-white border-orange-500 hover:bg-orange-600'
                    : 'bg-white text-slate-700 border-slate-300 hover:border-orange-500'
                }`}
              >
                <Dog className="h-3.5 w-3.5" />
                <span>Pets</span>
              </button>

              <button
                onClick={() => {
                  const isActive = selectedPreferences.includes('Deals')
                  const prefs = isActive
                    ? selectedPreferences.filter(p => p !== 'Deals')
                    : [...selectedPreferences, 'Deals']
                  setSelectedPreferences(prefs)
                }}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap border ${
                  selectedPreferences.includes('Deals')
                    ? 'bg-orange-500 text-white border-orange-500 hover:bg-orange-600'
                    : 'bg-white text-slate-700 border-slate-300 hover:border-orange-500'
                }`}
              >
                <Tag className="h-3.5 w-3.5" />
                <span>Deals</span>
              </button>

              {/* Clear All */}
              {(minBeds > 0 || minBaths > 0 || selectedType !== 'all' || priceRange[0] > 0 || priceRange[1] < 1000000 || selectedAmenities.length > 0 || selectedPreferences.length > 0) && (
                <button
                  onClick={() => {
                    setMinBeds(0)
                    setMinBaths(0)
                    setSelectedType('all')
                    setPriceRange([0, 1000000])
                    setSelectedAmenities([])
                    setSelectedPreferences([])
                    toast.success('All filters cleared')
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all whitespace-nowrap"
                >
                  <X className="h-3.5 w-3.5" />
                  <span>Clear all</span>
                </button>
              )}
            </div>

            {/* Right: View Toggle & Results */}
            <div className="flex items-center gap-2 ml-auto">
              {/* Results Count */}
              <span className="hidden md:inline text-xs font-medium text-slate-600 whitespace-nowrap">
                {filteredProperties.length} results
              </span>

              {/* View Mode Toggle - Compact */}
              <div className="flex items-center gap-0.5 bg-slate-100 rounded-lg p-0.5">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-md transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-white text-orange-600 shadow-sm' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="List"
                >
                  <List className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setViewMode('split')}
                  className={`p-1.5 rounded-md transition-colors ${
                    viewMode === 'split' 
                      ? 'bg-white text-orange-600 shadow-sm' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Split"
                >
                  <Columns3 className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`p-1.5 rounded-md transition-colors ${
                    viewMode === 'map' 
                      ? 'bg-white text-orange-600 shadow-sm' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Map"
                >
                  <MapIcon className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Modal */}
      <PropertyFiltersModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        minBeds={minBeds}
        setMinBeds={setMinBeds}
        minBaths={minBaths}
        setMinBaths={setMinBaths}
        selectedAmenities={selectedAmenities}
        setSelectedAmenities={setSelectedAmenities}
        selectedPreferences={selectedPreferences}
        setSelectedPreferences={setSelectedPreferences}
        onClearAll={() => {
          setPriceRange([0, 1000000])
          setSelectedType("all")
          setMinBeds(0)
          setMinBaths(0)
          setSearchQuery("")
          setSelectedAmenities([])
          setSelectedPreferences([])
        }}
        onApply={() => {
          // Filters are already applied in real-time
        }}
        resultsCount={filteredProperties.length}
      />

      {/* Main Content - Below Fixed Navbar + Filter Bar */}
      <div className="fixed top-[124px] left-0 right-0 bottom-0 overflow-y-scroll overflow-x-hidden bg-slate-50">
        <style jsx global>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>

        {/* Wrapper for both map and listings */}
        <div className="flex relative">
          {/* Listings Column - Content that scrolls (LEFT SIDE - 60%) */}
          <div className={`${viewMode === 'list' ? 'w-full' : viewMode === 'map' ? 'hidden' : 'w-[60%]'} overflow-y-auto`}>
            <div className="p-6">
              {/* Header */}
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Apartments for Rent</h2>
                <p className="text-slate-600">{filteredProperties.length} properties available</p>
              </div>

              {/* Results */}
              {filteredProperties.length === 0 ? (
              <div className="text-center py-12">
                <Home className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">No properties found</h3>
                <p className="text-slate-600 mb-6">Try adjusting your filters to see more results</p>
                <Button 
                  onClick={() => {
                    setPriceRange([0, 1000000])
                    setSelectedType("all")
                    setMinBeds(0)
                    setMinBaths(0)
                  }}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-lg font-medium"
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear All Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {filteredProperties.map((property) => (
                  <Link 
                    key={property.id}
                    href={`/properties/${property.id}`}
                  >
                    <Card 
                      className="group cursor-pointer hover:shadow-2xl transition-all duration-500 overflow-hidden border border-slate-200/60 hover:border-orange-400 bg-white rounded-2xl hover:-translate-y-1"
                      onMouseEnter={() => handlePropertySelect(property)}
                    >
                    {/* Image */}
                    <div className="relative w-full h-48 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-50">
                      <img
                        src={property.image}
                        alt={property.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      
                      {/* Gradient Overlay for better text readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      {/* Social Proof - People Viewing */}
                      {property.viewingNow && property.viewingNow > 0 && (
                        <div className="absolute top-4 left-4 bg-gradient-to-r from-orange-500 to-orange-600 backdrop-blur-md text-white text-xs font-bold px-3 py-2 rounded-full flex items-center gap-1.5 shadow-lg z-10 animate-pulse">
                          <Eye className="h-3.5 w-3.5" />
                          {property.viewingNow} viewing now
                        </div>
                      )}
                      
                      {property.featured && !property.viewingNow && (
                        <div className="absolute top-4 left-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg">
                          ⭐ Featured
                        </div>
                      )}
                      
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          toggleFavorite(property.id)
                        }}
                        className="absolute top-4 right-4 w-10 h-10 bg-white/95 backdrop-blur-md rounded-full flex items-center justify-center hover:scale-110 transition-all shadow-xl z-10 border border-white/20"
                      >
                        <Heart
                          className={`h-4.5 w-4.5 transition-all ${
                            favorites.includes(property.id)
                              ? 'fill-red-500 text-red-500 scale-110'
                              : 'text-slate-600 hover:text-red-400'
                          }`}
                        />
                      </button>
                      
                      {/* Last Updated */}
                      {property.lastUpdated && (
                        <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-md text-white text-xs font-medium px-3 py-1.5 rounded-full shadow-lg">
                          ⏰ Updated {property.lastUpdated}
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <CardContent className="p-4">
                      {/* Price */}
                      <div className="mb-2">
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                            ${(property.price / 1000).toFixed(0)}k
                          </span>
                          <span className="text-sm text-slate-500 font-medium">
                            ${property.pricePerMonth}/mo
                          </span>
                        </div>
                      </div>

                      {/* Nulo Savings Badge */}
                      <div className="bg-gradient-to-r from-green-50 via-emerald-50 to-green-50 border border-green-200/80 rounded-xl px-3 py-2 mb-3 shadow-sm">
                        <div className="flex items-center gap-1.5 mb-1">
                          <TrendingDown className="h-4 w-4 text-green-600" />
                          <p className="text-xs font-bold text-green-700">
                            Pay ${Math.round(property.pricePerMonth * 0.95)}/mo with Nulo
                          </p>
                        </div>
                        <p className="text-xs text-green-600 font-semibold">
                          💰 Save ${Math.round(property.pricePerMonth * 0.05 * 12)}/year
                        </p>
                      </div>

                      {/* Title & Location */}
                      <h4 className="font-bold text-lg text-slate-900 mb-1.5 line-clamp-1 group-hover:text-orange-600 transition-colors leading-tight">
                        {property.title}
                      </h4>
                      <p className="text-sm text-slate-600 flex items-center gap-1.5 mb-3 line-clamp-1">
                        <MapPin className="h-4 w-4 text-slate-400 flex-shrink-0" />
                        <span className="font-medium">{property.location}</span>
                      </p>

                      {/* Features */}
                      <div className="flex items-center gap-4 pb-3 mb-3 border-b border-slate-100">
                        <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-lg">
                          <Bed className="h-4.5 w-4.5 text-orange-500" />
                          <span className="text-sm font-bold text-slate-900">{property.beds}</span>
                          <span className="text-xs text-slate-500">beds</span>
                        </div>
                        <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-lg">
                          <Bath className="h-4.5 w-4.5 text-blue-500" />
                          <span className="text-sm font-bold text-slate-900">{property.baths}</span>
                          <span className="text-xs text-slate-500">baths</span>
                        </div>
                        <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-lg">
                          <Square className="h-4.5 w-4.5 text-green-500" />
                          <span className="text-sm font-bold text-slate-900">{property.sqft}</span>
                        </div>
                      </div>

                      {/* Landlord Info */}
                      {property.landlord && (
                        <div className="flex items-center gap-3 mb-3 pb-3 border-b border-slate-100 bg-gradient-to-r from-slate-50/50 to-transparent -mx-4 px-4 py-2.5">
                          <Avatar className="h-9 w-9 ring-2 ring-orange-100">
                            <AvatarImage src={property.landlord.avatar} />
                            <AvatarFallback className="bg-gradient-to-br from-orange-400 to-orange-600 text-white text-sm font-bold">
                              {property.landlord.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-900 truncate">
                              {property.landlord.name}
                            </p>
                            <p className="text-xs text-slate-500">Property Owner</p>
                          </div>
                          <div className="flex items-center gap-1 bg-yellow-50 px-2.5 py-1.5 rounded-lg border border-yellow-200">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-bold text-slate-900">{property.landlord.rating}</span>
                            <span className="text-xs text-slate-600">({property.landlord.reviews})</span>
                          </div>
                        </div>
                      )}

                      {/* Quick Action Buttons */}
                      <div className="grid grid-cols-2 gap-3">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            toast.info("Checking availability...")
                          }}
                          className="text-xs h-10 font-semibold border-2 border-slate-200 hover:border-green-500 hover:text-green-600 hover:bg-green-50 transition-all duration-300 rounded-xl shadow-sm hover:shadow-md"
                        >
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Check Availability
                        </Button>
                        <Button 
                          size="sm"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            toast.success("Opening tour booking...")
                          }}
                          className="text-xs h-10 font-semibold bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white transition-all duration-300 rounded-xl shadow-md hover:shadow-lg"
                        >
                          <Calendar className="h-4 w-4 mr-2" />
                          Tour
                        </Button>
                      </div>

                    </CardContent>
                  </Card>
                  </Link>
                ))}
              </div>
              )}
            </div>
          </div>

          {/* Map Column - Sticky Position (RIGHT SIDE - 40%) */}
          {(viewMode === 'split' || viewMode === 'map') && (
            <div className={`${viewMode === 'map' ? 'w-full' : 'w-[40%]'} h-screen sticky top-0 bg-white`}>
            {/* Map Header */}
            <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-white/95 to-transparent p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                    <MapIcon className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Map View</h3>
                    <p className="text-xs text-slate-600">{filteredProperties.length} properties</p>
                  </div>
                </div>
                {selectedProperty && (
                  <div className="bg-orange-50 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-orange-200">
                    <p className="text-xs font-medium text-orange-700">{selectedProperty.title}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Map Container */}
            <div className="w-full h-full">
              <PropertyMap
                properties={filteredProperties}
                selectedProperty={selectedProperty}
                onPropertySelect={handlePropertySelect}
              />
            </div>

            {/* Map Footer - Property Count */}
            <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between">
              <div className="bg-white rounded-lg shadow-lg px-4 py-2 border border-slate-200">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-semibold text-slate-900">
                    {filteredProperties.length} {filteredProperties.length === 1 ? 'property' : 'properties'} shown
                  </span>
                </div>
              </div>
            </div>
            </div>
          )}
        </div>
      </div>

      {/* Save Favorite Modal */}
      <SaveFavoriteModal
        isOpen={showSaveFavoriteModal}
        onClose={() => {
          setShowSaveFavoriteModal(false)
          setPendingFavoriteId(null)
        }}
        onSaveWithEmail={handleSaveWithEmail}
        onContinueBrowsing={handleContinueBrowsing}
        propertyTitle={
          pendingFavoriteId 
            ? propertiesData.find(p => p.id === pendingFavoriteId)?.title || "this property"
            : "this property"
        }
      />
    </div>
  )
}

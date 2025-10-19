import Link from "next/link"
import { Search, MapPin, Building2, ChevronDown, SlidersHorizontal, Home, Navigation, Bed, Bath, Maximize2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface SearchBarProps {
  location: string
  setLocation: (location: string) => void
  priceRange: [number, number]
  setPriceRange: (range: [number, number]) => void
  propertyType: string
  setPropertyType: (type: string) => void
  showAdvanced: boolean
  setShowAdvanced: (show: boolean) => void
  locationInputRef: React.RefObject<HTMLInputElement>
  userType?: 'rental' | 'landlord'
}

const propertyTypes = ['Property Type', 'Apartment', 'House', 'Villa', 'Penthouse', 'Studio', 'Loft']

const formatPrice = (value: number) => {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`
  return `$${value}`
}

// Popular locations for suggestions
const popularLocations = [
  { name: "Lekki, Lagos", properties: 450 },
  { name: "Victoria Island, Lagos", properties: 320 },
  { name: "Ikoyi, Lagos", properties: 280 },
  { name: "Abuja Central", properties: 210 },
  { name: "Port Harcourt GRA", properties: 150 },
]

export function SearchBar({
  location,
  setLocation,
  priceRange,
  setPriceRange,
  propertyType,
  setPropertyType,
  showAdvanced,
  setShowAdvanced,
  locationInputRef,
  userType = 'rental'
}: SearchBarProps) {
  const [isLocating, setIsLocating] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [filteredSuggestions, setFilteredSuggestions] = useState(popularLocations)
  const [activeIndex, setActiveIndex] = useState<number>(-1)
  const suggestionsId = 'search-suggestions'
  const inputId = 'search-location-input'
  const suggestionsRef = useRef<HTMLDivElement | null>(null)
  const [bedrooms, setBedrooms] = useState<string>('Any')
  const [bathrooms, setBathrooms] = useState<string>('Any')
  const [minSize, setMinSize] = useState<string>('')

  // Filter suggestions based on input
  useEffect(() => {
    if (location) {
      const filtered = popularLocations.filter(loc =>
        loc.name.toLowerCase().includes(location.toLowerCase())
      )
      setFilteredSuggestions(filtered)
    } else {
      setFilteredSuggestions(popularLocations)
    }
  }, [location])

  // Reset active index when suggestions change
  useEffect(() => {
    setActiveIndex(-1)
  }, [filteredSuggestions, showSuggestions])

  const handleUseMyLocation = () => {
    setIsLocating(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Use reverse geocoding to get location name
          fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`)
            .then(res => res.json())
            .then(data => {
              const locationName = data.address?.city || data.address?.town || data.address?.suburb || 'Current Location'
              setLocation(locationName)
              setIsLocating(false)
            })
            .catch(() => {
              setLocation('Current Location')
              setIsLocating(false)
            })
        },
        () => {
          alert('Unable to retrieve your location')
          setIsLocating(false)
        }
      )
    }
  }

  const handleClear = () => {
    setLocation('')
    setShowSuggestions(false)
    setActiveIndex(-1)
    setTimeout(() => locationInputRef.current?.focus(), 0)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex(prev => Math.min(prev + 1, filteredSuggestions.length - 1))
      setShowSuggestions(true)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex(prev => Math.max(prev - 1, 0))
    } else if (e.key === 'Enter') {
      if (activeIndex >= 0 && filteredSuggestions[activeIndex]) {
        e.preventDefault()
        setLocation(filteredSuggestions[activeIndex].name)
        setShowSuggestions(false)
        setActiveIndex(-1)
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
      setActiveIndex(-1)
    }
  }

  return (
    <div className="relative max-w-5xl mx-auto group">
      {/* Subtle Glow Effect */}
      <div className="absolute -inset-2 bg-gradient-to-r from-orange-500/10 via-orange-400/15 to-orange-500/10 rounded-3xl blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-700" />
      
      {/* Premium Card */}
      <Card className="relative bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] hover:border-orange-200 overflow-hidden">
        {/* Subtle Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-400/40 to-transparent" />
        
      <CardContent className="relative p-5 sm:p-8">
        {/* Main Search Row */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* Location Input - Premium Design */}
          <div className="flex-1 relative group">
            <div className="absolute left-5 top-1/2 -translate-y-1/2 z-10">
              <MapPin className="h-5 w-5 text-orange-500 group-focus-within:text-orange-600 transition-colors" />
            </div>
            <label htmlFor={inputId} className="sr-only">Search location</label>
            <input
              ref={locationInputRef}
              id={inputId}
              role="combobox"
              aria-expanded={showSuggestions}
              aria-controls={suggestionsId}
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              onKeyDown={handleKeyDown}
              placeholder="Where do you want to live?"
              className="w-full h-16 pl-14 pr-32 rounded-2xl border-2 border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-500/10 transition-all font-medium text-base shadow-sm hover:border-slate-300 hover:shadow-md"
              autoComplete="off"
              aria-label="Search location"
            />
            {/* Clear input button */}
            {location && (
              <button
                onClick={handleClear}
                aria-label="Clear search"
                className="absolute right-28 top-1/2 -translate-y-1/2 z-20 h-8 w-8 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 transition-colors text-lg font-semibold"
                type="button"
              >
                ×
              </button>
            )}
            {/* Use My Location Button */}
            <button
              onClick={handleUseMyLocation}
              disabled={isLocating}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 px-4 py-2.5 bg-orange-50 hover:bg-orange-500 text-orange-600 hover:text-white rounded-xl text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed z-10 border border-orange-200 hover:border-orange-500 shadow-sm hover:shadow-md"
              aria-label="Use my current location"
            >
              <Navigation className={`h-4 w-4 ${isLocating ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Near Me</span>
            </button>

            {/* Location Suggestions Dropdown - Premium */}
            <AnimatePresence>
              {showSuggestions && filteredSuggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.12)] border border-slate-200 overflow-hidden z-50"
                  id={suggestionsId}
                  role="listbox"
                  ref={suggestionsRef}
                >
                  <div className="p-2">
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">Popular Locations</div>
                    {filteredSuggestions.map((loc, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setLocation(loc.name)
                          setShowSuggestions(false)
                          setActiveIndex(-1)
                        }}
                        role="option"
                        aria-selected={activeIndex === index}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all text-left group ${
                          activeIndex === index ? 'bg-orange-50' : 'hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${activeIndex === index ? 'bg-orange-500' : 'bg-orange-50'}`}>
                            <MapPin className={`h-5 w-5 transition-colors ${activeIndex === index ? 'text-white' : 'text-orange-500'}`} />
                          </div>
                          <span className={`text-sm font-medium transition-colors ${activeIndex === index ? 'text-orange-600' : 'text-slate-700'}`}>{loc.name}</span>
                        </div>
                        <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">{loc.properties}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Property Type Dropdown - Premium */}
          <div className="md:w-56 relative group">
            <div className="absolute left-5 top-1/2 -translate-y-1/2 z-10">
              <Home className="h-5 w-5 text-orange-500 group-focus-within:text-orange-600 transition-colors" />
            </div>
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="w-full h-16 pl-14 pr-12 rounded-2xl border-2 border-slate-200 bg-white text-slate-900 focus:border-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-500/10 transition-all appearance-none cursor-pointer font-medium text-base shadow-sm hover:border-slate-300 hover:shadow-md"
              aria-label="Select property type"
            >
              {propertyTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          {/* Search Button - Premium CTA */}
          <Link 
            href={`/properties?location=${encodeURIComponent(location)}&type=${propertyType !== 'Property Type' ? propertyType : ''}&minPrice=${priceRange[0]}&maxPrice=${priceRange[1]}&bedrooms=${bedrooms !== 'Any' ? bedrooms : ''}&bathrooms=${bathrooms !== 'Any' ? bathrooms : ''}&minSize=${minSize}&userType=${userType}`} 
            className="w-full md:w-auto"
          >
            <Button
              type="button"
              className="relative w-full md:w-auto h-16 px-10 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-2xl font-bold text-base transition-all duration-300 shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30 hover:scale-[1.02] overflow-hidden group"
              aria-label="Search for properties"
            >
              {/* Shimmer Effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <Search className="relative mr-2.5 h-5 w-5" />
              <span className="relative">Search</span>
            </Button>
          </Link>
        </div>

        {/* Advanced Filters Toggle */}
        <div className="mt-4 flex items-center justify-center">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all font-medium"
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span>{showAdvanced ? 'Hide Filters' : 'More Filters'}</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Advanced Filters - Enhanced */}
        {showAdvanced && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-6 pt-6 border-t border-slate-200"
          >
            <div className="space-y-6">
              {/* Price Range */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="text-sm font-semibold text-slate-700">Price Range</label>
                  <span className="text-sm font-bold text-orange-600">
                    {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
                  </span>
                </div>
                <div className="relative">
                  <div className="relative h-2.5 bg-slate-100 rounded-full">
                    <div 
                      className="absolute h-2.5 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full transition-all duration-300"
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
                    className="absolute w-full h-2.5 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-3 [&::-webkit-slider-thumb]:border-orange-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:transition-transform"
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
                    className="absolute w-full h-2.5 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-3 [&::-webkit-slider-thumb]:border-orange-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:transition-transform"
                  />
                </div>
                <div className="flex justify-between mt-3 text-xs font-medium text-slate-500">
                  <span>$0</span>
                  <span>$250K</span>
                  <span>$500K</span>
                  <span>$750K</span>
                  <span>$1M+</span>
                </div>
              </div>

              {/* Bedrooms & Bathrooms Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Bedrooms */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-4">
                    <Bed className="h-4 w-4 text-orange-500" />
                    Bedrooms
                  </label>
                  <div className="flex gap-2">
                    {['Any', '1', '2', '3', '4', '5+'].map((num) => (
                      <button
                        key={num}
                        onClick={() => setBedrooms(num)}
                        className={`flex-1 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                          bedrooms === num
                            ? 'bg-orange-500 text-white shadow-md'
                            : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bathrooms */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-4">
                    <Bath className="h-4 w-4 text-orange-500" />
                    Bathrooms
                  </label>
                  <div className="flex gap-2">
                    {['Any', '1', '2', '3', '4+'].map((num) => (
                      <button
                        key={num}
                        onClick={() => setBathrooms(num)}
                        className={`flex-1 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                          bathrooms === num
                            ? 'bg-orange-500 text-white shadow-md'
                            : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Minimum Size */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-4">
                  <Maximize2 className="h-4 w-4 text-orange-500" />
                  Minimum Size (sq ft)
                </label>
                <input
                  type="number"
                  value={minSize}
                  onChange={(e) => setMinSize(e.target.value)}
                  placeholder="e.g. 1000"
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-500/10 transition-all font-medium shadow-sm"
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Quick Filter Pills */}
        <div className="mt-8 flex flex-wrap gap-3 justify-center">
          <Link href="/properties?type=Apartment">
            <span className="inline-flex items-center px-5 py-2.5 bg-orange-50 text-orange-600 hover:bg-orange-500 hover:text-white border border-orange-200 hover:border-orange-500 rounded-full text-sm font-semibold transition-all cursor-pointer hover:scale-105 shadow-sm hover:shadow-md">
              <Building2 className="h-4 w-4 mr-2" />
              Apartments
            </span>
          </Link>
          <Link href="/properties?type=House">
            <span className="inline-flex items-center px-5 py-2.5 bg-orange-50 text-orange-600 hover:bg-orange-500 hover:text-white border border-orange-200 hover:border-orange-500 rounded-full text-sm font-semibold transition-all cursor-pointer hover:scale-105 shadow-sm hover:shadow-md">
              <Home className="h-4 w-4 mr-2" />
              Houses
            </span>
          </Link>
          <Link href="/properties?type=Villa">
            <span className="inline-flex items-center px-5 py-2.5 bg-orange-50 text-orange-600 hover:bg-orange-500 hover:text-white border border-orange-200 hover:border-orange-500 rounded-full text-sm font-semibold transition-all cursor-pointer hover:scale-105 shadow-sm hover:shadow-md">
              <Sparkles className="h-4 w-4 mr-2" />
              Villas
            </span>
          </Link>
          <Link href="/properties?type=Luxury">
            <span className="inline-flex items-center px-5 py-2.5 bg-orange-50 text-orange-600 hover:bg-orange-500 hover:text-white border border-orange-200 hover:border-orange-500 rounded-full text-sm font-semibold transition-all cursor-pointer hover:scale-105 shadow-sm hover:shadow-md">
              <Sparkles className="h-4 w-4 mr-2" />
              Luxury
            </span>
          </Link>
        </div>
      </CardContent>
    </Card>
    </div>
  )
}

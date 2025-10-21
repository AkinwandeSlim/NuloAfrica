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
    <div className="relative max-w-4xl mx-auto">
      {/* Premium Card - Simpler, Sleeker */}
      <Card className="relative bg-white backdrop-blur-sm border-0 rounded-3xl shadow-2xl overflow-visible">
        
      <CardContent className="relative p-3">
        {/* Main Search Row - Single Line */}
        <div className="flex flex-col md:flex-row gap-2">
          {/* Location Input - Clean & Simple */}
          <div className="flex-1 relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
              <MapPin className="h-5 w-5 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
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
              placeholder="City, neighborhood, or address"
              className="w-full h-14 pl-12 pr-4 rounded-xl border-0 bg-slate-50 text-slate-900 placeholder:text-slate-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all font-medium text-sm"
              autoComplete="off"
              aria-label="Search location"
            />

            {/* Location Suggestions Dropdown - Premium */}
            <AnimatePresence>
              {showSuggestions && filteredSuggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-[100]"
                  id={suggestionsId}
                  role="listbox"
                  ref={suggestionsRef}
                >
                  <div className="p-2 max-h-80 overflow-y-auto">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wide px-3 py-2">Popular Locations</div>
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
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all text-left ${
                          activeIndex === index ? 'bg-orange-50' : 'hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${activeIndex === index ? 'bg-orange-500' : 'bg-orange-50'}`}>
                            <MapPin className={`h-4 w-4 transition-colors ${activeIndex === index ? 'text-white' : 'text-orange-500'}`} />
                          </div>
                          <span className={`text-sm font-medium transition-colors ${activeIndex === index ? 'text-orange-600' : 'text-slate-700'}`}>{loc.name}</span>
                        </div>
                        <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">{loc.properties}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Property Type Dropdown - Minimal */}
          <div className="md:w-48 relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
              <Home className="h-5 w-5 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
            </div>
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="w-full h-14 pl-12 pr-10 rounded-xl border-0 bg-slate-50 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all appearance-none cursor-pointer font-medium text-sm"
              aria-label="Select property type"
            >
              {propertyTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          {/* Search Button - Sleek CTA */}
          <Link 
            href={`/properties?location=${encodeURIComponent(location)}&type=${propertyType !== 'Property Type' ? propertyType : ''}&minPrice=${priceRange[0]}&maxPrice=${priceRange[1]}&bedrooms=${bedrooms !== 'Any' ? bedrooms : ''}&bathrooms=${bathrooms !== 'Any' ? bathrooms : ''}&minSize=${minSize}&userType=${userType}`} 
            className="w-full md:w-auto"
          >
            <Button
              type="button"
              className="w-full md:w-auto h-14 px-8 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-sm transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
              aria-label="Search for properties"
            >
              <Search className="mr-2 h-5 w-5" />
              Search
            </Button>
          </Link>
        </div>

        {/* Advanced Filters Toggle - Minimal */}
        <div className="mt-3 flex items-center justify-center">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700 transition-all font-medium"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>{showAdvanced ? 'Less' : 'More filters'}</span>
            <ChevronDown className={`h-3.5 w-3.5 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Advanced Filters - Simplified */}
        {showAdvanced && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 pt-4 border-t border-slate-100"
          >
            <div className="space-y-4">
              {/* Price Range */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-semibold text-slate-600">Price Range</label>
                  <span className="text-xs font-bold text-orange-600">
                    {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
                  </span>
                </div>
                <div className="relative">
                  <div className="relative h-2 bg-slate-100 rounded-full">
                    <div 
                      className="absolute h-2 bg-orange-500 rounded-full transition-all duration-300"
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
                    className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-orange-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-sm [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:transition-transform"
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
                    className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-orange-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-sm [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:transition-transform"
                  />
                </div>
              </div>

              {/* Bedrooms & Bathrooms Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Bedrooms */}
                <div>
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 mb-2">
                    <Bed className="h-3.5 w-3.5 text-orange-500" />
                    Bedrooms
                  </label>
                  <div className="flex gap-1.5">
                    {['Any', '1', '2', '3', '4', '5+'].map((num) => (
                      <button
                        key={num}
                        onClick={() => setBedrooms(num)}
                        className={`flex-1 px-2 py-2 rounded-lg text-xs font-semibold transition-all ${
                          bedrooms === num
                            ? 'bg-orange-500 text-white'
                            : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bathrooms */}
                <div>
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 mb-2">
                    <Bath className="h-3.5 w-3.5 text-orange-500" />
                    Bathrooms
                  </label>
                  <div className="flex gap-1.5">
                    {['Any', '1', '2', '3', '4+'].map((num) => (
                      <button
                        key={num}
                        onClick={() => setBathrooms(num)}
                        className={`flex-1 px-2 py-2 rounded-lg text-xs font-semibold transition-all ${
                          bathrooms === num
                            ? 'bg-orange-500 text-white'
                            : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        )}

      </CardContent>
    </Card>
    </div>
  )
}

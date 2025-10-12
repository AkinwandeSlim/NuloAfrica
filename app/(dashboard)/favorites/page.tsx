"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Bed, Bath, Square, Heart, Search } from "lucide-react"
import Link from "next/link"

// Sample saved properties (in a real app, this would come from user's saved data)
const savedPropertiesData = [
  {
    id: 1,
    title: "Modern Villa in Nairobi",
    location: "Westlands, Nairobi, Kenya",
    price: "$450,000",
    pricePerMonth: "$2,500/month",
    beds: 4,
    baths: 3,
    sqft: "3,200",
    type: "Villa",
    image: "/modern-villa-nairobi.jpg",
    featured: true,
  },
  {
    id: 2,
    title: "Luxury Apartment Lagos",
    location: "Victoria Island, Lagos, Nigeria",
    price: "$320,000",
    pricePerMonth: "$1,800/month",
    beds: 3,
    baths: 2,
    sqft: "2,100",
    type: "Apartment",
    image: "/luxury-apartment-lagos.jpg",
    featured: false,
  },
  {
    id: 5,
    title: "Penthouse in Cape Town",
    location: "Waterfront, Cape Town, South Africa",
    price: "$680,000",
    pricePerMonth: "$3,500/month",
    beds: 3,
    baths: 3,
    sqft: "2,800",
    type: "Penthouse",
    image: "/penthouse-capetown.jpg",
    featured: true,
  },
]

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<number[]>(savedPropertiesData.map(p => p.id))
  const [properties, setProperties] = useState(savedPropertiesData)

  const toggleFavorite = (id: number) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(id) 
        ? prev.filter(fav => fav !== id) 
        : [...prev, id]
      
      // Remove property from view when unfavorited
      if (!newFavorites.includes(id)) {
        setTimeout(() => {
          setProperties(prev => prev.filter(p => p.id !== id))
        }, 300)
      }
      
      return newFavorites
    })
  }

  const hasProperties = properties.length > 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-stone-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-stone-200/50 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold">
              <span className="text-stone-800">Nulo</span>
              <span className="text-amber-600">Africa</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-slate-700 hover:text-amber-600 transition-colors">
                Home
              </Link>
              <Link href="/properties" className="text-slate-700 hover:text-amber-600 transition-colors">
                Properties
              </Link>
              <Link href="/favorites" className="text-amber-600 font-semibold">
                Favorites
              </Link>
              <Link href="/dashboard" className="text-slate-700 hover:text-amber-600 transition-colors">
                Dashboard
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-3">
            Your Favorite <span className="text-amber-600">Properties</span>
          </h1>
          <p className="text-lg text-slate-600">
            {hasProperties 
              ? `You have ${properties.length} saved ${properties.length === 1 ? 'property' : 'properties'}`
              : 'Start building your dream property collection'
            }
          </p>
        </div>

        {hasProperties ? (
          /* Properties Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => (
              <Card
                key={property.id}
                className={`group bg-white/90 backdrop-blur-sm border-white/50 rounded-2xl shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden cursor-pointer relative ${
                  !favorites.includes(property.id) ? 'opacity-50 scale-95' : ''
                }`}
              >
                {/* Hover Glow Effect */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-amber-400/20 via-orange-300/10 to-transparent" />
                
                {/* Image */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={property.image || "/placeholder.svg"}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  
                  {/* Featured Badge */}
                  {property.featured && (
                    <Badge className="absolute top-4 left-4 bg-amber-500 text-white border-0 px-3 py-1">
                      Featured
                    </Badge>
                  )}
                  
                  {/* Favorite Button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      toggleFavorite(property.id)
                    }}
                    className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-300 hover:scale-110 group/heart"
                  >
                    <Heart
                      className={`h-5 w-5 transition-all duration-300 ${
                        favorites.includes(property.id)
                          ? "fill-amber-500 text-amber-500 group-hover/heart:scale-110"
                          : "text-slate-600"
                      }`}
                    />
                  </button>
                </div>

                <CardContent className="p-6 relative z-10">
                  {/* Property Type */}
                  <p className="text-xs font-semibold text-amber-600 uppercase tracking-wide mb-2">
                    {property.type}
                  </p>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-amber-600 transition-colors">
                    {property.title}
                  </h3>

                  {/* Location */}
                  <p className="flex items-center text-sm text-slate-600 mb-4">
                    <MapPin className="h-4 w-4 mr-1 text-amber-500" />
                    {property.location}
                  </p>

                  {/* Property Details */}
                  <div className="flex items-center gap-4 text-sm text-slate-600 mb-4 pb-4 border-b border-slate-200">
                    <span className="flex items-center gap-1">
                      <Bed className="h-4 w-4 text-amber-500" />
                      {property.beds}
                    </span>
                    <span className="flex items-center gap-1">
                      <Bath className="h-4 w-4 text-amber-500" />
                      {property.baths}
                    </span>
                    <span className="flex items-center gap-1">
                      <Square className="h-4 w-4 text-amber-500" />
                      {property.sqft} sqft
                    </span>
                  </div>

                  {/* Price and CTA */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-slate-900">{property.price}</p>
                      <p className="text-xs text-slate-500">{property.pricePerMonth}</p>
                    </div>
                    <Link href={`/properties/${property.id}`}>
                      <Button
                        size="sm"
                        className="bg-amber-500 hover:bg-amber-600 text-white rounded-lg px-4 transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg"
                      >
                        View Details
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20">
            <Card className="max-w-2xl w-full bg-white/90 backdrop-blur-sm border-white/50 rounded-3xl shadow-lg">
              <CardContent className="p-12 text-center">
                {/* Illustration */}
                <div className="mb-8 flex justify-center">
                  <div className="relative">
                    {/* Decorative circles */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-48 h-48 bg-amber-100 rounded-full opacity-50 animate-pulse" style={{animationDuration: '3s'}} />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-32 h-32 bg-orange-100 rounded-full opacity-50 animate-pulse" style={{animationDuration: '2s', animationDelay: '0.5s'}} />
                    </div>
                    
                    {/* Heart Icon */}
                    <div className="relative z-10 p-8 bg-gradient-to-br from-amber-50 to-orange-50 rounded-full">
                      <Heart className="h-24 w-24 text-amber-400 stroke-[1.5]" />
                    </div>
                  </div>
                </div>

                {/* Gold Accent Line */}
                <div className="h-1 w-24 bg-gradient-to-r from-amber-500 to-orange-400 rounded-full mx-auto mb-6" />

                {/* Message */}
                <h2 className="text-3xl font-bold text-slate-900 mb-4">
                  No Favorites Yet
                </h2>
                <p className="text-lg text-slate-600 mb-8 max-w-md mx-auto leading-relaxed">
                  You haven't saved any properties yet. Start exploring and save your dream homes to view them here.
                </p>

                {/* CTA Button */}
                <Link href="/properties">
                  <Button
                    size="lg"
                    className="h-14 px-8 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    <Search className="h-5 w-5 mr-2" />
                    Browse Properties
                  </Button>
                </Link>

                {/* Additional Info */}
                <p className="text-sm text-slate-500 mt-6">
                  Click the <Heart className="inline h-4 w-4 mx-1" /> icon on any property to save it
                </p>
              </CardContent>
            </Card>

            {/* Decorative Elements */}
            <div className="mt-12 flex gap-4 text-center">
              <div className="px-6 py-4 bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200">
                <p className="text-2xl font-bold text-amber-600">1000+</p>
                <p className="text-sm text-slate-600">Properties Available</p>
              </div>
              <div className="px-6 py-4 bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200">
                <p className="text-2xl font-bold text-amber-600">50+</p>
                <p className="text-sm text-slate-600">Cities Across Africa</p>
              </div>
              <div className="px-6 py-4 bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200">
                <p className="text-2xl font-bold text-amber-600">24/7</p>
                <p className="text-sm text-slate-600">Customer Support</p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-xl border-t border-stone-200/50 py-8 mt-20">
        <div className="container mx-auto px-6 text-center">
          <p className="text-slate-600">
            © 2025 <span className="font-semibold text-slate-900">NuloAfrica</span>. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

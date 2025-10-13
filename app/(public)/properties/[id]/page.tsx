"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  MapPin, Bed, Bath, Square, Heart, Share2, ChevronLeft, ChevronRight,
  Home, Wifi, Car, Dumbbell, Shield, Wind, Tv, Coffee, Check, Phone, Mail, Calendar, Star, Navigation
} from "lucide-react"
import Link from "next/link"

// Sample property data (in a real app, this would come from an API)
const propertyData = {
  id: 1,
  title: "Luxury Penthouse Victoria Island",
  location: "Victoria Island, Lagos, Nigeria",
  fullAddress: "Adeola Odeku Street, Victoria Island, Lagos, Nigeria",
  price: "₦450,000,000",
  pricePerMonth: "₦2,800,000/month",
  beds: 4,
  baths: 4,
  sqft: "3,500",
  type: "Penthouse",
  yearBuilt: 2021,
  featured: true,
  rating: 4.9,
  reviews: 32,
  latitude: 6.4281,
  longitude: 3.4219,
  images: [
    "/luxury-apartment-lagos.jpg",
    "/modern-villa-living-room.jpg",
    "/modern-villa-nairobi.jpg",
    "/modern-villa-bathroom.jpg",
    "/modern-villa-pool.jpg",
    "/contemporary-townhouse-johannesburg.jpg",
  ],
  description: `This stunning luxury penthouse offers the perfect blend of elegance and modern living in the heart of Victoria Island, Lagos. 
  
  Featuring contemporary architecture with floor-to-ceiling windows, this property offers breathtaking ocean views and maximizes natural light throughout. The open-plan living area seamlessly connects to a spacious balcony, ideal for entertaining guests while enjoying panoramic city views.

  The penthouse includes four spacious bedrooms, each with en-suite bathrooms and built-in wardrobes. The master suite features a walk-in closet and a luxurious bathroom with both a jacuzzi and rain shower. Premium Italian marble flooring throughout adds to the sophisticated ambiance.

  Located in Lagos's most prestigious business district, you'll enjoy easy access to international schools, premium shopping centers, fine dining restaurants, and major corporate offices. The building offers world-class amenities including a rooftop infinity pool, state-of-the-art gym, and 24/7 concierge service.`,
  amenities: [
    { icon: Wifi, label: "High-Speed Fiber WiFi" },
    { icon: Car, label: "3-Car Underground Parking" },
    { icon: Dumbbell, label: "Premium Gym & Spa" },
    { icon: Shield, label: "24/7 Security & Concierge" },
    { icon: Wind, label: "Central Air Conditioning" },
    { icon: Tv, label: "Smart Home System" },
    { icon: Coffee, label: "Designer Kitchen" },
    { icon: Home, label: "Private Balcony" },
  ],
  features: [
    "Italian Marble Floors",
    "Granite & Quartz Countertops",
    "Premium Appliances",
    "Walk-in Closets",
    "Central Heating",
    "Backup Generator",
    "Water Treatment System",
    "Solar Panels",
    "Fiber Internet",
    "CCTV & Smart Locks",
    "Electric Gate",
    "Rooftop Pool Access",
    "Ocean Views",
    "Smart Lighting",
    "Wine Cellar",
    "Home Theater Ready",
  ],
  owner: {
    name: "Chioma Okafor",
    avatar: "/owner-avatar.jpg",
    phone: "+234 803 456 7890",
    email: "chioma.okafor@nuloafrica.com",
    verified: true,
    properties: 15,
  },
}

export default function PropertyDetailsPage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)
  const mapRef = useRef<HTMLDivElement>(null)
  const googleMapRef = useRef<google.maps.Map | null>(null)

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === propertyData.images.length - 1 ? 0 : prev + 1
    )
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? propertyData.images.length - 1 : prev - 1
    )
  }

  // Initialize Google Map
  useEffect(() => {
    if (mapRef.current && typeof window !== 'undefined' && window.google && propertyData.latitude && propertyData.longitude) {
      if (!googleMapRef.current) {
        googleMapRef.current = new google.maps.Map(mapRef.current, {
          center: { lat: propertyData.latitude, lng: propertyData.longitude },
          zoom: 15,
          disableDefaultUI: true,
          zoomControl: true,
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }]
            }
          ]
        })

        // Add marker for property
        new google.maps.Marker({
          position: { lat: propertyData.latitude, lng: propertyData.longitude },
          map: googleMapRef.current,
          title: propertyData.title,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 12,
            fillColor: '#f59e0b',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 3,
          }
        })
      }
    }
  }, [])

  const handleGetDirections = () => {
    if (propertyData.latitude && propertyData.longitude) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${propertyData.latitude},${propertyData.longitude}`
      window.open(url, '_blank')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-stone-50">
      {/* Header */}
      {/* <header className="bg-white/80 backdrop-blur-xl border-b border-stone-200/50 sticky top-0 z-50 shadow-sm">
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
              <Link href="/dashboard" className="text-slate-700 hover:text-amber-600 transition-colors">
                Dashboard
              </Link>
            </nav>
          </div>
        </div>
      </header> */}

      {/* Back Button */}
      <div className="container mx-auto px-6 py-6">
        <Link href="/properties">
          <Button variant="ghost" className="text-slate-700 hover:text-amber-600">
            <ChevronLeft className="h-5 w-5 mr-1" />
            Back to Properties
          </Button>
        </Link>
      </div>

      {/* Image Carousel Hero */}
      <section className="container mx-auto px-6 mb-12">
        <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl group">
          {/* Main Image */}
          <img
            src={propertyData.images[currentImageIndex] || "/placeholder.svg"}
            alt={`${propertyData.title} - Image ${currentImageIndex + 1}`}
            className="w-full h-full object-cover transition-transform duration-700"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

          {/* Navigation Buttons */}
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-300 hover:scale-110 opacity-0 group-hover:opacity-100"
          >
            <ChevronLeft className="h-6 w-6 text-slate-800" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-300 hover:scale-110 opacity-0 group-hover:opacity-100"
          >
            <ChevronRight className="h-6 w-6 text-slate-800" />
          </button>

          {/* Image Counter */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/60 backdrop-blur-sm rounded-full text-white text-sm font-medium">
            {currentImageIndex + 1} / {propertyData.images.length}
          </div>

          {/* Action Buttons */}
          <div className="absolute top-6 right-6 flex gap-3">
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="p-3 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-300 hover:scale-110"
            >
              <Heart
                className={`h-6 w-6 transition-colors ${
                  isFavorite ? "fill-amber-500 text-amber-500" : "text-slate-700"
                }`}
              />
            </button>
            <button className="p-3 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-300 hover:scale-110">
              <Share2 className="h-6 w-6 text-slate-700" />
            </button>
          </div>

          {/* Featured Badge */}
          {propertyData.featured && (
            <Badge className="absolute top-6 left-6 bg-amber-500 text-white border-0 px-4 py-2 text-sm">
              Featured Property
            </Badge>
          )}
        </div>

        {/* Thumbnail Gallery */}
        <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
          {propertyData.images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`flex-shrink-0 w-24 h-20 rounded-xl overflow-hidden transition-all duration-300 ${
                index === currentImageIndex
                  ? "ring-4 ring-amber-500 scale-105"
                  : "opacity-60 hover:opacity-100"
              }`}
            >
              <img
                src={image || "/placeholder.svg"}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Property Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title and Basic Info */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <Badge className="bg-amber-100 text-amber-700 border-0 mb-3">
                    {propertyData.type}
                  </Badge>
                  <h1 className="text-4xl font-bold text-slate-900 mb-3">
                    {propertyData.title}
                  </h1>
                  <p className="flex items-center text-lg text-slate-600 mb-2">
                    <MapPin className="h-5 w-5 mr-2 text-amber-500" />
                    {propertyData.fullAddress}
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(propertyData.rating)
                              ? "fill-amber-500 text-amber-500"
                              : "text-slate-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-slate-600">
                      {propertyData.rating} ({propertyData.reviews} reviews)
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-4xl font-bold text-slate-900">{propertyData.price}</p>
                  <p className="text-sm text-slate-600">{propertyData.pricePerMonth}</p>
                </div>
              </div>

              {/* Gold Accent Line */}
              <div className="h-1 w-24 bg-gradient-to-r from-amber-500 to-orange-400 rounded-full mb-6" />

              {/* Property Stats */}
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-3 px-4 py-3 bg-white/90 backdrop-blur-sm rounded-xl border border-stone-200">
                  <Bed className="h-6 w-6 text-amber-500" />
                  <div>
                    <p className="text-sm text-slate-600">Bedrooms</p>
                    <p className="text-lg font-semibold text-slate-900">{propertyData.beds}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 px-4 py-3 bg-white/90 backdrop-blur-sm rounded-xl border border-stone-200">
                  <Bath className="h-6 w-6 text-amber-500" />
                  <div>
                    <p className="text-sm text-slate-600">Bathrooms</p>
                    <p className="text-lg font-semibold text-slate-900">{propertyData.baths}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 px-4 py-3 bg-white/90 backdrop-blur-sm rounded-xl border border-stone-200">
                  <Square className="h-6 w-6 text-amber-500" />
                  <div>
                    <p className="text-sm text-slate-600">Square Feet</p>
                    <p className="text-lg font-semibold text-slate-900">{propertyData.sqft}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 px-4 py-3 bg-white/90 backdrop-blur-sm rounded-xl border border-stone-200">
                  <Home className="h-6 w-6 text-amber-500" />
                  <div>
                    <p className="text-sm text-slate-600">Year Built</p>
                    <p className="text-lg font-semibold text-slate-900">{propertyData.yearBuilt}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <Card className="bg-white/90 backdrop-blur-sm border-white/50 rounded-2xl shadow-sm">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">About This Property</h2>
                <div className="h-1 w-16 bg-gradient-to-r from-amber-500 to-orange-400 rounded-full mb-6" />
                <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                  {propertyData.description}
                </p>
              </CardContent>
            </Card>

            {/* Amenities */}
            <Card className="bg-white/90 backdrop-blur-sm border-white/50 rounded-2xl shadow-sm">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Amenities</h2>
                <div className="h-1 w-16 bg-gradient-to-r from-amber-500 to-orange-400 rounded-full mb-6" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {propertyData.amenities.map((amenity, index) => {
                    const Icon = amenity.icon
                    return (
                      <div
                        key={index}
                        className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-amber-50 transition-colors"
                      >
                        <div className="p-3 bg-amber-100 rounded-xl">
                          <Icon className="h-6 w-6 text-amber-600" />
                        </div>
                        <p className="text-sm text-slate-700 text-center font-medium">
                          {amenity.label}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <Card className="bg-white/90 backdrop-blur-sm border-white/50 rounded-2xl shadow-sm">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Key Features</h2>
                <div className="h-1 w-16 bg-gradient-to-r from-amber-500 to-orange-400 rounded-full mb-6" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {propertyData.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="p-1 bg-amber-100 rounded-full">
                        <Check className="h-4 w-4 text-amber-600" />
                      </div>
                      <p className="text-slate-700">{feature}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Location Map */}
            <Card className="bg-white/90 backdrop-blur-sm border-white/50 rounded-2xl shadow-sm overflow-hidden">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Location</h2>
                <div className="h-1 w-16 bg-gradient-to-r from-amber-500 to-orange-400 rounded-full mb-6" />
                
                {/* Address */}
                <div className="flex items-start gap-3 mb-6 p-4 bg-amber-50 rounded-xl">
                  <MapPin className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-slate-900 mb-1">{propertyData.title}</p>
                    <p className="text-sm text-slate-600">{propertyData.fullAddress}</p>
                  </div>
                </div>

                {/* Mini Map */}
                <div className="relative rounded-2xl overflow-hidden shadow-lg mb-6">
                  <div 
                    ref={mapRef}
                    className="w-full h-[400px]"
                  />
                </div>

                {/* Get Directions Button */}
                <Button
                  onClick={handleGetDirections}
                  className="w-full h-12 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  <Navigation className="h-5 w-5 mr-2" />
                  Get Directions
                </Button>

                {/* Nearby Info */}
                <div className="mt-6 pt-6 border-t border-stone-200">
                  <p className="text-sm text-slate-600 mb-3 font-medium">Nearby</p>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-slate-700">
                      <div className="w-2 h-2 rounded-full bg-amber-500" />
                      <span>Schools: 2 km</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700">
                      <div className="w-2 h-2 rounded-full bg-amber-500" />
                      <span>Shopping: 1.5 km</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700">
                      <div className="w-2 h-2 rounded-full bg-amber-500" />
                      <span>Hospital: 3 km</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700">
                      <div className="w-2 h-2 rounded-full bg-amber-500" />
                      <span>Airport: 15 km</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:sticky lg:top-24 space-y-6 h-fit">
            {/* Contact Card */}
            <Card className="bg-white/90 backdrop-blur-sm border-white/50 rounded-2xl shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-6">Contact Property Owner</h3>
                
                {/* Owner Info */}
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-stone-200">
                  <Avatar className="h-16 w-16 border-2 border-amber-200">
                    <AvatarImage src={propertyData.owner.avatar} />
                    <AvatarFallback className="bg-amber-100 text-amber-700 text-lg font-semibold">
                      {propertyData.owner.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-slate-900">{propertyData.owner.name}</h4>
                      {propertyData.owner.verified && (
                        <Badge className="bg-green-100 text-green-700 border-0 text-xs">
                          Verified
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-slate-600">{propertyData.owner.properties} properties</p>
                  </div>
                </div>

                {/* Contact Buttons */}
                <div className="space-y-3">
                  <Button className="w-full h-12 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg">
                    <Phone className="h-5 w-5 mr-2" />
                    Call Owner
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full h-12 border-2 border-amber-200 hover:border-amber-400 hover:bg-amber-50 text-slate-800 rounded-xl font-semibold transition-all duration-300"
                  >
                    <Mail className="h-5 w-5 mr-2" />
                    Send Message
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full h-12 border-2 border-amber-200 hover:border-amber-400 hover:bg-amber-50 text-slate-800 rounded-xl font-semibold transition-all duration-300"
                  >
                    <Calendar className="h-5 w-5 mr-2" />
                    Schedule Visit
                  </Button>
                </div>

                {/* Gold Accent Line */}
                <div className="h-1 w-full bg-gradient-to-r from-amber-500 to-orange-400 rounded-full my-6" />

                {/* Add to Favorites */}
                <Button
                  variant="outline"
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`w-full h-12 border-2 rounded-xl font-semibold transition-all duration-300 ${
                    isFavorite
                      ? "border-amber-500 bg-amber-50 text-amber-700"
                      : "border-stone-200 hover:border-amber-400 hover:bg-amber-50 text-slate-800"
                  }`}
                >
                  <Heart
                    className={`h-5 w-5 mr-2 ${
                      isFavorite ? "fill-amber-500" : ""
                    }`}
                  />
                  {isFavorite ? "Saved to Favorites" : "Add to Favorites"}
                </Button>

                {/* Contact Info */}
                <div className="mt-6 pt-6 border-t border-stone-200 space-y-3">
                  <p className="text-sm text-slate-600 flex items-center gap-2">
                    <Phone className="h-4 w-4 text-amber-500" />
                    {propertyData.owner.phone}
                  </p>
                  <p className="text-sm text-slate-600 flex items-center gap-2">
                    <Mail className="h-4 w-4 text-amber-500" />
                    {propertyData.owner.email}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Safety Notice */}
            <Card className="bg-amber-50 border-amber-200 rounded-2xl">
              <CardContent className="p-6">
                <div className="flex gap-3">
                  <Shield className="h-6 w-6 text-amber-600 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Safety Tips</h4>
                    <p className="text-sm text-slate-700">
                      Always verify property details and meet in person before making any payments.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-xl border-t border-stone-200/50 py-8">
        <div className="container mx-auto px-6 text-center">
          <p className="text-slate-600">
            © 2025 <span className="font-semibold text-slate-900">NuloAfrica</span>. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

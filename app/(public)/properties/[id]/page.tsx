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

export default function PropertyDetailPage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)
  const [showContactModal, setShowContactModal] = useState(false)
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50/30">
      {/* Sticky Header with Back Button */}
      <div className="sticky top-16 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 shadow-sm">
        <div className="container mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/properties">
              <Button variant="ghost" className="text-slate-700 hover:text-amber-600 hover:bg-amber-50 transition-all">
                <ChevronLeft className="h-5 w-5 mr-1" />
                Back to Properties
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className="p-2.5 rounded-full hover:bg-amber-50 transition-all"
              >
                <Heart
                  className={`h-5 w-5 transition-colors ${
                    isFavorite ? "fill-amber-500 text-amber-500" : "text-slate-600"
                  }`}
                />
              </button>
              <button className="p-2.5 rounded-full hover:bg-amber-50 transition-all">
                <Share2 className="h-5 w-5 text-slate-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Image Carousel Hero */}
      <section className="container mx-auto px-4 md:px-6 py-6">
        <div className="relative h-[400px] md:h-[600px] rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl group">
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

          {/* Price Tag Overlay */}
          <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-md rounded-2xl px-6 py-4 shadow-xl">
            <p className="text-sm text-slate-600 mb-1">Starting from</p>
            <p className="text-3xl font-bold text-slate-900">{propertyData.price}</p>
            <p className="text-sm text-amber-600 font-medium">{propertyData.pricePerMonth}</p>
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
      <section className="container mx-auto px-4 md:px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column - Property Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title and Basic Info */}
            <Card className="bg-white/90 backdrop-blur-sm border-0 rounded-2xl shadow-lg">
              <CardContent className="p-6 md:p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 px-4 py-1.5 text-sm font-semibold">
                        {propertyData.type}
                      </Badge>
                      {propertyData.featured && (
                        <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 px-4 py-1.5 text-sm font-semibold">
                          ⭐ Featured
                        </Badge>
                      )}
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 leading-tight">
                      {propertyData.title}
                    </h1>
                    <p className="flex items-start text-base md:text-lg text-slate-600 mb-4">
                      <MapPin className="h-5 w-5 mr-2 text-amber-500 mt-1 flex-shrink-0" />
                      <span>{propertyData.fullAddress}</span>
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${
                              i < Math.floor(propertyData.rating)
                                ? "fill-amber-500 text-amber-500"
                                : "text-slate-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-medium text-slate-700">
                        {propertyData.rating} ({propertyData.reviews} reviews)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Property Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-slate-200">
                  <div className="flex flex-col items-center p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl">
                    <Bed className="h-8 w-8 text-amber-600 mb-2" />
                    <p className="text-2xl font-bold text-slate-900">{propertyData.beds}</p>
                    <p className="text-sm text-slate-600">Bedrooms</p>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl">
                    <Bath className="h-8 w-8 text-blue-600 mb-2" />
                    <p className="text-2xl font-bold text-slate-900">{propertyData.baths}</p>
                    <p className="text-sm text-slate-600">Bathrooms</p>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
                    <Square className="h-8 w-8 text-green-600 mb-2" />
                    <p className="text-2xl font-bold text-slate-900">{propertyData.sqft}</p>
                    <p className="text-sm text-slate-600">Sq Ft</p>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
                    <Home className="h-8 w-8 text-purple-600 mb-2" />
                    <p className="text-2xl font-bold text-slate-900">{propertyData.yearBuilt}</p>
                    <p className="text-sm text-slate-600">Year Built</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card className="bg-white/90 backdrop-blur-sm border-0 rounded-2xl shadow-lg">
              <CardContent className="p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg">
                    <Home className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">About This Property</h2>
                </div>
                <p className="text-slate-700 leading-relaxed text-base whitespace-pre-line">
                  {propertyData.description}
                </p>
              </CardContent>
            </Card>

            {/* Amenities */}
            <Card className="bg-white/90 backdrop-blur-sm border-0 rounded-2xl shadow-lg">
              <CardContent className="p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
                    <Wifi className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">Amenities & Features</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {propertyData.amenities.map((amenity, index) => {
                    const Icon = amenity.icon
                    return (
                      <div
                        key={index}
                        className="flex flex-col items-center gap-3 p-5 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 hover:from-amber-50 hover:to-orange-50 transition-all duration-300 hover:scale-105 hover:shadow-md"
                      >
                        <div className="p-3 bg-white rounded-xl shadow-sm">
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
            <Card className="bg-white/90 backdrop-blur-sm border-0 rounded-2xl shadow-lg">
              <CardContent className="p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg">
                    <Check className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">Key Features</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {propertyData.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-green-50 transition-colors">
                      <div className="p-1.5 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex-shrink-0">
                        <Check className="h-4 w-4 text-green-600" />
                      </div>
                      <p className="text-slate-700 font-medium">{feature}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Location Map */}
            <Card className="bg-white/90 backdrop-blur-sm border-0 rounded-2xl shadow-lg overflow-hidden">
              <CardContent className="p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">Location</h2>
                </div>
                
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
                  className="w-full h-14 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02] shadow-lg text-base"
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
            <Card className="bg-gradient-to-br from-white via-white to-amber-50/40 backdrop-blur-sm border-0 rounded-2xl shadow-xl overflow-hidden">
              <CardContent className="p-0">
                {/* Header with gradient background */}
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-6 pb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                      <Phone className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Contact Owner</h3>
                  </div>
                </div>
                
                {/* Owner Info - Overlapping card */}
                <div className="px-6 -mt-6 mb-6">
                  <div className="bg-white rounded-2xl shadow-lg p-5 border border-slate-100">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Avatar className="h-20 w-20 border-4 border-white shadow-lg">
                          <AvatarImage src={propertyData.owner.avatar} />
                          <AvatarFallback className="bg-gradient-to-br from-amber-500 to-orange-500 text-white text-xl font-bold">
                            {propertyData.owner.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        {propertyData.owner.verified && (
                          <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1 border-2 border-white shadow-md">
                            <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-lg text-slate-900">{propertyData.owner.name}</h4>
                        </div>
                        {propertyData.owner.verified && (
                          <Badge className="bg-green-100 text-green-700 border-0 text-xs mb-2">
                            ✓ Verified Owner
                          </Badge>
                        )}
                        <div className="flex items-center gap-4 text-sm text-slate-600">
                          <div className="flex items-center gap-1">
                            <Home className="h-4 w-4 text-amber-600" />
                            <span className="font-semibold">{propertyData.owner.properties}</span>
                            <span>properties</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-6 pb-6">
                {/* Contact Buttons */}
                <div className="space-y-3">
                  <Button className="w-full h-14 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02] shadow-lg text-base">
                    <Phone className="h-5 w-5 mr-2" />
                    Call Owner
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full h-14 border-2 border-slate-200 hover:border-amber-400 hover:bg-amber-50 text-slate-800 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02] text-base"
                  >
                    <Mail className="h-5 w-5 mr-2" />
                    Send Message
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full h-14 border-2 border-slate-200 hover:border-amber-400 hover:bg-amber-50 text-slate-800 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02] text-base"
                  >
                    <Calendar className="h-5 w-5 mr-2" />
                    Schedule Visit
                  </Button>
                </div>

                {/* Divider */}
                <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent my-6" />

                {/* Add to Favorites */}
                <Button
                  variant="outline"
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`w-full h-14 border-2 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02] text-base ${
                    isFavorite
                      ? "border-amber-500 bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700"
                      : "border-slate-200 hover:border-amber-400 hover:bg-amber-50 text-slate-800"
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
                <div className="mt-6 pt-6 border-t border-slate-200 space-y-3">
                  <p className="text-sm text-slate-600 flex items-center gap-2">
                    <Phone className="h-4 w-4 text-amber-500" />
                    {propertyData.owner.phone}
                  </p>
                  <p className="text-sm text-slate-600 flex items-center gap-2">
                    <Mail className="h-4 w-4 text-amber-500" />
                    {propertyData.owner.email}
                  </p>
                </div>
                </div>
              </CardContent>
            </Card>

            {/* Safety Notice */}
            <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200/50 rounded-2xl shadow-lg">
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="p-3 bg-white rounded-xl shadow-sm flex-shrink-0 w-fit h-fit">
                    <Shield className="h-6 w-6 text-amber-600 flex-shrink-0" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-900 mb-2 text-lg">Safety Tips</h4>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Always verify property details and meet in person before making any payments. Never send money without viewing the property.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Mobile Floating Contact Button */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white to-transparent z-50">
        <Button
          onClick={() => setShowContactModal(true)}
          className="w-full h-16 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-2xl font-bold text-lg shadow-2xl"
        >
          <Phone className="h-6 w-6 mr-2" />
          Contact Owner
        </Button>
      </div>

      {/* Mobile Contact Modal */}
      {showContactModal && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-[60] flex items-end" onClick={() => setShowContactModal(false)}>
          <div className="bg-white rounded-t-3xl w-full max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-6 pb-8 sticky top-0 z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                    <Phone className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Contact Owner</h3>
                </div>
                <button
                  onClick={() => setShowContactModal(false)}
                  className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
                >
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Owner Info Card */}
            <div className="px-6 -mt-6 mb-6">
              <div className="bg-white rounded-2xl shadow-lg p-5 border border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Avatar className="h-20 w-20 border-4 border-white shadow-lg">
                      <AvatarImage src={propertyData.owner.avatar} />
                      <AvatarFallback className="bg-gradient-to-br from-amber-500 to-orange-500 text-white text-xl font-bold">
                        {propertyData.owner.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    {propertyData.owner.verified && (
                      <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1 border-2 border-white shadow-md">
                        <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-lg text-slate-900 mb-1">{propertyData.owner.name}</h4>
                    {propertyData.owner.verified && (
                      <Badge className="bg-green-100 text-green-700 border-0 text-xs mb-2">
                        ✓ Verified Owner
                      </Badge>
                    )}
                    <div className="flex items-center gap-1 text-sm text-slate-600">
                      <Home className="h-4 w-4 text-amber-600" />
                      <span className="font-semibold">{propertyData.owner.properties}</span>
                      <span>properties</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Buttons */}
            <div className="px-6 pb-6 space-y-3">
              <Button className="w-full h-16 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl font-semibold text-base shadow-lg">
                <Phone className="h-5 w-5 mr-2" />
                Call {propertyData.owner.phone}
              </Button>
              <Button
                variant="outline"
                className="w-full h-16 border-2 border-slate-200 hover:border-amber-400 hover:bg-amber-50 text-slate-800 rounded-xl font-semibold text-base"
              >
                <Mail className="h-5 w-5 mr-2" />
                Send Message
              </Button>
              <Button
                variant="outline"
                className="w-full h-16 border-2 border-slate-200 hover:border-amber-400 hover:bg-amber-50 text-slate-800 rounded-xl font-semibold text-base"
              >
                <Calendar className="h-5 w-5 mr-2" />
                Schedule Visit
              </Button>

              {/* Contact Info */}
              <div className="mt-6 pt-6 border-t border-slate-200 space-y-3">
                <p className="text-sm text-slate-600 flex items-center gap-2">
                  <Phone className="h-4 w-4 text-amber-500" />
                  {propertyData.owner.phone}
                </p>
                <p className="text-sm text-slate-600 flex items-center gap-2">
                  <Mail className="h-4 w-4 text-amber-500" />
                  {propertyData.owner.email}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-xl border-t border-stone-200/50 py-8 pb-24 lg:pb-8">
        <div className="container mx-auto px-6 text-center">
          <p className="text-slate-600">
            © 2025 <span className="font-semibold text-slate-900">NuloAfrica</span>. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

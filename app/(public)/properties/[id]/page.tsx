"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  MapPin, Bed, Bath, Square, Heart, Share2, ChevronRight, X,
  Home, Wifi, Car, Dumbbell, Shield, Wind, Tv, Coffee, Check, 
  Phone, Mail, Calendar, Star, MessageCircle, Eye, Grid, Maximize2,
  CheckCircle2, TrendingDown
} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

// Sample property data
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

  The penthouse includes four spacious bedrooms, each with en-suite bathrooms and built-in wardrobes. The master suite features a walk-in closet and a luxurious bathroom with both a jacuzzi and rain shower. Premium Italian marble flooring throughout adds to the sophisticated ambiance.`,
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
  const [selectedImage, setSelectedImage] = useState(0)
  const [showGallery, setShowGallery] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const router = useRouter()
  const { user } = useAuth()

  const toggleFavorite = () => {
    if (!user) {
      router.push('/signin')
      return
    }
    setIsFavorite(!isFavorite)
    toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites')
  }

  const shareProperty = () => {
    if (navigator.share) {
      navigator.share({
        title: propertyData.title,
        text: `Check out this property: ${propertyData.title}`,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard!')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-slate-600 hover:text-orange-600 transition-colors font-medium">
              Home
            </Link>
            <ChevronRight className="h-4 w-4 text-slate-400" />
            <Link href="/properties" className="text-slate-600 hover:text-orange-600 transition-colors font-medium">
              Properties
            </Link>
            <ChevronRight className="h-4 w-4 text-slate-400" />
            <span className="text-slate-900 font-semibold truncate max-w-[300px]">
              {propertyData.title}
            </span>
          </nav>
        </div>
      </div>

      {/* Modern Image Gallery */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-4 gap-2 h-[500px] rounded-2xl overflow-hidden">
          {/* Main Large Image */}
          <div 
            className="col-span-2 row-span-2 relative group cursor-pointer overflow-hidden"
            onClick={() => {
              setSelectedImage(0)
              setShowGallery(true)
            }}
          >
            <img
              src={propertyData.images[0]}
              alt="Main property"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
            {propertyData.featured && (
              <Badge className="absolute top-4 left-4 bg-orange-500 text-white border-none">
                Featured
              </Badge>
            )}
          </div>

          {/* Grid of Smaller Images */}
          {propertyData.images.slice(1, 5).map((image, index) => (
            <div
              key={index}
              className="relative group cursor-pointer overflow-hidden"
              onClick={() => {
                setSelectedImage(index + 1)
                setShowGallery(true)
              }}
            >
              <img
                src={image}
                alt={`Property ${index + 2}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
              
              {/* Show All Photos Button on Last Image */}
              {index === 3 && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <Button
                    variant="secondary"
                    className="bg-white hover:bg-slate-100 text-slate-900 font-semibold"
                  >
                    <Grid className="h-4 w-4 mr-2" />
                    View All {propertyData.images.length} Photos
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Action Buttons Overlay */}
        <div className="flex items-center justify-end gap-2 -mt-16 relative z-10 px-4">
          <Button
            variant="secondary"
            size="sm"
            onClick={shareProperty}
            className="bg-white hover:bg-slate-100 shadow-lg"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={toggleFavorite}
            className="bg-white hover:bg-slate-100 shadow-lg"
          >
            <Heart className={`h-4 w-4 mr-2 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
            Save
          </Button>
        </div>
      </div>

      {/* Property Details */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title & Price */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">
                      {propertyData.title}
                    </h1>
                    <div className="flex items-center gap-3 text-slate-600 mb-2">
                      <MapPin className="h-4 w-4" />
                      <span>{propertyData.location}</span>
                    </div>
                    {/* Social Proof Badge */}
                    <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 text-orange-700 px-3 py-1.5 rounded-full text-sm font-semibold">
                      <Eye className="h-4 w-4" />
                      <span>12 people viewing now</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-orange-600">
                      {propertyData.price}
                    </div>
                    <div className="text-sm text-slate-600">
                      {propertyData.pricePerMonth}
                    </div>
                  </div>
                </div>

                {/* Key Features */}
                <div className="flex items-center gap-6 pt-4 border-t border-slate-200">
                  <div className="flex items-center gap-2">
                    <Bed className="h-5 w-5 text-slate-400" />
                    <span className="font-semibold text-slate-900">{propertyData.beds}</span>
                    <span className="text-slate-600 text-sm">Beds</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bath className="h-5 w-5 text-slate-400" />
                    <span className="font-semibold text-slate-900">{propertyData.baths}</span>
                    <span className="text-slate-600 text-sm">Baths</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Square className="h-5 w-5 text-slate-400" />
                    <span className="font-semibold text-slate-900">{propertyData.sqft}</span>
                    <span className="text-slate-600 text-sm">sqft</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Home className="h-5 w-5 text-slate-400" />
                    <span className="font-semibold text-slate-900">{propertyData.type}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-4">About this property</h2>
                <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                  {propertyData.description}
                </p>
              </CardContent>
            </Card>

            {/* Amenities */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Amenities</h2>
                <div className="grid grid-cols-2 gap-4">
                  {propertyData.amenities.map((amenity, index) => {
                    const Icon = amenity.icon
                    return (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
                          <Icon className="h-5 w-5 text-orange-600" />
                        </div>
                        <span className="text-slate-700 font-medium">{amenity.label}</span>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Features</h2>
                <div className="grid grid-cols-2 gap-3">
                  {propertyData.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-orange-600 flex-shrink-0" />
                      <span className="text-slate-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Owner */}
            <Card className="sticky top-32">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={propertyData.owner.avatar} />
                    <AvatarFallback>{propertyData.owner.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-bold text-slate-900">{propertyData.owner.name}</h3>
                    <p className="text-sm text-slate-600">{propertyData.owner.properties} properties</p>
                    {propertyData.owner.verified && (
                      <Badge variant="secondary" className="mt-1">
                        <Check className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Nulo Savings Badge */}
                <div className="bg-gradient-to-r from-green-50 via-emerald-50 to-green-50 border border-green-200/80 rounded-xl px-4 py-3 mb-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-1.5">
                    <TrendingDown className="h-5 w-5 text-green-600" />
                    <p className="text-sm font-bold text-green-700">
                      Pay ₦2,660,000/mo with Nulo
                    </p>
                  </div>
                  <p className="text-sm text-green-600 font-semibold">
                    💰 Save ₦1,680,000/year
                  </p>
                </div>

                {/* Primary CTAs */}
                <div className="space-y-3">
                  <Button 
                    className="w-full h-12 text-sm font-bold bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl"
                    onClick={() => toast.success('Opening tour booking...')}
                  >
                    <Calendar className="h-5 w-5 mr-2" />
                    Book Tour
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full h-12 text-sm font-bold border-2 border-slate-200 hover:border-green-500 hover:text-green-600 hover:bg-green-50 transition-all duration-300 rounded-xl shadow-sm hover:shadow-md"
                    onClick={() => toast.info('Checking availability...')}
                  >
                    <CheckCircle2 className="h-5 w-5 mr-2" />
                    Check Availability
                  </Button>
                </div>

                {/* Secondary Actions */}
                <div className="pt-4 mt-4 border-t border-slate-100 space-y-2">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    onClick={() => toast.info('Opening chat...')}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    onClick={() => toast.info('Calling owner...')}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Call Owner
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Full Screen Gallery Modal */}
      {showGallery && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white hover:bg-white/20"
            onClick={() => setShowGallery(false)}
          >
            <X className="h-6 w-6" />
          </Button>

          <div className="w-full h-full flex items-center justify-center p-4">
            <img
              src={propertyData.images[selectedImage]}
              alt={`Property ${selectedImage + 1}`}
              className="max-w-full max-h-full object-contain"
            />
          </div>

          {/* Thumbnails */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/50 p-2 rounded-lg backdrop-blur-sm">
            {propertyData.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                  selectedImage === index ? 'border-orange-500 scale-110' : 'border-transparent'
                }`}
              >
                <img src={image} alt={`Thumb ${index + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

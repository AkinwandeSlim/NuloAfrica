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
import { ViewingRequestModal, type ViewingRequestData } from "@/components/ViewingRequestModal"

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
    verifiedId: true,
    properties: 15,
    responseRate: 98,
    responseTime: "within 2 hours",
    trustScore: 92,
    memberSince: "2022",
  },
  trustScore: 92,
  availability: "Available Now",
  lastVerified: "2 days ago",
  viewingAvailable: true,
}

export default function PropertyDetailPage() {
  const [selectedImage, setSelectedImage] = useState(0)
  const [showGallery, setShowGallery] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [showChatModal, setShowChatModal] = useState(false)
  const [showViewingModal, setShowViewingModal] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)
  const [activeTab, setActiveTab] = useState<'description' | 'amenities' | 'neighborhood' | 'landlord'>('description')
  const router = useRouter()
  const { user } = useAuth()

  const toggleFavorite = () => {
    if (!user) {
      toast.error('Please sign in to save properties')
      router.push('/signin')
      return
    }
    setIsFavorite(!isFavorite)
    toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites')
  }

  const handleRequestViewing = () => {
    if (!user) {
      toast.error('Please sign in to request a viewing')
      router.push('/signin')
      return
    }
    setShowViewingModal(true)
  }

  const handleChatLandlord = () => {
    if (!user) {
      toast.error('Please sign in to chat with landlord')
      router.push('/signin')
      return
    }
    setShowChatModal(true)
  }

  const handleReportConcern = () => {
    if (!user) {
      toast.error('Please sign in to report concerns')
      router.push('/signin')
      return
    }
    setShowReportModal(true)
  }

  const confirmViewing = (data: ViewingRequestData) => {
    // TODO: Send to API
    console.log('Viewing request data:', data)
    
    toast.success(
      <div>
        <p className="font-semibold">✅ Viewing Request Sent!</p>
        <p className="text-xs text-slate-600 mt-1">
          {propertyData.owner.name} will respond {propertyData.owner.responseTime}.
        </p>
      </div>,
      { duration: 5000 }
    )
    
    setShowViewingModal(false)
    
    // Log to tenant dashboard (TODO: implement)
    // Save to localStorage for now
    const viewingRequests = JSON.parse(localStorage.getItem('viewingRequests') || '[]')
    viewingRequests.push({
      propertyId: propertyData.id,
      propertyTitle: propertyData.title,
      landlordName: propertyData.owner.name,
      requestDate: new Date().toISOString(),
      viewingDate: data.date,
      timeSlot: data.timeSlot,
      status: 'pending',
      ...data
    })
    localStorage.setItem('viewingRequests', JSON.stringify(viewingRequests))
  }

  const sendMessage = (message: string) => {
    toast.success('Message sent securely via Nulo escrow chat')
    setShowChatModal(false)
    // Protected chat logging
  }

  const submitReport = (reason: string) => {
    toast.success('Report submitted. Our trust & safety team will review within 24 hours.')
    setShowReportModal(false)
    // Flag for admin review
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
      {/* Breadcrumb Navigation - Mobile Optimized */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-2 md:py-3">
          <nav className="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm overflow-x-auto scrollbar-hide">
            <Link href="/" className="text-slate-600 hover:text-orange-600 transition-colors font-medium whitespace-nowrap">
              Home
            </Link>
            <ChevronRight className="h-3 md:h-4 w-3 md:w-4 text-slate-400 flex-shrink-0" />
            <Link href="/properties" className="text-slate-600 hover:text-orange-600 transition-colors font-medium whitespace-nowrap">
              Properties
            </Link>
            <ChevronRight className="h-3 md:h-4 w-3 md:w-4 text-slate-400 flex-shrink-0" />
            <span className="text-slate-900 font-semibold truncate max-w-[150px] md:max-w-[300px]">
              {propertyData.title}
            </span>
          </nav>
        </div>
      </div>

      {/* Modern Image Gallery - Mobile Responsive */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-1 md:gap-2 h-[300px] md:h-[500px] rounded-xl md:rounded-2xl overflow-hidden">
          {/* Main Large Image */}
          <div 
            className="col-span-2 row-span-2 relative group cursor-pointer overflow-hidden bg-slate-100"
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
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {propertyData.featured && (
                <div className="bg-orange-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-md">
                  ⭐ Featured
                </div>
              )}
              {propertyData.owner.verified && (
                <div className="bg-green-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-md flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Verified Listing
                </div>
              )}
            </div>
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

        {/* Action Buttons Overlay - Mobile Optimized */}
        <div className="flex items-center justify-end gap-2 -mt-12 md:-mt-16 relative z-10 px-2 md:px-4">
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

      {/* Property Details - Mobile First Layout */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 pb-8 md:pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            {/* Title & Price - Mobile Optimized */}
            <Card>
              <CardContent className="p-4 md:p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2 leading-tight">
                      {propertyData.title}
                    </h1>
                    <div className="flex items-center gap-2 text-slate-600 mb-3">
                      <MapPin className="h-4 w-4 flex-shrink-0" />
                      <span className="text-sm md:text-base">{propertyData.location}</span>
                    </div>
                    {/* Trust & Availability Badges */}
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <div className="inline-flex items-center gap-1.5 bg-orange-50 border border-orange-200 text-orange-700 px-2.5 py-1 rounded-lg text-xs font-semibold">
                        <Eye className="h-3.5 w-3.5" />
                        <span>12 viewing now</span>
                      </div>
                      <div className="inline-flex items-center gap-1.5 bg-green-50 border border-green-200 text-green-700 px-2.5 py-1 rounded-lg text-xs font-semibold">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>{propertyData.availability}</span>
                      </div>
                      <div className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-200 text-blue-700 px-2.5 py-1 rounded-lg text-xs font-semibold">
                        <Shield className="h-3.5 w-3.5" />
                        <span>{propertyData.trustScore}% Trust Score</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-left md:text-right">
                    <div className="text-2xl md:text-3xl font-bold text-orange-600">
                      {propertyData.price}
                    </div>
                    <div className="text-sm text-slate-600">
                      {propertyData.pricePerMonth}
                    </div>
                  </div>
                </div>

                {/* Key Features - Mobile Grid */}
                <div className="grid grid-cols-2 md:flex md:items-center gap-4 md:gap-6 pt-4 border-t border-slate-200">
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

            {/* Tabbed Content */}
            <Card>
              <CardContent className="p-0">
                {/* Tab Navigation */}
                <div className="flex border-b border-slate-200 overflow-x-auto">
                  <button
                    onClick={() => setActiveTab('description')}
                    className={`px-4 md:px-6 py-3 md:py-4 text-sm md:text-base font-semibold whitespace-nowrap transition-colors ${
                      activeTab === 'description'
                        ? 'text-orange-600 border-b-2 border-orange-600'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Description
                  </button>
                  <button
                    onClick={() => setActiveTab('amenities')}
                    className={`px-4 md:px-6 py-3 md:py-4 text-sm md:text-base font-semibold whitespace-nowrap transition-colors ${
                      activeTab === 'amenities'
                        ? 'text-orange-600 border-b-2 border-orange-600'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Amenities
                  </button>
                  <button
                    onClick={() => setActiveTab('neighborhood')}
                    className={`px-4 md:px-6 py-3 md:py-4 text-sm md:text-base font-semibold whitespace-nowrap transition-colors ${
                      activeTab === 'neighborhood'
                        ? 'text-orange-600 border-b-2 border-orange-600'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Neighborhood
                  </button>
                  <button
                    onClick={() => setActiveTab('landlord')}
                    className={`px-4 md:px-6 py-3 md:py-4 text-sm md:text-base font-semibold whitespace-nowrap transition-colors ${
                      activeTab === 'landlord'
                        ? 'text-orange-600 border-b-2 border-orange-600'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Landlord Info
                  </button>
                </div>

                {/* Tab Content */}
                <div className="p-4 md:p-6">
                  {activeTab === 'description' && (
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 mb-4">About this property</h2>
                      <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                        {propertyData.description}
                      </p>
                      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-700">
                          <strong>✓ Verified:</strong> This listing was verified {propertyData.lastVerified}. Landlord cannot edit details after verification.
                        </p>
                      </div>
                    </div>
                  )}

                  {activeTab === 'amenities' && (
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 mb-4">Amenities & Features</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {propertyData.amenities.map((amenity, index) => {
                          const Icon = amenity.icon
                          return (
                            <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                              <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                                <Icon className="h-5 w-5 text-orange-600" />
                              </div>
                              <span className="text-slate-700 font-medium">{amenity.label}</span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {activeTab === 'neighborhood' && (
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 mb-4">Neighborhood Insights</h2>
                      <div className="space-y-4">
                        <div className="p-4 bg-slate-50 rounded-lg">
                          <h3 className="font-semibold text-slate-900 mb-2">📍 Location</h3>
                          <p className="text-sm text-slate-600">{propertyData.fullAddress}</p>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-lg">
                          <h3 className="font-semibold text-slate-900 mb-2">🚇 Nearby Transport</h3>
                          <p className="text-sm text-slate-600">Lekki Bus Stop - 5 min walk</p>
                          <p className="text-sm text-slate-600">Eko Hotel - 10 min drive</p>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-lg">
                          <h3 className="font-semibold text-slate-900 mb-2">🏫 Schools & Services</h3>
                          <p className="text-sm text-slate-600">Corona School - 2km</p>
                          <p className="text-sm text-slate-600">Shoprite Mall - 1.5km</p>
                        </div>
                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                          <h3 className="font-semibold text-green-900 mb-2">⚡ Energy & Security Rating</h3>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm text-green-700">Energy Efficiency:</span>
                            <div className="flex gap-0.5">
                              {[...Array(4)].map((_, i) => (
                                <div key={i} className="w-8 h-2 bg-green-500 rounded" />
                              ))}
                              <div className="w-8 h-2 bg-slate-200 rounded" />
                            </div>
                            <span className="text-xs text-green-600 font-semibold">A</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-green-700">Security Rating:</span>
                            <div className="flex gap-0.5">
                              {[...Array(5)].map((_, i) => (
                                <div key={i} className="w-8 h-2 bg-green-500 rounded" />
                              ))}
                            </div>
                            <span className="text-xs text-green-600 font-semibold">A+</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'landlord' && (
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 mb-4">Landlord Information</h2>
                      <div className="space-y-4">
                        <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg">
                          <Avatar className="h-16 w-16">
                            <AvatarImage src={propertyData.owner.avatar} />
                            <AvatarFallback className="bg-orange-500 text-white text-xl font-semibold">
                              {propertyData.owner.name[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-bold text-slate-900 text-lg">{propertyData.owner.name}</h3>
                              {propertyData.owner.verifiedId && (
                                <div className="bg-green-500 text-white text-xs font-semibold px-2 py-0.5 rounded flex items-center gap-1">
                                  <CheckCircle2 className="h-3 w-3" />
                                  ID Verified
                                </div>
                              )}
                            </div>
                            <p className="text-sm text-slate-600 mb-2">Member since {propertyData.owner.memberSince}</p>
                            <div className="flex items-center gap-4 text-sm">
                              <div>
                                <span className="font-semibold text-slate-900">{propertyData.owner.properties}</span>
                                <span className="text-slate-600"> properties</span>
                              </div>
                              <div>
                                <span className="font-semibold text-green-600">{propertyData.owner.responseRate}%</span>
                                <span className="text-slate-600"> response rate</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Contact Details - Protected */}
                        {user ? (
                          <div className="p-4 bg-slate-50 rounded-lg space-y-2">
                            <h4 className="font-semibold text-slate-900 mb-3">📞 Contact Information</h4>
                            <div className="flex items-center gap-2 text-sm text-slate-700">
                              <Phone className="h-4 w-4 text-slate-400" />
                              <span>{propertyData.owner.phone}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-700">
                              <Mail className="h-4 w-4 text-slate-400" />
                              <span>{propertyData.owner.email}</span>
                            </div>
                          </div>
                        ) : (
                          <div className="p-4 bg-orange-50 border-2 border-orange-200 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <Shield className="h-5 w-5 text-orange-600" />
                              <h4 className="font-semibold text-orange-900">Contact Details Protected</h4>
                            </div>
                            <p className="text-sm text-orange-700 mb-3">
                              Sign in to view landlord phone number and email address. This protects both tenants and landlords from spam and fraud.
                            </p>
                            <Button
                              className="w-full bg-orange-500 hover:bg-orange-600"
                              onClick={() => router.push('/signin')}
                            >
                              Sign In to View Contact Details
                            </Button>
                          </div>
                        )}
                        
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <h4 className="font-semibold text-blue-900 mb-2">🛡️ Trust & Safety</h4>
                          <ul className="space-y-1 text-sm text-blue-700">
                            <li>✓ Identity verified by Nulo Africa</li>
                            <li>✓ Responds {propertyData.owner.responseTime}</li>
                            <li>✓ All messages protected by escrow system</li>
                            <li>✓ Fair use policy enforced</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

          </div>

          {/* Sidebar - Mobile First */}
          <div className="space-y-4 md:space-y-6">
            {/* Contact Owner - Premium Design */}
            <Card className="lg:sticky lg:top-32 border-0 shadow-xl">
              <CardContent className="p-5 md:p-6">
                {/* Owner Info - Clean Card */}
                <div className="bg-slate-50 rounded-xl p-4 md:p-5 mb-5 border border-slate-200">
                  <div className="flex items-start gap-3 md:gap-4 mb-4">
                    <Avatar className="h-14 w-14 md:h-16 md:w-16">
                      <AvatarImage src={propertyData.owner.avatar} />
                      <AvatarFallback className="bg-orange-500 text-white text-lg md:text-xl font-semibold">
                        {propertyData.owner.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-slate-900 text-base md:text-lg truncate">{propertyData.owner.name}</h3>
                        {propertyData.owner.verified && (
                          <div className="bg-green-500 text-white text-xs font-semibold px-2 py-0.5 rounded flex items-center gap-1">
                            <Check className="h-3 w-3" />
                            Verified
                          </div>
                        )}
                      </div>
                      <p className="text-xs md:text-sm text-slate-600 font-medium">
                        {propertyData.owner.properties} properties listed
                      </p>
                      <div className="flex items-center gap-1 mt-1.5">
                        <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                        <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                        <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                        <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                        <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs text-slate-600 ml-1">(4.9)</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Quick Contact Info - Protected */}
                  <div className="space-y-2 pt-3 border-t border-slate-200">
                    {user ? (
                      <>
                        <div className="flex items-center gap-2 text-sm text-slate-700">
                          <Phone className="h-4 w-4 text-slate-400 flex-shrink-0" />
                          <span className="font-medium">{propertyData.owner.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-700">
                          <Mail className="h-4 w-4 text-slate-400 flex-shrink-0" />
                          <span className="font-medium truncate">{propertyData.owner.email}</span>
                        </div>
                      </>
                    ) : (
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Shield className="h-4 w-4 text-orange-600" />
                          <p className="text-xs font-semibold text-orange-900">Contact Details Protected</p>
                        </div>
                        <p className="text-xs text-orange-700 mb-2">
                          Sign in to view landlord contact information
                        </p>
                        <Button
                          size="sm"
                          className="w-full h-8 text-xs bg-orange-500 hover:bg-orange-600"
                          onClick={() => router.push('/signin')}
                        >
                          Sign In to View Contact
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Nulo Savings Badge - Simplified */}
                <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 mb-5">
                  <div className="flex items-center gap-2 mb-1.5">
                    <TrendingDown className="h-4 w-4 text-green-600" />
                    <p className="text-sm md:text-base font-semibold text-green-700">
                      Pay ₦2,660,000/mo with Nulo
                    </p>
                  </div>
                  <p className="text-xs md:text-sm text-green-600 font-medium">
                    Save ₦1,680,000/year
                  </p>
                </div>

                {/* Tenant Action Buttons */}
                <div className="space-y-2.5">
                  <Button 
                    className="w-full h-11 md:h-12 text-sm md:text-base font-semibold bg-orange-500 hover:bg-orange-600 text-white transition-all rounded-lg"
                    onClick={handleRequestViewing}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Request Viewing 📅
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full h-11 md:h-12 text-sm md:text-base font-semibold border-2 border-slate-200 hover:border-orange-500 hover:bg-orange-50 hover:text-orange-600 transition-all rounded-lg"
                    onClick={handleChatLandlord}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Chat with Landlord 💬
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full h-11 md:h-12 text-sm md:text-base font-semibold border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all rounded-lg"
                    onClick={toggleFavorite}
                  >
                    <Heart className={`h-4 w-4 mr-2 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                    {isFavorite ? 'Saved ❤️' : 'Save Property ❤️'}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full h-11 md:h-12 text-sm md:text-base font-semibold border-2 border-red-200 text-red-600 hover:border-red-500 hover:bg-red-50 transition-all rounded-lg"
                    onClick={handleReportConcern}
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Report Concern ⚠️
                  </Button>
                </div>

                {/* Trust & Safety Note */}
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-xs text-blue-700">
                    <strong>🛡️ Protected by Nulo:</strong> All interactions use our secure escrow system. Both parties can rate each other post-interaction.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Viewing Request Modal */}
      <ViewingRequestModal
        isOpen={showViewingModal}
        onClose={() => setShowViewingModal(false)}
        onConfirm={confirmViewing}
        propertyTitle={propertyData.title}
        landlordName={propertyData.owner.name}
        landlordResponseTime={propertyData.owner.responseTime}
      />

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

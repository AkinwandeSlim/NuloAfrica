"use client"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  MapPin, Bed, Bath, Square, Heart, Share2, ChevronLeft, ChevronRight,
  Home, Wifi, Car, Dumbbell, Shield, Wind, Tv, Coffee, Check, Phone, Mail, Calendar, Star, Navigation, X, MessageCircle, Eye, EyeOff
} from "lucide-react"
import Link from "next/link"
import VirtualTourSection from "@/components/VirtualTourSection"
import RequestInfoForm from "@/components/RequestInfoForm"
import InAppMessaging from "@/components/InAppMessaging"
import VisitScheduler from "@/components/VisitScheduler"
import AutomatedFollowUp from "@/components/AutomatedFollowUp"
import { ProfileGateModal } from "@/components/profile/ProfileGateModal"
import { ProfileCompletionBanner } from "@/components/profile/ProfileCompletionBanner"
import { LockedCTAButton } from "@/components/property/LockedCTAButton"
import { tenantsAPI } from "@/lib/api"
import { toast } from "sonner"

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
  const [showImageModal, setShowImageModal] = useState(false)
  const [showScheduler, setShowScheduler] = useState(false)
  const [showFollowUp, setShowFollowUp] = useState(false)
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [showProfileGate, setShowProfileGate] = useState(false)
  const [profileCompletion, setProfileCompletion] = useState(0)
  const [loadingProfile, setLoadingProfile] = useState(false)
  
  // Real Supabase Authentication
  const router = useRouter()
  const { user, profile, loading } = useAuth()
  const isAuthenticated = !!user
  
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
    if (mapRef.current && typeof window !== 'undefined' && window.google && window.google.maps && propertyData.latitude && propertyData.longitude) {
      if (!googleMapRef.current) {
        try {
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
        } catch (error) {
          console.error('Failed to initialize Google Map:', error)
        }
      }
    }
  }, [])

  // Fetch profile status when user is authenticated
  useEffect(() => {
    const fetchProfileStatus = async () => {
      if (isAuthenticated && user) {
        setLoadingProfile(true)
        try {
          const status = await tenantsAPI.getProfileStatus()
          setProfileCompletion(status.profile_completion)
        } catch (error) {
          console.error('Error fetching profile status:', error)
          // Default to 0 if error
          setProfileCompletion(0)
        } finally {
          setLoadingProfile(false)
        }
      }
    }

    fetchProfileStatus()
  }, [isAuthenticated, user])

  // Handle protected actions - redirect to signin if not authenticated
  const requireAuth = (action: string) => {
    if (!isAuthenticated) {
      // Redirect to signin with callback URL
      const currentPath = window.location.pathname
      router.push(`/signin?callbackUrl=${encodeURIComponent(currentPath)}&action=${action}`)
      return false
    }
    return true
  }

  // Handle apply button click
  const handleApplyClick = () => {
    if (!requireAuth("apply")) return
    
    // Check if profile is complete
    if (profileCompletion < 100) {
      setShowProfileGate(true)
    } else {
      router.push(`/properties/${propertyData.id}/apply`)
    }
  }

  // Handle complete profile navigation
  const handleCompleteProfile = () => {
    setShowProfileGate(false)
    router.push('/tenant/complete-profile')
  }

  const handleMessageOwner = () => {
    if (requireAuth("message")) {
      // Messaging will open (InAppMessaging component)
      console.log("Opening messaging...")
    }
  }

  const handleScheduleVisit = () => {
    if (requireAuth("schedule")) {
      setShowScheduler(true)
    }
  }

  const handleViewContact = () => {
    if (requireAuth("view_contact")) {
      setShowContactModal(true)
    }
  }

  const handleGetDirections = () => {
    if (!requireAuth("directions")) return
    
    if (propertyData.latitude && propertyData.longitude) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${propertyData.latitude},${propertyData.longitude}`
      window.open(url, '_blank')
    }
  }

  // Authentication is now handled by Supabase via redirect to /signin

  return (
    <div className="min-h-screen bg-white">
      {/* Mobile-Only Sticky Header */}
      <div className="sticky top-16 z-40 bg-white border-b border-slate-200 lg:hidden">
        <div className="container mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Back Button */}
            <Link href="/properties">
              <Button variant="ghost" size="sm" className="text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
            </Link>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <Heart
                  className={`h-5 w-5 transition-all ${
                    isFavorite ? "fill-red-500 text-red-500" : "text-slate-600"
                  }`}
                />
              </button>
              <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
                <Share2 className="h-5 w-5 text-slate-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Image - Sleek Full Width */}
      <section className="container mx-auto px-4 md:px-6 py-6">
        <div 
          className="relative h-[450px] md:h-[550px] rounded-xl overflow-hidden cursor-pointer group shadow-lg"
          onClick={() => setShowImageModal(true)}
        >
          <img
            src={propertyData.images[currentImageIndex] || "/placeholder.svg"}
            alt={`${propertyData.title}`}
            className="w-full h-full object-cover"
          />
          
          {/* Navigation Buttons */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              prevImage()
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 bg-white/95 backdrop-blur-sm rounded-full hover:bg-white transition-all opacity-0 group-hover:opacity-100 shadow-lg"
          >
            <ChevronLeft className="h-5 w-5 text-slate-900" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              nextImage()
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 bg-white/95 backdrop-blur-sm rounded-full hover:bg-white transition-all opacity-0 group-hover:opacity-100 shadow-lg"
          >
            <ChevronRight className="h-5 w-5 text-slate-900" />
          </button>

          {/* Image Counter */}
          <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-black/75 backdrop-blur-sm rounded-lg text-white text-sm font-medium">
            {currentImageIndex + 1} / {propertyData.images.length}
          </div>
        </div>
      </section>

      {/* Main Content - Clean Rentful Style */}
      <section className="container mx-auto px-4 md:px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Property Details */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Property Title & Basic Info */}
            <div className="space-y-4">
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
                {propertyData.title}
              </h1>
              
              <div className="flex items-center gap-2 text-slate-600">
                <MapPin className="h-5 w-5 text-[#FF6600]" />
                <span className="text-base font-medium">{propertyData.location}, {propertyData.city}</span>
              </div>

              {/* Key Stats - Clean Horizontal */}
              <div className="flex flex-wrap items-center gap-8 py-5 border-y border-slate-200">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Monthly Rent</p>
                  <p className="text-3xl font-bold text-[#FF6600]">${propertyData.price.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Bedrooms</p>
                  <p className="text-xl font-bold text-slate-900">{propertyData.beds}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Bathrooms</p>
                  <p className="text-xl font-bold text-slate-900">{propertyData.baths}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Square Feet</p>
                  <p className="text-xl font-bold text-slate-900">{propertyData.sqft} sq ft</p>
                </div>
              </div>
            </div>

            {/* About Section - Minimal */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900">About This Property</h2>
              <div className={`text-slate-700 leading-relaxed text-base ${showFullDescription ? '' : 'line-clamp-4'}`}>
                {propertyData.description}
              </div>
              <button
                onClick={() => setShowFullDescription(!showFullDescription)}
                className="text-sm text-[#FF6600] hover:text-orange-700 font-semibold flex items-center gap-1"
              >
                {showFullDescription ? 'Show less' : 'Show more'}
                <ChevronRight className={`h-4 w-4 transition-transform ${showFullDescription ? 'rotate-90' : ''}`} />
              </button>
            </div>

            {/* Amenities - Simple List */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900">Amenities</h2>
              <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                {propertyData.amenities.map((amenity, index) => {
                  const Icon = amenity.icon
                  return (
                    <div key={index} className="flex items-center gap-3 text-base text-slate-700 font-medium">
                      <div className="w-9 h-9 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
                        <Icon className="h-5 w-5 text-[#FF6600]" />
                      </div>
                      <span>{amenity.label}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Location - Simple with Link */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900">Location</h2>
              <div className="relative h-72 bg-gradient-to-br from-orange-50 to-slate-50 rounded-xl overflow-hidden border-2 border-slate-200 flex items-center justify-center">
                <div className="text-center px-6">
                  <div className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center mx-auto mb-4">
                    <MapPin className="h-8 w-8 text-[#FF6600]" />
                  </div>
                  <p className="text-slate-900 mb-5 text-base font-semibold">{propertyData.fullAddress}</p>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(propertyData.fullAddress)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-[#FF6600] transition-all text-sm font-bold shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    <Navigation className="h-4 w-4" />
                    Get Directions
                  </a>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column - Contact Card (Sleek) */}
          <div className="lg:sticky lg:top-24 h-fit">
            {/* Owner Info Card */}
            <Card className="bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                {isAuthenticated ? (
                  <>
                    {/* Authenticated: Show Full Owner Info */}
                    <div className="flex items-center gap-4 mb-6">
                      <Avatar className="h-14 w-14 border-2 border-slate-100">
                        <AvatarImage src={propertyData.owner.avatar} />
                        <AvatarFallback className="bg-slate-900 text-white font-semibold text-lg">
                          {propertyData.owner.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-slate-900 text-lg">{propertyData.owner.name}</h4>
                          {propertyData.owner.verified && (
                            <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                              <Check className="h-3 w-3 text-white" />
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-slate-600 font-medium">Verified Owner</p>
                      </div>
                    </div>

                    {/* Language & Availability */}
                    <div className="space-y-2.5 text-sm text-slate-700 mb-6 pb-6 border-b border-slate-100">
                      <p className="font-medium"><span className="text-slate-500">Language:</span> English, Bahasa</p>
                      <p className="font-medium"><span className="text-slate-500">Available:</span> Monday - Sunday</p>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Not Authenticated: Modern Blurred/Hidden Info */}
                    <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
                      <div className="relative h-14 w-14 group">
                        {/* Blurred Avatar Background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full" />
                        
                        {/* Modern Lock Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="relative">
                            {/* Animated Ring */}
                            <div className="absolute inset-0 w-8 h-8 -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                              <div className="w-full h-full rounded-full border-2 border-slate-400/30 animate-ping" />
                            </div>
                            {/* Lock Icon Container */}
                            <div className="relative w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
                              <svg 
                                className="w-4 h-4 text-slate-700" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                              >
                                <path 
                                  strokeLinecap="round" 
                                  strokeLinejoin="round" 
                                  strokeWidth={2} 
                                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
                                />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="h-5 w-32 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded animate-pulse" />
                          <Check className="h-4 w-4 text-green-600" />
                        </div>
                        <p className="text-xs text-slate-500">Verified Owner</p>
                      </div>
                    </div>
                  </>
                )}

                {/* Contact Actions */}
                {isAuthenticated ? (
                  <>
                    {/* Profile Completion Warning */}
                    {profileCompletion < 100 && (
                      <div className="mb-4 p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200">
                        <p className="text-sm font-bold text-slate-900 mb-1.5">
                          ⚠️ Complete your profile to apply
                        </p>
                        <p className="text-xs text-slate-700 leading-relaxed font-medium">
                          {profileCompletion}% complete • Takes only 2 minutes
                        </p>
                      </div>
                    )}
                    
                    {profileCompletion < 100 ? (
                      <LockedCTAButton
                        label="Submit Application"
                        reason="Complete your profile to apply to properties"
                        onClick={handleApplyClick}
                        className="w-full h-12 bg-[#FF6600] hover:bg-orange-700 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-xl hover:scale-105"
                      />
                    ) : (
                      <Button 
                        onClick={handleApplyClick}
                        className="w-full h-12 bg-[#FF6600] hover:bg-orange-700 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-xl hover:scale-105"
                      >
                        Submit Application
                      </Button>
                    )}
                  </>
                ) : (
                  <>
                    {/* Single Clean Warning */}
                    <div className="mb-4 p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200">
                      <p className="text-sm font-bold text-slate-900 mb-1.5">
                        🔐 Sign in to contact owner
                      </p>
                      <p className="text-xs text-slate-700 leading-relaxed font-medium">
                        Create a free account to view owner details and submit your application
                      </p>
                    </div>
                    
                    <Button 
                      onClick={() => requireAuth("message")}
                      className="w-full h-12 bg-[#FF6600] hover:bg-orange-700 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-xl hover:scale-105"
                    >
                      Sign in to Apply
                    </Button>
                  </>
                )}

                {/* Security Notice - Simple Text Only */}
                <p className="mt-4 text-xs text-center text-slate-600 font-medium">
                  🔒 All communication happens securely within the platform
                </p>
              </CardContent>
            </Card>

          </div>
        </div>
      </section>

      {/* Modals */}
      {showScheduler && (
        <VisitScheduler
          propertyTitle={propertyData.title}
          onClose={() => setShowScheduler(false)}
        />
      )}

      {showFollowUp && (
        <AutomatedFollowUp
          propertyTitle={propertyData.title}
          onClose={() => setShowFollowUp(false)}
        />
      )}

      {isAuthenticated && (
        <InAppMessaging
          propertyTitle={propertyData.title}
          landlordName={propertyData.owner.name}
          landlordAvatar={propertyData.owner.avatar}
          landlordVerified={propertyData.owner.verified}
          onScheduleVisit={handleScheduleVisit}
          onRequestCall={() => {
            window.location.href = `tel:${propertyData.owner.phone}`
          }}
        />
      )}

      {/* Profile Gate Modal */}
      <ProfileGateModal
        isOpen={showProfileGate}
        onClose={() => setShowProfileGate(false)}
        profileCompletion={profileCompletion}
        onCompleteNow={handleCompleteProfile}
      />

    </div>
  )
}

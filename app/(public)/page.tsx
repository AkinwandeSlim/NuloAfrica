"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Footer } from "@/components/footer"
import { 
  HeroSection, 
  FeaturesSection, 
  StatsSection, 
  HowItWorksSection,
  PopularCitiesSection,
  TestimonialsSection,
  CTASection
} from "@/components/home"

export default function HomePage() {
  const [location, setLocation] = useState("")
  const [priceRange, setPriceRange] = useState([0, 1000000])
  const [propertyType, setPropertyType] = useState("Property Type")
  const [showAdvanced, setShowAdvanced] = useState(false)
  const locationInputRef = useRef<HTMLInputElement>(null)
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)

  // Initialize Google Maps Autocomplete
  useEffect(() => {
    if (typeof window !== 'undefined' && window.google && window.google.maps && locationInputRef.current) {
      try {
        autocompleteRef.current = new google.maps.places.Autocomplete(locationInputRef.current, {
          types: ['(cities)'],
          componentRestrictions: { country: ['ke', 'ng', 'gh', 'za', 'tz', 'rw', 'ma', 'eg'] }, // African countries
        })

        autocompleteRef.current.addListener('place_changed', () => {
          const place = autocompleteRef.current?.getPlace()
          if (place?.formatted_address) {
            setLocation(place.formatted_address)
          }
        })
      } catch (error) {
        console.error('Failed to initialize Google Maps Autocomplete:', error)
      }
    }
  }, [])

  const propertyTypes = ['All Types', 'Apartment', 'House', 'Villa', 'Penthouse', 'Studio', 'Loft']

  const formatPrice = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`
    return `$${value}`
  }

  const popularCities = [
    {
      name: "Lagos",
      country: "Nigeria",
      properties: 456,
      image: "/lagos-victoria-island-skyline.jpg",
      description: "Nigeria's commercial capital with vibrant city life",
    },
    {
      name: "Abuja",
      country: "Nigeria",
      properties: 267,
      image: "/african-cityscape.jpg",
      description: "Nigeria's modern capital city with planned infrastructure",
    },
    {
      name: "Port Harcourt",
      country: "Nigeria",
      properties: 189,
      image: "/contemporary-townhouse-johannesburg.jpg",
      description: "The Garden City - Nigeria's oil and gas hub",
    },
  ]

  // Animation variants for sections
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 overflow-hidden relative">
      {/* Extended Background Textures - Optimized */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Static Texture Overlays */}
        <div className="absolute inset-0 texture-dots opacity-5" />
        <div className="absolute inset-0 texture-square-grid opacity-8" />
        <div className="absolute inset-0 texture-noise opacity-10" />
      </div>

      {/* Content Container */}
      <div className="relative z-10">
        {/* Hero Section - Ultra Modern with Floating Bubbles */}
        <HeroSection
          location={location}
          setLocation={setLocation}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          propertyType={propertyType}
          setPropertyType={setPropertyType}
          showAdvanced={showAdvanced}
          setShowAdvanced={setShowAdvanced}
          locationInputRef={locationInputRef}
        />

      {/* Features Section with Animation */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
      >
        <FeaturesSection />
      </motion.div>

      {/* Stats Section with Animation */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
      >
        <StatsSection />
      </motion.div>

      {/* How It Works Section with Animation */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
      >
        <HowItWorksSection />
      </motion.div>

      {/* Popular Cities Section with Animation */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
      >
        <PopularCitiesSection cities={popularCities} />
      </motion.div>

      {/* Testimonials Section with Animation */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
      >
        <TestimonialsSection />
      </motion.div>

      {/* CTA Section with Animation */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
      >
        <CTASection />
      </motion.div>

      {/* Footer with Animation */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={sectionVariants}
      >
        <Footer />
      </motion.div>
      </div>
    </div>
  )
}

"use client"

import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { MapPin, X } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import Link from 'next/link'

// Set your Mapbox access token
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ''
mapboxgl.accessToken = MAPBOX_TOKEN

// Debug: Log token status
console.log('🗺️ Mapbox Token Status:', MAPBOX_TOKEN ? '✅ Token Found' : '❌ Token Missing')
console.log('🗺️ Token Preview:', MAPBOX_TOKEN ? MAPBOX_TOKEN.substring(0, 20) + '...' : 'No token')

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
  latitude: number
  longitude: number
}

interface PropertyMapProps {
  properties: Property[]
  selectedProperty: Property | null
  onPropertySelect: (property: Property | null) => void
}

export default function PropertyMap({ properties, selectedProperty, onPropertySelect }: PropertyMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const markers = useRef<mapboxgl.Marker[]>([])
  const [mapLoaded, setMapLoaded] = useState(false)

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return

    console.log('🗺️ Initializing map...')

    try {
      // Create map instance
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [7.5, 8.5], // Center of Nigeria
        zoom: 6,
        attributionControl: false
      })

      console.log('🗺️ Map instance created')

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right')

    // Add fullscreen control
    map.current.addControl(new mapboxgl.FullscreenControl(), 'top-right')

    // Add geolocate control
    map.current.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true,
        showUserHeading: true
      }),
      'top-right'
    )

      map.current.on('load', () => {
        console.log('🗺️ Map loaded successfully')
        setMapLoaded(true)
      })

      map.current.on('error', (e) => {
        console.error('🗺️ Map error:', e)
      })

    } catch (error) {
      console.error('🗺️ Failed to initialize map:', error)
    }

    return () => {
      map.current?.remove()
      map.current = null
    }
  }, [])

  // Update markers when properties change
  useEffect(() => {
    if (!map.current || !mapLoaded) return

    console.log(`🗺️ Adding ${properties.length} markers to map`)

    // Remove existing markers
    markers.current.forEach(marker => marker.remove())
    markers.current = []

    // Add new markers
    properties.forEach(property => {
      console.log(`📍 Adding marker for: ${property.title} at [${property.longitude}, ${property.latitude}]`)
      // Create custom marker element
      const el = document.createElement('div')
      el.className = 'custom-marker'
      el.style.width = '40px'
      el.style.height = '40px'
      el.style.cursor = 'pointer'
      
      // Create marker content
      el.innerHTML = `
        <div class="relative group">
          <div class="absolute -top-12 left-1/2 -translate-x-1/2 bg-white px-3 py-1 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-sm font-semibold">
            $${(property.price / 1000).toFixed(0)}k
          </div>
          <div class="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center shadow-lg hover:bg-amber-600 transition-all hover:scale-110 ${
            selectedProperty?.id === property.id ? 'ring-4 ring-amber-300 scale-125' : ''
          }">
            <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>
      `

      // Create marker
      const marker = new mapboxgl.Marker(el)
        .setLngLat([property.longitude, property.latitude])
        .addTo(map.current!)

      // Add click event
      el.addEventListener('click', () => {
        onPropertySelect(property)
        
        // Fly to property location
        map.current?.flyTo({
          center: [property.longitude, property.latitude],
          zoom: 14,
          duration: 1500
        })
      })

      markers.current.push(marker)
    })

    // Fit bounds to show all properties
    if (properties.length > 0) {
      const bounds = new mapboxgl.LngLatBounds()
      properties.forEach(property => {
        bounds.extend([property.longitude, property.latitude])
      })
      map.current.fitBounds(bounds, {
        padding: 100,
        maxZoom: 12
      })
    }
  }, [properties, mapLoaded, selectedProperty, onPropertySelect])

  // Fly to selected property
  useEffect(() => {
    if (!map.current || !selectedProperty) return

    map.current.flyTo({
      center: [selectedProperty.longitude, selectedProperty.latitude],
      zoom: 14,
      duration: 1500
    })
  }, [selectedProperty])

  return (
    <div className="relative w-full h-full">
      {/* Map Container */}
      <div ref={mapContainer} className="absolute inset-0" />

      {/* Loading Overlay */}
      {!mapLoaded && (
        <div className="absolute inset-0 bg-slate-100 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600">Loading map...</p>
          </div>
        </div>
      )}

      {/* Selected Property Popup */}
      {selectedProperty && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-96 max-w-[calc(100%-2rem)] z-10">
          <Card className="border-0 luxury-shadow-xl">
            <div className="relative">
              <img
                src={selectedProperty.image}
                alt={selectedProperty.title}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onPropertySelect(null)}
                className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm hover:bg-white"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <CardContent className="p-4">
              <h3 className="font-bold text-lg text-slate-900 mb-1">
                {selectedProperty.title}
              </h3>
              <p className="text-sm text-slate-600 mb-3 flex items-center gap-1">
                <MapPin className="h-4 w-4 text-amber-600" />
                {selectedProperty.location}
              </p>

              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-2xl font-bold text-amber-600">
                  ${(selectedProperty.price / 1000).toFixed(0)}k
                </span>
                <span className="text-sm text-slate-500">
                  or ${selectedProperty.pricePerMonth}/mo
                </span>
              </div>

              <div className="flex items-center gap-4 text-sm text-slate-600 mb-4">
                <div className="flex items-center gap-1">
                  <svg className="h-4 w-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span>{selectedProperty.beds} beds</span>
                </div>
                <div className="flex items-center gap-1">
                  <svg className="h-4 w-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{selectedProperty.baths} baths</span>
                </div>
                <div className="flex items-center gap-1">
                  <svg className="h-4 w-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                  <span>{selectedProperty.sqft.toLocaleString()} sqft</span>
                </div>
              </div>

              <Link href={`/properties/${selectedProperty.id}`}>
                <Button className="w-full luxury-gradient-button text-white">
                  View Full Details
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Map Legend */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 luxury-shadow-md">
        <div className="flex items-center gap-2 text-sm">
          <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
            <MapPin className="h-4 w-4 text-white" />
          </div>
          <span className="font-medium text-slate-700">
            {properties.length} Properties
          </span>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { MapPin, X } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import Link from 'next/link'

// Fix Leaflet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

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
  featured: boolean
  latitude: number
  longitude: number
  description?: string
}

interface PropertyMapProps {
  properties: Property[]
  selectedProperty: Property | null
  onPropertySelect: (property: Property | null) => void
}

// Custom marker icon
const createCustomIcon = (isSelected: boolean) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div class="relative">
        <div class="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center shadow-lg hover:bg-amber-600 transition-all hover:scale-110 ${
          isSelected ? 'ring-4 ring-amber-300 scale-125' : ''
        }">
          <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
          </svg>
        </div>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
  })
}

// Helper function to validate coordinates
const isValidCoordinate = (lat: number, lng: number): boolean => {
  return !isNaN(lat) && !isNaN(lng) && 
         lat >= -90 && lat <= 90 && 
         lng >= -180 && lng <= 180
}

// Component to fit map bounds
function FitBounds({ properties }: { properties: Property[] }) {
  const map = useMap()

  useEffect(() => {
    if (properties.length > 0) {
      // Filter properties with valid coordinates
      const validProperties = properties.filter(p => 
        isValidCoordinate(p.latitude, p.longitude)
      )
      
      if (validProperties.length > 0) {
        const bounds = L.latLngBounds(
          validProperties.map(p => [p.latitude, p.longitude] as [number, number])
        )
        map.fitBounds(bounds, { padding: [50, 50] })
      }
    }
  }, [properties, map])

  return null
}

// Component to handle selected property
function FlyToProperty({ property }: { property: Property | null }) {
  const map = useMap()

  useEffect(() => {
    if (property) {
      console.log('🎯 FlyToProperty: Attempting to fly to property', {
        title: property.title,
        lat: property.latitude,
        lng: property.longitude,
        isValid: isValidCoordinate(property.latitude, property.longitude)
      })
      
      if (isValidCoordinate(property.latitude, property.longitude)) {
        try {
          map.flyTo([property.latitude, property.longitude], 14, {
            duration: 1.5
          })
        } catch (error) {
          console.error('❌ Error flying to property:', error)
        }
      } else {
        console.warn('⚠️ Skipping flyTo - Invalid coordinates for property:', property.title)
      }
    }
  }, [property, map])

  return null
}

export default function PropertyMapLeaflet({ properties, selectedProperty, onPropertySelect }: PropertyMapProps) {
  const [mapReady, setMapReady] = useState(false)

  console.log('🗺️ Leaflet Map: Rendering with', properties.length, 'properties')

  return (
    <div className="relative w-full h-full">
      {/* Map Container */}
      <MapContainer
        center={[8.5, 7.5]} // Center of Nigeria
        zoom={6}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
        whenReady={() => {
          console.log('🗺️ Leaflet Map: Ready!')
          setMapReady(true)
        }}
      >
        {/* OpenStreetMap Tiles - FREE! */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Fit bounds to show all properties */}
        <FitBounds properties={properties} />

        {/* Fly to selected property */}
        <FlyToProperty property={selectedProperty} />

        {/* Property Markers */}
        {properties
          .filter(property => isValidCoordinate(property.latitude, property.longitude))
          .map((property) => (
            <Marker
              key={property.id}
              position={[property.latitude, property.longitude]}
              icon={createCustomIcon(selectedProperty?.id === property.id)}
              eventHandlers={{
                click: () => {
                  console.log('📍 Marker clicked:', property.title)
                  onPropertySelect(property)
                }
              }}
            >
              <Popup>
                <div className="p-2 min-w-[200px]">
                  <h3 className="font-bold text-sm mb-1">{property.title}</h3>
                  <p className="text-xs text-slate-600 mb-2">{property.location}</p>
                  <p className="text-lg font-bold text-amber-600">
                    ${(property.price / 1000).toFixed(0)}k
                  </p>
                  <div className="flex gap-2 text-xs text-slate-600 mt-2">
                    <span>{property.beds} beds</span>
                    <span>•</span>
                    <span>{property.baths} baths</span>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
      </MapContainer>

      {/* Loading Overlay */}
      {!mapReady && (
        <div className="absolute inset-0 bg-slate-100 flex items-center justify-center z-10">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600">Loading map...</p>
          </div>
        </div>
      )}

      {/* Selected Property Card */}
      {selectedProperty && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-96 max-w-[calc(100%-2rem)] z-[1000]">
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
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 luxury-shadow-md z-[1000]">
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

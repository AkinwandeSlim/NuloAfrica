"use client"

import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { MapPin } from 'lucide-react'

// Set your Mapbox access token
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || 'pk.eyJ1IjoibnVlbG8iLCJhIjoiY20zeTBmcjhzMDFkbTJqcHdqNGJnZzRtZCJ9.YOUR_TOKEN_HERE'

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

interface PropertyMapboxProps {
  properties: Property[]
  selectedProperty: Property | null
  onPropertySelect: (property: Property | null) => void
}

export default function PropertyMapbox({ 
  properties, 
  selectedProperty, 
  onPropertySelect 
}: PropertyMapboxProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const markers = useRef<{ [key: number]: mapboxgl.Marker }>({})
  const [mapLoaded, setMapLoaded] = useState(false)

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return

    // Default center (Nigeria - Lagos)
    const defaultCenter: [number, number] = [3.3792, 6.5244]
    const defaultZoom = 11

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12', // Modern colorful streets style
      center: defaultCenter,
      zoom: defaultZoom,
      pitch: 30, // Reduced 3D tilt for better performance
      bearing: 0,
      antialias: true,
      attributionControl: false
    })

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right')

    // Add fullscreen control
    map.current.addControl(new mapboxgl.FullscreenControl(), 'top-right')

    // Map loaded event
    map.current.on('load', () => {
      setMapLoaded(true)
      
      // Add 3D buildings layer
      if (map.current) {
        const layers = map.current.getStyle().layers
        const labelLayerId = layers?.find(
          (layer) => layer.type === 'symbol' && layer.layout?.['text-field']
        )?.id

        map.current.addLayer(
          {
            id: '3d-buildings',
            source: 'composite',
            'source-layer': 'building',
            filter: ['==', 'extrude', 'true'],
            type: 'fill-extrusion',
            minzoom: 15,
            paint: {
              'fill-extrusion-color': '#aaa',
              'fill-extrusion-height': [
                'interpolate',
                ['linear'],
                ['zoom'],
                15,
                0,
                15.05,
                ['get', 'height']
              ],
              'fill-extrusion-base': [
                'interpolate',
                ['linear'],
                ['zoom'],
                15,
                0,
                15.05,
                ['get', 'min_height']
              ],
              'fill-extrusion-opacity': 0.6
            }
          },
          labelLayerId
        )
      }
    })

    return () => {
      map.current?.remove()
      map.current = null
    }
  }, [])

  // Update markers when properties change
  useEffect(() => {
    if (!map.current || !mapLoaded) return

    // Remove old markers
    Object.values(markers.current).forEach(marker => marker.remove())
    markers.current = {}

    // Add new markers
    properties.forEach(property => {
      if (!map.current) return

      // Create custom marker element
      const el = document.createElement('div')
      el.className = 'custom-marker'
      el.style.width = '40px'
      el.style.height = '40px'
      el.style.cursor = 'pointer'
      
      const isSelected = selectedProperty?.id === property.id
      
      el.innerHTML = `
        <div style="
          width: 100%;
          height: 100%;
          background: ${isSelected ? '#f97316' : '#ffffff'};
          border: 3px solid ${isSelected ? '#ea580c' : '#f97316'};
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        ">
          <div style="
            transform: rotate(45deg);
            color: ${isSelected ? '#ffffff' : '#f97316'};
            font-weight: bold;
            font-size: 12px;
          ">
            $${(property.price / 1000).toFixed(0)}k
          </div>
        </div>
      `

      // Hover effect
      el.addEventListener('mouseenter', () => {
        el.style.transform = 'scale(1.2)'
      })
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'scale(1)'
      })

      // Create marker
      const marker = new mapboxgl.Marker(el)
        .setLngLat([property.longitude, property.latitude])
        .addTo(map.current)

      // Add popup
      const popup = new mapboxgl.Popup({ 
        offset: 25,
        closeButton: false,
        className: 'property-popup'
      }).setHTML(`
        <div style="padding: 8px; min-width: 200px;">
          <img src="${property.image}" alt="${property.title}" style="width: 100%; height: 120px; object-fit: cover; border-radius: 8px; margin-bottom: 8px;" />
          <h3 style="font-weight: bold; font-size: 14px; margin-bottom: 4px; color: #1e293b;">${property.title}</h3>
          <p style="font-size: 12px; color: #64748b; margin-bottom: 8px;">${property.location}</p>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-weight: bold; font-size: 16px; color: #f97316;">$${(property.price / 1000).toFixed(0)}k</span>
            <span style="font-size: 11px; color: #64748b;">${property.beds} beds • ${property.baths} baths</span>
          </div>
        </div>
      `)

      marker.setPopup(popup)

      // Click handler
      el.addEventListener('click', () => {
        onPropertySelect(property)
        
        // Smooth pan to property (lighter animation)
        map.current?.easeTo({
          center: [property.longitude, property.latitude],
          zoom: 15,
          pitch: 50,
          bearing: 0,
          duration: 800,
          essential: true
        })
      })

      markers.current[property.id] = marker
    })

    // Fit bounds to show all properties (optimized)
    if (properties.length > 0) {
      const bounds = new mapboxgl.LngLatBounds()
      properties.forEach(property => {
        bounds.extend([property.longitude, property.latitude])
      })
      
      map.current.fitBounds(bounds, {
        padding: { top: 50, bottom: 50, left: 50, right: 50 },
        maxZoom: 14,
        duration: 600 // Reduced from 1500ms
      })
    }
  }, [properties, mapLoaded, selectedProperty, onPropertySelect])

  // Animate to selected property
  useEffect(() => {
    if (!map.current || !selectedProperty) return

    // Update marker styles
    Object.entries(markers.current).forEach(([id, marker]) => {
      const el = marker.getElement()
      const isSelected = parseInt(id) === selectedProperty.id
      
      const innerDiv = el.querySelector('div') as HTMLElement
      if (innerDiv) {
        innerDiv.style.background = isSelected ? '#f97316' : '#ffffff'
        innerDiv.style.borderColor = isSelected ? '#ea580c' : '#f97316'
        
        const textDiv = innerDiv.querySelector('div') as HTMLElement
        if (textDiv) {
          textDiv.style.color = isSelected ? '#ffffff' : '#f97316'
        }
      }
    })

    // Smooth pan to selected property (optimized)
    map.current.easeTo({
      center: [selectedProperty.longitude, selectedProperty.latitude],
      zoom: 16,
      pitch: 50,
      bearing: 0,
      duration: 700,
      essential: true
    })

    // Show popup
    markers.current[selectedProperty.id]?.togglePopup()
  }, [selectedProperty])

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="w-full h-full" />
      
      {/* Loading indicator */}
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-orange-50 to-slate-100">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-slate-700 font-medium">Loading interactive map...</p>
          </div>
        </div>
      )}

      {/* Custom styles */}
      <style jsx global>{`
        .mapboxgl-popup-content {
          padding: 0;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.3);
        }
        .mapboxgl-popup-tip {
          display: none;
        }
        .custom-marker {
          transition: transform 0.3s ease;
        }
        .custom-marker:hover {
          z-index: 1000;
        }
      `}</style>
    </div>
  )
}

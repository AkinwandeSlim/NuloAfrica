# 🗺️ Mapbox Migration Guide

## Why Mapbox?

### Advantages over Google Maps
- ✅ **More affordable** - Free tier: 50,000 map loads/month (vs Google's $200 credit)
- ✅ **Better customization** - Full control over map styling
- ✅ **Modern API** - React-friendly with `react-map-gl`
- ✅ **Beautiful maps** - Stunning default styles
- ✅ **Better performance** - Optimized for web
- ✅ **No credit card required** - For free tier

---

## 📦 Installation

Run this command to install Mapbox dependencies:

```bash
npm install mapbox-gl @mapbox/mapbox-gl-geocoder react-map-gl
```

**Packages:**
- `mapbox-gl` - Core Mapbox GL JS library
- `@mapbox/mapbox-gl-geocoder` - Geocoding and autocomplete
- `react-map-gl` - React wrapper for Mapbox

---

## 🔑 Get Your Mapbox Access Token

### Step 1: Create Account
1. Go to https://account.mapbox.com/auth/signup/
2. Sign up (free, no credit card required)

### Step 2: Get Access Token
1. After signup, you'll be redirected to your account
2. Go to https://account.mapbox.com/access-tokens/
3. Copy your **Default public token**
4. Or create a new token with these scopes:
   - `styles:read`
   - `fonts:read`
   - `datasets:read`

### Step 3: Add to Environment
Create `.env.local` file:

```env
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.eyJ1IjoieW91ci11c2VybmFtZSIsImEiOiJjbHh4eHh4eHgifQ.xxxxxxxxxxxxx
```

---

## 🔄 Migration Changes

### 1. Root Layout (`app/layout.tsx`)
**Before (Google Maps):**
```tsx
import Script from "next/script"

<Script
  src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
  strategy="beforeInteractive"
/>
```

**After (Mapbox):**
```tsx
import "mapbox-gl/dist/mapbox-gl.css"

// No script tag needed - Mapbox is imported as a module
```

✅ **Already updated!**

### 2. Environment Variables
**Before:**
```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key_here
```

**After:**
```env
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_token_here
```

✅ **Already updated in `env.example`!**

---

## 📝 Code Examples

### Location Autocomplete (Home Page)

**Before (Google Maps):**
```tsx
const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)

useEffect(() => {
  if (typeof window !== 'undefined' && window.google && locationInputRef.current) {
    autocompleteRef.current = new google.maps.places.Autocomplete(locationInputRef.current, {
      types: ['(cities)'],
      componentRestrictions: { country: ['ke', 'ng', 'gh'] },
    })
  }
}, [])
```

**After (Mapbox):**
```tsx
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder'
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css'

const geocoderRef = useRef<MapboxGeocoder | null>(null)

useEffect(() => {
  if (locationInputRef.current && !geocoderRef.current) {
    geocoderRef.current = new MapboxGeocoder({
      accessToken: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!,
      types: 'place,locality', // Cities and localities
      countries: 'ke,ng,gh,za,tz,rw,ma,eg', // African countries
      placeholder: 'Search location...',
    })

    geocoderRef.current.addTo(locationInputRef.current)
    
    geocoderRef.current.on('result', (e) => {
      setLocation(e.result.place_name)
    })
  }

  return () => {
    if (geocoderRef.current) {
      geocoderRef.current.clear()
    }
  }
}, [])
```

### Map Display (Properties Page)

**Before (Google Maps):**
```tsx
const mapRef = useRef<HTMLDivElement>(null)

useEffect(() => {
  if (mapRef.current && window.google) {
    const map = new google.maps.Map(mapRef.current, {
      center: { lat: -1.286389, lng: 36.817223 },
      zoom: 12,
    })

    properties.forEach(property => {
      new google.maps.Marker({
        position: { lat: property.latitude, lng: property.longitude },
        map: map,
        title: property.title,
      })
    })
  }
}, [properties])
```

**After (Mapbox with react-map-gl):**
```tsx
import Map, { Marker, NavigationControl } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

const [viewState, setViewState] = useState({
  longitude: 36.817223,
  latitude: -1.286389,
  zoom: 12
})

return (
  <Map
    {...viewState}
    onMove={evt => setViewState(evt.viewState)}
    mapStyle="mapbox://styles/mapbox/streets-v12"
    mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
    style={{ width: '100%', height: '500px' }}
  >
    <NavigationControl position="top-right" />
    
    {properties.map(property => (
      <Marker
        key={property.id}
        longitude={property.longitude}
        latitude={property.latitude}
        anchor="bottom"
      >
        <div className="w-8 h-8 bg-amber-500 rounded-full border-2 border-white shadow-lg cursor-pointer hover:scale-110 transition-transform" />
      </Marker>
    ))}
  </Map>
)
```

### Property Details Map

**Before (Google Maps):**
```tsx
useEffect(() => {
  if (mapRef.current && window.google) {
    const map = new google.maps.Map(mapRef.current, {
      center: { lat: propertyData.latitude, lng: propertyData.longitude },
      zoom: 15,
      disableDefaultUI: true,
    })

    new google.maps.Marker({
      position: { lat: propertyData.latitude, lng: propertyData.longitude },
      map: map,
    })
  }
}, [])
```

**After (Mapbox):**
```tsx
import Map, { Marker } from 'react-map-gl'

<Map
  initialViewState={{
    longitude: propertyData.longitude,
    latitude: propertyData.latitude,
    zoom: 15
  }}
  mapStyle="mapbox://styles/mapbox/streets-v12"
  mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
  style={{ width: '100%', height: '300px', borderRadius: '12px' }}
  interactive={false}
>
  <Marker
    longitude={propertyData.longitude}
    latitude={propertyData.latitude}
    anchor="bottom"
  >
    <div className="w-10 h-10 bg-amber-500 rounded-full border-4 border-white shadow-xl" />
  </Marker>
</Map>
```

---

## 🎨 Mapbox Styles

Mapbox offers beautiful pre-built styles:

```tsx
// Light and clean
mapStyle="mapbox://styles/mapbox/streets-v12"

// Satellite view
mapStyle="mapbox://styles/mapbox/satellite-streets-v12"

// Dark mode
mapStyle="mapbox://styles/mapbox/dark-v11"

// Outdoors
mapStyle="mapbox://styles/mapbox/outdoors-v12"

// Custom (create your own at https://studio.mapbox.com/)
mapStyle="mapbox://styles/your-username/your-style-id"
```

---

## 🔧 Component Examples

### Reusable Map Component

Create `components/MapboxMap.tsx`:

```tsx
"use client"

import { useState } from 'react'
import Map, { Marker, NavigationControl, FullscreenControl } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

interface MapboxMapProps {
  longitude: number
  latitude: number
  zoom?: number
  markers?: Array<{ id: string; longitude: number; latitude: number; title: string }>
  height?: string
  interactive?: boolean
}

export function MapboxMap({
  longitude,
  latitude,
  zoom = 12,
  markers = [],
  height = '500px',
  interactive = true,
}: MapboxMapProps) {
  const [viewState, setViewState] = useState({
    longitude,
    latitude,
    zoom,
  })

  return (
    <div style={{ height, width: '100%', borderRadius: '12px', overflow: 'hidden' }}>
      <Map
        {...viewState}
        onMove={interactive ? (evt) => setViewState(evt.viewState) : undefined}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
        style={{ width: '100%', height: '100%' }}
        interactive={interactive}
      >
        {interactive && (
          <>
            <NavigationControl position="top-right" />
            <FullscreenControl position="top-right" />
          </>
        )}

        {markers.map((marker) => (
          <Marker
            key={marker.id}
            longitude={marker.longitude}
            latitude={marker.latitude}
            anchor="bottom"
          >
            <div
              className="w-8 h-8 bg-amber-500 rounded-full border-2 border-white shadow-lg cursor-pointer hover:scale-110 transition-transform"
              title={marker.title}
            />
          </Marker>
        ))}
      </Map>
    </div>
  )
}
```

### Geocoder Component

Create `components/MapboxGeocoder.tsx`:

```tsx
"use client"

import { useEffect, useRef } from 'react'
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder'
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css'

interface MapboxGeocoderProps {
  onResult: (result: any) => void
  placeholder?: string
  countries?: string
}

export function MapboxGeocoderInput({
  onResult,
  placeholder = 'Search location...',
  countries = 'ke,ng,gh,za,tz,rw,ma,eg',
}: MapboxGeocoderProps) {
  const geocoderContainerRef = useRef<HTMLDivElement>(null)
  const geocoderRef = useRef<MapboxGeocoder | null>(null)

  useEffect(() => {
    if (geocoderContainerRef.current && !geocoderRef.current) {
      geocoderRef.current = new MapboxGeocoder({
        accessToken: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!,
        types: 'place,locality,address',
        countries: countries,
        placeholder: placeholder,
      })

      geocoderRef.current.addTo(geocoderContainerRef.current)

      geocoderRef.current.on('result', (e) => {
        onResult(e.result)
      })
    }

    return () => {
      if (geocoderRef.current) {
        geocoderRef.current.clear()
      }
    }
  }, [onResult, placeholder, countries])

  return <div ref={geocoderContainerRef} className="mapbox-geocoder-container" />
}
```

---

## 📍 Geocoding (Address → Coordinates)

```tsx
async function geocodeAddress(address: string) {
  const response = await fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`
  )
  const data = await response.json()
  
  if (data.features && data.features.length > 0) {
    const [longitude, latitude] = data.features[0].center
    return { longitude, latitude, place_name: data.features[0].place_name }
  }
  
  return null
}
```

---

## 🧭 Directions (Get Directions Button)

```tsx
function handleGetDirections(longitude: number, latitude: number) {
  // Open Mapbox directions in new tab
  const url = `https://www.mapbox.com/directions/?destination=${longitude},${latitude}`
  window.open(url, '_blank')
  
  // Or use Google Maps (still works)
  // const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`
  // window.open(url, '_blank')
}
```

---

## 💰 Pricing Comparison

### Google Maps
- **Free tier:** $200 credit/month
- **After free tier:** $7 per 1,000 map loads
- **Requires:** Credit card

### Mapbox
- **Free tier:** 50,000 map loads/month
- **After free tier:** $5 per 1,000 map loads
- **Requires:** No credit card for free tier

**Savings:** Mapbox is ~30% cheaper and more generous free tier!

---

## ✅ Migration Checklist

### Setup
- [ ] Install Mapbox packages: `npm install mapbox-gl @mapbox/mapbox-gl-geocoder react-map-gl`
- [ ] Create Mapbox account at https://account.mapbox.com/
- [ ] Get access token
- [ ] Add token to `.env.local`
- [ ] Update `app/layout.tsx` ✅ (Already done!)
- [ ] Update `env.example` ✅ (Already done!)

### Update Pages
- [ ] Home page - Replace Google Autocomplete with Mapbox Geocoder
- [ ] Properties page - Replace Google Maps with react-map-gl
- [ ] Property details page - Replace embedded Google Map
- [ ] Remove Google Maps TypeScript declarations

### Testing
- [ ] Test location autocomplete
- [ ] Test map rendering
- [ ] Test markers display
- [ ] Test mobile responsiveness
- [ ] Test "Get Directions" functionality

---

## 🎨 Styling Mapbox Components

### Custom Marker Styles

```tsx
// Simple dot
<div className="w-6 h-6 bg-amber-500 rounded-full border-2 border-white shadow-lg" />

// With pulse animation
<div className="relative">
  <div className="w-6 h-6 bg-amber-500 rounded-full border-2 border-white shadow-lg" />
  <div className="absolute inset-0 w-6 h-6 bg-amber-500 rounded-full animate-ping opacity-75" />
</div>

// Custom icon
<div className="w-10 h-10 bg-amber-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
  <Home className="w-5 h-5 text-white" />
</div>
```

### Geocoder Styling

Add to `globals.css`:

```css
/* Mapbox Geocoder Custom Styles */
.mapbox-gl-geocoder {
  width: 100%;
  max-width: none;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.mapbox-gl-geocoder--input {
  height: 48px;
  padding: 12px 16px;
  font-size: 16px;
  border-radius: 12px;
}

.mapbox-gl-geocoder--icon-search {
  top: 14px;
  left: 12px;
}

.mapbox-gl-geocoder--button {
  top: 12px;
  right: 12px;
}
```

---

## 🚀 Next Steps

1. **Install packages** (run the npm install command)
2. **Get Mapbox token** (from account.mapbox.com)
3. **Add to .env.local**
4. **Update pages** (I can help with this!)
5. **Test everything**
6. **Deploy**

---

## 📚 Resources

- [Mapbox GL JS Docs](https://docs.mapbox.com/mapbox-gl-js/guides/)
- [react-map-gl Docs](https://visgl.github.io/react-map-gl/)
- [Mapbox Geocoder](https://github.com/mapbox/mapbox-gl-geocoder)
- [Mapbox Studio](https://studio.mapbox.com/) - Create custom map styles
- [Mapbox Examples](https://docs.mapbox.com/mapbox-gl-js/example/)

---

## 🎉 Benefits Summary

✅ **Cost-effective** - Better free tier
✅ **Beautiful maps** - Modern, customizable styles
✅ **Better performance** - Optimized for web
✅ **React-friendly** - Official React wrapper
✅ **No credit card** - For free tier
✅ **Great documentation** - Comprehensive guides
✅ **Active community** - Lots of examples

**Ready to migrate? Let me know which pages you want me to update first!** 🚀

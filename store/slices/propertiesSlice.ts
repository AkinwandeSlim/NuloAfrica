import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface Property {
  id: string
  landlord_id: string
  title: string
  description: string | null
  location: string
  city: string
  country: string
  latitude: number | null
  longitude: number | null
  price: number
  price_per_month: number | null
  beds: number | null
  baths: number | null
  sqft: number | null
  property_type: string | null
  status: 'vacant' | 'occupied' | 'maintenance'
  featured: boolean
  images: string[] | null
  amenities: string[] | null
  created_at: string
  updated_at: string
}

interface PropertiesState {
  properties: Property[]
  selectedProperty: Property | null
  loading: boolean
  error: string | null
  filters: {
    city: string | null
    priceRange: [number, number]
    propertyType: string | null
    beds: number | null
    baths: number | null
  }
}

const initialState: PropertiesState = {
  properties: [],
  selectedProperty: null,
  loading: false,
  error: null,
  filters: {
    city: null,
    priceRange: [0, 1000000],
    propertyType: null,
    beds: null,
    baths: null,
  },
}

const propertiesSlice = createSlice({
  name: 'properties',
  initialState,
  reducers: {
    setProperties: (state, action: PayloadAction<Property[]>) => {
      state.properties = action.payload
      state.loading = false
    },
    setSelectedProperty: (state, action: PayloadAction<Property | null>) => {
      state.selectedProperty = action.payload
    },
    addProperty: (state, action: PayloadAction<Property>) => {
      state.properties.unshift(action.payload)
    },
    updateProperty: (state, action: PayloadAction<Property>) => {
      const index = state.properties.findIndex(p => p.id === action.payload.id)
      if (index !== -1) {
        state.properties[index] = action.payload
      }
    },
    deleteProperty: (state, action: PayloadAction<string>) => {
      state.properties = state.properties.filter(p => p.id !== action.payload)
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    setFilters: (state, action: PayloadAction<Partial<PropertiesState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    clearFilters: (state) => {
      state.filters = initialState.filters
    },
  },
})

export const {
  setProperties,
  setSelectedProperty,
  addProperty,
  updateProperty,
  deleteProperty,
  setLoading,
  setError,
  setFilters,
  clearFilters,
} = propertiesSlice.actions

export default propertiesSlice.reducer

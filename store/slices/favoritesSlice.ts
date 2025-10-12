import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface Favorite {
  id: string
  user_id: string
  property_id: string
  created_at: string
}

interface FavoritesState {
  favorites: Favorite[]
  favoriteIds: Set<string>
  loading: boolean
  error: string | null
}

const initialState: FavoritesState = {
  favorites: [],
  favoriteIds: new Set(),
  loading: false,
  error: null,
}

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    setFavorites: (state, action: PayloadAction<Favorite[]>) => {
      state.favorites = action.payload
      state.favoriteIds = new Set(action.payload.map(f => f.property_id))
      state.loading = false
    },
    addFavorite: (state, action: PayloadAction<Favorite>) => {
      state.favorites.push(action.payload)
      state.favoriteIds.add(action.payload.property_id)
    },
    removeFavorite: (state, action: PayloadAction<string>) => {
      state.favorites = state.favorites.filter(f => f.property_id !== action.payload)
      state.favoriteIds.delete(action.payload)
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
  },
})

export const { setFavorites, addFavorite, removeFavorite, setLoading, setError } = favoritesSlice.actions
export default favoritesSlice.reducer

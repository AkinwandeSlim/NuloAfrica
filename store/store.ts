import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import propertiesReducer from './slices/propertiesSlice'
import favoritesReducer from './slices/favoritesSlice'
import messagesReducer from './slices/messagesSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    properties: propertiesReducer,
    favorites: favoritesReducer,
    messages: messagesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['auth/setUser', 'auth/setSession'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['payload.user', 'payload.session'],
        // Ignore these paths in the state
        ignoredPaths: ['auth.user', 'auth.session'],
      },
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

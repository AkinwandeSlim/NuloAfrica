'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { authAPI, storage, type User as APIUser } from '@/lib/api'
import { getErrorMessage } from '@/lib/api/client'

interface Profile {
  id: string
  email: string
  full_name: string
  phone_number?: string
  user_type: 'tenant' | 'landlord'
  avatar_url: string | null
  trust_score: number
  verification_status: string
  created_at: string
  tenant_profile?: any
  landlord_profile?: any
}

interface AuthContextType {
  user: APIUser | null
  profile: Profile | null
  loading: boolean
  signUp: (email: string, password: string, data: SignUpData) => Promise<any>
  signIn: (email: string, password: string) => Promise<any>
  signOut: () => Promise<void>
  updateProfile: (data: Partial<Profile>) => Promise<void>
}

interface SignUpData {
  full_name: string
  phone_number?: string
  user_type?: 'tenant' | 'landlord'
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<APIUser | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        const token = storage.getToken()
        const storedUser = storage.getUser()
        
        if (token && storedUser) {
          // Verify token is still valid by fetching current user
          const currentUser = await authAPI.getCurrentUser()
          setUser(currentUser)
          setProfile(currentUser as any)
        }
      } catch (error) {
        // Token invalid or expired, clear storage
        storage.clear()
        setUser(null)
        setProfile(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const fetchProfile = async () => {
    try {
      console.log('👤 Fetching current user profile...')
      const currentUser = await authAPI.getCurrentUser()
      console.log('✅ Profile fetched:', currentUser)
      setUser(currentUser)
      setProfile(currentUser as any)
    } catch (error) {
      console.error('❌ Error fetching profile:', error)
      storage.clear()
      setUser(null)
      setProfile(null)
    }
  }

  const signUp = async (email: string, password: string, data: SignUpData) => {
    try {
      const payload = {
        email,
        password,
        full_name: data.full_name,
        user_type: data.user_type || 'tenant',
        phone_number: data.phone_number,
      }
      
      console.log('📝 Registering user via FastAPI...')
      console.log('📦 Payload:', payload)
      console.log('🌐 API URL:', process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000')
      
      const response = await authAPI.register(payload)

      console.log('✅ Registration successful:', response)
      
      // Set user and profile from response
      setUser(response.user)
      setProfile(response.user as any)

      return { data: { user: response.user }, error: null }
    } catch (error: any) {
      console.error('❌ Sign up error:', error)
      console.error('❌ Error status:', error.response?.status)
      console.error('❌ Error response:', error.response?.data)
      console.error('❌ Error message:', error.message)
      console.error('❌ Full error object:', JSON.stringify(error, null, 2))
      
      // Extract error message using helper
      const errorMessage = getErrorMessage(error)
      
      console.error('❌ Parsed error message:', errorMessage)
      
      return { data: null, error: errorMessage }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      console.log('🔐 Signing in via FastAPI...')
      console.log('📧 Email:', email)
      
      const response = await authAPI.login({
        email,
        password,
      })

      console.log('✅ Sign in successful:', response)
      
      // Set user and profile from response
      setUser(response.user)
      setProfile(response.user as any)

      return { data: { user: response.user }, error: null }
    } catch (error: any) {
      console.error('❌ Sign in error:', error)
      console.error('❌ Error status:', error.response?.status)
      console.error('❌ Error response:', error.response?.data)
      console.error('❌ Error message:', error.message)
      
      // Extract error message using helper
      const errorMessage = getErrorMessage(error)
      
      // Provide more user-friendly messages for common errors
      let friendlyMessage = errorMessage
      
      if (error.response?.status === 401) {
        friendlyMessage = 'Invalid email or password. Please check your credentials and try again.'
      } else if (error.response?.status === 403) {
        friendlyMessage = 'Your account has been disabled. Please contact support.'
      } else if (error.response?.status === 404) {
        friendlyMessage = 'No account found with this email. Please sign up first.'
      } else if (error.message.includes('Network Error') || error.message.includes('timeout')) {
        friendlyMessage = 'Unable to connect to server. Please check your internet connection.'
      }
      
      console.error('❌ Friendly error message:', friendlyMessage)
      
      return { data: null, error: friendlyMessage }
    }
  }

  const signOut = async () => {
    try {
      console.log('🚪 Signing out via FastAPI...')
      await authAPI.logout()
      
      // Clear local state
      setUser(null)
      setProfile(null)
      
      console.log('✅ Signed out successfully')
    } catch (error: any) {
      console.error('❌ Sign out error:', error)
      // Clear local state anyway
      setUser(null)
      setProfile(null)
      storage.clear()
    }
  }

  // Google sign-in not implemented in FastAPI yet
  // const signInWithGoogle = async () => {
  //   throw new Error('Google sign-in not yet implemented')
  // }

  const updateProfile = async (data: Partial<Profile>) => {
    if (!user) throw new Error('No user logged in')

    try {
      console.log('📝 Updating profile via FastAPI...')
      // TODO: Implement update profile endpoint in FastAPI
      // For now, just refresh the profile
      await fetchProfile()
      console.log('✅ Profile updated')
    } catch (error) {
      console.error('❌ Update profile error:', error)
      throw error
    }
  }

  const value = {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import authAPI, { User, RegisterData, LoginData } from '@/lib/api/auth'
import { getErrorMessage } from '@/lib/api/client'

export function useAuthFastAPI() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Load user on mount
  useEffect(() => {
    loadUser()
  }, [])

  const loadUser = async () => {
    try {
      setLoading(true)
      
      // Check if token exists
      if (!authAPI.isAuthenticated()) {
        setUser(null)
        setLoading(false)
        return
      }

      // Try to get stored user first (faster)
      const storedUser = authAPI.getStoredUser()
      if (storedUser) {
        setUser(storedUser)
      }

      // Fetch fresh user data from API
      const currentUser = await authAPI.getCurrentUser()
      setUser(currentUser)
      setError(null)
    } catch (err: any) {
      console.error('Failed to load user:', err)
      setUser(null)
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (data: RegisterData) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await authAPI.register(data)
      
      if (response.success) {
        setUser(response.user)
        
        // Redirect based on user type
        const redirectPath = response.user.user_type === 'tenant' 
          ? '/tenant' 
          : '/landlord'
        
        // Small delay to ensure state is saved before redirect
        setTimeout(() => {
          window.location.href = redirectPath
        }, 100)
        
        return { success: true, error: null }
      }
      
      return { success: false, error: 'Registration failed' }
    } catch (err: any) {
      const errorMessage = getErrorMessage(err)
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (data: LoginData) => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('🔐 Attempting login...', { email: data.email })
      const response = await authAPI.login(data)
      console.log('✅ Login response:', response)
      
      if (response.success) {
        setUser(response.user)
        console.log('👤 User set:', response.user)
        
        // Redirect based on user type
        const redirectPath = response.user.user_type === 'tenant' 
          ? '/tenant' 
          : '/landlord'
        
        console.log('🔄 Redirecting to:', redirectPath)
        
        // Small delay to ensure state is saved before redirect
        setTimeout(() => {
          window.location.href = redirectPath
        }, 100)
        
        return { success: true, error: null }
      }
      
      console.error('❌ Login failed: success=false')
      return { success: false, error: 'Login failed' }
    } catch (err: any) {
      console.error('❌ Login error:', err)
      const errorMessage = getErrorMessage(err)
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      await authAPI.logout()
      setUser(null)
      setError(null)
      router.push('/login')
      return { success: true, error: null }
    } catch (err: any) {
      const errorMessage = getErrorMessage(err)
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const refreshUser = async () => {
    await loadUser()
  }

  return {
    user,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    refreshUser,
    isAuthenticated: !!user,
    isTenant: user?.user_type === 'tenant',
    isLandlord: user?.user_type === 'landlord',
    tenantProfile: user?.tenant_profile,
    landlordProfile: user?.landlord_profile,
    profileCompletion: user?.tenant_profile?.profile_completion || 0,
  }
}

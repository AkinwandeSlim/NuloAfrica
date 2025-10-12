"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase/client'
import { useAppDispatch } from '@/store/hooks'
import { setUser, setProfile, setSession, setLoading } from '@/store/slices/authSlice'

interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  role: 'tenant' | 'landlord' | 'admin'
  phone: string | null
}

interface AuthContextType {
  user: User | null
  profile: Profile | null
  session: Session | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  session: null,
  loading: true,
})

export const useAuthContext = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider')
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<User | null>(null)
  const [profile, setProfileState] = useState<Profile | null>(null)
  const [session, setSessionState] = useState<Session | null>(null)
  const [loading, setLoadingState] = useState(true)
  const dispatch = useAppDispatch()

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSessionState(session)
      setUserState(session?.user ?? null)
      dispatch(setSession(session))
      dispatch(setUser(session?.user ?? null))
      
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setLoadingState(false)
        dispatch(setLoading(false))
      }
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSessionState(session)
      setUserState(session?.user ?? null)
      dispatch(setSession(session))
      dispatch(setUser(session?.user ?? null))
      
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setProfileState(null)
        dispatch(setProfile(null))
        setLoadingState(false)
        dispatch(setLoading(false))
      }
    })

    return () => subscription.unsubscribe()
  }, [dispatch])

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) throw error
      
      setProfileState(data)
      dispatch(setProfile(data))
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoadingState(false)
      dispatch(setLoading(false))
    }
  }

  return (
    <AuthContext.Provider value={{ user, profile, session, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

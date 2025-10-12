import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { createClient } from '@supabase/supabase-js'

// For client components
export const supabase = createClientComponentClient()

// For server components and API routes (with service role if needed)
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// Database types (will be auto-generated from Supabase)
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          role: 'tenant' | 'landlord' | 'admin'
          phone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'tenant' | 'landlord' | 'admin'
          phone?: string | null
        }
        Update: {
          full_name?: string | null
          avatar_url?: string | null
          role?: 'tenant' | 'landlord' | 'admin'
          phone?: string | null
        }
      }
      properties: {
        Row: {
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
          property_type: 'apartment' | 'house' | 'villa' | 'penthouse' | 'studio' | 'loft' | null
          status: 'vacant' | 'occupied' | 'maintenance'
          featured: boolean
          images: string[] | null
          amenities: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          landlord_id: string
          title: string
          description?: string | null
          location: string
          city: string
          country: string
          latitude?: number | null
          longitude?: number | null
          price: number
          price_per_month?: number | null
          beds?: number | null
          baths?: number | null
          sqft?: number | null
          property_type?: 'apartment' | 'house' | 'villa' | 'penthouse' | 'studio' | 'loft' | null
          status?: 'vacant' | 'occupied' | 'maintenance'
          featured?: boolean
          images?: string[] | null
          amenities?: string[] | null
        }
        Update: {
          title?: string
          description?: string | null
          location?: string
          city?: string
          country?: string
          latitude?: number | null
          longitude?: number | null
          price?: number
          price_per_month?: number | null
          beds?: number | null
          baths?: number | null
          sqft?: number | null
          property_type?: 'apartment' | 'house' | 'villa' | 'penthouse' | 'studio' | 'loft' | null
          status?: 'vacant' | 'occupied' | 'maintenance'
          featured?: boolean
          images?: string[] | null
          amenities?: string[] | null
        }
      }
    }
  }
}

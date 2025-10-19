import { createClient } from '@supabase/supabase-js'

// IMPORTANT: This should ONLY be used in server-side code (API routes, Server Actions)
// NEVER import this in client components!

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

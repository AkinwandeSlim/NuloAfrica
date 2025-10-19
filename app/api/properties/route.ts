import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'
import { supabaseAdmin } from '@/lib/supabase/server'
import type { PropertyInsert } from '@/lib/types/database'

export async function POST(request: Request) {
  try {
    // Get auth token
    const authHeader = request.headers.get('Authorization')
    const token = authHeader?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Verify user
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Verify user is landlord
    const { data: userProfile } = await supabaseAdmin
      .from('users')
      .select('user_type')
      .eq('id', user.id)
      .single()

    if (userProfile?.user_type !== 'landlord') {
      return NextResponse.json(
        { success: false, error: 'Only landlords can create properties' },
        { status: 403 }
      )
    }

    // Parse request body
    const body = await request.json()
    const {
      title,
      description,
      rent_amount,
      security_deposit,
      location,
      address,
      city,
      state,
      country,
      latitude,
      longitude,
      bedrooms,
      bathrooms,
      square_feet,
      property_type,
      amenities,
      photos,
      availability_start,
      status,
    } = body

    // Validate required fields
    if (!title || !rent_amount || !location || !bedrooms) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create property
    const propertyData: PropertyInsert = {
      landlord_id: user.id,
      title,
      description: description || null,
      rent_amount: parseFloat(rent_amount),
      security_deposit: security_deposit ? parseFloat(security_deposit) : null,
      agency_fee: 0, // Nulo Africa has no agency fees!
      location,
      address: address || null,
      city: city || 'Lagos',
      state: state || 'Lagos',
      country: country || 'Nigeria',
      latitude: latitude || null,
      longitude: longitude || null,
      bedrooms: parseInt(bedrooms),
      bathrooms: bathrooms ? parseInt(bathrooms) : 1,
      square_feet: square_feet ? parseInt(square_feet) : null,
      property_type: property_type || 'apartment',
      amenities: amenities || [],
      photos: photos || [],
      availability_start: availability_start || null,
      availability_end: null,
      status: status || 'draft',
    }

    const { data: property, error: propertyError } = await supabaseAdmin
      .from('properties')
      .insert(propertyData)
      .select()
      .single()

    if (propertyError) {
      console.error('Property creation error:', propertyError)
      return NextResponse.json(
        { success: false, error: 'Failed to create property' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      property: {
        id: property.id,
        title: property.title,
        status: property.status,
        slug: property.slug,
      },
    })
  } catch (error: any) {
    console.error('Create property error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

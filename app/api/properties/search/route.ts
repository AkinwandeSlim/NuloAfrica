import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/client'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    // Extract query parameters
    const location = searchParams.get('location')
    const minBudget = searchParams.get('min_budget')
    const maxBudget = searchParams.get('max_budget')
    const bedrooms = searchParams.get('bedrooms')
    const amenities = searchParams.get('amenities')?.split(',').filter(Boolean)
    const propertyType = searchParams.get('property_type')
    const sort = searchParams.get('sort') || 'newest'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    // Build query
    let query = supabaseAdmin
      .from('properties')
      .select(`
        *,
        landlord:landlords!inner(
          id,
          guarantee_joined
        ),
        user:users!landlords_id_fkey(
          full_name,
          avatar_url,
          trust_score,
          verification_status
        )
      `, { count: 'exact' })
      .eq('status', 'active')
      .is('deleted_at', null)

    // Apply filters
    if (location) {
      query = query.ilike('location', `%${location}%`)
    }

    if (minBudget) {
      query = query.gte('rent_amount', parseFloat(minBudget))
    }

    if (maxBudget) {
      query = query.lte('rent_amount', parseFloat(maxBudget))
    }

    if (bedrooms) {
      query = query.eq('bedrooms', parseInt(bedrooms))
    }

    if (propertyType) {
      query = query.eq('property_type', propertyType)
    }

    if (amenities && amenities.length > 0) {
      query = query.contains('amenities', amenities)
    }

    // Apply sorting
    switch (sort) {
      case 'price_low':
        query = query.order('rent_amount', { ascending: true })
        break
      case 'price_high':
        query = query.order('rent_amount', { ascending: false })
        break
      case 'newest':
      default:
        query = query.order('created_at', { ascending: false })
        break
    }

    // Apply pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    // Execute query
    const { data: properties, error, count } = await query

    if (error) {
      console.error('Search error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to search properties' },
        { status: 500 }
      )
    }

    // Transform data to include landlord info
    const transformedProperties = properties?.map(property => ({
      ...property,
      landlord: {
        id: property.landlord.id,
        name: property.user.full_name,
        avatar_url: property.user.avatar_url,
        trust_score: property.user.trust_score,
        verified: property.user.verification_status === 'approved',
        guarantee_joined: property.landlord.guarantee_joined,
      },
    }))

    return NextResponse.json({
      success: true,
      properties: transformedProperties,
      pagination: {
        total: count || 0,
        page,
        limit,
        total_pages: Math.ceil((count || 0) / limit),
      },
    })
  } catch (error: any) {
    console.error('Property search error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

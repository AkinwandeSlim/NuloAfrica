import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'
import { supabaseAdmin } from '@/lib/supabase/server'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const propertyId = params.id

    // Fetch property with landlord details
    const { data: property, error } = await supabaseAdmin
      .from('properties')
      .select(`
        *,
        landlord:landlords!inner(
          id,
          guarantee_joined,
          verification_approved_at
        ),
        user:users!landlords_id_fkey(
          full_name,
          avatar_url,
          trust_score,
          verification_status,
          created_at
        )
      `)
      .eq('id', propertyId)
      .is('deleted_at', null)
      .single()

    if (error || !property) {
      return NextResponse.json(
        { success: false, error: 'Property not found' },
        { status: 404 }
      )
    }

    // Increment view count
    await supabaseAdmin
      .from('properties')
      .update({ view_count: property.view_count + 1 })
      .eq('id', propertyId)

    // Get landlord's property count
    const { count: propertiesCount } = await supabaseAdmin
      .from('properties')
      .select('*', { count: 'exact', head: true })
      .eq('landlord_id', property.landlord_id)
      .eq('status', 'active')

    // Check if current user has favorited (if authenticated)
    let isFavorited = false
    const authHeader = request.headers.get('Authorization')
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '')
      const { data: { user } } = await supabase.auth.getUser(token)
      
      if (user) {
        const { data: favorite } = await supabaseAdmin
          .from('favorites')
          .select('*')
          .eq('tenant_id', user.id)
          .eq('property_id', propertyId)
          .single()
        
        isFavorited = !!favorite
      }
    }

    // Transform response
    const response = {
      ...property,
      landlord: {
        id: property.landlord.id,
        name: property.user.full_name,
        avatar_url: property.user.avatar_url,
        trust_score: property.user.trust_score,
        verified: property.user.verification_status === 'approved',
        properties_count: propertiesCount || 0,
        joined_year: new Date(property.user.created_at).getFullYear(),
        guarantee_joined: property.landlord.guarantee_joined,
      },
      is_favorited: isFavorited,
    }

    return NextResponse.json({
      success: true,
      property: response,
    })
  } catch (error: any) {
    console.error('Get property error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const propertyId = params.id

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

    // Verify ownership
    const { data: property } = await supabaseAdmin
      .from('properties')
      .select('landlord_id')
      .eq('id', propertyId)
      .single()

    if (!property || property.landlord_id !== user.id) {
      return NextResponse.json(
        { success: false, error: 'You do not have permission to update this property' },
        { status: 403 }
      )
    }

    // Parse update data
    const updates = await request.json()

    // Remove fields that shouldn't be updated
    delete updates.id
    delete updates.landlord_id
    delete updates.created_at
    delete updates.updated_at
    delete updates.view_count
    delete updates.favorite_count
    delete updates.application_count

    // Update property
    const { data: updatedProperty, error: updateError } = await supabaseAdmin
      .from('properties')
      .update(updates)
      .eq('id', propertyId)
      .select()
      .single()

    if (updateError) {
      console.error('Update property error:', updateError)
      return NextResponse.json(
        { success: false, error: 'Failed to update property' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      property: {
        id: updatedProperty.id,
        updated_at: updatedProperty.updated_at,
      },
    })
  } catch (error: any) {
    console.error('Update property error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const propertyId = params.id

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

    // Verify ownership
    const { data: property } = await supabaseAdmin
      .from('properties')
      .select('landlord_id')
      .eq('id', propertyId)
      .single()

    if (!property || property.landlord_id !== user.id) {
      return NextResponse.json(
        { success: false, error: 'You do not have permission to delete this property' },
        { status: 403 }
      )
    }

    // Soft delete
    const { error: deleteError } = await supabaseAdmin
      .from('properties')
      .update({
        deleted_at: new Date().toISOString(),
        status: 'inactive',
      })
      .eq('id', propertyId)

    if (deleteError) {
      console.error('Delete property error:', deleteError)
      return NextResponse.json(
        { success: false, error: 'Failed to delete property' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Property deleted successfully',
    })
  } catch (error: any) {
    console.error('Delete property error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

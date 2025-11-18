import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * Example API Route for Tool Integration
 * 
 * This demonstrates how to:
 * 1. Authenticate users with Supabase
 * 2. Process incoming requests
 * 3. Forward to Python FastAPI backend
 * 4. Return processed results
 * 
 * Copy this pattern for each tool API endpoint
 */

export async function POST(request: Request) {
  try {
    // 1. Authenticate user
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in.' },
        { status: 401 }
      )
    }

    // 2. Get request data
    const formData = await request.formData()
    
    // Optional: Validate request data here
    const file = formData.get('file')
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // 3. Optional: Check user credits in database
    // const { data: profile } = await supabase
    //   .from('profiles')
    //   .select('credits')
    //   .eq('id', user.id)
    //   .single()
    // 
    // if (profile.credits < TOOL_COST) {
    //   return NextResponse.json(
    //     { error: 'Insufficient credits' },
    //     { status: 402 }
    //   )
    // }

    // 4. Forward to Python FastAPI backend
    // Replace with your actual Python API endpoint
    const PYTHON_API_URL = process.env.PYTHON_API_URL || 'http://localhost:8000'
    
    const response = await fetch(`${PYTHON_API_URL}/api/example-tool`, {
      method: 'POST',
      body: formData,
      // Add any authentication headers for your Python API if needed
      headers: {
        'X-User-ID': user.id,
      },
    })

    if (!response.ok) {
      throw new Error('Python API request failed')
    }

    const result = await response.json()

    // 5. Optional: Deduct credits and log usage
    // await supabase
    //   .from('profiles')
    //   .update({ credits: profile.credits - TOOL_COST })
    //   .eq('id', user.id)
    //
    // await supabase
    //   .from('usage_logs')
    //   .insert({
    //     user_id: user.id,
    //     tool_name: 'example-tool',
    //     credits_used: TOOL_COST,
    //   })

    // 6. Return result
    return NextResponse.json({
      success: true,
      data: result,
      message: 'Processing completed successfully',
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Optional: GET endpoint to check tool status or get info
export async function GET() {
  return NextResponse.json({
    name: 'Example Tool',
    description: 'This is an example tool endpoint',
    status: 'active',
  })
}


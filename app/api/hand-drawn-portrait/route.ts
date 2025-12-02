import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

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

        // Validate file
        const imageFile = formData.get('file')

        if (!imageFile || !(imageFile instanceof File)) {
            return NextResponse.json(
                { error: 'Image file is required' },
                { status: 400 }
            )
        }

        // 3. Forward to Python FastAPI backend
        const PYTHON_API_URL = process.env.PYTHON_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

        const response = await fetch(`${PYTHON_API_URL}/api/hand-drawn-portrait`, {
            method: 'POST',
            body: formData,
            headers: {
                'X-User-ID': user.id,
                ...(process.env.INTERNAL_API_KEY && { 'X-API-Key': process.env.INTERNAL_API_KEY }),
            },
        })

        if (!response.ok) {
            const errorText = await response.text()
            try {
                const errorData = JSON.parse(errorText)
                return NextResponse.json(
                    { error: errorData.detail || 'Failed to generate image' },
                    { status: response.status }
                )
            } catch {
                return NextResponse.json(
                    { error: 'Failed to generate image' },
                    { status: response.status }
                )
            }
        }

        // Return the image blob directly
        const blob = await response.blob()
        return new NextResponse(blob, {
            status: 200,
            headers: {
                'Content-Type': 'image/png',
            },
        })
    } catch (error) {
        console.error('API Error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}


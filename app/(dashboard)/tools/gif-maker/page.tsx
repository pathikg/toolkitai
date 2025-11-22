'use client'

import { Navbar } from '@/components/Navbar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { FileImage, Upload, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function GifMakerPage() {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)

      if (!user) {
        router.push('/tools')
      }
    }

    checkAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (!session?.user) {
        router.push('/tools')
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/tools"
          className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Tools
        </Link>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-3 rounded-xl">
              <FileImage className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">GIF Maker</h1>
          </div>
          <p className="text-lg text-gray-600">
            Create animated GIFs from videos or images with custom settings.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Upload Video or Images</CardTitle>
            <CardDescription>
              Upload a video file or multiple images to create a GIF
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Video or Images</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-400 transition-colors cursor-pointer">
                <Upload className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-500 mt-1">MP4, MOV, PNG, JPG up to 50MB</p>
                <Input type="file" accept="video/*,image/*" multiple className="hidden" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Frame Rate (FPS)</label>
                <Input type="number" placeholder="10" defaultValue="10" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Quality</label>
                <select className="w-full h-10 px-3 rounded-md border border-gray-300">
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
              </div>
            </div>

            <Button className="w-full" size="lg" disabled>
              Create GIF
            </Button>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm text-amber-800">
                <strong>Coming Soon:</strong> API integration pending. This tool will be functional once the backend endpoint is connected.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-12 text-center">
              <p className="text-gray-500">Your GIF will appear here</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}


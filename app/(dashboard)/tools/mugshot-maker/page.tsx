import { Navbar } from '@/components/Navbar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Camera, Upload, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function MugshotMakerPage() {
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
              <Camera className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Mugshot Generator</h1>
          </div>
          <p className="text-lg text-gray-600">
            Generate realistic mugshot-style photos with AI technology.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Upload Photo</CardTitle>
            <CardDescription>
              Upload a photo to convert it into mugshot style
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Photo</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-400 transition-colors cursor-pointer">
                <Upload className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</p>
                <Input type="file" accept="image/*" className="hidden" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Mugshot ID (Optional)</label>
              <Input type="text" placeholder="e.g., 2024-001" />
            </div>

            <Button className="w-full" size="lg" disabled>
              Generate Mugshot
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
              <p className="text-gray-500">Your mugshot will appear here</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}


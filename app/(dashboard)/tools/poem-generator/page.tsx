import { Navbar } from '@/components/Navbar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { PenTool, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function PoemGeneratorPage() {
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
              <PenTool className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Poem Generator</h1>
          </div>
          <p className="text-lg text-gray-600">
            Create beautiful poems instantly using advanced AI language models.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Poem Settings</CardTitle>
            <CardDescription>
              Enter a topic or theme for your poem
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Topic or Theme</label>
              <Textarea 
                placeholder="e.g., love, nature, technology, dreams..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Style</label>
                <select className="w-full h-10 px-3 rounded-md border border-gray-300">
                  <option>Free Verse</option>
                  <option>Haiku</option>
                  <option>Sonnet</option>
                  <option>Limerick</option>
                  <option>Acrostic</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Length</label>
                <select className="w-full h-10 px-3 rounded-md border border-gray-300">
                  <option>Short (4-8 lines)</option>
                  <option>Medium (8-16 lines)</option>
                  <option>Long (16+ lines)</option>
                </select>
              </div>
            </div>

            <Button className="w-full" size="lg" disabled>
              Generate Poem
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
            <CardTitle>Generated Poem</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-12 text-center">
              <p className="text-gray-500">Your poem will appear here</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}


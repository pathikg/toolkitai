import { Navbar } from '@/components/Navbar'
import { Eraser, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import BgRemovalClient from './bg-removal-client'

export default function BackgroundRemovalPage() {
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
              <Eraser className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Background Removal</h1>
          </div>
          <p className="text-lg text-gray-600">
            Remove backgrounds from images instantly with AI-powered precision.
          </p>
        </div>

        <BgRemovalClient />
      </main>
    </div>
  )
}

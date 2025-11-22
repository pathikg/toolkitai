import { Navbar } from '@/components/Navbar'
import { RefreshCw, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import FaceSwapClient from './face-swap-client'

export default function FaceSwapPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
              <RefreshCw className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Face Swap</h1>
          </div>
          <p className="text-lg text-gray-600">
            Swap faces between two photos instantly with high realism. No limits.
          </p>
        </div>

        <FaceSwapClient />
      </main>
    </div>
  )
}

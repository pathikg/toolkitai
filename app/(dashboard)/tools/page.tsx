'use client'

import { Navbar } from '@/components/Navbar'
import { ToolCard } from '@/components/ToolCard'
import { LoginModal } from '@/components/LoginModal'
import { Sparkles, Video, Clock } from 'lucide-react'
import { availableTools, upcomingTools } from '@/lib/tools-data'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ToolsPage() {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [pendingToolHref, setPendingToolHref] = useState<string | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }

    checkAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user && pendingToolHref) {
        // User just logged in, redirect to the tool they wanted
        router.push(pendingToolHref)
        setPendingToolHref(null)
        setShowLoginModal(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth, router, pendingToolHref])

  const handleToolClick = (href: string) => {
    if (!user) {
      // User not authenticated, show login modal
      setPendingToolHref(href)
      setShowLoginModal(true)
    } else {
      // User authenticated, navigate directly
      router.push(href)
    }
  }

  return (
    <div className="min-h-screen bg-mesh">
      <Navbar />
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => {
          setShowLoginModal(false)
          setPendingToolHref(null)
        }}
        redirectAfterLogin={pendingToolHref || '/tools'}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-3 rounded-xl shadow-lg shadow-indigo-500/30">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3 tracking-tight">
            AI-Powered Tools
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Transform your creative workflow with our suite of AI tools
          </p>
        </div>

        {/* Available Tools Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-indigo-600" />
            Available Now
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {availableTools.map((tool) => (
              <ToolCard
                key={tool.id}
                name={tool.name}
                description={tool.description}
                icon={tool.icon}
                href={tool.href}
                featured={true}
                onClick={handleToolClick}
              />
            ))}
          </div>
        </section>

        {/* Upcoming Tools Section */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Clock className="w-6 h-6 text-gray-600" />
            Coming Soon
          </h2>
          <p className="text-gray-600 mb-6">
            These tools are currently in development and will be available soon!
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingTools.map((tool) => {
              const Icon = tool.icon
              return (
                <div key={tool.id} className="relative group">
                  <div className="h-full p-7 rounded-3xl border border-dashed border-gray-200 bg-gray-50/50 cursor-not-allowed transition-all duration-300 group-hover:border-gray-300">
                    {/* Icon Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="bg-gray-100 text-gray-400 p-4 rounded-2xl shadow-sm grayscale">
                        <Icon className="w-8 h-8" strokeWidth={1.5} />
                      </div>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-400 border border-gray-200">
                        Coming Soon
                      </span>
                    </div>

                    {/* Content */}
                    <div>
                      <h3 className="text-xl font-bold mb-3 tracking-tight text-gray-400">
                        {tool.name}
                      </h3>
                      <p className="text-sm leading-relaxed text-gray-400">
                        {tool.description}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      </main>
    </div>
  )
}


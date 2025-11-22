'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { LoginModal } from './LoginModal'
import type { User } from '@supabase/supabase-js'

interface AuthGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [showLoginModal, setShowLoginModal] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        
        setUser(user)
        
        if (!user) {
          // Show login modal instead of redirecting
          setShowLoginModal(true)
        }
      } catch (error) {
        console.error('Error checking auth:', error)
        setShowLoginModal(true)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        setShowLoginModal(false)
      } else {
        setShowLoginModal(true)
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const handleCloseModal = () => {
    setShowLoginModal(false)
    router.push('/tools')
  }

  if (loading) {
    return (
      fallback || (
        <div className="min-h-screen flex items-center justify-center bg-mesh">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-600 font-medium">Loading...</p>
          </div>
        </div>
      )
    )
  }

  if (!user) {
    return (
      <>
        <LoginModal 
          isOpen={showLoginModal} 
          onClose={handleCloseModal}
          redirectAfterLogin={pathname}
        />
        <div className="min-h-screen flex items-center justify-center bg-mesh">
          <div className="text-center max-w-md mx-auto p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Authentication Required
            </h2>
            <p className="text-gray-600 mb-6">
              Please sign in to access this tool.
            </p>
            <button
              onClick={() => setShowLoginModal(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
            >
              Sign In
            </button>
          </div>
        </div>
      </>
    )
  }

  return <>{children}</>
}


'use client'

import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { X, User, Mail, Lock, Coins, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import type { User as SupabaseUser } from '@supabase/supabase-js'

interface UserModalProps {
    isOpen: boolean
    onClose: () => void
    user: SupabaseUser | null
}

export function UserModal({ isOpen, onClose, user }: UserModalProps) {
    const router = useRouter()
    const supabase = createClient()
    const [email, setEmail] = useState('')
    const [displayName, setDisplayName] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isChangingPassword, setIsChangingPassword] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

    useEffect(() => {
        if (!isOpen) return

        // Prevent scrolling when sidebar is open
        document.body.style.overflow = 'hidden'
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    useEffect(() => {
        if (user) {
            setEmail(user.email || '')
            // Get display name from Google OAuth metadata
            setDisplayName(
                user.user_metadata?.full_name ||
                user.user_metadata?.name ||
                user.user_metadata?.username ||
                user.email?.split('@')[0] ||
                'User'
            )
        }
    }, [user, isOpen])

    const handleChangePassword = async () => {
        if (!user) return

        if (newPassword !== confirmPassword) {
            setMessage({ type: 'error', text: 'New passwords do not match' })
            return
        }

        if (newPassword.length < 6) {
            setMessage({ type: 'error', text: 'Password must be at least 6 characters' })
            return
        }

        setIsChangingPassword(true)
        setMessage(null)

        try {
            const { error } = await supabase.auth.updateUser({
                password: newPassword,
            })

            if (error) throw error

            setMessage({ type: 'success', text: 'Password updated successfully!' })
            setNewPassword('')
            setConfirmPassword('')
            setTimeout(() => setMessage(null), 3000)
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Failed to update password' })
        } finally {
            setIsChangingPassword(false)
        }
    }

    const handleSignOut = async () => {
        setIsLoading(true)
        await supabase.auth.signOut()
        router.push('/')
    }

    if (!isOpen) return null

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Sidebar */}
            <div
                className={`fixed right-0 top-0 z-50 h-full w-full max-w-md bg-white shadow-2xl transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
                <div className="flex h-full flex-col overflow-y-auto">
                    {/* Header */}
                    <div className="sticky top-0 z-10 border-b border-gray-200 bg-white px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-xl shadow-lg shadow-indigo-500/30">
                                    <User className="w-6 h-6 text-white" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                                    User Settings
                                </h2>
                            </div>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600 transition-colors rounded-lg p-1 hover:bg-gray-100"
                                aria-label="Close"
                                disabled={isLoading}
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 px-6 py-6 space-y-6">
                        {/* Message */}
                        {message && (
                            <div
                                className={`p-3 rounded-lg text-sm ${message.type === 'success'
                                    ? 'bg-green-50 text-green-800 border border-green-200'
                                    : 'bg-red-50 text-red-800 border border-red-200'
                                    }`}
                            >
                                {message.text}
                            </div>
                        )}

                        {/* User Info Section */}
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <User className="w-4 h-4 text-indigo-600" />
                                    Name
                                </label>
                                <Input
                                    type="text"
                                    value={displayName}
                                    disabled
                                    className="bg-gray-50 cursor-not-allowed"
                                />
                                <p className="text-xs text-gray-500">
                                    Name is managed by your Google account
                                </p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-indigo-600" />
                                    Email
                                </label>
                                <Input
                                    type="email"
                                    value={email}
                                    disabled
                                    className="bg-gray-50 cursor-not-allowed"
                                />
                                <p className="text-xs text-gray-500">
                                    Email is managed by your Google account
                                </p>
                            </div>
                        </div>

                        {/* Password Section */}
                        <div className="space-y-3 border-t pt-4">
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <Lock className="w-4 h-4 text-indigo-600" />
                                Change Password
                            </label>
                            <p className="text-xs text-gray-500 mb-2">
                                Note: Password changes apply to your Supabase account. If you signed in with Google, you may not need to set a password.
                            </p>
                            <Input
                                type="password"
                                value={newPassword}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)}
                                placeholder="New password"
                            />
                            <Input
                                type="password"
                                value={confirmPassword}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm new password"
                            />
                            <Button
                                onClick={handleChangePassword}
                                disabled={isChangingPassword || !newPassword || !confirmPassword}
                                variant="outline"
                                className="w-full"
                            >
                                {isChangingPassword ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                                        Updating...
                                    </>
                                ) : (
                                    <>
                                        <Lock className="w-4 h-4" />
                                        Update Password
                                    </>
                                )}
                            </Button>
                        </div>

                        {/* Billion Section */}
                        <div className="space-y-2 border-t pt-4">
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <Coins className="w-4 h-4 text-indigo-600" />
                                Billion
                            </label>
                            <Input
                                type="text"
                                value="Coming soon"
                                disabled
                                className="bg-gray-50 cursor-not-allowed"
                            />
                            <p className="text-xs text-gray-500">This feature is currently disabled</p>
                        </div>

                        {/* Sign Out Button */}
                        <div className="border-t pt-4">
                            <Button
                                onClick={handleSignOut}
                                disabled={isLoading}
                                variant="destructive"
                                className="w-full"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Signing out...
                                    </>
                                ) : (
                                    <>
                                        <LogOut className="w-4 h-4" />
                                        Sign Out
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}


'use client'

import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { X, User, Mail, Lock, Coins, LogOut, Save } from 'lucide-react'
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
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isSavingUsername, setIsSavingUsername] = useState(false)
    const [isChangingPassword, setIsChangingPassword] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

    useEffect(() => {
        if (!isOpen) return

        // Prevent scrolling when modal is open
        document.body.style.overflow = 'hidden'
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    useEffect(() => {
        if (user) {
            setEmail(user.email || '')
            setUsername(user.user_metadata?.username || '')
        }
    }, [user, isOpen])

    const handleSaveUsername = async () => {
        if (!user) return

        setIsSavingUsername(true)
        setMessage(null)

        try {
            const { error } = await supabase.auth.updateUser({
                data: { username },
            })

            if (error) throw error

            setMessage({ type: 'success', text: 'Username updated successfully!' })
            setTimeout(() => setMessage(null), 3000)
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Failed to update username' })
        } finally {
            setIsSavingUsername(false)
        }
    }

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
            setCurrentPassword('')
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
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-fade-in"
            onClick={onClose}
        >
            {/* Modal */}
            <div
                className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 animate-fade-in max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Close"
                    disabled={isLoading}
                >
                    <X className="w-6 h-6" />
                </button>

                {/* Content */}
                <div className="space-y-6">
                    {/* Header */}
                    <div className="text-center">
                        <div className="flex justify-center mb-4">
                            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-4 rounded-2xl shadow-lg shadow-indigo-500/30">
                                <User className="w-8 h-8 text-white" />
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">
                            User Settings
                        </h2>
                    </div>

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

                    {/* Username Section */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <User className="w-4 h-4 text-indigo-600" />
                            Username
                        </label>
                        <div className="flex gap-2">
                            <Input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter your username"
                                className="flex-1"
                            />
                            <Button
                                onClick={handleSaveUsername}
                                disabled={isSavingUsername || !username.trim()}
                                size="sm"
                                variant="default"
                            >
                                {isSavingUsername ? (
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <Save className="w-4 h-4" />
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* Email Section */}
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
                        <p className="text-xs text-gray-500">Email cannot be changed</p>
                    </div>

                    {/* Password Section */}
                    <div className="space-y-3 border-t pt-4">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <Lock className="w-4 h-4 text-indigo-600" />
                            Change Password
                        </label>
                        <Input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="New password"
                        />
                        <Input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
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
    )
}


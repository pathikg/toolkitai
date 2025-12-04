'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2, RefreshCw, User, Star, Download } from 'lucide-react'

export default function CelebritySelfieClient() {
    const [userFile, setUserFile] = useState<File | null>(null)
    const [userPreview, setUserPreview] = useState<string | null>(null)

    const [celebrityFile, setCelebrityFile] = useState<File | null>(null)
    const [celebrityPreview, setCelebrityPreview] = useState<string | null>(null)

    const [generatedImage, setGeneratedImage] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [loadingStep, setLoadingStep] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [customPrompt, setCustomPrompt] = useState<string>('')

    const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setUserFile(file)
            setUserPreview(URL.createObjectURL(file))
            setGeneratedImage(null)
            setError(null)
        }
    }

    const handleCelebrityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setCelebrityFile(file)
            setCelebrityPreview(URL.createObjectURL(file))
            setGeneratedImage(null)
            setError(null)
        }
    }

    const handleReset = () => {
        setUserFile(null)
        setUserPreview(null)
        setCelebrityFile(null)
        setCelebrityPreview(null)
        setGeneratedImage(null)
        setError(null)
        setCustomPrompt('')
    }

    const handleCreateSelfie = async () => {
        if (!userFile || !celebrityFile) return

        setIsLoading(true)
        setError(null)
        setLoadingStep('Analyzing faces...')

        try {
            const formData = new FormData()
            formData.append('source_image', userFile)
            formData.append('target_image', celebrityFile)
            if (customPrompt.trim()) {
                formData.append('custom_prompt', customPrompt.trim())
            }

            // Update status after 5 seconds
            const timeout1 = setTimeout(() => {
                setLoadingStep('Creating celebrity selfie...')
            }, 5000)

            // Update status after 12 seconds
            const timeout2 = setTimeout(() => {
                setLoadingStep('Adding finishing touches...')
            }, 12000)

            // Call Next.js API route (which handles auth and forwards to backend)
            const response = await fetch('/api/celebrity-selfie', {
                method: 'POST',
                body: formData,
            })

            clearTimeout(timeout1)
            clearTimeout(timeout2)

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(errorData.detail || 'Failed to generate image')
            }

            const blob = await response.blob()
            const url = URL.createObjectURL(blob)
            setGeneratedImage(url)
        } catch (err: any) {
            console.error(err)
            setError(err.message || 'Failed to process image. Please try again.')
        } finally {
            setIsLoading(false)
            setLoadingStep('')
        }
    }

    // Sample user photos from S3
    const SAMPLE_USER_PHOTOS = [
        "https://s3.us-west-2.amazonaws.com/toolkitai.io/media/selfie-with-celebrity/pathik-1.jpg",
        "https://s3.us-west-2.amazonaws.com/toolkitai.io/media/selfie-with-celebrity/pathik-2.jpg",
        "https://s3.us-west-2.amazonaws.com/toolkitai.io/media/selfie-with-celebrity/pathik-3.jpg"
    ]

    // Celebrity photos from S3
    const SAMPLE_CELEBRITIES = [
        "https://s3.us-west-2.amazonaws.com/toolkitai.io/media/selfie-with-celebrity/amitabh-bachchan.jpg",
        "https://s3.us-west-2.amazonaws.com/toolkitai.io/media/selfie-with-celebrity/sam-altman.jpg",
        "https://s3.us-west-2.amazonaws.com/toolkitai.io/media/selfie-with-celebrity/sydney-sweeney.jpg"
    ]

    const [isSampleLoading, setIsSampleLoading] = useState(false)
    const [imageLoadErrors, setImageLoadErrors] = useState<Set<string>>(new Set())
    const [imageCache, setImageCache] = useState<Map<string, string>>(new Map())

    // Preload images with authentication
    useEffect(() => {
        const blobUrls: string[] = []

        const preloadImages = async () => {
            const allUrls = [...SAMPLE_USER_PHOTOS, ...SAMPLE_CELEBRITIES]
            const newCache = new Map<string, string>()

            for (const url of allUrls) {
                try {
                    const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(url)}`
                    const response = await fetch(proxyUrl, {
                        credentials: 'include', // Ensure cookies are sent
                    })

                    if (response.ok) {
                        const blob = await response.blob()
                        const blobUrl = URL.createObjectURL(blob)
                        blobUrls.push(blobUrl)
                        newCache.set(url, blobUrl)
                    } else {
                        setImageLoadErrors((prev: Set<string>) => new Set(prev).add(url))
                    }
                } catch (err) {
                    console.error(`Failed to preload image ${url}:`, err)
                    setImageLoadErrors((prev: Set<string>) => new Set(prev).add(url))
                }
            }

            setImageCache(newCache)
        }

        preloadImages()

        // Cleanup blob URLs on unmount
        return () => {
            blobUrls.forEach(url => URL.revokeObjectURL(url))
        }
    }, [])

    // Helper function to get proxy URL for images (use cached blob URL if available)
    const getProxyUrl = (url: string): string | null => {
        // Only return cached blob URL - never fall back to API route for <img> tags
        if (imageCache.has(url)) {
            return imageCache.get(url)!
        }
        // Return null if not cached yet (component will show placeholder)
        return null
    }

    // Handle image load errors for thumbnails
    const handleImageError = (url: string) => {
        setImageLoadErrors(prev => new Set(prev).add(url))
        setError('Failed to load sample image. Please try selecting it again or upload manually.')
    }

    const handleSampleSelect = async (url: string, type: 'user' | 'celebrity') => {
        setIsSampleLoading(true)
        setError(null)

        try {
            // Use Next.js API route (which handles auth and forwards to backend)
            const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(url)}`

            const response = await fetch(proxyUrl)

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: Failed to fetch image`)
            }

            const blob = await response.blob()
            const file = new File([blob], `sample-${type}.jpg`, { type: blob.type || 'image/jpeg' })

            // Create object URL for preview
            const previewUrl = URL.createObjectURL(blob)

            if (type === 'user') {
                setUserFile(file)
                setUserPreview(previewUrl)
            } else {
                setCelebrityFile(file)
                setCelebrityPreview(previewUrl)
            }
            setGeneratedImage(null)
            // Remove from error set if it was there
            setImageLoadErrors(prev => {
                const next = new Set(prev)
                next.delete(url)
                return next
            })
        } catch (err: any) {
            console.error('Error loading sample image:', err)
            setError(err.message || 'Failed to load sample image. Please enable CORS on your S3 bucket or upload manually.')
        } finally {
            setIsSampleLoading(false)
        }
    }

    return (
        <div className="w-full space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* User Photo Upload */}
                <div className="space-y-4">
                    <Card className="overflow-hidden border-2 border-dashed border-gray-200 hover:border-indigo-500/50 transition-all">
                        <CardContent className="p-0 h-[400px] relative bg-gray-50 flex items-center justify-center">
                            {!userPreview ? (
                                <div className="text-center p-8">
                                    <div className="relative group cursor-pointer">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleUserChange}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        />
                                        <div className="bg-indigo-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                            <User className="w-10 h-10 text-indigo-600" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900">Upload Your Photo</h3>
                                        <p className="text-sm text-gray-500 mt-2">Your selfie or portrait</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="relative w-full h-full">
                                    <img
                                        src={userPreview}
                                        alt="Your Photo"
                                        className="w-full h-full object-contain"
                                    />
                                    <button
                                        onClick={() => {
                                            setUserFile(null)
                                            setUserPreview(null)
                                            setGeneratedImage(null)
                                        }}
                                        className="absolute top-4 right-4 p-2 bg-white/90 rounded-full shadow-sm hover:bg-white transition-colors z-10"
                                    >
                                        <RefreshCw className="w-4 h-4 text-gray-600" />
                                    </button>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {!userPreview && (
                        <div>
                            <p className="text-sm font-medium text-gray-700 mb-2">Or choose a sample photo:</p>
                            <div className="grid grid-cols-3 gap-2">
                                {SAMPLE_USER_PHOTOS.map((url, i) => (
                                    <button
                                        key={i}
                                        onClick={(e) => {
                                            e.preventDefault()
                                            e.stopPropagation()
                                            handleSampleSelect(url, 'user')
                                        }}
                                        className="relative aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-indigo-500 transition-all"
                                    >
                                        {imageLoadErrors.has(url) ? (
                                            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 text-xs text-center p-2">
                                                Failed to load
                                            </div>
                                        ) : getProxyUrl(url) ? (
                                            <img
                                                src={getProxyUrl(url)!}
                                                alt={`User ${i + 1}`}
                                                className="w-full h-full object-cover pointer-events-none"
                                                loading="lazy"
                                                onError={() => handleImageError(url)}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-300 text-xs text-center p-2">
                                                Loading...
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Celebrity Photo Selection */}
                <div className="space-y-4">
                    <Card className="overflow-hidden border-2 border-dashed border-gray-200 hover:border-indigo-500/50 transition-all">
                        <CardContent className="p-0 h-[400px] relative bg-gray-50 flex items-center justify-center">
                            {!celebrityPreview ? (
                                <div className="text-center p-8">
                                    <div className="relative group cursor-pointer">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleCelebrityChange}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        />
                                        <div className="bg-purple-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                            <Star className="w-10 h-10 text-purple-600" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900">Celebrity Photo</h3>
                                        <p className="text-sm text-gray-500 mt-2">Choose or upload a celebrity</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="relative w-full h-full">
                                    <img
                                        src={celebrityPreview}
                                        alt="Celebrity"
                                        className="w-full h-full object-contain"
                                    />
                                    <button
                                        onClick={() => {
                                            setCelebrityFile(null)
                                            setCelebrityPreview(null)
                                            setGeneratedImage(null)
                                        }}
                                        className="absolute top-4 right-4 p-2 bg-white/90 rounded-full shadow-sm hover:bg-white transition-colors z-10"
                                    >
                                        <RefreshCw className="w-4 h-4 text-gray-600" />
                                    </button>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {!celebrityPreview && (
                        <div>
                            <p className="text-sm font-medium text-gray-700 mb-2">Or choose a celebrity:</p>
                            <div className="grid grid-cols-3 gap-2">
                                {SAMPLE_CELEBRITIES.map((url, i) => (
                                    <button
                                        key={i}
                                        onClick={(e) => {
                                            e.preventDefault()
                                            e.stopPropagation()
                                            handleSampleSelect(url, 'celebrity')
                                        }}
                                        className="relative aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-indigo-500 transition-all"
                                    >
                                        {imageLoadErrors.has(url) ? (
                                            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 text-xs text-center p-2">
                                                Failed to load
                                            </div>
                                        ) : getProxyUrl(url) ? (
                                            <img
                                                src={getProxyUrl(url)!}
                                                alt={`Celebrity ${i + 1}`}
                                                className="w-full h-full object-cover pointer-events-none"
                                                loading="lazy"
                                                onError={() => handleImageError(url)}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-300 text-xs text-center p-2">
                                                Loading...
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Custom Prompt Input */}
            <div className="max-w-2xl mx-auto">
                <Card className="border-2 border-indigo-100">
                    <CardContent className="p-6">
                        <label htmlFor="custom-prompt" className="block text-sm font-semibold text-gray-700 mb-2">
                            Describe how you want the selfie (optional)
                        </label>
                        <textarea
                            id="custom-prompt"
                            value={customPrompt}
                            onChange={(e) => setCustomPrompt(e.target.value)}
                            placeholder="e.g., 'smiling, looking at camera, casual pose' or 'professional headshot style' or 'outdoor sunset background'"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-all"
                            rows={3}
                            maxLength={200}
                        />
                        <p className="text-xs text-gray-500 mt-2">
                            {customPrompt.length}/200 characters • Add specific details about pose, expression, or setting
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Action Button */}
            <div className="flex justify-center">
                <Button
                    size="lg"
                    onClick={handleCreateSelfie}
                    disabled={!userFile || !celebrityFile || isLoading || isSampleLoading}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 h-12 text-lg shadow-lg hover:shadow-xl transition-all"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            {loadingStep || 'Creating Celebrity Selfie...'}
                        </>
                    ) : isSampleLoading ? (
                        <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Loading Sample...
                        </>
                    ) : (
                        <>
                            <Star className="mr-2 h-5 w-5" />
                            Create Celebrity Selfie
                        </>
                    )}
                </Button>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center border border-red-200">
                    {error}
                </div>
            )}

            {/* Result Area */}
            {generatedImage && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="h-px bg-gray-200 flex-1" />
                        <span className="text-gray-400 font-medium uppercase text-sm tracking-wider">Your Celebrity Selfie</span>
                        <div className="h-px bg-gray-200 flex-1" />
                    </div>

                    <Card className="overflow-hidden shadow-2xl border-0 ring-1 ring-gray-200">
                        <CardContent className="p-0 bg-gray-900 min-h-[500px] relative flex items-center justify-center group">
                            <img
                                src={generatedImage}
                                alt="Celebrity Selfie Result"
                                className="max-h-[80vh] w-auto object-contain"
                            />
                            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex justify-center">
                                <a
                                    href={generatedImage}
                                    download="celebrity-selfie-result.png"
                                    className="inline-flex items-center px-6 py-3 bg-white text-gray-900 rounded-full font-medium hover:bg-gray-100 transition-colors"
                                >
                                    <Download className="w-4 h-4 mr-2" />
                                    Download Image
                                </a>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    )
}


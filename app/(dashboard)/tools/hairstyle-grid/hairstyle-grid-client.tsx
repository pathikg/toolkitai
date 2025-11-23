'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2, RefreshCw, Upload, Download, Scissors } from 'lucide-react'

export default function HairstyleGridClient() {
    const [userFile, setUserFile] = useState<File | null>(null)
    const [userPreview, setUserPreview] = useState<string | null>(null)
    const [generatedImage, setGeneratedImage] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [loadingStep, setLoadingStep] = useState('')
    const [error, setError] = useState<string | null>(null)

    // Sample photos
    const SAMPLE_PHOTOS = [
        "https://media.wired.com/photos/64960586e416fd283a85c405/4:3/w_1592,h_1194,c_limit/Demis-Hassabis-Google-DeepMind-Business-1437358148.jpg",
        "https://futureoflife.org/wp-content/uploads/2020/08/elon_musk_royal_society.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/1/19/January_2025_Official_Presidential_Portrait_of_Donald_J._Trump.jpg"
    ]

    const [isSampleLoading, setIsSampleLoading] = useState(false)
    const [imageLoadErrors, setImageLoadErrors] = useState<Set<string>>(new Set())
    const [imageCache, setImageCache] = useState<Map<string, string>>(new Map())

    // Preload images with authentication
    useEffect(() => {
        const blobUrls: string[] = []

        const preloadImages = async () => {
            const newCache = new Map<string, string>()

            for (const url of SAMPLE_PHOTOS) {
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

    const handleSampleSelect = async (url: string) => {
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
            const file = new File([blob], `sample-photo.jpg`, { type: blob.type || 'image/jpeg' })

            // Create object URL for preview
            const previewUrl = URL.createObjectURL(blob)

            setUserFile(file)
            setUserPreview(previewUrl)
            setGeneratedImage(null)
            // Remove from error set if it was there
            setImageLoadErrors(prev => {
                const next = new Set(prev)
                next.delete(url)
                return next
            })
        } catch (err: any) {
            console.error('Error loading sample image:', err)
            setError(err.message || 'Failed to load sample image. Please try selecting it again or upload manually.')
        } finally {
            setIsSampleLoading(false)
        }
    }

    const validateImageFile = (file: File): string | null => {
        const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
        if (!validTypes.includes(file.type)) {
            return 'Please upload a valid image file (PNG, JPG, JPEG, or WebP).'
        }
        if (file.size > 50 * 1024 * 1024) {
            return 'File size exceeds 50MB limit. Please upload a smaller image.'
        }
        return null
    }

    const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const error = validateImageFile(file)
            if (error) {
                setError(error)
                return
            }
            setUserFile(file)
            setUserPreview(URL.createObjectURL(file))
            setGeneratedImage(null)
            setError(null)
        }
    }

    const handleReset = () => {
        setUserFile(null)
        setUserPreview(null)
        setGeneratedImage(null)
        setError(null)
    }

    const handleGenerateGrid = async () => {
        if (!userFile) return

        setIsLoading(true)
        setError(null)
        setLoadingStep('Analyzing your photo...')

        try {
            const formData = new FormData()
            formData.append('source_image', userFile)

            // Update status after 5 seconds
            const timeout1 = setTimeout(() => {
                setLoadingStep('Generating hairstyle variations...')
            }, 5000)

            // Update status after 12 seconds
            const timeout2 = setTimeout(() => {
                setLoadingStep('Creating 3x3 grid...')
            }, 12000)

            // Call Next.js API route (which handles auth and forwards to backend)
            const response = await fetch('/api/hairstyle-grid', {
                method: 'POST',
                body: formData,
            })

            clearTimeout(timeout1)
            clearTimeout(timeout2)

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(errorData.detail || errorData.error || 'Failed to generate image')
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

    return (
        <div className="max-w-5xl mx-auto w-full">
            <Card className="w-full overflow-hidden shadow-xl border-0 ring-1 ring-gray-200 py-0">
                <CardContent className="p-0">
                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 text-center border-b border-red-200 font-medium">
                            Error: {error}
                        </div>
                    )}
                    <div className="flex flex-col lg:flex-row min-h-[600px] bg-white">
                        {/* LEFT: Main Canvas / Preview Area */}
                        <div className="flex-1 bg-gray-50/50 flex items-center justify-center relative overflow-hidden">
                            {/* Floating Reset Button */}
                            {userPreview && (
                                <div className="absolute top-4 left-4 z-10">
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={handleReset}
                                        className="bg-white/90 backdrop-blur hover:bg-white shadow-sm border"
                                    >
                                        <RefreshCw className="mr-2 h-3.5 w-3.5" />
                                        New Image
                                    </Button>
                                </div>
                            )}

                            {!userPreview ? (
                                // Upload State
                                <div className="w-full max-w-md text-center px-4">
                                    <div className="relative group cursor-pointer mb-6">
                                        <div className="absolute inset-0 bg-indigo-500/5 blur-2xl rounded-full group-hover:bg-indigo-500/10 transition-all duration-500" />
                                        <div className="relative bg-white border-2 border-dashed border-gray-200 rounded-2xl p-12 hover:border-indigo-500/50 hover:shadow-lg transition-all duration-300">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleUserChange}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                            />
                                            <div className="bg-indigo-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                                                <Upload className="w-8 h-8 text-indigo-600" />
                                            </div>
                                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Upload an image</h3>
                                            <p className="text-gray-500 text-sm mb-6">Drag and drop or click to browse</p>
                                            <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
                                                <span>PNG</span>
                                                <span className="w-1 h-1 rounded-full bg-gray-300" />
                                                <span>JPG</span>
                                                <span className="w-1 h-1 rounded-full bg-gray-300" />
                                                <span>WEBP</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Sample Images */}
                                    {SAMPLE_PHOTOS.length > 0 && (
                                        <div className="mt-8">
                                            <p className="text-sm font-medium text-gray-700 mb-3">Or try a sample photo:</p>
                                            <div className="grid grid-cols-3 gap-3">
                                                {SAMPLE_PHOTOS.map((url, i) => (
                                                    <button
                                                        key={i}
                                                        onClick={(e) => {
                                                            e.preventDefault()
                                                            e.stopPropagation()
                                                            handleSampleSelect(url)
                                                        }}
                                                        disabled={isSampleLoading}
                                                        className="relative aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        {imageLoadErrors.has(url) ? (
                                                            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 text-xs text-center p-2">
                                                                Failed to load
                                                            </div>
                                                        ) : getProxyUrl(url) ? (
                                                            <img
                                                                src={getProxyUrl(url)!}
                                                                alt={`Sample ${i + 1}`}
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
                            ) : generatedImage ? (
                                // Result Display
                                <div className="relative w-full h-full flex items-center justify-center p-8">
                                    <div className="relative shadow-lg rounded-lg overflow-hidden max-h-full max-w-full">
                                        <img
                                            src={generatedImage}
                                            alt="Hairstyle Grid Result"
                                            className="max-h-[70vh] w-auto object-contain"
                                        />
                                    </div>
                                </div>
                            ) : (
                                // Preview State
                                <div className="relative w-full h-full flex items-center justify-center p-8">
                                    <div className="relative shadow-lg rounded-lg overflow-hidden max-h-full max-w-full">
                                        <img
                                            src={userPreview}
                                            alt="Your Photo"
                                            className="max-h-[70vh] w-auto object-contain"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* RIGHT: Sidebar / Controls */}
                        {userPreview && (
                            <div className="w-full lg:w-[350px] bg-white border-l border-gray-200 p-6 flex flex-col gap-6 z-20">
                                {!generatedImage ? (
                                    // State: Processing
                                    <div className="flex flex-col h-full items-center justify-center text-center space-y-4">
                                        <Button
                                            onClick={handleGenerateGrid}
                                            size="lg"
                                            disabled={isLoading || isSampleLoading}
                                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                                        >
                                            {isLoading ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    {loadingStep || 'Processing...'}
                                                </>
                                            ) : isSampleLoading ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Loading Sample...
                                                </>
                                            ) : (
                                                <>
                                                    <Scissors className="mr-2 h-4 w-4" />
                                                    Generate Grid
                                                </>
                                            )}
                                        </Button>
                                        <p className="text-xs text-gray-500">AI processing takes 10-20 seconds</p>
                                    </div>
                                ) : (
                                    // State: Result Ready
                                    <div className="flex flex-col h-full justify-center space-y-4">
                                        <div className="p-4 bg-green-50 rounded-lg text-sm text-green-700">
                                            <p className="font-medium mb-1">✨ Your hairstyle grid is ready!</p>
                                            <p className="text-xs">See yourself with 9 different hairstyles in a 3x3 grid.</p>
                                        </div>
                                        <Button
                                            onClick={() => {
                                                const link = document.createElement('a')
                                                link.href = generatedImage
                                                link.download = 'hairstyle-grid-result.png'
                                                link.click()
                                            }}
                                            className="w-full bg-green-600 hover:bg-green-700"
                                            size="lg"
                                        >
                                            <Download className="mr-2 h-4 w-4" />
                                            Download Grid
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}


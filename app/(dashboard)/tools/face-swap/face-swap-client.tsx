'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2, RefreshCw, User, Image as ImageIcon, Download } from 'lucide-react'

export default function FaceSwapClient() {
    const [sourceFile, setSourceFile] = useState<File | null>(null)
    const [sourcePreview, setSourcePreview] = useState<string | null>(null)

    const [targetFile, setTargetFile] = useState<File | null>(null)
    const [targetPreview, setTargetPreview] = useState<string | null>(null)

    const [generatedImage, setGeneratedImage] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSourceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            if (file.size > 50 * 1024 * 1024) {
                setError('File size exceeds 50MB limit. Please upload a smaller image.')
                return
            }
            setSourceFile(file)
            setSourcePreview(URL.createObjectURL(file))
            setGeneratedImage(null)
            setError(null)
        }
    }

    const handleTargetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            if (file.size > 50 * 1024 * 1024) {
                setError('File size exceeds 50MB limit. Please upload a smaller image.')
                return
            }
            setTargetFile(file)
            setTargetPreview(URL.createObjectURL(file))
            setGeneratedImage(null)
            setError(null)
        }
    }

    const handleSwap = async () => {
        if (!sourceFile || !targetFile) return

        setIsLoading(true)
        setError(null)

        try {
            const formData = new FormData()
            formData.append('source_image', sourceFile)
            formData.append('target_image', targetFile)

            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://100.30.3.16'
            const response = await fetch(`${apiUrl}/api/face-swap`, {
                method: 'POST',
                body: formData,
            })

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
        }
    }

    const SAMPLE_FACES = [
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1000&auto=format&fit=crop", // Man portrait
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1000&auto=format&fit=crop", // Woman portrait
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop"  // Another man
    ]

    const SAMPLE_TARGETS = [
        "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1000&auto=format&fit=crop", // Man in suit
        "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=1000&auto=format&fit=crop", // Woman in gown
        "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1000&auto=format&fit=crop"  // Businessman
    ]

    const [isSampleLoading, setIsSampleLoading] = useState(false)

    const handleSampleSelect = async (url: string, type: 'source' | 'target') => {
        try {
            setIsSampleLoading(true)
            const response = await fetch(url)
            const blob = await response.blob()
            const file = new File([blob], `sample-${type}.jpg`, { type: 'image/jpeg' })

            if (type === 'source') {
                setSourceFile(file)
                setSourcePreview(url)
            } else {
                setTargetFile(file)
                setTargetPreview(url)
            }
            setGeneratedImage(null)
            setError(null)
        } catch (err) {
            console.error('Error loading sample image:', err)
            setError('Failed to load sample image.')
        } finally {
            setIsSampleLoading(false)
        }
    }

    return (
        <div className="w-full space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Source Face Upload */}
                <div className="space-y-4">
                    <Card className="overflow-hidden border-2 border-dashed border-gray-200 hover:border-indigo-500/50 transition-all">
                        <CardContent className="p-0 h-[400px] relative bg-gray-50 flex items-center justify-center">
                            {!sourcePreview ? (
                                <div className="text-center p-8">
                                    <div className="relative group cursor-pointer">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleSourceChange}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        />
                                        <div className="bg-indigo-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                            <User className="w-10 h-10 text-indigo-600" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900">Source Face</h3>
                                        <p className="text-sm text-gray-500 mt-2">The face you want to use</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="relative w-full h-full">
                                    <img
                                        src={sourcePreview}
                                        alt="Source Face"
                                        className="w-full h-full object-contain"
                                    />
                                    <button
                                        onClick={() => {
                                            setSourceFile(null)
                                            setSourcePreview(null)
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

                    {!sourcePreview && (
                        <div>
                            <p className="text-sm font-medium text-gray-700 mb-2">Or choose a sample face:</p>
                            <div className="grid grid-cols-3 gap-2">
                                {SAMPLE_FACES.map((url, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handleSampleSelect(url, 'source')}
                                        className="relative aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-indigo-500 transition-all"
                                    >
                                        <img src={url} alt={`Face ${i + 1}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Target Image Upload */}
                <div className="space-y-4">
                    <Card className="overflow-hidden border-2 border-dashed border-gray-200 hover:border-indigo-500/50 transition-all">
                        <CardContent className="p-0 h-[400px] relative bg-gray-50 flex items-center justify-center">
                            {!targetPreview ? (
                                <div className="text-center p-8">
                                    <div className="relative group cursor-pointer">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleTargetChange}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        />
                                        <div className="bg-purple-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                            <ImageIcon className="w-10 h-10 text-purple-600" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900">Target Image</h3>
                                        <p className="text-sm text-gray-500 mt-2">The image to swap the face into</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="relative w-full h-full">
                                    <img
                                        src={targetPreview}
                                        alt="Target Image"
                                        className="w-full h-full object-contain"
                                    />
                                    <button
                                        onClick={() => {
                                            setTargetFile(null)
                                            setTargetPreview(null)
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

                    {!targetPreview && (
                        <div>
                            <p className="text-sm font-medium text-gray-700 mb-2">Or choose a sample target:</p>
                            <div className="grid grid-cols-3 gap-2">
                                {SAMPLE_TARGETS.map((url, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handleSampleSelect(url, 'target')}
                                        className="relative aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-indigo-500 transition-all"
                                    >
                                        <img src={url} alt={`Target ${i + 1}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Action Button */}
            <div className="space-y-4">
                <div className="bg-amber-50 text-amber-800 p-4 rounded-lg text-center border border-amber-200 font-medium max-w-md mx-auto">
                    ⚠️ Integration still in progress. This feature is currently disabled.
                </div>
                <div className="flex justify-center">
                    <Button
                        size="lg"
                        onClick={handleSwap}
                        disabled={true}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 h-12 text-lg shadow-lg hover:shadow-xl transition-all"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Swapping Faces...
                            </>
                        ) : isSampleLoading ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Loading Sample...
                            </>
                        ) : (
                            <>
                                <RefreshCw className="mr-2 h-5 w-5" />
                                Swap Faces Now
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center border border-red-200 font-medium">
                    Error: {error}
                </div>
            )}

            {/* Result Area */}
            {generatedImage && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="h-px bg-gray-200 flex-1" />
                        <span className="text-gray-400 font-medium uppercase text-sm tracking-wider">Result</span>
                        <div className="h-px bg-gray-200 flex-1" />
                    </div>

                    <Card className="overflow-hidden shadow-2xl border-0 ring-1 ring-gray-200">
                        <CardContent className="p-0 bg-gray-900 min-h-[500px] relative flex items-center justify-center group">
                            <img
                                src={generatedImage}
                                alt="Face Swap Result"
                                className="max-h-[80vh] w-auto object-contain"
                            />
                            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex justify-center">
                                <a
                                    href={generatedImage}
                                    download="face-swap-result.png"
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


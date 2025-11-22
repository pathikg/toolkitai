'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Upload, Loader2, RefreshCw, Shirt, User, Download } from 'lucide-react'

export default function VirtualTryOnClient() {
    const [personFile, setPersonFile] = useState<File | null>(null)
    const [personPreview, setPersonPreview] = useState<string | null>(null)

    const [garmentFile, setGarmentFile] = useState<File | null>(null)
    const [garmentPreview, setGarmentPreview] = useState<string | null>(null)

    const [generatedImage, setGeneratedImage] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handlePersonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            if (file.size > 50 * 1024 * 1024) {
                setError('File size exceeds 50MB limit. Please upload a smaller image.')
                return
            }
            setPersonFile(file)
            setPersonPreview(URL.createObjectURL(file))
            setGeneratedImage(null)
            setError(null)
        }
    }

    const handleGarmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            if (file.size > 50 * 1024 * 1024) {
                setError('File size exceeds 50MB limit. Please upload a smaller image.')
                return
            }
            setGarmentFile(file)
            setGarmentPreview(URL.createObjectURL(file))
            setGeneratedImage(null)
            setError(null)
        }
    }

    const handleReset = () => {
        setPersonFile(null)
        setPersonPreview(null)
        setGarmentFile(null)
        setGarmentPreview(null)
        setGeneratedImage(null)
        setError(null)
    }

    const handleTryOn = async () => {
        if (!personFile || !garmentFile) return

        setIsLoading(true)
        setError(null)

        try {
            const formData = new FormData()
            formData.append('person_image', personFile)
            formData.append('garment_image', garmentFile)

            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://100.30.3.16'
            const response = await fetch(`${apiUrl}/api/virtual-try-on`, {
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

    const SAMPLE_PEOPLE = [
        "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=3087&auto=format&fit=crop", // Stylish woman street style
        "https://images.unsplash.com/photo-1761167474127-1c6e596ecea6?q=80&w=1287&auto=format&fit=crop", // Man in studio
        "https://images.unsplash.com/photo-1630173250799-2813d34ed14b?q=80&w=1365&auto=format&fit=crop"  // Woman full body studio
    ]

    const SAMPLE_GARMENTS = [
        "https://images.unsplash.com/photo-1695300576530-d4aacfe709b6?w=900&auto=format&fit=crop&q=60", // Casual men's outfit
        "https://images.unsplash.com/photo-1666635241732-10ddcf3801dc?q=80&w=1287&auto=format&fit=crop", // Stylish outerwear
        "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=2836&auto=format&fit=crop"  // Patterned Shirt (kept from before)
    ]

    const [isSampleLoading, setIsSampleLoading] = useState(false)

    const handleSampleSelect = async (url: string, type: 'person' | 'garment') => {
        try {
            setIsSampleLoading(true)
            const response = await fetch(url)
            const blob = await response.blob()
            const file = new File([blob], `sample-${type}.jpg`, { type: 'image/jpeg' })

            if (type === 'person') {
                setPersonFile(file)
                setPersonPreview(url)
            } else {
                setGarmentFile(file)
                setGarmentPreview(url)
            }
            setGeneratedImage(null)
            setError(null)
        } catch (err) {
            console.error('Error loading sample image:', err)
        } finally {
            setIsSampleLoading(false)
        }
    }

    return (
        <div className="w-full space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Person Upload */}
                <div className="space-y-4">
                    <Card className="overflow-hidden border-2 border-dashed border-gray-200 hover:border-indigo-500/50 transition-all">
                        <CardContent className="p-0 h-[400px] relative bg-gray-50 flex items-center justify-center">
                            {!personPreview ? (
                                <div className="text-center p-8">
                                    <div className="relative group cursor-pointer">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handlePersonChange}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        />
                                        <div className="bg-indigo-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                            <User className="w-10 h-10 text-indigo-600" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900">Upload Person</h3>
                                        <p className="text-sm text-gray-500 mt-2">The model who will wear the clothes</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="relative w-full h-full">
                                    <img
                                        src={personPreview}
                                        alt="Person"
                                        className="w-full h-full object-contain"
                                    />
                                    <button
                                        onClick={() => {
                                            setPersonFile(null)
                                            setPersonPreview(null)
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

                    {!personPreview && (
                        <div>
                            <p className="text-sm font-medium text-gray-700 mb-2">Or choose a sample model:</p>
                            <div className="grid grid-cols-3 gap-2">
                                {SAMPLE_PEOPLE.map((url, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handleSampleSelect(url, 'person')}
                                        className="relative aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-indigo-500 transition-all"
                                    >
                                        <img src={url} alt={`Model ${i + 1}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Garment Upload */}
                <div className="space-y-4">
                    <Card className="overflow-hidden border-2 border-dashed border-gray-200 hover:border-indigo-500/50 transition-all">
                        <CardContent className="p-0 h-[400px] relative bg-gray-50 flex items-center justify-center">
                            {!garmentPreview ? (
                                <div className="text-center p-8">
                                    <div className="relative group cursor-pointer">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleGarmentChange}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        />
                                        <div className="bg-purple-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                            <Shirt className="w-10 h-10 text-purple-600" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900">Upload Garment</h3>
                                        <p className="text-sm text-gray-500 mt-2">The clothes you want to try on</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="relative w-full h-full">
                                    <img
                                        src={garmentPreview}
                                        alt="Garment"
                                        className="w-full h-full object-contain"
                                    />
                                    <button
                                        onClick={() => {
                                            setGarmentFile(null)
                                            setGarmentPreview(null)
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

                    {!garmentPreview && (
                        <div>
                            <p className="text-sm font-medium text-gray-700 mb-2">Or choose sample clothes:</p>
                            <div className="grid grid-cols-3 gap-2">
                                {SAMPLE_GARMENTS.map((url, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handleSampleSelect(url, 'garment')}
                                        className="relative aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-indigo-500 transition-all"
                                    >
                                        <img src={url} alt={`Garment ${i + 1}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Action Button */}
            <div className="flex justify-center">
                <Button
                    size="lg"
                    onClick={handleTryOn}
                    disabled={!personFile || !garmentFile || isLoading || isSampleLoading}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 h-12 text-lg shadow-lg hover:shadow-xl transition-all"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Generating Virtual Try-On...
                        </>
                    ) : isSampleLoading ? (
                        <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Loading Sample...
                        </>
                    ) : (
                        <>
                            <Shirt className="mr-2 h-5 w-5" />
                            Try On Now
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
                        <span className="text-gray-400 font-medium uppercase text-sm tracking-wider">Result</span>
                        <div className="h-px bg-gray-200 flex-1" />
                    </div>

                    <Card className="overflow-hidden shadow-2xl border-0 ring-1 ring-gray-200">
                        <CardContent className="p-0 bg-gray-900 min-h-[500px] relative flex items-center justify-center group">
                            <img
                                src={generatedImage}
                                alt="Virtual Try-On Result"
                                className="max-h-[80vh] w-auto object-contain"
                            />
                            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex justify-center">
                                <a
                                    href={generatedImage}
                                    download="virtual-try-on-result.png"
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


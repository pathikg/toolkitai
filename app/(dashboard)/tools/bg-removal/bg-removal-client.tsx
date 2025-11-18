'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Eraser, Upload, Download, Loader2, RefreshCw, Image as ImageIcon, Palette, MousePointer2 } from 'lucide-react'
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider'
import { SOLID_COLORS, BACKGROUND_IMAGES } from './backgrounds'

export default function BgRemovalClient() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [processedUrl, setProcessedUrl] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Customize State
    const [mode, setMode] = useState<'compare' | 'customize'>('compare')
    const [bgType, setBgType] = useState<'transparent' | 'color' | 'image'>('transparent')
    const [bgValue, setBgValue] = useState<string>('') // Color hex or Image URL
    const [isDownloading, setIsDownloading] = useState(false)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setSelectedFile(file)
            const url = URL.createObjectURL(file)
            setPreviewUrl(url)
            setProcessedUrl(null)
            setError(null)
            setMode('compare')
            setBgType('transparent')
        }
    }

    const handleReset = () => {
        setSelectedFile(null)
        setPreviewUrl(null)
        setProcessedUrl(null)
        setError(null)
        setMode('compare')
    }

    const handleProcess = async () => {
        if (!selectedFile) return
        setIsLoading(true)
        setError(null)

        try {
            const formData = new FormData()
            formData.append('file', selectedFile)

            // Use environment variable or fallback to EC2 IP
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://100.30.3.16'
            const response = await fetch(`${apiUrl}/api/bg-removal`, {
                method: 'POST',
                body: formData,
            })

            if (!response.ok) throw new Error('Failed to process image')

            const blob = await response.blob()
            const url = URL.createObjectURL(blob)
            setProcessedUrl(url)
        } catch (err) {
            console.error(err)
            setError('Failed to process image. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    // Handle Custom Background Upload
    const handleBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const url = URL.createObjectURL(file)
            setBgType('image')
            setBgValue(url)
        }
    }

    // Canvas Merging Logic for Download
    const handleCompositeDownload = async () => {
        if (!processedUrl) return
        setIsDownloading(true)

        try {
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')
            if (!ctx) return

            // 1. Load Foreground (Subject) to get dimensions
            const foreground = new Image()
            foreground.crossOrigin = "anonymous"
            foreground.src = processedUrl

            await new Promise((resolve) => { foreground.onload = resolve })

            // Set canvas to match the subject's size
            canvas.width = foreground.naturalWidth
            canvas.height = foreground.naturalHeight

            // 2. Draw Background
            if (bgType === 'color') {
                ctx.fillStyle = bgValue
                ctx.fillRect(0, 0, canvas.width, canvas.height)
            } else if (bgType === 'image' && bgValue) {
                const background = new Image()
                background.crossOrigin = "anonymous"
                background.src = bgValue
                await new Promise((resolve, reject) => {
                    background.onload = resolve
                    background.onerror = () => resolve(null) // Skip bg if fail
                })

                // Draw background covering the canvas (Aspect Fill)
                const ratio = Math.max(canvas.width / background.naturalWidth, canvas.height / background.naturalHeight)
                const centerShift_x = (canvas.width - background.naturalWidth * ratio) / 2
                const centerShift_y = (canvas.height - background.naturalHeight * ratio) / 2
                ctx.drawImage(background, 0, 0, background.naturalWidth, background.naturalHeight, centerShift_x, centerShift_y, background.naturalWidth * ratio, background.naturalHeight * ratio)
            }

            // 3. Draw Foreground
            ctx.drawImage(foreground, 0, 0)

            // 4. Trigger Download
            const link = document.createElement('a')
            link.download = `custom-bg-${Date.now()}.png`
            link.href = canvas.toDataURL('image/png')
            link.click()

        } catch (err) {
            console.error('Download failed', err)
        } finally {
            setIsDownloading(false)
        }
    }

    return (
        <div className="max-w-5xl mx-auto w-full">
            <Card className="w-full overflow-hidden shadow-xl border-0 ring-1 ring-gray-200 py-0">
                <CardContent className="p-0">
                    <div className="flex flex-col lg:flex-row min-h-[600px] bg-white">
                        {/* LEFT: Main Canvas / Preview Area */}
                        <div className="flex-1 bg-gray-50/50 flex items-center justify-center relative overflow-hidden">
                            {/* Floating Reset Button */}
                            {previewUrl && (
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

                            {!previewUrl ? (
                                // Upload State
                                <div className="w-full max-w-md text-center">
                                    <div className="relative group cursor-pointer">
                                        <div className="absolute inset-0 bg-indigo-500/5 blur-2xl rounded-full group-hover:bg-indigo-500/10 transition-all duration-500" />
                                        <div className="relative bg-white border-2 border-dashed border-gray-200 rounded-2xl p-12 hover:border-indigo-500/50 hover:shadow-lg transition-all duration-300">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileChange}
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
                                </div>
                            ) : (
                                // Display State
                                <div className="relative w-full h-full flex items-center justify-center">
                                    {/* Mode: Compare (Slider) */}
                                    {mode === 'compare' && (
                                        <div className="relative h-full w-full flex items-center justify-center">
                                            <div className="relative shadow-lg rounded-lg overflow-hidden" style={{ maxHeight: '100%', maxWidth: '100%' }}>
                                                {processedUrl ? (
                                                    <ReactCompareSlider
                                                        itemOne={<ReactCompareSliderImage src={previewUrl} alt="Original" />}
                                                        itemTwo={<ReactCompareSliderImage src={processedUrl} alt="Result" className="bg-checkerboard" />}
                                                        style={{ display: 'flex', width: '100%', height: '100%' }}
                                                    />
                                                ) : (
                                                    <img src={previewUrl} alt="Preview" className="max-h-full max-w-full object-contain" />
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Mode: Customize (Compositor) */}
                                    {mode === 'customize' && processedUrl && (
                                        <div className="relative h-full w-full flex items-center justify-center">
                                            <div
                                                className="relative shadow-xl rounded-lg overflow-hidden"
                                                style={{
                                                    maxHeight: '100%',
                                                    maxWidth: '100%',
                                                    aspectRatio: 'auto' // Or bind to image aspect ratio if needed, but max-w/max-h usually suffices
                                                }}
                                            >
                                                {/* Background Layer */}
                                                <div
                                                    className="absolute inset-0 w-full h-full"
                                                    style={{
                                                        backgroundColor: bgType === 'color' ? bgValue : 'transparent',
                                                        backgroundImage: bgType === 'image' ? `url(${bgValue})` : (bgType === 'transparent' ? undefined : 'none'),
                                                        backgroundSize: 'cover',
                                                        backgroundPosition: 'center'
                                                    }}
                                                >
                                                    {bgType === 'transparent' && <div className="w-full h-full bg-checkerboard" />}
                                                </div>

                                                {/* Foreground Layer */}
                                                <img
                                                    src={processedUrl}
                                                    alt="Foreground"
                                                    className="relative z-10 max-h-[70vh] w-auto object-contain block"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* RIGHT: Sidebar / Controls */}
                        {previewUrl && (
                            <div className="w-full lg:w-[350px] bg-white border-l border-gray-200 p-6 flex flex-col gap-6 z-20">

                                {/* State: Processing */}
                                {!processedUrl ? (
                                    <div className="flex flex-col h-full items-center justify-center text-center space-y-4">
                                        <Button onClick={handleProcess} size="lg" disabled={isLoading} className="w-full">
                                            {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</> : <><Eraser className="mr-2 h-4 w-4" /> Remove Background</>}
                                        </Button>
                                        <p className="text-xs text-gray-500">AI processing takes 2-5 seconds</p>
                                    </div>
                                ) : (
                                    // State: Editing
                                    <>
                                        <div className="flex bg-gray-100 p-1 rounded-lg">
                                            <button
                                                onClick={() => setMode('compare')}
                                                className={`flex-1 flex items-center justify-center py-2 text-sm font-medium rounded-md transition-all ${mode === 'compare' ? 'bg-white shadow text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                                            >
                                                <MousePointer2 className="w-4 h-4 mr-2" /> Compare
                                            </button>
                                            <button
                                                onClick={() => setMode('customize')}
                                                className={`flex-1 flex items-center justify-center py-2 text-sm font-medium rounded-md transition-all ${mode === 'customize' ? 'bg-white shadow text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                                            >
                                                <Palette className="w-4 h-4 mr-2" /> Editor
                                            </button>
                                        </div>

                                        {mode === 'compare' ? (
                                            <div className="space-y-4">
                                                <div className="p-4 bg-blue-50 rounded-lg text-sm text-blue-700">
                                                    <p>Slide the handle to compare the original vs processed image.</p>
                                                </div>
                                                <Button onClick={() => handleCompositeDownload()} className="w-full bg-green-600 hover:bg-green-700" size="lg">
                                                    <Download className="mr-2 h-4 w-4" /> Download PNG
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="flex-1 flex flex-col overflow-hidden">
                                                <Tabs defaultValue="color" className="flex-1 flex flex-col">
                                                    <TabsList className="grid grid-cols-3 w-full mb-4">
                                                        <TabsTrigger value="color">Color</TabsTrigger>
                                                        <TabsTrigger value="image">Image</TabsTrigger>
                                                        <TabsTrigger value="upload">Upload</TabsTrigger>
                                                    </TabsList>

                                                    <div className="flex-1 overflow-y-auto pr-1 min-h-[200px]">
                                                        <TabsContent value="color" className="mt-0 space-y-4 px-2">
                                                            <div className="grid grid-cols-5 gap-2 ">
                                                                <button
                                                                    onClick={() => { setBgType('transparent'); setBgValue('') }}
                                                                    className={`w-full aspect-square rounded-md border-2 flex items-center justify-center ${bgType === 'transparent' ? 'border-indigo-600 ring-2 ring-indigo-100' : 'border-gray-200'}`}
                                                                    title="Transparent"
                                                                >
                                                                    <div className="w-full h-full bg-checkerboard rounded-sm" />
                                                                </button>
                                                                {SOLID_COLORS.map(color => (
                                                                    <button
                                                                        key={color}
                                                                        onClick={() => { setBgType('color'); setBgValue(color) }}
                                                                        className={`w-full aspect-square rounded-md border shadow-sm transition-transform hover:scale-105 ${bgType === 'color' && bgValue === color ? 'ring-2 ring-offset-1 ring-indigo-600' : ''}`}
                                                                        style={{ backgroundColor: color }}
                                                                    />
                                                                ))}
                                                            </div>
                                                        </TabsContent>

                                                        <TabsContent value="image" className="mt-0">
                                                            <div className="grid grid-cols-2 gap-2">
                                                                {BACKGROUND_IMAGES.map(img => (
                                                                    <button
                                                                        key={img.id}
                                                                        onClick={() => { setBgType('image'); setBgValue(img.url) }}
                                                                        className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${bgType === 'image' && bgValue === img.url ? 'border-indigo-600 ring-2 ring-indigo-100' : 'border-transparent hover:border-gray-300'}`}
                                                                    >
                                                                        <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </TabsContent>

                                                        <TabsContent value="upload" className="mt-0">
                                                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-400 transition-colors relative">
                                                                <input
                                                                    type="file"
                                                                    accept="image/*"
                                                                    onChange={handleBgUpload}
                                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                                />
                                                                <ImageIcon className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                                                                <p className="text-sm text-gray-600">Upload background</p>
                                                            </div>
                                                        </TabsContent>
                                                    </div>
                                                </Tabs>

                                                <div className="pt-4 border-t mt-4">
                                                    <Button onClick={handleCompositeDownload} disabled={isDownloading} className="w-full" size="lg">
                                                        {isDownloading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                                                        Download Result
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            <style jsx global>{`
        .bg-checkerboard {
          background-color: white;
          background-image:
            linear-gradient(45deg, #f0f0f0 25%, transparent 25%),
            linear-gradient(-45deg, #f0f0f0 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #f0f0f0 75%),
            linear-gradient(-45deg, transparent 75%, #f0f0f0 75%);
          background-size: 20px 20px;
          background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
        }
      `}</style>
        </div>
    )
}

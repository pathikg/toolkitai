'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, Sparkles, Play, Pause, Download } from 'lucide-react'

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export default function PodcastCreatorClient() {
    const [topic, setTopic] = useState('')
    const [language, setLanguage] = useState('en-US')
    const [isLoading, setIsLoading] = useState(false)
    const [loadingStep, setLoadingStep] = useState('')
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!isLoading) {
            setLoadingStep('')
            return
        }

        setLoadingStep('Writing script...')

        const timeout1 = setTimeout(() => {
            setLoadingStep('Generating voiceover...')
        }, 4000)

        const timeout2 = setTimeout(() => {
            setLoadingStep('Finalizing audio...')
        }, 12000)

        return () => {
            clearTimeout(timeout1)
            clearTimeout(timeout2)
        }
    }, [isLoading])

    const LANGUAGES = [
        { code: 'ar-EG', name: 'Arabic (Egyptian)' },
        { code: 'de-DE', name: 'German (Germany)' },
        { code: 'en-US', name: 'English (US)' },
        { code: 'es-US', name: 'Spanish (US)' },
        { code: 'fr-FR', name: 'French (France)' },
        { code: 'hi-IN', name: 'Hindi (India)' },
        { code: 'id-ID', name: 'Indonesian (Indonesia)' },
        { code: 'it-IT', name: 'Italian (Italy)' },
        { code: 'ja-JP', name: 'Japanese (Japan)' },
        { code: 'ko-KR', name: 'Korean (Korea)' },
        { code: 'pt-BR', name: 'Portuguese (Brazil)' },
        { code: 'ru-RU', name: 'Russian (Russia)' },
        { code: 'nl-NL', name: 'Dutch (Netherlands)' },
        { code: 'pl-PL', name: 'Polish (Poland)' },
        { code: 'th-TH', name: 'Thai (Thailand)' },
        { code: 'tr-TR', name: 'Turkish (Turkey)' },
        { code: 'vi-VN', name: 'Vietnamese (Vietnam)' },
        { code: 'ro-RO', name: 'Romanian (Romania)' },
        { code: 'uk-UA', name: 'Ukrainian (Ukraine)' },
        { code: 'bn-BD', name: 'Bengali (Bangladesh)' },
        { code: 'en-IN', name: 'English (India)' },
        { code: 'mr-IN', name: 'Marathi (India)' },
        { code: 'ta-IN', name: 'Tamil (India)' },
        { code: 'te-IN', name: 'Telugu (India)' },
    ]
    const [result, setResult] = useState<{ script: string; audio: string } | null>(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const audioRef = useRef<HTMLAudioElement | null>(null)

    // Clean up audio on unmount or new result
    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause()
                audioRef.current = null
            }
        }
    }, [result])

    const handleGenerate = async () => {
        if (!topic.trim()) return
        setIsLoading(true)
        setResult(null)
        setIsPlaying(false)
        setError(null)

        try {
            // Use environment variable or fallback to EC2 IP
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://100.30.3.16'

            // Call the backend API
            const response = await fetch(`${apiUrl}/api/podcast-creator`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ topic, language }),
            })

            if (!response.ok) {
                throw new Error('Failed to generate podcast')
            }

            const data = await response.json()
            console.log("Received audio data length:", data.audio_data.length)
            setResult({
                script: data.script_text,
                audio: `data:audio/wav;base64,${data.audio_data}`
            })

        } catch (err: any) {
            console.error(err)
            setError(err.message || 'Failed to generate podcast. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    const toggleAudio = () => {
        if (!result?.audio) return

        if (!audioRef.current) {
            // Initialize audio if not exists
            audioRef.current = new Audio(result.audio)
            audioRef.current.onended = () => setIsPlaying(false)
            audioRef.current.onpause = () => setIsPlaying(false)
            audioRef.current.onplay = () => setIsPlaying(true)
        }

        if (isPlaying) {
            audioRef.current.pause()
        } else {
            audioRef.current.play().catch(e => console.error("Playback error:", e))
        }
    }

    return (
        <div className="max-w-3xl mx-auto w-full">
            <Card className="w-full shadow-xl border-0 ring-1 ring-gray-200">
                <CardContent className="p-8">
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-2">
                                What's the topic of your podcast?
                            </label>
                            <Textarea
                                id="topic"
                                placeholder="e.g. The history of coffee, Quantum Physics, Euro 2024..."
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                className="min-h-[100px] text-lg resize-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Language
                            </label>
                            <Select value={language} onValueChange={setLanguage}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select language" />
                                </SelectTrigger>
                                <SelectContent>
                                    {LANGUAGES.map((lang) => (
                                        <SelectItem key={lang.code} value={lang.code}>
                                            {lang.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <Button
                            onClick={handleGenerate}
                            disabled={isLoading || !topic.trim()}
                            className="w-full h-12 text-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    {loadingStep || 'Producing Podcast...'}
                                </>
                            ) : (
                                <>
                                    <Sparkles className="mr-2 h-5 w-5" />
                                    Create Podcast
                                </>
                            )}
                        </Button>

                        {error && (
                            <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center border border-red-200 font-medium mt-4">
                                Error: {error}
                            </div>
                        )}

                        {result && (
                            <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                                        Script Preview
                                    </h3>
                                    <div className="prose max-w-none mb-6 max-h-96 overflow-y-auto p-4 bg-white rounded-lg border border-gray-200 whitespace-pre-wrap font-mono text-sm">
                                        {result.script}
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <Button
                                            onClick={toggleAudio}
                                            variant="outline"
                                            className="flex-1"
                                        >
                                            {isPlaying ? (
                                                <><Pause className="mr-2 h-4 w-4" /> Pause Podcast</>
                                            ) : (
                                                <><Play className="mr-2 h-4 w-4" /> Play Podcast</>
                                            )}
                                        </Button>

                                        <a
                                            href={result.audio}
                                            download="podcast-episode.mp3"
                                            className="flex-none"
                                        >
                                            <Button variant="ghost" size="icon">
                                                <Download className="h-4 w-4" />
                                            </Button>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

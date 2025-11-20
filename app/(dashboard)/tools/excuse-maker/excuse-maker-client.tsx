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

const LANGUAGES = [
    { code: 'ar-EG', name: 'Arabic (Egyptian)' },
    { code: 'en-US', name: 'English (US)' },
    { code: 'de-DE', name: 'German (Germany)' },
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

export default function ExcuseMakerClient() {
    const [scenario, setScenario] = useState('')
    const [language, setLanguage] = useState('en-US')
    const [isLoading, setIsLoading] = useState(false)
    const [result, setResult] = useState<{ text: string; audio: string } | null>(null)
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
        if (!scenario.trim()) return
        setIsLoading(true)
        setResult(null)
        setIsPlaying(false)

        try {
            // Use environment variable or fallback to EC2 IP
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://100.30.3.16'

            // Call the backend API
            const response = await fetch(`${apiUrl}/api/excuse-maker`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ scenario, language }),
            })

            if (!response.ok) {
                throw new Error('Failed to generate excuse')
            }

            const data = await response.json()
            console.log("Received audio data length:", data.audio_data.length)
            setResult({
                text: data.excuse_text,
                audio: `data:audio/wav;base64,${data.audio_data}`
            })

        } catch (err) {
            console.error(err)
            // You might want to show an error toast here
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
                            <label htmlFor="scenario" className="block text-sm font-medium text-gray-700 mb-2">
                                What do you need an excuse for?
                            </label>
                            <Textarea
                                id="scenario"
                                placeholder="e.g. I'm late for work because..."
                                value={scenario}
                                onChange={(e) => setScenario(e.target.value)}
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
                            disabled={isLoading || !scenario.trim()}
                            className="w-full h-12 text-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Generating Professional Excuse...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="mr-2 h-5 w-5" />
                                    Generate Excuse
                                </>
                            )}
                        </Button>

                        {result && (
                            <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                                        Your Professional Excuse
                                    </h3>
                                    <p className="text-xl text-gray-900 font-medium leading-relaxed mb-6">
                                        "{result.text}"
                                    </p>

                                    <div className="flex items-center gap-4">
                                        <Button
                                            onClick={toggleAudio}
                                            variant="outline"
                                            className="flex-1"
                                        >
                                            {isPlaying ? (
                                                <><Pause className="mr-2 h-4 w-4" /> Pause Audio</>
                                            ) : (
                                                <><Play className="mr-2 h-4 w-4" /> Play Audio</>
                                            )}
                                        </Button>

                                        <a
                                            href={result.audio}
                                            download="professional-excuse.mp3"
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


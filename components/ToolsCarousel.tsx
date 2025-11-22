'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { LucideIcon, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Tool {
    id: string
    name: string
    description: string
    icon: LucideIcon
    category: string
}

interface ToolsCarouselProps {
    tools: Tool[]
    requireAuth?: boolean
}

export function ToolsCarousel({ tools, requireAuth = false }: ToolsCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isAutoPlaying, setIsAutoPlaying] = useState(true)

    // Auto-scroll every 4 seconds
    useEffect(() => {
        if (!isAutoPlaying) return

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % tools.length)
        }, 4000)

        return () => clearInterval(interval)
    }, [isAutoPlaying, tools.length])

    const goToNext = () => {
        setIsAutoPlaying(false)
        setCurrentIndex((prev) => (prev + 1) % tools.length)
    }

    const goToPrev = () => {
        setIsAutoPlaying(false)
        setCurrentIndex((prev) => (prev - 1 + tools.length) % tools.length)
    }

    const goToSlide = (index: number) => {
        setIsAutoPlaying(false)
        setCurrentIndex(index)
    }

    // Get visible tools (show 4 on desktop, 2 on tablet, 1 on mobile)
    const getVisibleTools = () => {
        const visibleCount = 4
        const result = []
        for (let i = 0; i < visibleCount; i++) {
            const index = (currentIndex + i) % tools.length
            result.push(tools[index])
        }
        return result
    }

    const visibleTools = getVisibleTools()

    return (
        <div className="relative">
            {/* Carousel Container */}
            <div className="overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-500">
                    {visibleTools.map((tool, idx) => {
                        const Icon = tool.icon
                        const href = requireAuth ? '/login' : `/tools/${tool.id}`

                        return (
                            <Link
                                key={`${tool.id}-${idx}`}
                                href={href}
                                className="group animate-fade-in"
                            >
                                <Card className="h-full transition-all hover:shadow-xl hover:scale-[1.02] border-2 hover:border-indigo-300 cursor-pointer">
                                    <CardHeader className="space-y-3">
                                        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-4 rounded-xl w-fit group-hover:scale-110 transition-transform">
                                            <Icon className="w-8 h-8 text-white" />
                                        </div>
                                        <CardTitle className="text-xl group-hover:text-indigo-600 transition-colors">
                                            {tool.name}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <CardDescription className="text-base">
                                            {tool.description}
                                        </CardDescription>
                                    </CardContent>
                                </Card>
                            </Link>
                        )
                    })}
                </div>
            </div>

            {/* Navigation Arrows */}
            <div className="flex justify-center items-center gap-4 mt-8">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={goToPrev}
                    className="rounded-full hover:bg-indigo-50"
                >
                    <ChevronLeft className="w-5 h-5" />
                </Button>

                {/* Dots Indicator */}
                <div className="flex gap-2">
                    {tools.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`w-2 h-2 rounded-full transition-all ${index === currentIndex
                                    ? 'bg-indigo-600 w-8'
                                    : 'bg-gray-300 hover:bg-gray-400'
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>

                <Button
                    variant="outline"
                    size="icon"
                    onClick={goToNext}
                    className="rounded-full hover:bg-indigo-50"
                >
                    <ChevronRight className="w-5 h-5" />
                </Button>
            </div>

            {/* Tool Count */}
            <div className="text-center mt-4 text-sm text-gray-600">
                Showing {visibleTools.length} of {tools.length} tools
            </div>
        </div>
    )
}


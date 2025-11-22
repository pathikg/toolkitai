import { Navbar } from '@/components/Navbar'
import { ToolCard } from '@/components/ToolCard'
import {
  Users,
  Eraser,
  FileImage,
  Camera,
  PenTool,
  Video,
  Wand2,
  Music,
  Type,
  Sparkles,
  Shirt,
  Mic
} from 'lucide-react'

// Available Tools - Ready to use
const availableTools = [
  {
    id: 'virtual-try-on',
    name: 'Virtual Try-On',
    description: 'See how clothes look on you instantly with AI virtual try-on.',
    icon: Shirt,
    href: '/tools/virtual-try-on',
    category: 'image' as const,
  },
  {
    id: 'bg-removal',
    name: 'Background Removal',
    description: 'Remove backgrounds from images instantly with AI-powered precision.',
    icon: Eraser,
    href: '/tools/bg-removal',
    category: 'image' as const,
  },
  {
    id: 'face-swap',
    name: 'Face Swap',
    description: 'Swap faces in photos with AI precision. Perfect for creative projects and fun edits.',
    icon: Users,
    href: '/tools/face-swap',
    category: 'image' as const,
  },
  {
    id: 'podcast-creator',
    name: 'AI Podcast Creator',
    description: 'Generate grounded podcast dialogues between Emily and Mark on any topic.',
    icon: Mic,
    href: '/tools/podcast-creator',
    category: 'audio' as const,
  },
]

// Coming Soon - Tools in development
const upcomingTools = [
  {
    id: 'gif-maker',
    name: 'GIF Maker',
    description: 'Create animated GIFs from videos or images with custom settings.',
    icon: FileImage,
    category: 'video' as const,
  },
  {
    id: 'mugshot-maker',
    name: 'Mugshot Generator',
    description: 'Generate realistic mugshot-style photos with AI technology.',
    icon: Camera,
    category: 'image' as const,
  },
  {
    id: 'poem-generator',
    name: 'Poem Generator',
    description: 'Create beautiful poems instantly using advanced AI language models.',
    icon: PenTool,
    category: 'text' as const,
  },
  {
    id: 'video-enhance',
    name: 'Video Enhancer',
    description: 'Enhance video quality with AI upscaling and restoration.',
    icon: Video,
    category: 'video' as const,
  },
  {
    id: 'image-upscale',
    name: 'Image Upscaler',
    description: 'Upscale images without quality loss using AI enhancement.',
    icon: Wand2,
    category: 'image' as const,
  },
  {
    id: 'voice-clone',
    name: 'Voice Cloner',
    description: 'Clone and synthesize voices with AI technology.',
    icon: Music,
    category: 'audio' as const,
  },
  {
    id: 'text-summarize',
    name: 'Text Summarizer',
    description: 'Summarize long texts intelligently with AI.',
    icon: Type,
    category: 'text' as const,
  },
]

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-3 rounded-xl">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            AI-Powered Tools
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Transform your creative workflow with our suite of AI tools
          </p>
        </div>

        {/* Available Tools Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-indigo-600" />
            Available Now
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {availableTools.map((tool) => (
              <ToolCard
                key={tool.id}
                name={tool.name}
                description={tool.description}
                icon={tool.icon}
                href={tool.href}
                featured={true}
              />
            ))}
          </div>
        </section>

        {/* Upcoming Tools Section */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Video className="w-6 h-6 text-purple-600" />
            Coming Soon
          </h2>
          <p className="text-gray-600 mb-6">
            These tools are currently in development and will be available soon!
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingTools.map((tool) => (
              <div key={tool.id} className="relative">
                <div className="absolute top-4 right-4 z-10 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                  Coming Soon
                </div>
                <div className="opacity-60 pointer-events-none">
                  <ToolCard
                    name={tool.name}
                    description={tool.description}
                    icon={tool.icon}
                    href="#"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}


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
  Sparkles
} from 'lucide-react'

const featuredTools = [
  {
    id: 'face-swap',
    name: 'Face Swap',
    description: 'Swap faces in photos with AI precision. Perfect for creative projects and fun edits.',
    icon: Users,
    href: '/tools/face-swap',
    category: 'image' as const,
    featured: true,
  },
  {
    id: 'bg-removal',
    name: 'Background Removal',
    description: 'Remove backgrounds from images instantly with AI-powered precision.',
    icon: Eraser,
    href: '/tools/bg-removal',
    category: 'image' as const,
    featured: true,
  },
  {
    id: 'gif-maker',
    name: 'GIF Maker',
    description: 'Create animated GIFs from videos or images with custom settings.',
    icon: FileImage,
    href: '/tools/gif-maker',
    category: 'video' as const,
    featured: true,
  },
  {
    id: 'mugshot-maker',
    name: 'Mugshot Generator',
    description: 'Generate realistic mugshot-style photos with AI technology.',
    icon: Camera,
    href: '/tools/mugshot-maker',
    category: 'image' as const,
    featured: true,
  },
  {
    id: 'poem-generator',
    name: 'Poem Generator',
    description: 'Create beautiful poems instantly using advanced AI language models.',
    icon: PenTool,
    href: '/tools/poem-generator',
    category: 'text' as const,
    featured: true,
  },
]

const allTools = [
  ...featuredTools,
  {
    id: 'video-enhance',
    name: 'Video Enhancer',
    description: 'Enhance video quality with AI upscaling',
    icon: Video,
    href: '/tools/video-enhance',
    category: 'video' as const,
  },
  {
    id: 'image-upscale',
    name: 'Image Upscaler',
    description: 'Upscale images without quality loss',
    icon: Wand2,
    href: '/tools/image-upscale',
    category: 'image' as const,
  },
  {
    id: 'voice-clone',
    name: 'Voice Cloner',
    description: 'Clone and synthesize voices with AI',
    icon: Music,
    href: '/tools/voice-clone',
    category: 'audio' as const,
  },
  {
    id: 'text-summarize',
    name: 'Text Summarizer',
    description: 'Summarize long texts intelligently',
    icon: Type,
    href: '/tools/text-summarize',
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

        {/* Featured Tools Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-indigo-600" />
            Featured Tools
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTools.map((tool) => (
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

        {/* All Tools Grid */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">All Tools</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {allTools.map((tool) => (
              <ToolCard
                key={tool.id}
                name={tool.name}
                description={tool.description}
                icon={tool.icon}
                href={tool.href}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}


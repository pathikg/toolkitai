import { Navbar } from '@/components/Navbar'
import { ToolCard } from '@/components/ToolCard'
import { Sparkles, Video, Clock } from 'lucide-react'
import { availableTools, upcomingTools } from '@/lib/tools-data'

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
            <Clock className="w-6 h-6 text-gray-600" />
            Coming Soon
          </h2>
          <p className="text-gray-600 mb-6">
            These tools are currently in development and will be available soon!
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingTools.map((tool) => (
              <div key={tool.id} className="relative group">
                <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] rounded-lg z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-sm font-medium text-gray-700 bg-white px-4 py-2 rounded-full shadow-md border border-gray-200">
                    Coming Soon
                  </span>
                </div>
                <div className="opacity-50 pointer-events-none">
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


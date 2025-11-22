import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'

interface ToolCardProps {
  name: string
  description: string
  icon: LucideIcon
  href: string
  featured?: boolean
  onClick?: (href: string) => void
}

export function ToolCard({ name, description, icon: Icon, href, featured = false, onClick }: ToolCardProps) {
  const handleClick = () => {
    if (onClick) {
      onClick(href)
    }
  }

  if (featured) {
    return (
      <div onClick={handleClick} className="group cursor-pointer">
        <Card className="relative h-full overflow-hidden transition-all duration-400 ease-out hover:shadow-[0_20px_40px_rgb(0,0,0,0.06)] hover:-translate-y-1.5 border border-gray-100 hover:border-indigo-200 cursor-pointer bg-white">
          {/* Gradient Glow Effect on Hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-transparent to-purple-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

          <CardHeader className="space-y-4 relative z-10">
            <div className="bg-indigo-50 p-4 rounded-2xl w-fit transition-all duration-300 shadow-sm group-hover:scale-110 group-hover:bg-indigo-600 group-hover:shadow-indigo-500/30 text-indigo-600 group-hover:text-white">
              <Icon className="w-8 h-8" strokeWidth={2} />
            </div>
            <CardTitle className="text-xl font-bold tracking-tight group-hover:text-indigo-600 transition-colors">
              {name}
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <CardDescription className="text-base leading-relaxed text-gray-600">{description}</CardDescription>
            {/* Action Hint */}
            <div className="mt-6 flex items-center text-sm font-bold text-indigo-600 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
              Try it now <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div onClick={handleClick} className="group cursor-pointer">
      <Card className="relative h-full overflow-hidden transition-all duration-300 ease-out hover:shadow-lg hover:-translate-y-1 hover:border-indigo-200 cursor-pointer bg-white border-gray-100">
        {/* Subtle Glow on Hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/30 via-transparent to-purple-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none" />

        <CardHeader className="space-y-3 relative z-10">
          <div className="bg-indigo-50 p-3 rounded-xl w-fit transition-all duration-300 group-hover:scale-110 group-hover:bg-indigo-100 text-indigo-600">
            <Icon className="w-6 h-6" strokeWidth={2} />
          </div>
          <CardTitle className="text-lg font-semibold tracking-tight group-hover:text-indigo-600 transition-colors">
            {name}
          </CardTitle>
        </CardHeader>
        <CardContent className="relative z-10">
          <CardDescription className="text-sm leading-relaxed text-gray-600">{description}</CardDescription>
        </CardContent>
      </Card>
    </div>
  )
}


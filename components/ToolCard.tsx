import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'
import Link from 'next/link'

interface ToolCardProps {
  name: string
  description: string
  icon: LucideIcon
  href: string
  featured?: boolean
}

export function ToolCard({ name, description, icon: Icon, href, featured = false }: ToolCardProps) {
  if (featured) {
    return (
      <Link href={href} className="group">
        <Card className="h-full transition-all hover:shadow-xl hover:scale-[1.02] border-2 hover:border-indigo-300 cursor-pointer">
          <CardHeader className="space-y-3">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-4 rounded-xl w-fit group-hover:scale-110 transition-transform">
              <Icon className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl group-hover:text-indigo-600 transition-colors">
              {name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-base">{description}</CardDescription>
          </CardContent>
        </Card>
      </Link>
    )
  }

  return (
    <Link href={href} className="group">
      <Card className="h-full transition-all hover:shadow-lg hover:scale-[1.02] hover:border-indigo-200 cursor-pointer">
        <CardHeader className="space-y-2">
          <div className="bg-gradient-to-br from-indigo-100 to-purple-100 p-3 rounded-lg w-fit group-hover:scale-110 transition-transform">
            <Icon className="w-6 h-6 text-indigo-600" />
          </div>
          <CardTitle className="text-lg group-hover:text-indigo-600 transition-colors">
            {name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>{description}</CardDescription>
        </CardContent>
      </Card>
    </Link>
  )
}


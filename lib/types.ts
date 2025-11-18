export interface Tool {
  id: string
  name: string
  description: string
  icon: string
  href: string
  category: 'image' | 'video' | 'text' | 'audio'
  featured?: boolean
}

export interface User {
  id: string
  email: string
  name?: string
  avatar_url?: string
}


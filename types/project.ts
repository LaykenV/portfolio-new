export type ProjectTier = 'hero' | 'featured' | 'more'

export interface Project {
  slug: string
  title: string
  tagline: string
  description: string
  longDescription: string
  image: string
  secondaryImage: string
  techStack: string[]
  tier: ProjectTier
  links: {
    github?: string | null
    live?: string | null
  }
  award?: {
    label: string
    icon?: string
  }
}

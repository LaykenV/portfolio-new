export interface Project {
  slug: string
  title: string
  tagline: string
  description: string
  longDescription: string
  image: string
  secondaryImage: string
  techStack: string[]
  links: {
    github?: string | null
    live?: string | null
  }
}


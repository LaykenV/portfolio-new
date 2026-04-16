import type { Project } from '@/types/project'

interface StructuredDataProps {
  projects: Project[]
}

export function StructuredData({ projects }: StructuredDataProps) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.laykenvarholdt.com'

  // Person schema for the portfolio owner
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Layken Varholdt',
    jobTitle: 'AI Engineer',
    worksFor: {
      '@type': 'Organization',
      name: 'DOL',
    },
    url: baseUrl,
    image: `${baseUrl}/portrait.jpeg`,
    sameAs: [
      'https://x.com/LLVarholdt',
      'https://github.com/laykenV',
      'https://www.linkedin.com/in/layken-varholdt-a78687230/',
    ],
    knowsAbout: [
      'AI Engineering',
      'Multi-agent orchestration',
      'Document intelligence',
      'RAG',
      'LLM infrastructure',
      'Next.js',
      'TypeScript',
      'React',
      'Convex',
      'OpenAI',
      'Claude',
      'Gemini',
    ],
    description:
      'AI engineer shipping production systems — document intelligence pipelines, multi-agent orchestration, and the infrastructure that keeps AI features reliable at scale. 1st place at the Convex Modern Stack Hackathon ($10k).',
  }

  // WebSite schema for search box potential
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Layken Varholdt Portfolio',
    url: baseUrl,
    author: {
      '@type': 'Person',
      name: 'Layken Varholdt',
    },
    description:
      'Portfolio of Layken Varholdt, an AI engineer shipping production systems — document intelligence, multi-agent orchestration, and AI infrastructure.',
  }

  // ProfilePage schema
  const profilePageSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    mainEntity: {
      '@type': 'Person',
      name: 'Layken Varholdt',
      jobTitle: 'AI Engineer',
      url: baseUrl,
      image: `${baseUrl}/portrait.jpeg`,
    },
  }

  // ItemList schema for projects showcase
  const projectsListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Portfolio Projects',
    description: 'Production AI systems and full-stack applications built by Layken Varholdt',
    numberOfItems: projects.length,
    itemListElement: projects.map((project, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'SoftwareApplication',
        name: project.title,
        description: project.description,
        image: `${baseUrl}${project.image}`,
        applicationCategory: 'WebApplication',
        operatingSystem: 'Web Browser',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        ...(project.links?.live && { url: project.links.live }),
        ...(project.links?.github && { codeRepository: project.links.github }),
        keywords: project.techStack.join(', '),
        author: {
          '@type': 'Person',
          name: 'Layken Varholdt',
        },
      },
    })),
  }

  // BreadcrumbList schema for navigation
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: baseUrl,
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectsListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  )
}


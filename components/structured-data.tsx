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
    jobTitle: 'Software Engineer',
    worksFor: {
      '@type': 'Organization',
      name: 'Zyxware Technologies',
    },
    affiliation: {
      '@type': 'Organization',
      name: 'U.S. Department of Labor',
    },
    url: baseUrl,
    image: `${baseUrl}/portrait.jpeg`,
    sameAs: [
      'https://x.com/LLVarholdt',
      'https://github.com/laykenV',
      'https://www.linkedin.com/in/layken-varholdt-a78687230/',
    ],
    knowsAbout: [
      'Full-stack software engineering',
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
      'Software engineer building production web applications with React, TypeScript, Java, and applied AI. U.S. Department of Labor contractor and 1st-place Convex hackathon winner.',
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
      'Portfolio of Layken Varholdt, a software engineer building production web applications, workflow systems, and applied AI features.',
  }

  // ProfilePage schema
  const profilePageSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    mainEntity: {
      '@type': 'Person',
      name: 'Layken Varholdt',
      jobTitle: 'Software Engineer',
      url: baseUrl,
      image: `${baseUrl}/portrait.jpeg`,
    },
  }

  const applicationCategories: Record<string, string> = {
    'atlas-outbound': 'BusinessApplication',
    'acadiana-web-design': 'BusinessApplication',
    'mesh-mind': 'DeveloperApplication',
    civicly: 'ReferenceApplication',
    'food-truck-flow': 'BusinessApplication',
    omnibid: 'BusinessApplication',
    'teach-magic': 'EducationalApplication',
  }

  // ItemList schema for projects showcase. Use narrower types where the
  // portfolio item is source code or a website rather than a purchasable app.
  const projectsListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Portfolio Projects',
    description: 'Production web applications, workflow systems, and applied AI projects built by Layken Varholdt',
    numberOfItems: projects.length,
    itemListElement: projects.map((project, index) => {
      const common = {
        name: project.title,
        description: project.description,
        image: `${baseUrl}${project.image}`,
        ...(project.links?.live && { url: project.links.live }),
        ...(project.links?.github && { sameAs: project.links.github }),
        keywords: project.techStack.join(', '),
        author: {
          '@type': 'Person',
          name: 'Layken Varholdt',
        },
      }

      let item
      if (project.slug === 'agency-template') {
        item = {
          '@type': 'SoftwareSourceCode',
          ...common,
          ...(project.links?.github && { codeRepository: project.links.github }),
        }
      } else if (project.slug === 'varholdt-ai') {
        item = {
          '@type': 'WebSite',
          ...common,
        }
      } else {
        item = {
          '@type': ['SoftwareApplication', 'WebApplication'],
          ...common,
          applicationCategory:
            applicationCategories[project.slug] ?? 'BusinessApplication',
          operatingSystem: 'Web Browser',
        }
      }

      return {
        '@type': 'ListItem',
        position: index + 1,
        item,
      }
    }),
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
    </>
  )
}

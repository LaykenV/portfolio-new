import Link from 'next/link'
import { WritingHeader } from '@/components/writing-header'
import { ArrowRight } from 'lucide-react'

import type { Metadata } from 'next'
import { postList } from '@/lib/posts'

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Writing on software engineering, applied AI, document workflows, and the systems behind production products.',
  alternates: {
    canonical: '/blog',
  },
  openGraph: {
    title: 'Blog — Layken Varholdt',
    description:
      'Writing on software engineering, applied AI, document workflows, and the systems behind production products.',
    url: '/blog',
    siteName: 'Layken Varholdt',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://www.laykenvarholdt.com/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Layken Varholdt — Blog',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog — Layken Varholdt',
    description:
      'Writing on software engineering, applied AI, document workflows, and the systems behind production products.',
    creator: '@LLVarholdt',
    images: ['https://www.laykenvarholdt.com/twitter-image'],
  },
}

function PostTitle({ title }: { title: string }) {
  const words = title.split(' ')
  const beginning = words.slice(0, -2).join(' ')
  const ending = words.slice(-2).join(' ')
  return (
    <h2 className="post-row-title">
      {beginning && `${beginning} `}
      <span className="post-row-ending">
        {ending}
        <span className="post-row-arrow" aria-hidden="true"><ArrowRight size={14} /></span>
      </span>
    </h2>
  )
}

export default function BlogIndex() {
  return (
    <div className="font-sans mx-auto max-w-3xl min-h-dvh px-5 pb-14 pt-5 md:px-6 md:py-20 flex flex-col gap-8 md:gap-10">
      <WritingHeader backHref="/" backLabel="Home" />

      <section className="flex flex-col gap-3 md:gap-6">
        <div className="flex flex-col gap-3">
          <div className="section-eyebrow">Writing</div>
          <h1 className="hero-title">
            Notes on <em>shipping AI</em>.
          </h1>
          <p className="hero-sub">
            On multi-agent orchestration, document intelligence pipelines and
            production AI infrastructure.
          </p>
        </div>

        <ul className="flex flex-col gap-4">
          {postList.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className="post-row group"
                aria-label={`Read: ${post.title}.`}
              >
                <div className="flex flex-col gap-2 min-w-0">
                  <div className="writing-meta flex items-center gap-2 text-xs">
                    <time
                      dateTime={post.publishedISO.slice(0, 10)}
                      className="mono-accent"
                    >
                      {post.publishedReadable}
                    </time>
                    <span aria-hidden="true">·</span>
                    <span className="mono-accent">
                      ~{post.readMinutes} min read
                    </span>
                  </div>
                  <PostTitle title={`${post.title}.`} />
                  <p className="post-row-desc">{post.listingDescription}</p>
                  <div className="flex flex-wrap gap-x-2 gap-y-1 pt-1">
                    {post.tags.map((tag, i) => (
                      <span key={tag} className="tech-badge-compact">
                        {i > 0 && <span className="tag-sep" aria-hidden="true">·</span>}
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

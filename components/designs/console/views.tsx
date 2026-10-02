'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { ArrowUpRight, CornerDownRight } from 'lucide-react'

import { BIO, EXPERIENCE, topStack } from '@/components/designs/aggregate'
import { ELSEWHERE, IDENTITY, liveHost } from '@/components/variants/identity'
import { posts } from '@/data/posts'
import type { Project } from '@/types/project'

type OpenDoc = (id: string) => void

export function AboutView({ projects, onOpen }: { projects: Project[]; onOpen: OpenDoc }) {
  const stack = topStack(projects, 8)
  const max = stack[0]?.count ?? 1
  const hero = projects.filter((p) => p.tier === 'hero')

  return (
    <article className="cn-doc">
      <header className="cn-about-head">
        <Image
          src={IDENTITY.portrait}
          alt="Layken Varholdt"
          width={160}
          height={160}
          className="cn-portrait"
          priority
        />
        <div>
          <p className="cn-live">
            <span className="cn-dot" aria-hidden="true" /> Open to software engineering roles
          </p>
          <h2 className="cn-h1">
            <span className="cn-hash" aria-hidden="true">
              #{' '}
            </span>
            {IDENTITY.name}
          </h2>
          <p className="cn-lede">
            {IDENTITY.role}, {EXPERIENCE.company} for the {EXPERIENCE.client}.
          </p>
        </div>
      </header>

      <p className="cn-prose">{BIO}</p>

      <div className="cn-actions">
        <a className="cn-btn cn-btn-primary" href={IDENTITY.email}>
          Say hello
        </a>
        <a className="cn-btn" href={IDENTITY.resume} target="_blank" rel="noreferrer noopener">
          Résumé
        </a>
        <button type="button" className="cn-btn" onClick={() => onOpen('contact')}>
          All contact options
        </button>
      </div>

      <h3 className="cn-h2">
        <span className="cn-hash" aria-hidden="true">
          ##{' '}
        </span>
        Selected work
      </h3>
      <ul className="cn-cards">
        {hero.map((p) => (
          <li key={p.slug}>
            <button type="button" className="cn-card" onClick={() => onOpen(`p:${p.slug}`)}>
              <span className="cn-card-file">{p.slug}.tsx</span>
              <span className="cn-card-title">{p.title}</span>
              <span className="cn-card-tag">{p.tagline}</span>
              {p.award && (
                <span className="cn-badge">
                  {p.award.icon} {p.award.label}
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>

      <h3 className="cn-h2">
        <span className="cn-hash" aria-hidden="true">
          ##{' '}
        </span>
        Experience
      </h3>
      <div className="cn-exp">
        <p className="cn-exp-role">
          {EXPERIENCE.title} <span className="cn-dim">@ {EXPERIENCE.company}</span>
        </p>
        <p className="cn-dim">Client: {EXPERIENCE.client}</p>
        <ul className="cn-list">
          {EXPERIENCE.bullets.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
      </div>

      <h3 className="cn-h2">
        <span className="cn-hash" aria-hidden="true">
          ##{' '}
        </span>
        Most used across projects
      </h3>
      <ul className="cn-bars" aria-label="Technologies by number of projects">
        {stack.map((s) => (
          <li key={s.name}>
            <span className="cn-bar-name">{s.name}</span>
            <span className="cn-bar-track" aria-hidden="true">
              <span className="cn-bar-fill" style={{ width: `${(s.count / max) * 100}%` }} />
            </span>
            <span className="cn-bar-count">
              {s.count}
              <span className="sr-only"> projects</span>
            </span>
          </li>
        ))}
      </ul>
    </article>
  )
}

export function ProjectView({ project, index, total }: { project: Project; index: number; total: number }) {
  const [view, setView] = useState<'landing' | 'app'>('landing')
  const src = view === 'landing' ? project.image : project.secondaryImage
  const host = liveHost(project)

  return (
    <article className="cn-doc">
      <header>
        <p className="cn-eyebrow">
          project {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </p>
        <h2 className="cn-h1">
          <span className="cn-hash" aria-hidden="true">
            #{' '}
          </span>
          {project.title}
        </h2>
        <p className="cn-lede">{project.tagline}</p>
        {project.award && (
          <p className="cn-badge">
            {project.award.icon} {project.award.label}
          </p>
        )}
      </header>

      <div className="cn-actions">
        {project.links.live && (
          <a className="cn-btn cn-btn-primary" href={project.links.live} target="_blank" rel="noreferrer noopener">
            Open {host} <ArrowUpRight size={14} aria-hidden="true" />
          </a>
        )}
        {project.links.github && (
          <a className="cn-btn" href={project.links.github} target="_blank" rel="noreferrer noopener">
            Source <ArrowUpRight size={14} aria-hidden="true" />
          </a>
        )}
      </div>

      <figure className="cn-shot">
        <div className="cn-shot-bar">
          <span className="cn-shot-dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span className="cn-shot-url">{host}</span>
          <div className="cn-seg" role="group" aria-label="Screenshot">
            {(['landing', 'app'] as const).map((v) => (
              <button
                key={v}
                type="button"
                aria-pressed={view === v}
                onClick={() => setView(v)}
              >
                {v === 'landing' ? 'Landing' : 'The app'}
              </button>
            ))}
          </div>
        </div>
        <Image
          key={src}
          src={src}
          alt={`${project.title} ${view === 'landing' ? 'landing page' : 'application interface'}`}
          width={1440}
          height={810}
          sizes="(min-width: 1100px) 760px, 94vw"
          className="cn-shot-img"
        />
      </figure>

      <p className="cn-prose">{project.longDescription}</p>

      <h3 className="cn-h2">
        <span className="cn-hash" aria-hidden="true">
          ##{' '}
        </span>
        Stack
      </h3>
      <pre className="cn-code" aria-label={`Technologies: ${project.techStack.join(', ')}`}>
        <code>
          {['const stack = [', ...project.techStack.map((t) => `  "${t}",`), ']'].map((l, i) => (
            <span key={i} className="cn-code-line" data-n={i + 1}>
              {l}
            </span>
          ))}
        </code>
      </pre>
    </article>
  )
}

export function PostView({ slug }: { slug: string }) {
  const post = posts.find((p) => p.slug === slug)
  if (!post) return null
  return (
    <article className="cn-doc">
      <header>
        <p className="cn-eyebrow">
          <time dateTime={post.date}>{post.dateReadable}</time> · {post.readMinutes} min read
        </p>
        <h2 className="cn-h1">
          <span className="cn-hash" aria-hidden="true">
            #{' '}
          </span>
          {post.title}
        </h2>
      </header>
      <p className="cn-prose">{post.description}</p>
      <ul className="cn-tags">
        {post.tags.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
      <div className="cn-actions">
        <Link className="cn-btn cn-btn-primary" href={`/blog/${post.slug}`}>
          Read the full post <ArrowUpRight size={14} aria-hidden="true" />
        </Link>
        <Link className="cn-btn" href="/blog">
          All writing
        </Link>
      </div>
    </article>
  )
}

export function ContactView() {
  return (
    <article className="cn-doc">
      <header>
        <p className="cn-eyebrow">#!/usr/bin/env bash</p>
        <h2 className="cn-h1">
          <span className="cn-hash" aria-hidden="true">
            #{' '}
          </span>
          Let&rsquo;s talk
        </h2>
        <p className="cn-lede">{IDENTITY.headline}. Email is fastest; a call works too.</p>
      </header>
      <ul className="cn-cmds">
        <li>
          <a href={IDENTITY.email}>
            <span className="cn-prompt" aria-hidden="true">
              <CornerDownRight size={13} />
            </span>
            <span className="cn-cmd">mail</span>
            <span className="cn-cmd-arg">{IDENTITY.emailLabel}</span>
          </a>
        </li>
        {ELSEWHERE.map((row) => {
          const external = !row.href.startsWith('/')
          const body = (
            <>
              <span className="cn-prompt" aria-hidden="true">
                <CornerDownRight size={13} />
              </span>
              <span className="cn-cmd">open</span>
              <span className="cn-cmd-arg">{row.label}</span>
            </>
          )
          return (
            <li key={row.key}>
              {external ? (
                <a href={row.href} target="_blank" rel="noreferrer noopener">
                  {body}
                </a>
              ) : (
                <Link href={row.href}>{body}</Link>
              )}
            </li>
          )
        })}
        <li>
          <a href={IDENTITY.telegram} target="_blank" rel="noreferrer noopener">
            <span className="cn-prompt" aria-hidden="true">
              <CornerDownRight size={13} />
            </span>
            <span className="cn-cmd">open</span>
            <span className="cn-cmd-arg">Telegram</span>
          </a>
        </li>
      </ul>
      <p className="cn-dim">
        Prefer the keyboard? Press <kbd>Ctrl</kbd> <kbd>K</kbd> and type &ldquo;hire&rdquo;.
      </p>
    </article>
  )
}

export function EmptyView({ onPalette }: { onPalette: () => void }) {
  return (
    <div className="cn-empty">
      <p className="cn-empty-title">No file open</p>
      <p className="cn-dim">Pick something from the explorer, or jump straight to it.</p>
      <button type="button" className="cn-btn cn-btn-primary" onClick={onPalette}>
        Open command palette
      </button>
    </div>
  )
}

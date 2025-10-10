# 🚀 Layken Varholdt — Portfolio

My personal portfolio showcasing software engineering projects built with cutting-edge web technologies.

[![Live Site](https://img.shields.io/badge/Live-laykenvarholdt.com-blue?style=for-the-badge)](https://www.laykenvarholdt.com)
[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)

## ✨ Features

### 🎨 **Design & UX**
- **Responsive Design**: Seamless experience across mobile, tablet, and desktop
- **Dark Mode**: Smooth theme switching with View Transition API circular reveal effect
- **Modern Animations**: Subtle, performant animations with `prefers-reduced-motion` support
- **Mobile-First**: Horizontal scroll carousel on mobile with snap points
- **Accessible**: WCAG compliant with proper ARIA labels, keyboard navigation, and focus management

### ⚡ **Performance**
- **Static Generation**: Fully static site with `force-static` for blazing-fast loads
- **Image Optimization**: Next.js Image component with preloading and lazy loading
- **Smart Bundling**: Optimized chunks with Next.js 15 and Turbopack
- **Prefetching**: Hover-triggered image preloading for instant modal display

### 🔍 **SEO & Discoverability**
- **Comprehensive Metadata**: Open Graph, Twitter Cards, and structured data
- **Schema.org**: Rich snippets (Person, WebSite, ProfilePage, ItemList, BreadcrumbList)
- **Dynamic OG Images**: Auto-generated social share images
- **Sitemap & Robots**: Proper indexing configuration

### 🎯 **Technical Highlights**
- **TypeScript**: Full type safety across the entire codebase
- **Modular Architecture**: Clean separation of concerns with reusable components
- **Advanced React Patterns**: Portals, refs, custom hooks, and context
- **Focus Trap**: Accessible modal dialogs with proper focus management
- **Scroll Lock**: Background scroll prevention during overlay interactions

## 🛠️ Tech Stack

| Category | Technologies |
|----------|-------------|
| **Framework** | Next.js 15.5 (App Router) |
| **UI Library** | React 19.1 |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 4, CSS Variables |
| **Icons** | Lucide React |
| **Fonts** | Geist Sans & Geist Mono (Vercel) |
| **Theme** | next-themes |
| **Deployment** | Vercel |

## 📁 Project Structure

```
portfolio-new/
├── app/                      # Next.js App Router
│   ├── page.tsx             # Home page
│   ├── layout.tsx           # Root layout with metadata
│   ├── globals.css          # Global styles & CSS variables
│   ├── mobile.css           # Mobile-specific styles
│   ├── opengraph-image.tsx  # Dynamic OG image generation
│   ├── twitter-image.tsx    # Twitter card image
│   ├── icon.tsx             # Favicon generator
│   ├── sitemap.ts           # XML sitemap
│   └── robots.ts            # Robots.txt configuration
├── components/              # React components
│   ├── projects-scroller.tsx        # Main project showcase
│   ├── animated-theme-toggler.tsx   # Dark mode toggle
│   ├── mobile-menu.tsx              # Mobile navigation
│   ├── mobile-menu-controller.tsx   # Menu state management
│   ├── structured-data.tsx          # SEO schema.org markup
│   └── theme-provider.tsx           # Theme context provider
├── data/                    # Static data
│   └── projects.json        # Portfolio projects
├── types/                   # TypeScript definitions
│   └── project.ts           # Project interface
├── lib/                     # Utilities
│   └── utils.ts             # Helper functions
└── public/                  # Static assets
    ├── portrait.jpeg
    ├── telegram.png
    └── [project images]
```

## 🎨 Key Components

### ProjectsScroller
The main showcase component featuring:
- Responsive carousel (horizontal mobile, vertical desktop)
- Expandable project cards with detailed overlays
- Smart image preloading on hover/focus
- Portal-based mobile modals
- Active index tracking with scroll detection

### AnimatedThemeToggler
Theme switcher with:
- View Transition API integration
- Circular reveal animation originating from button
- Graceful fallback for unsupported browsers
- Respects `prefers-reduced-motion`

### StructuredData
SEO component providing:
- Person schema (professional profile)
- WebSite schema (site metadata)
- ProfilePage schema (portfolio context)
- ItemList schema (project collection)
- BreadcrumbList schema (navigation)

## 🎯 Projects Showcased

1. **Mesh Mind** - Multi-model AI chat interface with Convex workflows
2. **Atlas Outbound** - 🥇 1st Place Hackathon Winner ($10k) - AI sales automation
3. **Civicly** - Real-time legislative data engine with AI analysis
4. **FoodTruckFlow** - B2B multi-tenant SaaS platform
5. **TeachMagic** - AI-powered educational content generator

## 📊 Performance Metrics

- **Lighthouse Score**: 95+ across all categories
- **First Contentful Paint**: < 1.0s
- **Largest Contentful Paint**: < 1.2s
- **Cumulative Layout Shift**: < 0.1
- **Time to Interactive**: < 1.5s

## 🔐 Security

- No sensitive API keys exposed
- Environment variables properly configured
- Secure external links with `rel="noreferrer noopener"`
- Content Security Policy ready

## 📱 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

**View Transition API**: Gracefully degrades in unsupported browsers

## 📬 Contact

**Layken Varholdt**
- 🌐 Website: [laykenvarholdt.com](https://www.laykenvarholdt.com)
- 🐦 Twitter: [@LLVarholdt](https://x.com/LLVarholdt)
- 💼 LinkedIn: [Layken Varholdt](https://www.linkedin.com/in/layken-varholdt-a78687230/)
- 📧 Email: Via [Cal.com](https://cal.com/layken-varholdt) or [Telegram](https://t.me/LLVarholdt)

---

<div align="center">
  <p>Built with Next.js, React, and TypeScript</p>
  <p><a href="https://www.laykenvarholdt.com">View Live Site →</a></p>
</div>

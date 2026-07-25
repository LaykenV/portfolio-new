import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./mobile.css";
import { AppThemeProvider } from '../components/theme-provider';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.laykenvarholdt.com'),
  title: {
    default: 'Layken Varholdt - Software Engineer',
    template: '%s — Layken Varholdt',
  },
  description:
    'Software engineer building production web applications with React, TypeScript, Java, and applied AI. U.S. Department of Labor contractor and 1st-place Convex hackathon winner.',
  keywords: [
    'Layken Varholdt',
    'Software engineer',
    'Full-stack engineer',
    'multi-agent orchestration',
    'document intelligence',
    'RAG',
    'LLM infrastructure',
    'Convex',
    'Next.js',
    'TypeScript',
    'React',
    'production AI',
    'agentic systems',
  ],
  authors: [{ name: 'Layken Varholdt', url: 'https://x.com/LLVarholdt' }],
  creator: 'Layken Varholdt',
  publisher: 'Layken Varholdt',
  applicationName: 'Layken Varholdt Portfolio',
  category: 'Portfolio',
  classification: 'Personal Website',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Layken Varholdt - Software Engineer',
    description:
      'Software engineer building production web applications with React, TypeScript, Java, and applied AI. U.S. Department of Labor contractor and 1st-place Convex hackathon winner.',
    url: '/',
    siteName: 'Layken Varholdt',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://www.laykenvarholdt.com/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Layken Varholdt - Software Engineer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Layken Varholdt - Software Engineer',
    description:
      'Software engineer building production web applications with React, TypeScript, Java, and applied AI.',
    creator: '@LLVarholdt',
    images: ['https://www.laykenvarholdt.com/twitter-image'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  icons: {
    icon: '/icon',
  },
};

export const viewport: Viewport = {
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Matches defaultTheme. ThemeColorSync corrects it after mount if the
            visitor has a stored preference, and on every toggle. */}
        <meta name="theme-color" content="#0A0A0A" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased app-background`}
      >
        <AppThemeProvider>
          {children}
        </AppThemeProvider>
      </body>
    </html>
  );
}

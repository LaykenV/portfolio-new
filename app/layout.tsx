import type { Metadata } from "next";
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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.laykenvarholdt.com'),
  title: {
    default: 'Layken Varholdt — Software Engineer',
    template: '%s — Layken Varholdt',
  },
  description:
    'Software engineer building fast, beautiful web applications with modern stacks like Next.js, TypeScript, Convex, and more.',
  keywords: [
    'Layken Varholdt',
    'software engineer',
    'web developer',
    'Next.js',
    'TypeScript',
    'React',
    'Convex',
    'Stripe',
    'Supabase',
    'PostgreSQL',
    'AI',
    'SaaS',
  ],
  authors: [{ name: 'Layken Varholdt', url: 'https://x.com/LLVarholdt' }],
  creator: 'Layken Varholdt',
  publisher: 'Layken Varholdt',
  applicationName: 'Layken Varholdt Portfolio',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Layken Varholdt — Software Engineer',
    description:
      'I build websites and products with cutting-edge technology and realtime sync.',
    url: '/',
    siteName: 'Layken Varholdt',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Layken Varholdt — Software Engineer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Layken Varholdt — Software Engineer',
    description:
      'I build websites and products with cutting-edge technology and realtime sync.',
    creator: '@LLVarholdt',
    images: ['/twitter-image'],
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
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FAF9F6' },
    { media: '(prefers-color-scheme: dark)', color: '#0A0A0A' },
  ],
  icons: {
    icon: '/icon',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased app-background`}
      >
        <AppThemeProvider>{children}</AppThemeProvider>
      </body>
    </html>
  );
}

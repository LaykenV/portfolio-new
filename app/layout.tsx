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
    default: 'Layken Varholdt — AI Engineer',
    template: '%s — Layken Varholdt',
  },
  description:
    'AI engineer shipping production systems: document intelligence pipelines, multi-agent orchestration, and the infrastructure that keeps AI features reliable. 1st place at the Convex Modern Stack Hackathon ($10k).',
  keywords: [
    'Layken Varholdt',
    'AI engineer',
    'AI engineering',
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
  verification: {
    // Add verification codes when you have them
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
  openGraph: {
    title: 'Layken Varholdt — AI Engineer',
    description:
      'AI engineer shipping production systems — document intelligence, multi-agent orchestration, and reliable AI infrastructure. 1st place at the Convex Modern Stack Hackathon ($10k).',
    url: '/',
    siteName: 'Layken Varholdt',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://www.laykenvarholdt.com/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Layken Varholdt — AI Engineer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Layken Varholdt — AI Engineer',
    description:
      'AI engineer shipping production systems — document intelligence, multi-agent orchestration, and reliable AI infrastructure.',
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

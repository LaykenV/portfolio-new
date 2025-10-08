'use client'

import Link from 'next/link'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="font-sans min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Animated 404 */}
        <div className="relative">
          <h1 className="text-9xl font-bold tracking-tight opacity-10 select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="card p-8 animate-in fade-in zoom-in-95 duration-300">
              <h2 className="text-2xl font-semibold tracking-tight mb-2">
                Page Not Found
              </h2>
              <p className="text-sm opacity-80">
                The page you&apos;re looking for doesn&apos;t exist or has been moved.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-12 animate-in fade-in slide-in-from-bottom-2 duration-300" style={{ animationDelay: '100ms', animationFillMode: 'backwards' }}>
          <Link
            href="/"
            className="btn-accent btn-compact inline-flex items-center justify-center gap-2 px-6"
          >
            <Home className="h-4 w-4" />
            Back to Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="btn-accent-invert btn-compact inline-flex items-center justify-center gap-2 px-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  )
}


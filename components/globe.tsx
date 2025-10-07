"use client"

import { useEffect, useRef } from "react"
import createGlobe, { COBEOptions } from "cobe"
import { useMotionValue, useSpring } from "motion/react"

import { cn } from "@/lib/utils"

const MOVEMENT_DAMPING = 1400

const GLOBE_CONFIG: COBEOptions = {
  width: 800,
  height: 800,
  onRender: () => {},
  devicePixelRatio: 2,
  phi: 0,
  theta: 0.3,
  dark: 0,
  diffuse: 0.4,
  mapSamples: 16000,
  mapBrightness: 1.2,
  baseColor: [1, 1, 1],
  markerColor: [251 / 255, 100 / 255, 21 / 255],
  glowColor: [1, 1, 1],
  markers: [
    { location: [14.5995, 120.9842], size: 0.03 },
    { location: [19.076, 72.8777], size: 0.1 },
    { location: [23.8103, 90.4125], size: 0.05 },
    { location: [30.0444, 31.2357], size: 0.07 },
    { location: [39.9042, 116.4074], size: 0.08 },
    { location: [-23.5505, -46.6333], size: 0.1 },
    { location: [19.4326, -99.1332], size: 0.1 },
    { location: [40.7128, -74.006], size: 0.1 },
    { location: [34.6937, 135.5022], size: 0.05 },
    { location: [41.0082, 28.9784], size: 0.06 },
  ],
}

export function Globe({
  className,
  config = GLOBE_CONFIG,
}: {
  className?: string
  config?: COBEOptions
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const phiRef = useRef(0)
  const widthRef = useRef(0)
  const globeRef = useRef<ReturnType<typeof createGlobe> | null>(null)
  const pointerInteracting = useRef<number | null>(null)
  const pointerInteractionMovement = useRef(0)
  const lastDarkRef = useRef<boolean | null>(null)

  const r = useMotionValue(0)
  const rs = useSpring(r, {
    mass: 1,
    damping: 30,
    stiffness: 100,
  })

  

  const updatePointerInteraction = (value: number | null) => {
    pointerInteracting.current = value
    if (canvasRef.current) {
      canvasRef.current.style.cursor = value !== null ? "grabbing" : "grab"
    }
  }

  const updateMovement = (clientX: number) => {
    if (pointerInteracting.current !== null) {
      const delta = clientX - pointerInteracting.current
      pointerInteractionMovement.current = delta
      r.set(r.get() + delta / MOVEMENT_DAMPING)
    }
  }

  useEffect(() => {
    let destroyed = false
    const prefersReduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const clamp01 = (n: number) => Math.max(0, Math.min(1, n))
    const hslToRgbNormalized = (h: number, s: number, l: number): [number, number, number] => {
      const c = (1 - Math.abs(2 * l - 1)) * s
      const hp = (h % 360) / 60
      const x = c * (1 - Math.abs((hp % 2) - 1))
      let r = 0, g = 0, b = 0
      if (0 <= hp && hp < 1) [r, g, b] = [c, x, 0]
      else if (1 <= hp && hp < 2) [r, g, b] = [x, c, 0]
      else if (2 <= hp && hp < 3) [r, g, b] = [0, c, x]
      else if (3 <= hp && hp < 4) [r, g, b] = [0, x, c]
      else if (4 <= hp && hp < 5) [r, g, b] = [x, 0, c]
      else if (5 <= hp && hp < 6) [r, g, b] = [c, 0, x]
      const m = l - c / 2
      return [clamp01(r + m), clamp01(g + m), clamp01(b + m)]
    }
    const getNormalizedRgbFromHslVar = (varName: string, fallback: [number, number, number]): [number, number, number] => {
      try {
        const root = getComputedStyle(document.documentElement)
        const raw = root.getPropertyValue(varName).trim()
        if (!raw) return fallback
        const parts = raw.split(/\s+/)
        if (parts.length < 3) return fallback
        const h = parseFloat(parts[0])
        const s = parseFloat(parts[1]) / 100
        const l = parseFloat(parts[2]) / 100
        return hslToRgbNormalized(h, s, l)
      } catch {
        return fallback
      }
    }

    const getDpr = () => Math.min(2, window.devicePixelRatio || 1)
    const isDark = () => document.documentElement.classList.contains("dark")

    const onResize = () => {
      if (!canvasRef.current) return
      widthRef.current = canvasRef.current.offsetWidth

      // Create the globe lazily only when visible on md+ (width > 0)
      if (widthRef.current > 0 && !globeRef.current && !destroyed) {
        const accentRgb = getNormalizedRgbFromHslVar("--peach-strong", [251 / 255, 100 / 255, 21 / 255])
        const baseRgb: [number, number, number] = isDark() ? [0.92, 0.92, 0.92] : [1, 1, 1]
        lastDarkRef.current = isDark()

        globeRef.current = createGlobe(canvasRef.current, {
          ...config,
          devicePixelRatio: getDpr(),
          dark: isDark() ? 1 : 0,
          baseColor: baseRgb,
          markerColor: accentRgb,
          glowColor: accentRgb,
          width: widthRef.current * 2,
          height: widthRef.current * 2,
          onRender: (state) => {
            // Theme sync on every frame (cheap check, updates only on change)
            const darkNow = isDark()
            if (lastDarkRef.current !== darkNow) {
              lastDarkRef.current = darkNow
              const accentNow = getNormalizedRgbFromHslVar("--peach-strong", [251 / 255, 100 / 255, 21 / 255])
              const baseNow: [number, number, number] = darkNow ? [0.92, 0.92, 0.92] : [1, 1, 1]
              state.dark = darkNow ? 1 : 0
              state.baseColor = baseNow
              state.markerColor = accentNow
              state.glowColor = accentNow
            }

            if (!prefersReduce && !pointerInteracting.current) phiRef.current += 0.005
            state.phi = phiRef.current + rs.get()
            state.width = widthRef.current * 2
            state.height = widthRef.current * 2
          },
        })

        setTimeout(() => {
          if (canvasRef.current) canvasRef.current.style.opacity = "1"
        }, 0)
      }

      // If hidden (e.g., below md), destroy to save resources
      if (widthRef.current === 0 && globeRef.current) {
        globeRef.current.destroy()
        globeRef.current = null
      }
    }

    const ro = new ResizeObserver(onResize)
    if (canvasRef.current?.parentElement) {
      ro.observe(canvasRef.current.parentElement)
    }
    window.addEventListener("resize", onResize)
    onResize()

    return () => {
      destroyed = true
      if (globeRef.current) {
        globeRef.current.destroy()
        globeRef.current = null
      }
      window.removeEventListener("resize", onResize)
      ro.disconnect()
    }
  }, [rs, config])

  return (
    <div
      className={cn(
        "absolute inset-0 mx-auto aspect-[1/1] w-full max-w-[600px]",
        className
      )}
    >
      <canvas
        className={cn(
          "size-full opacity-0 transition-opacity duration-500 [contain:layout_paint_size]"
        )}
        ref={canvasRef}
        onPointerDown={(e) => {
          pointerInteracting.current = e.clientX
          updatePointerInteraction(e.clientX)
        }}
        onPointerUp={() => updatePointerInteraction(null)}
        onPointerOut={() => updatePointerInteraction(null)}
        onMouseMove={(e) => updateMovement(e.clientX)}
        onTouchMove={(e) =>
          e.touches[0] && updateMovement(e.touches[0].clientX)
        }
      />
    </div>
  )
}

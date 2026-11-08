import { useEffect, useRef, useState } from 'react'

type Point = { x: number; y: number }

/**
 * Soft neighbourhood grid for the landing hero. Pointer pulls nearby nodes;
 * paused offscreen and disabled under prefers-reduced-motion (SVG fallback).
 */
export function NeighbourhoodGridCanvas({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const pointer = useRef<Point | null>(null)
  const raf = useRef(0)
  const [motionOk, setMotionOk] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setMotionOk(!mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    if (!motionOk) return

    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const darkScheme = window.matchMedia('(prefers-color-scheme: dark)')
    const palette = () =>
      darkScheme.matches
        ? { line: 'rgba(238, 243, 246, 0.06)', node: '63, 179, 169' }
        : { line: 'rgba(16, 36, 58, 0.07)', node: '10, 101, 96' }
    let colors = palette()
    const onScheme = () => {
      colors = palette()
    }
    darkScheme.addEventListener('change', onScheme)

    let visible = true
    let cols = 0
    let rows = 0
    let gap = 0
    let nodes: Point[] = []

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const { width, height } = wrap.getBoundingClientRect()
      canvas.width = Math.max(1, Math.floor(width * dpr))
      canvas.height = Math.max(1, Math.floor(height * dpr))
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      gap = width < 640 ? 44 : 56
      cols = Math.ceil(width / gap) + 2
      rows = Math.ceil(height / gap) + 2
      nodes = []
      for (let row = 0; row < rows; row += 1) {
        for (let col = 0; col < cols; col += 1) {
          nodes.push({
            x: col * gap - gap,
            y: row * gap - gap,
          })
        }
      }
    }

    const draw = () => {
      if (!visible) {
        raf.current = requestAnimationFrame(draw)
        return
      }

      const { width, height } = wrap.getBoundingClientRect()
      ctx.clearRect(0, 0, width, height)

      const ptr = pointer.current
      const pull = 18
      const reach = 140

      const drawn: Point[] = nodes.map((node) => {
        if (!ptr) return node
        const dx = node.x - ptr.x
        const dy = node.y - ptr.y
        const dist = Math.hypot(dx, dy) || 1
        if (dist > reach) return node
        const t = 1 - dist / reach
        const strength = t * t * pull
        return {
          x: node.x - (dx / dist) * strength,
          y: node.y - (dy / dist) * strength,
        }
      })

      ctx.lineWidth = 1
      ctx.strokeStyle = colors.line
      for (let row = 0; row < rows; row += 1) {
        for (let col = 0; col < cols - 1; col += 1) {
          const a = drawn[row * cols + col]
          const b = drawn[row * cols + col + 1]
          ctx.beginPath()
          ctx.moveTo(a.x, a.y)
          ctx.lineTo(b.x, b.y)
          ctx.stroke()
        }
      }
      for (let col = 0; col < cols; col += 1) {
        for (let row = 0; row < rows - 1; row += 1) {
          const a = drawn[row * cols + col]
          const b = drawn[(row + 1) * cols + col]
          ctx.beginPath()
          ctx.moveTo(a.x, a.y)
          ctx.lineTo(b.x, b.y)
          ctx.stroke()
        }
      }

      for (let i = 0; i < drawn.length; i += 1) {
        const node = drawn[i]
        let alpha = 0.12
        if (ptr) {
          const dist = Math.hypot(node.x - ptr.x, node.y - ptr.y)
          if (dist < reach) {
            alpha = 0.12 + (1 - dist / reach) * 0.35
          }
        }
        ctx.fillStyle = `rgba(${colors.node}, ${alpha})`
        ctx.beginPath()
        ctx.arc(node.x, node.y, 1.6, 0, Math.PI * 2)
        ctx.fill()
      }

      raf.current = requestAnimationFrame(draw)
    }

    const onMove = (event: PointerEvent) => {
      const rect = wrap.getBoundingClientRect()
      pointer.current = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      }
    }
    const onLeave = () => {
      pointer.current = null
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
      },
      { threshold: 0.05 },
    )
    observer.observe(wrap)

    resize()
    raf.current = requestAnimationFrame(draw)
    wrap.addEventListener('pointermove', onMove, { passive: true })
    wrap.addEventListener('pointerleave', onLeave)
    window.addEventListener('resize', resize)

    return () => {
      cancelAnimationFrame(raf.current)
      observer.disconnect()
      darkScheme.removeEventListener('change', onScheme)
      wrap.removeEventListener('pointermove', onMove)
      wrap.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('resize', resize)
    }
  }, [motionOk])

  if (!motionOk) {
    // Reduced motion: the same grid, at rest. Hairlines and nodes from the
    // palette, faded toward the copy so the lettering stays first.
    return (
      <div className={className} aria-hidden>
        <svg className="ng-hero-grid-static absolute inset-0 size-full" role="presentation">
          <defs>
            <pattern id="ng-hero-grid" width="56" height="56" patternUnits="userSpaceOnUse">
              <path d="M56 0H0V56" fill="none" stroke="var(--color-foreground)" strokeOpacity="0.07" />
              <circle cx="0" cy="0" r="1.6" fill="var(--color-primary)" fillOpacity="0.28" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#ng-hero-grid)" />
        </svg>
      </div>
    )
  }

  return (
    <div ref={wrapRef} className={className} aria-hidden>
      <canvas ref={canvasRef} className="absolute inset-0 size-full" />
    </div>
  )
}

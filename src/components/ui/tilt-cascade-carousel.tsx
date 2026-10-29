import * as React from "react"

/**
 * Tilt Cascade Carousel with Auto-Flip — square photos on a slanted line.
 * The active card in front auto-flips between the story details and the festival photograph.
 */

export type TiltCascadeItem = {
  title: string
  caption?: string
  src?: string
  alt?: string
  number?: string
  date?: string
  detail?: string
}

export type TiltCascadeCarouselProps = {
  items: TiltCascadeItem[]
  height?: string
  slideSize?: string
  angle?: number
  drop?: number
  inactiveScale?: number
  radius?: number
  bounce?: number
  duration?: number
  loop?: boolean
  autoplay?: number
  autoFlip?: boolean
  flipDelay?: number
  titles?: boolean
  captions?: boolean
  controls?: boolean
  background?: string
  color?: string
  fontFamily?: string
  fontHref?: string | null
  index?: number
  defaultIndex?: number
  onIndexChange?: (index: number) => void
  onSelect?: (item: TiltCascadeItem, index: number) => void
  ariaLabel?: string
  className?: string
}

export function wrapIndex(i: number, n: number): number {
  if (n <= 0) return 0
  return ((i % n) + n) % n
}

export function indexAt(pos: number, n: number, loop: boolean): number {
  if (n <= 0) return 0
  const i = Math.round(pos)
  return loop ? wrapIndex(i, n) : Math.min(Math.max(i, 0), n - 1)
}

export function offsetOf(i: number, pos: number, n: number, loop: boolean): number {
  const d = i - pos
  return loop && n > 0 ? d - n * Math.round(d / n) : d
}

export function scaleAt(d: number, min: number): number {
  return 1 - (1 - min) * Math.min(Math.abs(d), 1)
}

export function rubber(pos: number, n: number): number {
  if (pos < 0) return pos / 3
  if (pos > n - 1) return n - 1 + (pos - (n - 1)) / 3
  return pos
}

export function springOf(bounce: number, duration: number): { omega: number; slide: number; tilt: number } {
  const b = Math.min(Math.max(bounce, 0), 0.9)
  return { omega: (2 * Math.PI) / Math.max(duration, 0.1), slide: 1 - b / 2, tilt: 1 - b }
}

export function springStep(x: number, v: number, target: number, omega: number, zeta: number, dt: number): number[] {
  const steps = Math.max(1, Math.ceil(dt / (1 / 240)))
  const h = dt / steps
  for (let k = 0; k < steps; k++) {
    v += (-omega * omega * (x - target) - 2 * zeta * omega * v) * h
    x += v * h
  }
  return [x, v]
}

export function releaseTarget(pos: number, velocity: number, n: number, loop: boolean): number {
  const here = Math.round(pos)
  let t = Math.round(pos + velocity * 0.2)
  t = Math.min(Math.max(t, here - 3), here + 3)
  return loop ? t : Math.min(Math.max(t, 0), n - 1)
}

export function targetFor(i: number, target: number, n: number, loop: boolean): number {
  if (!loop) return Math.min(Math.max(i, 0), n - 1)
  const here = Math.round(target)
  let d = i - wrapIndex(here, n)
  d -= n * Math.round(d / n)
  return here + d
}

const CSS =
  ".tcc-root{position:relative;overflow:hidden;display:grid;place-items:center;width:100%;" +
  "color:var(--dark-green,#245F30);user-select:none;-webkit-user-select:none;touch-action:pan-y;" +
  "outline:none;-webkit-tap-highlight-color:transparent}" +
  ".tcc-root:focus-visible{box-shadow:inset 0 0 0 2px var(--orange,#FF8A45)}" +
  ".tcc-root[data-dragging]{cursor:grabbing}" +
  ".tcc-root[data-dragging] .tcc-slide{cursor:grabbing}" +
  ".tcc-stage{position:relative;aspect-ratio:1/1;margin-top:1.5rem}" +
  ".tcc-slide{position:absolute;inset:0;margin:0;padding:0;border:0;background:none;color:inherit;font:inherit;" +
  "cursor:pointer;will-change:transform;transform-origin:50% 50%;-webkit-tap-highlight-color:transparent}" +
  ".tcc-slide:focus-visible{outline:none}" +
  ".tcc-frame{position:absolute;inset:0;overflow:hidden;border-radius:var(--tcc-r);" +
  "background:var(--white,#fff);border:2px solid var(--border,#DDE8DC);" +
  "box-shadow:0 10px 28px rgba(36,95,48,0.12);perspective:1000px}" +
  ".tcc-slide[data-active] .tcc-frame{border-color:var(--orange,#FF8A45);box-shadow:0 12px 34px rgba(255,138,69,0.22),0 4px 14px rgba(36,95,48,0.1)}" +
  ".tcc-flip-inner{position:relative;width:100%;height:100%;display:grid;transform-style:preserve-3d;-webkit-transform-style:preserve-3d;transition:transform 0.85s cubic-bezier(0.34,1.25,0.64,1)}" +
  ".tcc-flip-inner.is-flipped{transform:rotateY(180deg)}" +
  ".tcc-face{position:absolute;inset:0;width:100%;height:100%;-webkit-backface-visibility:hidden;backface-visibility:hidden;overflow:hidden}" +
  ".tcc-front{display:flex;flex-direction:column;align-items:flex-start;padding:18px 16px;background:var(--white,#fff);border-top:4px solid var(--green,#347A3D);text-align:left;box-sizing:border-box}" +
  ".tcc-slide:nth-child(even) .tcc-front{border-top-color:var(--orange,#FF8A45)}" +
  ".tcc-story-number{color:var(--orange-text,#A5481F);font-family:Manrope,sans-serif;font-size:26px;font-weight:800;line-height:1}" +
  ".tcc-story-date{color:var(--green,#347A3D);font-size:10px;font-weight:800;letter-spacing:0.08em;margin-top:6px;line-height:1.2}" +
  ".tcc-story-title{color:var(--dark-green,#245F30);font-family:Manrope,sans-serif;font-size:16px;font-weight:800;line-height:1.2;margin-top:4px}" +
  ".tcc-story-detail{color:var(--secondary,#426448);font-size:12px;line-height:1.45;margin-top:6px;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}" +
  ".tcc-flip-hint{margin-top:auto;color:var(--orange-text,#A5481F);font-size:10px;font-weight:800;letter-spacing:0.04em}" +
  ".tcc-back{transform:rotateY(180deg);background:var(--deep-green,#174422)}" +
  ".tcc-back>img{position:absolute;inset:0;width:100%;height:100%;max-width:none;display:block;object-fit:cover}" +
  ".tcc-back-overlay{position:absolute;right:0;bottom:0;left:0;display:flex;align-items:center;gap:8px;padding:12px 14px;color:var(--white,#fff);background:linear-gradient(transparent,rgba(20,62,30,0.92));font-family:Manrope,sans-serif;font-size:13px;font-weight:800}" +
  ".tcc-back-number{color:var(--orange,#FF8A45);font-size:18px;font-weight:800}" +
  ".tcc-title,.tcc-cap{position:absolute;left:50%;white-space:nowrap;pointer-events:none;opacity:0;" +
  "transform:translateX(-50%) scale(.7);transition:opacity .3s,transform .3s}" +
  ".tcc-title{bottom:calc(100% + 8px);font-size:14px;font-weight:800;font-family:Manrope,sans-serif;color:var(--dark-green,#245F30);line-height:16px}" +
  ".tcc-cap{top:calc(100% + 10px);font-size:12px;font-weight:700;letter-spacing:.04em;font-family:'DM Sans',sans-serif;color:var(--orange-text,#A5481F)}" +
  ".tcc-slide[data-active] .tcc-title,.tcc-slide[data-active] .tcc-cap{opacity:1;transform:translateX(-50%) scale(1)}" +
  ".tcc-controls{position:absolute;bottom:14px;left:50%;transform:translateX(-50%);display:flex;align-items:center;" +
  "gap:14px;padding:4px 10px;border-radius:999px;" +
  "background:rgba(255,252,248,0.95);border:1px solid var(--border,#DDE8DC);" +
  "-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);box-shadow:0 4px 14px rgba(36,95,48,0.1)}" +
  ".tcc-btn{display:grid;place-items:center;margin:0;padding:8px;border:0;border-radius:999px;background:none;" +
  "color:var(--dark-green,#245F30);cursor:pointer;transition:opacity .2s,transform .2s}" +
  ".tcc-btn:disabled{opacity:.3;cursor:default}" +
  ".tcc-btn:not(:disabled):active{transform:scale(.88)}" +
  ".tcc-btn:focus-visible,.tcc-dot:focus-visible{outline:2px solid var(--orange,#FF8A45);outline-offset:2px}" +
  ".tcc-dots{min-width:140px;display:flex;justify-content:center;align-items:center;gap:8px}" +
  ".tcc-dot{position:relative;width:8px;height:8px;margin:0;padding:0;border:0;border-radius:999px;" +
  "background:var(--dark-green,#245F30);opacity:.3;cursor:pointer;transition:width .3s,opacity .3s,background .3s}" +
  ".tcc-dot::after{content:\"\";position:absolute;inset:-10px -4px}" +
  ".tcc-dot[aria-current]{width:26px;opacity:1;background:var(--orange,#FF8A45)}" +
  ".tcc-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}" +
  "@media (prefers-reduced-motion:reduce){" +
  ".tcc-title,.tcc-cap,.tcc-dot,.tcc-btn,.tcc-flip-inner{transition:none}}"

function Chevron({ dir }: { dir: -1 | 1 }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ maxWidth: "none" }}>
      <path d={dir < 0 ? "m15 18-6-6 6-6" : "m9 18 6-6-6-6"} />
    </svg>
  )
}

const blank = (i: number) => {
  const h = (i * 47 + 120) % 360
  return "linear-gradient(145deg, hsl(" + h + " 32% 40%), hsl(" + ((h + 40) % 360) + " 28% 25%))"
}

export default function TiltCascadeCarousel({
  items,
  height = "390px",
  slideSize = "clamp(200px, 66vw, 250px)",
  angle = 16,
  drop = 0.32,
  inactiveScale = 0.72,
  radius = 16,
  bounce = 0.2,
  duration = 0.8,
  loop = true,
  autoplay = 3800,
  autoFlip = true,
  flipDelay = 1700,
  titles = true,
  captions = true,
  controls = false,
  color = "var(--dark-green, #245F30)",
  background = "transparent",
  fontFamily = 'Manrope, "DM Sans", sans-serif',
  fontHref = null,
  index,
  defaultIndex = 0,
  onIndexChange,
  onSelect,
  ariaLabel = "Festival moments cascade",
  className = "",
}: TiltCascadeCarouselProps) {
  const n = items.length
  const start = Math.min(Math.max(Math.round(index ?? defaultIndex), 0), Math.max(n - 1, 0))
  const [active, setActive] = React.useState(start)
  const [dragging, setDragging] = React.useState(false)
  const [stopped, setStopped] = React.useState(false)
  const [focused, setFocused] = React.useState(false)
  const [visible, setVisible] = React.useState(true)
  const [flippedMap, setFlippedMap] = React.useState<Record<number, boolean>>({})

  const rootRef = React.useRef(null as HTMLDivElement | null)
  const stageRef = React.useRef(null as HTMLDivElement | null)
  const slideRefs = React.useRef([] as (HTMLButtonElement | null)[])

  const E = React.useRef({
    a: start, va: 0, b: start, vb: 0, target: start,
    raf: 0, last: 0, size: 260, reduced: false,
    drag: null as null | { id: number; x0: number; pos0: number; moved: boolean; samples: { t: number; x: number }[] },
    clickBlock: false, wheel: 0, wheelAt: 0, stepAt: 0,
  }).current
  const cfg = React.useRef({ n, loop, angle, drop, inactiveScale, bounce, duration })
  cfg.current = { n, loop, angle, drop, inactiveScale, bounce, duration }
  const cb = React.useRef({ onIndexChange, active })
  cb.current = { onIndexChange, active }

  const transformFor = (i: number, a: number, b: number) => {
    const c = cfg.current
    const dx = offsetOf(i, a, c.n, c.loop)
    const d = offsetOf(i, b, c.n, c.loop)
    return {
      transform:
        "translate3d(calc(" + dx.toFixed(4) + " * var(--tcc-s)), " + (d * c.drop * 100).toFixed(3) + "%, 0) " +
        "scale(" + scaleAt(d, c.inactiveScale).toFixed(4) + ") rotate(" + (d * c.angle).toFixed(3) + "deg)",
      zIndex: 100 - Math.round(Math.abs(d) * 10),
      hidden: Math.abs(dx) > 6.5,
    }
  }

  const paint = () => {
    for (let i = 0; i < slideRefs.current.length; i++) {
      const el = slideRefs.current[i]
      if (!el) continue
      const t = transformFor(i, E.a, E.b)
      el.style.transform = t.transform
      el.style.zIndex = "" + t.zIndex
      el.style.visibility = t.hidden ? "hidden" : ""
    }
  }

  const frame = (now: number) => {
    const dt = Math.min((now - (E.last || now)) / 1000, 1 / 20)
    E.last = now
    const c = cfg.current
    const s = springOf(c.bounce, c.duration)
    if (E.reduced && !E.drag) {
      E.a = E.b = E.target
      E.va = E.vb = 0
    } else {
      if (!E.drag) [E.a, E.va] = springStep(E.a, E.va, E.target, s.omega, s.slide, dt)
      ;[E.b, E.vb] = springStep(E.b, E.vb, E.a, s.omega * 1.05, s.tilt, dt)
    }
    paint()
    const settled =
      !E.drag && Math.abs(E.a - E.target) < 1e-3 && Math.abs(E.va) < 1e-2 && Math.abs(E.b - E.a) < 1e-3 && Math.abs(E.vb) < 1e-2
    if (settled) {
      E.a = E.b = E.target
      E.va = E.vb = 0
      paint()
      E.raf = 0
      E.last = 0
      return
    }
    E.raf = requestAnimationFrame(frame)
  }

  const kick = () => {
    if (!E.raf) E.raf = requestAnimationFrame(frame)
  }

  const setTarget = (t: number) => {
    const c = cfg.current
    if (!c.n) return
    E.target = c.loop ? t : Math.min(Math.max(t, 0), c.n - 1)
    const i = indexAt(E.target, c.n, c.loop)
    if (i !== cb.current.active) {
      setActive(i)
      cb.current.onIndexChange?.(i)
    }
    kick()
  }

  const goTo = (i: number) => setTarget(targetFor(i, E.target, cfg.current.n, cfg.current.loop))
  const step = (by: number) => setTarget(Math.round(E.target) + by)

  // Auto-flip effect for the active card
  React.useEffect(() => {
    if (!autoFlip || !visible) return
    // Start active card on Front (story)
    setFlippedMap((prev) => ({ ...prev, [active]: false }))

    // After flipDelay, auto-flip to Back (photo)
    const timer = window.setTimeout(() => {
      setFlippedMap((prev) => ({ ...prev, [active]: true }))
    }, flipDelay)

    return () => window.clearTimeout(timer)
  }, [active, autoFlip, flipDelay, visible])

  React.useEffect(() => {
    if (index == null || !n) return
    if (wrapIndex(Math.round(E.target), n) !== wrapIndex(index, n)) goTo(wrapIndex(index, n))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, n])

  React.useEffect(() => {
    if (n && !loop && E.target > n - 1) setTarget(n - 1)
    paint()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [n, loop, angle, drop, inactiveScale])

  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    const on = () => {
      E.reduced = mq.matches
    }
    on()
    mq.addEventListener("change", on)
    return () => mq.removeEventListener("change", on)
  }, [E])

  React.useEffect(() => {
    const el = stageRef.current
    if (!el) return
    const measure = () => {
      E.size = el.offsetWidth || 250
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [E])

  React.useEffect(() => () => cancelAnimationFrame(E.raf), [E])

  React.useEffect(() => {
    const el = rootRef.current
    if (!el || !autoplay) return
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting && !document.hidden))
    io.observe(el)
    const onVis = () => setVisible(!document.hidden)
    document.addEventListener("visibilitychange", onVis)
    return () => {
      io.disconnect()
      document.removeEventListener("visibilitychange", onVis)
    }
  }, [autoplay])

  const playing = autoplay > 0 && n > 1 && !stopped && !focused && !dragging && visible
  React.useEffect(() => {
    if (!playing || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const t = window.setTimeout(() => {
      const c = cfg.current
      if (!c.loop && Math.round(E.target) >= c.n - 1) goTo(0)
      else step(1)
    }, autoplay)
    return () => window.clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, active, autoplay])

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0 || !n) return
    if ((e.target as Element).closest("[data-tcc-controls]")) return
    E.drag = { id: e.pointerId, x0: e.clientX, pos0: E.a, moved: false, samples: [{ t: e.timeStamp, x: e.clientX }] }
  }
  const onPointerMove = (e: React.PointerEvent) => {
    const d = E.drag
    if (!d || d.id !== e.pointerId) return
    const dx = e.clientX - d.x0
    if (!d.moved) {
      if (Math.abs(dx) < 6) return
      d.moved = true
      d.x0 = e.clientX
      d.pos0 = E.a
      E.va = 0
      rootRef.current?.setPointerCapture(e.pointerId)
      setDragging(true)
      setStopped(true)
    }
    const c = cfg.current
    const raw = d.pos0 - (e.clientX - d.x0) / E.size
    E.a = c.loop ? raw : rubber(raw, c.n)
    d.samples.push({ t: e.timeStamp, x: e.clientX })
    if (d.samples.length > 6) d.samples.shift()
    const i = indexAt(E.a, c.n, c.loop)
    if (i !== cb.current.active) {
      setActive(i)
      cb.current.onIndexChange?.(i)
    }
    kick()
  }
  const onPointerUp = (e: React.PointerEvent) => {
    const d = E.drag
    if (!d || d.id !== e.pointerId) return
    E.drag = null
    if (!d.moved) return
    setDragging(false)
    E.clickBlock = true
    window.setTimeout(() => {
      E.clickBlock = false
    }, 0)
    const first = d.samples[0]
    const last = d.samples[d.samples.length - 1]
    const ms = Math.max(last.t - first.t, 1)
    const v = e.type === "pointercancel" ? 0 : (-(last.x - first.x) / ms / E.size) * 1000
    E.va = v
    setTarget(releaseTarget(E.a, v, cfg.current.n, cfg.current.loop))
  }

  const onSlideClick = (i: number) => {
    if (E.clickBlock) return
    setStopped(true)
    if (i === active) {
      // Toggle card flip manually on tap!
      setFlippedMap((prev) => ({ ...prev, [i]: !prev[i] }))
      onSelect?.(items[i], i)
    } else {
      goTo(i)
    }
  }

  const atStart = !loop && active <= 0
  const atEnd = !loop && active >= n - 1
  const current = items[active]

  return (
    <div
      ref={rootRef}
      className={"tcc-root " + className}
      style={{ height, background, color, fontFamily }}
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      tabIndex={0}
      data-dragging={dragging ? "" : undefined}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onFocus={() => setFocused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocused(false)
      }}
    >
      <style>{CSS}</style>

      <div
        ref={stageRef}
        className="tcc-stage"
        style={{ width: slideSize, ["--tcc-s" as string]: slideSize, ["--tcc-r" as string]: radius + "px" } as React.CSSProperties}
      >
        {items.map((item, i) => {
          const t = transformFor(i, E.a, E.b)
          const isActive = i === active
          const isFlipped = Boolean(flippedMap[i])
          return (
            <button
              key={i}
              ref={(el) => {
                slideRefs.current[i] = el
              }}
              type="button"
              className="tcc-slide"
              data-active={isActive ? "" : undefined}
              tabIndex={isActive ? 0 : -1}
              aria-roledescription="slide"
              aria-label={i + 1 + " of " + n + ": " + item.title}
              aria-current={isActive ? "true" : undefined}
              onClick={() => onSlideClick(i)}
              style={{ transform: t.transform, zIndex: t.zIndex, visibility: t.hidden ? "hidden" : undefined }}
            >
              <span className="tcc-frame">
                <span className={"tcc-flip-inner" + (isFlipped ? " is-flipped" : "")}>
                  {/* FRONT: The Story */}
                  <span className="tcc-face tcc-front">
                    <span className="tcc-story-number">{item.number || "0" + (i + 1)}</span>
                    <span className="tcc-story-date">{item.date || item.caption}</span>
                    <span className="tcc-story-title">{item.title}</span>
                    {item.detail && <span className="tcc-story-detail">{item.detail}</span>}
                    <span className="tcc-flip-hint">Tap to flip ↺</span>
                  </span>

                  {/* BACK: The Photograph */}
                  <span className="tcc-face tcc-back">
                    {item.src ? (
                      <img
                        src={item.src}
                        alt={item.alt ?? item.title}
                        draggable={false}
                        loading={Math.abs(i - start) > 3 ? "lazy" : undefined}
                        decoding="async"
                        width={600}
                        height={600}
                        style={{ maxWidth: "none" }}
                      />
                    ) : (
                      <span role="img" aria-label={item.alt ?? item.title} style={{ position: "absolute", inset: 0, background: blank(i) }} />
                    )}
                    <span className="tcc-back-overlay">
                      <span className="tcc-back-number">{item.number || "0" + (i + 1)}</span>
                      <span>{item.title}</span>
                    </span>
                  </span>
                </span>
              </span>

              {titles ? (
                <span className="tcc-title" aria-hidden="true">
                  {item.title}
                </span>
              ) : null}
              {captions && item.caption ? (
                <span className="tcc-cap" aria-hidden="true">
                  {item.caption}
                </span>
              ) : null}
            </button>
          )
        })}
      </div>

      {controls && n > 1 ? (
        <div className="tcc-controls" data-tcc-controls="">
          <button type="button" className="tcc-btn" aria-label="Previous slide" disabled={atStart} onClick={() => { setStopped(true); step(-1) }}>
            <Chevron dir={-1} />
          </button>
          <div className="tcc-dots">
            {items.map((item, i) => (
              <button
                key={i}
                type="button"
                className="tcc-dot"
                aria-label={"Go to slide " + (i + 1) + ": " + item.title}
                aria-current={i === active ? "true" : undefined}
                onClick={() => {
                  setStopped(true)
                  goTo(i)
                }}
              />
            ))}
          </div>
          <button type="button" className="tcc-btn" aria-label="Next slide" disabled={atEnd} onClick={() => { setStopped(true); step(1) }}>
            <Chevron dir={1} />
          </button>
        </div>
      ) : null}

      <div className="tcc-sr" aria-live="polite" aria-atomic="true">
        {current ? "Slide " + (active + 1) + " of " + n + ": " + current.title : ""}
      </div>
    </div>
  )
}

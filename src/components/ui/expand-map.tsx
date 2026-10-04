"use client"

import { useState } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"

interface LocationMapProps {
  location?: string
  coordinates?: string
  className?: string
}

const ROADS = [
  { x1: "0%", y1: "35%", x2: "100%", y2: "35%", width: 4, tone: "stroke-foreground/20" },
  { x1: "0%", y1: "65%", x2: "100%", y2: "65%", width: 4, tone: "stroke-foreground/20" },
  { x1: "30%", y1: "0%", x2: "30%", y2: "100%", width: 3, tone: "stroke-foreground/15" },
  { x1: "70%", y1: "0%", x2: "70%", y2: "100%", width: 3, tone: "stroke-foreground/15" },
  ...[20, 50, 80].map(y => ({ x1: "0%", y1: `${y}%`, x2: "100%", y2: `${y}%`, width: 1.5, tone: "stroke-foreground/[0.07]" })),
  ...[15, 45, 55, 85].map(x => ({ x1: `${x}%`, y1: "0%", x2: `${x}%`, y2: "100%", width: 1.5, tone: "stroke-foreground/[0.07]" })),
]

const BUILDINGS = [
  "top-[40%] left-[10%] w-[15%] h-[20%]",
  "top-[12%] left-[36%] w-[12%] h-[17%]",
  "top-[72%] left-[74%] w-[18%] h-[16%]",
  "top-[14%] right-[6%] w-[10%] h-[16%]",
  "top-[72%] left-[4%] w-[9%] h-[18%]",
  "top-[44%] left-[57%] w-[10%] h-[14%]",
]

export function LocationMap({
  location = "San Francisco, CA",
  coordinates = "37.7749° N, 122.4194° W",
  className = "",
}: LocationMapProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const reduceMotion = useReducedMotion()
  const spring = reduceMotion ? { duration: 0 } : { type: "spring" as const, stiffness: 380, damping: 38 }
  const delay = (seconds: number) => (reduceMotion ? 0 : seconds)

  return (
    <button
      type="button"
      className={`location-card group block w-full overflow-hidden rounded-[18px] bg-muted text-left transition-colors duration-200 hover:bg-[color-mix(in_srgb,var(--color-foreground)_4%,var(--color-muted))] ${className}`}
      aria-expanded={isExpanded}
      onClick={() => setIsExpanded(expanded => !expanded)}
    >
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            className="relative overflow-hidden"
            initial={{ height: 0 }}
            animate={{ height: 200 }}
            exit={{ height: 0 }}
            transition={spring}
            aria-hidden="true"
          >
            <div className="absolute inset-0 border-b border-border bg-foreground/[0.03]">
              <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
                {ROADS.map((road, i) => (
                  <motion.line
                    key={i}
                    {...road}
                    className={road.tone}
                    strokeWidth={road.width}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: reduceMotion ? 0 : 0.6, delay: delay(0.1 + i * 0.04) }}
                  />
                ))}
              </svg>

              {BUILDINGS.map((position, i) => (
                <motion.div
                  key={position}
                  className={`absolute rounded-[4px] bg-foreground/[0.06] ${position}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: reduceMotion ? 0 : 0.35, delay: delay(0.3 + i * 0.05) }}
                />
              ))}

              <motion.div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full"
                initial={{ scale: 0, y: -12 }}
                animate={{ scale: 1, y: 0 }}
                transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 400, damping: 20, delay: 0.3 }}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="drop-shadow-md">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" className="fill-[var(--location-pin)]" />
                  <circle cx="12" cy="9" r="2.5" className="fill-muted" />
                </svg>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-4 p-5 sm:px-6">
        <span className="grid size-10 flex-none place-items-center rounded-[10px] bg-background text-foreground shadow-[inset_0_0_0_1px_var(--color-border)]">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
            <line x1="9" x2="9" y1="3" y2="18" />
            <line x1="15" x2="15" y1="6" y2="21" />
          </svg>
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[15px] font-semibold leading-snug tracking-[-0.01em] text-foreground">{location}</span>
          <span className="block text-[13px] leading-snug text-muted-foreground tabular-nums">{coordinates}</span>
        </span>
        <span className="flex-none text-[13px] text-muted-foreground transition-colors group-hover:text-foreground">
          {isExpanded ? "Hide map" : "Show map"}
        </span>
      </div>
    </button>
  )
}

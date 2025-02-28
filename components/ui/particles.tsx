"use client"

import { useEffect, useRef } from "react"
import { motion, useAnimation, useMotionValue } from "framer-motion"

interface ParticlesProps {
  className?: string
  quantity?: number
  staticity?: number
  ease?: number
  refresh?: boolean
}

export const Particles = ({
  className = "",
  quantity = 30,
  staticity = 50,
  ease = 50,
  refresh = false,
}: ParticlesProps) => {
  const canvasRef = useRef<HTMLDivElement>(null)
  const canvasAnimation = useAnimation()
  const mousePosition = { x: useMotionValue(0), y: useMotionValue(0) }

  const particles = Array.from({ length: quantity }, () => ({
    x: Math.random() * 100 + "%",
    y: Math.random() * 100 + "%",
    size: Math.random() * 2 + 2,
  }))

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const canvas = canvasRef.current
      if (!canvas) return

      const rect = canvas.getBoundingClientRect()
      const { clientX, clientY } = e
      const x = clientX - rect.left
      const y = clientY - rect.top

      mousePosition.x.set(x)
      mousePosition.y.set(y)

      canvasAnimation.start({
        x: [null, x],
        y: [null, y],
        transition: { duration: ease / 1000 },
      })
    }

    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [canvasAnimation, ease, mousePosition.x, mousePosition.y])

  return (
    <div
      ref={canvasRef}
      className={`absolute inset-0 overflow-hidden ${className}`}
    >
      {particles.map((particle, index) => (
        <motion.div
          key={index}
          className="absolute rounded-full bg-primary/30"
          style={{
            width: particle.size,
            height: particle.size,
            left: particle.x,
            top: particle.y,
          }}
          animate={canvasAnimation}
          transition={{
            duration: staticity / 1000,
            ease: "linear",
          }}
        />
      ))}
    </div>
  )
} 
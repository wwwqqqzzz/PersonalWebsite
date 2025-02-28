import { useState, useEffect } from "react"
import Image from "next/image"
import { motion, useMotionValue, useTransform, animate } from "framer-motion"

interface LivePreviewProps {
  src: string
  className?: string
  onLoadingComplete?: () => void
  priority?: boolean
}

export function LivePreview({ src, className }: LivePreviewProps) {
  const [isZoomed, setIsZoomed] = useState(false)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const rotateX = useTransform(mouseY, [-300, 300], [10, -10])
  const rotateY = useTransform(mouseX, [-300, 300], [-10, 10])
  const glowOpacity = useMotionValue(0)

  // 屏幕闪烁效果
  useEffect(() => {
    const interval = setInterval(() => {
      animate(glowOpacity, 0.15, {
        duration: 0.2,
        ease: "easeOut",
      }).then(() => {
        animate(glowOpacity, 0, {
          duration: 0.3,
          ease: "easeIn",
        })
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isZoomed) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    mouseX.set(x)
    mouseY.set(y)
  }

  const handleMouseLeave = () => {
    if (!isZoomed) {
      mouseX.set(0)
      mouseY.set(0)
    }
  }

  return (
    <>
      <motion.div
        className={`relative w-full h-full ${className}`}
        style={{
          perspective: 1000,
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <motion.div
          className="relative w-full h-full cursor-zoom-in"
          style={{
            rotateX: isZoomed ? 0 : rotateX,
            rotateY: isZoomed ? 0 : rotateY,
            transformStyle: "preserve-3d",
          }}
          onClick={() => setIsZoomed(!isZoomed)}
        >
          {/* 屏幕闪烁效果 */}
          <motion.div
            className="absolute inset-0 bg-primary/20 mix-blend-overlay pointer-events-none"
            style={{ opacity: glowOpacity }}
          />

          {/* 背景动画 */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent"
            animate={{
              opacity: [0.3, 0.5, 0.3],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          <Image
            src={src}
            alt="项目预览"
            fill
            className="object-cover"
          />

          {/* 悬停效果 */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </motion.div>
      </motion.div>

      {/* 全屏预览 */}
      {isZoomed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-xl cursor-zoom-out"
          onClick={() => setIsZoomed(false)}
        >
          <motion.div 
            className="relative w-[90vw] h-[90vh]"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
          >
            <Image
              src={src}
              alt="项目预览"
              fill
              className="object-contain"
            />
          </motion.div>
        </motion.div>
      )}
    </>
  )
} 
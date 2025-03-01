"use client"

import { useRef, useEffect, useState, forwardRef } from "react"
import { motion, useScroll, useTransform, useAnimation, useMotionValue, useVelocity, useSpring } from "framer-motion"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { Calendar, Clock, ChevronRight, ArrowRight } from "lucide-react"
import { Particles } from "@/components/ui/particles"

const blogPosts = [
  {
    id: 1,
    title: "设计系统如何提高团队效率",
    excerpt: "探讨设计系统如何帮助团队提高工作效率，保持设计一致性，并加速产品开发流程。",
    date: "2023-10-15",
    readTime: "5 分钟",
    image: "/placeholder.svg?height=400&width=600",
    tags: ["设计系统", "团队协作", "效率"],
    category: "设计",
    link: "/blog/design-system-efficiency"
  },
  {
    id: 2,
    title: "用户体验设计的未来趋势",
    excerpt: "分析当前UX设计领域的创新趋势，探讨AI、VR等新技术对用户体验的影响。",
    date: "2023-09-28",
    readTime: "7 分钟",
    image: "/placeholder.svg?height=400&width=600",
    tags: ["UX设计", "AI", "VR"],
    category: "技术",
    link: "/blog/ux-design-trends"
  },
  {
    id: 3,
    title: "如何进行有效的用户研究",
    excerpt: "分享进行用户研究的实用技巧和方法，帮助设计师更好地理解用户需求。",
    date: "2023-09-10",
    readTime: "6 分钟",
    image: "/placeholder.svg?height=400&width=600",
    tags: ["用户研究", "设计方法论"],
    category: "研究",
    link: "/blog/effective-user-research"
  },
  {
    id: 4,
    title: "移动应用设计的最佳实践",
    excerpt: "总结移动应用设计的关键原则和最佳实践，帮助设计师创造出色的移动体验。",
    date: "2023-08-22",
    readTime: "8 分钟",
    image: "/placeholder.svg?height=400&width=600",
    tags: ["移动设计", "用户体验", "设计原则"],
    category: "设计",
    link: "/blog/mobile-app-design-best-practices"
  },
]

interface BlogSectionProps {
  className?: string
}

const BlogSection = forwardRef<HTMLDivElement, BlogSectionProps>((props, ref) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isPressed, setIsPressed] = useState(false)
  const [containerWidth, setContainerWidth] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const pressTimerRef = useRef<NodeJS.Timeout | null>(null)
  const [isPressActivated, setIsPressActivated] = useState(false)

  // 基础滚动速度和加速倍数
  const baseScrollSpeed = -1.5
  const pressMultiplier = 6

  // 使用 useSpring 创建平滑的滚动效果
  const x = useMotionValue(0)
  const springConfig = {
    stiffness: 60,    // 降低刚度以使过渡更平滑
    damping: 20,      // 增加阻尼以减少振荡
    mass: 0.8,        // 增加质量以使动画更稳定
    restDelta: 0.001  // 保持精确的静止阈值
  }
  
  const smoothX = useSpring(x, springConfig)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.95, 1, 1, 0.95])

  // 计算容器宽度
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.scrollWidth / 2)
      }
    }
    updateWidth()
    window.addEventListener("resize", updateWidth)
    return () => window.removeEventListener("resize", updateWidth)
  }, [])

  // 自动滚动
  useEffect(() => {
    let animationFrameId: number | undefined
    let lastTimestamp: number | null = null
    
    const autoScroll = (timestamp: number) => {
      if (!lastTimestamp) {
        lastTimestamp = timestamp
      }
      const deltaTime = timestamp - lastTimestamp
      lastTimestamp = timestamp

      if (!containerRef.current) return
      
      const speed = isPressActivated ? baseScrollSpeed * pressMultiplier : baseScrollSpeed
      let newX = x.get() + speed * (deltaTime / 16.67)  // 基于时间的平滑滚动
      
      // 实现平滑循环
      if (newX <= -containerWidth) {
        if (!isTransitioning) {
          setIsTransitioning(true)
          x.set(0)
          setTimeout(() => setIsTransitioning(false), 50)
        }
      } else if (newX > 0) {
        if (!isTransitioning) {
          setIsTransitioning(true)
          x.set(-containerWidth)
          setTimeout(() => setIsTransitioning(false), 50)
        }
      } else {
        x.set(newX)
      }
      
      animationFrameId = requestAnimationFrame(autoScroll)
    }

    animationFrameId = requestAnimationFrame(autoScroll)

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [isPressActivated, containerWidth, baseScrollSpeed, pressMultiplier, isTransitioning])

  // 鼠标事件处理
  const handleMouseDown = () => {
    setIsPressed(true)
    // 设置长按计时器
    pressTimerRef.current = setTimeout(() => {
      setIsPressActivated(true)
    }, 500) // 2.5秒后激活
  }

  const handleMouseUp = () => {
    setIsPressed(false)
    setIsPressActivated(false)
    // 清除长按计时器
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current)
      pressTimerRef.current = null
    }
  }
  
  // 触摸事件处理
  const handleTouchStart = () => {
    setIsPressed(true)
    // 设置长按计时器
    pressTimerRef.current = setTimeout(() => {
      setIsPressActivated(true)
    }, 2500) // 2.5秒后激活
  }

  const handleTouchEnd = () => {
    setIsPressed(false)
    setIsPressActivated(false)
    // 清除长按计时器
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current)
      pressTimerRef.current = null
    }
  }

  return (
    <motion.div
      ref={ref}
      id="blog"
      className="min-h-screen relative overflow-hidden py-20 md:py-32"
      style={{ opacity, scale }}
    >
      {/* 背景动画效果 */}
      <div className="absolute inset-0">
        <Particles
          className="absolute inset-0 opacity-30"
          quantity={40}
          staticity={30}
        />
        {/* 优化的动态光束效果 */}
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 0.3, 0],
            rotate: [0, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute inset-0"
              style={{
                background: `conic-gradient(from ${120 * i}deg at 50% 50%, var(--primary) 0deg, transparent 45deg)`,
                filter: "blur(80px)",
              }}
              animate={{
                rotate: [0, 360],
                scale: [0.95, 1.05, 0.95],
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: "linear",
                delay: i * 1.2,
              }}
            />
          ))}
        </motion.div>
      </div>

      <div className="relative container mx-auto px-4">
        {/* 标题区域 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-12"
        >
          <motion.h2 
            className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-400 to-pink-500"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              filter: ["brightness(1)", "brightness(1.3)", "brightness(1)"],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              backgroundSize: "200% auto",
            }}
          >
            博客文章
          </motion.h2>
          <motion.p 
            className="mt-4 text-lg text-muted-foreground"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            分享我的设计思考与技术见解
          </motion.p>
        </motion.div>

        {/* 优化的3D陈列馆容器 */}
        <div 
          ref={containerRef}
          className="relative h-[80vh] perspective-[3000px] overflow-hidden"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* 3D滚动容器 */}
          <motion.div
            className="flex h-full items-center gap-12 will-change-transform"
            style={{
              x: smoothX,
              width: `${containerWidth * 2}px`,
            }}
          >
            {[...blogPosts, ...blogPosts].map((post, index) => (
              <motion.article
                key={`${post.id}-${index}`}
                className="relative h-[55vh] w-[35vw] flex-shrink-0 rounded-3xl border border-white/10 bg-background/80 backdrop-blur-xl shadow-2xl transform-style-3d"
                style={{
                  rotateY: useTransform(smoothX, (val) => {
                    const position = (val + index * 40 * -1) % (containerWidth * 2)
                    return position * 0.01
                  }),
                  translateZ: useTransform(smoothX, (val) => {
                    const position = (val + index * 40 * -1) % (containerWidth * 2)
                    return Math.sin((position / containerWidth) * Math.PI) * 50
                  })
                }}
                whileHover={{
                  scale: 1.02,
                  transition: { 
                    duration: 0.2,
                    ease: "easeOut"
                  }
                }}
              >
                {/* 动态光效层 */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary/20 via-purple-500/15 to-pink-500/10 opacity-0 rounded-3xl"
                  animate={{
                    opacity: [0, 0.2, 0],
                    backgroundPosition: ["0% 50%", "100% 50%"]
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />

                {/* 文章封面 */}
                <div className="relative h-1/2 overflow-hidden rounded-t-3xl">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transform transition-transform duration-700 hover:scale-105"
                    priority={index < 1}
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />
                </div>

                {/* 内容区域 */}
                <div className="p-6 flex flex-col h-1/2 justify-between">
                  <div>
                    <div className="mb-4 flex items-center gap-2">
                      <motion.span 
                        className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                        whileHover={{
                          backgroundColor: "var(--primary)",
                          color: "var(--primary-foreground)",
                          transition: { duration: 0.2 }
                        }}
                      >
                        {post.category}
                      </motion.span>
                      <span className="text-sm text-muted-foreground">
                        {post.date}
                      </span>
                    </div>
                    
                    <h3 className="mb-2 text-xl font-bold line-clamp-2 hover:text-primary transition-colors duration-300">
                      {post.title}
                    </h3>
                    <p className="line-clamp-2 text-muted-foreground">
                      {post.excerpt}
                    </p>
                  </div>
                  
                  <div className="mt-4 space-y-4">
                    <div className="flex gap-2 flex-wrap">
                      {post.tags.map((tag) => (
                        <motion.span
                          key={tag}
                          className="rounded-full bg-primary/10 px-2 py-1 text-xs text-primary"
                          whileHover={{
                            scale: 1.05,
                            backgroundColor: "var(--primary)",
                            color: "var(--primary-foreground)",
                          }}
                        >
                          #{tag}
                        </motion.span>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <motion.a
                        href={post.link}
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors duration-300 group"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        阅读全文
                        <ArrowRight className="h-4 w-4 transform transition-transform group-hover:translate-x-1" />
                      </motion.a>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {post.readTime}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>

          {/* 优化的景深效果 */}
          <motion.div
            className="pointer-events-none absolute inset-0"
            style={{
              background: "radial-gradient(circle at center, transparent 20%, var(--background) 70%)",
              opacity: useTransform(smoothX, (val) => 
                Math.min(Math.abs(val % containerWidth) / containerWidth * 0.8, 0.8)
              )
            }}
          />

          {/* 交互提示 */}
          <motion.div
            className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-primary/70 pointer-events-none"
            animate={{
              y: [0, -3, 0]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {isPressActivated ? "加速浏览中..." : isPressed ? "长按中..." : "长按加速浏览"}
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
})

BlogSection.displayName = "BlogSection"

export default BlogSection


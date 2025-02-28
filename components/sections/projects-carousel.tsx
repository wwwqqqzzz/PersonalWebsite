"use client"

import { useState, useRef, useEffect, forwardRef } from "react"
import Image from "next/image"
import { motion, AnimatePresence, useMotionValue, useTransform, useMotionTemplate, animate } from "framer-motion"
import { ChevronLeft, ChevronRight, ExternalLink, Github, Code2, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { TechRadar } from "@/components/ui/tech-radar"
import { LivePreview } from "@/components/ui/live-preview"
import { useHotkeys } from 'react-hotkeys-hook'
import { useIntersectionObserver } from '@uidotdev/usehooks'
import { Progress } from "@/components/ui/progress"

interface Project {
  id: number
  title: string
  description: string
  image: string
  techStack: { name: string; level: number }[]
  metrics?: { label: string; value: string }[]
  githubLink?: string
  demoLink?: string
}

const projects: Project[] = [
  {
    id: 1,
    title: "智能分布式系统监控平台",
    description: "基于Rust构建的高性能监控系统，单节点处理能力达50万QPS，支持实时异常检测与自动化扩缩容",
    image: "/projects/ac90c837-00be-4acd-8117-e415995dd829.png",
    techStack: [
      { name: "Rust", level: 0.95 },
      { name: "Kafka", level: 0.9 },
      { name: "React", level: 0.85 }
    ],
    metrics: [
      { label: "日处理量", value: "2.1B+" },
      { label: "P99延迟", value: "18ms" },
      { label: "可用性", value: "99.995%" }
    ],
    demoLink: "#",
    githubLink: "#"
  },
  {
    id: 2,
    title: "低代码平台引擎",
    description: "企业级低代码开发平台，支持拖拽式开发、自定义组件、工作流引擎，已服务超过50家企业客户",
    image: "/projects/ac90c837-00be-4acd-8117-e415995dd829.png",
    techStack: [
      { name: "Vue3", level: 0.95 },
      { name: "TypeScript", level: 0.9 },
      { name: "Node.js", level: 0.85 }
    ],
    metrics: [
      { label: "研发效率", value: "提升300%" },
      { label: "组件复用", value: "85%" },
      { label: "客户满意度", value: "96%" }
    ],
    demoLink: "#",
    githubLink: "#"
  },
  {
    id: 3,
    title: "AI驱动的设计系统",
    description: "基于机器学习的智能设计系统，能够自动生成符合品牌调性的设计方案，支持多场景智能适配",
    image: "/projects/ac90c837-00be-4acd-8117-e415995dd829.png",
    techStack: [
      { name: "Python", level: 0.9 },
      { name: "TensorFlow", level: 0.85 },
      { name: "Next.js", level: 0.8 }
    ],
    metrics: [
      { label: "设计效率", value: "提升500%" },
      { label: "方案准确率", value: "93%" },
      { label: "每月生成量", value: "10K+" }
    ],
    demoLink: "#",
    githubLink: "#"
  },
  {
    id: 4,
    title: "实时数据可视化平台",
    description: "大规模数据实时可视化解决方案，支持亿级数据秒级渲染，多维度数据分析与实时监控",
    image: "/projects/ac90c837-00be-4acd-8117-e415995dd829.png",
    techStack: [
      { name: "WebGL", level: 0.9 },
      { name: "Three.js", level: 0.85 },
      { name: "WebSocket", level: 0.8 }
    ],
    metrics: [
      { label: "渲染性能", value: "60FPS" },
      { label: "数据吞吐量", value: "1M/s" },
      { label: "内存占用", value: "<100MB" }
    ],
    demoLink: "#",
    githubLink: "#"
  }
]

// 效果常量
const PERSPECTIVE_STRENGTH = 600
const ROTATION_RANGE = 10
const BLUR_INTENSITY = 80
const SWIPE_THRESHOLD = 8000
const AUTO_PLAY_DURATION = 12

interface ProjectsSectionProps {
  className?: string
}

const ProjectsSection = forwardRef<HTMLDivElement, ProjectsSectionProps>((props, ref) => {
  const [[currentIndex, direction], setState] = useState([0, 0])
  const [isInView, setInView] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [progress, setProgress] = useState(0)
  
  const carouselRef = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const rotateY = useTransform(x, [-200, 200], [-ROTATION_RANGE, ROTATION_RANGE])
  const opacity = useTransform(x, [-200, 0, 200], [0.5, 1, 0.5])
  const shadowX = useTransform(x, [-200, 200], [10, -10])
  const shadowOpacity = useTransform(x, (val) => 0.15 - Math.abs(val)/1500)

  // 使用单独的transform函数来处理3D效果
  const transform = useMotionTemplate`perspective(${PERSPECTIVE_STRENGTH}px) rotateY(${rotateY}deg) translateX(${useTransform(x, (val) => val/10)}px)`

  const paginate = (newDirection: number) => {
    setState([(currentIndex + newDirection + projects.length) % projects.length, newDirection])
    setProgress(0)
  }

  // 键盘导航
  useHotkeys('left', () => paginate(-1), [currentIndex])
  useHotkeys('right', () => paginate(1), [currentIndex])
  useHotkeys('space', () => setIsHovering(prev => !prev), [])

  // 视口检测
  const [intersectionRef, entry] = useIntersectionObserver({
    threshold: 0.5,
  })

  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setInView(entry?.isIntersecting || false)
  }, [entry])

  // 自动轮播逻辑
  useEffect(() => {
    if (!isInView || isDragging || isHovering) return
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          paginate(1)
          return 0
        }
        return prev + (100 / (AUTO_PLAY_DURATION * 10))
      })
    }, 100)
    return () => clearInterval(interval)
  }, [isInView, isDragging, isHovering])

  // 手势控制
  const handleDragStart = () => {
    setIsDragging(true)
    setProgress(0)
  }

  interface DragInfo {
    offset: { x: number }
    velocity: { x: number }
  }

  const handleDragEnd = (e: MouseEvent | TouchEvent | PointerEvent, { offset, velocity }: DragInfo) => {
    setIsDragging(false)
    const swipe = Math.abs(offset.x) * velocity.x

    if (Math.abs(swipe) > SWIPE_THRESHOLD) {
      const direction = swipe < 0 ? 1 : -1
      paginate(direction)
    } else {
      // 回到原位，添加弹性动画
      animate(x, 0, {
        type: "spring",
        stiffness: 400,
        damping: 30
      })
    }
  }

  const currentProject = projects[currentIndex]

  const getMetricDescription = (label: string) => {
    // Implement your logic to return a description based on the metric label
    switch (label) {
      case "日处理量":
        return "The total number of processed items per day";
      case "P99延迟":
        return "The 99th percentile latency of the system";
      case "可用性":
        return "The percentage of time the system is available";
      case "研发效率":
        return "The percentage increase in development efficiency";
      case "组件复用":
        return "The percentage of components reused across projects";
      case "客户满意度":
        return "The satisfaction level of customers";
      case "设计效率":
        return "The percentage increase in design efficiency";
      case "方案准确率":
        return "The percentage of accurate design solutions";
      case "每月生成量":
        return "The number of design solutions generated per month";
      case "渲染性能":
        return "The frames per second (FPS) of the rendering process";
      case "数据吞吐量":
        return "The amount of data processed per second";
      case "内存占用":
        return "The amount of memory used by the system";
      default:
        return "No description available";
    }
  }

  return (
    <div 
      ref={ref}
      id="projects"
      className={`relative w-full max-w-7xl mx-auto px-4 py-24 ${props.className || ''}`} 
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      role="region"
      aria-label="项目展示轮播"
    >
      <div className="text-center mb-16 space-y-2">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent"
        >
          工程案例研究
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-foreground/60"
        >
          生产级系统架构与性能优化实践
        </motion.p>
      </div>

      <motion.div
        ref={containerRef}
        className="relative h-[720px] rounded-3xl border border-foreground/10 bg-gradient-to-br from-background/80 to-background/20 backdrop-blur-xl shadow-2xl overflow-hidden"
        style={{ 
          transform: transform,
          boxShadow: useMotionTemplate`${shadowX}px 20px 40px rgba(0,0,0,${shadowOpacity})`
        }}
        drag="x"
        dragListener={true}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.1}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onPanStart={() => setIsDragging(true)}
        onPanEnd={() => setIsDragging(false)}
      >
        {/* 3D视差层 */}
        <motion.div 
          className="absolute inset-0 -z-10"
          style={{
            scale: 1.1,
            rotateY: useTransform(x, [-200, 200], [5, -5]),
            filter: useTransform(x, (val) => `blur(${Math.abs(val)/BLUR_INTENSITY}px)`)
          }}
        >
          <div className="absolute inset-0 bg-gradient-radial from-primary/5 to-transparent" />
        </motion.div>

        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            initial={{ x: direction > 0 ? "100%" : "-100%", opacity: 0.5 }}
            animate={{ x: "0%", opacity: 1 }}
            exit={{ x: direction > 0 ? "-100%" : "100%", opacity: 0.5 }}
            transition={{ 
              type: "spring", 
              mass: 0.8,
              stiffness: 150,
              damping: 20
            }}
            className="absolute inset-0 grid grid-cols-1 lg:grid-cols-2 md:gap-4"
          >
            {/* 3D预览区域 */}
            <div className="relative group h-[300px] md:h-full">
              <LivePreview
                src={currentProject.image}
                className="absolute inset-0 bg-foreground/5"
                priority={true}
              />
            </div>

            {/* 内容区域 */}
            <div className="p-6 md:p-12 flex flex-col justify-center space-y-6 md:space-y-8 bg-gradient-to-b from-background/80 via-background/50 to-background/30 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4 md:space-y-6"
              >
                <div className="flex items-center gap-4">
                  <Zap className="w-6 h-6 md:w-8 md:h-8 text-primary" strokeWidth={1.5} />
                  <h3 className="text-2xl md:text-3xl font-bold">{currentProject.title}</h3>
                </div>

                <p className="text-sm md:text-base text-foreground/80 leading-relaxed md:leading-loose">
                  {currentProject.description}
                </p>

                {/* 性能指标 */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
                  {currentProject.metrics?.map((metric, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.05 }}
                      className="group relative p-4 rounded-xl bg-background/50 border border-foreground/10 hover:bg-background/70 hover:border-primary/20 transition-colors duration-300"
                    >
                      <div className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
                        {metric.value}
                      </div>
                      <div className="text-sm text-foreground/60">
                        {metric.label}
                      </div>
                      {/* Tooltip */}
                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-2 bg-background/90 backdrop-blur-sm rounded-lg border border-primary/20 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
                        {getMetricDescription(metric.label)}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* 技术栈标签 */}
                <div className="flex flex-wrap gap-2">
                  {currentProject.techStack.map((tech, i) => (
                    <div
                      key={i}
                      className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm flex items-center gap-2"
                    >
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      {tech.name}
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* 操作按钮 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-4"
              >
                {currentProject.githubLink && (
                  <Link href={currentProject.githubLink} target="_blank">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button className="gap-2 pl-6 pr-8 py-6 rounded-2xl bg-gradient-to-r from-primary to-blue-400 hover:from-primary/90 hover:to-blue-400/90 transition-all duration-300">
                        <Github className="w-5 h-5" />
                        <span>查看源码</span>
                        <span className="ml-2 opacity-60 group-hover:translate-x-1 transition-transform">→</span>
                      </Button>
                    </motion.div>
                  </Link>
                )}
                {currentProject.demoLink && (
                  <Link href={currentProject.demoLink} target="_blank">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="outline"
                        className="gap-2 pl-6 pr-8 py-6 rounded-2xl border-primary/20 hover:border-primary/40 hover:bg-primary/5 transition-all duration-300"
                      >
                        <Code2 className="w-5 h-5" />
                        <span>架构解析</span>
                        <span className="ml-2 opacity-60 group-hover:translate-x-1 transition-transform">↗</span>
                      </Button>
                    </motion.div>
                  </Link>
                )}
              </motion.div>

              {/* 播放状态指示 */}
              {isHovering && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-background/30 backdrop-blur-sm border border-foreground/5 text-sm font-light text-foreground/60"
                >
                  已暂停
                </motion.div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* 导航控制 */}
        <div className="absolute bottom-8 right-8 flex gap-4">
          <button
            onClick={() => paginate(-1)}
            className="p-3 rounded-full bg-background/80 backdrop-blur-sm border border-foreground/10 hover:border-primary/40 transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={() => paginate(1)}
            className="p-3 rounded-full bg-background/80 backdrop-blur-sm border border-foreground/10 hover:border-primary/40 transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* 进度指示器 */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-1/3">
          <Progress 
            value={progress} 
            className="h-1.5 bg-foreground/5"
          >
            <motion.div 
              className="h-full bg-primary/80 rounded-full"
              style={{
                width: `${progress}%`,
                transition: "width 100ms linear"
              }}
            />
          </Progress>
        </div>
      </motion.div>
    </div>
  )
})

ProjectsSection.displayName = "ProjectsSection"

export default ProjectsSection


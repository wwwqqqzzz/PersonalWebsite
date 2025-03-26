"use client"

import React, { useRef, useState, useEffect, forwardRef } from "react"
import { motion, useAnimation, MotionValue, useSpring, useTransform } from "framer-motion"
import { cn } from "@/lib/utils"
import { useInView } from "react-intersection-observer"
import { useScroll } from "framer-motion"

// 技能数据结构
interface SkillItem {
  name: string
  level: number
  icon: string
}

interface SkillCategory {
  category: string
  icon: string
  description: string
  items: SkillItem[]
  color: string
}

// 定义技能数据
const skillsData: SkillCategory[] = [
  {
    category: "前端开发",
    icon: "🌐",
    color: "from-blue-500 to-cyan-400",
    description: "构建交互性强、性能卓越的用户界面",
    items: [
      { name: "React", level: 95, icon: "⚛️" },
      { name: "TypeScript", level: 90, icon: "📘" },
      { name: "Next.js", level: 92, icon: "⚡" },
      { name: "Tailwind CSS", level: 88, icon: "🎨" },
      { name: "Framer Motion", level: 85, icon: "🎬" },
    ],
  },
  {
    category: "后端开发",
    icon: "🖥️",
    color: "from-emerald-500 to-green-400",
    description: "搭建高性能、可扩展的服务端系统",
    items: [
      { name: "Node.js", level: 88, icon: "🟢" },
      { name: "Python", level: 85, icon: "🐍" },
      { name: "数据库设计", level: 90, icon: "💾" },
      { name: "RESTful API", level: 92, icon: "🔌" },
      { name: "微服务架构", level: 86, icon: "🧩" },
    ],
  },
  {
    category: "UI/UX设计",
    icon: "🎨",
    color: "from-purple-500 to-violet-400",
    description: "设计优雅、直观、引人入胜的用户体验",
    items: [
      { name: "交互设计", level: 90, icon: "🤝" },
      { name: "响应式设计", level: 95, icon: "📱" },
      { name: "动效设计", level: 88, icon: "✨" },
      { name: "可访问性", level: 85, icon: "♿" },
      { name: "用户测试", level: 82, icon: "🔍" },
    ],
  },
  {
    category: "DevOps",
    icon: "🔄",
    color: "from-orange-500 to-amber-400",
    description: "自动化开发、测试、部署流程",
    items: [
      { name: "CI/CD", level: 85, icon: "🔄" },
      { name: "Docker", level: 88, icon: "🐳" },
      { name: "Kubernetes", level: 80, icon: "⚙️" },
      { name: "监控与日志", level: 82, icon: "📊" },
      { name: "云服务", level: 86, icon: "☁️" },
    ],
  },
  {
    category: "数据科学",
    icon: "📊",
    color: "from-red-500 to-rose-400",
    description: "通过数据分析提供业务洞察",
    items: [
      { name: "数据分析", level: 88, icon: "📈" },
      { name: "数据可视化", level: 90, icon: "📊" },
      { name: "机器学习基础", level: 75, icon: "🧠" },
      { name: "统计分析", level: 82, icon: "🔢" },
      { name: "数据建模", level: 78, icon: "🏗️" },
    ],
  },
  {
    category: "移动开发",
    icon: "📱",
    color: "from-pink-500 to-fuchsia-400",
    description: "开发跨平台移动应用",
    items: [
      { name: "React Native", level: 85, icon: "📱" },
      { name: "iOS/Swift", level: 75, icon: "🍎" },
      { name: "Android/Kotlin", level: 72, icon: "🤖" },
      { name: "Flutter", level: 78, icon: "💙" },
      { name: "移动UI设计", level: 88, icon: "🎨" },
    ],
  },
]

interface SkillsMatrixProps {
  className?: string
}

const SkillsMatrix = forwardRef<HTMLDivElement, SkillsMatrixProps>((props, ref) => {
  // 跟踪当前激活的技能卡片
  const [activeCard, setActiveCard] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const matrixRef = useRef<HTMLDivElement>(null)
  
  // 创建滚动动画的进度跟踪
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })
  
  // 背景动画效果参数
  const bgX = useTransform(scrollYProgress, [0, 1], ['-5%', '5%'])
  const bgY = useTransform(scrollYProgress, [0, 1], ['-5%', '5%'])
  const bgScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.95])
  const bgOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
  
  // 标题动画
  const titleY = useTransform(scrollYProgress, [0, 0.2], [50, 0])
  const titleOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1])
  
  // 矩阵整体动画
  const matrixScale = useTransform(scrollYProgress, [0.1, 0.3], [0.8, 1])
  const matrixOpacity = useTransform(scrollYProgress, [0.1, 0.3], [0, 1])
  const matrixY = useTransform(scrollYProgress, [0.1, 0.3], [50, 0])
  
  // 3D效果参数
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [matrixCenter, setMatrixCenter] = useState({ x: 0, y: 0 })
  
  // 鼠标移动跟踪
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (matrixRef.current) {
        const rect = matrixRef.current.getBoundingClientRect()
        setMatrixCenter({
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2
        })
        setMousePosition({ x: e.clientX, y: e.clientY })
      }
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])
  
  // 计算3D倾斜角度
  const calcTilt = (index: number) => {
    if (!matrixRef.current || activeCard !== null) return { x: 0, y: 0 }
    
    const dx = mousePosition.x - matrixCenter.x
    const dy = mousePosition.y - matrixCenter.y
    
    // 根据卡片位置调整倾斜角度
    const row = Math.floor(index / 3)
    const col = index % 3
    const xOffset = (col - 1) * 0.5 // -0.5, 0, 0.5
    const yOffset = (row - 1) * 0.5 // -0.5, 0, 0.5
    
    return {
      x: (dy / matrixRef.current.clientHeight * 5) + yOffset * 2,
      y: -(dx / matrixRef.current.clientWidth * 5) + xOffset * 2
    }
  }
  
  // 点击卡片处理函数
  const handleCardClick = (index: number) => {
    if (activeCard === index) {
      setActiveCard(null)
    } else {
      setActiveCard(index)
    }
  }
  
  // 使用 IntersectionObserver 进行动画触发
  const { ref: inViewRef, inView } = useInView({
    threshold: 0.2,
    triggerOnce: false
  })
  
  // 合并多个 ref
  const setRefs = (el: HTMLDivElement) => {
    // 合并 containerRef 和 inViewRef
    containerRef.current = el
    inViewRef(el)
    
    // 如果传入了 ref，也要设置它
    if (typeof ref === 'function') {
      ref(el)
    } else if (ref) {
      ref.current = el
    }
  }
  
  return (
    <div 
      ref={setRefs}
      id="skills"
      className={cn("min-h-screen flex flex-col items-center justify-center relative py-20", props.className)}
    >
      {/* 背景效果 */}
      <motion.div 
        className="absolute inset-0 pointer-events-none"
        style={{ 
          backgroundImage: 'url("/background/layer-dots.svg")',
          backgroundSize: '30px 30px',
          x: bgX,
          y: bgY,
          scale: bgScale,
          opacity: bgOpacity
        }}
      />
      <motion.div 
        className="absolute inset-0 pointer-events-none"
        style={{ 
          backgroundImage: 'url("/background/layer-grid.svg")',
          backgroundSize: '50px 50px',
          x: bgX,
          y: bgY,
          scale: bgScale,
          opacity: bgOpacity
        }}
      />
      
      {/* 发光球体背景 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-[30%] -left-[20%] w-[80%] h-[80%] rounded-full bg-blue-500/10 blur-[120px]" />
        <div className="absolute -bottom-[30%] -right-[20%] w-[80%] h-[80%] rounded-full bg-purple-500/10 blur-[120px]" />
      </div>
      
      {/* 标题 */}
      <motion.div 
        className="text-center mb-16 relative z-10"
        style={{
          y: titleY,
          opacity: titleOpacity
        }}
      >
        <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">
          技能矩阵
        </h2>
        <p className="mt-4 text-foreground/60 max-w-md mx-auto">
          多年积累的技术经验，形成体系化的跨领域技能矩阵
        </p>
      </motion.div>
      
      {/* 技能矩阵布局 */}
      <motion.div
        ref={matrixRef}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 w-full max-w-6xl px-4"
        style={{
          scale: matrixScale,
          opacity: matrixOpacity,
          y: matrixY,
          perspective: 1000
        }}
      >
        {skillsData.map((category, index) => {
          const tilt = calcTilt(index)
          const delay = 0.1 + index * 0.05
          
          return (
            <motion.div 
              key={category.category}
              className={cn(
                "relative group perspective-card will-change-transform",
                activeCard !== null && activeCard !== index ? "opacity-30 scale-95" : "opacity-100"
              )}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ 
                duration: 0.6, 
                delay: delay, 
                ease: [0.215, 0.61, 0.355, 1]
              }}
              style={{
                rotateX: tilt.x,
                rotateY: tilt.y,
                transformStyle: "preserve-3d"
              }}
              whileHover={{ z: 20 }}
              onClick={() => handleCardClick(index)}
            >
              {/* 卡片正面 - 摘要视图 */}
              <motion.div 
                className={cn(
                  "skill-card relative h-64 md:h-80 p-6 rounded-2xl border overflow-hidden",
                  "border-primary/20 dark:border-primary/10",
                  "bg-white/80 dark:bg-black/50 backdrop-blur-lg",
                  "transform-gpu transition-all duration-500 ease-out",
                  "shadow-[0_8px_30px_rgb(0,0,0,0.06)]",
                  "flex flex-col justify-between",
                  activeCard === index ? "invisible" : "visible"
                )}
                style={{
                  transformStyle: "preserve-3d",
                }}
              >
                {/* 顶部光效 */}
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-70" />

                {/* 卡片内容 */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-4xl">{category.icon}</span>
                    <h3 className="text-xl md:text-2xl font-bold bg-gradient-to-r bg-clip-text text-transparent from-foreground to-foreground/70">
                      {category.category}
                    </h3>
                  </div>
                  <p className="text-foreground/60 text-sm">
                    {category.description}
                  </p>
                </div>
                
                {/* 技能列表预览 */}
                <div className="space-y-2">
                  {category.items.slice(0, 3).map((skill, i) => (
                    <div key={skill.name} className="flex items-center space-x-2">
                      <span className="text-lg">{skill.icon}</span>
                      <span className="text-sm text-foreground/80">{skill.name}</span>
                    </div>
                  ))}
                  {category.items.length > 3 && (
                    <div className="text-xs text-foreground/60 italic">
                      还有 {category.items.length - 3} 项技能...
                    </div>
                  )}
                </div>
                
                {/* 装饰性元素 */}
                <motion.div 
                  className={`absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-gradient-to-tr ${category.color} opacity-20 blur-xl`}
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.2, 0.25, 0.2]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                />
                
                {/* 悬停提示 */}
                <div className="absolute bottom-4 right-4 text-xs text-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  点击查看详情 ↗
                </div>
              </motion.div>
              
              {/* 卡片背面 - 详细视图 */}
              <motion.div 
                className={cn(
                  "skill-card-detail absolute inset-0 p-6 rounded-2xl border",
                  "border-primary/30 dark:border-primary/20",
                  "bg-white/90 dark:bg-black/70 backdrop-blur-xl",
                  "transform-gpu transition-all duration-500 ease-out",
                  "shadow-[0_8px_30px_rgb(0,0,0,0.12)]",
                  "flex flex-col",
                  activeCard === index ? "visible" : "invisible"
                )}
                style={{
                  transformStyle: "preserve-3d",
                }}
              >
                {/* 卡片标题 */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{category.icon}</span>
                    <h3 className={`text-lg font-bold bg-gradient-to-r bg-clip-text text-transparent ${category.color}`}>
                      {category.category}
                    </h3>
                  </div>
                  <motion.button
                    className="w-6 h-6 rounded-full flex items-center justify-center text-foreground/60 hover:text-foreground/80 hover:bg-foreground/10 transition-colors"
                    whileTap={{ scale: 0.9 }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </motion.button>
                </div>
                
                {/* 技能详情列表 */}
                <div className="space-y-4 flex-grow">
                  {category.items.map((skill, i) => (
                    <motion.div 
                      key={skill.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={activeCard === index ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                      transition={{ duration: 0.3, delay: 0.1 + i * 0.05 }}
                      className="space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{skill.icon}</span>
                          <span className="text-sm font-medium">{skill.name}</span>
                        </div>
                        <span className="text-xs text-foreground/70">{skill.level}%</span>
                      </div>
                      
                      {/* 技能进度条 */}
                      <div className="h-1.5 w-full bg-foreground/10 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full bg-gradient-to-r ${category.color}`}
                          initial={{ width: 0 }}
                          animate={activeCard === index ? { width: `${skill.level}%` } : { width: 0 }}
                          transition={{ duration: 0.5, delay: 0.2 + i * 0.05 }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                {/* 装饰元素 */}
                <div className="absolute -z-10 top-0 right-0 w-full h-full overflow-hidden rounded-2xl">
                  <div className={`absolute top-0 right-0 w-32 h-32 rounded-full bg-gradient-to-br ${category.color} opacity-20 filter blur-2xl`} />
                  <div className={`absolute bottom-0 left-0 w-32 h-32 rounded-full bg-gradient-to-tr ${category.color} opacity-10 filter blur-2xl`} />
                </div>
              </motion.div>
            </motion.div>
          )
        })}
      </motion.div>
      
      {/* 底部装饰 */}
      <motion.div 
        className="w-full max-w-md h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent rounded-full mt-16 opacity-0"
        animate={{ opacity: inView ? 0.6 : 0 }}
        transition={{ duration: 1, delay: 0.5 }}
      />
    </div>
  )
})

SkillsMatrix.displayName = "SkillsMatrix"

export default SkillsMatrix 
"use client"

import React, { useRef, useEffect } from "react"
import { motion, useScroll, useTransform, MotionValue } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface HeroAboutSectionProps {
  className?: string
}

const skills = [
  { name: "前端开发", level: 90, icon: "🌐", color: "from-blue-500 to-blue-700" },
  { name: "后端开发", level: 85, icon: "🔧", color: "from-green-500 to-green-700" },
  { name: "UI/UX设计", level: 75, icon: "🎨", color: "from-purple-500 to-purple-700" },
  { name: "数据库", level: 80, icon: "📊", color: "from-orange-500 to-orange-700" }
]

const HeroAboutSection: React.FC<HeroAboutSectionProps> = ({ className }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const avatarRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)

  // 创建滚动动画的进度跟踪
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })

  // 头像动画转换
  const avatarScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.7])
  const avatarOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0.3])
  const avatarY = useTransform(scrollYProgress, [0, 0.5], [0, -50])
  const avatarRotate = useTransform(scrollYProgress, [0, 0.4], [0, 10])

  // 标题动画转换
  const titleY = useTransform(scrollYProgress, [0, 0.5], [0, -100])
  const titleOpacity = useTransform(scrollYProgress, [0, 0.3, 0.5], [1, 0.8, 0.5])
  const titleScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9])

  // 背景色动画
  const bgOpacity = useTransform(scrollYProgress, [0, 0.7], [0, 0.7])
  
  // 背景图案动画
  const bgPatternY = useTransform(scrollYProgress, [0, 1], [0, -100])
  const bgPatternOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.05, 0.1, 0.05])

  // About部分动画
  const aboutOpacity = useTransform(scrollYProgress, [0.2, 0.4], [0, 1])
  const aboutY = useTransform(scrollYProgress, [0.2, 0.5], [100, 0])
  const aboutScale = useTransform(scrollYProgress, [0.2, 0.5], [0.9, 1])

  // 技能条动画
  const skillsOpacity = useTransform(scrollYProgress, [0.4, 0.6], [0, 1])
  const skillsY = useTransform(scrollYProgress, [0.4, 0.7], [50, 0])
  
  // 上部分和下部分分割线动画
  const dividerWidth = useTransform(scrollYProgress, [0.3, 0.5], ["0%", "100%"])
  const dividerOpacity = useTransform(scrollYProgress, [0.3, 0.4, 0.8], [0, 1, 0.5])

  // 面板框架动画
  const frameBorderOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [1, 0.7, 0.5, 0.3])
  const frameScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.98])

  // 创建3D卡片效果
  const createTiltEffect = (progress: MotionValue<number>, direction: number = 1) => {
    return useTransform(progress, [0, 0.5, 1], [0, 5 * direction, 0])
  }

  const tiltX = createTiltEffect(scrollYProgress)
  const tiltY = createTiltEffect(scrollYProgress, -1)

  return (
    <div ref={containerRef} className={`relative min-h-[150vh] ${className}`}>
      {/* 背景网格动画 */}
      <motion.div 
        className="fixed inset-0 bg-[url('/grid.svg')] opacity-5 z-0 pointer-events-none"
        style={{ 
          y: bgPatternY,
          opacity: bgPatternOpacity
        }}
      />
      
      {/* 背景渐变层 */}
      <motion.div 
        className="fixed inset-0 bg-gradient-to-b from-white to-gray-100 dark:from-black dark:to-gray-900 z-0"
        style={{ opacity: bgOpacity }}
      />

      {/* 外部面板框架 - 包含Hero和About部分 */}
      <motion.div 
        className="max-w-7xl mx-auto my-10 rounded-3xl overflow-hidden border border-border/30 backdrop-blur-sm bg-background/20 shadow-xl"
        style={{
          scale: frameScale,
          opacity: frameBorderOpacity
        }}
      >
        {/* Hero上半部分面板 */}
        <motion.div className="relative border-b border-border/30">
          {/* 顶部装饰栏 */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500/40 via-primary/30 to-blue-500/40"></div>
          
          <div className="min-h-screen flex flex-col items-center justify-center relative px-4 pt-20">
            {/* 头像区域 */}
            <motion.div 
              ref={avatarRef}
              className="relative mb-12"
              style={{ 
                scale: avatarScale,
                opacity: avatarOpacity,
                y: avatarY,
                rotateZ: avatarRotate
              }}
            >
              <div className="absolute -inset-5 bg-gradient-to-r from-primary/10 via-purple-500/5 to-blue-500/10 rounded-full blur-2xl opacity-50 animate-pulse"/>
              
              <div className="relative w-40 h-40 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-primary/20 shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 via-blue-500/5 to-cyan-500/10 animate-pulse"></div>
                <Image
                  src="/avatar/首页头像.png"
                  alt="个人照片"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              
              <div className="absolute -bottom-2 inset-x-0 flex justify-center">
                <div className="flex items-center gap-2 bg-background/80 backdrop-blur-sm border border-border/50 rounded-full px-3 py-1.5">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-xs">开发者</span>
                </div>
              </div>
              
              {/* 装饰性粒子 */}
              <motion.div 
                className="absolute -left-6 top-10 w-4 h-4 rounded-full bg-blue-500/30 blur-sm" 
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              />
              <motion.div 
                className="absolute right-2 -top-8 w-3 h-3 rounded-full bg-purple-500/30 blur-sm"
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
              />
              <motion.div 
                className="absolute right-0 bottom-4 w-5 h-5 rounded-full bg-pink-500/20 blur-sm"
                animate={{ x: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              />
            </motion.div>
            
            {/* Hero下半部分：标题区域 */}
            <motion.div
              ref={titleRef}
              className="text-center space-y-6 max-w-2xl mx-auto relative z-10"
              style={{ 
                y: titleY,
                opacity: titleOpacity,
                scale: titleScale
              }}
            >
              <h1 className="text-4xl md:text-6xl font-bold">
                <span className="text-primary/80">{">"}</span>
                <span className="bg-gradient-to-r from-primary via-purple-400 to-pink-500 bg-clip-text text-transparent animate-gradient">{" WangQiZhe"}</span>
                <span className="text-primary/60">{".dev"}</span>
              </h1>
              
              <motion.div 
                className="w-20 h-1.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent rounded-full mx-auto"
                animate={{ width: ["20%", "60%", "20%"] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              />
              
              <p className="text-lg md:text-xl text-muted-foreground">
                将复杂问题分解为优雅的代码解决方案
              </p>
              
              <div className="flex flex-wrap justify-center gap-2 mt-6">
                {["React", "Next.js", "TypeScript", "Node.js", "UI/UX设计"].map((skill, index) => (
                  <motion.span 
                    key={index} 
                    className="inline-block py-1 px-2.5 rounded-full text-xs bg-background/80 border border-border backdrop-blur-sm"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
              
              <div className="flex flex-wrap justify-center gap-4 mt-8">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="lg" className="bg-purple-600 hover:bg-purple-700" asChild>
                    <Link href="/resume">
                      查看简历
                    </Link>
                  </Button>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="#projects">
                      项目案例 →
                    </Link>
                  </Button>
                </motion.div>
              </div>
            </motion.div>
            
            {/* Hero和About分隔线 - 随滚动展开 */}
            <motion.div 
              className="absolute bottom-20 left-0 right-0 flex justify-center"
              style={{ opacity: dividerOpacity }}
            >
              <motion.div 
                className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"
                style={{ width: dividerWidth }}
              />
            </motion.div>
            
            {/* 向下滚动指示器 */}
            <motion.div 
              className="absolute bottom-10 left-1/2 -translate-x-1/2"
              initial={{ opacity: 0.5, y: 0 }}
              animate={{ opacity: 1, y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
              <div className="flex flex-col items-center gap-2">
                <span className="text-sm text-muted-foreground">向下滚动</span>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 5L12 19M12 19L19 12M12 19L5 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </motion.div>
          </div>
        </motion.div>
        
        {/* About部分面板 */}
        <motion.div 
          className="relative"
          style={{ 
            opacity: aboutOpacity,
            y: aboutY,
            scale: aboutScale
          }}
        >
          {/* 面板装饰元素 */}
          <div className="absolute -top-px left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-border to-transparent"></div>
          
          <div className="min-h-screen flex flex-col justify-center px-4 py-20">
            <div className="max-w-6xl mx-auto w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* 左侧：个人介绍 - 带框架 */}
                <motion.div 
                  className="space-y-6 p-6 rounded-2xl border border-border/50 bg-background/40 backdrop-blur-sm shadow-lg"
                  style={{
                    rotateY: tiltY,
                    rotateX: tiltX,
                    transformPerspective: 1200
                  }}
                >
                  <h2 className="inline-flex items-center text-2xl md:text-3xl font-bold">
                    <div className="w-8 h-8 mr-3 rounded-full bg-primary/10 flex items-center justify-center">
                      <div className="w-4 h-4 rounded-full bg-primary/40"></div>
                    </div>
                    关于我
                  </h2>
                  
                  <p className="text-lg text-muted-foreground">
                    作为一名热爱创新的全栈开发者，我专注于打造高性能、用户友好的数字产品。
                    拥有多年行业经验，熟练掌握前后端各种技术栈，擅长解决复杂技术问题。
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                    <motion.div 
                      className="border border-border/50 rounded-lg p-4 bg-card/30"
                      whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="text-4xl mb-2">10+</div>
                      <div className="text-sm text-muted-foreground">年行业经验</div>
                    </motion.div>
                    
                    <motion.div 
                      className="border border-border/50 rounded-lg p-4 bg-card/30"
                      whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="text-4xl mb-2">50+</div>
                      <div className="text-sm text-muted-foreground">成功项目</div>
                    </motion.div>
                    
                    <motion.div 
                      className="border border-border/50 rounded-lg p-4 bg-card/30"
                      whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="text-4xl mb-2">99%</div>
                      <div className="text-sm text-muted-foreground">客户满意度</div>
                    </motion.div>
                    
                    <motion.div 
                      className="border border-border/50 rounded-lg p-4 bg-card/30"
                      whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="text-4xl mb-2">24/7</div>
                      <div className="text-sm text-muted-foreground">技术支持</div>
                    </motion.div>
                  </div>
                  
                  <div className="flex gap-4 pt-4">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button asChild className="bg-purple-600 hover:bg-purple-700">
                        <Link href="#contact">联系我</Link>
                      </Button>
                    </motion.div>
                    
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button variant="outline" asChild>
                        <Link href="/resume">简历下载</Link>
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
                
                {/* About下半部分：右侧技能图表 - 带框架 */}
                <motion.div
                  className="space-y-6 p-6 rounded-2xl border border-border/50 bg-background/40 backdrop-blur-sm shadow-lg"
                  style={{ 
                    opacity: skillsOpacity,
                    y: skillsY,
                    rotateY: tiltY,
                    rotateX: tiltX,
                    transformPerspective: 1200
                  }}
                >
                  <h3 className="text-xl font-semibold mb-6">专业技能</h3>
                  
                  <div className="space-y-6">
                    {skills.map((skill, index) => (
                      <motion.div 
                        key={index}
                        className="space-y-2"
                        initial={{ width: "0%" }}
                        whileInView={{ width: "100%" }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 * index }}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{skill.icon}</span>
                            <span>{skill.name}</span>
                          </div>
                          <span className="text-sm font-medium">{skill.level}%</span>
                        </div>
                        
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                          <motion.div 
                            className={`h-full rounded-full bg-gradient-to-r ${skill.color}`}
                            initial={{ width: 0 }}
                            whileInView={{ width: `${skill.level}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.3 + (0.1 * index), ease: "easeOut" }}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  <motion.div 
                    className="relative mt-10 p-6 bg-card/30 border border-border/50 rounded-lg"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="absolute -top-5 left-6 bg-background px-2 py-1 rounded-md border border-border/50">
                      <span className="text-sm font-medium">工作理念</span>
                    </div>
                    
                    <p className="text-muted-foreground">
                      我相信<span className="text-primary font-medium">极致的用户体验</span>源于对细节的关注和不断追求完美的态度。
                      每个项目都是独特的艺术品，通过创新和技术的结合，为用户创造真正有价值的数字体验。
                    </p>
                    
                    {/* 装饰元素 */}
                    <div className="absolute bottom-4 right-4 text-primary/20 text-5xl font-bold">{"</>"}</div>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default HeroAboutSection 
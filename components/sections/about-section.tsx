"use client"

import { forwardRef } from "react"
import { motion, useMotionTemplate, useTransform } from "framer-motion"
import Image from "next/image"
import { useMousePosition } from "@/hooks/use-mouse-position"

interface AboutSectionProps {
  className?: string
}

const AboutSection = forwardRef<HTMLDivElement, AboutSectionProps>((props, ref) => {
  const mouse = useMousePosition()
  const techStack = [
    { name: "Vue3", level: 0.9 },
    { name: "TypeScript", level: 0.85 },
    { name: "低代码", level: 0.8 }
  ]

  return (
    <motion.div
      ref={ref}
      id="about"
      className="min-h-screen flex items-center justify-center relative overflow-hidden py-20 md:py-32 bg-grid-[#ffffff08]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-16">
          <div className="flex flex-col items-center space-y-12">
            {/* 标题 */}
            <motion.h2
              className="text-5xl md:text-6xl font-mono font-bold text-foreground relative inline-block"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "circOut" }}
            >
              <span className="relative">
                技术苦行僧
                <div className="absolute -bottom-2 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-foreground/50 to-transparent" />
              </span>
            </motion.h2>

            {/* 三维头像容器 */}
            <motion.div 
              className="relative inline-block group perspective-1000"
              whileHover={{ 
                rotateY: 5,
                rotateX: -3,
                transition: { 
                  type: "spring",
                  stiffness: 300,
                  damping: 15
                }
              }}
            >
              <div className="relative z-10 p-1 bg-gradient-to-br from-foreground/10 to-background rounded-2xl shadow-2xl transform-style-preserve-3d">
                <div className="absolute inset-0 bg-primary/5 rounded-xl blur-xl" />
                
                <Image
                  src="https://cdn.jsdelivr.net/gh/wwwqqqzzz/Image/img/image-no-bg%20(1).png"
                  alt="技术苦行僧照片"
                  width={160}
                  height={160}
                  className="rounded-xl border-2 border-foreground/20 hover:border-primary/50 transition-colors duration-300 shadow-lg"
                />
              </div>

              {/* 全息投影效果 */}
              <div className="absolute inset-0 bg-[conic-gradient(from_230deg,theme(colors.primary),theme(colors.secondary),theme(colors.primary))] opacity-10 blur-2xl -z-10" />
            </motion.div>
          </div>

          {/* 技术标签 */}
          <motion.div 
            className="flex flex-wrap justify-center gap-3 mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <span className="px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20">代码手艺人</span>
            <span className="px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20">实战钉子户</span>
            <span className="px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20">反内卷战士</span>
          </motion.div>

          {/* 技能矩阵 */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="p-4 rounded-xl bg-background/80 backdrop-blur-sm border border-foreground/10">
              <h3 className="text-primary mb-2 font-mono">武器库</h3>
              <ul className="space-y-1 text-sm font-mono">
                <li>• Vue3全家桶</li>
                <li>• 前端性能调优</li>
                <li>• 低代码平台改造</li>
              </ul>
            </div>
            
            <div className="p-4 rounded-xl bg-background/80 backdrop-blur-sm border border-foreground/10">
              <h3 className="text-primary mb-2 font-mono">哲学</h3>
              <p className="text-sm font-mono">用20%规范代码承载80%业务需求</p>
            </div>
            
            <div className="p-4 rounded-xl bg-background/80 backdrop-blur-sm border border-foreground/10">
              <h3 className="text-primary mb-2 font-mono">暗黑技能</h3>
              <ul className="space-y-1 text-sm font-mono">
                <li>• CSDN资源海盗</li>
                <li>• B站教程缝合怪</li>
                <li>• GitHub星探</li>
              </ul>
            </div>
          </motion.div>

          {/* 发展路线 */}
          <motion.div
            className="mt-48"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <div className="relative h-[2px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent rounded-full overflow-visible">
              <div className="absolute -left-4 top-1/2 -translate-y-1/2">
                <span className="text-foreground/50 text-lg">...</span>
              </div>

              {/* 代码鬣狗 */}
              <div className="absolute left-[15%] -translate-y-8 text-sm font-mono">
                <motion.div 
                  className="relative group"
                  whileHover={{ scale: 1.1 }}
                >
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[1px] h-4 bg-primary/30" />
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-2 h-2 bg-primary/50 rounded-full group-hover:bg-primary transition-colors" />
                  <span className="text-foreground/70 group-hover:text-primary transition-colors">代码鬣狗</span>
                </motion.div>
              </div>

              {/* 外包豺狼 */}
              <div className="absolute left-[38%] translate-y-6 text-sm font-mono">
                <motion.div 
                  className="relative group"
                  whileHover={{ scale: 1.1 }}
                >
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-[1px] h-4 bg-primary/30" />
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-2 h-2 bg-primary/50 rounded-full group-hover:bg-primary transition-colors" />
                  <span className="text-foreground/70 group-hover:text-primary transition-colors">外包豺狼</span>
                </motion.div>
              </div>

              {/* 技术秃鹫 */}
              <div className="absolute left-[61%] -translate-y-8 text-sm font-mono">
                <motion.div 
                  className="relative group"
                  whileHover={{ scale: 1.1 }}
                >
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[1px] h-4 bg-primary/30" />
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-2 h-2 bg-primary/50 rounded-full group-hover:bg-primary transition-colors" />
                  <span className="text-foreground/70 group-hover:text-primary transition-colors">技术秃鹫</span>
                </motion.div>
              </div>

              {/* 赛博巫妖 */}
              <div className="absolute left-[84%] translate-y-6 text-sm font-mono">
                <motion.div 
                  className="relative group"
                  whileHover={{ scale: 1.1 }}
                >
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-[1px] h-4 bg-primary/30" />
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-2 h-2 bg-primary/50 rounded-full group-hover:bg-primary transition-colors" />
                  <span className="text-foreground/70 group-hover:text-primary transition-colors">赛博巫妖</span>
                </motion.div>
              </div>

              <div className="absolute -right-4 top-1/2 -translate-y-1/2">
                <span className="text-foreground/50 text-lg">...</span>
              </div>

              {/* 当前进度标记 */}
              <motion.div 
                className="absolute left-[26.5%] top-1/2 -translate-y-1/2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.2, type: "spring" }}
              >
                <div className="relative">
                  <div className="w-4 h-4 rounded-full bg-primary/30 animate-ping absolute inset-0" />
                  <div className="w-4 h-4 rounded-full bg-primary relative" />
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* 背景科技元素 */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]" />
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent"
          animate={{ y: ["-100%", "100%"] }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        />
      </div>
    </motion.div>
  )
})

AboutSection.displayName = "AboutSection"

export default AboutSection

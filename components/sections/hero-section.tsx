"use client"

import { forwardRef } from "react"
import { motion, useMotionTemplate, useMotionValue, useTransform } from "framer-motion"
import Image from "next/image"
import { useMousePosition } from "@/hooks/use-mouse-position"
import { TextGenerateEffect } from "@/components/ui/text-generate-effect"
import { Particles } from "@/components/ui/particles"
import { FloatingCodeWindow } from "@/components/ui/floating-code"
import { Tooltip } from "@/components/ui/tooltip"

const CODE_SNIPPETS = [
  `function innovate() {\n  return solutions.map(\n    s => s.optimize()\n  )\n}`,
  `const stack = {\n  frontend: ['React', 'TypeScript'],\n  backend: ['Node', 'Rust']\n}`,
  `interface System {\n  scalable: true\n  resilient: {\n    level: 'HA'\n  }\n}`
]

interface HeroSectionProps {
  className?: string
}

const HeroSection = forwardRef<HTMLDivElement, HeroSectionProps>((props, ref) => {
  const mousePosition = useMousePosition()
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const transformX = useTransform(mouseX, [-500, 500], [-15, 15])
  const transformY = useTransform(mouseY, [-500, 500], [-15, 15])

  return (
    <motion.div
      ref={ref}
      id="home"
      className="min-h-screen flex items-center justify-center relative overflow-hidden py-20 md:py-32"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, ease: [0.6, 0.05, 0.01, 0.9] }}
      onMouseMove={(e) => {
        const { clientX, clientY } = e
        const targetX = clientX - window.innerWidth / 2
        const targetY = clientY - window.innerHeight / 2
        mouseX.set(targetX)
        mouseY.set(targetY)
      }}
    >
      {/* 浮动代码窗口 */}
      <FloatingCodeWindow snippets={CODE_SNIPPETS} />

      {/* 粒子背景 */}
      <Particles 
        className="absolute inset-0 opacity-40"
        quantity={50}
        staticity={70}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* 头像区域 - Mac终端风格 */}
          <motion.div 
            className="relative inline-block group"
            whileHover={{ 
              scale: 1.02,
              transition: { 
                type: "spring",
                stiffness: 400,
                damping: 15
              }
            }}
            style={{ x: transformX, y: transformY }}
          >
            <div className="absolute -inset-4 bg-primary/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="relative z-10 pt-8 p-3 bg-gradient-to-br from-background to-foreground/5 rounded-2xl shadow-2xl backdrop-blur-xl border border-foreground/10">
              {/* Mac窗口控制按钮 */}
              <div className="flex gap-1.5 absolute top-2.5 left-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/90" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/90" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/90" />
              </div>
              
              <Image
                src="https://cdn.jsdelivr.net/gh/wwwqqqzzz/Image/img/image-no-bg.png"
                alt="王起哲的照片"
                width={140}
                height={140}
                className="rounded-xl border-2 border-foreground/20 hover:border-primary/50 transition-colors duration-300"
              />
            </div>
          </motion.div>

          {/* 标题 - 命令行风格 */}
          <motion.div 
            className="relative inline-block"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "circOut" }}
          >
            <div className="absolute -inset-4 bg-primary/5 rounded-xl blur-2xl" />
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-mono font-bold tracking-tighter">
              <span className="text-primary/80">{">"}</span>
              <span className="bg-gradient-to-r from-primary via-purple-400 to-pink-500 bg-clip-text text-transparent animate-gradient">{" WangQiZhe"}</span>
              <span className="text-primary/60">{".dev"}</span>
            </h1>
          </motion.div>

          {/* 个性签名 - 技术导向 */}
          <TextGenerateEffect
            words="将复杂问题分解为优雅的代码解决方案"
            className="text-lg sm:text-xl md:text-2xl text-foreground/70"
          />

          {/* 技术指标展示 */}
          <motion.div 
            className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 text-foreground/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: "circOut" }}
          >
            <Tooltip content="已部署并服务于数百万用户的企业级系统">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-xs">{"</>"}</span>
                </div>
                <span>服务数百万用户</span>
              </div>
            </Tooltip>
            <Tooltip content="系统可用性达到金融级标准">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-green-500/20 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                </div>
                <span>99.99% 可用性</span>
              </div>
            </Tooltip>
          </motion.div>

          {/* 按钮组 */}
          <motion.div 
            className="flex flex-col sm:flex-row justify-center gap-4 mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: "circOut" }}
          >
            <motion.button
              className="group relative px-8 py-4 rounded-xl bg-primary text-primary-foreground font-medium overflow-hidden shadow-lg shadow-primary/25"
              whileHover={{ 
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative flex items-center gap-2">
                查看简历
              </span>
            </motion.button>

            <motion.button
              className="px-8 py-4 rounded-xl border border-foreground/10 bg-background/50 backdrop-blur-sm text-foreground/80 hover:text-primary hover:border-primary/50 transition-colors duration-300"
              whileHover={{ 
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.98 }}
            >
              项目案例研究 →
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* 背景装饰 */}
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

HeroSection.displayName = "HeroSection"

export default HeroSection

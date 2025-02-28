"use client"

import { forwardRef } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface HeroSectionProps {
  className?: string
}

const HeroSection = forwardRef<HTMLElement, HeroSectionProps>((props, ref) => {
  return (
    <motion.section
      ref={ref}
      id="home"
      className="min-h-screen flex items-center justify-center relative overflow-hidden py-20 md:py-32"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6 inline-block"
          >
            <Image
              src="/avatar.jpg"
              alt="王起哲的照片"
              width={120}
              height={120}
              className="rounded-full border-4 border-primary/20"
            />
          </motion.div>
          
          <motion.h1
            className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            你好，我是 <span className="text-primary">王起哲</span>
          </motion.h1>
          
          <motion.p
            className="text-xl md:text-2xl text-foreground/70 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            一名专注于创造优秀用户体验的
            <span className="text-primary font-semibold">前端开发工程师</span>
          </motion.p>
          
          <motion.div
            className="flex flex-wrap gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              查看作品
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 rounded-lg bg-primary/10 text-primary font-medium hover:bg-primary/20 transition-colors"
            >
              了解更多
            </motion.button>
          </motion.div>
          
          <motion.div
            className="mt-12 flex justify-center gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">3+</div>
              <div className="text-sm text-foreground/60">年开发经验</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">50+</div>
              <div className="text-sm text-foreground/60">完成项目</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">100%</div>
              <div className="text-sm text-foreground/60">客户满意度</div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/30 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.2, 0.3],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
    </motion.section>
  )
})

HeroSection.displayName = "HeroSection"

export default HeroSection

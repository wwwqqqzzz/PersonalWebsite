"use client"

import { forwardRef } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { ContainerScroll } from "@/components/ui/container-scroll-animation"
import { TextGenerateEffect } from "@/components/ui/text-generate-effect"
import { Tooltip } from "@/components/ui/tooltip"

interface HeroSectionParallaxProps {
  className?: string
}

const HeroSectionParallax = forwardRef<HTMLDivElement, HeroSectionParallaxProps>((props, ref) => {
  return (
    <ContainerScroll
      titleComponent={
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: [0.6, 0.05, 0.01, 0.9] }}
          className="relative z-10"
        >
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
            className="text-lg sm:text-xl md:text-2xl text-foreground/70 mt-4"
          />

          {/* 技术指标展示 */}
          <motion.div 
            className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 mt-8 text-foreground/70"
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
        </motion.div>
      }
    >
      <div className="relative h-full w-full">
        {/* 背景装饰 */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]" />
          <motion.div
            className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent"
            animate={{ y: ["-100%", "100%"] }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          />
        </div>
        
        {/* 主要内容 */}
        <div className="relative w-full h-full flex items-center justify-center">
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
          >
            <div className="absolute -inset-4 bg-primary/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="relative z-10 pt-8 p-3 bg-gradient-to-br from-background to-foreground/5 rounded-2xl shadow-2xl backdrop-blur-xl border border-foreground/10">
              {/* Mac窗口控制按钮 */}
              <div className="flex gap-1.5 absolute top-2.5 left-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/90" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/90" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/90" />
              </div>
              
              <div className="relative">
                <Image
                  src="/avatar/首页头像.png"
                  alt="王起哲的照片"
                  width={240}
                  height={240}
                  className="rounded-xl border-2 border-foreground/20 hover:border-primary/50 transition-colors duration-300"
                />
                
                {/* 社交媒体按钮 - 鼠标悬停时显示 */}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex gap-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-2 transition-all duration-300 ease-in-out">
                  {/* GitHub按钮 */}
                  <motion.a
                    href="https://github.com/username" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-background/80 flex items-center justify-center border border-foreground/10 shadow-lg hover:bg-primary/20 transition-colors"
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                    </svg>
                  </motion.a>
                  
                  {/* Bilibili按钮 */}
                  <motion.a
                    href="https://bilibili.com/username" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-background/80 flex items-center justify-center border border-foreground/10 shadow-lg hover:bg-blue-500/20 transition-colors"
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg className="w-4 h-4 text-foreground" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.813 4.653h.854c1.51.054 2.769.578 3.773 1.574 1.004.995 1.524 2.249 1.56 3.76v7.36c-.036 1.51-.556 2.769-1.56 3.773s-2.262 1.524-3.773 1.56H5.333c-1.51-.036-2.769-.556-3.773-1.56S.036 18.858 0 17.347v-7.36c.036-1.511.556-2.765 1.56-3.76 1.004-.996 2.262-1.52 3.773-1.574h.774l-1.174-1.12a1.234 1.234 0 0 1-.373-.906c0-.356.124-.658.373-.907l.027-.027c.267-.249.573-.373.92-.373.347 0 .653.124.92.373L9.653 4.44c.071.071.134.142.187.213h4.267a.836.836 0 0 1 .16-.213l2.853-2.747c.267-.249.573-.373.92-.373.347 0 .662.151.929.4.267.249.391.551.391.907 0 .355-.124.657-.373.906L17.813 4.653zM5.333 7.24c-.746.018-1.373.276-1.88.773-.506.498-.769 1.13-.786 1.894v7.52c.017.764.28 1.395.786 1.893.507.498 1.134.756 1.88.773h13.334c.746-.017 1.373-.275 1.88-.773.506-.498.769-1.129.786-1.893v-7.52c-.017-.765-.28-1.396-.786-1.894-.507-.497-1.134-.755-1.88-.773zM8 11.107c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c0-.373.129-.689.386-.947.258-.257.574-.386.947-.386zm8 0c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c.017-.391.15-.711.4-.96.249-.249.56-.373.933-.373Z" />
                    </svg>
                  </motion.a>
                  
                  {/* 知乎按钮 */}
                  <motion.a
                    href="https://zhihu.com/username" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-background/80 flex items-center justify-center border border-foreground/10 shadow-lg hover:bg-blue-700/20 transition-colors"
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg className="w-4 h-4 text-foreground" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M5.721 0C2.251 0 0 2.25 0 5.719V18.28C0 21.751 2.252 24 5.721 24h12.56C21.751 24 24 21.75 24 18.281V5.72C24 2.25 21.75 0 18.281 0zm1.964 4.078c-.271.23-.58.409-.904.524-.216.085-.456.125-.723.125-.678 0-1.232-.264-1.662-.793-.216-.265-.403-.601-.562-1.011.347-.21.655-.46.926-.75.465-.497.698-1.078.698-1.741H3.622c0 .909-.256 1.694-.77 2.354-.35.457-.85.836-1.455 1.14l.465 1.199c.402-.206.733-.46.996-.764v7.292c-.25.033-.467.093-.668.182-.334.143-.494.32-.494.538 0 .25.058.499.168.747l1.55-.62v1.598H9.59v-1.598l1.573.62c.108-.248.166-.497.166-.747 0-.218-.166-.395-.5-.538-.2-.09-.422-.149-.67-.182V4.776h-2.54l.072-.86h2.927c.397 1.253 1.019 2.097 1.865 2.532l.196-.126c-.466-.575-.84-1.332-1.122-2.276-.132-.44-.235-.875-.31-1.307h-3.56zm8.576 2.086v2.086h3.402v8.37c0 .265-.104.44-.312.528-.142.064-.328.096-.555.096h-.982l-.225 1.528c.836.105 1.502.157 1.95.157.678 0 1.204-.16 1.578-.483.374-.324.56-.754.56-1.287V6.164h3.402V4.078h-8.818z" />
                    </svg>
                  </motion.a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* 按钮组 */}
        <motion.div 
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col sm:flex-row justify-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "circOut" }}
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
    </ContainerScroll>
  )
})

HeroSectionParallax.displayName = "HeroSectionParallax"

export default HeroSectionParallax 
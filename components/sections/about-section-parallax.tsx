"use client"

import { forwardRef } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { ContainerScroll } from "@/components/ui/container-scroll-animation"

interface AboutSectionParallaxProps {
  className?: string
}

const AboutSectionParallax = forwardRef<HTMLDivElement, AboutSectionParallaxProps>((props, ref) => {
  return (
    <ContainerScroll
      titleComponent={
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: [0.6, 0.05, 0.01, 0.9] }}
          className="relative z-10"
        >
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
        </motion.div>
      }
    >
      <div className="relative h-full w-full flex flex-col items-center justify-center p-8 overflow-auto">
        {/* 背景网格效果 */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]" />
        </div>
        
        <div className="flex flex-col items-center space-y-12 w-full max-w-4xl mx-auto">
          {/* 技术苦行僧身份卡片 - 视差动画效果 */}
          <div className="w-[200px] h-[250px] rounded-xl overflow-hidden shadow-xl relative group transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] hover:scale-105 hover:-rotate-1">
            {/* 卡片背景 */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 dark:bg-[#1b2535] dark:bg-none z-0"></div>
            
            {/* 网格背景 */}
            <div className="absolute inset-0 opacity-30 dark:opacity-10 z-[1]">
              <div className="w-full h-full grid grid-cols-3 grid-rows-4">
                <div className="border-r border-b border-indigo-500/20 dark:border-gray-500/20"></div>
                <div className="border-r border-b border-indigo-500/20 dark:border-gray-500/20"></div>
                <div className="border-b border-indigo-500/20 dark:border-gray-500/20"></div>
                <div className="border-r border-b border-indigo-500/20 dark:border-gray-500/20"></div>
                <div className="border-r border-b border-indigo-500/20 dark:border-gray-500/20"></div>
                <div className="border-b border-indigo-500/20 dark:border-gray-500/20"></div>
                <div className="border-r border-b border-indigo-500/20 dark:border-gray-500/20"></div>
                <div className="border-r border-b border-indigo-500/20 dark:border-gray-500/20"></div>
                <div className="border-b border-indigo-500/20 dark:border-gray-500/20"></div>
                <div className="border-r border-indigo-500/20 dark:border-gray-500/20"></div>
                <div className="border-r border-indigo-500/20 dark:border-gray-500/20"></div>
                <div className=""></div>
              </div>
            </div>
            
            {/* 装饰性背景元素 */}
            <div className="absolute w-32 h-32 left-1/2 top-16 -translate-x-1/2 rounded-full 
                bg-gradient-to-b from-indigo-500/30 to-purple-500/20 
                dark:bg-gradient-to-b dark:from-indigo-500/20 dark:to-purple-500/10
                blur-xl opacity-50 z-[2]"></div>
            
            {/* 头像区域 - 悬停时缩小并模糊 */}
            <div className="mt-6 mx-auto w-28 h-28 relative flex items-center justify-center z-10 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-80 group-hover:blur-[3px] group-hover:-translate-y-3">
              <div className="absolute inset-0 rounded-full 
                  bg-gradient-to-r from-indigo-500/40 to-purple-500/40 
                  dark:bg-gradient-to-r dark:from-purple-500/30 dark:to-blue-500/30
                  blur-md"></div>
              <Image
                src="/avatar/技术苦行僧.png"
                alt="技术苦行僧照片"
                width={120}
                height={120}
                className="rounded-full object-cover relative z-10 
                    border-2 border-indigo-200/60
                    dark:border-2 dark:border-white/10"
                priority
              />
            </div>
            
            {/* 头像下方的装饰元素和提示 */}
            <div className="absolute w-20 h-0.5 bg-gradient-to-r from-transparent 
                via-indigo-400/40 
                dark:via-gray-400/30 
                to-transparent left-1/2 -translate-x-1/2 top-[120px] opacity-80 z-[3]"></div>
            <div className="absolute top-[130px] left-1/2 -translate-x-1/2 text-xs font-mono 
                text-indigo-700/70 
                dark:text-gray-400/70 
                tracking-wider z-[3]">
              <span className="opacity-70">~</span><span className="opacity-40">$</span><span className="opacity-70">_</span>
            </div>
            
            {/* 内涵提示 - 始终可见 */}
            <div className="absolute top-[150px] left-1/2 -translate-x-1/2 text-center px-3 py-1 text-xs font-mono tracking-tight opacity-70 
                text-indigo-700 
                dark:text-gray-300 
                z-[3]">
              <span className="text-xs">『 悬停查看隐藏技能 』</span>
            </div>
            
            {/* 标题和标签区域 - 默认隐藏，悬停时显示 */}
            <div className="absolute bottom-0 left-0 w-full space-y-2 p-4 z-20 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]">
              {/* 标题 */}
              <div className="text-center mb-2">
                <h3 className="text-xl font-bold 
                    text-indigo-900
                    dark:text-white">技术苦行僧</h3>
                <p className="text-xs 
                    text-indigo-800/80
                    dark:text-gray-300">代码之路修行者</p>
              </div>
              
              {/* 标签区域 */}
              <div className="space-y-2">
                {/* 紫色标签 */}
                <div className="w-full h-8 flex items-center px-3 
                    bg-purple-500/80 
                    dark:bg-purple-900/80 
                    rounded-md">
                  <div className="w-2 h-2 rounded-full 
                      bg-purple-300 
                      dark:bg-purple-400 
                      mr-2"></div>
                  <span className="text-sm text-white">代码手艺人</span>
                </div>
                
                {/* 蓝色标签 */}
                <div className="w-full h-8 flex items-center px-3 
                    bg-blue-500/80 
                    dark:bg-blue-900/80 
                    rounded-md">
                  <div className="w-2 h-2 rounded-full 
                      bg-blue-300 
                      dark:bg-blue-400 
                      mr-2"></div>
                  <span className="text-sm text-white">实战钉子户</span>
                </div>
                
                {/* 绿色标签 */}
                <div className="w-full h-8 flex items-center px-3 
                    bg-green-500/80 
                    dark:bg-green-900/80 
                    rounded-md">
                  <div className="w-2 h-2 rounded-full 
                      bg-green-300 
                      dark:bg-green-400 
                      mr-2"></div>
                  <span className="text-sm text-white">反内卷战士</span>
                </div>
              </div>
            </div>
            
            {/* 半透明覆盖层 - 悬停时显示 */}
            <div className="absolute inset-0 
                bg-indigo-900/30 
                dark:bg-black/40 
                opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] z-[5]"></div>
          </div>

          {/* 技能矩阵 - 三列交互设计 */}
          <motion.div 
            className="w-full max-w-5xl mx-auto mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            {/* 互动提示 */}
            <div className="text-center mb-4 text-sm text-foreground font-medium">
              技能矩阵
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 w-full">
              {/* 修行武器卡片 - 始终显示内容 */}
              <div className="bg-white/95 dark:bg-background/95 rounded-xl border border-purple-300 shadow-md overflow-hidden flex-1">
                <div className="p-4 flex flex-col h-full">
                  <h3 className="text-purple-700 dark:text-purple-400 font-mono text-lg border-b border-purple-200 dark:border-purple-800 pb-2 mb-3">修行武器</h3>
                  
                  {/* 静态经脉图 */}
                  <div className="flex justify-center mb-4">
                    <svg width="160" height="90" viewBox="0 0 160 90">
                      <path 
                        d="M 80,10 C 30,25 30,45 80,60 C 130,75 130,75 80,80"
                        fill="none" 
                        stroke="#8b5cf6"
                        strokeWidth="1.5"
                        strokeDasharray="3 2"
                      />
                      
                      <path 
                        d="M 20,45 C 40,30 120,30 140,45"
                        fill="none" 
                        stroke="#8b5cf6"
                        strokeWidth="1.5"
                        strokeDasharray="3 2"
                      />
                      
                      {/* 技能节点 */}
                      <circle cx="80" cy="12" r="4" fill="#a855f7" />
                      <circle cx="25" cy="45" r="4" fill="#a855f7" />
                      <circle cx="80" cy="75" r="4" fill="#a855f7" />
                      <circle cx="135" cy="45" r="4" fill="#a855f7" />
                      
                      {/* 中心区域 */}
                      <circle cx="80" cy="45" r="15" fill="none" stroke="#a855f7" strokeWidth="1" strokeDasharray="3 2" />
                      <circle cx="80" cy="45" r="8" fill="#a855f7" fillOpacity="0.2" />
                      
                      {/* 技能标签 */}
                      <text x="80" y="7" textAnchor="middle" fill="#8b5cf6" fontSize="9" className="font-mono">前端精通</text>
                      <text x="20" y="38" textAnchor="start" fill="#8b5cf6" fontSize="9" className="font-mono">工程化</text>
                      <text x="80" y="85" textAnchor="middle" fill="#8b5cf6" fontSize="9" className="font-mono">架构设计</text>
                      <text x="140" y="38" textAnchor="end" fill="#8b5cf6" fontSize="9" className="font-mono">性能优化</text>
                    </svg>
                  </div>
                  
                  {/* 技能进度条 */}
                  <div className="space-y-3 mt-2">
                    <div className="w-full">
                      <div className="flex justify-between text-sm font-mono items-center">
                        <span className="text-gray-700 dark:text-white/90">心法修炼</span>
                        <span className="text-purple-700 dark:text-purple-400">精通</span>
                      </div>
                      <div className="w-full h-1.5 bg-purple-100 dark:bg-purple-900/20 rounded-full overflow-hidden mt-1">
                        <div className="h-full bg-purple-500 w-[90%]" />
                      </div>
                    </div>
                    
                    <div className="w-full">
                      <div className="flex justify-between text-sm font-mono items-center">
                        <span className="text-gray-700 dark:text-white/90">剑法锻造</span>
                        <span className="text-purple-700 dark:text-purple-400">纯熟</span>
                      </div>
                      <div className="w-full h-1.5 bg-purple-100 dark:bg-purple-900/20 rounded-full overflow-hidden mt-1">
                        <div className="h-full bg-purple-500 w-[85%]" />
                      </div>
                    </div>
                    
                    <div className="w-full">
                      <div className="flex justify-between text-sm font-mono items-center">
                        <span className="text-gray-700 dark:text-white/90">器械掌握</span>
                        <span className="text-purple-700 dark:text-purple-400">熟练</span>
                      </div>
                      <div className="w-full h-1.5 bg-purple-100 dark:bg-purple-900/20 rounded-full overflow-hidden mt-1">
                        <div className="h-full bg-purple-500 w-[80%]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 修行哲学卡片 - 始终显示内容 */}
              <div className="bg-white/95 dark:bg-background/95 rounded-xl border border-indigo-300 shadow-md overflow-hidden flex-1">
                <div className="p-4 flex flex-col h-full">
                  <h3 className="text-indigo-700 dark:text-indigo-400 font-mono text-lg border-b border-indigo-200 dark:border-indigo-800 pb-2 mb-3">修行哲学</h3>
                  
                  {/* 静态太极图 */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative">
                      <svg width="60" height="60" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="48" stroke="#4f46e5" strokeWidth="1.5" fill="none" />
                        
                        {/* 简化的太极图案 */}
                        <path 
                          d="M 50,2 A 48,48 0 0 1 50,98 A 24,24 0 0 0 50,50 A 24,24 0 0 1 50,2 Z" 
                          fill="#312e81" fillOpacity="0.2"
                        />
                        <path 
                          d="M 50,2 A 48,48 0 0 0 50,98 A 24,24 0 0 1 50,50 A 24,24 0 0 0 50,2 Z" 
                          fill="#e0e7ff" fillOpacity="0.5"
                        />
                        
                        {/* 阴阳鱼眼 */}
                        <circle cx="50" cy="26" r="4" fill="#4f46e5" />
                        <circle cx="50" cy="74" r="4" fill="#e0e7ff" />
                      </svg>
                    </div>
                    
                    <div className="flex-1">
                      <div className="text-indigo-700 dark:text-indigo-400 font-mono font-semibold text-sm mb-1">苦修原则</div>
                      <p className="text-sm text-gray-700 dark:text-white/80">
                        <span className="text-indigo-700 dark:text-indigo-400 font-semibold">极致</span> 追求千锤百炼
                      </p>
                      <p className="text-xs text-gray-600 dark:text-white/60 mt-1 italic">
                        宁可十年磨一剑，不为一日走捷径
                      </p>
                    </div>
                  </div>
                  
                  {/* 三原则 - 简化设计 */}
                  <div className="grid grid-cols-3 gap-3 mt-3">
                    {[
                      { label: "精益求精", symbol: "精" },
                      { label: "简约至上", symbol: "简" },
                      { label: "持之以恒", symbol: "恒" }
                    ].map((item, index) => (
                      <div 
                        key={index}
                        className="flex flex-col items-center"
                      >
                        <div className="w-10 h-10 mb-1 flex items-center justify-center bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-700 rounded">
                          <span className="text-lg font-bold text-indigo-700 dark:text-indigo-400">
                            {item.symbol}
                          </span>
                        </div>
                        <span className="text-xs font-mono text-gray-700 dark:text-white/90">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 隐世绝技卡片 - 始终显示内容 */}
              <div className="bg-white/95 dark:bg-background/95 rounded-xl border border-blue-300 shadow-md overflow-hidden flex-1">
                <div className="p-4 flex flex-col h-full">
                  <h3 className="text-blue-700 dark:text-blue-400 font-mono text-lg border-b border-blue-200 dark:border-blue-800 pb-2 mb-3">隐世绝技</h3>
                  
                  {/* 简化八卦图 */}
                  <div className="flex justify-center mb-3">
                    <svg width="120" height="120" viewBox="0 0 200 200">
                      {/* 外圈 */}
                      <circle cx="100" cy="100" r="90" fill="none" stroke="#3b82f6" strokeWidth="1" strokeDasharray="4 2" />
                      
                      {/* 内圈 */}
                      <circle cx="100" cy="100" r="25" fill="#3b82f6" fillOpacity="0.1" stroke="#3b82f6" strokeWidth="1" />
                      
                      {/* 中央图标 */}
                      <text x="100" y="108" textAnchor="middle" fontSize="20" fill="#3b82f6">🧘</text>
                      
                      {/* 简化的八卦线 */}
                      <line x1="10" y1="100" x2="190" y2="100" stroke="#3b82f6" strokeWidth="0.8" />
                      <line x1="100" y1="10" x2="100" y2="190" stroke="#3b82f6" strokeWidth="0.8" />
                      <line x1="29" y1="29" x2="171" y2="171" stroke="#3b82f6" strokeWidth="0.8" />
                      <line x1="29" y1="171" x2="171" y2="29" stroke="#3b82f6" strokeWidth="0.8" />
                      
                      {/* 八个技能点 - 静态设计 */}
                      {[
                        { icon: "⚡", label: "调试顿悟", angle: 0 },
                        { icon: "🔮", label: "源码参透", angle: 45 },
                        { icon: "📜", label: "经典传承", angle: 90 },
                        { icon: "🧠", label: "思维修炼", angle: 135 },
                        { icon: "🛡️", label: "错误免疫", angle: 180 },
                        { icon: "⚙️", label: "工具炼成", angle: 225 },
                        { icon: "🌪️", label: "重构秘法", angle: 270 },
                        { icon: "🔍", label: "追根溯源", angle: 315 }
                      ].map((item, index) => {
                        const angleRad = item.angle * Math.PI / 180;
                        const distance = 65;
                        const x = 100 + distance * Math.cos(angleRad);
                        const y = 100 + distance * Math.sin(angleRad);
                        
                        return (
                          <g key={index}>
                            <circle 
                              cx={x} cy={y} r="10" 
                              fill="#bfdbfe"
                              stroke="#3b82f6" 
                              strokeWidth="0.8" 
                            />
                            
                            <text 
                              x={x} y={y} 
                              dominantBaseline="middle"
                              textAnchor="middle"
                              fontSize="8"
                            >
                              {item.icon}
                            </text>
                            
                            <text 
                              x={x} y={y + 16} 
                              dominantBaseline="middle"
                              textAnchor="middle"
                              fontSize="5"
                              fill="#3b82f6"
                            >
                              {item.label}
                            </text>
                          </g>
                        );
                      })}
                    </svg>
                  </div>
                  
                  <div className="mt-auto bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-xs font-mono text-center text-gray-700 dark:text-white/80">
                      得<span className="text-blue-700 dark:text-blue-400">武林秘籍</span>，渡重重险阻，遇明师点拨，终成一代宗师
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 发展路线 */}
          <motion.div
            className="mt-16 w-full"
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
    </ContainerScroll>
  )
})

AboutSectionParallax.displayName = "AboutSectionParallax"

export default AboutSectionParallax 
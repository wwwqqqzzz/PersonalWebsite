"use client"

import { forwardRef, useEffect, useState, useRef } from "react"
import { motion, useTransform, useMotionValue, useSpring, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { useMousePosition } from "@/hooks/use-mouse-position"
import { X } from "lucide-react"

// 定义技能详情接口
interface SkillDetail {
  id: string
  name: string
  level: number
  description: string
  keyPoints: string[]
  icon: string
}

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
  
  // 添加卡片翻转状态
  const [isFlipped, setIsFlipped] = useState(false)
  const toggleFlip = () => setIsFlipped(!isFlipped)
  
  // 添加技能弹窗状态
  const [activeSkill, setActiveSkill] = useState<SkillDetail | null>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  
  // 创建 MotionValue 实例，为了更平滑的动画，这里使用useSpring
  const mouseX = useSpring(0, { stiffness: 400, damping: 28 }) // 弹簧动画配置
  const mouseY = useSpring(0, { stiffness: 400, damping: 28 })
  
  // 提前声明所有的 transform 函数，避免在条件渲染中使用 hooks
  const mouseXTransform = useTransform(
    mouseX, 
    [0, typeof window !== 'undefined' ? window.innerWidth : 1000], 
    [-8, 8], 
    { clamp: true }
  )
  const mouseYTransform = useTransform(
    mouseY, 
    [0, typeof window !== 'undefined' ? window.innerHeight : 800], 
    [-8, 8], 
    { clamp: true }
  )
  
  // 监听鼠标位置的变化并直接更新spring值，这样更高效
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    // 当鼠标位置变化时更新spring值
    if (mouse.x !== null) mouseX.set(mouse.x)
    if (mouse.y !== null) mouseY.set(mouse.y)
    
  }, [mouse.x, mouse.y, mouseX, mouseY])

  // 点击外部关闭弹窗
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setActiveSkill(null)
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // 技能数据定义
  const skillsData: SkillDetail[] = [
    {
      id: "heart-method",
      name: "心法修炼",
      level: 90,
      description: "专注于深入理解前端核心技术，精通各种设计模式与最佳实践",
      keyPoints: [
        "精通现代化前端框架如React、Vue等",
        "深入理解JavaScript引擎工作原理",
        "掌握性能优化与调试技巧",
        "能够设计可扩展的前端架构"
      ],
      icon: "💫"
    },
    {
      id: "sword-forge",
      name: "剑法锻造",
      level: 85,
      description: "精通工程化构建流程，能够打造高性能、可维护的代码库",
      keyPoints: [
        "熟练使用Webpack、Vite等构建工具",
        "精通Git工作流与团队协作流程",
        "掌握自动化测试与CI/CD流程",
        "能够设计模块化、可扩展的代码结构"
      ],
      icon: "⚔️"
    },
    {
      id: "equipment",
      name: "器械掌握",
      level: 80,
      description: "精通各类前端工具与技术栈，能够快速适应不同项目需求",
      keyPoints: [
        "熟练使用TypeScript进行类型安全开发",
        "掌握CSS预处理器与现代化样式解决方案",
        "精通状态管理工具如Redux、Vuex等",
        "能够集成各类第三方服务与API"
      ],
      icon: "🔧"
    },
    {
      id: "absolute-focus",
      name: "极致专注",
      level: 95,
      description: "能够深度沉浸在复杂问题中，持续优化解决方案直至完美",
      keyPoints: [
        "擅长解决复杂技术难题与边界情况",
        "注重代码质量与用户体验细节",
        "能够持续优化性能与可访问性",
        "追求卓越的工程实践标准"
      ],
      icon: "🧠"
    },
    {
      id: "debugging",
      name: "调试顿悟",
      level: 88,
      description: "具备敏锐的问题定位能力，能快速找出并修复复杂bug",
      keyPoints: [
        "精通各类调试工具与技术",
        "擅长分析性能瓶颈与内存泄漏",
        "能够处理复杂的跨浏览器兼容性问题",
        "具备系统性思维解决根本问题"
      ],
      icon: "⚡"
    },
    {
      id: "source-code",
      name: "源码参透",
      level: 85,
      description: "深入研究主流框架源码，理解底层实现原理",
      keyPoints: [
        "精通React、Vue等框架内部机制",
        "了解浏览器渲染引擎工作原理",
        "能够分析并优化第三方库性能",
        "具备贡献开源项目的能力"
      ],
      icon: "🔮"
    }
  ]
  
  // 处理技能点击事件
  const handleSkillClick = (skill: SkillDetail) => {
    setActiveSkill(skill)
  }
  
  // 检测是否为移动设备
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <motion.div
      ref={ref}
      id="about"
      className="min-h-screen flex items-center justify-center relative overflow-hidden py-20 md:py-32 bg-grid-[#ffffff08]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {/* 背景网格效果 */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]" />
      </div>
      
      {/* 内容区域 - 移动端时设置固定高度和可滚动 */}
      <div className="container mx-auto px-4 relative z-10">
        <div className={`max-w-4xl mx-auto text-center space-y-16 pb-8 ${isMobile ? 'h-[70vh] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent' : ''}`}>
          {/* 移动端滚动提示 */}
          {isMobile && (
            <motion.div 
              className="absolute top-0 right-4 text-xs text-primary/70 font-mono bg-background/50 px-2 py-1 rounded-b-md shadow-sm backdrop-blur-sm"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              向下滚动查看更多
            </motion.div>
          )}
          
          <div className="flex flex-col items-center space-y-12 pt-4">
            {/* 标题 */}
            <motion.h2
              className={`${isMobile ? 'text-4xl' : 'text-5xl md:text-6xl'} font-mono font-bold text-foreground relative inline-block`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "circOut" }}
            >
              <span className="relative">
                技术苦行僧
                <div className="absolute -bottom-2 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-foreground/50 to-transparent" />
              </span>
            </motion.h2>

            {/* 技术苦行僧身份卡片 - 视差动画效果 */}
            <div className={`${isMobile ? 'w-[180px] h-[220px]' : 'w-[200px] h-[250px]'} rounded-xl overflow-hidden shadow-xl relative group transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] hover:scale-105 hover:-rotate-1`}>
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
              <div className={`mt-6 mx-auto ${isMobile ? 'w-24 h-24' : 'w-28 h-28'} relative flex items-center justify-center z-10 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-80 group-hover:blur-[3px] group-hover:-translate-y-3`}>
                <div className="absolute inset-0 rounded-full 
                    bg-gradient-to-r from-indigo-500/40 to-purple-500/40 
                    dark:bg-gradient-to-r dark:from-purple-500/30 dark:to-blue-500/30
                    blur-md"></div>
                <Image
                  src="/avatar/技术苦行僧.png"
                  alt="技术苦行僧照片"
                  width={isMobile ? 100 : 120}
                  height={isMobile ? 100 : 120}
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
          </div>

          {/* 技能矩阵 - 适配手机端的设计 */}
          <motion.div 
            className="w-full max-w-5xl mx-auto mt-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            {/* 互动提示 */}
            <div className="text-center mb-4 text-sm text-foreground font-medium">
              技能矩阵
            </div>
            
            <div className={`flex ${isMobile ? 'flex-col' : 'flex-col md:flex-row'} gap-4 w-full`}>
              {/* 修行武器卡片 - 移动端样式优化 */}
              <div className={`bg-white/95 dark:bg-background/95 rounded-xl border border-purple-300 shadow-md overflow-hidden flex-1 ${isMobile ? 'p-3' : 'p-4'}`}>
                <div className="flex flex-col h-full">
                  <h3 className="text-purple-700 dark:text-purple-400 font-mono text-lg border-b border-purple-200 dark:border-purple-800 pb-2 mb-3">修行武器</h3>
                  
                  {/* 静态经脉图 - 移动端缩小 */}
                  <div className="flex justify-center mb-4">
                    <svg width={isMobile ? "140" : "160"} height={isMobile ? "80" : "90"} viewBox="0 0 160 90">
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
                  
                  {/* 技能进度条 - 改为可点击 */}
                  <div className="space-y-3 mt-2">
                    <div className="w-full">
                      <div 
                        className="flex justify-between text-sm font-mono items-center cursor-pointer hover:bg-purple-50 dark:hover:bg-purple-900/20 p-1 rounded-md transition-colors"
                        onClick={() => handleSkillClick(skillsData[0])}  
                      >
                        <span className="text-gray-700 dark:text-white/90">心法修炼</span>
                        <span className="text-purple-700 dark:text-purple-400">精通</span>
                      </div>
                      <div className="w-full h-1.5 bg-purple-100 dark:bg-purple-900/20 rounded-full overflow-hidden mt-1 cursor-pointer" onClick={() => handleSkillClick(skillsData[0])}>
                        <div className="h-full bg-purple-500 w-[90%]" />
                      </div>
                    </div>
                    
                    <div className="w-full">
                      <div 
                        className="flex justify-between text-sm font-mono items-center cursor-pointer hover:bg-purple-50 dark:hover:bg-purple-900/20 p-1 rounded-md transition-colors"
                        onClick={() => handleSkillClick(skillsData[1])}
                      >
                        <span className="text-gray-700 dark:text-white/90">剑法锻造</span>
                        <span className="text-purple-700 dark:text-purple-400">纯熟</span>
                      </div>
                      <div className="w-full h-1.5 bg-purple-100 dark:bg-purple-900/20 rounded-full overflow-hidden mt-1 cursor-pointer" onClick={() => handleSkillClick(skillsData[1])}>
                        <div className="h-full bg-purple-500 w-[85%]" />
                      </div>
                    </div>
                    
                    <div className="w-full">
                      <div 
                        className="flex justify-between text-sm font-mono items-center cursor-pointer hover:bg-purple-50 dark:hover:bg-purple-900/20 p-1 rounded-md transition-colors"
                        onClick={() => handleSkillClick(skillsData[2])}
                      >
                        <span className="text-gray-700 dark:text-white/90">器械掌握</span>
                        <span className="text-purple-700 dark:text-purple-400">熟练</span>
                      </div>
                      <div className="w-full h-1.5 bg-purple-100 dark:bg-purple-900/20 rounded-full overflow-hidden mt-1 cursor-pointer" onClick={() => handleSkillClick(skillsData[2])}>
                        <div className="h-full bg-purple-500 w-[80%]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 修行哲学卡片 */}
              <div className={`bg-white/95 dark:bg-background/95 rounded-xl border border-indigo-300 shadow-md overflow-hidden flex-1 ${isMobile ? 'p-3' : 'p-4'}`}>
                <div className="flex flex-col h-full">
                  <h3 className="text-indigo-700 dark:text-indigo-400 font-mono text-lg border-b border-indigo-200 dark:border-indigo-800 pb-2 mb-3">修行哲学</h3>
                  
                  {/* 静态太极图 */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative">
                      <svg width={isMobile ? "50" : "60"} height={isMobile ? "50" : "60"} viewBox="0 0 100 100">
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
                        <div className={`${isMobile ? 'w-8 h-8' : 'w-10 h-10'} mb-1 flex items-center justify-center bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-700 rounded`}>
                          <span className={`${isMobile ? 'text-base' : 'text-lg'} font-bold text-indigo-700 dark:text-indigo-400`}>
                            {item.symbol}
                          </span>
                        </div>
                        <span className="text-xs font-mono text-gray-700 dark:text-white/90">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 隐世绝技卡片 */}
              <div className={`bg-white/95 dark:bg-background/95 rounded-xl border border-blue-300 shadow-md overflow-hidden flex-1 ${isMobile ? 'p-3' : 'p-4'}`}>
                <div className="flex flex-col h-full">
                  <h3 className="text-blue-700 dark:text-blue-400 font-mono text-lg border-b border-blue-200 dark:border-blue-800 pb-2 mb-3">隐世绝技</h3>
                  
                  {/* 简化八卦图 - 移动端缩小 */}
                  <div className="flex justify-center mb-3">
                    <svg width={isMobile ? "140" : "160"} height={isMobile ? "140" : "160"} viewBox="0 0 200 200">
                      {/* SVG内容保持不变 */}
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
                      
                      {/* 八个技能点 - 静态设计 改为可点击 */}
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
                          <g 
                            key={index}
                            onClick={() => handleSkillClick(skillsData[index + 3 > 5 ? 5 : index + 3])}
                            style={{ cursor: 'pointer' }}
                            className="hover:opacity-80 transition-opacity"
                          >
                            <circle 
                              cx={x} cy={y} r="12" 
                              fill="#bfdbfe"
                              stroke="#3b82f6" 
                              strokeWidth="0.8" 
                            />
                            
                            <text 
                              x={x} y={y} 
                              dominantBaseline="middle"
                              textAnchor="middle"
                              fontSize="9"
                            >
                              {item.icon}
                            </text>
                            
                            <text 
                              x={x} y={y + 16} 
                              dominantBaseline="middle"
                              textAnchor="middle"
                              fontSize="6"
                              fill="#3b82f6"
                            >
                              {item.label}
                            </text>
                          </g>
                        );
                      })}
                    </svg>
            </div>
            
                  <div className={`mt-auto bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg border border-blue-200 dark:border-blue-800 ${isMobile ? 'text-xs' : ''}`}>
                    <p className="text-xs font-mono text-center text-gray-700 dark:text-white/80">
                      得<span className="text-blue-700 dark:text-blue-400">武林秘籍</span>，渡重重险阻，遇明师点拨，终成一代宗师
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 发展路线 - 移动端优化 */}
          <motion.div
            className={`${isMobile ? 'mt-8' : 'mt-48'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <div className="relative h-[2px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent rounded-full overflow-visible">
              <div className="absolute -left-4 top-1/2 -translate-y-1/2">
                <span className="text-foreground/50 text-lg">...</span>
              </div>

              {/* 路线点优化 */}
              {isMobile ? (
                <div className="flex justify-between py-8">
                  {[
                    { name: "代码鬣狗", position: "top" },
                    { name: "外包豺狼", position: "bottom" },
                    { name: "技术秃鹫", position: "top" },
                    { name: "赛博巫妖", position: "bottom" }
                  ].map((item, index) => (
                    <div 
                      key={index} 
                      className={`relative text-xs font-mono ${item.position === 'top' ? '-translate-y-6' : 'translate-y-6'}`}
                    >
                      <div className={`absolute ${item.position === 'top' ? '-bottom-4' : '-top-4'} left-1/2 -translate-x-1/2 w-[1px] h-3 bg-primary/30`} />
                      <div className={`absolute ${item.position === 'top' ? '-bottom-2' : '-top-2'} left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-primary/50 rounded-full`} />
                      <span className="text-foreground/70">{item.name}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <>
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
                </>
              )}

              <div className="absolute -right-4 top-1/2 -translate-y-1/2">
                <span className="text-foreground/50 text-lg">...</span>
              </div>

              {/* 当前进度标记 */}
              <motion.div 
                className={`absolute ${isMobile ? 'left-[26%]' : 'left-[26.5%]'} top-1/2 -translate-y-1/2`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.2, type: "spring" }}
              >
                <div className="relative">
                  <div className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} rounded-full bg-primary/30 animate-ping absolute inset-0`} />
                  <div className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} rounded-full bg-primary relative`} />
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* 技能详情弹窗 */}
      <AnimatePresence>
        {activeSkill && (
          <>
            {/* 半透明遮罩 */}
            <motion.div
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveSkill(null)}
            />
            
            {/* 弹窗内容 */}
        <motion.div
              ref={modalRef}
              className={`fixed ${isMobile ? 'w-[90%] max-w-[350px]' : 'w-[400px]'} max-h-[80vh] overflow-y-auto z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", bounce: 0.25 }}
            >
              {/* 弹窗头部 */}
              <div className="relative p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 flex items-center justify-center bg-primary/10 rounded-full">
                    <span className="text-xl">{activeSkill.icon}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{activeSkill.name}</h3>
                    <div className="flex items-center gap-2">
                      <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${activeSkill.level}%` }} 
        />
      </div>
                      <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
                        {activeSkill.level}%
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* 关闭按钮 */}
                <button 
                  className="absolute top-4 right-4 w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  onClick={() => setActiveSkill(null)}
                >
                  <X size={14} className="text-gray-500 dark:text-gray-400" />
                </button>
              </div>
              
              {/* 弹窗内容 */}
              <div className="p-4 space-y-4">
                {/* 技能描述 */}
                <div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    {activeSkill.description}
                  </p>
                </div>
                
                {/* 主要技能点 */}
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200">核心能力</h4>
                  <ul className="space-y-2">
                    {activeSkill.keyPoints.map((point, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-primary mt-0.5">•</span>
                        <span className="text-sm text-gray-700 dark:text-gray-300">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* 底部装饰性元素 */}
                <div className="pt-2 mt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center">
                    <div className="text-xs text-gray-500 dark:text-gray-400 font-mono">技能.ID: {activeSkill.id}</div>
                    <div className="text-xs text-primary/70 font-mono">
                      点击空白区域关闭
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  )
})

AboutSection.displayName = "AboutSection"

export default AboutSection


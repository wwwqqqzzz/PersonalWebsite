"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sun, Moon, Menu } from "lucide-react"
import { useTheme } from "next-themes"

interface NavigationProps {
  activeSection: string
  scrollToSection: (sectionId: string) => void
}

export default function Navigation({ activeSection, scrollToSection }: NavigationProps) {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const [isExpanded, setIsExpanded] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isMobile, setIsMobile] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout>()
  const navRef = useRef<HTMLDivElement>(null)

  // 检测设备类型并设置移动设备布局
  useEffect(() => {
    const checkDeviceSize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkDeviceSize()
    window.addEventListener('resize', checkDeviceSize)
    return () => window.removeEventListener('resize', checkDeviceSize)
  }, [])

  useEffect(() => {
    setMounted(true)
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // 处理点击外部区域关闭菜单
  useEffect(() => {
    if (!isExpanded) return

    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setIsExpanded(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isExpanded])

  const handleTouchInteraction = () => {
    setIsExpanded(!isExpanded)
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }

  const handleMouseEnter = () => {
    if (isMobile) return // 移动设备不使用鼠标悬停
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsExpanded(true)
  }

  const handleMouseLeave = () => {
    if (isMobile) return // 移动设备不使用鼠标悬停
    timeoutRef.current = setTimeout(() => {
      setIsExpanded(false)
    }, 1000)
  }

  const handleNavButtonClick = (id: string) => {
    scrollToSection(id)
    setIsExpanded(false)
  }

  if (!mounted) return null

  const navigationItems = [
    { id: "home", label: "首页" },
    { id: "about", label: "关于" },
    { id: "projects", label: "项目" },
    { id: "skills", label: "技能" },
    { id: "blog", label: "博客" },
    { id: "contact", label: "联系" },
  ]

  return (
    <div 
      ref={navRef}
      className="fixed top-2 md:top-4 left-1/2 -translate-x-1/2 z-50"
      onMouseEnter={isMobile ? undefined : handleMouseEnter}
      onMouseLeave={isMobile ? undefined : handleMouseLeave}
    >
      {/* 主灵动岛 */}
      <motion.div
        className="relative bg-background/80 backdrop-blur-lg rounded-full border border-border shadow-lg overflow-hidden cursor-pointer"
        animate={{
          width: isExpanded 
            ? (isMobile ? Math.min(320, window.innerWidth - 32) : 720) 
            : (isMobile ? 180 : 280),
          height: isMobile ? 40 : 48,
          borderRadius: 9999,
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 30,
        }}
        onClick={isMobile ? handleTouchInteraction : undefined}
      >
        <div className="h-full px-3 md:px-4 flex items-center gap-2 md:gap-4">
          <div className="flex items-center gap-2 min-w-[70px] md:min-w-[100px]">
            <motion.div
              className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-primary"
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <span className="text-xs md:text-sm font-medium whitespace-nowrap">
              {isMobile 
                ? currentTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
                : currentTime.toLocaleTimeString()
              }
            </span>
          </div>
          
          {/* 在未展开状态下显示菜单文字提示(移动端) */}
          {!isExpanded && isMobile && (
            <span className="text-xs font-medium text-foreground/70 mx-auto">点击展开菜单</span>
          )}

          {/* PC端菜单 */}
          {!isMobile && (
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  {navigationItems.map(({ id, label }) => (
                    <motion.button
                      key={id}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        activeSection === id
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-primary/5 text-foreground/60 hover:text-foreground"
                      }`}
                      onClick={() => handleNavButtonClick(id)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {label}
                    </motion.button>
                  ))}

                  <div className="h-4 w-[1px] bg-border mx-2" />
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-1.5 rounded-lg bg-primary/10 text-primary"
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  >
                    {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          )}

          <motion.div
            className="w-6 h-6 flex items-center justify-center ml-auto"
            animate={{ rotate: isExpanded ? 180 : 0 }}
          >
            <Menu size={isMobile ? 16 : 14} />
          </motion.div>
        </div>
      </motion.div>

      {/* 移动端下拉菜单 - 单独处理以确保正确显示 */}
      {isMobile && (
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 mt-2 z-50 bg-background/95 backdrop-blur-lg p-3 rounded-xl border border-border shadow-lg"
            >
              <div className="grid grid-cols-2 gap-2">
                {navigationItems.map(({ id, label }) => (
                  <motion.button
                    key={id}
                    className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      activeSection === id
                        ? "bg-primary/20 text-primary"
                        : "bg-background/70 text-foreground/80 hover:bg-primary/5 hover:text-foreground active:bg-primary/10"
                    }`}
                    onClick={() => handleNavButtonClick(id)}
                    whileTap={{ scale: 0.95 }}
                  >
                    {label}
                  </motion.button>
                ))}
              </div>
              
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="mt-2 p-2.5 rounded-lg bg-primary/10 text-primary w-full flex items-center justify-center gap-2"
                onClick={() => {
                  setTheme(theme === "dark" ? "light" : "dark")
                  setIsExpanded(false)
                }}
              >
                {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
                <span className="text-sm">{theme === "dark" ? "切换亮色模式" : "切换深色模式"}</span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  )
} 
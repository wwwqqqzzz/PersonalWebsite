"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sun, Moon, Menu, X } from "lucide-react"
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
  const timeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    setMounted(true)
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsExpanded(true)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsExpanded(false)
    }, 1000)
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
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="relative bg-background/80 backdrop-blur-lg rounded-full border border-border shadow-lg overflow-hidden"
        animate={{
          width: isExpanded ? 720 : 280,
          height: 48,
          borderRadius: 9999,
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 30,
        }}
      >
        <div className="h-full px-4 flex items-center gap-4">
          <div className="flex items-center gap-2 min-w-[100px]">
            <motion.div
              className="w-2 h-2 rounded-full bg-primary"
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <span className="text-sm font-medium">
              {currentTime.toLocaleTimeString()}
            </span>
          </div>
          
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
                    onClick={() => {
                      scrollToSection(id)
                      setIsExpanded(false)
                    }}
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

          <motion.div
            className="w-6 h-6 flex items-center justify-center ml-auto"
            animate={{ rotate: isExpanded ? 180 : 0 }}
          >
            <Menu size={16} />
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
} 
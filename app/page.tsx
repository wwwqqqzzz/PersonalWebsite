"use client"

import React, { useEffect, useRef, useState } from "react"
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion"
import Navigation from "@/components/navigation/index"
import ProjectsSketch from "@/components/sections/projects-sketch"
import SkillsShowcase from "@/components/sections/skills-showcase"
import BlogSection from "@/components/sections/blog-section"
import ChatContact from "@/components/sections/chat-contact"
import Footer from "@/components/sections/footer"
import { useTheme } from "next-themes"
import { HeroScrollDemo } from "@/components/blocks/hero-scroll-demo"
import { ScrollEffectDemo } from "@/components/blocks/scroll-effect-demo"
import Link from "next/link"
import { Palette } from "lucide-react"

export default function Portfolio() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("home")
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  const containerRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const aboutRef = useRef<HTMLDivElement>(null)
  const projectsRef = useRef<HTMLDivElement>(null)
  const skillsRef = useRef<HTMLDivElement>(null)
  const blogRef = useRef<HTMLDivElement>(null)
  const contactRef = useRef<HTMLDivElement>(null)

  const cursorRef = useRef(null)
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)
  const springConfig = { damping: 25, stiffness: 700 }
  const cursorXSpring = useSpring(cursorX, springConfig)
  const cursorYSpring = useSpring(cursorY, springConfig)

  // Theme setup
  useEffect(() => {
    setMounted(true)
  }, [])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  // Scroll tracking for active section
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight * 0.3
      const sections = [
        { id: "home", ref: heroRef as React.RefObject<HTMLElement> },
        { id: "about", ref: aboutRef as React.RefObject<HTMLElement> },
        { id: "projects", ref: projectsRef as React.RefObject<HTMLElement> },
        { id: "skills", ref: skillsRef as React.RefObject<HTMLElement> },
        { id: "blog", ref: blogRef as React.RefObject<HTMLElement> },
        { id: "contact", ref: contactRef as React.RefObject<HTMLElement> },
      ]

      let currentSection = sections[0].id

      sections.forEach(({ id, ref }) => {
        const element = ref.current
        if (!element) return

        const rect = element.getBoundingClientRect()
        const elementTop = rect.top + window.scrollY

        if (scrollPosition >= elementTop) {
          currentSection = id
        }
      })

      setActiveSection(currentSection)
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll() // 初始化调用

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId)
    if (section) {
      // 移除平滑滚动效果
      window.scrollTo({
        top: section.offsetTop - 80,
      })
    }
    setMenuOpen(false)
  }

  // Mouse follower effect
  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 16)
      cursorY.set(e.clientY - 16)
    }

    window.addEventListener("mousemove", moveCursor)
    return () => window.removeEventListener("mousemove", moveCursor)
  }, [cursorX, cursorY])

  // 移除全局平滑滚动效果
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.style.scrollBehavior = 'auto';
    }
  }, []);

  if (!mounted) return null

  return (
    <div ref={containerRef} className="relative bg-background text-foreground overflow-hidden">
      {/* 滚动进度条 */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-red-500/30 origin-left z-50"
        style={{ scaleX: scrollYProgress }}
      />

      {/* Custom cursor */}
      <motion.div
        ref={cursorRef}
        className="fixed w-8 h-8 rounded-full border-2 border-primary pointer-events-none z-50 hidden md:block mix-blend-difference"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
        }}
      />

      {/* Navigation */}
      <Navigation activeSection={activeSection} scrollToSection={scrollToSection} />

      {/* 首页和About部分 - 实现视差效果 */}
      <div className="relative">
        {/* 首页 - 固定位置作为背景 */}
        <div id="home" ref={heroRef} className="fixed top-0 left-0 w-full h-screen z-0">
          <ScrollEffectDemo />
        </div>

        {/* 内容容器 - 首页之上的内容 */}
        <div className="relative z-10">
          {/* 空白区域确保首页内容完全显示 */}
          <div className="h-screen"></div>
          
          {/* About部分 - 从底部滑入覆盖首页 */}
          <div 
            id="about" 
            ref={aboutRef}
            className="bg-background rounded-t-[30px] shadow-xl overflow-hidden"
          >
            <HeroScrollDemo />
          </div>
          
          {/* 其他正常布局的部分 */}
          <div className="bg-background">
            {/* Projects部分 */}
            <div id="projects" ref={projectsRef} className="py-0">
              <ProjectsSketch />
            </div>
            
            {/* Skills部分 */}
            <div id="skills" ref={skillsRef} className="max-w-7xl mx-auto py-16 px-6">
              <SkillsShowcase />
            </div>
            
            {/* Blog部分 */}
            <div id="blog" ref={blogRef} className="max-w-7xl mx-auto py-16 px-6">
              <BlogSection />
            </div>
            
            {/* Contact部分 */}
            <div id="contact" ref={contactRef} className="max-w-7xl mx-auto py-16 px-6">
              <ChatContact />
            </div>
            
            <div className="mt-16 px-6">
              <Footer />
              
              {/* 添加赛博朋克入口 */}
              <div className="mt-8 text-center">
                <Link href="/about-cyberpunk">
                  <motion.div 
                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 backdrop-blur-md rounded-full border border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/20 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="text-sm font-medium">查看赛博朋克风格</span>
                  </motion.div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// 全局样式
const gradientText = `
  @keyframes textShine {
    0% {
      background-position: 0% 50%;
    }
    100% {
      background-position: 100% 50%;
    }
  }
  .gradient-text {
    background: linear-gradient(to right, #667eea, #764ba2, #6B8DD6, #8E37D7);
    background-size: 200% auto;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: textShine 4s linear infinite;
  }
`

// 添加全局样式
if (typeof document !== 'undefined') {
  const style = document.createElement('style')
  style.textContent = gradientText
  document.head.appendChild(style)
}



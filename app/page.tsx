"use client"

import React, { useEffect, useRef, useState } from "react"
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion"
import Navigation from "@/components/navigation/index"
import ProjectsSection from "@/components/sections/projects-carousel"
import SkillsSection from "@/components/sections/terminal-skills"
import BlogSection from "@/components/sections/blog-section"
import ContactSection from "@/components/sections/chat-contact"
import Footer from "@/components/sections/footer"
import { useTheme } from "next-themes"
import { HeroScrollDemo } from "@/components/blocks/hero-scroll-demo"
import { ScrollEffectDemo } from "@/components/blocks/scroll-effect-demo"

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

      <div className="relative">
        {/* Hero部分 - 简化首页 */}
        <section id="home" ref={heroRef}>
          <ScrollEffectDemo />
        </section>

        {/* About部分 - 使用梯形到长方形的变形效果 */}
        <section id="about" ref={aboutRef} style={{ marginTop: "-20vh" }}>
          <HeroScrollDemo />
        </section>
      </div>

      {/* 其他部分 */}
      <div className="space-y-24 px-6 pb-24 mt-24">
        {/* Projects部分 */}
        <div id="projects" ref={projectsRef} className="max-w-7xl mx-auto rounded-3xl overflow-hidden border border-border/30 backdrop-blur-sm bg-background/20 shadow-xl">
          <div className="relative border-b border-border/10">
            {/* 顶部装饰栏 */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500/40 via-primary/30 to-purple-500/40"></div>
            <ProjectsSection />
          </div>
        </div>
        
        {/* Skills部分 */}
        <div id="skills" ref={skillsRef} className="max-w-7xl mx-auto rounded-3xl overflow-hidden border border-border/30 backdrop-blur-sm bg-background/20 shadow-xl">
          <div className="relative border-b border-border/10">
            {/* 顶部装饰栏 */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500/40 via-primary/30 to-blue-500/40"></div>
            <SkillsSection />
          </div>
        </div>
        
        {/* Blog部分 */}
        <div id="blog" ref={blogRef} className="max-w-7xl mx-auto rounded-3xl overflow-hidden border border-border/30 backdrop-blur-sm bg-background/20 shadow-xl">
          <div className="relative border-b border-border/10">
            {/* 顶部装饰栏 */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500/40 via-primary/30 to-pink-500/40"></div>
            <BlogSection />
          </div>
        </div>
        
        {/* Contact部分 */}
        <div id="contact" ref={contactRef} className="max-w-7xl mx-auto rounded-3xl overflow-hidden border border-border/30 backdrop-blur-sm bg-background/20 shadow-xl">
          <div className="relative border-b border-border/10">
            {/* 顶部装饰栏 */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500/40 via-primary/30 to-red-500/40"></div>
            <ContactSection />
          </div>
        </div>
      </div>
      
      <div className="mt-24 px-6">
        <Footer />
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



"use client"

import React, { useEffect, useRef, useState } from "react"
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion"
import { FileText, Github, Mail } from "lucide-react"
import { useTheme } from "next-themes"
import Navigation from "@/components/navigation/index"
import HeroSection from "@/components/sections/hero-section"
import AboutSection from "@/components/sections/about-section"
import ProjectsSection from "@/components/sections/projects-carousel"
import SkillsSection from "@/components/sections/terminal-skills"
import BlogSection from "@/components/sections/blog-section"
import ContactSection from "@/components/sections/chat-contact"

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
      const offset = section.offsetTop - 80 // 调整偏移量
      window.scrollTo({
        top: offset,
        behavior: "smooth",
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

  if (!mounted) return null

  return (
    <div ref={containerRef} className="relative bg-background text-foreground overflow-hidden">
      {/* 滚动进度条 */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-primary/30 origin-left z-50"
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

      {/* Main Content */}
      <HeroSection ref={heroRef} />
      <AboutSection ref={aboutRef} />
      <ProjectsSection ref={projectsRef} />
      <SkillsSection ref={skillsRef} />
      <BlogSection ref={blogRef} />
      <ContactSection ref={contactRef} />

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border text-center">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-foreground/50">© {new Date().getFullYear()} 王起哲设计工作室. 保留所有权利.</p>
            <div className="flex space-x-4">
              <motion.a
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                href="#"
                className="text-foreground/50 hover:text-primary transition-colors"
              >
                <Mail className="h-5 w-5" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                href="#"
                className="text-foreground/50 hover:text-primary transition-colors"
              >
                <Github className="h-5 w-5" />
              </motion.a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}



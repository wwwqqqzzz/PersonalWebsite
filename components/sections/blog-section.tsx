"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import Image from "next/image"

const blogPosts = [
  {
    id: 1,
    title: "设计系统如何提高团队效率",
    excerpt: "探讨设计系统如何帮助团队提高工作效率，保持设计一致性，并加速产品开发流程。",
    date: "2023-10-15",
    readTime: "5 分钟",
    image: "/placeholder.svg?height=400&width=600",
    tags: ["设计系统", "团队协作", "效率"],
  },
  {
    id: 2,
    title: "用户体验设计的未来趋势",
    excerpt: "分析当前UX设计领域的创新趋势，探讨AI、VR等新技术对用户体验的影响。",
    date: "2023-09-28",
    readTime: "7 分钟",
    image: "/placeholder.svg?height=400&width=600",
    tags: ["UX设计", "AI", "VR"],
  },
  {
    id: 3,
    title: "如何进行有效的用户研究",
    excerpt: "分享进行用户研究的实用技巧和方法，帮助设计师更好地理解用户需求。",
    date: "2023-09-10",
    readTime: "6 分钟",
    image: "/placeholder.svg?height=400&width=600",
    tags: ["用户研究", "设计方法论"],
  },
  {
    id: 4,
    title: "移动应用设计的最佳实践",
    excerpt: "总结移动应用设计的关键原则和最佳实践，帮助设计师创造出色的移动体验。",
    date: "2023-08-22",
    readTime: "8 分钟",
    image: "/placeholder.svg?height=400&width=600",
    tags: ["移动设计", "用户体验", "设计原则"],
  },
]

export default function BlogSection() {
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const containerRef = useRef(null)
  const [containerWidth, setContainerWidth] = useState(0)

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth)
      }
    }

    updateWidth()
    window.addEventListener("resize", updateWidth)
    return () => window.removeEventListener("resize", updateWidth)
  }, [])

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true, margin: "-100px" }}
      className="relative overflow-hidden"
    >
      <motion.div
        animate={{
          x: containerWidth > 0 ? [-containerWidth, 0] : 0,
        }}
        transition={{
          x: {
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "loop",
            duration: 20,
            ease: "linear",
          },
        }}
        className="flex gap-6"
      >
        {[...blogPosts, ...blogPosts].map((post, index) => (
          <motion.div
            key={`${post.id}-${index}`}
            className={cn(
              "flex-shrink-0 w-72 bg-card rounded-lg overflow-hidden shadow-lg transition-all duration-300",
              hoveredIndex === index ? "scale-105" : "",
            )}
            onHoverStart={() => setHoveredIndex(index)}
            onHoverEnd={() => setHoveredIndex(null)}
          >
            <div className="relative h-40">
              <Image src={post.image || "/placeholder.svg"} alt={post.title} layout="fill" objectFit="cover" />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-bold mb-2">{post.title}</h3>
              <p className="text-sm text-foreground/70 mb-4">{post.excerpt}</p>
              <div className="flex justify-between items-center text-xs text-foreground/50">
                <span>{post.date}</span>
                <span>{post.readTime}</span>
              </div>
            </div>
            <div className="px-4 pb-4 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span key={tag} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}


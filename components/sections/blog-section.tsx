"use client"

import { useState, useRef, useEffect, forwardRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { Calendar, Clock, ChevronRight, ArrowRight } from "lucide-react"
import { Particles } from "@/components/ui/particles"

const blogPosts = [
  {
    id: 1,
    title: "设计系统如何提高团队效率",
    excerpt: "探讨设计系统如何帮助团队提高工作效率，保持设计一致性，并加速产品开发流程。",
    date: "2023-10-15",
    readTime: "5 分钟",
    image: "/placeholder.svg?height=400&width=600",
    tags: ["设计系统", "团队协作", "效率"],
    category: "设计",
  },
  {
    id: 2,
    title: "用户体验设计的未来趋势",
    excerpt: "分析当前UX设计领域的创新趋势，探讨AI、VR等新技术对用户体验的影响。",
    date: "2023-09-28",
    readTime: "7 分钟",
    image: "/placeholder.svg?height=400&width=600",
    tags: ["UX设计", "AI", "VR"],
    category: "技术",
  },
  {
    id: 3,
    title: "如何进行有效的用户研究",
    excerpt: "分享进行用户研究的实用技巧和方法，帮助设计师更好地理解用户需求。",
    date: "2023-09-10",
    readTime: "6 分钟",
    image: "/placeholder.svg?height=400&width=600",
    tags: ["用户研究", "设计方法论"],
    category: "研究",
  },
  {
    id: 4,
    title: "移动应用设计的最佳实践",
    excerpt: "总结移动应用设计的关键原则和最佳实践，帮助设计师创造出色的移动体验。",
    date: "2023-08-22",
    readTime: "8 分钟",
    image: "/placeholder.svg?height=400&width=600",
    tags: ["移动设计", "用户体验", "设计原则"],
    category: "设计",
  },
]

interface BlogSectionProps {
  className?: string
}

const BlogSection = forwardRef<HTMLDivElement, BlogSectionProps>((props, ref) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>("全部")

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [100, -100])

  const categories = ["全部", ...Array.from(new Set(blogPosts.map(post => post.category)))]
  const filteredPosts = selectedCategory === "全部" 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory)

  return (
    <motion.div
      ref={ref}
      id="blog"
      className="min-h-screen relative overflow-hidden py-20 md:py-32"
    >
      {/* 背景效果 */}
      <div className="absolute inset-0">
        <Particles
          className="absolute inset-0 opacity-40"
          quantity={40}
          staticity={30}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background/80" />
      </div>

      <div className="relative container mx-auto px-4">
        {/* 标题区域 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-400 to-pink-500">
            博客文章
          </h2>
          <p className="mt-4 text-foreground/60">
            分享设计与开发的心得体会
          </p>
        </motion.div>

        {/* 分类标签 */}
        <div className="flex justify-center gap-2 mb-12">
          {categories.map((category) => (
            <motion.button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={cn(
                "px-4 py-2 rounded-full text-sm transition-all duration-300",
                selectedCategory === category
                  ? "bg-primary/20 text-primary shadow-[0_0_20px_rgba(99,102,241,0.3)]"
                  : "bg-black/20 text-foreground/60 hover:bg-black/30 hover:text-foreground/80"
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category}
            </motion.button>
          ))}
        </div>

        {/* 博客文章网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
          {filteredPosts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              onHoverStart={() => setHoveredIndex(index)}
              onHoverEnd={() => setHoveredIndex(null)}
              className="group relative bg-black/20 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden"
            >
              {/* 背景光效 */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* 文章内容 */}
              <div className="relative p-6">
                <div className="flex items-center gap-4 mb-4 text-sm text-foreground/60">
                  <span className="px-3 py-1 rounded-full bg-primary/20 text-primary">
                    {post.category}
                  </span>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {post.date}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {post.readTime}
                  </div>
                </div>

                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors duration-300">
                  {post.title}
                </h3>
                <p className="text-foreground/60 mb-4 line-clamp-2">
                  {post.excerpt}
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {post.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-xs rounded-full bg-white/5 text-foreground/60"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <motion.div
                  className="inline-flex items-center gap-2 text-primary"
                  whileHover={{ x: 5 }}
                >
                  阅读更多
                  <ArrowRight className="w-4 h-4" />
                </motion.div>
              </div>

              {/* 悬停效果 */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 opacity-0 group-hover:opacity-100"
                style={{
                  clipPath: hoveredIndex === index ? "circle(150% at 50% 50%)" : "circle(0% at 50% 50%)",
                }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              />
            </motion.article>
          ))}
        </div>

        {/* 查看更多按钮 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-center mt-12"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 rounded-xl bg-primary/20 text-primary hover:bg-primary/30 transition-colors duration-300 flex items-center gap-2"
          >
            查看更多文章
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  )
})

BlogSection.displayName = "BlogSection"

export default BlogSection


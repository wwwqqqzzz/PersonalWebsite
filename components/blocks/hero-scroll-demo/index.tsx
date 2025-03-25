"use client";
import React, { useRef } from "react";
import { TabletScroll } from "@/components/ui/tablet-scroll-animation";
import { motion, useScroll, useTransform } from "framer-motion";
import { Github, Mail, BookOpen, Cpu, Monitor, Award } from "lucide-react";

export function HeroScrollDemo() {
  const { scrollY } = useScroll();
  const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 0;
  const containerRef = useRef<HTMLDivElement>(null);
  const tabletRef = useRef<HTMLDivElement>(null);
  
  // 基于滚动位置的动画效果
  const contentOpacity = useTransform(scrollY, [viewportHeight * 0.2, viewportHeight * 0.5], [0.6, 1]);

  return (
    <div className="overflow-hidden" ref={containerRef}>
      <div className="relative">
        {/* 框架内容区 */}
        <div ref={tabletRef}>
          <TabletScroll 
            titleComponent={<></>}
          >
            <div className="flex flex-col w-full px-3 mt-6">
              {/* 个人头像 - 调整大小和边距 */}
              <div className="relative mx-auto mb-8">
                <div className="relative w-36 h-36 md:w-44 md:h-44 rounded-full bg-background overflow-hidden border-4 border-red-500 shadow-xl mx-auto">
                  <img
                    src="/avatar/首页头像.png"
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                  
                  {/* 装饰元素 */}
                  <motion.div 
                    className="absolute -top-2 -right-2 w-4 h-4 md:w-5 md:h-5 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500"
                    animate={{ 
                      y: [0, -3, 0],
                      opacity: [0.8, 1, 0.8]
                    }}
                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                  />
                  <motion.div 
                    className="absolute -bottom-1 -left-2 w-3 h-3 md:w-4 md:h-4 rounded-full bg-gradient-to-br from-blue-400 to-purple-500"
                    animate={{ 
                      y: [0, 2, 0],
                      opacity: [0.8, 1, 0.8]
                    }}
                    transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut", delay: 0.5 }}
                  />
                </div>
              </div>
              
              {/* 个人简介部分 */}
              <div className="text-center mb-8">
                <h2 className="text-xl md:text-2xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-orange-500">王起哲</h2>
                <p className="text-sm md:text-base max-w-2xl mx-auto mb-4 text-foreground/90 leading-relaxed">
                  我是一名全栈开发工程师和UI/UX设计师，专注于创建高性能、优雅且富有创意的数字体验。
                  我热衷于将复杂的技术问题转化为简洁直观的解决方案。
                </p>
              </div>
              
              {/* 专业技能部分 - 清晰简洁的卡片布局 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 px-2 md:px-8">
                {/* 前端开发 */}
                <motion.div 
                  className="p-4 rounded-2xl bg-foreground/5 border border-foreground/10 shadow-sm"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-1.5 rounded-lg bg-red-500/10">
                      <Monitor className="w-4 h-4 text-red-500" />
                    </div>
                    <h3 className="text-base font-semibold">前端开发</h3>
                  </div>
                  <p className="text-xs md:text-sm text-foreground/70">
                    精通React、TypeScript和现代前端框架，专注于构建响应式、高性能的用户界面。
                  </p>
                </motion.div>
                
                {/* 后端开发 */}
                <motion.div 
                  className="p-4 rounded-2xl bg-foreground/5 border border-foreground/10 shadow-sm"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-1.5 rounded-lg bg-blue-500/10">
                      <Cpu className="w-4 h-4 text-blue-500" />
                    </div>
                    <h3 className="text-base font-semibold">后端开发</h3>
                  </div>
                  <p className="text-xs md:text-sm text-foreground/70">
                    使用Node.js、Python和数据库技术构建可扩展的后端系统和API，确保应用程序的稳定性和性能。
                  </p>
                </motion.div>
                
                {/* UI/UX设计 */}
                <motion.div 
                  className="p-4 rounded-2xl bg-foreground/5 border border-foreground/10 shadow-sm"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-1.5 rounded-lg bg-purple-500/10">
                      <BookOpen className="w-4 h-4 text-purple-500" />
                    </div>
                    <h3 className="text-base font-semibold">UI/UX设计</h3>
                  </div>
                  <p className="text-xs md:text-sm text-foreground/70">
                    注重用户体验与视觉设计的平衡，创造既美观又实用的界面，提升用户满意度和参与度。
                  </p>
                </motion.div>
                
                {/* 项目管理 */}
                <motion.div 
                  className="p-4 rounded-2xl bg-foreground/5 border border-foreground/10 shadow-sm"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-1.5 rounded-lg bg-green-500/10">
                      <Award className="w-4 h-4 text-green-500" />
                    </div>
                    <h3 className="text-base font-semibold">项目管理</h3>
                  </div>
                  <p className="text-xs md:text-sm text-foreground/70">
                    具有从概念到完成的端到端项目管理经验，擅长敏捷开发和团队协作，确保项目按时高质量交付。
                  </p>
                </motion.div>
              </div>
              
              {/* 联系方式 */}
              <div className="flex justify-center gap-6 mb-6">
                <motion.a
                  href="mailto:contact@example.com"
                  className="p-2 rounded-full bg-foreground/5 border border-foreground/10 hover:bg-red-500/10 hover:border-red-500/30 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Mail className="w-4 h-4" />
                </motion.a>
                <motion.a
                  href="https://github.com/username"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-foreground/5 border border-foreground/10 hover:bg-red-500/10 hover:border-red-500/30 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Github className="w-4 h-4" />
                </motion.a>
              </div>
              
              {/* 简短总结 */}
              <div className="text-center px-4">
                <p className="text-xs md:text-sm text-foreground/60 italic">
                  "我相信优秀的用户体验源于对细节的关注和对用户需求的深入理解。"
                </p>
              </div>
            </div>
          </TabletScroll>
        </div>
      </div>
    </div>
  );
} 
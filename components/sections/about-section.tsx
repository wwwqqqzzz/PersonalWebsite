"use client"

import { forwardRef } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { FileText, Github, Mail } from "lucide-react"

interface AboutSectionProps {
  className?: string
}

const AboutSection = forwardRef<HTMLElement, AboutSectionProps>((props, ref) => {
  return (
    <motion.section
      ref={ref}
      id="about"
      className="py-20 relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            关于我
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="relative aspect-square rounded-2xl overflow-hidden group"
            >
              <Image
                src="/about.jpg"
                alt="关于我的照片"
                fill
                className="object-cover transform group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
            
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h3 className="text-2xl font-bold mb-2 text-primary">专业技能</h3>
                <p className="text-foreground/70">
                  我专注于前端开发，熟练掌握 React、TypeScript、Next.js 等现代前端技术栈。同时具备良好的设计感和用户体验洞察力。
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <h3 className="text-2xl font-bold mb-2 text-primary">工作经历</h3>
                <p className="text-foreground/70">
                  拥有3年以上的前端开发经验，参与过多个大型项目的开发。善于团队协作，注重代码质量和性能优化。
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <h3 className="text-2xl font-bold mb-2 text-primary">个人特点</h3>
                <p className="text-foreground/70">
                  热爱学习新技术，善于解决问题。注重细节，追求完美的用户体验。具有良好的沟通能力和团队协作精神。
                </p>
              </motion.div>

              <motion.div
                className="flex gap-4 pt-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <motion.a
                  href="#"
                  className="flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FileText className="w-5 h-5" />
                  下载简历
                </motion.a>
                <motion.a
                  href="#"
                  className="flex items-center gap-2 px-6 py-3 rounded-lg border border-primary text-primary hover:bg-primary/10 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Mail className="w-5 h-5" />
                  联系我
                </motion.a>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  )
})

AboutSection.displayName = "AboutSection"

export default AboutSection

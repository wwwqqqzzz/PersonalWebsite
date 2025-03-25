"use client"

import React from "react"
import { motion } from "framer-motion"
import { Github, Mail, Twitter } from "lucide-react"

const Footer = () => {
  return (
    <footer className="py-8 px-6 border-t border-border text-center">
      <div className="max-w-7xl mx-auto rounded-3xl overflow-hidden border border-border/30 backdrop-blur-sm bg-background/20 shadow-xl">
        <div className="relative">
          {/* 顶部装饰栏 */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gray-500/40 via-primary/30 to-gray-500/40"></div>
          
          <div className="py-8 px-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-foreground/50">© {new Date().getFullYear()} 王起哲设计工作室. 保留所有权利.</p>
              <div className="flex space-x-4">
                <motion.a
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  href="mailto:contact@example.com"
                  className="text-foreground/50 hover:text-primary transition-colors"
                >
                  <Mail className="h-5 w-5" />
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  href="https://github.com/username" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-foreground/50 hover:text-primary transition-colors"
                >
                  <Github className="h-5 w-5" />
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  href="https://twitter.com/username"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground/50 hover:text-primary transition-colors"
                >
                  <Twitter className="h-5 w-5" />
                </motion.a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer 
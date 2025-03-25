"use client";
import React from "react";
import { motion } from "framer-motion";

export function ScrollEffectDemo() {
  return (
    <div className="relative overflow-hidden bg-background" style={{ height: "85vh" }}>
      {/* 内容区域 - 简化只保留大标题 */}
      <div className="container mx-auto px-4 flex flex-col justify-center items-center h-full relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-5xl md:text-7xl lg:text-9xl font-bold mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-primary to-red-400">
              技术苦行僧
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-foreground/80">
            的作品集
          </p>
        </motion.div>
      </div>
    </div>
  );
} 
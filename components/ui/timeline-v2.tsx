"use client";

import React, { useRef, useState, useEffect, ReactNode } from "react";
import { AnimatePresence, motion, useInView, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

export interface TimelineEntry {
  title: string; // 通常是年份
  content: ReactNode;
}

interface TimelineV2Props {
  data: TimelineEntry[];
  className?: string;
}

export function TimelineV2({ data, className }: TimelineV2Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  // 滚动时根据位置设置当前活动项
  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;
      
      const scrollY = window.scrollY;
      const containerTop = container.offsetTop;
      const viewportHeight = window.innerHeight;
      const triggerPoint = scrollY + viewportHeight * 0.4; // 触发点在视口40%的位置
      
      let newActiveIndex = 0;
      
      // 找到当前视窗中最接近触发点的项
      itemRefs.current.forEach((item, index) => {
        if (!item) return;
        
        const itemTop = item.offsetTop + containerTop;
        const itemHeight = item.offsetHeight;
        const itemCenter = itemTop + itemHeight / 2;
        
        if (itemCenter <= triggerPoint) {
          newActiveIndex = index;
        }
      });
      
      setActiveIndex(newActiveIndex);
    };
    
    window.addEventListener("scroll", handleScroll);
    handleScroll(); // 初始检查
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className={cn("relative w-full mx-auto", className)}
    >
      {/* 左侧固定年份列表 */}
      <div className="fixed left-0 top-1/4 w-[15%] lg:w-[10%] z-10 bg-background/80 backdrop-blur-sm">
        <div className="py-8 px-4 flex flex-col items-end lg:pr-8">
          {data.map((item, index) => (
            <motion.div
              key={`year-${index}`}
              className={cn(
                "py-6 text-right relative",
                activeIndex === index 
                  ? "text-primary font-bold" 
                  : "text-muted-foreground"
              )}
              animate={{
                opacity: activeIndex === index ? 1 : 0.5,
                y: 0,
                transition: { duration: 0.5 }
              }}
            >
              <span className="text-lg md:text-xl">{item.title}</span>
              {activeIndex === index && (
                <motion.div 
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 -translate-x-2 h-0.5 bg-primary" 
                  layoutId="activeIndicator"
                  initial={{ width: 0 }}
                  animate={{ width: 24 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* 右侧滚动内容区域 */}
      <div className="ml-[20%] lg:ml-[15%] w-[80%] lg:w-[85%]">
        {data.map((item, index) => (
          <div
            key={`content-${index}`}
            ref={(el) => {
              itemRefs.current[index] = el;
            }}
            className={cn(
              "relative py-32 first:pt-16 last:pb-48"
            )}
          >
            {/* 连接线 */}
            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-muted">
              <motion.div 
                className="h-full w-full bg-primary origin-top"
                initial={{ scaleY: 0 }}
                whileInView={{
                  scaleY: 1,
                  transition: { duration: 1, ease: [0.34, 1.56, 0.64, 1] }
                }}
                viewport={{ once: false, margin: "-20% 0px -20% 0px" }}
              />
            </div>
            
            {/* 内容 */}
            <div className="relative">
              {/* 圆点指示器 */}
              <motion.div 
                className="absolute left-0 top-0 w-4 h-4 rounded-full bg-background border-2 border-primary -translate-x-[7px]"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: false, margin: "-20% 0px -20% 0px" }}
                transition={{ delay: 0.2 }}
              />
              
              {/* 内容卡片 */}
              <motion.div 
                className="ml-10 bg-card border border-border rounded-lg shadow-md p-6"
                initial={{ 
                  opacity: 0, 
                  x: 20,
                }}
                whileInView={{ 
                  opacity: 1, 
                  x: 0,
                  transition: { 
                    duration: 0.5,
                    ease: "easeOut"
                  }
                }}
                viewport={{ once: false, margin: "-10% 0px -10% 0px" }}
              >
                {item.content}
              </motion.div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 
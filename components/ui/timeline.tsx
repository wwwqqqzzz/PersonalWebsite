"use client";
import {
  useScroll,
  useTransform,
  motion,
  AnimatePresence,
} from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

export const Timeline = ({ data = [] }: { data?: TimelineEntry[] }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [timelineHeight, setTimelineHeight] = useState(0);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  // 计算时间轴高度
  useEffect(() => {
    if (timelineRef.current) {
      setTimelineHeight(timelineRef.current.offsetHeight);
    }

    const handleResize = () => {
      if (timelineRef.current) {
        setTimelineHeight(timelineRef.current.offsetHeight);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 滚动监听设置
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // 时间轴进度条动画
  const progressHeight = useTransform(
    scrollYProgress,
    [0, 1],
    [0, timelineHeight]
  );

  // 检测当前活动的时间点 - 优化滚动灵敏度
  useEffect(() => {
    const handleScroll = () => {
      if (!itemRefs.current.length) return;

      // 优化滚动检测触发点为视口30%处
      const viewportTriggerPoint = window.innerHeight * 0.3;
      let closestIndex = 0;
      let closestDistance = Infinity;

      itemRefs.current.forEach((item, index) => {
        if (!item) return;
        
        const rect = item.getBoundingClientRect();
        // 使用顶部位置与触发点的距离计算
        const distance = Math.abs(rect.top - viewportTriggerPoint);
        
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      setActiveIndex(closestIndex);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // 初始检查
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 如果没有数据，显示空状态
  if (!data || data.length === 0) {
    return (
      <div className="w-full bg-background font-sans md:px-10 py-20 text-center">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-lg md:text-4xl mb-4 text-foreground max-w-4xl font-bold">
            项目历程
          </h2>
          <p className="text-foreground/60 text-sm md:text-base">
            暂无项目数据
          </p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="relative w-full min-h-screen bg-background"
    >
      {/* 标题部分 */}
      <div className="max-w-7xl mx-auto py-8 md:py-12 px-4 md:px-8 lg:px-10 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
          项目历程
        </h2>
        <p className="text-foreground/60 text-base max-w-2xl mx-auto">
          我的技术探索与工程实践之旅，多年来专注于高性能系统和优质用户体验
        </p>
      </div>

      {/* 时间轴容器 */}
      <div 
        ref={timelineRef}
        className="max-w-6xl mx-auto relative px-4 md:px-8 lg:px-10 pb-32"
      >
        {/* 垂直时间轴线 - 流光渐变效果升级 */}
        <div className="absolute left-6 md:left-[150px] top-0 bottom-0 w-[2px] overflow-hidden">
          {/* 基础渐变层 */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-primary/40 to-primary/20" />
          
          {/* 动态流光层 */}
          <motion.div 
            className="relative h-full"
            style={{ height: progressHeight }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-primary to-primary/30" />
            <motion.div
              className="absolute top-0 w-full h-12 bg-gradient-to-b from-white/40 to-transparent"
              animate={{ y: timelineHeight }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          </motion.div>
        </div>

        {/* 时间点和内容 */}
        {data.map((item, index) => (
          <div 
            ref={el => {
              itemRefs.current[index] = el;
              return undefined;
            }}
            key={index}
            className="relative mb-24 md:mb-32 last:mb-0"
          >
            {/* 时间点标记 - 星际粒子系统升级 */}
            <div className="absolute left-6 md:left-[150px] -translate-x-1/2 flex items-center z-10">
              <div className="relative z-20">
                {/* 核心圆点 */}
                <div className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                  activeIndex === index 
                    ? 'border-primary bg-primary shadow-[0_0_15px_var(--primary)]' 
                    : 'border-muted-foreground/40 bg-background'
                }`} />
                
                {/* 粒子效果 */}
                {activeIndex === index && (
                  <motion.div
                    className="absolute -inset-3"
                    initial={{ scale: 0 }}
                    animate={{ 
                      scale: 1,
                      rotate: 360,
                      transition: {
                        duration: 4,
                        repeat: Infinity,
                        ease: "linear"
                      }
                    }}
                  >
                    {[...Array(8)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-1.5 h-1.5 bg-primary rounded-full animate-float"
                        style={{
                          transform: `rotate(${i*45}deg) translate(12px)`,
                          animationDelay: `${i*0.2}s`
                        }}
                      />
                    ))}
                  </motion.div>
                )}
              </div>
              
              {/* 年份标题 - 全息投影效果 */}
              <motion.div
                className="ml-6 md:ml-8 hidden md:block relative"
                animate={{ 
                  x: activeIndex === index ? 0 : -10,
                  opacity: activeIndex === index ? 1 : 0.7
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <span className="text-xl font-medium bg-gradient-to-r from-primary to-cyan-300 bg-clip-text text-transparent">
                  {item.title}
                </span>
                <div className="absolute -bottom-1 left-0 w-full h-[2px] bg-gradient-to-r from-primary/50 to-transparent" />
              </motion.div>
            </div>
            
            {/* 添加时间点连接线 */}
            {index < data.length - 1 && (
              <div className="absolute left-6 md:left-[150px] -translate-x-1/2 
                top-[16px] h-[calc(100%+8px)] w-px bg-border/30" 
              />
            )}
            
            {/* 内容区域 */}
            <div className="timeline-content ml-16 md:ml-[200px]">
              {/* 移动端年份标题 - 优化样式 */}
              <div className="md:hidden mb-4 px-4 py-2 bg-primary/10 rounded-full inline-block backdrop-blur-sm">
                <motion.div
                  className="text-lg bg-gradient-to-r from-primary to-cyan-300 bg-clip-text text-transparent font-medium"
                >
                  {item.title}
                </motion.div>
              </div>
              
              {/* 内容卡片 - 玻璃拟态增强版 */}
              <motion.div
                className="relative bg-glass backdrop-blur-lg rounded-xl border border-white/10 overflow-hidden will-change-transform"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ 
                  opacity: 1,
                  y: 0,
                  transition: {
                    type: "spring",
                    stiffness: 100,
                    damping: 20
                  }
                }}
                viewport={{ once: false, margin: "-30% 0px" }}
              >
                {/* 动态光效层 */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-cyan-400/10" />
                
                {/* 内容容器 */}
                <div className="relative p-6 md:p-8">
                  {item.content}
                </div>
              </motion.div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 
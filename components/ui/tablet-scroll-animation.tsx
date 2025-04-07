"use client";
import React, { useRef, useEffect, useState } from "react";
import { useScroll, useTransform, motion, useMotionValue, useSpring, MotionValue } from "framer-motion";

interface TabletScrollProps {
  titleComponent: string | React.ReactNode;
  avatarComponent?: React.ReactNode;
  children: React.ReactNode;
}

interface HeaderProps {
  translate: MotionValue<number>;
  titleComponent: string | React.ReactNode;
}

interface TabletCardProps {
  rotateX: MotionValue<number>;
  perspective: MotionValue<number>;
  scale: MotionValue<number>;
  translate: MotionValue<number>;
  opacity: MotionValue<number>;
  borderWidth: MotionValue<number>;
  avatarComponent?: React.ReactNode;
  children: React.ReactNode;
  rotateZ: MotionValue<number>;
}

// 主滚动容器组件
export function TabletScroll({ titleComponent, avatarComponent, children }: TabletScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // 使用视窗滚动来控制变形位置
  const { scrollY } = useScroll();
  const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 0;
  
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  // 自动隐藏滚动条但保持滚动功能
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const style = document.createElement('style');
      style.textContent = `
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `;
      document.head.append(style);
      
      return () => {
        document.head.removeChild(style);
      };
    }
  }, []);

  // 梯形到长方形的变换 - 关键：使用useSpring让变化更丝滑
  const scrollTrigger = [0, viewportHeight * 0.5]; // 调整到50%视窗高度时完成变形
  
  // 使用原始值
  const rawRotateX = useTransform(scrollY, scrollTrigger, [20, 0]);
  const rawPerspective = useTransform(scrollY, scrollTrigger, [800, 2000]);
  const rawScale = useTransform(scrollY, scrollTrigger, isMobile ? [0.85, 1] : [0.9, 1]);
  const rawTranslateY = useTransform(scrollY, scrollTrigger, [80, 0]);
  const rawOpacity = useTransform(scrollY, scrollTrigger, [0.9, 1]);
  const rawBorderWidth = useTransform(scrollY, scrollTrigger, [12, 8]);
  
  // 应用平滑转换，减少卡顿
  const rotateX = useSpring(rawRotateX, { damping: 30, stiffness: 200 });
  const perspective = useSpring(rawPerspective, { damping: 30, stiffness: 200 });
  const scale = useSpring(rawScale, { damping: 30, stiffness: 200 });
  const translateY = useSpring(rawTranslateY, { damping: 30, stiffness: 200 });
  const opacity = useSpring(rawOpacity, { damping: 30, stiffness: 200 });
  const borderWidth = useSpring(rawBorderWidth, { damping: 30, stiffness: 200 });

  return (
    <div
      className="h-[1100px] w-full flex flex-col items-center justify-start relative tablet-container"
      ref={containerRef}
      id="about"
    >
      <div
        className="w-full h-full relative py-6 md:py-8 mt-10"
        style={{
          perspective: "1500px",
        }}
      >
        <Header translate={translateY} titleComponent={titleComponent} />
        <TabletCard 
          rotateX={rotateX}
          perspective={perspective}
          translate={translateY} 
          scale={scale} 
          opacity={opacity}
          borderWidth={borderWidth}
          rotateZ={rotateX}
        >
          {children}
        </TabletCard>
      </div>
    </div>
  );
}

// 标题组件
function Header({ translate, titleComponent }: HeaderProps) {
  return (
    <motion.div
      style={{
        translateY: translate,
      }}
      className="div max-w-7xl mx-auto text-center py-0 mb-0 mt-0 hidden"
    >
      {titleComponent}
    </motion.div>
  );
}

// 卡片组件
function TabletCard({ 
  rotateX, 
  perspective,
  scale, 
  translate, 
  opacity,
  borderWidth,
  children 
}: Omit<TabletCardProps, 'avatarComponent'>) {
  return (
    <motion.div
      style={{
        rotateX,
        scale,
        translateY: translate,
        opacity,
        perspective,
        transformOrigin: "center bottom",
      }}
      className="max-w-7xl mx-auto h-[950px] w-full relative rounded-[2rem] overflow-hidden transform-gpu will-change-transform"
      initial={{ y: 0 }}
    >
      {/* 红色边框框架 */}
      <motion.div 
        className="absolute inset-0 rounded-[2rem] bg-background shadow-2xl overflow-hidden transform-gpu tablet-frame"
        style={{
          border: "4px solid rgb(239 68 68)",
          boxShadow: "0 0 8px 2px rgba(239, 68, 68, 0.6)",
          backgroundImage: 'linear-gradient(to bottom, rgba(0,0,0,0.9), rgba(30,20,60,0.9))',
        }}
      >
        {/* 顶部反光效果 - 随梯形变化而变化 */}
        <motion.div 
          className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-foreground/10 to-transparent pointer-events-none transform-gpu"
          style={{
            opacity: useTransform(rotateX, [20, 0], [0.7, 0.2])
          }}
        />
        
        {/* 赛博朋克风格的背景元素 */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-cyan-900/20"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full filter blur-xl transform translate-x-10 -translate-y-10"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-pink-500/10 rounded-full filter blur-xl transform -translate-x-10 translate-y-10"></div>
        </div>
        
        {/* 梯形变换效果的视觉提示 - 顶部和底部边缘 */}
        <motion.div 
          className="absolute inset-x-0 top-0 h-1 bg-red-500/30 transform-gpu"
          style={{
            scaleX: useTransform(rotateX, [20, 0], [0.85, 1])
          }}
        />
        
        <motion.div 
          className="absolute inset-x-0 bottom-0 h-1 bg-red-500/30 transform-gpu"
          style={{
            scaleX: useTransform(rotateX, [20, 0], [1.15, 1])
          }}
        />
        
        {/* 内容区域 - 固定内容不可滚动 */}
        <div className="absolute inset-0 p-6 pb-16 md:p-10 md:pb-20 overflow-hidden transform-gpu">
          <div className="h-full w-full overflow-hidden transform-gpu">
            {children}
          </div>
        </div>
      </motion.div>
      
      {/* 投影效果 - 根据rotateX变化 */}
      <motion.div 
        className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[95%] h-16 bg-black/30 dark:bg-black/50 blur-xl rounded-full transform-gpu"
        style={{
          scaleY: useTransform(rotateX, [20, 0], [0.4, 1]),
          scaleX: useTransform(rotateX, [20, 0], [0.85, 1.05]),
          translateY: useTransform(rotateX, [20, 0], [30, 0]),
          opacity: 0.5
        }}
      />
    </motion.div>
  );
} 
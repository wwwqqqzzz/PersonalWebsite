"use client";
import React, { useRef } from "react";
import { useScroll, useTransform, motion, MotionValue } from "framer-motion";

interface ContainerScrollProps {
  titleComponent: string | React.ReactNode;
  children: React.ReactNode;
}

interface HeaderProps {
  translate: MotionValue<number>;
  titleComponent: string | React.ReactNode;
}

interface CardProps {
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  translate: MotionValue<number>;
  children: React.ReactNode;
}

// 主滚动容器组件
export function ContainerScroll({ titleComponent, children }: ContainerScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
  });
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const scaleDimensions = () => {
    return isMobile ? [0.7, 0.9] : [1.05, 1];
  };

  // 增强动画效果以匹配示例图片
  const rotate = useTransform(scrollYProgress, [0, 1], [20, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], scaleDimensions());
  const translate = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <div
      className="h-[60rem] md:h-[80rem] flex items-center justify-center relative p-2 md:p-20"
      ref={containerRef}
      id="about"
    >
      <div
        className="py-10 md:py-40 w-full relative"
        style={{
          perspective: "1000px",
        }}
      >
        <Header translate={translate} titleComponent={titleComponent} />
        <Card rotate={rotate} translate={translate} scale={scale}>
          {children}
        </Card>
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
      className="div max-w-5xl mx-auto text-center"
    >
      {titleComponent}
    </motion.div>
  );
}

// 卡片组件
function Card({ rotate, scale, translate, children }: CardProps) {
  return (
    <motion.div
      style={{
        rotateX: rotate, // 维持X轴旋转
        scale,
      }}
      className="max-w-5xl -mt-12 mx-auto h-[30rem] md:h-[40rem] w-full relative rounded-[2rem] overflow-hidden"
    >
      {/* 平板外壳 - 深色/浅色模式兼容 */}
      <div className="absolute inset-0 rounded-[2rem] border-8 border-[#333333] dark:border-[#222222] bg-[#111] dark:bg-[#111] shadow-xl overflow-hidden">
        {/* 顶部平板功能区域 */}
        <div className="absolute top-0 inset-x-0 h-6 bg-[#111] dark:bg-[#0a0a0a] z-20 flex items-center justify-center">
          <div className="w-20 h-1.5 rounded-full bg-[#333] dark:bg-[#333]"></div>
        </div>
        
        {/* 平板摄像头 */}
        <div className="absolute top-1.5 left-4 w-2.5 h-2.5 rounded-full bg-[#333] dark:bg-[#444] flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-[#222] dark:bg-[#222]"></div>
        </div>
        
        {/* 内容区域 - 带内部阴影效果 */}
        <div className="absolute inset-0 mt-6 rounded-b-[1.8rem] overflow-hidden shadow-inner">
          <div className="h-full w-full bg-white dark:bg-[#0a0a0a] overflow-hidden">
            {children}
          </div>
        </div>
      </div>
    </motion.div>
  );
} 
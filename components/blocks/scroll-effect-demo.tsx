"use client";
import React, { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";

// 增强版微妙粒子背景组件
const MinimalistParticles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // 设置画布大小
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    // 监听窗口大小变化
    window.addEventListener('resize', setCanvasSize);
    setCanvasSize();
    
    // 监听鼠标移动
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    // 粒子设置 - 减少数量增加简约感
    const particleCount = 20;
    const particles: {
      x: number;
      y: number;
      size: number;
      vx: number;
      vy: number;
      color: string;
      originalX: number;
      originalY: number;
    }[] = [];
    
    // 创建粒子 - 使用更柔和的颜色
    for (let i = 0; i < particleCount; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      particles.push({
        x,
        y,
        originalX: x,
        originalY: y,
        size: Math.random() * 2 + 0.5, // 更小的粒子
        vx: (Math.random() - 0.5) * 0.1, // 更慢的移动
        vy: (Math.random() - 0.5) * 0.1,
        // 更柔和的颜色
        color: `rgba(180, 180, 200, ${Math.random() * 0.08 + 0.02})`
      });
    }
    
    // 动画循环
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // 绘制粒子
      particles.forEach(particle => {
        ctx.beginPath();
        
        // 微妙对鼠标位置的反应
        const dx = mousePosition.x - particle.x;
        const dy = mousePosition.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 150;
        
        if (distance < maxDistance) {
          // 粒子远离鼠标
          const angle = Math.atan2(dy, dx);
          const force = (maxDistance - distance) / maxDistance * 0.2;
          particle.vx -= Math.cos(angle) * force;
          particle.vy -= Math.sin(angle) * force;
        }
        
        // 粒子缓慢回到原点
        particle.vx += (particle.originalX - particle.x) * 0.001;
        particle.vy += (particle.originalY - particle.y) * 0.001;
        
        // 限制最大速度
        const maxSpeed = 0.5;
        const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
        if (speed > maxSpeed) {
          particle.vx = (particle.vx / speed) * maxSpeed;
          particle.vy = (particle.vy / speed) * maxSpeed;
        }
        
        // 应用摩擦力
        particle.vx *= 0.98;
        particle.vy *= 0.98;
        
        // 移动粒子
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // 绘制具有羽化边缘的粒子
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size * 2
        );
        gradient.addColorStop(0, particle.color);
        gradient.addColorStop(1, 'rgba(180, 180, 200, 0)');
        
        ctx.fillStyle = gradient;
        ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
        ctx.fill();
      });
      
      requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', setCanvasSize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  return <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-70 pointer-events-none" />;
};

// 流动SVG线条组件
const FlowingSVGLines = () => {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
      <svg 
        width="100%" 
        height="100%" 
        viewBox="0 0 1000 1000" 
        className="opacity-10"
        style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
      >
        <motion.path
          d="M100,250 C150,100 350,100 400,250 C450,400 550,400 600,250 C650,100 850,100 900,250"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ 
            pathLength: 1, 
            opacity: 0.2,
            pathOffset: [0, 1] 
          }}
          transition={{
            pathLength: { duration: 3, ease: "easeInOut" },
            opacity: { duration: 1 },
            pathOffset: { 
              repeat: Infinity,
              duration: 10,
              ease: "linear"
            }
          }}
        />
        <motion.path
          d="M100,350 C200,200 300,500 400,350 C500,200 600,500 700,350 C800,200 900,500 900,350"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ 
            pathLength: 1, 
            opacity: 0.2,
            pathOffset: [0, 1] 
          }}
          transition={{
            pathLength: { duration: 3, ease: "easeInOut" },
            opacity: { duration: 1, delay: 0.5 },
            pathOffset: { 
              repeat: Infinity,
              duration: 15,
              ease: "linear",
              delay: 0.5
            }
          }}
        />
        <motion.path
          d="M100,650 C300,550 400,750 600,650 C800,550 900,750 900,650"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.7"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ 
            pathLength: 1, 
            opacity: 0.15,
            pathOffset: [0, 1] 
          }}
          transition={{
            pathLength: { duration: 3, ease: "easeInOut" },
            opacity: { duration: 1, delay: 1 },
            pathOffset: { 
              repeat: Infinity,
              duration: 20,
              ease: "linear",
              repeatType: "reverse",
              delay: 1
            }
          }}
        />
      </svg>
    </div>
  );
};

// 增强版流动线条组件
const FlowingLine = () => {
  return (
    <div className="relative h-20 w-[1px]">
      <motion.div 
        className="absolute top-0 left-0 w-[1px] h-full bg-gradient-to-b from-transparent via-foreground/30 to-transparent"
        animate={{ 
          height: [0, 20, 0],
          y: [0, 20, 40],
          opacity: [0, 0.6, 0]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
          times: [0, 0.5, 1]
        }}
      />
      <motion.div 
        className="absolute top-0 left-0 w-[1px] h-full bg-gradient-to-b from-transparent via-foreground/20 to-transparent"
        animate={{ 
          height: [0, 20, 0],
          y: [0, 20, 40],
          opacity: [0, 0.4, 0]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
          times: [0, 0.5, 1]
        }}
      />
    </div>
  );
};

// 极简按钮组件
const MinimalistButton = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.button
      className="relative px-8 py-2.5 border border-foreground/20 text-sm overflow-hidden group"
      whileHover={{ borderColor: "rgba(var(--foreground-rgb), 0.3)" }}
      whileTap={{ scale: 0.98 }}
    >
      <motion.span
        className="absolute inset-0 bg-foreground/5 z-0"
        initial={{ x: "-100%" }}
        whileHover={{ x: "0%" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      />
      <span className="relative z-10 group-hover:text-foreground/90 transition-colors">
        {children}
      </span>
    </motion.button>
  );
};

export function ScrollEffectDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 100]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
  
  // 响应鼠标移动的微妙倾斜效果
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // 计算鼠标位置相对于窗口中心的偏移
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const x = (clientX - innerWidth / 2) / (innerWidth / 2);
      const y = (clientY - innerHeight / 2) / (innerHeight / 2);
      
      setMousePosition({ x, y });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  const rotateX = useTransform(
    scrollYProgress,
    [0, 1],
    [mousePosition.y * -1, 0]
  );
  const rotateY = useTransform(
    scrollYProgress,
    [0, 1],
    [mousePosition.x * 2, 0]
  );
  
  return (
    <motion.div 
      ref={containerRef}
      className="relative overflow-hidden bg-background min-h-[100svh] flex flex-col justify-center items-center"
      style={{ opacity, y, scale }}
    >
      {/* 微妙粒子背景 */}
      <MinimalistParticles />
      
      {/* 流动SVG线条 */}
      <FlowingSVGLines />
      
      {/* SVG几何形状背景装饰 */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        {/* 网格背景效果 */}
        <motion.svg
          className="absolute inset-0 w-full h-full opacity-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.05 }}
          transition={{ duration: 3 }}
        >
          <defs>
            <pattern
              id="grid-pattern"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                strokeDasharray="1 9"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-pattern)" />
        </motion.svg>
      
        {/* 大型圆形 */}
        <motion.svg 
          className="absolute -right-[20%] -top-[10%] opacity-10 text-foreground"
          width="600" 
          height="600" 
          viewBox="0 0 600 600"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.08, scale: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
        >
          <circle cx="300" cy="300" r="280" fill="none" stroke="currentColor" strokeWidth="1" />
          <circle cx="300" cy="300" r="220" fill="none" stroke="currentColor" strokeWidth="0.5" />
        </motion.svg>
        
        {/* 左侧装饰线条 */}
        <motion.svg 
          className="absolute -left-20 top-1/4 opacity-5 text-foreground"
          width="400" 
          height="400" 
          viewBox="0 0 400 400"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 0.1, x: 0 }}
          transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
        >
          <line x1="0" y1="100" x2="400" y2="100" stroke="currentColor" strokeWidth="1" />
          <line x1="0" y1="200" x2="400" y2="200" stroke="currentColor" strokeWidth="1" />
          <line x1="0" y1="300" x2="400" y2="300" stroke="currentColor" strokeWidth="1" />
        </motion.svg>
        
        {/* 底部波浪形装饰 */}
        <motion.svg 
          className="absolute bottom-0 left-0 w-full opacity-5 text-foreground"
          height="120" 
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 0.1, y: 0 }}
          transition={{ duration: 2, delay: 0.8, ease: "easeOut" }}
        >
          <path 
            d="M0,32L60,42.7C120,53,240,75,360,74.7C480,75,600,53,720,58.7C840,64,960,96,1080,96C1200,96,1320,64,1380,48L1440,32L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z" 
            fill="currentColor"
          />
        </motion.svg>
        
        {/* 右下角三角形装饰 */}
        <motion.svg 
          className="absolute bottom-10 right-10 opacity-10 text-foreground"
          width="300" 
          height="300" 
          viewBox="0 0 300 300"
          initial={{ opacity: 0, rotate: -20 }}
          animate={{ opacity: 0.06, rotate: 0 }}
          transition={{ duration: 2, delay: 1, ease: "easeOut" }}
        >
          <polygon points="150,20 280,280 20,280" fill="none" stroke="currentColor" strokeWidth="1" />
        </motion.svg>
      </div>
      
      {/* 内容区域 */}
      <div className="container mx-auto px-4 flex flex-col justify-center items-center h-full relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.6, 0.05, 0.01, 0.9] }}
          className="text-center space-y-12 max-w-5xl"
          style={{
            rotateX,
            rotateY,
            transformPerspective: 1000
          }}
        >
          <motion.h1 
            className="text-5xl md:text-7xl lg:text-9xl font-light tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <span className="relative">
              王起哲
              <motion.div 
                className="absolute -bottom-2 left-0 right-0 h-[1px]" 
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.5, delay: 1.2 }}
              >
                <div className="h-full bg-gradient-to-r from-transparent via-foreground/40 to-transparent" />
              </motion.div>
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-base md:text-xl text-foreground/60 max-w-2xl mx-auto font-light"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            探索数字世界的边界，创造简约而优雅的用户体验
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="pt-4"
          >
            <MinimalistButton>探索作品</MinimalistButton>
          </motion.div>
        </motion.div>
      </div>
      
      {/* 向下指示器加强版 */}
      <motion.div 
        className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
      >
        <span className="text-foreground/40 text-xs tracking-widest uppercase">向下滚动</span>
        <div className="relative">
          <FlowingLine />
          {/* 添加箭头SVG */}
          <motion.svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-foreground/30"
            animate={{ 
              y: [0, 5, 0],
              opacity: [0.3, 0.7, 0.3]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <path d="M12 4L12 20M12 20L18 14M12 20L6 14" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
          </motion.svg>
        </div>
      </motion.div>
    </motion.div>
  );
} 
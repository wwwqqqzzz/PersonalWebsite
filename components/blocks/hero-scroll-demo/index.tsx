"use client";
import React, { useRef, useEffect, useState } from "react";
import { TabletScroll } from "@/components/ui/tablet-scroll-animation";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Github, Mail, Code, Terminal, Cpu, Server } from "lucide-react";
import { useTheme } from "next-themes";

// 故障文字效果
const GlitchText = ({ children, intensity = 1 }: { children: React.ReactNode, intensity?: number }) => {
  const [glitching, setGlitching] = useState(false);
  
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setGlitching(true);
        setTimeout(() => setGlitching(false), 150 * intensity);
      }
    }, 2000 + Math.random() * 3000);
    
    return () => clearInterval(interval);
  }, [intensity]);
  
  return (
    <span className="relative inline-block">
      {children}
      {glitching && (
        <>
          <span className="absolute top-0 left-0 w-full h-full text-[#0ff] opacity-80 translate-x-[-2px] translate-y-[2px]">
            {children}
          </span>
          <span className="absolute top-0 left-0 w-full h-full text-[#f0f] opacity-80 translate-x-[2px] translate-y-[-1px]">
            {children}
          </span>
        </>
      )}
    </span>
  );
};

// 赛博朋克城市背景
const CyberpunkCity = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // 设置画布尺寸
    const setupCanvas = () => {
      const pixelRatio = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * pixelRatio;
      canvas.height = window.innerHeight * pixelRatio;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(pixelRatio, pixelRatio);
    };
    
    setupCanvas();
    window.addEventListener('resize', setupCanvas);
    
    // 动画函数
    let animationId: number;
    const animate = () => {
      // 视差效果
      const offsetX = (mousePosition.x - 0.5) * -15;
      const offsetY = (mousePosition.y - 0.5) * 5;
      
      // 清空画布
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // 绘制夜空渐变背景 - 根据主题调整
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      
      if (isDark) {
        // 深色模式 - 深蓝黑色背景
        gradient.addColorStop(0, "#000510");
        gradient.addColorStop(0.5, "#041040");
        gradient.addColorStop(1, "#0c0030");
      } else {
        // 浅色模式 - 深青色渐变
        gradient.addColorStop(0, "#001030");
        gradient.addColorStop(0.5, "#0a2040");
        gradient.addColorStop(1, "#103050");
      }
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // 绘制星星
      for (let i = 0; i < 100; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height * 0.6;
        const radius = Math.random() * 1.2;
        const opacity = Math.random() * 0.8 + 0.2;
        
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.fill();
      }
      
      // 绘制网格地面
      ctx.strokeStyle = isDark ? "rgba(0, 255, 255, 0.3)" : "rgba(0, 210, 255, 0.3)";
      ctx.lineWidth = 1;
      
      // 绘制地平线
      const horizonY = canvas.height * 0.75;
      ctx.beginPath();
      ctx.moveTo(0, horizonY);
      ctx.lineTo(canvas.width, horizonY);
      ctx.strokeStyle = isDark ? "rgba(0, 255, 255, 0.8)" : "rgba(0, 210, 255, 0.8)";
      ctx.stroke();
      
      // 绘制远处城市轮廓
      drawCityscape(ctx, canvas.width, horizonY, offsetX);
      
      // 绘制网格地面
      drawGrid(ctx, canvas.width, canvas.height, horizonY, offsetX);
      
      // 绘制霓虹灯效果
      drawNeonLights(ctx, canvas.width, canvas.height, horizonY, offsetX);
      
      // 绘制扫描线
      drawScanlines(ctx, canvas.width, canvas.height);
      
      animationId = requestAnimationFrame(animate);
    };
    
    function drawCityscape(ctx: CanvasRenderingContext2D, width: number, horizonY: number, offsetX: number) {
      // 城市轮廓
      ctx.beginPath();
      
      // 起点
      ctx.moveTo(0, horizonY);
      
      // 生成不同高度的建筑物
      const buildingCount = 30;
      const buildingWidth = width / buildingCount;
      
      for (let i = 0; i < buildingCount; i++) {
        const x = i * buildingWidth + offsetX * (i / buildingCount);
        const buildingHeight = Math.random() * 100 + 20;
        const nextX = x + buildingWidth;
        
        // 绘制建筑物上部
        ctx.lineTo(x, horizonY - buildingHeight);
        
        // 随机添加楼顶细节
        if (Math.random() > 0.5) {
          ctx.lineTo(x + buildingWidth * 0.2, horizonY - buildingHeight - 15);
          ctx.lineTo(x + buildingWidth * 0.3, horizonY - buildingHeight);
          ctx.lineTo(x + buildingWidth * 0.7, horizonY - buildingHeight);
          ctx.lineTo(x + buildingWidth * 0.8, horizonY - buildingHeight - 10);
        } else if (Math.random() > 0.7) {
          // 天线或塔
          ctx.lineTo(x + buildingWidth * 0.5, horizonY - buildingHeight - 25);
        }
        
        ctx.lineTo(nextX, horizonY - Math.random() * 80 - 30);
      }
      
      // 回到地平线
      ctx.lineTo(width, horizonY);
      
      // 填充城市轮廓
      ctx.fillStyle = isDark ? "rgba(0, 0, 30, 0.8)" : "rgba(0, 20, 50, 0.8)";
      ctx.fill();
      
      // 城市灯光
      for (let i = 0; i < buildingCount * 5; i++) {
        const windowSize = 3;
        const x = Math.random() * width;
        const y = Math.random() * 80 + (horizonY - 100);
        
        if (y < horizonY) {
          const brightness = Math.random();
          let windowColor;
          
          if (brightness > 0.9) {
            // 霓虹窗户 - 根据模式调整颜色
            const colors = isDark ? 
              ["rgba(255,0,128,0.9)", "rgba(0,255,255,0.9)", "rgba(255,255,0,0.8)"] : 
              ["rgba(255,50,150,0.8)", "rgba(0,200,255,0.8)", "rgba(255,200,50,0.7)"];
            
            windowColor = colors[Math.floor(Math.random() * colors.length)];
          } else {
            // 普通窗户
            windowColor = isDark ? 
              `rgba(255,255,200,${brightness * 0.7})` : 
              `rgba(255,255,220,${brightness * 0.6})`;
          }
          
          ctx.fillStyle = windowColor;
          ctx.fillRect(x, y, windowSize, windowSize);
          
          if (brightness > 0.85) {
            // 窗户光芒
            ctx.fillStyle = windowColor.replace(")", ",0.2)");
            ctx.beginPath();
            ctx.arc(x + windowSize/2, y + windowSize/2, windowSize * 2, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    }
    
    function drawGrid(ctx: CanvasRenderingContext2D, width: number, height: number, horizonY: number, offsetX: number) {
      // 透视网格
      const gridSize = 40;
      const gridLines = 30;
      
      // 横向网格线
      for (let i = 1; i <= gridLines; i++) {
        const progress = i / gridLines;
        const y = horizonY + (height - horizonY) * progress;
        
        // 线条透明度随距离减弱
        const lineOpacity = 0.8 - progress * 0.6;
        
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.strokeStyle = isDark ? 
          `rgba(0, 255, 255, ${lineOpacity})` : 
          `rgba(0, 210, 255, ${lineOpacity})`;
        ctx.stroke();
      }
      
      // 纵向网格线
      const vanishingPointX = width / 2 + offsetX * 30; // 视差影响灭点
      
      for (let i = -20; i <= 20; i++) {
        const startX = vanishingPointX + i * gridSize;
        
        ctx.beginPath();
        ctx.moveTo(startX, horizonY);
        ctx.lineTo(i < 0 ? 0 : width, height);
        ctx.strokeStyle = isDark ? 
          "rgba(0, 255, 255, 0.3)" : 
          "rgba(0, 210, 255, 0.3)";
        ctx.stroke();
      }
    }
    
    function drawNeonLights(ctx: CanvasRenderingContext2D, width: number, height: number, horizonY: number, offsetX: number) {
      const time = Date.now() * 0.001;
      
      // 第一条霓虹灯 - 粉色
      ctx.beginPath();
      ctx.moveTo(0, horizonY + 30);
      
      for (let x = 0; x <= width; x += 20) {
        const y = horizonY + 30 + Math.sin(x * 0.01 + time) * 10;
        ctx.lineTo(x, y);
      }
      
      // 霓虹灯颜色 - 根据模式调整
      const neonPink = isDark ? "#ff0080" : "#ff2090";
      const neonCyan = isDark ? "#0ff" : "#20d0ff";
      
      ctx.strokeStyle = neonPink;
      ctx.lineWidth = 2;
      ctx.stroke();
      
      ctx.strokeStyle = `rgba(${isDark ? '255, 0, 128' : '255, 32, 144'}, 0.5)`;
      ctx.lineWidth = 4;
      ctx.stroke();
      
      ctx.strokeStyle = `rgba(${isDark ? '255, 0, 128' : '255, 32, 144'}, 0.2)`;
      ctx.lineWidth = 8;
      ctx.stroke();
      
      // 第二条霓虹灯 - 青色
      ctx.beginPath();
      ctx.moveTo(0, horizonY + 10);
      
      for (let x = 0; x <= width; x += 20) {
        const y = horizonY + 10 + Math.cos(x * 0.02 + time * 1.5) * 5;
        ctx.lineTo(x, y);
      }
      
      ctx.strokeStyle = neonCyan;
      ctx.lineWidth = 2;
      ctx.stroke();
      
      ctx.strokeStyle = `rgba(${isDark ? '0, 255, 255' : '32, 208, 255'}, 0.5)`;
      ctx.lineWidth = 4;
      ctx.stroke();
      
      ctx.strokeStyle = `rgba(${isDark ? '0, 255, 255' : '32, 208, 255'}, 0.2)`;
      ctx.lineWidth = 6;
      ctx.stroke();
    }
    
    function drawScanlines(ctx: CanvasRenderingContext2D, width: number, height: number) {
      // 扫描线效果 - 根据模式调整透明度
      const scanlineOpacity = isDark ? 0.2 : 0.15;
      
      for (let y = 0; y < height; y += 4) {
        ctx.fillStyle = `rgba(0, 0, 0, ${scanlineOpacity})`;
        ctx.fillRect(0, y, width, 1);
      }
      
      // 全局噪点 - 根据模式调整亮度
      const noiseCount = isDark ? 5000 : 4000;
      const noiseOpacity = isDark ? 0.05 : 0.04;
      
      for (let i = 0; i < noiseCount; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const size = Math.random() * 1.5;
        const opacity = Math.random() * noiseOpacity;
        
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.fillRect(x, y, size, size);
      }
    }
    
    animate();
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', setupCanvas);
      cancelAnimationFrame(animationId);
    };
  }, [mousePosition, resolvedTheme, isDark]);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full z-0"
    />
  );
};

// 霓虹文字效果 - 支持主题
const NeonText = ({ 
  children, 
  color = "cyan",
  size = "2xl",
  className = ""
}: { 
  children: React.ReactNode, 
  color?: "cyan" | "pink" | "yellow",
  size?: "xl" | "2xl" | "3xl" | "4xl",
  className?: string
}) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  
  const colorMap = {
    cyan: {
      glow: isDark ? "#0ff" : "#20d0ff",
      textShadow: isDark ? 
        "0 0 5px #0ff, 0 0 15px #0ff, 0 0 25px #0ff, 0 0 40px #0ff" : 
        "0 0 5px #20d0ff, 0 0 15px #20d0ff, 0 0 25px #20d0ff, 0 0 35px #20d0ff"
    },
    pink: {
      glow: isDark ? "#f0f" : "#ff2090",
      textShadow: isDark ? 
        "0 0 5px #f0f, 0 0 15px #f0f, 0 0 25px #f0f, 0 0 40px #f0f" : 
        "0 0 5px #ff2090, 0 0 15px #ff2090, 0 0 25px #ff2090, 0 0 35px #ff2090"
    },
    yellow: {
      glow: isDark ? "#ff0" : "#ffd020",
      textShadow: isDark ? 
        "0 0 5px #ff0, 0 0 15px #ff0, 0 0 25px #ff0, 0 0 40px #ff0" : 
        "0 0 5px #ffd020, 0 0 15px #ffd020, 0 0 25px #ffd020, 0 0 35px #ffd020"
    }
  };
  
  const sizeClasses = {
    xl: "text-xl md:text-2xl",
    "2xl": "text-2xl md:text-3xl",
    "3xl": "text-3xl md:text-4xl",
    "4xl": "text-4xl md:text-5xl"
  };
  
  return (
    <span 
      className={`font-bold tracking-wider ${sizeClasses[size]} ${className}`}
      style={{ 
        color: colorMap[color].glow,
        textShadow: colorMap[color].textShadow,
        transition: "all 0.3s ease"
      }}
    >
      {children}
    </span>
  );
};

// 赛博朋克卡片 - 支持主题
const CyberpunkCard = ({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode, 
  title: string, 
  description: string
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  
  return (
    <motion.div 
      className={`relative p-3 sm:p-4 md:p-6 border border-cyan-500/50 ${
        isDark ? 'bg-black/60' : 'bg-slate-900/75'
      } backdrop-blur-sm overflow-hidden rounded-lg`}
      whileHover={{ scale: 1.03, y: -5 }}
      transition={{ duration: 0.3 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
    >
      {/* 背景闪烁效果 */}
      <div className="absolute inset-0 opacity-30">
        {Array.from({ length: 4 }).map((_, index) => (
          <motion.div
            key={index}
            className={`absolute inset-0 bg-gradient-to-r from-transparent via-${isDark ? 'cyan' : 'blue'}-500/30 to-transparent`}
            initial={{ opacity: 0, left: "-100%" }}
            animate={isHovered ? {
              opacity: [0, 0.3, 0],
              left: ["-100%", "100%", "100%"]
            } : {}}
            transition={{
              repeat: isHovered ? Infinity : 0,
              duration: 1.5,
              ease: "easeInOut",
              delay: index * 0.4
            }}
          />
        ))}
      </div>
      
      {/* 内容 */}
      <div className="relative z-10">
        <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
          <div className={`p-1.5 sm:p-2 ${isDark ? 'bg-black/80' : 'bg-slate-800/90'} rounded-md border border-cyan-500/70 text-cyan-400`}>
            {icon}
          </div>
          <h3 className="text-base sm:text-lg font-bold text-white">{title}</h3>
        </div>
        <p className="text-xs sm:text-sm text-gray-300">{description}</p>
      </div>
      
      {/* 边缘霓虹灯效果 */}
      <motion.div 
        className="absolute inset-0 rounded-lg pointer-events-none"
        initial={{ opacity: 0.5 }}
        animate={isHovered ? { opacity: 1 } : { opacity: 0.5 }}
        style={{ 
          boxShadow: isDark ? 
            "inset 0 0 15px rgba(0, 255, 255, 0.3)" : 
            "inset 0 0 15px rgba(32, 208, 255, 0.3)",
        }}
      />
      
      {/* 角落装饰 */}
      <div className="absolute top-0 right-0 w-12 sm:w-16 h-12 sm:h-16 overflow-hidden opacity-60">
        <div className="absolute top-0 right-0 h-px w-8 sm:w-12 bg-cyan-400" />
        <div className="absolute top-0 right-0 h-8 sm:h-12 w-px bg-cyan-400" />
      </div>
      <div className="absolute bottom-0 left-0 w-12 sm:w-16 h-12 sm:h-16 overflow-hidden opacity-60">
        <div className="absolute bottom-0 left-0 h-px w-8 sm:w-12 bg-pink-500" />
        <div className="absolute bottom-0 left-0 h-8 sm:h-12 w-px bg-pink-500" />
      </div>
    </motion.div>
  );
};

// 赛博朋克背景 - 适配TabletScroll容器
const CyberpunkBackground = () => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
      {/* 背景渐变 */}
      <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-b from-black via-blue-950/30 to-black' : 'bg-gradient-to-b from-slate-900 via-blue-900/20 to-slate-900'}`} />
      
      {/* 网格线效果 */}
      <div className="absolute inset-0 overflow-hidden opacity-40">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.2)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>
      
      {/* 扫描线动画 */}
      <motion.div
        className="absolute inset-0 z-10 opacity-10 pointer-events-none"
        animate={{
          backgroundPosition: ["0px 0px", "0px 100vh"]
        }}
        transition={{
          ease: "linear",
          duration: 10,
          repeat: Infinity,
        }}
        style={{
          backgroundImage: "linear-gradient(to bottom, transparent, rgba(6, 182, 212, 0.2) 50%, transparent)",
          backgroundSize: "100% 10px",
        }}
      />
      
      {/* 底部发光效果 - 简化 */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-cyan-500/10 to-transparent" />
    </div>
  );
};

// 为底部装饰元素添加悬停交互效果
const CyberWave = () => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div 
      className="absolute bottom-0 left-0 right-0 h-12 overflow-hidden z-10 pointer-events-none"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <motion.div 
        className="absolute bottom-0 left-0 right-0"
        animate={isHovered ? 
          { height: '2px', opacity: 0.9 } : 
          { height: '1px', opacity: 0.7 }
        }
        transition={{ duration: 0.3 }}
        style={{
          background: `linear-gradient(to right, transparent, ${isDark ? '#0ff' : '#20d0ff'} 50%, transparent)`
        }}
      />
      
      {/* 悬停时显示波浪动画 */}
      {isHovered && (
        <motion.div 
          className="absolute bottom-0 left-0 right-0 h-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          exit={{ opacity: 0 }}
        >
          <svg width="100%" height="100%" viewBox="0 0 1200 100" preserveAspectRatio="none">
            <motion.path 
              d="M0,50 C150,20 350,80 600,50 C850,20 1050,80 1200,50 L1200,100 L0,100 Z"
              fill={isDark ? "rgba(0, 255, 255, 0.15)" : "rgba(32, 208, 255, 0.15)"}
              animate={{
                d: [
                  "M0,50 C150,20 350,80 600,50 C850,20 1050,80 1200,50 L1200,100 L0,100 Z",
                  "M0,50 C150,80 350,20 600,50 C850,80 1050,20 1200,50 L1200,100 L0,100 Z",
                  "M0,50 C150,20 350,80 600,50 C850,20 1050,80 1200,50 L1200,100 L0,100 Z"
                ]
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </svg>
        </motion.div>
      )}
    </motion.div>
  );
};

// 扫描线动画
const ScanlineEffect = () => {
  return (
    <motion.div 
      className="absolute top-0 left-0 right-0 h-[2px] bg-cyan-500/50 z-20"
      style={{
        boxShadow: "0 0 15px 5px rgba(0,255,255,0.3)"
      }}
      animate={{ 
        y: ["-100vh", "100vh"],
      }}
      transition={{ 
        repeat: Infinity,
        duration: 4,
        ease: "linear"
      }}
    />
  );
};

// 头像区域组件 - 添加悬停交互效果
const AvatarSection = () => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div 
      className="relative w-48 h-48 mx-auto cursor-pointer"
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* 扫描框 */}
      <div className="absolute inset-0 rounded-full overflow-hidden border-2 border-cyan-500">
        {/* 头像图片 */}
        <div className="w-full h-full relative overflow-hidden">
          <motion.img
            src="/avatar/技术苦行僧.png"
            alt="Avatar"
            className="w-full h-full object-cover"
            animate={isHovered ? { scale: 1.08 } : { scale: 1 }}
            transition={{ duration: 0.3 }}
          />
          
          {/* 扫描线 */}
          <motion.div 
            className="absolute top-0 left-0 w-full h-2 bg-gradient-to-b from-cyan-500 to-transparent z-20"
            animate={isHovered ? { 
              y: [0, 190, 0],
              opacity: 0.8,
              height: 4
            } : { 
              y: [0, 190, 0],
              opacity: 0.6,
              height: 2
            }}
            transition={{ 
              y: { duration: isHovered ? 2 : 4, repeat: Infinity, ease: "linear" },
              opacity: { duration: 0.3 },
              height: { duration: 0.3 }
            }}
            style={{
              boxShadow: isDark ? 
                `0 0 ${isHovered ? '15px' : '10px'} #0ff, 0 0 ${isHovered ? '30px' : '20px'} #0ff` : 
                `0 0 ${isHovered ? '15px' : '10px'} #20d0ff, 0 0 ${isHovered ? '30px' : '20px'} #20d0ff`
            }}
          />
          
          {/* 光晕效果 - 增强悬停时的发光 */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent"
            animate={{ opacity: isHovered ? 0.9 : 0.7 }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>
      
      {/* 角落装饰 - 悬停时移动 */}
      <motion.div 
        className="absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2 border-pink-500"
        animate={isHovered ? { top: -4, left: -4, borderWidth: 3 } : { top: -8, left: -8, borderWidth: 2 }}
        transition={{ duration: 0.3 }}
      />
      <motion.div 
        className="absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2 border-cyan-500"
        animate={isHovered ? { bottom: -4, right: -4, borderWidth: 3 } : { bottom: -8, right: -8, borderWidth: 2 }}
        transition={{ duration: 0.3 }}
      />
      
      {/* 悬停时显示的圆形光环 */}
      {isHovered && (
        <motion.div 
          className="absolute inset-0 rounded-full pointer-events-none"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1.2 }}
          exit={{ opacity: 0, scale: 1.1 }}
          style={{ 
            border: `1px solid ${isDark ? '#0ff' : '#20d0ff'}`,
            boxShadow: `0 0 15px ${isDark ? 'rgba(0, 255, 255, 0.4)' : 'rgba(32, 208, 255, 0.4)'}`,
          }}
        />
      )}
    </motion.div>
  );
};

export function HeroScrollDemo() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  
  // 内容区域组件 - 实际展示在TabletScroll内部
  const CyberpunkContent = () => {
    // 跟踪鼠标位置，用于实现悬停互动效果
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    
    // 处理鼠标移动
    const handleMouseMove = (e: React.MouseEvent) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      setMousePosition({ x, y });
    };
    
    return (
      <div 
        className={`relative w-full ${isDark ? 'text-white' : 'text-gray-100'}`}
        onMouseMove={handleMouseMove}
      >
        {/* 动态光标跟随效果 */}
        <motion.div 
          className="pointer-events-none absolute z-20 rounded-full"
          animate={{
            x: mousePosition.x * 100 + "%",
            y: mousePosition.y * 100 + "%",
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{
            x: { duration: 0.3, ease: "easeOut" },
            y: { duration: 0.3, ease: "easeOut" },
            scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
            opacity: { duration: 3, repeat: Infinity, ease: "easeInOut" }
          }}
          style={{
            width: "150px",
            height: "150px",
            background: `radial-gradient(circle, ${isDark ? 'rgba(0, 255, 255, 0.15)' : 'rgba(32, 208, 255, 0.15)'} 0%, transparent 70%)`,
            transform: "translate(-50%, -50%)",
            mixBlendMode: "screen"
          }}
        />
        
        <CyberpunkBackground />
        
        <div className="relative z-10 w-full max-w-3xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
          {/* 头像部分 - 移到内容顶部 */}
          <div className="mb-6 flex justify-center">
            <div className="relative w-48 h-48 mx-auto">
              {/* 扫描框 */}
              <div className="absolute inset-0 rounded-full overflow-hidden border-2 border-cyan-500">
                {/* 头像图片 */}
                <div className="w-full h-full relative overflow-hidden">
                  <img
                    src="/avatar/技术苦行僧.png"
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                  
                  {/* 扫描线 */}
                  <motion.div 
                    className="absolute top-0 left-0 w-full h-2 bg-gradient-to-b from-cyan-500 to-transparent z-20"
                    animate={{ 
                      y: [0, 190, 0],
                    }}
                    transition={{ 
                      duration: 4, 
                      repeat: Infinity,
                      ease: "linear" 
                    }}
                    style={{
                      boxShadow: isDark ? 
                        "0 0 10px #0ff, 0 0 20px #0ff" : 
                        "0 0 10px #20d0ff, 0 0 20px #20d0ff"
                    }}
                  />
                  
                  {/* 光晕效果 */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent opacity-70" />
                </div>
              </div>
              
              {/* 角落装饰 */}
              <div className="absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2 border-pink-500" />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2 border-cyan-500" />
            </div>
          </div>
          
          {/* 名字标题和职位 */}
          <div className="flex flex-col items-center justify-center">
            <NeonText color="cyan" size="3xl" className="mb-2 sm:mb-3 w-full text-center">王起哲</NeonText>
            
            <div className={`${isDark ? 'bg-black/70' : 'bg-slate-900/80'} px-1 sm:px-2 py-1 sm:py-2 mb-4 sm:mb-6 border-t border-b border-cyan-500/50 w-auto`}>
              <GlitchText>
                <span className="text-lg sm:text-xl tracking-wider font-mono text-cyan-400">全栈工程师 / 系统架构师</span>
              </GlitchText>
            </div>
            
            <p className="text-cyan-300 text-center text-sm sm:text-base max-w-2xl mx-auto mb-6 sm:mb-8 leading-relaxed">
              专注于创建高性能、优雅且富有创意的数字体验。我热衷于将复杂的技术问题转化为简洁直观的解决方案，追求极致的用户体验与系统性能。
            </p>
          </div>
          
          {/* 个人专长概述 - 添加悬停效果 */}
          <div className="mb-6 sm:mb-8">
            <motion.div 
              className={`p-4 sm:p-5 ${isDark ? 'bg-black/60' : 'bg-slate-900/75'} border border-cyan-500/50 rounded-lg relative overflow-hidden`}
              whileHover={{ 
                boxShadow: isDark ? 
                  "0 0 15px rgba(0, 255, 255, 0.3)" : 
                  "0 0 15px rgba(32, 208, 255, 0.3)",
                borderColor: isDark ? "rgba(0, 255, 255, 0.7)" : "rgba(32, 208, 255, 0.7)"
              }}
              transition={{ duration: 0.3 }}
            >
              {/* 悬停时显示的背景动画 */}
              <motion.div 
                className="absolute inset-0 pointer-events-none"
                initial={false}
                whileHover={{
                  background: [
                    "radial-gradient(circle at 20% 30%, rgba(0, 255, 255, 0.05) 0%, transparent 50%)",
                    "radial-gradient(circle at 50% 80%, rgba(0, 255, 255, 0.08) 0%, transparent 50%)",
                    "radial-gradient(circle at 80% 40%, rgba(0, 255, 255, 0.05) 0%, transparent 50%)"
                  ]
                }}
                transition={{
                  background: {
                    duration: 5,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }
                }}
              />
              
              <motion.h3 
                className="text-lg sm:text-xl font-bold mb-2 text-cyan-400 relative"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
              >
                个人简介
                <motion.span 
                  className="absolute -bottom-1 left-0 h-[1px] bg-cyan-500/60" 
                  initial={{ width: "0%" }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.5 }}
                />
              </motion.h3>
              
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed mb-3 relative z-10">
                拥有8年全栈开发经验，专注于构建高可用性系统架构。精通前端框架如React和Vue，以及后端技术如Node.js和Python。善于解决复杂问题，热衷于技术创新与团队协作。
              </p>
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed relative z-10">
                在分布式系统、高性能应用开发和用户体验优化方面有深入研究。对新技术保持高度热情，不断探索行业最佳实践。
              </p>
            </motion.div>
          </div>
          
          {/* 联系方式 */}
          <div className="flex justify-center gap-6 sm:gap-8 mb-8 sm:mb-12">
            <motion.a
              href="mailto:contact@example.com"
              className={`p-2 sm:p-3 ${isDark ? 'bg-black/80' : 'bg-slate-900/90'} rounded-full border border-pink-500/70 text-pink-400`}
              style={{
                boxShadow: isDark ? 
                  "0 0 10px rgba(255,0,255,0.3)" : 
                  "0 0 10px rgba(255,32,144,0.3)"
              }}
              whileHover={{ 
                scale: 1.1,
                boxShadow: isDark ? 
                  "0 0 20px rgba(255,0,255,0.6)" : 
                  "0 0 20px rgba(255,32,144,0.6)"
              }}
              whileTap={{ scale: 0.95 }}
            >
              <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
            </motion.a>
            
            <motion.a
              href="https://github.com/username"
              target="_blank"
              rel="noopener noreferrer"
              className={`p-2 sm:p-3 ${isDark ? 'bg-black/80' : 'bg-slate-900/90'} rounded-full border border-cyan-500/70 text-cyan-400`}
              style={{
                boxShadow: isDark ? 
                  "0 0 10px rgba(0,255,255,0.3)" : 
                  "0 0 10px rgba(32,208,255,0.3)"
              }}
              whileHover={{ 
                scale: 1.1,
                boxShadow: isDark ? 
                  "0 0 20px rgba(0,255,255,0.6)" : 
                  "0 0 20px rgba(32,208,255,0.6)"
              }}
              whileTap={{ scale: 0.95 }}
            >
              <Github className="w-4 h-4 sm:w-5 sm:h-5" />
            </motion.a>
          </div>
          
          {/* 底部装饰 - 添加悬停效果 */}
          <motion.div 
            className="text-center relative max-w-md mx-auto mb-8"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <motion.div 
              className="absolute left-0 top-1/2 h-[1px] w-16 bg-gradient-to-r from-cyan-500 to-transparent"
              whileHover={{ width: 24, x: -4 }}
              transition={{ type: "spring", stiffness: 300 }}
            />
            <motion.div 
              className="absolute right-0 top-1/2 h-[1px] w-16 bg-gradient-to-l from-pink-500 to-transparent"
              whileHover={{ width: 24, x: 4 }}
              transition={{ type: "spring", stiffness: 300 }}
            />
            <motion.p 
              className="text-gray-400 text-xs font-mono"
              whileHover={{ 
                color: isDark ? "#0ff" : "#20d0ff",
                textShadow: isDark ? "0 0 5px rgba(0, 255, 255, 0.7)" : "0 0 5px rgba(32, 208, 255, 0.7)"
              }}
            >
              <GlitchText intensity={0.5}>SYSTEM.STATUS: OPERATIONAL</GlitchText>
            </motion.p>
          </motion.div>
          
          {/* 简化的底部动态效果 */}
          <CyberWave />
        </div>
        
        {/* 扫描线动画 */}
        <ScanlineEffect />
      </div>
    );
  };

  return (
    <TabletScroll
      titleComponent={
        <h2 className="text-4xl font-bold text-transparent">关于我</h2>
      }
    >
      <CyberpunkContent />
    </TabletScroll>
  );
} 
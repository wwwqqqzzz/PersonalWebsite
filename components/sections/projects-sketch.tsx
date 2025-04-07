"use client";

import React, { forwardRef, useRef, useState, useEffect } from "react";
import { motion, useInView, useAnimation, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useTheme } from "next-themes";

// 项目数据 - 与timeline组件共用数据
const projectItems = [
  {
    year: "2025",
    title: "智能对话平台 (LLM)",
    description: "基于大型语言模型构建的企业级智能对话平台，集成了多个开源和商业LLM模型如GPT-4、Claude和开源Llama2。系统支持知识库检索增强生成(RAG)，实现了上下文记忆与多轮对话能力。同时提供了API接口和SDK，方便企业内部系统集成，已在客服、内部知识问答等场景中取得显著成效，节约人力成本超过60%。",
    images: [
      "https://images.unsplash.com/photo-1677442135968-6704dfb1e9b5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1684391249199-f1d62a7ab387?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
    ],
    tags: ["LLM", "RAG", "NLP", "Python", "向量数据库"]
  },
  {
    year: "2025",
    title: "企业级中后台管理系统 (Vue + Spring Boot)",
    description: "采用Vue3和Spring Boot构建的企业级中后台管理系统，前端使用Element Plus和Vite，后端基于Spring Boot 2.7和MyBatis Plus。系统实现了RBAC权限控制、操作日志、数据权限等企业级功能。采用前后端分离架构，支持Docker一键部署，具备高度的可扩展性。该系统已在多个企业内部使用，大幅提升了业务处理效率和IT管理水平。",
    images: [
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2015&q=80",
      "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
    ],
    tags: ["Vue3", "Spring Boot", "Element Plus", "MyBatis", "前后端分离"]
  },
  {
    year: "2024",
    title: "数据可视化分析平台 (React)",
    description: "基于React 18和Ant Design开发的大规模数据可视化分析平台，集成了ECharts、D3.js等多种可视化库，实现了复杂数据的图表展示、钻取分析和实时监控。系统采用Redux Toolkit管理状态，React Query处理数据请求，支持拖拽式大屏设计，内置数十种可视化组件。该平台已应用于电商、金融等多个领域的业务分析，帮助客户提升了40%的决策效率。",
    images: [
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1551503766-ac63dfa6401c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
    ],
    tags: ["React", "Ant Design", "ECharts", "数据可视化", "Redux"]
  },
  {
    year: "2024",
    title: "电商社区应用 (Next.js)",
    description: "采用Next.js 13和TypeScript打造的现代电商社区应用，结合了社区互动和电商功能，实现了SSR服务端渲染和ISR增量静态再生成。前端使用TailwindCSS构建响应式UI，集成了Stripe支付系统。使用Prisma ORM连接PostgreSQL数据库，实现了高效的数据操作。系统支持内容分享、社交互动、商品展示与购买等功能，上线3个月内用户增长率达到200%。",
    images: [
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1887&q=80",
      "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
    ],
    tags: ["Next.js", "TypeScript", "TailwindCSS", "Prisma", "SSR"]
  },
  {
    year: "2023",
    title: "多平台跨端应用 (UniApp)",
    description: "基于UniApp框架开发的一款多平台跨端应用，使用Vue.js作为开发语言，一套代码同时适配iOS、Android、H5和小程序多个平台。应用整合了uView UI组件库，实现了移动端流畅的用户体验。采用Vuex管理全局状态，封装了统一的API请求层和缓存机制。系统已在教育培训行业广泛应用，帮助客户节省了70%的开发成本和上市时间。",
    images: [
      "https://images.unsplash.com/photo-1558655146-9f40138edfeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1964&q=80",
      "https://images.unsplash.com/photo-1626544827763-d516dce335e2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
    ],
    tags: ["UniApp", "跨端开发", "Vue", "小程序", "移动应用"]
  },
  {
    year: "2023",
    title: "企业DevOps平台 (运维)",
    description: "构建了一套完整的企业级DevOps平台，集成CI/CD流水线、容器编排、服务监控与告警、配置管理等功能。基于Kubernetes、Docker、Jenkins、Prometheus和Grafana等开源工具，实现了从代码提交到应用部署的全自动化。平台支持多环境管理、灰度发布和一键回滚，大幅提升了企业的开发效率和系统稳定性，平均发布时间从小时级缩短到分钟级，故障恢复时间缩短90%。",
    images: [
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2034&q=80",
      "https://images.unsplash.com/photo-1593720219276-0b1eacd0aef4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
    ],
    tags: ["DevOps", "Kubernetes", "Docker", "CI/CD", "自动化运维"]
  }
];

// 首先增强滤镜组件，添加毛笔墨水效果 - 但降低强度
const SketchFilters = () => (
  <svg width="0" height="0" className="absolute">
    <defs>
      {/* 墨水扩散效果 - 适当降低扩散强度 */}
      <filter id="ink-spread" x="-20%" y="-20%" width="140%" height="140%">
        <feTurbulence type="turbulence" baseFrequency="0.03" numOctaves="2" result="turbulence" />
        <feDisplacementMap in="SourceGraphic" in2="turbulence" scale="4" />
        <feGaussianBlur stdDeviation="1.2" />
      </filter>
      
      {/* 墨水边缘效果 - 更轻微的墨水渗透感 */}
      <filter id="ink-edges" x="-10%" y="-10%" width="120%" height="120%">
        <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" result="noise" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" xChannelSelector="R" yChannelSelector="G" />
        <feGaussianBlur stdDeviation="0.4" />
      </filter>

      {/* 特别为毛笔标题设计的墨迹效果 - 降低强度 */}
      <filter id="brush-stroke" x="-20%" y="-20%" width="140%" height="140%">
        <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="2" seed="5" result="turbulence" />
        <feDisplacementMap in="SourceGraphic" in2="turbulence" scale="5" />
        <feGaussianBlur stdDeviation="0.8" />
        <feComponentTransfer>
          <feFuncA type="linear" slope="1.5" intercept="-0.1" />
        </feComponentTransfer>
      </filter>
      
      {/* 毛笔干刷效果 - 更柔和 */}
      <filter id="dry-brush" x="-5%" y="-5%" width="110%" height="110%">
        <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="3" result="noise" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
        <feComponentTransfer>
          <feFuncR type="discrete" tableValues="0 0.3 0.6 0.9 1" />
          <feFuncG type="discrete" tableValues="0 0.3 0.6 0.9 1" />
          <feFuncB type="discrete" tableValues="0 0.3 0.6 0.9 1" />
        </feComponentTransfer>
      </filter>
      
      {/* 浓墨重彩效果 - 减轻强度 */}
      <filter id="heavy-ink" x="-5%" y="-5%" width="110%" height="110%">
        <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" result="noise" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" />
        <feGaussianBlur stdDeviation="0.3" />
        <feComponentTransfer>
          <feFuncA type="gamma" amplitude="1.2" exponent="0.7" offset="0" />
        </feComponentTransfer>
        <feMorphology operator="dilate" radius="0.2" />
      </filter>
      
      {/* 纸张纹理滤镜 - 保持轻微 */}
      <filter id="paper-texture" x="0%" y="0%" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" stitchTiles="stitch" result="noise" />
        <feColorMatrix type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 0.08 0" result="coloredNoise" />
        <feComposite operator="in" in="SourceGraphic" in2="coloredNoise" result="noisyImage" />
        <feComposite operator="over" in="noisyImage" in2="SourceGraphic" />
      </filter>
      
      {/* 手绘线条效果 - 更轻微 */}
      <filter id="pencil-sketch" x="-5%" y="-5%" width="110%" height="110%">
        <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="4" result="noise" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.5" />
        <feGaussianBlur stdDeviation="0.4" />
        <feComposite operator="in" in2="SourceGraphic" />
      </filter>
      
      {/* 墨水渗透效果 - 更温和 */}
      <filter id="ink-bleed" x="-5%" y="-5%" width="110%" height="110%">
        <feTurbulence type="turbulence" baseFrequency="0.04" numOctaves="2" seed="3" />
        <feDisplacementMap in="SourceGraphic" in2="turbulence" scale="2" />
        <feGaussianBlur stdDeviation="0.6" />
        <feComponentTransfer>
          <feFuncA type="table" tableValues="0 0.7 0.9 1" />
        </feComponentTransfer>
      </filter>
    </defs>
  </svg>
);

// 手绘风格的撕裂纸张效果组件
const TornPaperEdge = ({ position = "top" }: { position?: "top" | "bottom" }) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  
  // 为顶部和底部生成不同的撕裂路径
  const generateTearPath = () => {
    const width = 1200;
    const height = 60;
    const segments = 40;
    const segmentWidth = width / segments;
    
    let path = `M0,${position === "top" ? height : 0} `;
    
    for (let i = 0; i <= segments; i++) {
      const x = i * segmentWidth;
      const yVariation = Math.random() * height * 0.7;
      const y = position === "top" 
        ? height - yVariation 
        : yVariation;
      
      path += `L${x},${y} `;
    }
    
    path += `L${width},${position === "top" ? height : 0} L0,${position === "top" ? height : 0} Z`;
    return path;
  };
  
  return (
    <svg 
      className={`w-full h-12 md:h-16 ${position === "top" ? "-mb-1" : "-mt-1"} ${position === "bottom" ? "rotate-180" : ""}`}
      preserveAspectRatio="none" 
      viewBox="0 0 1200 60" 
      fill="none"
    >
      <path 
        d={generateTearPath()} 
        fill={isDark ? "#1f2937" : "#FFFFFF"}
        className="drop-shadow-md"
      />
    </svg>
  );
};

// 墨水滴溅装饰组件
const InkSplash = ({ className = "", scale = 1, rotation = 0 }: { className?: string, scale?: number, rotation?: number }) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  
  return (
    <div 
      className={`absolute w-16 h-16 pointer-events-none ${className}`} 
      style={{ 
        transform: `scale(${scale}) rotate(${rotation}deg)`,
        filter: 'url(#ink-spread)'
      }}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <path 
          d="M50,20 C65,5 85,15 90,40 C95,60 80,85 50,80 C20,85 5,60 10,40 C15,15 35,5 50,20 Z" 
          fill={isDark ? "#ffffff30" : "#00000030"} 
        />
      </svg>
    </div>
  );
};

// 创建一个新的毛笔笔触装饰组件 - 降低强度
const BrushStroke = ({ 
  className = "", 
  width = 200, 
  height = 20,
  color = ""
}: { 
  className?: string, 
  width?: number, 
  height?: number,
  color?: string 
}) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const strokeColor = color || (isDark ? "#d1d5db" : "#000000");
  
  // 生成不规则毛笔笔触路径 - 降低变化强度
  const generateBrushPath = () => {
    const strokeWidth = width;
    const strokeHeight = height;
    const midPoint = strokeWidth / 2;
    
    // 创建较平缓的毛笔路径点
    const startThickness = Math.random() * (strokeHeight * 0.3) + strokeHeight * 0.7;
    const midThickness1 = Math.random() * (strokeHeight * 0.4) + strokeHeight * 0.9;
    const midThickness2 = Math.random() * (strokeHeight * 0.5) + strokeHeight * 1.0;
    const endThickness = Math.random() * (strokeHeight * 0.3) + strokeHeight * 0.6;
    
    return `
      M0,${strokeHeight/2}
      C${midPoint*0.25},${strokeHeight/2 - startThickness/2} ${midPoint*0.25},${strokeHeight/2 + startThickness/2} 0,${strokeHeight/2}
      L${midPoint*0.3},${strokeHeight/2 - midThickness1/2}
      C${midPoint*0.5},${strokeHeight/2 - midThickness2/2} ${midPoint*0.5},${strokeHeight/2 + midThickness2/2} ${midPoint*0.3},${strokeHeight/2 + midThickness1/2}
      Z
      M${midPoint*0.3},${strokeHeight/2 - midThickness1/2}
      L${midPoint*1.3},${strokeHeight/2 - midThickness2/2}
      C${midPoint*1.5},${strokeHeight/2 - midThickness2*0.9/2} ${midPoint*1.5},${strokeHeight/2 + midThickness2*0.9/2} ${midPoint*1.3},${strokeHeight/2 + midThickness2/2}
      L${midPoint*0.3},${strokeHeight/2 + midThickness1/2}
      Z
    `;
  };
  
  return (
    <div className={`my-3 relative mx-auto ${className}`} style={{ width: `${width}px`, height: `${height}px` }}>
      <motion.div 
        className="w-full h-full"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        transition={{ duration: 1.2, ease: "circOut" }}
        style={{ transformOrigin: 'left center' }}
      >
        <svg 
          viewBox={`0 0 ${width} ${height}`} 
          className="w-full h-full"
          style={{ filter: 'url(#brush-stroke)' }}
        >
          <path 
            d={generateBrushPath()}
            fill={strokeColor}
            stroke="none"
          />
        </svg>
      </motion.div>
    </div>
  );
};

// 创建一个水墨飞溅组件
const InkSplatter = ({ 
  className = "", 
  size = 80, 
  rotation = 0 
}: { 
  className?: string, 
  size?: number, 
  rotation?: number 
}) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  
  // 随机生成多个不规则的墨点
  const generateSplatters = () => {
    const splatters = [];
    const count = Math.floor(Math.random() * 5) + 3; // 3-7个墨点
    
    for(let i = 0; i < count; i++) {
      const size = Math.random() * 15 + 5; // 5-20的大小
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const opacity = Math.random() * 0.4 + 0.1;
      
      splatters.push(
        <circle 
          key={i}
          cx={x} 
          cy={y} 
          r={size} 
          fill={isDark ? `rgba(255,255,255,${opacity})` : `rgba(0,0,0,${opacity})`}
        />
      );
    }
    
    return splatters;
  };
  
  return (
    <div 
      className={`absolute pointer-events-none ${className}`} 
      style={{ 
        width: `${size}px`,
        height: `${size}px`,
        transform: `rotate(${rotation}deg)`,
        filter: 'url(#ink-spread)'
      }}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {generateSplatters()}
      </svg>
    </div>
  );
};

// 添加回缺失的InkStroke组件，但减轻墨迹效果
const InkStroke = ({ className = "", width = 24, height = 3 }: { className?: string, width?: number, height?: number }) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  
  // 生成随机笔触路径，更平缓自然
  const generateStrokePath = () => {
    const strokeWidth = width * 4;
    const strokeHeight = height * 4;
    const midPoint = strokeWidth / 2;
    
    // 创建更适中的随机上下波动
    const randY1 = (Math.random() * 0.4 - 0.2) * strokeHeight;
    const randY2 = (Math.random() * 0.5 - 0.25) * strokeHeight;
    const randY3 = (Math.random() * 0.4 - 0.2) * strokeHeight;
    
    return `M0,${strokeHeight/2 + randY1} 
            C${midPoint*0.3},${strokeHeight/2 + randY2} 
            ${midPoint*0.7},${strokeHeight/2 + randY3} 
            ${midPoint},${strokeHeight/2 + randY2*0.5}
            S${midPoint*1.5},${strokeHeight/2 - randY1*0.5} 
            ${strokeWidth},${strokeHeight/2 + randY3*0.3}`;
  };
  
  return (
    <div className={`w-${width} h-${height} my-3 relative mx-auto ${className}`}>
      <motion.div 
        className="w-full h-full"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        transition={{ duration: 0.8, ease: "circOut" }}
        style={{ transformOrigin: 'left center' }}
      >
        <svg 
          viewBox={`0 0 ${width*4} ${height*4}`} 
          className="w-full h-full"
          style={{ filter: 'url(#ink-bleed)' }}
        >
          <path 
            d={generateStrokePath()}
            stroke={isDark ? "#d1d5db" : "#000000"}
            strokeWidth={height * 3.5}
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </motion.div>
    </div>
  );
};

// 添加回缺失的SketchTag组件
const SketchTag = ({ children }: { children: React.ReactNode }) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  
  // 创建微小的随机旋转角度，使标签看起来像手工贴上去的
  const rotation = React.useMemo(() => {
    return Math.random() * 4 - 2;
  }, []);
  
  return (
    <motion.div
      className="inline-block px-3 py-1 mr-2 mb-2 relative"
      initial={{ scale: 0.9, y: 10, opacity: 0 }}
      whileInView={{ scale: 1, y: 0, opacity: 1 }}
      whileHover={{ scale: 1.05, y: -5 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      {/* 背景 */}
      <div className={`absolute inset-0 ${isDark ? 'bg-amber-800' : 'bg-amber-200'} rounded-md`} 
           style={{ filter: 'url(#paper-texture)' }} />
      
      {/* 标签文字 */}
      <span className={`relative ${isDark ? 'text-gray-100' : 'text-black'} font-handwriting font-bold tracking-wide`}
            style={{ 
              filter: isDark ? 'url(#pencil-sketch)' : 'none',
              letterSpacing: '0.03em'
            }}>{children}</span>
      
      {/* 手绘边框 - 使用不规则的边框增强手绘感 */}
      <div className={`absolute inset-0 border-2 ${isDark ? 'border-gray-600' : 'border-black'} rounded-md`} 
           style={{ filter: 'url(#ink-edges)' }} />
    </motion.div>
  );
};

// 添加回缺失的PaperBackground组件
const PaperBackground = ({ children }: { children: React.ReactNode }) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  
  return (
    <div className="relative overflow-hidden">
      {/* 纸张背景 - 使用更鲜明的背景色，支持深色模式 */}
      <div className={`absolute inset-0 ${isDark ? 'bg-gray-900' : 'bg-white'}`} />
      
      {/* 纸张纹理 - 使用淡淡的纹理增强手绘感 */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23${isDark ? 'ffffff' : '000000'}' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>
      
      {/* 主要内容 */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

// 修改SketchProjectCard组件，降低手绘效果强度
const SketchProjectCard = ({ 
  project, 
  index,
  isActive,
  onClick
}: { 
  project: typeof projectItems[0], 
  index: number,
  isActive: boolean,
  onClick: () => void
}) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const controls = useAnimation();
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: false, amount: 0.3 });
  
  // 当卡片进入视图时执行动画
  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);
  
  // 随机旋转角度 - 稍微增加随机性
  const rotation = React.useMemo(() => {
    return (Math.random() * 3 - 1.5);
  }, []);
  
  // 创建一个引用，用于滚动到卡片顶部
  const cardTopRef = useRef<HTMLDivElement>(null);
  
  return (
    <motion.div
      ref={cardRef}
      className={`relative mb-8 cursor-pointer transform origin-center transition-all duration-500 ${isActive ? 'z-10 scale-[1.02]' : 'scale-100'}`}
      style={{ 
        transformStyle: 'preserve-3d',
        transform: `rotate(${rotation}deg)`,
        filter: isActive ? 'none' : 'url(#paper-texture)'
      }}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: { 
            duration: 0.6, 
            delay: index * 0.1,
            type: "spring",
            stiffness: 120,
            damping: 20
          } 
        }
      }}
      whileHover={{ 
        scale: 1.02, 
        boxShadow: isDark ? "0 10px 25px rgba(200,200,200,0.1)" : "0 10px 25px rgba(0,0,0,0.1)",
        rotate: 0
      }}
      transition={{ 
        duration: 0.3,
        type: "spring",
        stiffness: 300,
        damping: 10
      }}
      onClick={onClick}
    >
      {/* 添加顶部引用点 */}
      <div ref={cardTopRef} className="absolute top-0 left-0 w-0 h-0" />
    
      {/* 进一步减少装饰 - 只保留一个墨水飞溅效果 */}
      <InkSplash 
        className="top-[-8%] left-[80%]" 
        scale={0.7} 
        rotation={-5} 
      />
      
      {/* 主卡片内容 */}
      <div 
        className={`
          p-6 md:p-8
          ${isDark ? 'bg-gray-800 text-gray-100' : 'bg-white text-black'}
          ${isActive ? 'rounded-t-xl' : 'rounded-xl'}
          shadow-xl hover:shadow-xl transition-shadow duration-300
          border-2 ${isDark ? 'border-gray-700' : 'border-black'}
        `}
        style={{ filter: 'url(#ink-edges)' }}
      >
        {/* 年份标签 - 更加柔和 */}
        <div 
          className={`absolute -right-2 -top-3 px-4 py-2 ${isDark ? 'bg-amber-700' : 'bg-amber-300'} ${isDark ? 'text-white' : 'text-black'} font-handwriting text-xl rotate-1 shadow-sm border ${isDark ? 'border-gray-600' : 'border-black'}`}
          style={{ transform: `rotate(${Math.random() * 2 - 1}deg)` }}
        >
          {project.year}
        </div>
        
        {/* 标题区域 - 更加平滑 */}
        <div className="mb-4">
          <h3 
            className={`text-2xl md:text-3xl font-bold font-handwriting ${isDark ? 'text-gray-100' : 'text-black'} tracking-wide`}
            style={{ 
              letterSpacing: '0.02em',
              transform: `rotate(${Math.random() * 0.4 - 0.2}deg)`
            }}
          >
            {project.title}
          </h3>
          <InkStroke className="ml-0" width={24} height={3} />
        </div>
        
        {/* 项目描述 - 更加清晰 */}
        <p 
          className={`mb-6 text-base ${isDark ? 'text-gray-300' : 'text-black'} leading-relaxed font-handwriting font-medium`}
          style={{ letterSpacing: '0.01em' }}
        >
          {project.description}
        </p>
        
        {/* 技术标签 */}
        <div className="flex flex-wrap mb-4">
          {project.tags.map((tag, idx) => (
            <SketchTag key={idx}>{tag}</SketchTag>
          ))}
        </div>
        
        {/* 图片预览 */}
        <div className="mt-6 group relative">
          <div 
            className={`relative h-48 md:h-64 overflow-hidden rounded-md border-2 ${isDark ? 'border-gray-700' : 'border-black'} shadow-md`}
            style={{ filter: 'url(#ink-edges)' }}
          >
            <div 
              className={`absolute inset-0 border-2 ${isDark ? 'border-gray-600' : 'border-black'} rounded-md border-dashed`}
              style={{ filter: 'url(#pencil-sketch)' }}
            />
            <div className={`h-full w-full ${isActive ? 'scale-105' : 'group-hover:scale-105'} transition-transform duration-700`}>
              {project.images[0] && (
                <Image 
                  src={project.images[0]} 
                  alt={project.title}
                  fill
                  className="object-cover brightness-110 contrast-110"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              )}
            </div>
            
            {/* 更生动的图钉装饰 */}
            <div className={`absolute -top-3 -left-3 w-6 h-6 rounded-full bg-yellow-500 border-2 ${isDark ? 'border-gray-800' : 'border-black'} shadow-md`} 
                 style={{ filter: 'url(#pencil-sketch)' }} />
            <div className={`absolute -top-3 -right-3 w-6 h-6 rounded-full bg-red-500 border-2 ${isDark ? 'border-gray-800' : 'border-black'} shadow-md`}
                 style={{ filter: 'url(#pencil-sketch)' }} />
            <div className={`absolute -bottom-3 -left-3 w-6 h-6 rounded-full bg-blue-500 border-2 ${isDark ? 'border-gray-800' : 'border-black'} shadow-md`}
                 style={{ filter: 'url(#pencil-sketch)' }} />
            <div className={`absolute -bottom-3 -right-3 w-6 h-6 rounded-full bg-green-500 border-2 ${isDark ? 'border-gray-800' : 'border-black'} shadow-md`}
                 style={{ filter: 'url(#pencil-sketch)' }} />
          </div>
          
          {/* 更生动的手绘箭头 - 仅在非活跃状态下显示 */}
          {!isActive && (
            <motion.div 
              className={`absolute bottom-4 right-4 ${isDark ? 'text-white' : 'text-black'} font-bold font-handwriting text-lg`}
              initial={{ opacity: 0.8 }}
              animate={{ y: [0, 5, 0] }}
              transition={{ 
                y: { repeat: Infinity, duration: 1.5, ease: "easeInOut" },
                opacity: { duration: 0.2 }
              }}
            >
              <span 
                className={`px-3 py-1.5 ${isDark ? 'bg-amber-700' : 'bg-amber-300'} border-2 ${isDark ? 'border-gray-600' : 'border-black'} rounded-md shadow-sm`}
                style={{ filter: 'url(#pencil-sketch)', transform: `rotate(${Math.random() * 4 - 2}deg)` }}
              >点击展开 →</span>
            </motion.div>
          )}
        </div>
      </div>
      
      {/* 展开内容 - 只在活跃状态显示，进一步降低内容部分墨迹效果 */}
      <AnimatePresence>
        {isActive && (
          <motion.div 
            className={`p-6 md:p-8 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-800'} border-t-2 rounded-b-xl shadow-lg border-x-2 border-b-2`}
            style={{ filter: 'url(#paper-texture)' }}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* 详细说明和第二张图片 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 
                  className={`text-xl font-bold font-handwriting mb-3 ${isDark ? 'text-gray-200' : 'text-black'} underline`}
                  style={{ 
                    textDecoration: 'underline',
                    textDecorationStyle: 'wavy',
                    textUnderlineOffset: '3px'
                  }}
                >
                  项目亮点
                </h4>
                <ul className="space-y-2">
                  {project.description.split('。').filter(Boolean).map((point, idx) => (
                    <li key={idx} className="flex items-start">
                      <span 
                        className={`${isDark ? 'text-amber-500' : 'text-amber-700'} mr-2 font-bold text-lg`}
                      >•</span>
                      <span 
                        className={`${isDark ? 'text-gray-300' : 'text-black'} font-handwriting font-medium`}
                      >{point}。</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* 第二张图片 - 更简洁的边框 */}
              {project.images[1] && (
                <div 
                  className={`relative h-48 md:h-56 overflow-hidden rounded-md border ${isDark ? 'border-gray-700' : 'border-black'} shadow-md`}
                  style={{ transform: `rotate(${Math.random() * 1 - 0.5}deg)` }}
                >
                  <Image 
                    src={project.images[1]} 
                    alt={`${project.title} 详情`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  
                  {/* 图片上方贴纸风格标签 - 更简洁 */}
                  <div 
                    className={`absolute -top-2 -right-2 px-3 py-1 ${isDark ? 'bg-pink-700' : 'bg-pink-400'} transform rotate-3 font-handwriting text-sm ${isDark ? 'text-white' : 'text-black'} shadow border ${isDark ? 'border-gray-800' : 'border-black'}`}
                    style={{ transform: `rotate(${Math.random() * 3 - 5}deg)` }}
                  >
                    详情图
                  </div>
                </div>
              )}
            </div>
            
            {/* 修改收起按钮行为 - 更简洁的按钮样式 */}
            <motion.button
              className={`mt-6 inline-block px-5 py-2 ${isDark ? 'bg-amber-700 hover:bg-amber-600' : 'bg-amber-300 hover:bg-amber-400'} ${isDark ? 'text-white' : 'text-black'} font-handwriting font-bold rounded-md border ${isDark ? 'border-gray-600' : 'border-black'} transition-colors`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                // 修改这里，调用onClick函数来收起卡片
                onClick();
              }}
            >
              收起详情
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* 纸张阴影效果 - 降低阴影强度 */}
      <div className={`absolute inset-0 ${isDark ? 'bg-black/30' : 'bg-black/20'} -z-10 blur-md translate-y-2 scale-95 rounded-xl`} />
    </motion.div>
  );
};

interface ProjectsSketchProps {
  className?: string;
}

const ProjectsSketch = forwardRef<HTMLDivElement, ProjectsSketchProps>((props, ref) => {
  const [activeProject, setActiveProject] = useState<number | null>(null);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  
  // 点击项目卡片处理
  const handleCardClick = (index: number) => {
    if (activeProject === index) {
      setActiveProject(null);
    } else {
      setActiveProject(index);
    }
  };
  
  return (
    <div
      ref={ref}
      id="projects"
      className={`w-full relative overflow-hidden ${props.className || ''}`}
    >
      {/* SVG滤镜定义 */}
      <SketchFilters />
      
      {/* 手绘风格纸张背景 */}
      <PaperBackground>
        {/* 顶部撕裂纸张效果 */}
        <TornPaperEdge position="top" />
        
        <div 
          className={`py-16 md:py-20 px-4 sm:px-6 lg:px-8 ${isDark ? 'text-gray-200 bg-gray-900' : 'text-black bg-white'} shadow-xl rounded-lg border-2 ${isDark ? 'border-gray-700' : 'border-gray-200'}`}
          style={{ filter: 'url(#paper-texture)' }}
        >
          {/* 进一步减少装饰 - 只保留一个墨水飞溅效果 */}
          <div className="relative">
            <InkSplash 
              className="absolute top-[-40px] right-[15%]" 
              scale={1.0} 
              rotation={15} 
            />
          </div>
          
          {/* 修改标题区域，减少墨迹效果，更改标题文本 */}
          <div className="text-center mb-14 md:mb-16 relative">
            <div className="relative inline-block">
              {/* 标题背后的墨迹效果 - 降低不透明度 */}
              <div className="absolute -inset-6 opacity-10" style={{ filter: 'url(#ink-spread)' }}></div>
              
              <motion.h2 
                className={`text-4xl md:text-5xl font-bold font-handwriting relative inline-block ${isDark ? 'text-gray-100' : 'text-black'} tracking-wide`}
                style={{ 
                  textShadow: isDark ? 
                    "1px 1px 0 #1f2937, -1px -1px 0 #1f2937, 1px -1px 0 #1f2937, -1px 1px 0 #1f2937, 0 1px 3px rgba(255,255,255,0.2)" :
                    "1px 1px 0 #FFFFFF, -1px -1px 0 #FFFFFF, 1px -1px 0 #FFFFFF, -1px 1px 0 #FFFFFF, 0 1px 3px rgba(0,0,0,0.2)",
                  filter: 'url(#brush-stroke)',
                  letterSpacing: '0.08em',
                  transform: 'rotate(-0.5deg)',
                  WebkitTextStroke: isDark ? '0.5px rgba(255,255,255,0.15)' : '0.5px rgba(0,0,0,0.2)'
                }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, type: "spring" }}
              >
                我的项目
              </motion.h2>
            </div>
            
            {/* 墨迹效果的装饰线 - 减小宽度和高度 */}
            <div className="relative my-6">
              <BrushStroke 
                width={250} 
                height={20} 
                className="mx-auto" 
                color={isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.7)"}
              />
              
              {/* 减少墨点装饰数量 */}
              <div className="absolute -bottom-2 right-[38%] w-2 h-2 rounded-full bg-black dark:bg-white opacity-50"></div>
              <div className="absolute -bottom-1 right-[35%] w-1 h-1 rounded-full bg-black dark:bg-white opacity-30"></div>
            </div>
            
            {/* 副标题 - 减轻手写效果 */}
            <motion.p 
              className={`mt-6 max-w-2xl mx-auto ${isDark ? 'text-gray-300' : 'text-black'} font-handwriting text-base md:text-lg font-medium tracking-wide`}
              style={{ 
                letterSpacing: '0.03em',
                filter: 'url(#dry-brush)',
                textShadow: isDark ? '0 1px 1px rgba(255,255,255,0.1)' : '0 1px 1px rgba(0,0,0,0.1)'
              }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, type: "spring" }}
            >
              以下是我近年来参与开发的一些精选项目，点击卡片查看详情
            </motion.p>
          </div>
          
          {/* 卡片网格区域 */}
          <div className="max-w-4xl mx-auto">
            {projectItems.map((project, index) => (
              <SketchProjectCard 
                key={index}
                project={project}
                index={index}
                isActive={activeProject === index}
                onClick={() => handleCardClick(index)}
              />
            ))}
          </div>
          
          {/* 底部装饰笔记风格 */}
          <motion.div 
            className={`mt-16 max-w-md mx-auto p-4 ${isDark ? 'bg-amber-800' : 'bg-amber-200'} rotate-1 shadow-sm border-2 ${isDark ? 'border-gray-700' : 'border-black'}`}
            style={{ filter: 'url(#pencil-sketch)' }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <p 
              className={`text-center font-handwriting ${isDark ? 'text-gray-100' : 'text-black'} font-bold tracking-wider`}
              style={{ letterSpacing: '0.04em' }}
            >
              感谢您查看我的项目！如有合作意向，请通过"联系我"获取更多信息
            </p>
            
            {/* 手绘便签钉 */}
            <div className={`absolute -top-3 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gray-400 rounded-full border-2 ${isDark ? 'border-gray-700' : 'border-black'} shadow`} />
          </motion.div>
        </div>
        
        {/* 底部撕裂纸张效果 */}
        <TornPaperEdge position="bottom" />
      </PaperBackground>
    </div>
  );
});

ProjectsSketch.displayName = "ProjectsSketch";

export default ProjectsSketch; 
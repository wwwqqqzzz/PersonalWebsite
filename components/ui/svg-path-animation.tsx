"use client";

import React, { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface SVGPathAnimationProps {
  pathData: string;
  pathColor?: string;
  pathWidth?: number;
  duration?: number;
  scrollTriggerRef: React.RefObject<HTMLElement>;
  children?: React.ReactNode;
  startOffset?: string | number;
  endOffset?: string | number;
  showLine?: boolean;
  background?: boolean;
  className?: string;
}

export const SVGPathAnimation: React.FC<SVGPathAnimationProps> = ({
  pathData,
  pathColor = "#6366f1",
  pathWidth = 2,
  duration = 1.5,
  scrollTriggerRef,
  children,
  startOffset = "top 80%",
  endOffset = "bottom 20%",
  showLine = true,
  background = false,
  className = "",
}) => {
  const pathRef = useRef<SVGPathElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  
  // 计算路径长度，用于描绘动画
  useEffect(() => {
    if (!pathRef.current || !scrollTriggerRef.current) return;
    
    const path = pathRef.current;
    const pathLength = path.getTotalLength();
    
    // 设置初始状态
    path.style.strokeDasharray = `${pathLength}`;
    path.style.strokeDashoffset = `${pathLength}`;
    
    // 创建滚动触发动画
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: scrollTriggerRef.current,
        start: startOffset,
        end: endOffset,
        scrub: 0.3,
      }
    });
    
    // 路径绘制动画
    tl.to(path, {
      strokeDashoffset: 0,
      duration: duration,
      ease: "power2.out"
    });
    
    // 清理
    return () => {
      tl.kill();
    };
  }, [scrollTriggerRef, duration, startOffset, endOffset]);
  
  return (
    <div className={`relative ${className}`}>
      {/* 背景效果 */}
      {background && (
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent" />
      )}
      
      {/* SVG路径动画 */}
      <svg
        ref={svgRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        {showLine && (
          <path
            ref={pathRef}
            d={pathData}
            fill="none"
            stroke={pathColor}
            strokeWidth={pathWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              // 使用CSS变量方便后续JS操作
              '--path-length': '0',
              filter: `drop-shadow(0 0 3px ${pathColor})`
            } as React.CSSProperties}
          />
        )}
      </svg>
      
      {/* 子内容 */}
      {children}
    </div>
  );
};

// 预设路径数据
export const pathPresets = {
  // 连接线
  connection: "M10,50 C150,30 250,70 390,50",
  
  // 波浪线
  wave: "M0,50 C60,100 140,0 200,50 C260,100 340,0 400,50",
  
  // 螺旋线
  spiral: "M200,200 C150,150 300,50 200,100 C100,150 250,250 200,200 Z",
  
  // Z字形路径
  zigzag: "M10,10 L100,90 L190,10 L280,90 L370,10",
  
  // 圆形路径
  circle: "M200,15 A185,185 0 1,1 199,15 Z",
  
  // 半圆路径
  semicircle: "M10,100 A90,90 0 0,1 390,100",
  
  // 箭头路径
  arrow: "M20,80 L180,80 L180,40 L380,100 L180,160 L180,120 L20,120 Z",
  
  // 六边形
  hexagon: "M100,0 L300,0 L400,173 L300,346 L100,346 L0,173 Z"
};

// 顺时针环绕圆周路径
export const createCircularPath = (radius: number = 100, points: number = 8): string => {
  const center = { x: radius + 10, y: radius + 10 };
  let path = `M ${center.x + radius},${center.y} `;
  
  for (let i = 1; i <= points; i++) {
    const angle = (i * 2 * Math.PI / points);
    const x = center.x + radius * Math.cos(angle);
    const y = center.y + radius * Math.sin(angle);
    path += `L ${x},${y} `;
  }
  
  path += "Z";
  return path;
};

// 创建星形路径
export const createStarPath = (
  outerRadius: number = 100, 
  innerRadius: number = 40, 
  points: number = 5
): string => {
  const center = { x: outerRadius + 10, y: outerRadius + 10 };
  let path = "";
  
  for (let i = 0; i < points * 2; i++) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const angle = (i * Math.PI / points);
    const x = center.x + radius * Math.sin(angle);
    const y = center.y + radius * Math.cos(angle);
    
    if (i === 0) {
      path += `M ${x},${y} `;
    } else {
      path += `L ${x},${y} `;
    }
  }
  
  path += "Z";
  return path;
};

// 创建技能连接路径 - 可定制两点之间的路径
export const createConnectionPath = (
  startX: number, 
  startY: number, 
  endX: number, 
  endY: number, 
  curvature: number = 0.5
): string => {
  const midX = (startX + endX) / 2;
  const midY = startY + (endY - startY) * curvature;
  
  return `M ${startX},${startY} Q ${midX},${midY} ${endX},${endY}`;
};

export default SVGPathAnimation; 
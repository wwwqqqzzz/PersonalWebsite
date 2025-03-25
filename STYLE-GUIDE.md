# 视觉系统优化方案

## 1. 色彩系统
```javascript
// tailwind.config.js 扩展配置
theme: {
  extend: {
    colors: {
      primary: {
        DEFAULT: '#7C3AED',
        dark: '#5B21B6'
      },
      secondary: {
        DEFAULT: '#10B981',
        dark: '#059669'  
      },
      surface: {
        0: '#FFFFFF',
        1: '#F8FAFC',
        2: '#F1F5F9'
      }
    }
  }
}
```

## 2. 版式规范
```css
/* app/globals.css */
:root {
  --font-base: 'Inter', system-ui;
  --font-mono: 'Fira Code', monospace;
  --text-scale-ratio: 1.2;
  
  /* 标题阶梯 */
  --text-6xl: calc(3.052rem * var(--text-scale-ratio));
  --text-5xl: calc(2.441rem * var(--text-scale-ratio));
  --text-4xl: calc(1.953rem * var(--text-scale-ratio));
}
```

## 3. 核心组件规范

### 按钮组件 (components/ui/button.tsx)
```tsx
// 新增视觉状态
<Button
  className="transition-all duration-300 
  hover:scale-[1.02] hover:shadow-lg
  active:scale-95 active:shadow-none
  focus-visible:ring-2 ring-primary/50"
/>
```

### 项目卡片 (components/sections/projects-carousel.tsx)
```tsx
// 卡片悬停动效
<div className="group relative overflow-hidden rounded-xl border border-surface-2 bg-surface-1">
  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-surface-1/90"/>
  <img className="transition-transform duration-500 group-hover:scale-105" />
</div>
```

## 4. 动效策略
```bash
# 安装动画库
npm install framer-motion @heroicons/react
```

```tsx
// 示例：卡片入场动画
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, type: 'spring' }}
>
  {/* 卡片内容 */}
</motion.div>
```

## 5. 响应式策略
```javascript
// tailwind.config.js 断点配置
screens: {
  '3xl': '1920px',
  '2xl': '1536px',
  xl: '1280px',
  lg: '1024px',
  md: '768px',
  sm: '640px',
  xs: '480px'
}
```

## 实施路线图
1. 执行 `npm install framer-motion @heroicons/react`
2. 更新 tailwind 配置
3. 修改 globals.css 基础样式
4. 按顺序改造核心组件：
   - 导航栏
   - Hero 区域
   - 项目展示
   - 技能图表
   - 博客卡片

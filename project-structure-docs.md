# 个人作品集网站项目结构文档

## 项目概述

这是一个使用 Next.js 14 和 Tailwind CSS 构建的个人作品集网站，包含多种主题风格。项目采用了组件化结构，结合了多种动效库来创建丰富的用户体验。

## 核心组件结构

### 1. 页面导航/灵动岛 
**文件路径:** `components/navigation/index.tsx`
**功能描述:** 
- 实现灵动岛风格的导航界面
- 处理页面滚动和部分转换
- 提供视觉反馈和交互效果

### 2. 首页 - 极简风格
**文件路径:** `components/blocks/scroll-effect-demo.tsx`
**功能描述:**
- 实现极简主义设计风格的首页
- 包含粒子背景效果和流动线条动画
- 随滚动产生视差效果
- 对应路由: `/scroll-effect`

### 3. 关于我 - 多风格支持
**基础版本:** `components/sections/about-section.tsx`
**赛博朋克风格:** `components/sections/about-section-cyberpunk.tsx`
**视差效果版:** `components/sections/about-section-parallax.tsx`
**功能描述:**
- 展示个人信息和简介
- 赛博朋克风格包含霓虹灯效果和故障艺术
- 视差版使用 ContainerScroll 组件实现滚动动画
- 对应路由: `/about-cyberpunk`（赛博朋克版本）

### 4. 项目展示
**文件路径:** `components/sections/projects-timeline.tsx`
**手绘风格:** `components/sections/projects-sketch.tsx`
**功能描述:**
- 时间线形式展示项目经历
- 手绘风格使用笔触效果和纸张纹理
- 包含项目卡片和详情展示
- 对应路由: `/projects` 和 `/projects-sketch`

### 5. 技能展示
**文件路径:** `components/sections/skills-showcase.tsx`
**备选组件:** 
- `components/sections/skills-matrix.tsx`
- `components/sections/skills-spectrum.tsx`
**功能描述:**
- 以交互式卡片展示技能组合
- 包含技能等级指示器和详情模态框
- 提供分类展示和筛选功能

### 6. 博客部分
**文件路径:** `components/sections/blog-section.tsx`
**功能描述:**
- 展示博客文章列表和预览
- 包含 BlogParallax 和 BlogCard 子组件
- 提供分类和标签筛选
- 支持动态加载和过渡效果

### 7. 联系页面
**文件路径:** `components/sections/chat-contact.tsx`
**功能描述:**
- 模拟聊天界面的联系表单
- 包含消息气泡和输入区域
- 支持多种消息类型（文本、链接、图片）
- 提供快速回复建议

### 8. 页脚组件
**文件路径:** `components/sections/footer.tsx`
**功能描述:**
- 显示版权信息和社交媒体链接
- 使用动画效果增强交互体验
- 适配深色/浅色模式

## 通用UI组件

### 容器组件
- `components/ui/container.tsx` - 基础布局容器
- `components/ui/container-scroll-animation.tsx` - 滚动动画容器
- `components/ui/container-scroll-effect.tsx` - 增强版滚动效果

### 时间线组件
- `components/ui/timeline.tsx` - 通用时间线UI组件
- `components/blocks/timeline-demo.tsx` - 时间线演示组件

### 特效组件
- `components/ui/svg-path-animation.tsx` - SVG路径动画效果

## 页面路由结构

```
app/
├── page.tsx                    # 网站主页
├── about-cyberpunk/            # 赛博朋克风格关于页
│   └── page.tsx
├── projects/                   # 项目展示页
│   └── page.tsx
├── projects-sketch/            # 手绘风格项目页
│   └── page.tsx
├── scroll-demo/                # 滚动演示页
│   └── page.tsx
├── scroll-effect/              # 极简风格首页
│   └── page.tsx
├── timeline/                   # 时间线展示页
│   └── page.tsx
└── themes/                     # 主题选择页
    └── page.tsx
```

## 主题系统

网站支持多种视觉风格主题:

1. **极简风格** - 留白设计、专注内容和微妙动效
2. **赛博朋克风格** - 霓虹灯、故障艺术和未来主义视觉
3. **手绘风格** - 铅笔质感、纸张纹理和手写字体
4. **科技未来风** (待开发) - 3D几何体和HUD元素
5. **玻璃拟态UI** (待开发) - 毛玻璃效果和分层卡片
6. **复古终端风** (待开发) - 终端界面和打字机效果

## 动画与交互系统

项目使用多种动画技术:

- **Framer Motion** - 处理大部分UI动画和过渡效果
- **CSS动画** - 用于简单循环动画和悬停效果
- **Canvas API** - 用于粒子效果和复杂背景动画
- **SVG动画** - 用于路径动画和图形变形

## 待办事项

详见 `todo.md` 文件，其中列出了:
- 已完成的功能和主题
- 需要修复的问题
- 待实现的主题和功能
- 系统优化计划

## 注意事项

1. 项目结构较为复杂，部分功能存在多个实现版本
2. 某些组件间存在依赖关系，修改时需谨慎
3. 主题切换功能尚未完全实现，目前通过不同路由访问不同风格 
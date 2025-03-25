# 个人作品集网站

这是一个使用 Next.js 和 Tailwind CSS 构建的个人作品集网站。

## 仓库信息

- 远程仓库地址：https://github.com/wwwqqqzzz/PersonalWebsite.git

## 技术栈

- Next.js 14
- TypeScript
- Tailwind CSS
- Framer Motion
- Radix UI

## 开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

## 构建

```bash
# 构建生产版本
npm run build

# 启动生产服务器
npm start
```

# Portfolio 项目

## 资源准备

### 头像图片
- 请将技术苦行僧的照片放在 `public/avatar/技术苦行僧.png`
  - 建议使用尺寸较大的照片(建议最少200x200像素)，以便实现放大镜效果
  - 头像经过性能优化，动画极其丝滑流畅，无卡顿现象

### 背景图片
- 已创建的SVG背景图层：
  - `public/background/layer-dots.svg` - 圆点图案
  - `public/background/layer-grid.svg` - 网格图案

## 效果说明

- **技术苦行僧头像动态效果**：头像照片会随着鼠标移动显示不同区域，实现类似放大镜的效果
- 特点：
  - 使用弹簧动画系统(spring)，确保极致丝滑的动画体验
  - 采用硬件加速和性能优化技术，消除卡顿
  - 微妙的3D倾斜和简约的视觉提示
- **About 页面动态背景效果**：背景图片会随着鼠标移动显示不同区域，并带有平滑的跟随效果
- 通过多层视差效果增强立体感，光晕会跟随鼠标移动创建沉浸式体验

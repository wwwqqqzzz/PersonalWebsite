# 项目组件路径映射

## 核心组件路径

| 页面/功能 | 组件文件路径 |
|----------|------------|
| 头部(灵动岛) | components/navigation/index.tsx |
| 首页 | components/blocks/scroll-effect-demo.tsx |
| 关于我 | components/blocks/hero-scroll-demo/index.tsx |
| 项目 | components/sections/projects-timeline.tsx |
| 技能 | components/sections/skills-showcase.tsx |
| 博客 | components/sections/blog-section.tsx |
| 联系 | components/sections/chat-contact.tsx |
| 页脚 | components/sections/footer.tsx |

## 重要提示

- 修改页面内容时，请确保对应到正确的组件文件
- 首页和关于我页面使用不同的组件文件实现不同的风格
- 关于我页面采用赛博朋克风格，位于hero-scroll-demo/index.tsx
- 某些组件可能依赖于UI通用组件，请注意依赖关系

## 特殊路由

| 页面 | 路由路径 | 引用组件 |
|------|---------|---------|
| 首页 | / | app/page.tsx |
| 赛博朋克页面 | /about-cyberpunk | app/about-cyberpunk/page.tsx |

请在修改任何组件前，务必确认是在操作正确的文件。 
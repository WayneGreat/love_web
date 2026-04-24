## Context

全新项目，无现有代码库。目标是在 `/root/project/love_web` 下创建一个纯前端的周年纪念日网站，可部署到 GitHub Pages。网站核心功能：竖向吸附滚动时间轴 + 底部互动信封 + 背景音乐 + 浪漫氛围。所有内容通过配置文件管理，无需后端。

## Goals / Non-Goals

**Goals:**
- 实现完整可运行的周年纪念日网站，打开即用
- 时间轴每屏一个时间点，滚轮翻动自动吸附
- 信封组件有流畅的打开动画，展示信件内容
- 浪漫温馨的视觉风格，包含粒子效果和渐变背景
- 背景音乐自动/手动播放
- 所有内容集中配置，修改配置即可定制
- 构建产物为纯静态文件，可直接部署 GitHub Pages

**Non-Goals:**
- 不做后端服务、数据库、用户登录
- 不做响应式适配以外的移动端特殊优化
- 不做 SEO、PWA、离线缓存
- 不做多语言支持

## Decisions

### 1. 技术栈：React + Vite + Tailwind CSS + Framer Motion

**选择**: React 18 + Vite + Tailwind CSS + Framer Motion

**理由**:
- React 生态成熟，组件化适合时间轴/信封等独立功能模块
- Vite 构建快、配置简单，零配置支持 GitHub Pages 部署
- Tailwind CSS 可以快速搭建温馨配色，utility-first 避免样式冲突
- Framer Motion 声明式 API 适合滚动吸附、信封翻盖等动画，比 GSAP 更 React-friendly

**备选**:
- Vue + GSAP：GSAP 滚动动画强大，但与 Vue 3 Composition API 结合不如 Framer Motion 与 React 结合自然
- 纯 HTML/CSS/JS：更轻量，但组件化和配置管理不如框架方便

### 2. 滚动方案：CSS scroll-snap + Framer Motion

**选择**: `scroll-snap-type: y mandatory` 实现竖向吸附，Framer Motion 处理时间点进入/离开的动画

**理由**:
- CSS scroll-snap 原生支持、性能好、自动吸附
- Framer Motion 的 `useInView` 或 `whileInView` 处理每个时间点进入视口时的动画效果
- 无需引入 GSAP ScrollTrigger，减少依赖

### 3. 信封实现：纯 CSS + Framer Motion

**选择**: CSS 绘制信封（div + border/pseudo-element），Framer Motion 控制翻盖和信纸动画

**理由**:
- 纯 CSS 信封无需图片依赖，可通过主题配置变色
- `rotateX` 翻盖 + `translateY` 信纸滑出，Framer Motion 控制时序
- 简单可靠，不引入额外 3D 库

### 4. 粒子效果：tsparticles

**选择**: @tsparticles/react + @tsparticles/slim（轻量预设）

**理由**:
- 成熟的 React 粒子库，内置多种形状（爱心、圆形等）
- slim 预设体积小，包含基础效果够用
- 可通过配置文件控制粒子类型、数量、速度

**备选**:
- 纯 CSS 动画：更轻但效果有限，难以实现复杂的飘落物理效果
- canvas 手写：灵活但开发成本高

### 5. 配置管理：src/config.ts

**选择**: 单一 TypeScript 配置文件 `src/config.ts`，导出类型化的配置对象

**理由**:
- 零依赖，TypeScript 类型检查防错
- 所有内容集中一处，修改方便
- 图片资源放在 `public/images/` 目录，配置中引用相对路径

### 6. 部署：Vite 静态构建 + GitHub Pages

**选择**: `vite build` 输出到 `dist/`，配置 `base` 路径适配 GitHub Pages

**理由**:
- Vite 原生支持 `base` 配置
- 静态文件直接 push 到 gh-pages 分支即可
- 无需 CI/CD，手动部署即可满足需求

## Risks / Trade-offs

- **[移动端体验]** scroll-snap 在部分旧版移动浏览器表现不一致 → 测试主流浏览器，必要时添加 touch 事件兼容
- **[音乐自动播放]** 浏览器策略阻止自动播放 → 首次用户交互后启动播放，提供显式播放按钮
- **[图片加载]** 大图可能导致滚动卡顿 → 使用适当压缩的图片，添加 loading="lazy"
- **[tsparticles 体积]** 粒子库增加 bundle 体积 → 使用 slim 预设而非 full，约 40KB gzipped
- **[信封动画兼容性]** `rotateX` 3D 变换在旧浏览器可能不生效 → 使用 `will-change: transform` 优化，降级为简单展开

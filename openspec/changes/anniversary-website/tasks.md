## 1. 项目初始化

- [ ] 1.1 使用 Vite 创建 React + TypeScript 项目（`npm create vite@latest`）
- [ ] 1.2 安装依赖：tailwindcss, @tailwindcss/vite, framer-motion, @tsparticles/react, @tsparticles/slim
- [ ] 1.3 配置 Tailwind CSS（tailwind.config.js + @tailwindcss/vite 插件）
- [ ] 1.4 配置 Vite base 路径适配 GitHub Pages
- [ ] 1.5 创建 `public/images/` 目录，放入示例图片
- [ ] 1.6 引入 Google Fonts（Dancing Script 手写字体）

## 2. 配置模块

- [ ] 2.1 创建 `src/config.ts`，定义类型化的 SiteConfig 接口（bgMusic, themeColor, timeline, letter）
- [ ] 2.2 填入示例配置数据（3-4 个时间点 + 信件文字 + 音乐地址）

## 3. 浪漫主题系统

- [ ] 3.1 创建 `src/components/ParticleBackground.tsx`，使用 @tsparticles/react + @tsparticles/slim 实现飘落爱心/花瓣粒子
- [ ] 3.2 在 `src/index.css` 中定义粉色渐变全局背景样式
- [ ] 3.3 配置 Tailwind 自定义颜色（粉色系 palette）和手写字体
- [ ] 3.4 在 App 布局中集成粒子背景层和渐变背景

## 4. 时间轴组件

- [ ] 4.1 创建 `src/components/TimelineSection.tsx`，单条时间点组件（date, title, desc, image），使用 scroll-snap-align: start 对齐
- [ ] 4.2 创建 `src/components/Timeline.tsx`，遍历配置数据渲染 TimelineSection 列表，容器使用 scroll-snap-type: y mandatory
- [ ] 4.3 使用 Framer Motion `whileInView` 为每个时间点的标题、描述、图片添加进入/离开动画
- [ ] 4.4 创建 `src/components/TimelineNav.tsx`，侧边导航圆点，点击可跳转到对应时间点，当前位置高亮
- [ ] 4.5 使用 IntersectionObserver 或 Framer Motion `useInView` 检测当前可见时间点，同步导航圆点状态

## 5. 信封组件

- [ ] 5.1 创建 `src/components/LetterEnvelope.tsx`，CSS 绘制信封外观（信封体 + 翻盖 + 信纸）
- [ ] 5.2 实现 open/closed 状态切换，点击信封触发 open
- [ ] 5.3 使用 Framer Motion 实现翻盖动画（rotateX 0→180deg）
- [ ] 5.4 使用 Framer Motion 实现信纸滑出动画（translateY + staggerDelay，翻盖完成后触发）
- [ ] 5.5 信纸展示配置中的 letter 文字，使用手写字体
- [ ] 5.6 实现点击关闭信封功能（信纸滑回 → 翻盖关闭）

## 6. 背景音乐

- [ ] 6.1 创建 `src/components/MusicPlayer.tsx`，使用 HTML5 `<audio>` 元素，src 从配置读取
- [ ] 6.2 实现固定位置的播放/暂停按钮，切换图标
- [ ] 6.3 实现 auto-play 尝试 + 浏览器策略处理（blocked 时监听首次交互启动播放）
- [ ] 6.4 在 App 中集成 MusicPlayer 组件

## 7. 主页面组装

- [ ] 7.1 创建 `src/App.tsx`，组合粒子背景 + 时间轴 + 信封 + 音乐播放器
- [ ] 7.2 页面整体布局：全屏滚动容器，时间轴在前，信封在最后
- [ ] 7.3 确保所有组件从 config.ts 读取配置，无硬编码数据

## 8. 验证与收尾

- [ ] 8.1 运行 `npm run build` 确认构建成功，无 TypeScript 错误
- [ ] 8.2 运行 `npm run dev` 启动开发服务器，手动验证所有功能
- [ ] 8.3 验证滚动吸附、时间轴动画、信封打开/关闭、音乐播放、粒子效果
- [ ] 8.4 检查移动端基本可用性（触摸滚动、信封点击）

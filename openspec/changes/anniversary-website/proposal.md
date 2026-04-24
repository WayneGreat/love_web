## Why

需要一个纯前端的周年纪念日网站，用于记录恋爱/婚姻中的重要时间节点和回忆，最终以一封信封收尾。网站无后端依赖，可直接部署到 GitHub Pages 生成专属链接分享给对方，营造浪漫温馨的数字纪念体验。

## What Changes

- 新增完整的前端周年纪念日网站项目
- 实现竖向吸附滚动的时间轴功能，每个时间点占满一屏，展示日期、标题、描述和图片
- 实现互动信封组件，滚动到页面底部时出现，点击/交互打开后展示可配置的信件文字
- 支持背景音乐播放（HTML5 audio）
- 采用浪漫温馨的视觉风格（粉色系渐变、飘落粒子效果、手写字体）
- 所有内容通过配置文件管理，无需修改组件代码即可更换时间线数据、信件内容、音乐等
- 项目结构适合 GitHub Pages 部署

## Capabilities

### New Capabilities
- `timeline`: 竖向吸附滚动时间轴，支持配置时间点（日期、标题、描述、图片），鼠标滚轮翻动时自动吸附到下一个时间点
- `letter-envelope`: 互动信封组件，CSS 绘制信封外观，点击触发翻盖动画打开信封，展示信件文字内容
- `romantic-theme`: 浪漫温馨主题系统，包含粉色系渐变背景、飘落粒子效果（樱花/爱心）、手写字体、整体色彩配置
- `bg-music`: 背景音乐播放控制，使用 HTML5 audio 标签，支持配置音乐 URL
- `site-config`: 集中配置管理，将时间线数据、信件内容、主题色彩、音乐地址等统一放在配置文件中

### Modified Capabilities
（无，全新项目）

## Impact

- 新增项目：React + Vite 前端项目，使用 Tailwind CSS + Framer Motion（或 GSAP）
- 新增依赖：react, react-dom, framer-motion/gsap, tailwindcss, tsparticles
- 部署目标：GitHub Pages（静态站点，无需后端）
- 无 API 变更、无数据库、无后端服务

# 浪漫主题系统设计

## 概述

实现 tasks.md Task Group 3：浪漫主题系统，包括爱心粒子背景、粉色渐变背景和 Tailwind 主题集成。

## 决策记录

| 决策 | 选择 | 理由 |
|------|------|------|
| 粒子风格 | 爱心粒子 | 经典浪漫主题，辨识度高 |
| 粒子密度 | 稀疏（~35 个） | 轻柔点缀，不喧宾夺主 |
| 背景层次 | 单层渐变 | 保持现有 index.css 渐变不变 |
| 实现方案 | @tsparticles/slim + 自定义 heart shape | 已安装依赖，slim bundle 轻量 |
| Config 联动 | 只读 themeColor.primary，不加粒子专属配置 | 粒子效果属视觉氛围，非内容配置 |

## 组件设计

### ParticleBackground.tsx

**职责**：全屏覆盖的爱心粒子飘落层，不拦截用户交互。

**技术实现**：
- 使用 `@tsparticles/react` 的 `<Particles>` + `particlesOptions` prop
- 从 `@tsparticles/slim` 加载 `loadSlim` engine
- 自定义 `heart` shape：在 `options.shapes` 中注册，使用 SVG path 数据绘制爱心

**粒子参数**：
- 数量：35
- 颜色：`config.themeColor.primary`（当前 `#e91e63`）+ 半透明变体
- 大小：6-14px 随机
- 运动：从上往下飘落，轻微左右摆动（`move.direction: "bottom"`，`move.outModes: "out"`）
- 透明度：0.4-0.8 随机

**渲染结构**：
```tsx
<div className="fixed inset-0 z-0 pointer-events-none">
  <Particles id="heart-particles" options={particlesOptions} />
</div>
```

### 背景渐变

保持 `index.css` 现有 `linear-gradient(135deg, #fce4ec, #f8bbd0)` 不变。单层渐变作为内容层最底层的基底。

### Tailwind 主题

Task 3.3 已在 Group 1-2 完成基础配置：
- `@theme` 中已有 `--font-handwriting`
- Tailwind v4 内置 rose 色板，无需额外定义
- 本次无需修改 `@theme`

### App 布局集成

```tsx
<div className="min-h-screen relative">
  <ParticleBackground />              {/* z-0, fixed, pointer-events-none */}
  <div className="relative z-10">     {/* 内容层 */}
    {/* 现有内容 */}
  </div>
</div>
```

## 文件变更清单

| 文件 | 操作 | 说明 |
|------|------|------|
| `src/components/ParticleBackground.tsx` | 新建 | 爱心粒子组件 |
| `src/App.tsx` | 修改 | 集成 ParticleBackground + z-index 分层 |
| `src/index.css` | 不变 | 现有渐变已满足需求 |
| `src/config.ts` | 不变 | 粒子只读 themeColor.primary |

## 约束

- 粒子层必须 `pointer-events: none`，不阻挡交互
- 粒子颜色从 config.themeColor.primary 读取，不硬编码
- 不在 SiteConfig 接口中新增粒子专属配置项
- 使用 @tsparticles/slim（不升级到 full bundle）

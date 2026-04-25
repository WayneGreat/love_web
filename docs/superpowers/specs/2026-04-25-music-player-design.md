# MusicPlayer 设计规格

## 上下文

Task Group 6（背景音乐）— 为纪念日网站添加背景音乐播放功能。
config.ts 已定义 `bgMusic: "music/bgm.mp3"`，public/music/ 目录已存在（暂无实际音频文件）。

## 目标

- 右下角浮动按钮控制背景音乐的播放/暂停
- 页面加载自动播放，被浏览器策略阻止时在首次交互时激活
- 视觉风格与现有玫瑰色系一致

## 非目标

- 进度条、音量控制、播放列表
- 音频可视化
- 多首曲目切换

## 决策

### 方案选择：单组件 + HTML5 Audio

- **选中**：单组件 MusicPlayer.tsx，内部 <audio> + useState
- **否决**：拆分 useAudioPlayer hook — 只有一个播放器场景，拆分过早
- **否决**：第三方库 (howler.js / react-use) — 引入依赖但功能远超需求

### 自动播放策略：自动播放 + 交互激活

- 挂载时尝试 `audio.play()`
- 若抛出 `NotAllowedError`，注册一次性全局事件监听 (`click` / `touchstart` / `scroll`)
- 首次交互触发时调用 `play()` 并移除监听

### 播放控制：仅播放/暂停

- 无进度条、音量、循环开关 UI
- `<audio>` 元素设置 `loop` 属性实现循环

### 按钮风格：浮动圆形

- 固定定位右下角，z-30

## 组件规格

### MusicPlayer.tsx

**状态：**
- `isPlaying: boolean` — 当前播放状态
- `hasInteracted: boolean` — 用户是否已有首次交互（用于 autoplay 降级策略）

**音频：**
- `<audio>` ref，src 从 `config.bgMusic` 读取
- `loop` 属性启用循环播放
- `preload="auto"`

**自动播放流程：**
1. `useEffect` 挂载时尝试 `audioRef.current.play()`
2. 成功 → `setIsPlaying(true)`
3. 抛出 `NotAllowedError` → 注册 `{ once: true }` 全局事件监听
4. 监听回调中调用 `play()` → `setIsPlaying(true)` → `setHasInteracted(true)`

**播放/暂停切换：**
- 先 `audio.pause()`，再 `audio.play()`
- try/catch 包裹 `play()` 调用，防止 `AbortError`

**清理：**
- 组件卸载时 `removeEventListener` 移除全局监听

### 按钮 UI

- 定位：`fixed bottom-6 right-6`
- 层级：`z-30`
- 外观：`w-12 h-12 rounded-full bg-rose-500/80 backdrop-blur-sm shadow-lg`
- 图标：播放中显示 `⏸`，暂停中显示 `♪`
- 动画：Framer Motion `whileTap={{ scale: 0.85 }}` 按压反馈
- 焦点：`focus-visible:ring-2 focus-visible:ring-rose-300 focus-visible:outline-none`
- 无障碍：`aria-label` 动态切换 — "播放音乐" / "暂停音乐"

### 错误处理

- `<audio>` error 事件 → 按钮 `opacity-50 cursor-not-allowed`，禁用点击
- 不弹 alert，不 console.error（静默降级）

## 集成

### App.tsx 变更

在 App 最外层 div 内添加 `<MusicPlayer />`，与 ParticleBackground、Timeline 并列。

### 不变更的文件

- `config.ts` — 已有 bgMusic 字段
- `Timeline.tsx` — 无关
- `LetterEnvelope.tsx` — 无关

## 风险

- **音频文件缺失**：public/music/bgm.mp3 不存在会导致 error 事件触发，按钮进入禁用态。需要在部署前放入实际文件。
- **iOS Safari 限制**：iOS 要求 autoplay 必须由用户主动点击触发，scroll 不算手势。在 iOS 上可能需要用户手动点击播放按钮。

# 密码门（Password Gate）设计文档

## 背景与目标

在现有 IntroSplash 欢迎页之前增加一个密令输入页。用户必须输入正确密令才能进入网站，增强专属感和仪式感。输入页的视觉风格需与现有浪漫氛围高度一致。

## 成功标准

1. 打开网站首先看到密码门，输入正确密令后平滑过渡到 IntroSplash
2. 视觉风格与 IntroSplash 统一（渐变背景 + 浮动心形 + 手写体）
3. 密令错误时提供清晰、简洁的反馈（输入框抖动 + 红色提示）
4. 所有文案和密令值集中配置在 `config.ts`，不硬编码在组件中
5. 支持键盘回车提交，移动端输入体验良好

## 架构

### 流程顺序

```
用户访问 → PasswordGate（密令输入） → 验证通过 → IntroSplash（欢迎页） → 主内容
```

`PasswordGate` 和 `IntroSplash` 是串行的两个阶段，通过 `App.tsx` 的状态控制切换。

### 组件层级

```
App.tsx
├── AnimatePresence
│   └── PasswordGate (z-60, 未验证时显示)
├── AnimatePresence
│   └── IntroSplash (z-50, 验证通过后显示)
├── ParticleBackground + Timeline (验证通过且 Intro 结束后显示)
└── MusicPlayer
```

### 状态机

```
[PasswordGate] --onVerify()--> [IntroSplash] --onExit()--> [Main Content]
    passwordVerified=false           passwordVerified=true
                                    showIntro=true              showIntro=false
```

`App.tsx` 用两个 `boolean` 状态驱动：`passwordVerified`（是否通过密令）和 `showIntro`（是否还在欢迎页）。

## 组件设计

### PasswordGate

**职责：** 渲染全屏密令输入页，验证用户输入，验证通过后调用 `onVerify`。

**Props：**
```typescript
interface PasswordGateProps {
  onVerify: () => void;
}
```

**视觉结构（从上到下）：**
1. 全屏容器：`fixed inset-0 z-[60]`，背景复用 IntroSplash 的 `bg-gradient-to-b from-pink-50 to-pink-100`
2. 浮动心形装饰：4 个绝对定位的 `♥`，使用 `.animate-float-heart` / `.animate-float-heart-delay`，位置与 IntroSplash 对称，保持视觉一致性
3. 中央内容区（垂直居中）：
   - 标题：大号手写体 `font-handwriting`，颜色 `text-rose-500`，文案从 `config.passwordGate.title` 读取（如"欢迎来到我们的世界"）
   - 副标题/提示：颜色 `text-rose-400`，文案从 `config.passwordGate.subtitle` 读取（如"请输入密令"）
   - 输入框：
     - 样式：`w-64 sm:w-80 px-6 py-3 rounded-full border-2 border-rose-300 bg-white/80 backdrop-blur-sm text-center text-rose-700 font-handwriting text-lg placeholder:text-rose-300`
     - 聚焦：`focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-400/50`
     - 类型：`type="password"`，使输入内容显示为圆点，贴合"密令"语义
     - 移动端字体大小保持 `text-base` 以上，避免 iOS 自动缩放
   - 提交按钮：
     - 样式：`mt-6 px-8 py-2.5 bg-rose-500 text-white rounded-full font-medium shadow-lg hover:bg-rose-600 hover:scale-105 focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:outline-none cursor-pointer transition-transform`
     - 文案从 `config.passwordGate.buttonText` 读取（如"进入"）
   - 错误提示：
     - 条件渲染，初始隐藏
     - 样式：`mt-3 text-sm text-red-500 font-medium`
     - 文案从 `config.passwordGate.errorText` 读取（如"密令不正确，请再试一次"）

**动画：**
- 入场：`initial={{ opacity: 0, y: 20 }}` → `animate={{ opacity: 1, y: 0 }}`，duration 0.8，ease easeInOut
- 出场（验证成功）：`exit={{ y: "-100%" }}`，duration 0.8，ease easeInOut —— 与 IntroSplash 的退场动画一致，形成统一的"向上滑出"视觉语言
- 错误抖动：当验证失败时，输入框容器执行 x 轴序列动画 `[0, -10, 10, -10, 10, 0]`，duration 0.4，通过 `key` prop 变化触发 re-animate

**交互逻辑：**
- 点击按钮或按 Enter 键触发验证
- 验证函数：`inputValue === config.password`
- 验证成功 → `onVerify()`
- 验证失败 → 设置 `hasError = true`，触发动画和错误提示
- 输入框内容变化时，清除 `hasError` 状态

### App.tsx 状态调整

新增 `passwordVerified` 状态：
```typescript
const [passwordVerified, setPasswordVerified] = useState(false);
const [showIntro, setShowIntro] = useState(true);
```

渲染逻辑变为：
```
AnimatePresence: !passwordVerified ? <PasswordGate onVerify={() => setPasswordVerified(true)} /> : null
AnimatePresence: passwordVerified && showIntro ? <IntroSplash onExit={handleIntroExit} /> : null
{passwordVerified && !showIntro && <Main Content>}
```

`handleIntroExit` 保持不变：`setShowIntro(false)` 并播放音乐。

## 配置扩展

在 `src/config.ts` 中新增以下接口和字段：

```typescript
export interface PasswordGateConfig {
  title: string;
  subtitle: string;
  placeholder: string;
  buttonText: string;
  errorText: string;
}

export interface SiteConfig {
  // ... existing fields
  password: string;
  passwordGate: PasswordGateConfig;
}
```

默认值：
```typescript
password: "lwj0903",
passwordGate: {
  title: "欢迎来到我们的世界",
  subtitle: "请输入密令",
  placeholder: "在这里输入密令...",
  buttonText: "进入",
  errorText: "密令不正确，请再试一次",
},
```

## 依赖关系

- `PasswordGate` 依赖 `framer-motion`（AnimatePresence + motion.div）
- `PasswordGate` 依赖 `config.ts` 读取密令值和文案
- `App.tsx` 需引入 `PasswordGate` 组件
- 无新增 npm 依赖

## 边界情况与约束

1. **空输入提交：** 视为验证失败，触发错误反馈（不单独提示"请输入内容"，保持简单）
2. **快速重复提交：** 组件内部维护 `isSubmitting` 状态（或依赖 React 的批处理），避免重复触发 `onVerify`
3. **移动端体验：** 输入框字体 `text-base` 以上，防止 iOS 缩放；按钮尺寸足够大（`py-2.5 px-8`）
4. **无障碍：** 输入框和按钮有正确的 `type` 和 `aria-label`；错误提示与输入框通过 `aria-describedby` 或 `aria-live` 关联
5. **视觉一致性：** PasswordGate 和 IntroSplash 使用相同的背景渐变和浮动心形装饰，确保两段过渡时除内容外无视觉跳跃
6. **无持久化：** 本次不实现 localStorage 记住验证状态，每次访问都需输入密令

## 文件变更清单

- `src/App.tsx` — 引入 PasswordGate，新增 `passwordVerified` 状态，调整渲染顺序
- `src/config.ts` — 新增 `password` 和 `passwordGate` 配置字段
- `src/components/PasswordGate.tsx` — 新建组件

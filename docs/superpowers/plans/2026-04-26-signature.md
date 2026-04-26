# LetterEnvelope 落款独立定位实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将信件落款从正文末尾抽出，变为 config-driven 的独立字段，并在信件卡片右下角以 Framer Motion stagger 动画自然呈现。

**Architecture:** 在 `LetterConfig` 中新增可选 `signature` 字段；`config.ts` 中把正文末尾的手动空格落款移除并移入 `signature`；`LetterEnvelope.tsx` 在正文渲染后追加一个 `text-right` 的 motion.p，作为 stagger 动画序列的末项。

**Tech Stack:** React 19 · TypeScript · Tailwind CSS v4 · Framer Motion

---

### Task 1: 扩展 LetterConfig 并迁移落款内容

**Files:**
- Modify: `src/config.ts`

- [ ] **Step 1: 在 LetterConfig 接口添加 signature 字段**

将第 20-24 行修改为：

```typescript
export interface LetterConfig {
    title: string;
    body: string;
    signature?: string;
    footer: string;
}
```

- [ ] **Step 2: 将正文末尾的落款抽出到 signature**

将 `letter.body` 末尾的落款内容（"爱你的小狗" 和日期行）从 `body` 中移除，填入新字段 `signature`。最终 `letter` 对象应如下：

```typescript
letter: {
    title: "给你的一封信",
    body: `亲爱的靓靓姐姐：
        写这封信的时候，脑海里闪过的全是我们一起走过的点点滴滴。
        从第一次遇见你的心跳加速，到现在习惯了每天有你的陪伴，我才明白，原来幸福就是这么简单。
        谢谢你出现在我的生命里，谢谢你给我带来的所有快乐和感动。
        尽管我们相处之中有一些不愉快，但我会做出改变，变得成熟，让你有安全感
        未来的路还很长，我想一直牵着你的手走下去。`,
    signature: `爱你的小狗\n${new Date().getFullYear()}年${new Date().getMonth() + 1}月${new Date().getDate()}日`,
    footer: "愿我们的故事一直继续下去 ✨",
},
```

注意 `signature` 中需要使用 `\n` 换行符将署名和日期分成两行。

- [ ] **Step 3: 验证 TypeScript 编译**

Run: `npx tsc --noEmit`
Expected: 无错误

- [ ] **Step 4: Commit**

```bash
git add src/config.ts
git commit -m "feat: add signature field to LetterConfig and extract signature from body"
```

---

### Task 2: 在 LetterEnvelope 中渲染独立落款

**Files:**
- Modify: `src/components/LetterEnvelope.tsx`

- [ ] **Step 1: 在正文 stagger 动画之后添加 signature 渲染**

定位到第 150-163 行的 `motion.div`（`textContainerVariants` 容器），在其闭合标签之前插入落款渲染代码。

将原有代码：

```tsx
                                <motion.div
                                    className="font-handwriting text-rose-700 text-base sm:text-lg leading-relaxed text-left whitespace-pre-wrap px-2"
                                    variants={textContainerVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit={{ opacity: 0, transition: { duration: 0.15 } }}
                                >
                                    {config.letter.body.split("\n").map((line, i) => (
                                        <motion.p key={i} variants={textLineVariants} className="mb-1">
                                            {line || " "}
                                        </motion.p>
                                    ))}
                                </motion.div>
```

修改为：

```tsx
                                <motion.div
                                    className="font-handwriting text-rose-700 text-base sm:text-lg leading-relaxed text-left whitespace-pre-wrap px-2"
                                    variants={textContainerVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit={{ opacity: 0, transition: { duration: 0.15 } }}
                                >
                                    {config.letter.body.split("\n").map((line, i) => (
                                        <motion.p key={i} variants={textLineVariants} className="mb-1">
                                            {line || " "}
                                        </motion.p>
                                    ))}
                                    {config.letter.signature && (
                                        <div className="text-right mt-8 pr-2">
                                            {config.letter.signature.split("\n").map((line, i) => (
                                                <motion.p
                                                    key={`sig-${i}`}
                                                    variants={textLineVariants}
                                                    className="mb-0.5"
                                                >
                                                    {line}
                                                </motion.p>
                                            ))}
                                        </div>
                                    )}
                                </motion.div>
```

关键点：
- 使用 `config.letter.signature` 可选链判断，兼容旧数据（无 signature 时不渲染）
- 外层 `div` 使用 `text-right` 将落款整体右对齐
- `mt-8` 在落款和正文之间留出充足呼吸间距
- `pr-2` 给右侧留一点内边距，避免贴边
- 每行签名继续使用 `textLineVariants`，自然延续 staggerChildren 序列
- `key` 使用 `sig-${i}` 避免与正文行的 key 冲突

- [ ] **Step 2: 验证 TypeScript 编译**

Run: `npx tsc --noEmit`
Expected: 无错误（特别注意 `noUnusedLocals` 和 `noUnusedParameters`）

- [ ] **Step 3: 启动开发服务器预览效果**

Run: `npm run dev`

打开浏览器，滚动到最后一页的信封，点击打开后观察：
1. 信件正文中不再包含末尾的手动空格落款
2. 正文最后一行之后，右下角以 stagger 动画自然出现「爱你的小狗」和日期
3. 落款与正文字体、颜色一致，整体右对齐

- [ ] **Step 4: Commit**

```bash
git add src/components/LetterEnvelope.tsx
git commit -m "feat: render signature as right-aligned element in letter card"
```

---

## Self-Review Checklist

- [ ] **Spec coverage:** 数据层扩展（Task 1）✓ 视觉层右对齐（Task 2）✓ 动画层 stagger 延续（Task 2）✓ 回退处理（可选链，`config.letter.signature &&`）✓
- [ ] **Placeholder scan:** 无 TBD / TODO / "implement later"
- [ ] **Type consistency:** `signature?: string` 在接口和组件中一致使用

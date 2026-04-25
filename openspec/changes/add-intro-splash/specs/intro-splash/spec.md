## ADDED Requirements

### Requirement: 全屏开场页展示
系统 SHALL 在网站首次加载时显示一个覆盖整个视口的开场页，遮挡下方主内容。

#### Scenario: 页面首次加载
- **WHEN** 用户打开网站
- **THEN** 看到全屏浅粉色背景的开场页，中央显示配置的大标题和副标题

### Requirement: 配置驱动文案
系统 SHALL 所有开场页文案（大标题、副标题、底部提示语）从 `config.ts` 读取，不允许硬编码。

#### Scenario: 配置变更
- **WHEN** 开发者修改 `config.ts` 中的开场页文案
- **THEN** 开场页显示更新后的文案，无需修改组件代码

### Requirement: 装饰动画
系统 SHALL 在开场页角落显示浮动的小爱心装饰，使用 CSS 动画实现上下浮动效果。

#### Scenario: 开场页显示期间
- **WHEN** 开场页处于显示状态
- **THEN** 至少有两个小爱心装饰在屏幕不同位置持续上下浮动

### Requirement: 交互触发退场
系统 SHALL 支持用户通过点击开场页任意位置或向下滑动（wheel/touch）来触发退场动画。

#### Scenario: 用户点击开场页
- **WHEN** 用户点击开场页
- **THEN** 开场页向上滑出屏幕，露出下方主内容

#### Scenario: 用户向下滑动
- **WHEN** 用户在开场页区域向下滚动/滑动
- **THEN** 开场页向上滑出屏幕，露出下方主内容

### Requirement: 退场动画
系统 SHALL 使用 Framer Motion 实现开场页退场动画：向上滑出（translateY: -100%），持续时间约 0.8 秒，缓动函数为 ease-in-out。

#### Scenario: 退场动画执行
- **WHEN** 用户触发退场
- **THEN** 开场页在 0.8 秒内平滑向上滑出，不可中断

### Requirement: 音乐联动
系统 SHALL 在开场页退场开始时自动触发背景音乐播放。

#### Scenario: 开场页退场
- **WHEN** 开场页开始退场动画
- **THEN** 背景音乐开始播放

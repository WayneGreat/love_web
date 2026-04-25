#!/usr/bin/env bash
# 纪念日网站 - 项目打包脚本
# 用法: bash pack.sh
# 产出: love_web.tar.gz (在项目上级目录)

set -euo pipefail

PROJECT_NAME="love_web"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$SCRIPT_DIR"
PARENT_DIR="$(dirname "$PROJECT_DIR")"
OUTPUT="$PARENT_DIR/${PROJECT_NAME}.tar.gz"

echo "========================================"
echo "  纪念日网站 - 项目打包"
echo "========================================"
echo ""

# 排除不需要的目录和文件
# - node_modules: 在目标机器上 npm install 重新安装
# - .git: 版本控制数据，不需要分发
# - dist: 构建产物，在目标机器上重新构建
# - .claude: Claude Code 配置，开发专用
# - docs/superpowers: 开发流程文档，非项目运行必需
# - openspec: 需求规范文档，非项目运行必需
# - CLAUDE.md: Claude Code 项目说明，开发专用
tar -czf "$OUTPUT" \
  -C "$PARENT_DIR" \
  --exclude="node_modules" \
  --exclude=".git" \
  --exclude="dist" \
  --exclude=".claude" \
  --exclude="docs/superpowers" \
  --exclude="openspec" \
  --exclude="CLAUDE.md" \
  --exclude="周年纪念日网站.md" \
  "$PROJECT_NAME"

SIZE=$(du -h "$OUTPUT" | cut -f1)
echo "[完成] 打包文件: $OUTPUT"
echo "[大小] $SIZE"
echo ""
echo "在 Windows 上使用:"
echo "  1. 解压 love_web.tar.gz"
echo "  2. cd love_web"
echo "  3. npm install"
echo "  4. python serve_local.py"

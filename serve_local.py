#!/usr/bin/env python3
"""
纪念日网站 - Windows 本地构建与预览脚本

功能：
  1. 自动将 vite base 路径切换为相对路径（适合本地/任意目录运行）
  2. 执行 npm run build 构建项目
  3. 用 Python 内置 HTTP 服务器在本地提供预览
  4. 自动打开默认浏览器访问

使用方式见下方 USAGE 常量。

兼容：Python 3.6+，Windows / macOS / Linux
"""

import argparse
import os
import socket
import subprocess
import sys
import threading
import webbrowser

# ──────────────────────────────────────────────
# 配置
# ──────────────────────────────────────────────
PROJECT_DIR = os.path.dirname(os.path.abspath(__file__))
VITE_CONFIG = os.path.join(PROJECT_DIR, "vite.config.ts")
DIST_DIR = os.path.join(PROJECT_DIR, "dist")

# GitHub Pages 用的 base 路径（构建后还原）
ORIGINAL_BASE = "/love_web/"
# 本地预览用的 base 路径（相对路径，任意目录都能用）
LOCAL_BASE = "./"

DEFAULT_PORT = 8080

USAGE = r"""
╔══════════════════════════════════════════════════════════════╗
║              纪念日网站 - 本地构建与预览                      ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  用法:                                                       ║
║    python serve_local.py              # 构建 + 启动服务器    ║
║    python serve_local.py --build-only # 只构建不启动服务器    ║
║    python serve_local.py --serve-only # 只启动服务器(不构建) ║
║    python serve_local.py --port 3000  # 指定端口             ║
║    python serve_local.py --no-browser # 不自动打开浏览器     ║
║                                                              ║
║  详细说明:                                                   ║
║  ─────────────────────────────────────────────               ║
║  1. 首次使用前，确保已安装 Node.js (v18+)                    ║
║     下载地址: https://nodejs.org/                            ║
║                                                              ║
║  2. 首次使用前，安装项目依赖:                                ║
║     在项目目录下运行: npm install                            ║
║                                                              ║
║  3. 运行脚本:                                                ║
║     python serve_local.py                                    ║
║                                                              ║
║  4. 脚本会自动:                                              ║
║     - 将 vite.config.ts 的 base 改为 "./" (相对路径)         ║
║     - 执行 npm run build 构建                                ║
║     - 构建完成后还原 base 为 "/love_web/"                    ║
║     - 启动 HTTP 服务器并提供访问地址                          ║
║     - 自动打开浏览器                                         ║
║                                                              ║
║  5. 按 Ctrl+C 停止服务器                                    ║
║                                                              ║
║  注意事项:                                                   ║
║  - 构建产物在 dist/ 目录，可整体拷贝到任何位置              ║
║  - 使用相对路径(base: "./")，不依赖 GitHub Pages 路径       ║
║  - 如需部署到 GitHub Pages，请用 npm run build 原生构建      ║
║  - 音乐文件 6.9MB，首次加载可能稍慢                          ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
"""


# ──────────────────────────────────────────────
# 工具函数
# ──────────────────────────────────────────────
def find_available_port(start: int, max_tries: int = 10) -> int:
    """从 start 端口开始，找到一个可用端口"""
    for port in range(start, start + max_tries):
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                s.bind(("127.0.0.1", port))
                return port
        except OSError:
            continue
    print(f"[错误] 端口 {start}-{start + max_tries - 1} 均被占用，请用 --port 指定其他端口")
    sys.exit(1)


def patch_vite_base(base: str) -> str:
    """
    修改 vite.config.ts 中的 base 配置。
    返回原始 base 值，用于后续还原。
    """
    with open(VITE_CONFIG, "r", encoding="utf-8") as f:
        content = f.read()

    # 查找当前 base 值
    import re
    match = re.search(r"base:\s*['\"]([^'\"]+)['\"]", content)
    old_base = match.group(1) if match else ""

    if old_base == base:
        return old_base  # 无需修改

    new_content = re.sub(
        r"base:\s*['\"][^'\"]+['\"]",
        f"base: '{base}'",
        content,
    )
    with open(VITE_CONFIG, "w", encoding="utf-8") as f:
        f.write(new_content)

    print(f"[配置] base: '{old_base}' -> '{base}'")
    return old_base


def run_build() -> bool:
    """执行 npm run build，返回是否成功"""
    print("[构建] 执行 npm run build ...")
    # Windows 下 npm 是 .cmd 脚本，必须用 shell=True；
    # Linux/macOS 下 shell=True 也能正常工作，统一使用即可
    result = subprocess.run(
        "npm run build",
        cwd=PROJECT_DIR,
        shell=True,
    )
    if result.returncode != 0:
        print("[错误] 构建失败，请检查上方错误信息")
        return False
    print("[构建] 完成！")
    return True


def check_dist_exists() -> bool:
    """检查 dist 目录是否存在且包含 index.html"""
    index_path = os.path.join(DIST_DIR, "index.html")
    return os.path.isfile(index_path)


def start_server(port: int, open_browser: bool):
    """启动 HTTP 服务器"""
    if not check_dist_exists():
        print(f"[错误] dist/ 目录不存在或不完整，请先运行: python serve_local.py --build")
        sys.exit(1)

    # 延迟导入，构建阶段不需要
    from http.server import HTTPServer, SimpleHTTPRequestHandler

    class CORSRequestHandler(SimpleHTTPRequestHandler):
        """添加正确 MIME 类型和 CORS 头的请求处理器"""

        def __init__(self, *args, **kwargs):
            super().__init__(*args, directory=DIST_DIR, **kwargs)

        def end_headers(self):
            # 允许本地跨域（音频播放需要）
            self.send_header("Access-Control-Allow-Origin", "*")
            # 禁用缓存，方便开发调试
            self.send_header("Cache-Control", "no-store, no-cache, must-revalidate")
            super().end_headers()

        def log_message(self, format, *args):
            # 精简日志输出
            pass

    httpd = HTTPServer(("0.0.0.0", port), CORSRequestHandler)
    url = f"http://localhost:{port}/"

    print()
    print(f"  ╔═══════════════════════════════════════════╗")
    print(f"  ║  纪念日网站已启动！                        ║")
    print(f"  ║                                           ║")
    print(f"  ║  访问地址: {url:<30s}║")
    print(f"  ║  按 Ctrl+C 停止服务器                     ║")
    print(f"  ╚═══════════════════════════════════════════╝")
    print()

    if open_browser:
        # 延迟打开浏览器，等服务器就绪
        def _open():
            import time
            time.sleep(0.5)
            webbrowser.open(url)

        threading.Thread(target=_open, daemon=True).start()

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n[服务器] 已停止")
        httpd.server_close()


# ──────────────────────────────────────────────
# 主流程
# ──────────────────────────────────────────────
def main():
    parser = argparse.ArgumentParser(
        description="纪念日网站 - 本地构建与预览",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=USAGE,
    )
    parser.add_argument(
        "--build-only",
        action="store_true",
        help="只构建项目，不启动服务器",
    )
    parser.add_argument(
        "--serve-only",
        action="store_true",
        help="只启动服务器（使用已有的 dist/），不重新构建",
    )
    parser.add_argument(
        "--port",
        type=int,
        default=DEFAULT_PORT,
        help=f"HTTP 服务器端口（默认 {DEFAULT_PORT}）",
    )
    parser.add_argument(
        "--no-browser",
        action="store_true",
        help="不自动打开浏览器",
    )

    args = parser.parse_args()

    # ── 构建 ──
    if not args.serve_only:
        print("=" * 50)
        print("  纪念日网站 - 本地构建")
        print("=" * 50)

        # 1. 切换 base 为相对路径
        original_base = patch_vite_base(LOCAL_BASE)

        # 2. 构建
        build_ok = run_build()

        # 3. 还原 base（无论构建成功与否都还原）
        if original_base != LOCAL_BASE:
            patch_vite_base(original_base)
            print(f"[配置] base 已还原为: '{original_base}'")

        if not build_ok:
            sys.exit(1)

        # 4. 检查产物
        if check_dist_exists():
            print(f"\n[完成] 构建产物位于: {DIST_DIR}")
            print(f"       可将此目录整体拷贝到任意位置，用任何 HTTP 服务器托管")

        if args.build_only:
            print("\n[提示] 仅构建模式，跳过服务器启动")
            print(f"       如需预览，运行: python serve_local.py --serve-only")
            return

    # ── 预览 ──
    port = find_available_port(args.port)
    start_server(port, open_browser=not args.no_browser)


if __name__ == "__main__":
    main()

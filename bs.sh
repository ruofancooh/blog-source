#!/bin/bash
set -e  # 遇到错误立即退出

SOURCE_DIR="$HOME/blog-source"
PORT=5432

cd "$SOURCE_DIR"

# 在后台延迟打开浏览器（等待服务器启动）
(sleep 2 && xdg-open "http://localhost:$PORT/") &

npx hexo s -p "$PORT"
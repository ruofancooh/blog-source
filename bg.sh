#!/bin/bash
set -e  # 任何命令失败则退出

BLOG_DIR="$HOME/blog"
SOURCE_DIR="$HOME/blog-source"

# 生成静态文件
cd "$SOURCE_DIR"
npx hexo g

# 同步 public/ 到博客部署目录，删除多余文件，但保留 .git
rsync -av --delete --exclude=.git public/ "$BLOG_DIR/"

# 清理源码目录
npx hexo clean

# 执行其他脚本
cd
python3 bm.py
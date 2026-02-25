#!/bin/bash

# 源目录（注意末尾的斜杠表示复制目录内容，而非目录本身）
SOURCE_DIR="$HOME/storage/downloads/blog-source/"
# 目标目录
DEST_DIR="$HOME/blog-source/"

# 检查源目录是否存在
if [ ! -d "$SOURCE_DIR" ]; then
    echo "错误：源目录 $SOURCE_DIR 不存在"
    exit 1
fi

# 执行 rsync 同步
# -a : 归档模式，保留权限、时间戳等，并递归复制
# -v : 显示详细输出
# --delete : 删除目标端存在但源端没有的文件（使目标完全镜像源）
rsync -av --delete --exclude '.git' --exclude 'node_modules' "$SOURCE_DIR" "$DEST_DIR"

# 检查 rsync 是否成功
if [ $? -eq 0 ]; then
    echo "同步完成：$SOURCE_DIR -> $DEST_DIR"
else
    echo "错误：rsync 执行失败"
    exit 2
fi
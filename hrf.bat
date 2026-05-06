@chcp 65001 >nul
@echo off
setlocal enabledelayedexpansion

:: 配置路径与端口
set "SOURCE_DIR=D:\repo\blog-source"
set "BLOG_DIR=D:\repo\blog"
set "PORT=5432"

:: 分发子命令
if /i "%~1"=="sb" (
    echo 本地预览源
    cd /d "%SOURCE_DIR%"
    :: 后台等待5秒后打开浏览器
    start "" /b powershell -NoProfile -ExecutionPolicy Bypass -Command "Start-Sleep -Seconds 5; Start-Process 'http://localhost:%PORT%/'"
    :: 启动本地预览服务器
    npx hexo s -p %PORT%
) else if /i "%~1"=="gb" (
    echo 渲染源
    cd /d "%SOURCE_DIR%"
    npx hexo g
    if errorlevel 1 exit /b %errorlevel%

    echo 同步 public/ 到博客部署目录，镜像并删除多余文件，保留 .git
    :: robocopy 使用 \. 表示复制 public 目录内的内容而非目录本身
    robocopy "%SOURCE_DIR%\public\." "%BLOG_DIR%" /MIR /XD .git
    if errorlevel 8 exit /b %errorlevel%

    npx hexo clean
    if errorlevel 1 exit /b %errorlevel%

    echo 覆写部署目录
    python modify-hexo-output.py "%BLOG_DIR%"
    if errorlevel 1 exit /b %errorlevel%

    cd /d "%BLOG_DIR%"
    git add .
    if errorlevel 1 exit /b %errorlevel%
    git status
) else (
    exit /b 1
)
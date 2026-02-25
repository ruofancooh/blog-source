@echo off
set SOURCE_DIR=
set PORT=5432

cd /d "%SOURCE_DIR%" || exit /b

:: 在后台延迟2秒后打开浏览器（不阻塞 hexo 服务器）
start /b cmd /c "timeout /t 2 /nobreak >nul && start http://localhost:%PORT%/"

:: 启动 hexo 服务器（npx 是批处理文件，必须用 call）
call npx hexo s -p %PORT%
if errorlevel 1 exit /b
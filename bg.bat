@echo off
set BLOG_DIR=
set SOURCE_DIR=

cd /d "%SOURCE_DIR%" || exit /b
call npx hexo g || exit /b
robocopy public "%BLOG_DIR%" /MIR /XD .git
if %errorlevel% geq 8 exit /b %errorlevel%
call npx hexo clean || exit /b
cd /d "%USERPROFILE%"
python bm.py || exit /b
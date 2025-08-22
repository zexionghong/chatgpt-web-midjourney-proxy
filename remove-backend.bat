@echo off
echo 🗑️  删除后端相关文件和目录...

REM 删除service目录
if exist "service" (
    echo 删除 service\ 目录...
    rmdir /s /q service
    echo ✅ service\ 目录已删除
) else (
    echo ℹ️  service\ 目录不存在
)

REM 删除其他后端相关文件
if exist "api\proxy.js" (
    echo 删除 api\proxy.js...
    del "api\proxy.js"
    echo ✅ api\proxy.js 已删除
)

if exist "api\session.js" (
    echo 删除 api\session.js...
    del "api\session.js"
    echo ✅ api\session.js 已删除
)

if exist "api\verify.js" (
    echo 删除 api\verify.js...
    del "api\verify.js"
    echo ✅ api\verify.js 已删除
)

if exist "start.sh" (
    echo 删除 start.sh...
    del "start.sh"
    echo ✅ start.sh 已删除
)

if exist "start.cmd" (
    echo 删除 start.cmd...
    del "start.cmd"
    echo ✅ start.cmd 已删除
)

if exist "tauri_debug.sh" (
    echo 删除 tauri_debug.sh...
    del "tauri_debug.sh"
    echo ✅ tauri_debug.sh 已删除
)

echo.
echo ✅ 后端文件清理完成！
echo.
echo 📝 保留的文件:
echo   - 前端源码 (src\)
echo   - 配置文件 (vite.config.ts, package.json等)
echo   - 文档文件 (README*.md, *.md)
echo.
echo 🚀 现在可以运行纯前端版本:
echo   npm run dev

pause
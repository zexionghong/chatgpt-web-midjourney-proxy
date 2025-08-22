@echo off
echo 🚀 启动ChatGPT Web 无后端版本

REM 检查是否安装了依赖
if not exist "node_modules" (
    echo 📦 安装依赖...
    call npm install
)

echo ✅ 无后端版本特性:
echo   - 直接调用第三方API
echo   - API密钥存储在本地浏览器
echo   - 支持CORS代理配置
echo   - 纯前端部署

echo.
echo ⚙️  首次使用请配置API密钥:
echo   1. 启动后点击设置按钮
echo   2. 配置OpenAI API Key和Base URL
echo   3. 根据需要配置其他AI服务

echo.
echo 🌐 启动开发服务器...
call npm run dev

pause
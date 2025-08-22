#!/bin/bash

echo "🗑️  删除后端相关文件和目录..."

# 删除service目录
if [ -d "service" ]; then
    echo "删除 service/ 目录..."
    rm -rf service/
    echo "✅ service/ 目录已删除"
else
    echo "ℹ️  service/ 目录不存在"
fi

# 删除其他后端相关文件
files_to_remove=(
    "api/proxy.js"
    "api/session.js" 
    "api/verify.js"
    "start.sh"
    "start.cmd"
    "tauri_debug.sh"
)

for file in "${files_to_remove[@]}"; do
    if [ -f "$file" ]; then
        echo "删除 $file..."
        rm "$file"
        echo "✅ $file 已删除"
    else
        echo "ℹ️  $file 不存在"
    fi
done

echo ""
echo "✅ 后端文件清理完成！"
echo ""
echo "📝 保留的文件:"
echo "  - 前端源码 (src/)"
echo "  - 配置文件 (vite.config.ts, package.json等)"
echo "  - 文档文件 (README*.md, *.md)"
echo ""
echo "🚀 现在可以运行纯前端版本:"
echo "  npm run dev"
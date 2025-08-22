# 无后端部署配置指南

本项目已经去除后端服务依赖，改为纯前端应用，直接调用第三方AI服务API。

## 🚀 快速开始

### 1. 安装依赖
```bash
npm install
# 或
pnpm install
```

### 2. 启动应用
```bash
npm run dev
# 或
pnpm dev
```

### 3. 配置API密钥
首次使用时，点击设置按钮配置您的API密钥和服务地址。

## 📋 必需配置

### OpenAI/ChatGPT 配置
- **API Base URL**: `https://api.openai.com` （或您的代理服务地址）
- **API Key**: `sk-...` （您的OpenAI API密钥）

### Midjourney 配置
- **Server URL**: 您的Midjourney代理服务地址
- **API Secret**: 您的API密钥

### 其他AI服务
根据需要配置Suno、Luma、Runway等服务的API密钥和服务地址。

## 🔧 CORS问题解决方案

由于浏览器的CORS限制，某些API可能无法直接调用。以下是解决方案：

### 方案1: 使用支持CORS的代理服务
推荐使用以下代理服务：
- **one-api**: 支持多种AI模型的统一代理
- **openai-sb**: OpenAI的镜像代理服务
- **自建代理**: 搭建自己的API代理服务

### 方案2: 浏览器插件
安装CORS浏览器插件：
- Chrome: `CORS Unblock` 或 `Disable CORS`
- Firefox: `CORS Everywhere`

⚠️ **注意**: 使用浏览器插件可能有安全风险，仅建议在开发环境使用。

### 方案3: 代理服务器
```nginx
# Nginx配置示例
location /api/openai/ {
    proxy_pass https://api.openai.com/;
    proxy_set_header Host api.openai.com;
    add_header Access-Control-Allow-Origin *;
    add_header Access-Control-Allow-Methods GET,POST,OPTIONS;
    add_header Access-Control-Allow-Headers *;
}
```

## 📚 推荐的API代理服务

### OpenAI代理
- **OpenAI-SB**: `https://api.openai-sb.com`
- **OpenAI-Proxy**: 支持CORS的OpenAI代理
- **One-API**: 多模型统一接口

### Midjourney代理
- **Midjourney-Proxy**: 官方推荐的代理服务
- **第三方代理**: 各种支持CORS的MJ代理

## 🔒 安全说明

### API密钥安全
- ✅ API密钥存储在浏览器localStorage中，不会发送到任何服务器
- ✅ 只有您自己可以访问这些密钥
- ⚠️ 不要在公共计算机上保存API密钥
- ⚠️ 定期更换API密钥

### 推荐做法
1. 使用专门的API代理服务而不是直接调用原始API
2. 设置API密钥的使用限制和监控
3. 定期备份和导出配置

## 🌐 部署到CDN

由于这是纯前端应用，可以部署到任何静态托管服务：

### Vercel部署
```bash
npm run build
# 上传到Vercel
```

### Netlify部署
```bash
npm run build
# 上传到Netlify
```

### GitHub Pages
```bash
npm run build
# 上传dist目录到GitHub Pages
```

## 🔄 从后端版本迁移

如果您之前使用过带后端的版本，需要：

1. **导出配置**: 从旧版本导出您的配置
2. **重新配置**: 在新版本中重新输入API密钥
3. **测试功能**: 确保所有功能正常工作

## ❓ 常见问题

### Q: 为什么某些API调用失败？
A: 可能是CORS问题，请检查API服务是否支持跨域请求，或使用支持CORS的代理服务。

### Q: 如何备份配置？
A: 在设置界面点击"导出配置"按钮，保存JSON文件。

### Q: 是否支持文件上传？
A: 支持，但需要API服务端支持CORS。建议使用支持CORS的代理服务。

### Q: 性能如何？
A: 去除后端后，响应速度更快，但受网络和第三方API服务稳定性影响。

## 🛠️ 开发说明

### 项目结构变化
- ✅ 移除 `service/` 后端目录
- ✅ 添加 `src/store/modules/apiConfig/` API配置管理
- ✅ 添加 `src/utils/directApi.ts` 直接API调用工具
- ✅ 添加 `src/utils/corsProxy.ts` CORS处理工具

### 新增功能
- 🆕 本地API配置管理
- 🆕 配置导入/导出功能
- 🆕 CORS问题检测和处理
- 🆕 多服务API密钥管理

## 📞 技术支持

如果您遇到问题：
1. 检查浏览器控制台是否有错误信息
2. 确认API密钥和服务地址配置正确
3. 测试API服务是否支持CORS
4. 查看项目GitHub Issues

---

🎉 **恭喜！** 您现在可以使用无后端版本的ChatGPT Web应用了！
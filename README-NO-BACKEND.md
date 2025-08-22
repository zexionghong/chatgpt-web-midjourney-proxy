# ChatGPT Web Midjourney Proxy - 无后端版本 🚀

> 这是去掉后端服务的纯前端版本，直接调用第三方AI服务API。

## ✨ 无后端版本特性

- 🔥 **纯前端应用** - 无需后端服务器，可部署到任何静态托管平台
- 🔐 **本地存储API密钥** - 密钥安全存储在浏览器本地，不经过任何服务器
- 🌐 **直接API调用** - 直接调用OpenAI、Midjourney等第三方服务API
- ⚡ **更快响应** - 去除中间层，响应速度更快
- 🛠️ **易于部署** - 支持Vercel、Netlify、GitHub Pages等平台一键部署

## 🚀 快速开始

### 本地运行
```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 或使用便捷脚本
./start-frontend-only.sh    # Linux/macOS
start-frontend-only.bat     # Windows
```

### 生产部署
```bash
# 构建生产版本
npm run build

# 部署dist目录到静态托管平台
```

## ⚙️ 配置API密钥

首次使用时需要配置API密钥：

1. **启动应用后点击"API配置"按钮**
2. **配置所需服务**：
   - OpenAI/ChatGPT: API Key + Base URL
   - Midjourney: Server URL + API Secret
   - 其他AI服务: 根据需要配置

### 推荐的API代理服务

由于CORS限制，推荐使用以下支持跨域的API代理服务：

#### OpenAI代理
- **one-api**: `https://your-proxy.com/v1`
- **openai-sb**: `https://api.openai-sb.com`
- **自建代理**: 搭建支持CORS的OpenAI代理

#### Midjourney代理
- **midjourney-proxy**: 确保服务端支持CORS
- **第三方代理**: 使用支持跨域的MJ代理服务

## 🔧 CORS问题解决

### 方案1: 使用支持CORS的代理服务 ⭐推荐
将API Base URL设置为支持CORS的代理服务地址

### 方案2: 浏览器插件
安装CORS插件（仅建议开发环境使用）：
- Chrome: `CORS Unblock`
- Firefox: `CORS Everywhere`

### 方案3: 自建代理
搭建支持CORS的API代理服务

## 📱 支持的AI服务

- ✅ **ChatGPT/OpenAI** - 聊天、图像生成、语音
- ✅ **Midjourney** - 图像生成和编辑
- ✅ **Suno** - 音乐生成
- ✅ **Luma** - 视频生成
- ✅ **Runway** - AI视频编辑
- ✅ **其他服务** - Viggle、Ideogram、Kling等

## 🔒 安全说明

### API密钥安全
- ✅ 密钥存储在浏览器localStorage，不发送到任何服务器
- ✅ 支持配置导入/导出备份
- ⚠️ 不要在公共计算机上保存密钥
- ⚠️ 建议定期更换API密钥

### 推荐做法
1. 使用专门的API代理服务
2. 设置API密钥使用限制
3. 定期备份配置

## 🌐 部署平台

### Vercel部署
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Dooy/chatgpt-web-midjourney-proxy)

### Netlify部署
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/Dooy/chatgpt-web-midjourney-proxy)

### 其他平台
- **GitHub Pages**
- **Cloudflare Pages**
- **Firebase Hosting**
- **任何静态托管服务**

## 📝 更新说明

### 与后端版本的区别

| 功能 | 后端版本 | 无后端版本 |
|------|---------|-----------|
| 部署复杂度 | 需要后端服务器 | ✅ 纯前端，部署简单 |
| API密钥安全 | 服务器存储 | ✅ 本地存储 |
| 响应速度 | 经过后端转发 | ✅ 直接调用，更快 |
| CORS限制 | 后端处理 | ⚠️ 需要代理或插件 |
| 文件上传 | 后端处理 | ⚠️ 需要支持CORS的API |
| 扩展性 | 容易添加功能 | ⚠️ 受浏览器限制 |

### 迁移指南

从后端版本迁移到无后端版本：

1. **备份数据**: 导出聊天记录和配置
2. **获取API密钥**: 准备各服务的API密钥
3. **配置代理**: 确保API服务支持CORS
4. **重新配置**: 在新版本中重新设置API密钥

## ❓ 常见问题

### Q: CORS错误怎么办？
A: 使用支持CORS的API代理服务，或安装浏览器CORS插件

### Q: 文件上传失败？
A: 确保API服务支持CORS，或使用支持跨域的代理服务

### Q: 如何备份配置？
A: 在设置界面点击"导出配置"保存JSON文件

### Q: 性能如何？
A: 去除后端中间层，响应速度通常更快

## 🤝 技术支持

- 📖 [详细配置指南](./NO-BACKEND-SETUP.md)
- 🐛 [问题反馈](https://github.com/Dooy/chatgpt-web-midjourney-proxy/issues)
- 💬 [讨论交流](https://github.com/Dooy/chatgpt-web-midjourney-proxy/discussions)

---

🎉 **享受无后端的ChatGPT Web体验！**
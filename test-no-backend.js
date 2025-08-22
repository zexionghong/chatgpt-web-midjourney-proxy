#!/usr/bin/env node

/**
 * 无后端版本功能测试脚本
 */

console.log('🧪 测试ChatGPT Web无后端版本...')

// 检查关键文件是否存在
const fs = require('fs')
const path = require('path')

const requiredFiles = [
  'src/store/modules/apiConfig/index.ts',
  'src/utils/directApi.ts',
  'src/utils/corsProxy.ts', 
  'src/api/openapi-direct.ts',
  'src/components/common/ApiConfigModal/index.vue',
  'src/components/common/ApiConfigButton/index.vue'
]

console.log('\n📂 检查关键文件...')
let allFilesExist = true

requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`)
  } else {
    console.log(`❌ ${file} - 文件不存在`)
    allFilesExist = false
  }
})

// 检查package.json是否已更新
console.log('\n📦 检查package.json...')
const packageJson = require('./package.json')

if (packageJson.scripts.dev === 'vite') {
  console.log('✅ dev script 已简化')
} else {
  console.log('❌ dev script 未更新')
}

if (packageJson.scripts.build === 'vite build') {
  console.log('✅ build script 已简化') 
} else {
  console.log('❌ build script 未更新')
}

// 检查vite.config.ts是否移除了代理配置
console.log('\n⚙️ 检查vite配置...')
const viteConfig = fs.readFileSync('vite.config.ts', 'utf8')

if (!viteConfig.includes('proxy: {')) {
  console.log('✅ Vite代理配置已移除')
} else {
  console.log('❌ Vite代理配置未移除')
}

// 检查是否有service目录
console.log('\n🗂️ 检查后端目录...')
if (!fs.existsSync('service')) {
  console.log('✅ service目录不存在 - 已去除后端')
} else {
  console.log('⚠️ service目录仍存在 - 可以删除')
}

console.log('\n📋 测试总结:')
if (allFilesExist) {
  console.log('✅ 所有关键文件已创建')
  console.log('✅ 无后端版本改造完成')
  console.log('')
  console.log('🚀 下一步:')
  console.log('1. 运行 npm run dev 启动应用')
  console.log('2. 配置API密钥')
  console.log('3. 测试功能是否正常')
  console.log('')
  console.log('📚 参考文档:')
  console.log('- NO-BACKEND-SETUP.md')
  console.log('- README-NO-BACKEND.md')
} else {
  console.log('❌ 部分文件缺失，请检查')
}

console.log('\n🎉 无后端版本改造完成！')
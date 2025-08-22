/**
 * CORS代理处理工具
 * 
 * 由于浏览器的CORS限制，某些API可能无法直接调用
 * 这个文件提供了多种解决方案
 */

// 公共的CORS代理服务列表
export const CORS_PROXY_SERVERS = [
  'https://cors-anywhere.herokuapp.com/',
  'https://api.allorigins.win/raw?url=',
  'https://cors.bridged.cc/',
  // 用户可以自己搭建的代理服务
]

/**
 * 检查URL是否需要CORS代理
 */
export function needsCorsProxy(url: string): boolean {
  // 检查是否为第三方API
  const thirdPartyDomains = [
    'api.openai.com',
    'discord.com',
    // 根据实际使用的服务添加更多域名
  ]
  
  return thirdPartyDomains.some(domain => url.includes(domain))
}

/**
 * 为URL添加CORS代理
 */
export function addCorsProxy(url: string, proxyIndex = 0): string {
  if (!needsCorsProxy(url)) {
    return url
  }
  
  const proxy = CORS_PROXY_SERVERS[proxyIndex] || CORS_PROXY_SERVERS[0]
  
  // 根据代理服务的格式添加URL
  if (proxy.includes('allorigins')) {
    return `${proxy}${encodeURIComponent(url)}`
  } else {
    return `${proxy}${url}`
  }
}

/**
 * 尝试多个代理服务直到成功
 */
export async function fetchWithCorsProxy(
  url: string, 
  options: RequestInit = {},
  maxRetries = 3
): Promise<Response> {
  // 首先尝试直接请求
  try {
    const response = await fetch(url, options)
    if (response.ok) {
      return response
    }
  } catch (error) {
    console.warn('Direct fetch failed, trying CORS proxy:', error)
  }
  
  // 如果直接请求失败，尝试代理服务
  for (let i = 0; i < CORS_PROXY_SERVERS.length && i < maxRetries; i++) {
    try {
      const proxyUrl = addCorsProxy(url, i)
      const response = await fetch(proxyUrl, options)
      
      if (response.ok) {
        return response
      }
    } catch (error) {
      console.warn(`CORS proxy ${i} failed:`, error)
      continue
    }
  }
  
  throw new Error('All CORS proxy attempts failed')
}

/**
 * 处理特定服务的CORS问题
 */
export const corsHandlers = {
  /**
   * OpenAI API的CORS处理
   * 注意：由于OpenAI API的限制，可能需要用户配置自己的代理服务
   */
  openai: {
    needsProxy: true,
    alternatives: [
      '建议使用支持CORS的OpenAI API代理服务',
      '或者配置浏览器插件来绕过CORS限制',
      '推荐使用one-api等代理服务'
    ]
  },
  
  /**
   * Midjourney代理服务
   * 通常Midjourney代理服务可以配置CORS
   */
  midjourney: {
    needsProxy: false,
    notes: 'Midjourney代理服务通常支持CORS，如果不支持请联系服务提供商'
  }
}

/**
 * 生成CORS错误的用户友好提示
 */
export function generateCorsErrorHelp(serviceName: string, url: string): string {
  return `
❌ CORS错误：无法访问 ${serviceName} 服务

🔧 解决方案：
1. 使用支持CORS的API代理服务
2. 配置浏览器插件（如CORS Unblock）
3. 使用服务商提供的代理API地址

📝 当前请求的URL: ${url}

💡 提示：将API Base URL设置为支持CORS的代理地址可以解决此问题
`
}

/**
 * 检测CORS支持情况
 */
export async function testCorsSupport(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, {
      method: 'OPTIONS',
      mode: 'cors'
    })
    return response.ok
  } catch {
    return false
  }
}

/**
 * 推荐的API代理服务配置
 */
export const RECOMMENDED_PROXY_CONFIGS = {
  openai: {
    name: 'one-api',
    description: '支持多种AI模型的代理服务',
    example: 'https://your-proxy.com/v1',
    features: ['支持CORS', '统一API格式', '支持多种模型']
  },
  
  midjourney: {
    name: 'midjourney-proxy',
    description: 'Midjourney的代理服务',
    example: 'https://your-mj-proxy.com',
    features: ['支持CORS', '完整MJ功能', '高稳定性']
  }
}
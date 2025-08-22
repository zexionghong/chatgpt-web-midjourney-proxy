import { useApiConfigStore } from '@/store/modules/apiConfig'

/**
 * 直接API调用工具类，绕过后端服务直接调用第三方API
 */
export class DirectApiClient {
  private apiConfig = useApiConfigStore()

  /**
   * 通用API调用方法
   */
  private async makeRequest(
    url: string,
    options: RequestInit = {},
    customHeaders: Record<string, string> = {}
  ): Promise<any> {
    const headers = {
      'Content-Type': 'application/json',
      ...customHeaders,
      ...options.headers
    }

    const response = await fetch(url, {
      ...options,
      headers,
      mode: 'cors' // 明确指定CORS模式
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`)
    }

    // 检查是否是流式响应
    const contentType = response.headers.get('content-type')
    if (contentType?.includes('text/event-stream') || contentType?.includes('application/stream')) {
      return response // 返回原始响应用于流式处理
    }

    return response.json()
  }

  /**
   * OpenAI API调用
   */
  async openai(endpoint: string, data: any, options: RequestInit = {}): Promise<any> {
    const config = this.apiConfig.openaiConfig
    if (!config.apiKey) {
      throw new Error('OpenAI API key not configured')
    }

    const url = `${config.baseUrl}${endpoint}`
    const headers = {
      'Authorization': `Bearer ${config.apiKey}`
    }

    return this.makeRequest(url, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options
    }, headers)
  }

  /**
   * OpenAI 流式调用
   */
  async openaiStream(
    endpoint: string,
    data: any,
    onMessage: (message: string) => void,
    onError?: (error: any) => void,
    signal?: AbortSignal
  ): Promise<void> {
    const config = this.apiConfig.openaiConfig
    if (!config.apiKey) {
      throw new Error('OpenAI API key not configured')
    }

    const url = `${config.baseUrl}${endpoint}`
    const headers = {
      'Authorization': `Bearer ${config.apiKey}`,
      'Accept': 'text/event-stream'
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify({ ...data, stream: true }),
        signal
      })

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`)
      }

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error('No reader available')
      }

      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') {
              return
            }
            onMessage(data)
          }
        }
      }
    } catch (error) {
      onError?.(error)
      throw error
    }
  }

  /**
   * Midjourney API调用
   */
  async midjourney(endpoint: string, data: any, options: RequestInit = {}): Promise<any> {
    const config = this.apiConfig.mjConfig
    if (!config.serverUrl || !config.apiSecret) {
      throw new Error('Midjourney configuration not complete')
    }

    const url = `${config.serverUrl}${endpoint}`
    const headers = {
      'mj-api-secret': config.apiSecret
    }

    return this.makeRequest(url, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options
    }, headers)
  }

  /**
   * Suno API调用
   */
  async suno(endpoint: string, data: any, options: RequestInit = {}): Promise<any> {
    const sunoServerUrl = this.apiConfig.sunoServerUrl
    const sunoApiKey = this.apiConfig.sunoApiKey
    
    if (!sunoServerUrl || !sunoApiKey) {
      throw new Error('Suno configuration not complete')
    }

    const url = `${sunoServerUrl}${endpoint}`
    const headers = {
      'Authorization': `Bearer ${sunoApiKey}`
    }

    return this.makeRequest(url, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options
    }, headers)
  }

  /**
   * Luma API调用
   */
  async luma(endpoint: string, data: any, options: RequestInit = {}): Promise<any> {
    const lumaServerUrl = this.apiConfig.lumaServerUrl
    const lumaApiKey = this.apiConfig.lumaApiKey
    
    if (!lumaServerUrl || !lumaApiKey) {
      throw new Error('Luma configuration not complete')
    }

    const url = `${lumaServerUrl}${endpoint}`
    const headers = {
      'Authorization': `Bearer ${lumaApiKey}`
    }

    return this.makeRequest(url, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options
    }, headers)
  }

  /**
   * 通用AI服务调用
   */
  async callService(
    serviceName: keyof typeof this.apiConfig,
    endpoint: string,
    data: any,
    options: RequestInit = {}
  ): Promise<any> {
    const serverUrlKey = `${serviceName}ServerUrl` as keyof typeof this.apiConfig
    const apiKeyKey = `${serviceName}ApiKey` as keyof typeof this.apiConfig
    
    const serverUrl = this.apiConfig[serverUrlKey] as string
    const apiKey = this.apiConfig[apiKeyKey] as string
    
    if (!serverUrl || !apiKey) {
      throw new Error(`${serviceName} configuration not complete`)
    }

    const url = `${serverUrl}${endpoint}`
    const headers = {
      'Authorization': `Bearer ${apiKey}`
    }

    return this.makeRequest(url, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options
    }, headers)
  }

  /**
   * 文件上传（针对支持CORS的服务）
   */
  async uploadFile(
    serviceName: string,
    endpoint: string,
    formData: FormData,
    options: RequestInit = {}
  ): Promise<any> {
    let config, url, headers

    // 根据服务名称选择配置
    if (serviceName === 'openai') {
      config = this.apiConfig.openaiConfig
      if (!config.apiKey) {
        throw new Error('OpenAI API key not configured')
      }
      url = `${config.baseUrl}${endpoint}`
      headers = {
        'Authorization': `Bearer ${config.apiKey}`
      }
    } else if (serviceName === 'midjourney') {
      const mjConfig = this.apiConfig.mjConfig
      if (!mjConfig.serverUrl || !mjConfig.apiSecret) {
        throw new Error('Midjourney configuration not complete')
      }
      url = `${mjConfig.serverUrl}${endpoint}`
      headers = {
        'mj-api-secret': mjConfig.apiSecret
      }
    } else {
      // 通用服务配置
      const serverUrlKey = `${serviceName}ServerUrl` as keyof typeof this.apiConfig
      const apiKeyKey = `${serviceName}ApiKey` as keyof typeof this.apiConfig
      
      const serverUrl = this.apiConfig[serverUrlKey] as string
      const apiKey = this.apiConfig[apiKeyKey] as string
      
      if (!serverUrl || !apiKey) {
        throw new Error(`${serviceName} configuration not complete`)
      }
      
      url = `${serverUrl}${endpoint}`
      headers = {
        'Authorization': `Bearer ${apiKey}`
      }
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: formData,
        ...options
      })

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status} ${response.statusText}`)
      }

      return response.json()
    } catch (error) {
      // 如果是CORS错误，提供更好的错误信息
      if (error instanceof TypeError && error.message.includes('CORS')) {
        throw new Error(`CORS error: ${serviceName} service doesn't support cross-origin requests. Please use a CORS-enabled proxy or configure the service to allow CORS.`)
      }
      throw error
    }
  }

  /**
   * 通用文件上传，带重试机制
   */
  async uploadFileWithRetry(
    serviceName: string,
    endpoint: string,
    formData: FormData,
    maxRetries = 3
  ): Promise<any> {
    let lastError: Error

    for (let i = 0; i < maxRetries; i++) {
      try {
        return await this.uploadFile(serviceName, endpoint, formData)
      } catch (error) {
        lastError = error as Error
        console.warn(`Upload attempt ${i + 1} failed:`, error)
        
        // 如果是配置错误，不要重试
        if (error instanceof Error && error.message.includes('not configured')) {
          throw error
        }
        
        // 短暂延迟后重试
        if (i < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
        }
      }
    }

    throw lastError!
  }
}

// 创建全局实例
export const directApiClient = new DirectApiClient()
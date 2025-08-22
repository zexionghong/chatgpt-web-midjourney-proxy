import { defineStore } from 'pinia'
import { ss } from '@/utils/storage'

export interface ApiConfig {
  // OpenAI Configuration
  openaiApiKey: string
  openaiApiBaseUrl: string
  
  // Midjourney Configuration
  mjServerUrl: string
  mjApiSecret: string
  
  // Suno Configuration
  sunoServerUrl: string
  sunoApiKey: string
  
  // Luma Configuration
  lumaServerUrl: string
  lumaApiKey: string
  
  // Runway Configuration
  runwayServerUrl: string
  runwayApiKey: string
  
  // Viggle Configuration
  viggleServerUrl: string
  viggleApiKey: string
  
  // Ideogram Configuration
  ideoServerUrl: string
  ideoApiKey: string
  
  // Kling Configuration
  klingServerUrl: string
  klingApiKey: string
  
  // Pika Configuration
  pikaServerUrl: string
  pikaApiKey: string
  
  // Udio Configuration
  udioServerUrl: string
  udioApiKey: string
  
  // Pixverse Configuration
  pixverseServerUrl: string
  pixverseApiKey: string
  
  // RunwayML Configuration
  runwaymlServerUrl: string
  runwaymlApiKey: string
  
  // Riff Configuration
  riffServerUrl: string
  riffApiKey: string
}

export const defaultApiConfig: ApiConfig = {
  // Default OpenAI
  openaiApiKey: '',
  openaiApiBaseUrl: 'https://api.openai.com',
  
  // Default Midjourney (需要用户自己配置)
  mjServerUrl: '',
  mjApiSecret: '',
  
  // Default AI service URLs (需要用户自己配置)
  sunoServerUrl: '',
  sunoApiKey: '',
  
  lumaServerUrl: '',
  lumaApiKey: '',
  
  runwayServerUrl: '',
  runwayApiKey: '',
  
  viggleServerUrl: '',
  viggleApiKey: '',
  
  ideoServerUrl: '',
  ideoApiKey: '',
  
  klingServerUrl: '',
  klingApiKey: '',
  
  pikaServerUrl: '',
  pikaApiKey: '',
  
  udioServerUrl: '',
  udioApiKey: '',
  
  pixverseServerUrl: '',
  pixverseApiKey: '',
  
  runwaymlServerUrl: '',
  runwaymlApiKey: '',
  
  riffServerUrl: '',
  riffApiKey: ''
}

export const useApiConfigStore = defineStore('api-config', {
  state: (): ApiConfig => {
    // 从localStorage恢复配置
    const saved = ss.get('api-config')
    return saved ? { ...defaultApiConfig, ...saved } : { ...defaultApiConfig }
  },

  getters: {
    // 获取OpenAI配置
    openaiConfig(): { apiKey: string; baseUrl: string } {
      return {
        apiKey: this.openaiApiKey,
        baseUrl: this.openaiApiBaseUrl
      }
    },
    
    // 获取Midjourney配置
    mjConfig(): { serverUrl: string; apiSecret: string } {
      return {
        serverUrl: this.mjServerUrl,
        apiSecret: this.mjApiSecret
      }
    },
    
    // 检查各服务是否已配置
    isOpenaiConfigured(): boolean {
      return !!this.openaiApiKey
    },
    
    isMjConfigured(): boolean {
      return !!this.mjServerUrl && !!this.mjApiSecret
    },
    
    isSunoConfigured(): boolean {
      return !!this.sunoServerUrl && !!this.sunoApiKey
    },
    
    isLumaConfigured(): boolean {
      return !!this.lumaServerUrl && !!this.lumaApiKey
    },
    
    // 获取特定服务的配置
    getServiceConfig() {
      return (service: keyof ApiConfig) => {
        return this[service]
      }
    }
  },

  actions: {
    // 更新配置
    updateConfig(config: Partial<ApiConfig>) {
      Object.assign(this, config)
      this.saveToStorage()
    },
    
    // 更新单个配置项
    updateSingleConfig(key: keyof ApiConfig, value: string) {
      this[key] = value as any
      this.saveToStorage()
    },
    
    // 保存到localStorage
    saveToStorage() {
      ss.set('api-config', this.$state)
    },
    
    // 重置配置
    resetConfig() {
      Object.assign(this, defaultApiConfig)
      this.saveToStorage()
    },
    
    // 从对象批量导入配置
    importConfig(config: Partial<ApiConfig>) {
      this.updateConfig(config)
    },
    
    // 导出配置
    exportConfig(): ApiConfig {
      return { ...this.$state }
    }
  }
})
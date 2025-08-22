import { useApiConfigStore } from "@/store/modules/apiConfig"
import { gptConfigStore, homeStore, gptServerStore } from "@/store"
import { mlog, myTrim } from "./mjapi"
import { localGet, localSaveAny } from "./mjsave"
import { isNumber } from "@/utils/is"
import { t } from "@/locales"
import { ChatMessage } from "gpt-tokenizer/esm/GptEncoding"
import { chatSetting } from "./chat"
import { directApiClient } from '@/utils/directApi'
import { ideoSubmit } from "./ideo"

export const KnowledgeCutOffDate: Record<string, string> = {
  default: "2021-09",
  "gpt-4-1106-preview": "2023-04",
  "gpt-4-0125-preview": "2023-12",
  "gpt-4-vision-preview": "2023-04",
  "gpt-4-turbo-2024-04-09": "2023-12", 
  "gpt-4o-2024-05-13": "2023-10", 
  "o1-preview-2024-09-12": "2023-10", 
  "o1-preview": "2023-10", 
  "o1": "2023-10", 
  "o1-2024-12-17": "2023-10", 
  "o1-mini": "2023-10", 
  "o1-mini-2024-09-12": "2023-10", 
  "gpt-4o": "2023-10", 
  "gpt-4o-mini": "2023-10", 
  "gpt-4o-mini-2024-07-18": "2023-10", 
  "gpt-4o-2024-08-06": "2023-10",
  "chatgpt-4o-latest": "2023-10", 
  "gpt-4o-2024-11-20": "2023-10", 
  "gpt-4-turbo": "2023-12", 
  "gpt-4-turbo-preview": "2023-12",
  "claude-3-opus-20240229": "2023-08",
  "claude-3-sonnet-20240229": "2023-08",
  "claude-3-haiku-20240307": "2023-08",
  "claude-3-5-sonnet-20240620": "2024-04",
  "claude-3-5-sonnet-20241022": "2024-04",
  "claude-3-7-sonnet-20250219": "2024-04",
  "gemini-pro": "2023-12",
  "gemini-pro-vision": "2023-12",
  "gpt-4.5-preview-2025-02-27": "2024-10",
  "gpt-4.5-preview": "2024-10",
  "deepseek-v3": "2023-12",
  "deepseek-r1": "2023-12",
  "gpt-5": "2024-10",
  "gpt-5-mini": "2024-06",
  "gpt-5-nano": "2024-06",
  "gemini-pro-1.5": "2024-04"
}

/**
 * 直接调用OpenAI API的fetch方法
 */
export const gptFetch = async (url: string, data?: any, opt2?: any): Promise<any> => {
  mlog('gptFetch Direct', url)
  
  if (opt2?.upFile) {
    // 文件上传
    return directApiClient.uploadFile('openai', url, data as FormData)
  } else if (data) {
    // POST请求
    return directApiClient.openai(url, data)
  } else {
    // GET请求
    return directApiClient.openai(url, null, { method: 'GET' })
  }
}

/**
 * GPT上传器 - 使用直接API调用
 */
export const GptUploader = async (url: string, formData: FormData): Promise<any> => {
  try {
    return await directApiClient.uploadFile('openai', url, formData)
  } catch (error) {
    mlog('Upload error:', error)
    throw error
  }
}

/**
 * Whisper上传 - 语音转文字
 */
export const whisperUpload = async (formData: FormData): Promise<any> => {
  return directApiClient.uploadFile('openai', '/v1/audio/transcriptions', formData)
}

/**
 * GPT文件上传
 */
export const gptUploadFile = async (url: string, formData: FormData): Promise<any> => {
  return {
    data: await directApiClient.uploadFile('openai', url, formData)
  }
}

/**
 * 提交GPT请求处理
 */
export const subGPT = async (data: any, chat: Chat.Chat): Promise<void> => {
  let action = data.action

  if (action === 'gpt.dall-e-3' && data.data && data.data.model && data.data.model.indexOf('ideogram') > -1) {
    // Ideogram处理
    try {
      let d = await ideoSubmit(data.data)
      const rz = d[0]
      chat.text = rz.prompt
      chat.opt = { imageUrl: rz.url }
      chat.loading = false
      homeStore.setMyData({ act: 'updateChat', actData: chat })
    } catch (e) {
      chat.text = '失败！\n```json\n' + e + '\n```\n'
      chat.loading = false
      homeStore.setMyData({ act: 'updateChat', actData: chat })
    }
  } else if (action === 'gpt.dall-e-3' && data.data.base64Array !== undefined) {
    // 图片编辑
    const formData = new FormData()
    for (let o in data.data) {
      if (o === 'base64Array') {
        for (let f of data.data.base64Array) {
          formData.append('image[]', f.file)
        }
      } else {
        formData.append(o, data.data[o])
      }
    }

    try {
      const ds = await gptUploadFile('/v1/images/edits', formData)
      const d = ds.data
      
      let key = 'dall:' + chat.myid
      const rz: any = d.data[0]
      if (rz.b64_json) {
        const base64 = 'data:image/png;base64,' + rz.b64_json
        await localSaveAny(base64, key)
      }
      
      chat.text = rz.revised_prompt ?? '图片已完成'
      chat.opt = { imageUrl: rz.url ? rz.url : 'https://www.openai-hk.com/res/img/open.png' }
      chat.loading = false
      homeStore.setMyData({ act: 'updateChat', actData: chat })
    } catch (e) {
      chat.text = '失败！\n```json\n' + (JSON.stringify(e, null, 2)) + '\n```\n'
      chat.loading = false
      homeStore.setMyData({ act: 'updateChat', actData: chat })
    }
  } else if (action === 'gpt.dall-e-3') {
    // DALL-E图片生成
    try {
      let d = await gptFetch('/v1/images/generations', data.data)
      const rz: any = d.data[0]
      let key = 'dall:' + chat.myid

      if (rz.b64_json) {
        const base64 = 'data:image/png;base64,' + rz.b64_json
        await localSaveAny(base64, key)
      }
      
      chat.text = rz.revised_prompt ?? '图片已完成'
      chat.opt = { imageUrl: rz.url ? rz.url : 'https://www.openai-hk.com/res/img/open.png' }
      chat.loading = false
      homeStore.setMyData({ act: 'updateChat', actData: chat })
    } catch (e) {
      chat.text = '失败！\n```json\n' + (JSON.stringify(e, null, 2)) + '\n```\n'
      chat.loading = false
      homeStore.setMyData({ act: 'updateChat', actData: chat })
    }
  }
}

/**
 * 判断是否为图片生成模型
 */
export const isDallImageModel = (model: string | undefined): boolean => {
  if (!model) return false
  if (model.indexOf('flux') > -1) return true
  if (model.indexOf('ideogram') > -1) return true
  if (model.indexOf('gpt-image') > -1) return true
  return ['dall-e-2', 'dall-e-3', 'ideogram'].indexOf(model) > -1
}

interface SubModelType {
  message: any[]
  onMessage: (d: { text: string, isFinish: boolean, isAll?: boolean }) => void
  onError?: (d?: any) => void
  signal?: AbortSignal
  model?: string
  uuid?: string | number
}

/**
 * 获取系统消息
 */
export const getSystemMessage = (uuid?: number): string => {
  let sysTem = gptConfigStore.myData.systemMessage
  if (uuid) {
    const chatS = new chatSetting(uuid)
    sysTem = chatS.getGptConfig().systemMessage
  }
  if (sysTem) return sysTem
  
  let model = gptConfigStore.myData.model ? gptConfigStore.myData.model : "gpt-3.5-turbo"
  let producer = 'You are ChatGPT, a large language model trained by OpenAI.'
  
  if (model.includes('claude')) producer = 'You are Claude, a large language model trained by Anthropic.'
  if (model.includes('gemini')) producer = 'You are Gemini, a large language model trained by Google.'
  if (model.includes('deepseek')) producer = 'You are DeepSeek, a large language model trained by DeepSeek.'
  if (model.includes('grok')) producer = 'You are grok, a large language model trained by xAi.'
  
  // 用户自定义系统消息
  if (homeStore.myData.session?.systemMessage) producer = homeStore.myData.session.systemMessage
  
  let DEFAULT_SYSTEM_TEMPLATE = `${producer}`

  if (KnowledgeCutOffDate[model] || model.indexOf('gpt-') > -1) {
    DEFAULT_SYSTEM_TEMPLATE += `
Knowledge cutoff: ${KnowledgeCutOffDate[model] ?? KnowledgeCutOffDate.default}`
  }
  
  DEFAULT_SYSTEM_TEMPLATE += `
Current model: ${model}
Current time: ${new Date().toLocaleString()}
Latex inline: $x^2$
Latex block: $$e=mc^2$$`
  
  return DEFAULT_SYSTEM_TEMPLATE
}

/**
 * 检查是否为新模型（o1系列等）
 */
export const isNewModel = (model: string): boolean => {
  return model.startsWith('o1-') || model.includes('gpt-5')
}

/**
 * 模型调用 - 使用直接API
 */
export const subModel = async (opt: SubModelType): Promise<void> => {
  let model = opt.model ?? (gptConfigStore.myData.model ? gptConfigStore.myData.model : "gpt-3.5-turbo")
  let max_tokens = gptConfigStore.myData.max_tokens
  let temperature = 0.5
  let top_p = 1
  let presence_penalty = 0
  let frequency_penalty = 0

  if (opt.uuid) {
    const chatSet = new chatSetting(+opt.uuid)
    const gStore = chatSet.getGptConfig()
    temperature = gStore.temperature ?? temperature
    top_p = gStore.top_p ?? top_p
    presence_penalty = gStore.presence_penalty ?? presence_penalty
    frequency_penalty = gStore.frequency_penalty ?? frequency_penalty
    max_tokens = gStore.max_tokens
  }

  if (model === 'gpt-4-vision-preview' && max_tokens > 2048) max_tokens = 2048

  let body: any = {
    max_tokens,
    model,
    temperature,
    top_p,
    presence_penalty,
    frequency_penalty,
    messages: opt.message,
    stream: true
  }

  if (isNewModel(model)) {
    body = {
      max_completion_tokens: max_tokens,
      model,
      top_p,
      presence_penalty,
      frequency_penalty,
      messages: opt.message,
      stream: false
    }
  }

  if (body.stream) {
    try {
      let is_reasoning_content = false
      
      await directApiClient.openaiStream(
        '/v1/chat/completions',
        body,
        (data: string) => {
          if (data === '[DONE]') {
            opt.onMessage({ text: '', isFinish: true })
          } else {
            try {
              const obj = JSON.parse(data)
              if (obj.choices[0].delta?.reasoning_content) {
                if (!is_reasoning_content) {
                  opt.onMessage({ text: "\n<think>\n", isFinish: false })
                }
                opt.onMessage({ text: obj.choices[0].delta?.reasoning_content, isFinish: obj.choices[0].finish_reason != null })
                is_reasoning_content = true
              } else {
                if (is_reasoning_content) {
                  opt.onMessage({ text: "\n</think>\n", isFinish: false })
                }
                is_reasoning_content = false
                opt.onMessage({ text: obj.choices[0].delta?.content ?? '', isFinish: obj.choices[0].finish_reason != null })
              }
            } catch (e) {
              mlog('Stream parse error:', e)
            }
          }
        },
        (error) => {
          mlog('Stream error:', error)
          opt.onError && opt.onError(error)
        },
        opt.signal
      )
    } catch (error) {
      mlog('Stream error:', error)
      opt.onError && opt.onError(error)
    }
  } else {
    try {
      opt.onMessage({ text: t('mj.thinking'), isFinish: false })
      let obj: any = await gptFetch('/v1/chat/completions', body)
      opt.onMessage({ text: obj.choices[0].message.content ?? '', isFinish: true, isAll: true })
    } catch (error) {
      mlog('Non-stream error:', error)
      opt.onError && opt.onError(error)
    }
  }
}

export interface TtsType {
  model: string
  input: string
  voice?: string
}

/**
 * TTS语音合成
 */
export const subTTS = async (tts: TtsType): Promise<any> => {
  if (!tts.voice) tts.voice = 'alloy'
  
  try {
    const apiConfig = useApiConfigStore()
    const url = `${apiConfig.openaiApiBaseUrl}/v1/audio/speech`
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiConfig.openaiApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(tts)
    })

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }
    
    const audioData = await response.arrayBuffer()
    const contentType = response.headers.get('Content-Type')
    const blob = new Blob([audioData], { type: contentType ?? 'audio/mpeg' })
    
    const saveID = await localSaveAny(blob)
    const pp = await bolbObj(blob)
    
    return { blob, saveID, ...pp }
  } catch (error) {
    mlog('TTS error:', error)
    throw error
  }
}

/**
 * Blob对象处理
 */
export const bolbObj = (blob: Blob): Promise<{ player: HTMLAudioElement, duration: number }> => {
  return new Promise((resolve, reject) => {
    const player = new window.Audio()
    player.src = URL.createObjectURL(blob)

    player.addEventListener('loadedmetadata', () => {
      mlog('时长', player.duration)
      resolve({ player, duration: player.duration })
    })
    
    player.addEventListener('error', (e) => {
      reject(e)
    })
    
    player.load()
  })
}

/**
 * 获取GPT使用量（直接API调用可能受限）
 */
export const gptUsage = async (): Promise<any> => {
  try {
    const [startDate, endDate] = formatDate()
    const urlUsage = `/v1/dashboard/billing/usage?start_date=${startDate}&end_date=${endDate}`
    const usageData = await gptFetch(urlUsage)
    const billData = await gptFetch('/v1/dashboard/billing/subscription')

    const usage = Math.round(usageData.total_usage) / 100
    return {
      usage,
      remaining: Math.round((billData.hard_limit ?? billData.hard_limit_usd * 100) - usageData.total_usage) / 100,
      hard_limit_usd: billData.hard_limit_usd
    }
  } catch (error) {
    mlog('Usage fetch error:', error)
    throw error
  }
}

function formatDate(): string[] {
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth() + 1
  const lastDay = new Date(year, month, 0)
  const formattedFirstDay = `${year}-${month.toString().padStart(2, '0')}-01`
  const formattedLastDay = `${year}-${month.toString().padStart(2, '0')}-${lastDay.getDate().toString().padStart(2, '0')}`
  return [formattedFirstDay, formattedLastDay]
}

// 其他工具函数...
export const getInitChat = (txt: string): Chat.Chat => {
  let promptMsg: Chat.Chat = {
    dateTime: new Date().toLocaleString(),
    text: txt,
    inversion: true,
    error: false,
    conversationOptions: null,
    requestOptions: { prompt: txt, options: null }
  }
  return promptMsg
}

// 移除后端依赖的配置设置函数
export const openaiSetting = (q: any, ms: any): void => {
  mlog('setting', q)
  const apiConfig = useApiConfigStore()
  
  if (q.settings) {
    try {
      let obj = JSON.parse(q.settings)
      const url = obj.url ?? undefined
      const key = obj.key ?? undefined
      
      apiConfig.updateConfig({
        openaiApiBaseUrl: url,
        openaiApiKey: key,
        mjServerUrl: url,
        mjApiSecret: key,
        sunoServerUrl: url,
        sunoApiKey: key,
        lumaServerUrl: url,
        lumaApiKey: key
        // 更新其他服务配置...
      })
      
      ms.success("设置API配置成功！")
    } catch (error) {
      ms.error("配置格式错误")
    }
  }
}

export const isDisableMenu = (menu: string): boolean => {
  return (homeStore.myData.session && homeStore.myData.session.menuDisable && 
    homeStore.myData.session.menuDisable.indexOf(menu) > -1)
}

// URL清理函数，用于处理服务器配置
export const blurClean = (): void => {
  mlog('blurClean')
  if (gptServerStore.myData.OPENAI_API_BASE_URL) {
    gptServerStore.myData.OPENAI_API_BASE_URL = myTrim(myTrim(gptServerStore.myData.OPENAI_API_BASE_URL.trim(), '/'), '\\')
  }
  if (gptServerStore.myData.OPENAI_API_KEY) {
    gptServerStore.myData.OPENAI_API_KEY = gptServerStore.myData.OPENAI_API_KEY.trim()
  }
  if (gptServerStore.myData.MJ_SERVER) {
    gptServerStore.myData.MJ_SERVER = myTrim(myTrim(gptServerStore.myData.MJ_SERVER.trim(), '/'), '\\')
  }
  if (gptServerStore.myData.MJ_API_SECRET) {
    gptServerStore.myData.MJ_API_SECRET = gptServerStore.myData.MJ_API_SECRET.trim()
  }
  if (gptServerStore.myData.UPLOADER_URL) {
    gptServerStore.myData.UPLOADER_URL = myTrim(myTrim(gptServerStore.myData.UPLOADER_URL.trim(), '/'), '\\')
  }
}

// Token计数相关函数
export const countTokens = async (dataSources: Chat.Chat[], input: string, uuid: number): Promise<any> => {
  const chatSet = new chatSetting(uuid)
  const myStore = chatSet.getGptConfig()
  let rz = { system: 0, input: 0, history: 0, remain: 330, modelTokens: '4k', planOuter: myStore.max_tokens }
  const model = myStore.model
  const max = getModelMax(model)
  let unit = 1024
  
  if (model === 'gpt-4-1106-preview' || model === 'gpt-4-vision-preview') unit = 1000
  if (model.indexOf('gpt-4-turbo') > -1) unit = 1000
  
  rz.modelTokens = `${max}k`

  const encode = await encodeAsync()
  rz.input = encode(input).length
  rz.system = encode(getSystemMessage()).length
  const encodeChat = await encodeChatAsync()
  const msg = await getHistoryMessage(dataSources, 1)
  rz.history = msg.length === 0 ? 0 : encodeChat(msg, model.indexOf('gpt-4') > -1 ? 'gpt-4' : 'gpt-3.5-turbo').length
  rz.remain = unit * max - rz.history - rz.planOuter - rz.input - rz.system

  return rz
}

const getModelMax = (model: string): number => {
  let max = 4
  model = model.toLowerCase()
  if (model.indexOf('8k') > -1) {
    return 8
  } else if (model.indexOf('16k') > -1 || model === 'gpt-3.5-turbo-1106' || model === 'gpt-3.5-turbo-0125') {
    return 16
  } else if (model.indexOf('32k') > -1) {
    return 32
  } else if (model.indexOf('grok') > -1) {
    return 128
  } else if (model.indexOf('gpt-4.5') > -1 || model.indexOf('gpt-4-turbo') > -1 || model.indexOf('gpt-4o') > -1 || model.indexOf('o1-') > -1) {
    return 128
  } else if (model.indexOf('64k') > -1 || model.indexOf('deepseek') > -1) {
    return 64
  } else if (model.indexOf('128k') > -1 || model === 'gpt-4-1106-preview' || model === 'gpt-4-0125-preview' || model === 'gpt-4-vision-preview') {
    return 128
  } else if (model.indexOf('gpt-4') > -1) {
    max = 8
  } else if (model.toLowerCase().includes('claude-3')) {
    return 120
  }
  return max
}

export const encodeAsync = async () => {
  const { encode } = await import('gpt-tokenizer')
  return encode
}

export const encodeChatAsync = async () => {
  const { encodeChat } = await import('gpt-tokenizer')
  return encodeChat
}

export const getHistoryMessage = async (dataSources: Chat.Chat[], loadingCnt = 1, start = 1000): Promise<any[]> => {
  let i = 0
  let rz: any[] = []
  let istart = (isNumber(start) && start >= 0) ? Math.min(start, dataSources.length - loadingCnt) : dataSources.length - loadingCnt
  
  for (let ii = istart; ii >= 0; ii--) {
    if (i >= gptConfigStore.myData.talkCount) break
    i++

    let o = dataSources[ii]
    let content = o.text
    
    if (o.inversion && o.opt?.images && o.opt.images.length > 0) {
      try {
        let str = await localGet(o.opt.images[0]) as string
        let fileBase64 = JSON.parse(str) as string[]
        let arr = fileBase64.filter((ff: string) => ff.indexOf('http') > -1)
        if (arr.length > 0) content = arr.join(' ') + ' ' + content
      } catch (ee) {
        // 忽略错误
      }
    }

    rz.push({ content, role: !o.inversion ? 'assistant' : 'user' })
  }
  
  rz.reverse()
  return rz
}

// Cookie相关函数（在无后端版本中可能不需要，但保留兼容性）
export const regCookie = async (n: string): Promise<void> => {
  // 在无后端版本中，这个函数可能不需要实际功能
  // 保留为空函数以保持兼容性
  if (n === '') return
  mlog('regCookie (no-backend version):', n)
}
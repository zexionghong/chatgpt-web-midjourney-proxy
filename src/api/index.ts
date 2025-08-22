import type { AxiosProgressEvent, GenericAbortSignal } from 'axios'
import { post } from '@/utils/request'
import { homeStore, useAuthStore, useSettingStore } from '@/store'


export function fetchChatAPI<T = any>(
  prompt: string,
  options?: { conversationId?: string; parentMessageId?: string },
  signal?: GenericAbortSignal,
) {
  return post<T>({
    url: '/chat',
    data: { prompt, options },
    signal,
  })
}

export function fetchChatConfig<T = any>() {
  return post<T>({
    url: '/config',
  })
}

export function fetchChatAPIProcess<T = any>(
  params: {
    prompt: string
    options?: { conversationId?: string; parentMessageId?: string }
    signal?: GenericAbortSignal
    onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void },
) {
  const settingStore = useSettingStore()
  const authStore = useAuthStore()

  let data: Record<string, any> = {
    prompt: params.prompt,
    options: params.options,
  }

  if (authStore.isChatGPTAPI) {
    data = {
      ...data,
      systemMessage: settingStore.systemMessage,
      temperature: settingStore.temperature,
      top_p: settingStore.top_p,
    }
  }

  return post<T>({
    url: '/chat-process',
    data,
    signal: params.signal,
    onDownloadProgress: params.onDownloadProgress,
  })
}

export function fetchSession<T>() {
  // 直接返回客户端配置，不再依赖后端session接口
  return Promise.resolve({
    "status": "Success",
    "message": "",
    "data": {
      "isHideServer": false,
      "isUpload": false,
      "auth": false,
      "model": "ChatGPTAPI",
      "amodel": "gpt-4",
      "isApiGallery": false,
      "cmodels": "",
      "baiduId": "",
      "googleId": "",
      "notify": "",
      "disableGpt4": "",
      "isWsrv": "",
      "uploadImgSize": "1",
      "gptUrl": "",
      "theme": "dark",
      "isCloseMdPreview": false,
      "uploadType": "api",
      "turnstile": "",
      "menuDisable": "",
      "visionModel": "",
      "systemMessage": "",
      "customVisionModel": "",
      "backgroundImage": "",
      "isHk": false
    }
  } as T)
}

export function fetchVerify<T>(token: string) {
  return post<T>({
    url: '/verify',
    data: { token },
  })
}

export * from "./mjapi"
export * from "./mjsave"
// 使用新的直接API调用，替换原有的后端依赖调用
export * from "./openapi-direct"
export * from "./units"
export * from "./mic"
export * from "./chat"
export * from "./sse/fetchsse"
export * from "./Recognition"
export * from "./luma"
export * from "./ideo"
export * from "./realtime"


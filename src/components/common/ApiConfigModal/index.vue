<template>
  <NModal v-model:show="show" :mask-closable="false" style="width: 90%; max-width: 600px">
    <NCard 
      title="API配置设置" 
      :bordered="false" 
      size="huge" 
      role="dialog" 
      aria-modal="true"
    >
      <template #header-extra>
        <NButton text @click="show = false">
          <SvgIcon icon="ri:close-line" />
        </NButton>
      </template>

      <div class="space-y-4">
        <NAlert type="info" :show-icon="false">
          请配置您的API密钥和服务地址。这些信息将安全地存储在您的浏览器本地存储中。
        </NAlert>

        <NTabs type="card" animated>
          <NTabPane name="openai" tab="OpenAI/ChatGPT">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium mb-2">API Base URL</label>
                <NInput 
                  v-model:value="localConfig.openaiApiBaseUrl"
                  placeholder="https://api.openai.com"
                  clearable
                />
              </div>
              <div>
                <label class="block text-sm font-medium mb-2">API Key</label>
                <NInput 
                  v-model:value="localConfig.openaiApiKey"
                  type="password" 
                  placeholder="sk-..."
                  clearable
                  show-password-on="click"
                />
              </div>
            </div>
          </NTabPane>

          <NTabPane name="midjourney" tab="Midjourney">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium mb-2">Server URL</label>
                <NInput 
                  v-model:value="localConfig.mjServerUrl"
                  placeholder="https://your-mj-server.com"
                  clearable
                />
              </div>
              <div>
                <label class="block text-sm font-medium mb-2">API Secret</label>
                <NInput 
                  v-model:value="localConfig.mjApiSecret"
                  type="password"
                  placeholder="your-api-secret"
                  clearable
                  show-password-on="click"
                />
              </div>
            </div>
          </NTabPane>

          <NTabPane name="suno" tab="Suno音乐">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium mb-2">Server URL</label>
                <NInput 
                  v-model:value="localConfig.sunoServerUrl"
                  placeholder="https://your-suno-server.com"
                  clearable
                />
              </div>
              <div>
                <label class="block text-sm font-medium mb-2">API Key</label>
                <NInput 
                  v-model:value="localConfig.sunoApiKey"
                  type="password"
                  placeholder="your-suno-key"
                  clearable
                  show-password-on="click"
                />
              </div>
            </div>
          </NTabPane>

          <NTabPane name="luma" tab="Luma视频">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium mb-2">Server URL</label>
                <NInput 
                  v-model:value="localConfig.lumaServerUrl"
                  placeholder="https://your-luma-server.com"
                  clearable
                />
              </div>
              <div>
                <label class="block text-sm font-medium mb-2">API Key</label>
                <NInput 
                  v-model:value="localConfig.lumaApiKey"
                  type="password"
                  placeholder="your-luma-key"
                  clearable
                  show-password-on="click"
                />
              </div>
            </div>
          </NTabPane>

          <NTabPane name="other" tab="其他服务">
            <div class="space-y-4">
              <NCollapse>
                <NCollapseItem title="Runway" name="runway">
                  <div class="space-y-3">
                    <NInput 
                      v-model:value="localConfig.runwayServerUrl"
                      placeholder="Runway Server URL"
                      clearable
                    />
                    <NInput 
                      v-model:value="localConfig.runwayApiKey"
                      type="password"
                      placeholder="Runway API Key"
                      clearable
                      show-password-on="click"
                    />
                  </div>
                </NCollapseItem>

                <NCollapseItem title="Viggle舞蹈" name="viggle">
                  <div class="space-y-3">
                    <NInput 
                      v-model:value="localConfig.viggleServerUrl"
                      placeholder="Viggle Server URL"
                      clearable
                    />
                    <NInput 
                      v-model:value="localConfig.viggleApiKey"
                      type="password"
                      placeholder="Viggle API Key"
                      clearable
                      show-password-on="click"
                    />
                  </div>
                </NCollapseItem>

                <NCollapseItem title="Ideogram" name="ideogram">
                  <div class="space-y-3">
                    <NInput 
                      v-model:value="localConfig.ideoServerUrl"
                      placeholder="Ideogram Server URL"
                      clearable
                    />
                    <NInput 
                      v-model:value="localConfig.ideoApiKey"
                      type="password"
                      placeholder="Ideogram API Key"
                      clearable
                      show-password-on="click"
                    />
                  </div>
                </NCollapseItem>

                <NCollapseItem title="其他AI服务" name="others">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <!-- Kling -->
                    <div>
                      <label class="text-xs text-gray-500">Kling</label>
                      <NInput v-model:value="localConfig.klingServerUrl" size="small" placeholder="Server URL" />
                      <NInput v-model:value="localConfig.klingApiKey" size="small" type="password" placeholder="API Key" class="mt-1" />
                    </div>
                    
                    <!-- Pika -->
                    <div>
                      <label class="text-xs text-gray-500">Pika</label>
                      <NInput v-model:value="localConfig.pikaServerUrl" size="small" placeholder="Server URL" />
                      <NInput v-model:value="localConfig.pikaApiKey" size="small" type="password" placeholder="API Key" class="mt-1" />
                    </div>
                    
                    <!-- Udio -->
                    <div>
                      <label class="text-xs text-gray-500">Udio</label>
                      <NInput v-model:value="localConfig.udioServerUrl" size="small" placeholder="Server URL" />
                      <NInput v-model:value="localConfig.udioApiKey" size="small" type="password" placeholder="API Key" class="mt-1" />
                    </div>
                    
                    <!-- Pixverse -->
                    <div>
                      <label class="text-xs text-gray-500">Pixverse</label>
                      <NInput v-model:value="localConfig.pixverseServerUrl" size="small" placeholder="Server URL" />
                      <NInput v-model:value="localConfig.pixverseApiKey" size="small" type="password" placeholder="API Key" class="mt-1" />
                    </div>
                  </div>
                </NCollapseItem>
              </NCollapse>
            </div>
          </NTabPane>
        </NTabs>
      </div>

      <template #footer>
        <div class="flex justify-between">
          <div class="flex space-x-2">
            <NButton @click="importConfig">
              导入配置
            </NButton>
            <NButton @click="exportConfig">
              导出配置
            </NButton>
            <NButton type="error" ghost @click="resetConfig">
              重置配置
            </NButton>
          </div>
          <div class="flex space-x-2">
            <NButton @click="show = false">取消</NButton>
            <NButton type="primary" @click="saveConfig">保存配置</NButton>
          </div>
        </div>
      </template>
    </NCard>
  </NModal>
</template>

<script setup lang="ts">
import { ref, reactive, watch, nextTick } from 'vue'
import { 
  NModal, NCard, NButton, NInput, NTabs, NTabPane, NAlert,
  NCollapse, NCollapseItem, useMessage
} from 'naive-ui'
import { SvgIcon } from '@/components/common'
import { useApiConfigStore, type ApiConfig, defaultApiConfig } from '@/store/modules/apiConfig'

interface Props {
  visible: boolean
}

interface Emits {
  (e: 'update:visible', visible: boolean): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const message = useMessage()
const apiConfigStore = useApiConfigStore()

const show = ref(props.visible)
const localConfig = reactive<ApiConfig>({ ...defaultApiConfig })

// 监听prop变化
watch(() => props.visible, (newVal) => {
  show.value = newVal
  if (newVal) {
    loadConfig()
  }
})

// 监听内部show变化
watch(show, (newVal) => {
  emit('update:visible', newVal)
})

// 加载配置
const loadConfig = () => {
  const currentConfig = apiConfigStore.exportConfig()
  Object.assign(localConfig, currentConfig)
}

// 保存配置
const saveConfig = () => {
  try {
    apiConfigStore.updateConfig(localConfig)
    message.success('配置保存成功！')
    show.value = false
  } catch (error) {
    message.error('配置保存失败')
    console.error(error)
  }
}

// 重置配置
const resetConfig = () => {
  Object.assign(localConfig, defaultApiConfig)
  message.info('配置已重置')
}

// 导入配置
const importConfig = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.json'
  
  input.onchange = (e) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (!file) return
    
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const config = JSON.parse(e.target?.result as string)
        Object.assign(localConfig, defaultApiConfig, config)
        message.success('配置导入成功！')
      } catch (error) {
        message.error('配置文件格式错误')
      }
    }
    reader.readAsText(file)
  }
  
  input.click()
}

// 导出配置
const exportConfig = () => {
  try {
    const config = { ...localConfig }
    // 可以选择是否导出敏感信息
    const blob = new Blob([JSON.stringify(config, null, 2)], { 
      type: 'application/json' 
    })
    
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `api-config-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    
    URL.revokeObjectURL(url)
    message.success('配置导出成功！')
  } catch (error) {
    message.error('配置导出失败')
  }
}
</script>

<style scoped>
.space-y-4 > * + * {
  margin-top: 1rem;
}

.space-y-3 > * + * {
  margin-top: 0.75rem;
}

.space-x-2 > * + * {
  margin-left: 0.5rem;
}
</style>
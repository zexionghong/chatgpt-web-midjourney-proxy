<script setup lang='ts'>
import { computed, ref } from 'vue'
import { NModal, NTabPane, NTabs } from 'naive-ui'
import General from './General.vue'
import Advanced from './Advanced.vue'
import aiModel from '@/views/mj/aiModel.vue'
import aiSetServer from '@/views/mj/aiSetServer.vue'
import About from './About.vue'
import { homeStore, useAuthStore } from '@/store'
import { SvgIcon, ApiConfigModal } from '@/components/common'

interface Props {
  visible: boolean
}

interface Emit {
  (e: 'update:visible', visible: boolean): void
}

const props = defineProps<Props>()

const emit = defineEmits<Emit>()

const authStore = useAuthStore()

const isChatGPTAPI = computed<boolean>(() => !!authStore.isChatGPTAPI)

const active = ref('ApiConfig')  // 默认打开API配置页面
const showApiConfigModal = ref(false)

const show = computed({
  get() {
    return props.visible
  },
  set(visible: boolean) {
    emit('update:visible', visible)
  },
})
</script>

<template>
  <NModal v-model:show="show" :auto-focus="false" preset="card" style="width: 95%; max-width: 640px">
    <div>
      <NTabs v-model:value="active" type="line" animated>
        <NTabPane name="ApiConfig" tab="API配置">
          <template #tab>
            <SvgIcon class="text-lg" icon="ri:key-line" />
            <span class="ml-2">API配置</span>
          </template>
          <div class="min-h-[100px] p-4">
            <div class="space-y-4">
              <div class="text-lg font-medium">无后端版本 - API密钥配置</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">
                此版本直接调用第三方AI服务API，需要配置相应的API密钥。配置信息将安全存储在您的浏览器本地。
              </div>
              <div class="flex space-x-4">
                <button 
                  @click="showApiConfigModal = true"
                  class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  配置API密钥
                </button>
              </div>
              <div class="text-xs text-gray-500">
                <div class="space-y-1">
                  <div>• API密钥只存储在您的浏览器本地，不会发送到任何服务器</div>
                  <div>• 支持OpenAI、Midjourney、Suno、Luma等多种AI服务</div>
                  <div>• 由于CORS限制，建议使用支持跨域的API代理服务</div>
                </div>
              </div>
            </div>
          </div>
        </NTabPane>
        
        <NTabPane name="General" tab="General">
          <template #tab>
            <SvgIcon class="text-lg" icon="ri:file-user-line" />
            <span class="ml-2">{{ $t('setting.general') }}</span>
          </template>
          <div class="min-h-[100px]">
            <General />
          </div>
        </NTabPane>
        <NTabPane v-if="isChatGPTAPI" name="Advanced" tab="Advanced">
          <template #tab>
            <SvgIcon class="text-lg" icon="ri:equalizer-line" />
            <!-- <span class="ml-2">{{ $t('setting.advanced') }}</span> -->
            <span class="ml-2">{{ $t('mjset.model') }}</span>
          </template>
          <div class="min-h-[100px]">
            <!-- <Advanced /> -->
            <aiModel/>
          </div>
        </NTabPane>

        <NTabPane name="server" tab="server" v-if=" ! homeStore.myData.session.isHideServer">
          <template #tab>
            <SvgIcon class="text-lg" icon="mingcute:server-line" />
            <span class="ml-2">{{ $t('mjset.server') }}</span>
          </template>
          <aiSetServer />
        </NTabPane>
        <NTabPane name="Config" tab="Config">
          <template #tab>
            <SvgIcon class="text-lg" icon="ri:list-settings-line" />
            <!-- <span class="ml-2">{{ $t('setting.config') }}</span> -->
            <span class="ml-2">{{ $t('mjset.about') }}</span>
          </template>
          <About />
        </NTabPane>

      </NTabs>
    </div>
  </NModal>
  
  <!-- API配置弹窗 -->
  <ApiConfigModal v-model:visible="showApiConfigModal" />
</template>

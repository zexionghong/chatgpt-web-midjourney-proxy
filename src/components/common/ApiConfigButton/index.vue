<template>
  <div>
    <NButton 
      type="primary" 
      ghost 
      @click="showConfigModal = true"
      :loading="checkingConfig"
    >
      <template #icon>
        <SvgIcon icon="ri:settings-3-line" />
      </template>
      API配置
      <NBadge 
        v-if="!isConfigured" 
        dot 
        type="error" 
        :show="true"
        style="margin-left: 4px"
      />
    </NButton>
    
    <ApiConfigModal v-model:visible="showConfigModal" />
    
    <!-- 配置状态提示 -->
    <NAlert 
      v-if="!isConfigured && showTip" 
      type="warning" 
      style="margin-top: 8px"
      closable
      @close="showTip = false"
    >
      请先配置API密钥才能使用AI功能
      <template #action>
        <NButton size="small" @click="showConfigModal = true">
          立即配置
        </NButton>
      </template>
    </NAlert>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { NButton, NBadge, NAlert, useMessage } from 'naive-ui'
import { SvgIcon, ApiConfigModal } from '@/components/common'
import { useApiConfigStore } from '@/store/modules/apiConfig'

const apiConfigStore = useApiConfigStore()
const message = useMessage()

const showConfigModal = ref(false)
const checkingConfig = ref(false)
const showTip = ref(false)

// 检查是否已配置
const isConfigured = computed(() => {
  return apiConfigStore.isOpenaiConfigured || 
         apiConfigStore.isMjConfigured || 
         apiConfigStore.isSunoConfigured
})

// 检查配置状态
const checkConfigStatus = async () => {
  checkingConfig.value = true
  
  try {
    // 这里可以添加检查API连通性的逻辑
    await new Promise(resolve => setTimeout(resolve, 500)) // 模拟检查过程
    
    if (!isConfigured.value) {
      showTip.value = true
    }
  } catch (error) {
    console.error('Config check failed:', error)
  } finally {
    checkingConfig.value = false
  }
}

onMounted(() => {
  // 延迟显示提示，避免首次加载时过于突兀
  setTimeout(() => {
    if (!isConfigured.value) {
      showTip.value = true
    }
  }, 2000)
})
</script>

<style scoped>
:deep(.n-badge-sup) {
  transform: translate(50%, -50%);
}
</style>
<template>
  <router-view></router-view>
  <VersionUpdateNotification ref="versionNotificationRef" />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import VersionUpdateNotification from '@/components/version-update-notification.vue'
import { versionChecker } from '@/utils/version-checker'

const versionNotificationRef = ref<InstanceType<typeof VersionUpdateNotification> | null>(null)

onMounted(() => {
  if (import.meta.env.VITE_APP_MODE_ENV !== 'dev') {
    // 启动版本检测
    versionChecker.start((info) => {
      console.log('检测到新版本:', info)
      versionNotificationRef.value?.open(info)
    })
  }
})

onUnmounted(() => {
  // 停止版本检测
  versionChecker.stop()
})
</script>

<style scoped></style>

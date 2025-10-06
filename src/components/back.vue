<template>
  <div class="inline-block" @click="onBack">
    <slot>
      <div class="inline-block p-1 -ml-1 cursor-pointer hover:bg-gray-100 rounded">
        <ArrowLeft />
      </div>
    </slot>
  </div>
</template>

<script setup lang="ts">
import { ArrowLeft } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

defineOptions({
  name: 'BackBtn',
})

const router = useRouter()

const onBack = () => {
  router.back()
}
</script>

<style scoped></style>

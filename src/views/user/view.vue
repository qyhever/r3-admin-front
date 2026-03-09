<template>
  <div class="p-[20px]">
    <div class="p-[20px] bg-white rounded-[4px] space-y-4">
      <div class="flex items-center gap-4">
        <router-link to="/user" replace class="flex">
          <t-link hover="color" theme="primary">
            <div class="flex items-center">
              <ChevronLeft class-name="w-4 h-4" />
              返回
            </div>
          </t-link>
        </router-link>
        <h3 class="text-base font-bold">查看用户</h3>
      </div>
      <div class="grid grid-cols-1 gap-4">
        <div class="flex items-center">
          <div class="pr-4 text-[#000]/50 fs-14">名称</div>
          <div class="flex-1 min-w-0 text-[#000]/85 fs-14 text-left">
            {{ detailInfo.username }}
          </div>
        </div>
        <div class="flex items-center">
          <div class="pr-4 text-[#000]/50 fs-14">手机号</div>
          <div class="flex-1 min-w-0 text-[#000]/85 fs-14 text-left">
            {{ detailInfo.mobile }}
          </div>
        </div>
        <div class="flex items-center">
          <div class="pr-4 text-[#000]/50 fs-14">是否启用</div>
          <div class="flex-1 min-w-0 text-[#000]/85 fs-14 text-left">
            {{ detailInfo.isEnabled ? '是' : '否' }}
          </div>
        </div>
        <div class="flex items-center">
          <div class="pr-4 text-black/50 fs-14">描述</div>
          <div class="flex-1 min-w-0 text-[#000]/85 fs-14 text-left">
            {{ detailInfo.description }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useRequest } from 'alova/client'
import { ChevronLeft } from 'lucide-vue-next'
import { getUser } from './service'

defineOptions({
  name: 'ViewRole',
})

const { data: detailInfo } = useRequest(
  () => {
    return getUser(id.value)
  },
  {
    initialData: {},
  },
)

const route = useRoute()

const id = computed(() => {
  return Number(route.query.id)
})
</script>

<style scoped></style>

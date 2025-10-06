<template>
  <div class="p-[20px]">
    <div class="p-[20px] bg-white rounded-[4px] space-y-4">
      <ComBack />
      <div class="text-xl">查看角色</div>
      <div class="grid grid-cols-1 gap-4">
        <div class="flex items-center">
          <div class="pr-4 text-[#000]/50 fs-14">编码</div>
          <div class="flex-1 min-w-0 text-[#000]/85 fs-14 text-left">
            {{ detailInfo.code }}
          </div>
        </div>
        <div class="flex items-center">
          <div class="pr-4 text-[#000]/50 fs-14">名称</div>
          <div class="flex-1 min-w-0 text-[#000]/85 fs-14 text-left">
            {{ detailInfo.name }}
          </div>
        </div>
        <div class="flex items-center">
          <div class="pr-4 text-[#000]/50 fs-14">是否启用</div>
          <div class="flex-1 min-w-0 text-[#000]/85 fs-14 text-left">
            {{ detailInfo.isEnabled ? '是' : '否' }}
          </div>
        </div>
        <div class="flex">
          <div class="pr-4 text-[#000]/50 fs-14 leading-[34px]">权限</div>
          <div class="flex-1 min-w-0 text-[#000]/85 fs-14 text-left">
            <t-tree ref="treeRef" :data="resourceTreeData" expand-all />
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
import { getUser } from './service'
import { makeTree } from '@/utils'

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

const resourceTreeData = computed(() => {
  const resourceList = (detailInfo.value.resources || []).map((item) => {
    return {
      ...item,
      label: item.name,
      value: item.code,
    }
  })
  return makeTree(resourceList, 'code', 'parentCode')
})

const id = computed(() => {
  return Number(route.query.id)
})
</script>

<style scoped></style>

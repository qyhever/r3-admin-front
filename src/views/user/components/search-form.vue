<template>
  <div>
    <div class="grid grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 mb-5">
      <div class="flex items-center">
        <div class="pr-[12px] basis-[80px] text-right">手机号:</div>
        <div class="flex-1 min-w-0">
          <t-input v-model="formModel.mobile" clearable placeholder="请输入" />
        </div>
      </div>
      <div class="flex items-center">
        <div class="pr-[12px] basis-[80px] text-right">名称:</div>
        <div class="flex-1 min-w-0">
          <t-input v-model="formModel.username" clearable placeholder="请输入" />
        </div>
      </div>
      <div class="col-span-2 flex items-center">
        <div class="pr-[12px] basis-[80px] text-right">日期:</div>
        <div class="flex-1 min-w-0">
          <t-date-range-picker
            v-model="formModel.rangeDate"
            enable-time-picker
            clearable
            style="width: 100%"
          />
        </div>
      </div>
      <div class="col-span-full flex items-center gap-2 justify-end">
        <t-button @click="emit('change-query')">查询</t-button>
        <t-button theme="default" variant="base" @click="emit('reset')">重置</t-button>
      </div>
    </div>
    <div class="flex gap-2 mb-5">
      <router-link to="/user/create">
        <t-button>新增</t-button>
      </router-link>
      <t-button @click="emit('batch-delete')">批量删除</t-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { IQueryModel } from '../type'

defineOptions({
  name: 'SearchForm',
})

interface IProps {
  queryModel: IQueryModel
}

const { queryModel } = defineProps<IProps>()

const emit = defineEmits<{
  (e: 'update:query-model', form: IQueryModel): void
  (e: 'change-query'): void
  (e: 'reset'): void
  (e: 'create'): void
  (e: 'batch-delete'): void
}>()

const formModel = computed({
  get() {
    return queryModel
  },
  set(value) {
    emit('update:query-model', value)
  },
})
</script>

<style lang="less" scoped></style>

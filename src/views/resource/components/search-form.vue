<template>
  <div>
    <div class="grid grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 mb-5">
      <div class="flex items-center">
        <div class="pr-[12px] basis-[80px] text-right">code:</div>
        <div class="flex-1 min-w-0">
          <t-input v-model="formModel.code" clearable placeholder="请输入" />
        </div>
      </div>
      <div class="flex items-center">
        <div class="pr-[12px] basis-[80px] text-right">名称:</div>
        <div class="flex-1 min-w-0">
          <t-input v-model="formModel.name" clearable placeholder="请输入" />
        </div>
      </div>
      <div class="flex items-center">
        <div class="pr-[12px] basis-[80px] text-right">类型:</div>
        <div class="flex-1 min-w-0">
          <t-select
            v-model="formModel.type"
            :options="enumResourceType.arr"
            placeholder="请选择类型"
            clearable
          />
        </div>
      </div>
      <div class="flex items-center">
        <div class="pr-[12px] basis-[80px] text-right">父级code:</div>
        <div class="flex-1 min-w-0">
          <t-input v-model="formModel.parentCode" clearable placeholder="请输入" />
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
        <t-button theme="default" variant="base" @click="emit('refresh')">刷新</t-button>
      </div>
    </div>
    <div class="flex gap-2 mb-5">
      <t-button @click="emit('create')">新增</t-button>
      <t-button @click="emit('batch-delete')">批量删除</t-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { enumResourceType } from '@/utils/enum'
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
  (e: 'refresh'): void
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

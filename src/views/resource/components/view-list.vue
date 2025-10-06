<template>
  <div class="mb-5">
    <t-table
      row-key="id"
      :data="dataSource"
      :columns="columns as PrimaryTableCol[]"
      cell-empty-content="-"
      :loading="loading"
      :selected-row-keys="selectedRowKeys"
      v-bind="$attrs"
    >
      <template #type="{ row }">
        {{ row.type === '1' ? '目录' : '资源' }}
      </template>
      <template #isEnabled="{ row }">
        <span :class="row.isEnabled ? 'text-emerald-500' : 'text-red-500'">{{
          row.isEnabled ? '已启用' : '已禁用'
        }}</span>
      </template>
      <template #toggleEnabled="{ row }">
        <t-switch
          v-model="row.isEnabled"
          @change="(val) => emit('toggle-enabled', row.id, val as boolean)"
        />
      </template>
      <template #isSystemDefault="{ row }">
        {{ row.isSystemDefault ? '是' : '否' }}
      </template>
      <template #operation="{ row }">
        <div class="flex gap-2">
          <t-link hover="color" theme="primary" @click="emit('update-row', row)">编辑</t-link>
          <t-link hover="color" theme="danger" @click="emit('delete-row', row.id)">删除</t-link>
        </div>
      </template>
    </t-table>
  </div>
</template>

<script setup lang="ts">
// import { ref, reactive } from 'vue'
import type { PrimaryTableCol } from 'tdesign-vue-next'
import type { ResourceItem } from '../type'

defineOptions({
  name: 'ViewList',
})

interface IProps {
  dataSource: ResourceItem[]
  columns: PrimaryTableCol[]
  loading: boolean
  selectedRowKeys: (string | number)[]
}

const { dataSource, columns, loading, selectedRowKeys } = defineProps<IProps>()

const emit = defineEmits<{
  // (e: 'select-change'): void
  // (e: 'sort-change'): void
  (e: 'toggle-enabled', id: number, val: boolean): void
  (e: 'update-row', row: ResourceItem): void
  (e: 'delete-row', id: number): void
}>()
</script>

<style scoped></style>

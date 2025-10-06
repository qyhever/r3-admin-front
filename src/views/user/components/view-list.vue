<template>
  <div class="mb-5">
    <t-table
      row-key="id"
      :data="dataSource"
      :columns="columns"
      cell-empty-content="-"
      :loading="loading"
      :selected-row-keys="selectedRowKeys"
      v-bind="$attrs"
    >
      <template #isEnabled="{ row }">
        <span :class="row.isEnabled ? 'text-emerald-500' : 'text-red-500'">{{
          row.isEnabled ? '已启用' : '已禁用'
        }}</span>
      </template>
      <template #toggleEnabled="{ row }">
        <t-switch
          v-model="row.isEnabled"
          @change="(val) => emit('toggle-enabled', row, val as boolean)"
        />
      </template>
      <template #isSystemDefault="{ row }">
        {{ row.isSystemDefault ? '是' : '否' }}
      </template>
      <template #operation="{ row }">
        <div class="flex gap-2">
          <router-link :to="{ path: '/user/update', query: { id: row.id } }">
            <t-link hover="color" theme="primary">编辑</t-link>
          </router-link>
          <t-link hover="color" theme="danger" @click="emit('delete-row', row)">删除</t-link>
          <router-link :to="{ path: '/user/view', query: { id: row.id } }">
            <t-link hover="color" theme="primary">查看</t-link>
          </router-link>
        </div>
      </template>
    </t-table>
  </div>
</template>

<script setup lang="ts">
// import { ref, reactive } from 'vue'
import type { PrimaryTableCol } from 'tdesign-vue-next'
import type { UserItem } from '../type'

defineOptions({
  name: 'ViewList',
})

interface IProps {
  dataSource: UserItem[]
  columns: PrimaryTableCol[]
  loading: boolean
  selectedRowKeys: (string | number)[]
}

const { dataSource, columns, loading, selectedRowKeys } = defineProps<IProps>()

const emit = defineEmits<{
  // (e: 'select-change'): void
  // (e: 'sort-change'): void
  (e: 'toggle-enabled', row: UserItem, val: boolean): void
  (e: 'delete-row', row: UserItem): void
}>()
</script>

<style scoped></style>

<template>
  <div class="p-[20px]">
    <div class="p-[20px] bg-white rounded-[4px]">
      <SearchForm
        v-model:query-model="state.queryModel"
        @change-query="send"
        @reset="onReset"
        @batch-delete="onBatchDelete"
      />
      <ViewList
        :data-source="dataSource"
        :columns="columns as PrimaryTableCol[]"
        :loading="querying"
        :selected-row-keys="selectedRowKeys"
        @select-change="onSelectChange as TableProps['onSelectChange']"
        @sort-change="onSortChange"
        @toggle-enabled="onToggleEnabled"
        @delete-row="onDelete"
      />
      <div class="flex justify-end">
        <t-pagination
          v-model="currentPage"
          v-model:page-size="pageSize"
          :total="total"
          show-jumper
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'
import type { TableProps, PrimaryTableCol } from 'tdesign-vue-next'
import { cloneDeep } from 'lodash-es'
import { usePagination } from 'alova/client'
import { getRoles, updateRole, deleteRole, batchDeleteRoles } from './service'
import type { RoleItem, IQueryModel } from './type'
import { formatTime } from '@/utils/date'
import SearchForm from './components/search-form.vue'
import ViewList from './components/view-list.vue'

defineOptions({
  name: 'RolePage',
})

const defaultQueryModel: IQueryModel = {
  code: '',
  name: '',
  sortField: '',
  sortValue: '',
  rangeDate: [],
}

const state = reactive({
  queryModel: cloneDeep(defaultQueryModel),
})

const {
  data: dataSource,
  total,
  page: currentPage,
  pageSize,
  loading: querying,
  send,
  reload,
  update,
} = usePagination(
  (currentPage, pageSize) => {
    return getRoles({
      currentPage,
      pageSize,
      ...state.queryModel,
    })
  },
  {
    initialData: {
      total: 0,
      data: [],
    },
    data: (r) => r.list,
  },
)

console.log('dataSource: ', dataSource)
const selectedRowKeys = ref<number[]>([])

// const data: TableProps['data'] = []
const columns = ref<TableProps<RoleItem>['columns']>([
  {
    colKey: 'row-select',
    type: 'multiple',
    width: 50,
  },
  {
    colKey: 'id',
    title: 'ID',
    width: '100',
  },
  {
    colKey: 'code',
    title: '编码',
  },
  {
    colKey: 'name',
    title: '名称',
  },
  {
    colKey: 'isEnabled',
    title: '状态',
  },
  {
    colKey: 'toggleEnabled',
    title: '启用/禁用',
  },
  {
    colKey: 'isSystemDefault',
    title: '系统内置',
  },
  {
    colKey: 'createdAt',
    title: '创建时间',
    sortType: 'all',
    sorter: true,
  },
  {
    colKey: 'updatedAt',
    title: '更新时间',
    sortType: 'all',
    sorter: true,
  },
  {
    colKey: 'operation',
    title: '操作',
  },
])

const onReset = () => {
  state.queryModel = cloneDeep(defaultQueryModel)
  reload()
}

const onToggleEnabled = async (row: RoleItem, checked: boolean) => {
  // Handle toggle enabled/disabled
  const id = row.id
  await updateRole({ id, isEnabled: checked })
  MessagePlugin.closeAll()
  MessagePlugin.success(`${checked ? '启用' : '禁用'}成功`)
  const newData = dataSource.value.map((item: RoleItem) => {
    const updatedAt = formatTime(new Date())
    if (item.id === id) {
      return { ...item, updatedAt }
    }
    return item
  })
  update({
    data: newData,
  })
}

const onSelectChange = (keys: number[]) => {
  selectedRowKeys.value = keys
}

const onSortChange: TableProps['onSortChange'] = (sorter) => {
  console.log('sorter: ', sorter)
  if (Array.isArray(sorter)) {
    // If multiple sorters are applied, we can handle it here if needed
    console.warn('Multiple sorters are not supported in this example.')
    return
  }
  if (sorter) {
    state.queryModel.sortField = sorter.sortBy
    state.queryModel.sortValue = sorter.descending ? 'desc' : 'asc'
  } else {
    state.queryModel.sortField = ''
    state.queryModel.sortValue = ''
  }
  send()
}

const onDelete = async (row: RoleItem) => {
  const id = row.id
  try {
    await deleteRole(id)
    MessagePlugin.closeAll()
    MessagePlugin.success('删除成功')
    const newData = dataSource.value.filter((item: RoleItem) => item.id !== id)
    update({
      data: newData,
    })
  } catch (error) {
    console.log('error: ', error)
  }
}

const onBatchDelete = async () => {
  if (selectedRowKeys.value.length === 0) {
    MessagePlugin.closeAll()
    MessagePlugin.warning('请先选择要删除的资源')
    return
  }
  await batchDeleteRoles(selectedRowKeys.value)
  MessagePlugin.closeAll()
  MessagePlugin.success('批量删除成功')
  send()
}
</script>

<style scoped></style>

<template>
  <t-dialog
    v-model:visible="visible"
    :header="dialogTitle"
    width="766px"
    :confirm-btn="{
      content: '提交',
    }"
    @close="close"
    @confirm="onSubmit"
  >
    <div>
      <t-form ref="formRef" :data="formModel" :rules="rules" label-width="100px">
        <t-form-item label="编码" name="code">
          <t-input v-model="formModel.code" placeholder="请输入编码" clearable />
        </t-form-item>
        <t-form-item label="名称" name="name">
          <t-input v-model="formModel.name" placeholder="请输入名称" clearable />
        </t-form-item>
        <t-form-item label="类型" name="type">
          <t-select
            v-model="formModel.type"
            :options="enumResourceType.arr"
            placeholder="请选择类型"
            clearable
          />
        </t-form-item>
        <t-form-item label="父级编码" name="parentCode">
          <t-input v-model="formModel.parentCode" placeholder="请输入父级编码" clearable />
        </t-form-item>
        <t-form-item label="是否启用" name="isEnabled">
          <t-radio-group v-model="formModel.isEnabled">
            <t-radio :value="true">是</t-radio>
            <t-radio :value="false">否</t-radio>
          </t-radio-group>
        </t-form-item>
      </t-form>
    </div>
  </t-dialog>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { cloneDeep } from 'lodash-es'
import { MessagePlugin, type FormInstanceFunctions } from 'tdesign-vue-next'
import type { CreateResourceDto, ResourceItem } from './type'
import { useRequest } from 'alova/client'
import { enumResourceType } from '@/utils/enum'
import { createResource, updateResource } from './service'

defineOptions({
  name: 'ResourceOperationDialog',
})

const emit = defineEmits<{
  (e: 'create'): void
  (e: 'update'): void
}>()

const defaultFormModel: CreateResourceDto = {
  code: '',
  name: '',
  type: '2',
  parentCode: '',
  isEnabled: true,
}

const { send: createResourceSend } = useRequest(
  () => {
    return createResource(formModel.value)
  },
  {
    immediate: false,
  },
)
const { send: updateResourceSend } = useRequest(
  () => {
    const formData = {
      ...formModel.value,
      id: dataRow.value.id,
    }
    return updateResource(formData)
  },
  {
    immediate: false,
  },
)

const visible = ref(false)
const formModel = ref(cloneDeep(defaultFormModel))
const rules = reactive({
  code: [{ required: true, message: '请输入编码' }],
  name: [{ required: true, message: '请输入名称' }],
  type: [{ required: true, message: '请选择类型' }],
  isEnabled: [{ required: true, message: '请选择是否启用' }],
})
const formRef = ref<FormInstanceFunctions>()
const dataRow = ref({} as ResourceItem)
const dialogTitle = computed(() => {
  return dataRow.value.id ? '编辑资源' : '新增资源'
})

const open = (row?: ResourceItem) => {
  if (row) {
    dataRow.value = row
    formModel.value = cloneDeep(row)
  }
  visible.value = true
}

const close = () => {
  visible.value = false
  dataRow.value = {} as ResourceItem
  formRef.value?.reset()
  formModel.value = cloneDeep(defaultFormModel)
}

const onSubmit = async () => {
  try {
    const valid = await formRef.value?.validate()
    if (valid !== true) {
      return
    }
    const isCreate = !dataRow.value.id
    if (isCreate) {
      await createResourceSend()
      MessagePlugin.closeAll()
      MessagePlugin.success('新增成功')
      emit('create')
    } else {
      await updateResourceSend()
      MessagePlugin.closeAll()
      MessagePlugin.success('编辑成功')
      emit('update')
    }
    close()
  } catch (error) {
    console.log('onSubmit error: ', error)
  }
}

defineExpose({
  open,
})
</script>

<style scoped></style>

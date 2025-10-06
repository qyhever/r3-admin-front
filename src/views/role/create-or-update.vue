<template>
  <div class="p-[20px]">
    <div class="p-[20px] bg-white rounded-[4px] space-y-4">
      <ComBack />
      <div class="text-xl">{{ pageTitle }}</div>
      <t-form ref="formRef" :data="formModel" :rules="rules" label-width="100px" @submit="onSubmit">
        <t-form-item label="编码" name="code">
          <t-input v-model="formModel.code" placeholder="请输入编码" clearable />
        </t-form-item>
        <t-form-item label="名称" name="name">
          <t-input v-model="formModel.name" placeholder="请输入名称" clearable />
        </t-form-item>
        <t-form-item label="是否启用" name="isEnabled">
          <t-radio-group v-model="formModel.isEnabled">
            <t-radio :value="true">是</t-radio>
            <t-radio :value="false">否</t-radio>
          </t-radio-group>
        </t-form-item>
        <t-form-item label="权限" name="isEnabled">
          <div class="w-full">
            <t-tree
              ref="treeRef"
              v-model="formModel.resourceCodes"
              :data="resourceTreeData"
              checkable
              hover
              expand-all
              @change="onTreeChange"
              @click="onTreeClick"
            >
              <template #label="{ node }">
                <span>{{ node.label }}({{ node.value }})</span>
              </template>
            </t-tree>
          </div>
        </t-form-item>
        <t-form-item label="描述" name="description">
          <t-textarea
            v-model="formModel.description"
            placeholder="请输入描述"
            :autosize="{ minRows: 3, maxRows: 5 }"
          />
        </t-form-item>
        <t-form-item>
          <t-space size="small">
            <t-button theme="primary" type="submit" :loading="creating || updating">提交</t-button>
            <t-button theme="default" variant="base" @click="onReset">重置</t-button>
          </t-space>
        </t-form-item>
      </t-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onBeforeMount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { cloneDeep } from 'lodash-es'
import type { FormProps, FormInstanceFunctions, TreeProps } from 'tdesign-vue-next'
import { MessagePlugin } from 'tdesign-vue-next'
import { useRequest } from 'alova/client'
import type { CreateRoleDto } from './type'
import { createRole, updateRole, getRole } from './service'
import { getAllResources } from '@/views/resource/service'
import { makeTree } from '@/utils'

defineOptions({
  name: 'CuRole',
})

interface IProps {
  pageType?: 'create' | 'update'
}

const { pageType = 'create' } = defineProps<IProps>()

const defaultFormModel: CreateRoleDto = {
  code: '',
  name: '',
  isEnabled: true,
  resourceCodes: [],
  description: '',
}

function formatFormData(params: CreateRoleDto) {
  const { resourceCodes } = formModel.value
  const codes = cloneDeep(resourceCodes)
  // 把父节点也加入到 codes 中
  for (let i = 0; i < codes.length; i++) {
    const code = codes[i]
    const resourceItem = allResources.value.find((o) => o.code === code)
    if (resourceItem) {
      const parentItem = allResources.value.find((o) => o.code === resourceItem.parentCode)
      if (parentItem && !codes.includes(parentItem.code)) {
        codes.splice(i, 0, parentItem.code)
      }
    }
  }
  return {
    ...params,
    resourceCodes: codes,
  }
}

const { data: allResources, send: queryAllResources } = useRequest(getAllResources, {
  initialData: [],
  immediate: false,
  async middleware(_, next) {
    const result = await next()
    const ret = result.map((item) => {
      return {
        ...item,
        label: item.name,
        value: item.code,
      }
    })
    return ret
  },
})

const { send: runCreateRole, loading: creating } = useRequest(
  () => {
    const formData = formatFormData(formModel.value)
    return createRole(formData)
  },
  {
    immediate: false,
  },
)

const { send: runUpdateRole, loading: updating } = useRequest(
  () => {
    const formData = formatFormData(formModel.value)
    return updateRole({
      ...formData,
      id: id.value,
    })
  },
  {
    immediate: false,
  },
)

const { send: queryRole } = useRequest(
  () => {
    return getRole(id.value)
  },
  {
    immediate: false,
  },
).onSuccess(({ data }) => {
  formModel.value.code = data.code
  formModel.value.name = data.name
  formModel.value.isEnabled = data.isEnabled
  formModel.value.description = data.description
  // tree 组件回显不需要父节点 code，这里去掉
  const codes = data.resources.map((o) => o.code)
  codes.forEach((code, index) => {
    if (allResources.value.find((o) => o.parentCode === code)) {
      codes.splice(index, 1)
    }
  })
  formModel.value.resourceCodes = codes
})

const route = useRoute()
const router = useRouter()
const formModel = ref(cloneDeep(defaultFormModel))
const rules = ref({
  code: [{ required: true, message: '请输入编码' }],
  name: [{ required: true, message: '请输入名称' }],
  type: [{ required: true, message: '请选择类型' }],
  isEnabled: [{ required: true, message: '请选择是否启用' }],
})
const formRef = ref<FormInstanceFunctions>()

const resourceTreeData = computed(() => {
  return makeTree(allResources.value, 'code', 'parentCode')
})

const isCreate = computed(() => pageType === 'create')

const id = computed(() => {
  return Number(route.query.id)
})

const pageTitle = computed(() => {
  return isCreate.value ? '新增角色' : '编辑角色'
})

const onReset = () => {
  formModel.value = cloneDeep(defaultFormModel)
  formRef.value?.clearValidate()
}

const onTreeChange: TreeProps['onChange'] = (checked, context) => {
  console.log('onChange checked:', checked, 'context:', context)
  const { node } = context
  console.log(node.value, 'onChange context.node.checked:', node.checked)
}

const onTreeClick: TreeProps['onClick'] = (context) => {
  console.log('onClick context:', context)
  const { node } = context
  console.log(node.value, 'onClick context.node.checked:', node.checked)
}

const onSubmit: FormProps['onSubmit'] = async ({ validateResult, firstError }) => {
  if (validateResult !== true) {
    console.log('Validate Errors: ', firstError, validateResult)
    return
  }
  const req = isCreate.value ? runCreateRole : runUpdateRole
  await req()
  MessagePlugin.closeAll()
  MessagePlugin.success(isCreate.value ? '新增成功' : '编辑成功')
  router.back()
}

onBeforeMount(async () => {
  await queryAllResources()
  console.log('isCreate.value: ', isCreate.value)
  if (!isCreate.value) {
    queryRole()
  }
})
</script>

<style scoped></style>

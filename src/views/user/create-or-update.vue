<template>
  <div class="p-[20px]">
    <div class="p-[20px] bg-white rounded-[4px] space-y-4">
      <ComBack />
      <div class="text-xl">{{ pageTitle }}</div>
      <t-form ref="formRef" :data="formModel" :rules="rules" label-width="100px" @submit="onSubmit">
        <t-form-item label="名称" name="username">
          <t-input v-model="formModel.username" placeholder="请输入名称" clearable />
        </t-form-item>
        <t-form-item label="手机号" name="mobile">
          <t-input v-model="formModel.mobile" placeholder="请输入手机号" clearable />
        </t-form-item>
        <t-form-item
          label="密码"
          name="password"
          :rules="[
            {
              required: pageType === 'create',
              message: '请输入密码',
            },
          ]"
        >
          <t-input
            v-model="formModel.password"
            placeholder="请输入密码"
            clearable
            type="password"
          />
        </t-form-item>
        <t-form-item label="是否启用" name="isEnabled">
          <t-radio-group v-model="formModel.isEnabled">
            <t-radio :value="true">是</t-radio>
            <t-radio :value="false">否</t-radio>
          </t-radio-group>
        </t-form-item>
        <t-form-item label="角色" name="isEnabled">
          <t-select v-model="formModel.roleCodes" multiple clearable placeholder="请选择">
            <t-option
              v-for="(item, index) in allRoles"
              :key="index"
              :label="item.name"
              :value="item.code"
            />
          </t-select>
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
import type { FormProps, FormInstanceFunctions } from 'tdesign-vue-next'
import { MessagePlugin } from 'tdesign-vue-next'
import { useRequest } from 'alova/client'
import type { CreateUserDto } from './type'
import { createUser, updateUser, getUser } from './service'
import { getAllRoles } from '@/views/role/service'

defineOptions({
  name: 'CuUser',
})

interface IProps {
  pageType?: 'create' | 'update'
}

const { pageType = 'create' } = defineProps<IProps>()

const defaultFormModel: CreateUserDto = {
  avatar: '',
  username: '',
  mobile: '',
  password: '',
  isEnabled: true,
  roleCodes: [],
}

const { data: allRoles, send: queryAllResources } = useRequest(getAllRoles, {
  immediate: false,
})

const { send: runCreateUser, loading: creating } = useRequest(
  () => {
    return createUser(formModel.value)
  },
  {
    immediate: false,
  },
)

const { send: runUpdateUser, loading: updating } = useRequest(
  () => {
    return updateUser({
      ...formModel.value,
      id: id.value,
    })
  },
  {
    immediate: false,
  },
)

const { send: queryUser } = useRequest(
  () => {
    return getUser(id.value)
  },
  {
    immediate: false,
  },
).onSuccess(({ data }) => {
  formModel.value.avatar = data.avatar
  formModel.value.username = data.username
  formModel.value.mobile = data.mobile
  formModel.value.isEnabled = data.isEnabled
  formModel.value.roleCodes = data.roles.map((o) => o.code)
})

const route = useRoute()
const router = useRouter()
const formModel = ref(cloneDeep(defaultFormModel))
const rules = ref({
  avatar: [{ required: false, message: '请输入名称' }],
  username: [{ required: true, message: '请输入名称' }],
  mobile: [{ required: true, message: '请输入手机号' }],
  isEnabled: [{ required: true, message: '请选择是否启用' }],
  roleCodes: [{ required: true, message: '请选择用户' }],
})
const formRef = ref<FormInstanceFunctions>()

const isCreate = computed(() => pageType === 'create')

const id = computed(() => {
  return Number(route.query.id)
})

const pageTitle = computed(() => {
  return isCreate.value ? '新增用户' : '编辑用户'
})

const onReset = () => {
  formModel.value = cloneDeep(defaultFormModel)
  formRef.value?.clearValidate()
}

const onSubmit: FormProps['onSubmit'] = async ({ validateResult, firstError }) => {
  if (validateResult !== true) {
    console.log('Validate Errors: ', firstError, validateResult)
    return
  }
  const req = isCreate.value ? runCreateUser : runUpdateUser
  await req()
  MessagePlugin.closeAll()
  MessagePlugin.success(isCreate.value ? '新增成功' : '编辑成功')
  router.back()
}

onBeforeMount(async () => {
  await queryAllResources()
  if (!isCreate.value) {
    queryUser()
  }
})
</script>

<style scoped></style>

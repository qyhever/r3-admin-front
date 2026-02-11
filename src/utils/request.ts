import { createAlova } from 'alova'
import adapterFetch from 'alova/fetch'
import VueHook from 'alova/vue'
import { MessagePlugin } from 'tdesign-vue-next'
import router from '@/router'
import { isDev } from '@/utils'
import { useUserStore } from '@/stores/user'

// 扩展 Error 接口以包含 response 属性
interface RequestError extends Error {
  response?: Response
}

const baseURL = '/r3/api'

// Token 刷新状态管理
let refreshPromise: Promise<string> | null = null

/**
 * 获取或创建刷新 token 的 Promise
 * 确保多个并发请求只触发一次 token 刷新
 */
function getRefreshTokenPromise(): Promise<string> {
  if (!refreshPromise) {
    const userStore = useUserStore()
    refreshPromise = userStore.refreshAccessToken().finally(() => {
      refreshPromise = null
    })
  }
  return refreshPromise
}

// https://github.com/alovajs/alova
const alovaInstance = createAlova({
  baseURL,
  requestAdapter: adapterFetch(),
  statesHook: VueHook,
  cacheFor: {
    expire: 0, // Disable cache
  },
  beforeRequest(method) {
    const userStore = useUserStore()
    if (userStore.accessToken) {
      method.config.headers.Authorization = `Bearer ${userStore.accessToken}`
    }

    const originalParams =
      typeof method.config.params === 'object' && method.config.params !== null
        ? method.config.params
        : {}
    method.config.params = {
      ...paramsSerializer(originalParams),
      t: new Date().getTime(), // Add a timestamp to prevent caching
    }
  },
  responded: {
    async onSuccess(response, methodInstance) {
      // console.log('Response:', response, methodInstance)
      const res = await response.clone().json()
      if ((response.status >= 200 && response.status < 300) || response.status === 304) {
        if (!res.success) {
          MessagePlugin.closeAll()
          MessagePlugin.warning(res.msg || '操作失败')
          const error = new Error('Request is not successful code') as RequestError
          error.response = res
          return Promise.reject(error)
        }
        return res.data
      }

      // 401 错误：尝试刷新 token 并重试
      if (response.status === 401) {
        const userStore = useUserStore()
        // 判断是否是刷新 token 接口本身失败
        if (methodInstance.url.includes('/auth/refreshToken')) {
          MessagePlugin.closeAll()
          MessagePlugin.error('登录状态已失效，请重新登录')
          userStore.logout()
          router.replace('/login')
          return Promise.reject(new Error('Refresh token failed'))
        }

        try {
          // 等待 token 刷新完成（如果正在刷新，会复用同一个 Promise）
          await getRefreshTokenPromise()

          // Token 刷新成功，重试原请求
          console.log('Token refreshed, retrying request:', methodInstance.url)
          return methodInstance.send()
        } catch (refreshError) {
          // Token 刷新失败，跳转登录
          console.error('Token refresh failed:', refreshError)
          MessagePlugin.closeAll()
          MessagePlugin.error('登录状态已失效，请重新登录')
          userStore.logout()
          router.replace('/login')
          return Promise.reject(refreshError)
        }
      }

      const msg = isDev()
        ? `请求失败: ${methodInstance.url} - ${response.status} - ${res.message || response.statusText}`
        : `请求失败: ${response.statusText || '未知错误'}`
      MessagePlugin.error(msg)
      return Promise.reject(new Error(`Request failed with status ${response.status}`))
    },
    onError(error) {
      MessagePlugin.closeAll()
      MessagePlugin.error(error.message + ' 请检查网络是否正常!')
      return Promise.reject(error)
    },
  },
})

// This function serializes the parameters for the request, removing any null or undefined values
function paramsSerializer(params: Record<string, unknown>) {
  const ret: Record<string, unknown> = {}
  Object.keys(params).forEach((k) => {
    const value = params[k]
    // value !== '' &&
    if (value !== null && value !== undefined) {
      ret[k] = value
    }
  })
  return ret
}

export default alovaInstance

import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { loginByMobileApi, getUserInfo } from '@/api/global'
import type { UserInfo } from '@/types/user'
import router from '@/router'

const LOCAL_TOKEN_KEY = 'r3-token'
// const LOCAL_USER_INFO_KEY = 'r3-user-info'

export const useUserStore = defineStore('user', () => {
  const token = ref<string | null>(localStorage.getItem(LOCAL_TOKEN_KEY))
  // const userInfo = ref<UserInfo | null>(
  //   localStorage.getItem(LOCAL_USER_INFO_KEY)
  //     ? JSON.parse(localStorage.getItem(LOCAL_USER_INFO_KEY)!)
  //     : null,
  // )
  const userInfo = ref<UserInfo | null>(null)

  // 计算属性：是否已登录
  const isLoggedIn = computed(() => !!token.value)

  const loginByMobile = async (mobile: string, password: string) => {
    const val = await loginByMobileApi({ mobile, password })
    token.value = val
    localStorage.setItem(LOCAL_TOKEN_KEY, val)
  }

  const fetchUserInfo = async () => {
    if (userInfo.value) {
      return
    }
    try {
      const user = await getUserInfo()
      userInfo.value = user
      // localStorage.setItem(LOCAL_USER_INFO_KEY, JSON.stringify(user))
    } catch (error) {
      console.log('error: ', error)
      if ((error as unknown as { response: { msg: string } }).response.msg.includes('not found')) {
        logout()
        router.replace('/login')
        return
      }
      throw error
    }
  }

  // 清除登录信息
  const clearUser = () => {
    token.value = null
    userInfo.value = null
    localStorage.removeItem(LOCAL_TOKEN_KEY)
    // localStorage.removeItem(LOCAL_USER_INFO_KEY)
  }

  // 登出
  const logout = () => {
    clearUser()
  }

  return {
    token,
    userInfo,
    isLoggedIn,
    clearUser,
    logout,
    loginByMobile,
    fetchUserInfo,
  }
})

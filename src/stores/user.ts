import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { loginByMobileApi, getUserInfo, refreshTokenApi } from '@/api/global'
import type { UserInfo } from '@/types/user'
import router from '@/router'

const LOCAL_ACCESS_TOKEN_KEY = 'r3-access-token'
const LOCAL_REFRESH_TOKEN_KEY = 'r3-refresh-token'
// const LOCAL_USER_INFO_KEY = 'r3-user-info'

export const useUserStore = defineStore('user', () => {
  const accessToken = ref<string | null>(localStorage.getItem(LOCAL_ACCESS_TOKEN_KEY))
  const refreshToken = ref<string | null>(localStorage.getItem(LOCAL_REFRESH_TOKEN_KEY))
  // const userInfo = ref<UserInfo | null>(
  //   localStorage.getItem(LOCAL_USER_INFO_KEY)
  //     ? JSON.parse(localStorage.getItem(LOCAL_USER_INFO_KEY)!)
  //     : null,
  // )
  const userInfo = ref<UserInfo | null>(null)

  // 计算属性：是否已登录
  const isLoggedIn = computed(() => !!accessToken.value)

  const loginByMobile = async (mobile: string, password: string) => {
    const res = await loginByMobileApi({ mobile, password })
    accessToken.value = res.accessToken
    refreshToken.value = res.refreshToken
    localStorage.setItem(LOCAL_ACCESS_TOKEN_KEY, res.accessToken)
    localStorage.setItem(LOCAL_REFRESH_TOKEN_KEY, res.refreshToken)
  }

  const refreshAccessToken = async () => {
    try {
      const rToken = refreshToken.value
      if (!rToken) {
        throw new Error('No refresh token available')
      }

      const res = await refreshTokenApi({
        refreshToken: rToken,
      })

      accessToken.value = res.accessToken
      refreshToken.value = res.refreshToken
      localStorage.setItem(LOCAL_ACCESS_TOKEN_KEY, res.accessToken)
      localStorage.setItem(LOCAL_REFRESH_TOKEN_KEY, res.refreshToken)
      return accessToken.value
    } catch (error) {
      console.error('Refresh token failed:', error)
      // 刷新失败
      logout()
      throw error
    }
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
    accessToken.value = null
    refreshToken.value = null
    userInfo.value = null
    localStorage.removeItem(LOCAL_ACCESS_TOKEN_KEY)
    localStorage.removeItem(LOCAL_REFRESH_TOKEN_KEY)
    // localStorage.removeItem(LOCAL_USER_INFO_KEY)
  }

  // 登出
  const logout = () => {
    clearUser()
  }

  return {
    accessToken,
    refreshToken,
    userInfo,
    isLoggedIn,
    clearUser,
    logout,
    loginByMobile,
    fetchUserInfo,
    refreshAccessToken,
  }
})

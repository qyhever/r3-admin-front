import alova from '@/utils/request'
import type { UserInfo } from '@/types/user'

export const loginByMobileApi = (data: { mobile: string; password: string }): Promise<string> => {
  return alova.Post('/auth/login', data)
}

export const getUserInfo = (): Promise<UserInfo> => alova.Get('/user/info')

export const getUsers = () => alova.Get('/user')

import alova from '@/utils/request'
import type { UserInfo } from '@/types/user'

interface ISignInRes {
  accessToken: string
  refreshToken: string
}

interface IRefreshTokenReq {
  refreshToken: string
}

export const loginByMobileApi = (data: {
  mobile: string
  password: string
}): Promise<ISignInRes> => {
  return alova.Post('/auth/login', data)
}

export const getUserInfo = (): Promise<UserInfo> => alova.Get('/user/info')

export const getUsers = () => alova.Get('/user')

export const refreshTokenApi = (data: IRefreshTokenReq) =>
  alova.Post<ISignInRes>('/auth/refreshToken', data)

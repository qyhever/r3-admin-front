import alova from '@/utils/request'
import type { CreateUserDto, UpdateUserDto, PaginationUsersVo, UserItem } from './type'

export const getUsers = (data: Record<string, string | number | string[]>) =>
  alova.Post<PaginationUsersVo>('/user/pagedList', data)

export const createUser = (data: CreateUserDto) => alova.Post('/user', data)
export const updateUser = (data: UpdateUserDto) => alova.Put('/user', data)
export const getUser = (id: number) => alova.Get<UserItem>(`/user/${id}`)
export const deleteUser = (id: number) => alova.Delete(`/user/${id}`)
export const batchDeleteUsers = (ids: number[]) => alova.Post('/user/batchDelete', ids)

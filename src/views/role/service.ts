import alova from '@/utils/request'
import type { CreateRoleDto, UpdateRoleDto, PaginationRolesVo, RoleItem } from './type'

export const getRoles = (data: Record<string, string | number | string[]>) =>
  alova.Post<PaginationRolesVo>('/role/pagedList', data)

export const createRole = (data: CreateRoleDto) => alova.Post('/role', data)
export const updateRole = (data: UpdateRoleDto) => alova.Put('/role', data)
export const getRole = (id: number) => alova.Get<RoleItem>(`/role/${id}`)
export const deleteRole = (id: number) => alova.Delete(`/role/${id}`)
export const batchDeleteRoles = (ids: number[]) => alova.Post('/role/batchDelete', ids)
export const getAllRoles = () => alova.Get<RoleItem[]>('/role/findAll')

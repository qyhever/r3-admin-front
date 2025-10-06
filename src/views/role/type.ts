import type { ResourceItem } from '@/views/resource/type'
export interface RoleItem {
  id: number
  code: string
  name: string
  description: string
  isEnabled: boolean
  createdAt: string
  updatedAt: string
  resources: ResourceItem[]
  [key: string]: unknown
}

export interface CreateRoleDto {
  code: string
  name: string
  isEnabled: boolean
  resourceCodes: string[]
  description: string
}

export interface UpdateRoleDto extends Partial<CreateRoleDto> {
  id: number
}

export interface PaginationRolesVo {
  list: RoleItem[]
  total: number
}

export interface IQueryModel {
  code: string
  name: string
  sortField: string
  sortValue: 'asc' | 'desc' | ''
  rangeDate: string[]
}

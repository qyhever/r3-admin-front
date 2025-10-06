import { enumResourceType } from '@/utils/enum'
// import type { TableRowData } from 'tdesign-vue-next'

type ResourceType = keyof typeof enumResourceType.obj

export interface ResourceItem {
  id: number
  code: string
  name: string
  type: ResourceType
  parentCode: string
  isEnabled: boolean
  createdAt: string
  updatedAt: string
  [key: string]: unknown
  children?: ResourceItem[]
}

export interface CreateResourceDto {
  code: string
  name: string
  type: ResourceType
  parentCode: string
  isEnabled: boolean
}

export interface UpdateResourceDto extends Partial<CreateResourceDto> {
  id: number
}

export interface PaginationResourcesVo {
  list: ResourceItem[]
  total: number
}

export interface IQueryModel {
  code: string
  name: string
  type: string
  parentCode: string
  rangeDate: string[]
  sortField: string
  sortValue: 'asc' | 'desc' | ''
}

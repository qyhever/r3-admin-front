import alova from '@/utils/request'
import type {
  CreateResourceDto,
  UpdateResourceDto,
  PaginationResourcesVo,
  ResourceItem,
} from './type'

export const getResources = (data: Record<string, string | number | string[]>) =>
  alova.Post<PaginationResourcesVo>('/resource/pagedList', data)

export const createResource = (data: CreateResourceDto) => alova.Post('/resource', data)
export const updateResource = (data: UpdateResourceDto) => alova.Put('/resource', data)
export const deleteResource = (id: number) => alova.Delete(`/resource/${id}`)
export const batchDeleteResources = (ids: number[]) => alova.Post('/resource/batchDelete', ids)
export const getAllResources = () => alova.Get<ResourceItem[]>('/resource/findAll')

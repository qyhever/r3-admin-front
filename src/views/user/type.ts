interface DictItem {
  id: number
  code: string
  name: string
}

export interface UserItem {
  id: number
  avatar: string
  mobile: string
  username: string
  isEnabled: boolean
  createdAt: string
  updatedAt: string
  resources: DictItem[]
  roles: DictItem[]
  [key: string]: unknown
}

export interface CreateUserDto {
  avatar: string
  username: string
  mobile: string
  isEnabled: boolean
  password: string
  roleCodes: string[]
}

export interface UpdateUserDto extends Partial<CreateUserDto> {
  id: number
  isEnabled?: boolean
}

export interface PaginationUsersVo {
  list: UserItem[]
  total: number
}

export interface IQueryModel {
  username: string
  mobile: string
  sortField: string
  sortValue: 'asc' | 'desc' | ''
  rangeDate: string[]
}

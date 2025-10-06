export interface UserInfo {
  id: number
  username: string
  mobile: string
  resources: {
    code: string
    name: string
  }[]
}

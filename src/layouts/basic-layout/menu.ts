export interface IMenuItem {
  title: string
  path: string
  icon?: string
  authKey?: string
  children?: IMenuItem[]
}

export const menuList: IMenuItem[] = [
  {
    title: '首页',
    path: '/home',
    icon: 'smile',
    authKey: 'home',
  },
  {
    title: '权限管理',
    path: '/resource',
    icon: 'smile',
    authKey: 'resource',
  },
  {
    title: '角色管理',
    path: '/role',
    icon: 'smile',
    authKey: 'role',
  },
  {
    title: '用户管理',
    path: '/user',
    icon: 'smile',
    authKey: 'user',
  },
  {
    title: '组件',
    path: '/block',
    icon: 'smile',
    authKey: 'component',
    children: [
      {
        title: '复制',
        path: '/block/clipboard',
        icon: 'smile',
        authKey: 'clipboard',
      },
      {
        title: '二维码',
        path: '/block/qrcode',
        icon: 'smile',
        authKey: 'qrcode',
      },
    ],
  },
  {
    title: '图表',
    path: '/chart',
    icon: 'smile',
    authKey: 'chart',
    children: [
      {
        title: '结婚率',
        path: '/chart/married',
        icon: 'smile',
        authKey: 'married',
      },
      {
        title: '出生率',
        path: '/chart/birth',
        icon: 'smile',
        authKey: 'birth',
      },
      {
        title: '高考',
        path: '/chart/college-entry-exam',
        icon: 'smile',
        authKey: 'college_entrance_examination',
      },
      {
        title: '大学毕业生',
        path: '/chart/university-graduate',
        icon: 'smile',
        authKey: 'university_graduate',
      },
      {
        title: '研究生报考',
        path: '/chart/postgraduate',
        icon: 'smile',
        authKey: 'postgraduate',
      },
    ],
  },
]

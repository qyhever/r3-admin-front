import { createRouter, createWebHistory } from 'vue-router'
import BasicLayout from '@/layouts/basic-layout/index.vue'
import { useUserStore } from '@/stores/user'

declare module 'vue-router' {
  interface RouteMeta {
    authKey?: string
    activeMenu?: string
  }
}

const basicRoutes = [
  {
    path: '/home',
    component: () => import('@/views/home.vue'),
    // meta: { authKey: 'home' },
  },
  {
    path: '/resource',
    component: () => import('@/views/resource/index.vue'),
    meta: { authKey: 'resource' },
  },
  {
    path: '/role',
    component: () => import('@/views/role/index.vue'),
    meta: { authKey: 'role' },
  },
  {
    path: '/role/create',
    component: () => import('@/views/role/create-or-update.vue'),
    meta: {
      authKey: 'role',
      activeMenu: '/role',
    },
  },
  {
    path: '/role/update',
    component: () => import('@/views/role/create-or-update.vue'),
    meta: {
      authKey: 'role',
      activeMenu: '/role',
    },
  },
  {
    path: '/role/view',
    component: () => import('@/views/role/view.vue'),
    meta: {
      authKey: 'role',
      activeMenu: '/role',
    },
  },
  {
    path: '/user',
    component: () => import('@/views/user/index.vue'),
    meta: {
      authKey: 'user',
    },
  },
  {
    path: '/user/create',
    component: () => import('@/views/user/create-or-update.vue'),
    meta: {
      authKey: 'user',
      activeMenu: '/user',
    },
  },
  {
    path: '/user/update',
    component: () => import('@/views/user/create-or-update.vue'),
    meta: {
      authKey: 'user',
      activeMenu: '/user',
    },
  },
  {
    path: '/user/view',
    component: () => import('@/views/user/view.vue'),
    meta: {
      authKey: 'user',
      activeMenu: '/user',
    },
  },
  {
    path: '/block/clipboard',
    component: () => import('@/views/block/clipboard.vue'),
    meta: { authKey: 'clipboard' },
  },
  {
    path: '/block/qrcode',
    component: () => import('@/views/block/qrcode.vue'),
    meta: { authKey: 'qrcode' },
  },
  {
    path: '/chart/married',
    component: () => import('@/views/chart/married.vue'),
    meta: { authKey: 'married' },
  },
  {
    path: '/chart/birth',
    component: () => import('@/views/chart/birth.vue'),
    meta: { authKey: 'birth' },
  },
  {
    path: '/chart/college-entry-exam',
    component: () => import('@/views/chart/college-entry-exam.vue'),
    meta: { authKey: 'college_entrance_examination' },
  },
  {
    path: '/chart/university-graduate',
    component: () => import('@/views/chart/university-graduate.vue'),
    meta: { authKey: 'university_graduate' },
  },
  {
    path: '/chart/postgraduate',
    component: () => import('@/views/chart/postgraduate.vue'),
    meta: { authKey: 'postgraduate' },
  },
  {
    path: '/about',
    component: () => import('@/views/about.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/login-view.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/',
      redirect: '/home',
    },
    {
      path: '/',
      component: BasicLayout,
      children: basicRoutes,
    },
    {
      path: '/forbidden',
      component: () => import('@/views/result/forbidden.vue'),
    },
    {
      path: '/notfound',
      component: () => import('@/views/result/notfound.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      component: () => import('@/views/result/notfound.vue'),
    },
  ],
})

function hasPagePermission(authKey?: string) {
  const userStore = useUserStore()
  console.log('userStore: ', userStore)
  if (!authKey) {
    return true
  }
  return userStore.userInfo!.resources.some((item) => item.code === authKey)
}

// 路由守卫
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  if (userStore.token) {
    await userStore.fetchUserInfo()
    if (to.path === '/login') {
      // 已登录用户访问登录页，跳转到首页
      next('/home')
    } else {
      if (hasPagePermission(to.meta.authKey)) {
        next()
      } else {
        next('/forbidden')
      }
    }
  } else {
    if (to.path === '/login') {
      next()
    } else {
      // 需要认证但未登录，跳转到登录页
      next('/login')
    }
  }
})

export const getActive = (maxLevel = 3): string => {
  // 非组件内调用必须通过Router实例获取当前路由
  const route = router.currentRoute.value

  if (!route.path) {
    return ''
  }
  if (route.meta?.activeMenu) {
    return route.meta.activeMenu
  }
  const ret = route.path
    .split('/')
    .filter((_item: string, index: number) => index <= maxLevel && index > 0)
    .map((item: string) => `/${item}`)
    .join('')

  return ret
}

export default router

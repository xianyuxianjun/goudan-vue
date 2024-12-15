import { useUserStore } from '@/stores/user'
import Cookies from 'js-cookie'
import { setupLayouts } from 'virtual:generated-layouts'
import { createRouter, createWebHistory } from 'vue-router/auto'

function recursiveLayouts(route) {
  if (route.children) {
    for (let i = 0; i < route.children.length; i++)
      route.children[i] = recursiveLayouts(route.children[i])

    return route
  }

  return setupLayouts([route])[0]
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to) {
    if (to.hash)
      return { el: to.hash, behavior: 'smooth', top: 60 }

    return { top: 0 }
  },
  extendRoutes: pages => [
    ...[...pages].map(route => recursiveLayouts(route)),
  ],
})

// 不需要登录就可以访问的白名单路由
const whiteList = ['/login', '/register']

router.beforeEach(async (to, from, next) => {
  // 获取token
  const token = Cookies.get('token')
  const userStore = useUserStore()

  // 有token说明已登录
  if (token) {
    if (to.path === '/login') {
      // 如果已登录，访问登录页则重定向到首页
      next({ path: '/' })
    } else {
      // 判断是否有用户角色信息
      if (userStore.role) {
        // 有角色信息则放行
        next()
      } else {
        try {
          // 没有角色信息则尝试从cookie获取用户信息
          const userInfo = Cookies.get('userInfo')
          if (userInfo) {
            const parsedUserInfo = JSON.parse(userInfo)

            // 确保包含必要的角色信息
            if (!parsedUserInfo.role) {
              throw new Error('用户信息不完整')
            }
            userStore.setUserInfo(parsedUserInfo)
            next()
          } else {
            // 没有用户信息，清除token并跳转登录页
            Cookies.remove('token')
            next(`/login?redirect=${to.path}`)
          }
        } catch (error) {
          console.error('恢复用户信息失败:', error)

          // 获取用户信息失败，清除token并跳转登录页
          Cookies.remove('token')
          next(`/login?redirect=${to.path}`)
        }
      }
    }
  } else {
    // 没有token
    if (whiteList.includes(to.path)) {
      // 在免登录白名单中，直接进入
      next()
    } else {
      // 其他没有访问权限的页面将重定向到登录页面
      next(`/login?redirect=${to.path}`)
    }
  }
})

// 路由错误处理
router.onError(error => {
  console.error('路由错误:', error)
})

export { router }
export default function (app) {
  app.use(router)
}

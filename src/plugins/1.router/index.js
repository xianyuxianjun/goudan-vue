import { setupLayouts } from 'virtual:generated-layouts'
import { createRouter, createWebHistory } from 'vue-router/auto'
import Cookies from "js-cookie";

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
function isAuthenticated() {
    // 从 localStorage 中获取 token
    const token = Cookies.get("token")

    // 如果 token 存在且不为空，则认为用户已认证
    return !!token;
}
// 添加全局前置守卫
// router.beforeEach((to, from, next) => {
//     // 如果目标路由是 /login 或 /register，则直接放行
//     if (to.path === '/login' || to.path === '/register') {
//         next();
//     } else {
//         // 检查用户是否已通过认证
//         if (isAuthenticated()) {
//             // 用户已认证，允许访问
//             next();
//         } else {
//             // 用户未认证，重定向到 /login
//             next({ path: '/login' });
//         }
//     }
// })

export { router }
export default function (app) {
  app.use(router)
}

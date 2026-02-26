import router from './router'
import { ElMessage } from 'element-plus'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken } from '@/utils/auth'
import { isHttp, isPathMatch } from '@/utils/validate'
import { isRelogin } from '@/utils/request'
import useUserStore from '@/store/modules/user'
import useSettingsStore from '@/store/modules/settings'
import usePermissionStore from '@/store/modules/permission'
//全局进度条的配置
NProgress.configure({
  easing: 'ease-out', // 动画方式
  speed: 300, // 递增进度条的速度
  showSpinner: false, // 是否显示加载ico
  trickleSpeed: 200, // 自动递增间隔
  minimum: 0.3, // 更改启动时使用的最小百分比
  parent: 'body', //指定进度条的父容器 body顶部
})

const whiteList = ['/login', '/register']

const isWhiteList = (path) => {
  return whiteList.some(pattern => isPathMatch(pattern, path))
}

router.beforeEach(async (to, from) => {
  NProgress.start()
  // 1. 已登录
  if (getToken()) {
    to.meta.title && useSettingsStore().setTitle(to.meta.title)

    // 访问白名单页面，强制重定向到首页
    if (to.path === '/login' || isWhiteList(to.path)) {
      return { path: '/' }
    }

    // 正常访问业务页面，判断是否已有角色信息
    if (useUserStore().roles.length === 0) {
      try {
        // 拉取用户信息
        await useUserStore().getInfo()
        // 生成并挂载动态路由
        const accessRoutes = await usePermissionStore().generateRoutes()
        accessRoutes.forEach(route => {
          if (!isHttp(route.path)) {
            router.addRoute(route)
          }
        })
        // hack: 确保动态路由已生效
        return { ...to, replace: true }
      } catch (err) {
        await useUserStore().logOut()
        ElMessage.error(err.message || '请重新登录')
        return { path: '/' }
      }
    }
    return true
  }

  // 2. 未登录访问白名单
  if (isWhiteList(to.path)) {
    return true
  }
  // 3. 未登录非法访问，重定向到登录页并记录访问的页面
  return {
    path: '/login',
    query: { redirect: to.fullPath }
  }
})

router.afterEach(() => {
  NProgress.done()
})

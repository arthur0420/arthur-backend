import Vue from 'vue'
import Router from 'vue-router'
const prodEnv = require('../../config/prod.env')

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'Dashboard',
    meta: {
      title: '仪表盘',
      icon: 'tree'
    },
    children: [{
      path: 'dashboard',
      meta: {
        title: '仪表盘',
        icon: 'tree'
      },
      component: () => import('@/views/dashboard/index')
    }]
  },
  {
    path: '/data',
    component: Layout,
    name: 'data',
    meta: {
      title: '牧场管理',
      icon: 'list'
    },
    children: [
      {
        path: '/data/unions',
        name: 'dataUnion',
        meta: {
          title: '牧场列表',
          icon: 'list'
        },
        component: () => import('@/views/data/union'),
      },
      {
        path: '/data/animal',
        name: 'dataAnimal',
        meta: {
          title: '动物列表',
          icon: 'list'
        },
        hidden: true,
        component: () => import('@/views/data/animal')
      },
      {
        path: '/data/event',
        name: 'dataEvent',
        meta: {
          title: '事件列表',
          icon: 'list'
        },
        hidden: true,
        component: () => import('@/views/data/event')
      },
      {
        path: '/data/const',
        name: 'dataConst',
        meta: {
          title: '常量列表',
          icon: 'list'
        },
        component: () => import('@/views/data/const')
      },
      {
        path: '/data/fast',
        name: 'dataFast',
        meta: {
          title: '快速输入',
          icon: 'list'
        },
        component: () => import('@/views/data/fastInput')
      },

      {
        path: '/data/plan',
        name: 'dataPlan',
        meta: {
          title: '饲喂计划',
          icon: 'list'
        },
        component: () => import('@/views/data/plan')
      },
      {
        path: '/data/plan/val',
        name: 'dataPlanVal',
        meta: {
          title: '饲喂量',
          icon: 'list'
        },
        hidden: true,
        component: () => import('@/views/data/plans/val')
      },

      {
        path: '/data/plan/fix',
        name: 'dataPlanFix',
        meta: {
          title: '调整',
          icon: 'list'
        },
        hidden: true,
        component: () => import('@/views/data/plans/fix')
      },
      {
        path: '/data/plan/distribution',
        name: 'dataPlanDis',
        meta: {
          title: '饲喂分布',
          icon: 'list'
        },
        hidden: true,
        component: () => import('@/views/data/plans/distribution')
      },
      {
        path: '/data/calibration',
        name: 'dataCal',
        meta: {
          title: '校准',
          icon: 'list'
        },
        component: () => import('@/views/data/calibration')
      },{
        path: "http://193.112.178.245:8080/feedData",
        name: 'downloadData',
        meta: {
          title: '数据下载',
          icon: 'list'
        }
        // component: () => import('@/views/data/calibration')
      }
    ]
  }
]


export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  {
    path: '/user',
    component: Layout,
    name: 'user',
    meta: {
      title: '用户管理',
      icon: 'user',
    },
    children: [
      {
      path: '/user',
      meta: {
        title: '账号列表',
        icon: 'user',
        roles: ['admin'] 
      },
      component: () => import('@/views/user/list')
    },
    {
      path: '/user/pwd',
      meta: {
        title: '修改密码',
        icon: 'user'
      },
      component: () => import('@/views/user/pwd')
    }
  ]
  },
]

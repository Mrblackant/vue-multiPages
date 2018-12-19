import {constantRouterMap} from '@/router'
import Layout from '../../views/layout/Layout'
import {getRouter} from '../../api/dict'
// import {getRouter} from '../../api/login'

const _import = require('../../router/_import_' + process.env.NODE_ENV) // _import_development.js的命名'_import_'
/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
// function hasPermission(roles, route) {
//   if (route.meta && route.meta.roles) {
//     return roles.some(role => route.meta.roles.indexOf(role) >= 0)
//   } else {
//     return true
//   }
// }

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap
 * @param roles
 */
function filterAsyncRouter(asyncRouterMap) {
  // console.log(asyncRouterMap)

  if (asyncRouterMap && asyncRouterMap.length !== 0) {
    const accessedRouters = asyncRouterMap.filter(route => {
      if (route.component) {
        if (route.component === 'Layout') {
          route.component = Layout
        } else {
          route.component = _import(route.component)
        }
      }
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children)
      }
      return true
    })

    return accessedRouters
  } else {
    return
  }
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      // console.log('执行setrouter')

      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateRoutes({commit}, data) {
      // console.log('执行action')
      return new Promise(resolve => {
        // const { roles } = data;
        // 这里可以通过角色异步获取asyncRouterMap 通过递归循环生成对应的路由列表
        /* eslint-disable */
        setTimeout(function () {
          // 下面数据相当于异步获取来的数据
          //     路由请求数据
          getRouter().then(res => {
            if (res.status === 1) {

              if (res.data === null) {
                commit('SET_ROUTERS', [])
              } else {
                const accessedRoutersMap = res.data
                const accessedRouters = filterAsyncRouter(accessedRoutersMap)
                commit('SET_ROUTERS', accessedRouters)
              }
              resolve()
            }
          })
        }, 500)
      })
    }
  }
}

export default permission

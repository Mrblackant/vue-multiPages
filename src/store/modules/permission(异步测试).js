import {constantRouterMap} from '@/router'
/*
异步获取asyncRouterMap要用到下面2个  先获取过来再懒加载
*/
const _import = require('../../router/_import_' + process.env.NODE_ENV)
import Layout from '../../views/layout/Layout'
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
// function filterAsyncRouter(asyncRouterMap) {
//   const accessedRouters = asyncRouterMap.map((route, index) => {
//     console.log(route.meta.componentPath)
//     if (route.meta.componentPath) {
//       console.log(Layout)
//       route.component = _import(route.meta.componentPath)
//     }
//     // if (route.children && route.children.length) {
//     //   route.children = filterAsyncRouter(route.children)
//     // }
//   })

//   // const accessedRouters = asyncRouterMap.filter(route => {
//   //   // if (route.meta.routerIndex === 1 && !route.meta.componentPath) {
//   //   //   route.component = Layout
//   //   // } else {
//   //   //   route.component = _import(route.meta.componentPath)
//   //   // }
//   //   if (route.children && route.children.length) {
//   //     route.children = filterAsyncRouter(route.children)
//   //   }
//   //   return true
//   // })

//   return accessedRouters
// }
function fnArr(asyncRouterMap) {
  return asyncRouterMap.length ? asyncRouterMap.map(function (router) {
    var oNew = {
      path: router.path,
      redirect: router.redirect,
      name: router.name,
      meta: router.meta,
      component: _import(router.meta.componentPath),
      children: fnArr(router.children)
    }
    if (oNew.children === undefined) delete oNew.children
    return oNew
  }) : undefined
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateRoutes({commit}, data) {
      return new Promise(resolve => {
        // const { roles } = data;
        // 这里可以通过角色异步获取asyncRouterMap 通过递归循环生成对应的路由列表
        setTimeout(function () {
          const asyncRouterMap = [
            {
              path: '/example',
              redirect: '/example/table',
              name: 'Example',
              meta: {
                title: 'Example',
                icon: 'icon-addition',
                componentPath: 'Layout'
              },
              children: [{
                path: '/example/table', // 注意，以 / 开头的嵌套路径会被当作根路径。 这让你充分的使用嵌套组件而无须设置嵌套的路径。因此有子路由的前面要加/
                name: 'Table',
                redirect: '/example/table/subtable/index',
                meta: {
                  title: 'Table',
                  icon: 'icon-businesscard',
                  componentPath: 'table/index'
                },
                children: [{
                  path: 'subtable',
                  name: 'Subtable',
                  meta: {
                    title: 'Subtable',
                    icon: 'close',
                    componentPath: 'table/subtable/index'
                  }
                }, {
                  path: 'twosubtable',
                  name: 'TwoSubtable',
                  meta: {
                    title: 'TwoSubtable',
                    icon: 'close',
                    componentPath: 'table/twosubtable/index'
                  }
                }, {
                  path: 'threesubtable',
                  name: 'ThreeSubtable',
                  meta: {
                    title: 'ThreeSubtable',
                    icon: 'close',
                    componentPath: 'table/threesubtable/index'
                  }
                }]
              }, {
                path: 'tree',
                name: 'Tree',
                meta: {
                  title: 'Tree',
                  icon: 'tree',
                  componentPath: 'tree/index'
                }
              }]
            },
            {
              path: '/form',
              component: Layout,
              meta: {
                componentPath: 'Layout'
              },
              children: [{
                path: 'index',
                name: 'Form',
                meta: {
                  title: 'Form',
                  icon: 'form',
                  componentPath: 'form/index'
                }
              }]
            },
            {
              path: '*',
              redirect: '/404',
              hidden: true,
              meta: {
                componentPath: ''
              }
            }
          ]
          const accessedRouters = fnArr(asyncRouterMap)
          console.log(accessedRouters)
          commit('SET_ROUTERS', accessedRouters)
          resolve()
        }, 500)
      })
    }
  }
}

export default permission

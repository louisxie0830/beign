import { asyncRouterMap, constantRouterMap } from '@/config/router.config'

function hasPermission (name, route) {
  if (route.meta && route.meta.permission) {
    let flag = false
    for (let i = 0, len = name.length; i < len; i++) {
      flag = route.meta.permission.includes(name[i])
      if (flag) {
        return true
      }
    }
    return false
  }
  return true
}

function filterAsyncRouter (routerMap, data) {
  const name = [data.role.code]
  const isAdmin = data.role.isAdmin
  if (name[0] === 'CUSTOMS' && isAdmin) {
    name.push('SUPER_CUSTOMS')
  }
  const accessedRouters = routerMap.filter(route => {
    if (hasPermission(name, route)) {
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, data)
      }
      return true
    }
    return false
  })
  return accessedRouters
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      console.log('routers', routers)
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateRoutes ({ commit }, data) {
      return new Promise(resolve => {
        const accessedRouters = filterAsyncRouter(asyncRouterMap, data)
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    }
  }
}

export default permission

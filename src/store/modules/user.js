import { fast } from '@/api/fast'
import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    roles: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.nickname = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        fast('userLogin',userInfo).then(data=>{
          setToken(data[0].id)
          localStorage.setItem('userInfo',JSON.stringify(data[0]))
          commit('SET_TOKEN', data[0].id)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        var data = localStorage.getItem('userInfo')
        data = JSON.parse(data)
        if (data.role && data.role.length > 0) { // 验证返回的roles是否是一个非空数组
          commit('SET_ROLES', data.role)
        } else {
          reject('getInfo: roles must be a non-null array !')
        }
        commit('SET_NAME', data.nickname)
        commit('SET_AVATAR', data.avatar)
        resolve(data)

        return 
        // 如果给个userInfo的接口，就直接改下面的，可以实时判断状态，但是考虑你这边不是严谨的系统，先放这吧
        fast('userlist',state.token).then(data => {
       
          if (data.role && data.role.length > 0) { // 验证返回的roles是否是一个非空数组
           
            commit('SET_ROLES', data.role)
          } else {
            reject('getInfo: roles must be a non-null array !')
          }
          commit('SET_NAME', data.nickname)
          commit('SET_AVATAR', data.avatar)
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resolve()
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user

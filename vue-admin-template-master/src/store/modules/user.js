import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'


const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  }
}

const actions = {
  //user login
  async login({ commit }, userInfo) {
    const { username, password } = userInfo
    let result = await login({ username: username.trim(), password })
    if (result.code == 20000) {
      const { data } = result
      //vuex存储token
      commit('SET_TOKEN', data.token)
      //本地持久化存储token
      setToken(data.token)
      return result.message
    } else {
      return Promise.reject(new Error('faile'))
    }
  },

  // get user info
  async getInfo({ commit, state }) {
    let result = await getInfo(state.token)
    if (result.code = 20000) {
      const { data } = result
      if (!data) {
        return Promise.reject('Verification failed, please Login again.')
      }
      const { name, avatar } = data
      commit('SET_NAME', name)
      commit('SET_AVATAR', avatar)
      return result.message
    } else {
      return Promise.reject(new Error('faile'))
    }
  },


  // user logout
  async logout({ commit, state }) {
    let result = await logout(state.token)
    if (result.code = 20000) {
      removeToken()
      resetRouter()
      commit('RESET_STATE')
      return result.message
    } else {
      return Promise.reject(new Error('faile'))
    }
  },

  // remove token
  async resetToken({ commit }) {
    removeToken()
    commit('RESET_STATE')
    return 'ok'
  },
  // resetToken({ commit }) {
  //   return new Promise(resolve => {
  //     removeToken() // must remove  token  first
  //     commit('RESET_STATE')
  //     resolve()
  //   })
  // }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}


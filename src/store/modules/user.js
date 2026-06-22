import { login as loginApi } from '@/api/users'

const SESSION_KEY = 'campus_activity_user'

export default {
  namespaced: true,
  state: () => ({
    currentUser: null,
    loading: false
  }),
  mutations: {
    SET_USER(state, user) {
      state.currentUser = user
    },
    SET_LOADING(state, loading) {
      state.loading = loading
    }
  },
  actions: {
    restoreSession({ commit }) {
      const raw = window.localStorage.getItem(SESSION_KEY)
      if (!raw) return
      try {
        commit('SET_USER', JSON.parse(raw))
      } catch (error) {
        window.localStorage.removeItem(SESSION_KEY)
      }
    },
    async login({ commit }, form) {
      commit('SET_LOADING', true)
      try {
        const { data } = await loginApi({
          username: form.username,
          password: form.password
        })
        const user = data[0]
        if (!user) {
          throw new Error('用户名或密码错误')
        }
        commit('SET_USER', user)
        window.localStorage.setItem(SESSION_KEY, JSON.stringify(user))
        return user
      } finally {
        commit('SET_LOADING', false)
      }
    },
    quickLogin({ dispatch }, account) {
      return dispatch('login', account)
    },
    logout({ commit }) {
      commit('SET_USER', null)
      window.localStorage.removeItem(SESSION_KEY)
    }
  }
}

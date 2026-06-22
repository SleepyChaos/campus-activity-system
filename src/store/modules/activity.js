import {
  listCategories,
  listActivities,
  getActivity
} from '@/api/activities'

export default {
  namespaced: true,
  state: () => ({
    categories: [],
    activities: [],
    currentActivity: null,
    loading: false
  }),
  getters: {
    featuredActivities: state => state.activities.filter(item => item.status === 'open').slice(0, 4)
  },
  mutations: {
    SET_CATEGORIES(state, categories) {
      state.categories = categories
    },
    SET_ACTIVITIES(state, activities) {
      state.activities = activities
    },
    SET_CURRENT_ACTIVITY(state, activity) {
      state.currentActivity = activity
    },
    SET_LOADING(state, loading) {
      state.loading = loading
    }
  },
  actions: {
    async fetchCategories({ commit }) {
      const { data } = await listCategories()
      commit('SET_CATEGORIES', data)
      return data
    },
    async fetchActivities({ commit }, filters = {}) {
      commit('SET_LOADING', true)
      try {
        const params = {}
        if (filters.categoryId) params.categoryId = filters.categoryId
        if (filters.status) params.status = filters.status
        if (filters.q) params.q = filters.q
        const { data } = await listActivities(params)
        commit('SET_ACTIVITIES', data)
        return data
      } finally {
        commit('SET_LOADING', false)
      }
    },
    async fetchActivity({ commit }, id) {
      commit('SET_LOADING', true)
      try {
        const { data } = await getActivity(id)
        commit('SET_CURRENT_ACTIVITY', data)
        return data
      } finally {
        commit('SET_LOADING', false)
      }
    }
  }
}

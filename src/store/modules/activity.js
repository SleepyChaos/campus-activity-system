import {
  listCategories,
  listActivities,
  getActivity,
  createActivity as createActivityApi,
  updateActivity as updateActivityApi,
  removeActivity as removeActivityApi
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
    openActivities: state => state.activities.filter(item => item.status === 'open'),
    featuredActivities: state => state.activities.filter(item => item.status === 'open').slice(0, 4),
    categoryMap: state => {
      return state.categories.reduce((map, category) => {
        map[category.id] = category
        return map
      }, {})
    }
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
    },
    UPSERT_ACTIVITY(state, activity) {
      const index = state.activities.findIndex(item => String(item.id) === String(activity.id))
      if (index >= 0) {
        state.activities.splice(index, 1, activity)
      } else {
        state.activities.unshift(activity)
      }
      if (String(state.currentActivity?.id) === String(activity.id)) {
        state.currentActivity = activity
      }
    },
    REMOVE_ACTIVITY(state, id) {
      state.activities = state.activities.filter(item => String(item.id) !== String(id))
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
    },
    async createActivity({ commit }, payload) {
      const { data } = await createActivityApi(payload)
      commit('UPSERT_ACTIVITY', data)
      return data
    },
    async updateActivity({ commit }, { id, payload }) {
      const { data } = await updateActivityApi(id, payload)
      commit('UPSERT_ACTIVITY', data)
      return data
    },
    async removeActivity({ commit }, id) {
      await removeActivityApi(id)
      commit('REMOVE_ACTIVITY', id)
    }
  }
}

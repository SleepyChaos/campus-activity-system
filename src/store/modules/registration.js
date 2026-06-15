import { listRegistrations, createRegistration, updateRegistration } from '@/api/registrations'
import { getActivity, listActivities, updateActivity } from '@/api/activities'

const nowText = () => {
  const date = new Date()
  const pad = value => String(value).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export default {
  namespaced: true,
  state: () => ({
    registrations: [],
    loading: false
  }),
  getters: {
    activeRegistrations: state => state.registrations.filter(item => item.status !== 'cancelled')
  },
  mutations: {
    SET_REGISTRATIONS(state, registrations) {
      state.registrations = registrations
    },
    SET_LOADING(state, loading) {
      state.loading = loading
    },
    UPSERT_REGISTRATION(state, registration) {
      const index = state.registrations.findIndex(item => String(item.id) === String(registration.id))
      if (index >= 0) {
        state.registrations.splice(index, 1, registration)
      } else {
        state.registrations.unshift(registration)
      }
    }
  },
  actions: {
    async fetchUserRegistrations({ commit }, userId) {
      commit('SET_LOADING', true)
      try {
        const [{ data: registrations }, { data: activities }] = await Promise.all([
          listRegistrations({ userId }),
          listActivities()
        ])
        const activityMap = activities.reduce((map, activity) => {
          map[activity.id] = activity
          return map
        }, {})
        const enriched = registrations.map(item => ({
          ...item,
          activity: activityMap[item.activityId]
        }))
        commit('SET_REGISTRATIONS', enriched)
        return enriched
      } finally {
        commit('SET_LOADING', false)
      }
    },
    async fetchRegistrationByActivity(context, { userId, activityId }) {
      const { data } = await listRegistrations({ userId, activityId })
      return data.find(item => item.status !== 'cancelled') || null
    },
    async registerActivity({ commit }, { user, activity }) {
      const { data: existing } = await listRegistrations({
        userId: user.id,
        activityId: activity.id
      })
      const active = existing.find(item => item.status !== 'cancelled')
      if (active) return active

      const { data: created } = await createRegistration({
        userId: user.id,
        activityId: activity.id,
        status: 'registered',
        appliedAt: nowText(),
        checkedInAt: ''
      })

      await updateActivity(activity.id, {
        joined: Math.min(activity.quota, Number(activity.joined || 0) + 1)
      })

      commit('UPSERT_REGISTRATION', {
        ...created,
        activity
      })
      return created
    },
    async cancelRegistration({ commit }, registration) {
      const { data: updated } = await updateRegistration(registration.id, {
        status: 'cancelled'
      })
      const { data: activity } = await getActivity(registration.activityId)
      await updateActivity(activity.id, {
        joined: Math.max(0, Number(activity.joined || 0) - 1)
      })
      commit('UPSERT_REGISTRATION', {
        ...registration,
        ...updated
      })
      return updated
    },
    async checkIn({ commit }, registration) {
      const { data: updated } = await updateRegistration(registration.id, {
        status: 'checkedIn',
        checkedInAt: nowText()
      })
      commit('UPSERT_REGISTRATION', {
        ...registration,
        ...updated
      })
      return updated
    }
  }
}

import { listPhotos, createPhoto } from '@/api/photos'

const nowText = () => {
  const date = new Date()
  const pad = value => String(value).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export default {
  namespaced: true,
  state: () => ({
    photos: [],
    loading: false
  }),
  mutations: {
    SET_PHOTOS(state, photos) {
      state.photos = photos
    },
    SET_LOADING(state, loading) {
      state.loading = loading
    },
    ADD_PHOTO(state, photo) {
      state.photos.unshift(photo)
    }
  },
  actions: {
    async fetchPhotos({ commit }, activityId) {
      commit('SET_LOADING', true)
      try {
        const { data } = await listPhotos({ activityId })
        commit('SET_PHOTOS', data)
        return data
      } finally {
        commit('SET_LOADING', false)
      }
    },
    async uploadPhoto({ commit }, payload) {
      const { data } = await createPhoto({
        ...payload,
        createdAt: nowText()
      })
      commit('ADD_PHOTO', data)
      return data
    }
  }
}

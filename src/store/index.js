import { createStore } from 'vuex'
import user from './modules/user'
import activity from './modules/activity'
import registration from './modules/registration'
import album from './modules/album'

export default createStore({
  modules: {
    user,
    activity,
    registration,
    album
  }
})

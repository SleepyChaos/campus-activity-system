import { createRouter, createWebHistory } from 'vue-router'
import { ElMessage } from 'element-plus'
import store from '@/store'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue')
  },
  {
    path: '/activities',
    name: 'activities',
    component: () => import('@/views/user/ActivitiesView.vue')
  },
  {
    path: '/activities/category/:categoryId',
    name: 'categoryActivities',
    component: () => import('@/views/user/CategoryActivitiesView.vue'),
    props: true
  },
  {
    path: '/activities/:id',
    name: 'activityDetail',
    component: () => import('@/views/user/ActivityDetailView.vue'),
    props: true
  },
  {
    path: '/signup/:activityId',
    name: 'signup',
    component: () => import('@/views/user/SignupView.vue'),
    props: true,
    meta: { requiresAuth: true }
  },
  {
    path: '/my/registrations',
    name: 'myRegistrations',
    component: () => import('@/views/user/MyRegistrationsView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/checkin/:activityId',
    name: 'checkin',
    component: () => import('@/views/user/CheckinView.vue'),
    props: true,
    meta: { requiresAuth: true }
  },
  {
    path: '/albums/:activityId',
    name: 'album',
    component: () => import('@/views/user/AlbumView.vue'),
    props: true
  },
  {
    path: '/albums/:activityId/upload',
    name: 'albumUpload',
    component: () => import('@/views/user/AlbumUploadView.vue'),
    props: true,
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'notFound',
    component: () => import('@/views/NotFoundView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

router.beforeEach((to, from, next) => {
  const user = store.state.user.currentUser

  if (to.meta.requiresAuth && !user) {
    ElMessage.warning('请先登录后再访问该页面')
    next({ path: '/login', query: { redirect: to.fullPath } })
    return
  }

  next()
})

export default router

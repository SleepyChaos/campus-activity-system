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
    meta: { requiresAuth: true, studentOnly: true }
  },
  {
    path: '/my/registrations',
    name: 'myRegistrations',
    component: () => import('@/views/user/MyRegistrationsView.vue'),
    meta: { requiresAuth: true, studentOnly: true }
  },
  {
    path: '/checkin/:activityId',
    name: 'checkin',
    component: () => import('@/views/user/CheckinView.vue'),
    props: true,
    meta: { requiresAuth: true, studentOnly: true }
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
    meta: { requiresAuth: true, studentOnly: true }
  },
  {
    path: '/admin',
    name: 'adminDashboard',
    component: () => import('@/views/admin/AdminDashboardView.vue'),
    meta: { requiresAuth: true, adminOnly: true }
  },
  {
    path: '/admin/activities',
    name: 'adminActivities',
    component: () => import('@/views/admin/AdminActivitiesView.vue'),
    meta: { requiresAuth: true, adminOnly: true }
  },
  {
    path: '/admin/activities/new',
    name: 'adminActivityNew',
    component: () => import('@/views/admin/AdminActivityFormView.vue'),
    meta: { requiresAuth: true, adminOnly: true }
  },
  {
    path: '/admin/activities/:id/edit',
    name: 'adminActivityEdit',
    component: () => import('@/views/admin/AdminActivityFormView.vue'),
    props: true,
    meta: { requiresAuth: true, adminOnly: true }
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

  if (to.meta.adminOnly && user?.role !== 'admin') {
    ElMessage.error('当前账号没有管理员权限')
    next('/')
    return
  }

  if (to.meta.studentOnly && user?.role !== 'student') {
    ElMessage.error('请切换学生账号体验该功能')
    next('/')
    return
  }

  next()
})

export default router

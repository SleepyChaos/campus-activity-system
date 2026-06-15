<template>
  <el-container class="app-shell">
    <el-header class="app-header">
      <div class="brand" @click="goHome">
        <div class="brand-mark">校</div>
        <div>
          <strong>校园活动发布系统</strong>
          <span>Campus Activity Hub</span>
        </div>
      </div>

      <el-menu
        :default-active="activePath"
        mode="horizontal"
        router
        class="top-menu"
        :ellipsis="false"
      >
        <el-menu-item index="/">首页</el-menu-item>
        <el-menu-item index="/activities">活动广场</el-menu-item>
        <el-menu-item v-if="isStudent" index="/my/registrations">我的报名</el-menu-item>
        <el-menu-item v-if="isAdmin" index="/admin">管理端</el-menu-item>
      </el-menu>

      <div class="account-area">
        <template v-if="currentUser">
          <el-avatar :size="34" :src="currentUser.avatar" />
          <div class="account-meta">
            <strong>{{ currentUser.name }}</strong>
            <span>{{ roleText }}</span>
          </div>
          <el-button text type="primary" @click="logout">退出</el-button>
        </template>
        <el-button v-else type="primary" @click="$router.push('/login')">登录</el-button>
      </div>
    </el-header>

    <el-main class="app-main">
      <router-view />
    </el-main>

    <el-footer class="app-footer">
      Vue3 + Vue Router + Vuex + Axios + Element Plus + json-server
    </el-footer>
  </el-container>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const store = useStore()

const currentUser = computed(() => store.state.user.currentUser)
const isAdmin = computed(() => currentUser.value?.role === 'admin')
const isStudent = computed(() => currentUser.value?.role === 'student')
const activePath = computed(() => (route.path.startsWith('/admin') ? '/admin' : route.path))
const roleText = computed(() => (isAdmin.value ? '管理员' : '学生用户'))

const goHome = () => router.push('/')

const logout = () => {
  store.dispatch('user/logout')
  ElMessage.success('已退出登录')
  router.push('/login')
}
</script>

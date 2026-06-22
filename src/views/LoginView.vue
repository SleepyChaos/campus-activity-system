<template>
  <div class="login-page">
    <section
      class="login-copy"
      style="background-image: linear-gradient(90deg, rgba(12, 45, 68, 0.88), rgba(31, 143, 107, 0.68)), url('/images/login-campus.png')"
    >
      <el-tag type="success" effect="dark">模拟登录</el-tag>
      <h1>用预置学生账号体验报名、签到和相册流程</h1>
      <p>
        本项目使用 json-server 模拟后端数据，没有正式用户数据库，因此不提供注册功能。
        答辩时直接使用两个学生账号演示浏览活动、报名、签到和上传相册即可。
      </p>
      <div class="account-grid">
        <div
          v-for="account in quickAccounts"
          :key="account.username"
          class="account-card"
          @click="quickLogin(account)"
        >
          <el-avatar :size="42" :src="account.avatar" />
          <div>
            <strong>{{ account.name }}</strong>
            <span>{{ account.roleText }} · {{ account.username }}</span>
          </div>
        </div>
      </div>
    </section>

    <el-card class="login-card" shadow="never">
      <template #header>
        <div class="card-header">
          <strong>账号登录</strong>
          <span>密码均为 123456</span>
        </div>
      </template>
      <el-form label-position="top" :model="form" @submit.prevent>
        <el-form-item label="用户名">
          <el-input v-model="form.username" placeholder="student01 / student02" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password" type="password" show-password placeholder="123456" />
        </el-form-item>
        <el-alert
          title="说明：注册功能在本演示中省略，账号来自 db.json 预置数据。"
          type="info"
          :closable="false"
          show-icon
        />
        <el-button class="login-button" type="primary" size="large" :loading="loading" @click="submit">
          登录系统
        </el-button>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { computed, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const store = useStore()

const form = reactive({
  username: 'student01',
  password: '123456'
})

const quickAccounts = [
  {
    username: 'student01',
    password: '123456',
    name: '林知夏',
    roleText: '学生',
    avatar: '/images/avatar-student-a.png'
  },
  {
    username: 'student02',
    password: '123456',
    name: '陈屿',
    roleText: '学生',
    avatar: '/images/avatar-student-b.png'
  }
]

const loading = computed(() => store.state.user.loading)

const afterLogin = user => {
  ElMessage.success(`欢迎回来，${user.name}`)
  const redirect = route.query.redirect
  if (redirect) {
    router.push(redirect)
    return
  }
  router.push('/')
}

const submit = async () => {
  try {
    const user = await store.dispatch('user/login', form)
    afterLogin(user)
  } catch (error) {
    ElMessage.error(error.message || '登录失败')
  }
}

const quickLogin = async account => {
  form.username = account.username
  form.password = account.password
  await submit()
}
</script>

<style scoped>
.login-page {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: 24px;
  align-items: stretch;
}

.login-copy,
.login-card {
  border-radius: 8px;
}

.login-copy {
  padding: 42px;
  color: #fff;
  background-position: center;
  background-size: cover;
}

.login-copy h1 {
  max-width: 640px;
  margin: 18px 0 14px;
  font-size: 36px;
  line-height: 1.18;
}

.login-copy p {
  max-width: 660px;
  margin: 0;
  line-height: 1.75;
}

.account-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin-top: 34px;
}

.account-card {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  padding: 14px;
  border: 1px solid rgba(255, 255, 255, 0.32);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.16);
  cursor: pointer;
}

.account-card strong,
.account-card span {
  display: block;
}

.account-card span {
  color: rgba(255, 255, 255, 0.78);
  font-size: 12px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.card-header span {
  color: #64748b;
  font-size: 13px;
}

.login-button {
  width: 100%;
  margin-top: 18px;
}

@media (max-width: 900px) {
  .login-page,
  .account-grid {
    grid-template-columns: 1fr;
  }
}
</style>

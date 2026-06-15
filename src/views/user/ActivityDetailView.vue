<template>
  <div v-loading="loading">
    <template v-if="activity">
      <section class="detail-hero">
        <img :src="activity.banner" :alt="activity.title">
        <div class="detail-copy">
          <el-tag :type="statusType" effect="dark">{{ statusText }}</el-tag>
          <h1>{{ activity.title }}</h1>
          <p>{{ activity.description }}</p>
          <div class="detail-meta">
            <span><el-icon><Calendar /></el-icon>{{ activity.date }} {{ activity.time }}</span>
            <span><el-icon><Location /></el-icon>{{ activity.location }}</span>
            <span><el-icon><User /></el-icon>{{ activity.joined }}/{{ activity.quota }}</span>
          </div>
        </div>
      </section>

      <section class="detail-layout">
        <el-card shadow="never">
          <template #header>
            <strong>活动详情</strong>
          </template>
          <p class="detail-text">{{ activity.description }}</p>
          <h3>活动亮点</h3>
          <el-timeline>
            <el-timeline-item v-for="item in activity.highlights" :key="item" type="success">
              {{ item }}
            </el-timeline-item>
          </el-timeline>
          <h3>参与要求</h3>
          <el-alert :title="activity.requirement" type="info" :closable="false" show-icon />
        </el-card>

        <aside class="action-panel">
          <el-card shadow="never">
            <template #header>
              <div class="panel-header">
                <strong>报名操作</strong>
                <el-tag>{{ activity.categoryName }}</el-tag>
              </div>
            </template>
            <div class="quota-box">
              <el-progress
                :percentage="quotaPercent"
                :status="activity.status === 'full' ? 'warning' : 'success'"
              />
              <span>剩余名额 {{ remainCount }} 人</span>
            </div>

            <div class="tag-row">
              <el-tag v-for="tag in activity.tags" :key="tag" type="info">{{ tag }}</el-tag>
            </div>

            <el-alert
              v-if="registration"
              :title="registration.status === 'checkedIn' ? '你已完成签到' : '你已报名该活动'"
              :type="registration.status === 'checkedIn' ? 'success' : 'warning'"
              :closable="false"
              show-icon
            />
            <el-alert
              v-else-if="!currentUser"
              title="登录学生账号后可以报名活动"
              type="info"
              :closable="false"
              show-icon
            />

            <div class="action-stack">
              <el-button
                type="primary"
                size="large"
                :disabled="!canSignup"
                @click="$router.push(`/signup/${activity.id}`)"
              >
                在线报名
              </el-button>
              <el-button
                v-if="registration?.status === 'registered'"
                size="large"
                @click="cancel"
              >
                取消报名
              </el-button>
              <el-button
                v-if="registration?.status === 'registered'"
                type="success"
                size="large"
                @click="$router.push(`/checkin/${activity.id}`)"
              >
                二维码签到
              </el-button>
              <el-button size="large" @click="$router.push(`/albums/${activity.id}`)">
                查看活动相册
              </el-button>
              <el-button
                v-if="isAdmin"
                type="warning"
                size="large"
                @click="$router.push(`/admin/activities/${activity.id}/edit`)"
              >
                管理员编辑
              </el-button>
            </div>
          </el-card>
        </aside>
      </section>
    </template>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { ElMessage, ElMessageBox } from 'element-plus'

const props = defineProps({
  id: {
    type: String,
    required: true
  }
})

const store = useStore()
const registration = ref(null)

const activity = computed(() => store.state.activity.currentActivity)
const loading = computed(() => store.state.activity.loading)
const currentUser = computed(() => store.state.user.currentUser)
const isAdmin = computed(() => currentUser.value?.role === 'admin')
const remainCount = computed(() => Math.max(0, Number(activity.value?.quota || 0) - Number(activity.value?.joined || 0)))
const quotaPercent = computed(() => {
  if (!activity.value?.quota) return 0
  return Math.min(100, Math.round((Number(activity.value.joined || 0) / Number(activity.value.quota)) * 100))
})
const statusText = computed(() => {
  const map = { open: '报名中', full: '名额已满', closed: '已结束' }
  return map[activity.value?.status] || '未知'
})
const statusType = computed(() => {
  const map = { open: 'success', full: 'warning', closed: 'info' }
  return map[activity.value?.status] || 'info'
})
const canSignup = computed(() => {
  return currentUser.value?.role === 'student' &&
    activity.value?.status === 'open' &&
    remainCount.value > 0 &&
    !registration.value
})

const loadRegistration = async () => {
  if (currentUser.value?.role !== 'student') {
    registration.value = null
    return
  }
  registration.value = await store.dispatch('registration/fetchRegistrationByActivity', {
    userId: currentUser.value.id,
    activityId: Number(props.id)
  })
}

const load = async () => {
  await store.dispatch('activity/fetchActivity', props.id)
  await loadRegistration()
}

const cancel = async () => {
  await ElMessageBox.confirm('确定要取消该活动报名吗？取消后可重新报名。', '取消报名', {
    type: 'warning'
  })
  await store.dispatch('registration/cancelRegistration', registration.value)
  ElMessage.success('已取消报名')
  await load()
}

onMounted(load)
watch(() => props.id, load)
watch(currentUser, loadRegistration)
</script>

<style scoped>
.detail-hero {
  position: relative;
  min-height: 380px;
  overflow: hidden;
  border-radius: 8px;
}

.detail-hero img {
  width: 100%;
  height: 380px;
  object-fit: cover;
}

.detail-copy {
  position: absolute;
  left: 34px;
  bottom: 34px;
  width: min(700px, calc(100% - 68px));
  padding: 24px;
  color: #fff;
  border-radius: 8px;
  background: rgba(12, 22, 34, 0.72);
}

.detail-copy h1 {
  margin: 14px 0 10px;
  font-size: 34px;
}

.detail-copy p {
  margin: 0;
  line-height: 1.7;
}

.detail-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 18px;
}

.detail-meta span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.detail-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 340px;
  gap: 20px;
  margin-top: 20px;
}

.detail-text {
  line-height: 1.8;
}

.panel-header,
.tag-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.tag-row {
  justify-content: flex-start;
  flex-wrap: wrap;
  margin: 16px 0;
}

.quota-box {
  display: grid;
  gap: 8px;
}

.quota-box span {
  color: #64748b;
  font-size: 13px;
}

.action-stack {
  display: grid;
  gap: 10px;
  margin-top: 18px;
}

.action-stack .el-button {
  width: 100%;
  margin-left: 0;
}

@media (max-width: 900px) {
  .detail-layout {
    grid-template-columns: 1fr;
  }

  .detail-copy {
    left: 18px;
    bottom: 18px;
    width: calc(100% - 36px);
  }
}
</style>

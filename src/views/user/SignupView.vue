<template>
  <div v-loading="loading">
    <div class="page-heading">
      <div>
        <h1>在线报名确认</h1>
        <p>提交后会在“我的报名”中生成报名记录，并同步活动人数。</p>
      </div>
      <el-button @click="$router.back()">返回</el-button>
    </div>

    <el-card v-if="activity" shadow="never" class="signup-card">
      <div class="signup-layout">
        <img :src="activity.cover" :alt="activity.title">
        <div>
          <el-tag type="success">{{ activity.categoryName }}</el-tag>
          <h2>{{ activity.title }}</h2>
          <p>{{ activity.description }}</p>
          <el-descriptions :column="1" border>
            <el-descriptions-item label="时间">{{ activity.date }} {{ activity.time }}</el-descriptions-item>
            <el-descriptions-item label="地点">{{ activity.location }}</el-descriptions-item>
            <el-descriptions-item label="组织方">{{ activity.organizer }}</el-descriptions-item>
            <el-descriptions-item label="报名人数">{{ activity.joined }}/{{ activity.quota }}</el-descriptions-item>
            <el-descriptions-item label="报名账号">{{ currentUser.name }}（{{ currentUser.college }}）</el-descriptions-item>
          </el-descriptions>
          <el-alert
            class="notice"
            title="报名成功后，请在活动当天进入二维码签到页完成签到。"
            type="info"
            show-icon
            :closable="false"
          />
          <el-button type="primary" size="large" :disabled="!canSubmit" :loading="submitting" @click="submit">
            确认报名
          </el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'

const props = defineProps({
  activityId: {
    type: String,
    required: true
  }
})

const store = useStore()
const router = useRouter()
const submitting = ref(false)
const existing = ref(null)

const activity = computed(() => store.state.activity.currentActivity)
const loading = computed(() => store.state.activity.loading)
const currentUser = computed(() => store.state.user.currentUser)
const canSubmit = computed(() => {
  return activity.value?.status === 'open' &&
    Number(activity.value.joined) < Number(activity.value.quota) &&
    !existing.value
})

const load = async () => {
  await store.dispatch('activity/fetchActivity', props.activityId)
  existing.value = await store.dispatch('registration/fetchRegistrationByActivity', {
    userId: currentUser.value.id,
    activityId: Number(props.activityId)
  })
  if (existing.value) {
    ElMessage.info('你已经报名过该活动')
  }
}

const submit = async () => {
  submitting.value = true
  try {
    await store.dispatch('registration/registerActivity', {
      user: currentUser.value,
      activity: activity.value
    })
    ElMessage.success('报名成功')
    router.push('/my/registrations')
  } finally {
    submitting.value = false
  }
}

onMounted(load)
</script>

<style scoped>
.signup-card {
  border-radius: 8px;
}

.signup-layout {
  display: grid;
  grid-template-columns: 420px minmax(0, 1fr);
  gap: 24px;
}

.signup-layout img {
  width: 100%;
  height: 100%;
  min-height: 360px;
  object-fit: cover;
  border-radius: 8px;
}

h2 {
  margin: 14px 0 10px;
  font-size: 28px;
}

p {
  color: #64748b;
  line-height: 1.7;
}

.notice {
  margin: 18px 0;
}

@media (max-width: 900px) {
  .signup-layout {
    grid-template-columns: 1fr;
  }
}
</style>

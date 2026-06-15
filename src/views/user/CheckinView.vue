<template>
  <div v-loading="loading">
    <div class="page-heading">
      <div>
        <h1>活动签到</h1>
        <p>通过二维码展示签到信息，并点击确认完成签到状态更新。</p>
      </div>
      <el-button @click="$router.push('/my/registrations')">我的报名</el-button>
    </div>

    <el-card v-if="activity" shadow="never" class="checkin-card">
      <div class="checkin-layout">
        <div class="qr-panel">
          <img v-if="qrCodeUrl" :src="qrCodeUrl" alt="签到二维码">
          <el-empty v-else description="二维码生成中" />
          <el-tag :type="registration?.status === 'checkedIn' ? 'success' : 'warning'">
            {{ registration?.status === 'checkedIn' ? '已签到' : '待签到' }}
          </el-tag>
        </div>
        <div>
          <el-tag>{{ activity.categoryName }}</el-tag>
          <h2>{{ activity.title }}</h2>
          <p>{{ activity.description }}</p>
          <el-descriptions :column="1" border>
            <el-descriptions-item label="签到码">{{ activity.checkinCode }}</el-descriptions-item>
            <el-descriptions-item label="活动时间">{{ activity.date }} {{ activity.time }}</el-descriptions-item>
            <el-descriptions-item label="地点">{{ activity.location }}</el-descriptions-item>
            <el-descriptions-item label="报名人">{{ currentUser.name }}</el-descriptions-item>
            <el-descriptions-item label="签到时间">{{ registration?.checkedInAt || '-' }}</el-descriptions-item>
          </el-descriptions>
          <el-alert
            v-if="!registration"
            class="notice"
            title="当前账号未报名该活动，不能签到。"
            type="error"
            show-icon
            :closable="false"
          />
          <el-button
            class="check-button"
            type="success"
            size="large"
            :disabled="!registration || registration.status === 'checkedIn'"
            @click="confirmCheckIn"
          >
            确认签到
          </el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'
import QRCode from 'qrcode'

const props = defineProps({
  activityId: {
    type: String,
    required: true
  }
})

const store = useStore()
const registration = ref(null)
const qrCodeUrl = ref('')

const activity = computed(() => store.state.activity.currentActivity)
const currentUser = computed(() => store.state.user.currentUser)
const loading = computed(() => store.state.activity.loading)

const buildQrCode = async () => {
  if (!activity.value) return
  const text = JSON.stringify({
    type: 'campus-activity-checkin',
    activityId: activity.value.id,
    activityTitle: activity.value.title,
    checkinCode: activity.value.checkinCode,
    userId: currentUser.value.id,
    userName: currentUser.value.name
  })
  qrCodeUrl.value = await QRCode.toDataURL(text, {
    width: 260,
    margin: 2
  })
}

const load = async () => {
  await store.dispatch('activity/fetchActivity', props.activityId)
  registration.value = await store.dispatch('registration/fetchRegistrationByActivity', {
    userId: currentUser.value.id,
    activityId: Number(props.activityId)
  })
  await buildQrCode()
}

const confirmCheckIn = async () => {
  registration.value = await store.dispatch('registration/checkIn', registration.value)
  ElMessage.success('签到成功')
}

onMounted(load)
</script>

<style scoped>
.checkin-card {
  border-radius: 8px;
}

.checkin-layout {
  display: grid;
  grid-template-columns: 340px minmax(0, 1fr);
  gap: 26px;
  align-items: stretch;
}

.qr-panel {
  display: grid;
  place-items: center;
  gap: 18px;
  padding: 28px;
  border: 1px dashed #cbd5e1;
  border-radius: 8px;
  background: #f8fafc;
}

.qr-panel img {
  width: 260px;
  height: 260px;
}

h2 {
  margin: 14px 0 10px;
  font-size: 28px;
}

p {
  color: #64748b;
  line-height: 1.7;
}

.notice,
.check-button {
  margin-top: 18px;
}

@media (max-width: 900px) {
  .checkin-layout {
    grid-template-columns: 1fr;
  }
}
</style>

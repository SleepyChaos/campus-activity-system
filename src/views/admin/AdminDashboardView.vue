<template>
  <div class="admin-layout">
    <AdminNav />
    <main>
      <div class="page-heading">
        <div>
          <h1>管理概览</h1>
          <p>统计活动发布、报名、签到和相册数据，便于答辩展示管理端价值。</p>
        </div>
        <el-button type="primary" @click="$router.push('/admin/activities/new')">发布新活动</el-button>
      </div>

      <div class="grid-4 stat-grid" v-loading="loading">
        <el-card shadow="never">
          <span>活动总数</span>
          <strong>{{ stats.activityCount }}</strong>
        </el-card>
        <el-card shadow="never">
          <span>报名中</span>
          <strong>{{ stats.openCount }}</strong>
        </el-card>
        <el-card shadow="never">
          <span>报名记录</span>
          <strong>{{ stats.registrationCount }}</strong>
        </el-card>
        <el-card shadow="never">
          <span>已签到</span>
          <strong>{{ stats.checkinCount }}</strong>
        </el-card>
      </div>

      <div class="section-title">
        <h2>报名情况</h2>
        <p>展示最近报名数据，方便说明 Vuex、Axios 与 json-server 的联动。</p>
      </div>
      <el-card shadow="never">
        <el-table :data="registrations" empty-text="暂无报名记录">
          <el-table-column label="用户 ID" prop="userId" width="90" />
          <el-table-column label="活动 ID" prop="activityId" width="90" />
          <el-table-column label="报名时间" prop="appliedAt" />
          <el-table-column label="签到时间" prop="checkedInAt">
            <template #default="{ row }">{{ row.checkedInAt || '-' }}</template>
          </el-table-column>
          <el-table-column label="状态" width="120">
            <template #default="{ row }">
              <el-tag :type="row.status === 'checkedIn' ? 'success' : row.status === 'cancelled' ? 'info' : 'warning'">
                {{ statusText(row.status) }}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import AdminNav from '@/components/AdminNav.vue'
import { listRegistrations } from '@/api/registrations'
import { listPhotos } from '@/api/photos'

const store = useStore()
const registrations = ref([])
const photos = ref([])
const loading = ref(false)

const activities = computed(() => store.state.activity.activities)
const stats = computed(() => ({
  activityCount: activities.value.length,
  openCount: activities.value.filter(item => item.status === 'open').length,
  registrationCount: registrations.value.length,
  checkinCount: registrations.value.filter(item => item.status === 'checkedIn').length,
  photoCount: photos.value.length
}))

const statusText = status => {
  const map = {
    registered: '已报名',
    checkedIn: '已签到',
    cancelled: '已取消'
  }
  return map[status] || status
}

const load = async () => {
  loading.value = true
  try {
    await store.dispatch('activity/fetchActivities')
    const [{ data: registrationData }, { data: photoData }] = await Promise.all([
      listRegistrations(),
      listPhotos()
    ])
    registrations.value = registrationData
    photos.value = photoData
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>

<style scoped>
.stat-grid .el-card {
  border-radius: 8px;
}

.stat-grid span,
.stat-grid strong {
  display: block;
}

.stat-grid span {
  color: #64748b;
}

.stat-grid strong {
  margin-top: 10px;
  font-size: 34px;
  color: #1f8f6b;
}
</style>

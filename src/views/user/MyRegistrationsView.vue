<template>
  <div>
    <div class="page-heading">
      <div>
        <h1>我的报名</h1>
        <p>查看当前学生账号的报名、取消和签到状态。</p>
      </div>
      <el-button type="primary" @click="$router.push('/activities')">继续报名</el-button>
    </div>

    <el-card shadow="never">
      <el-table :data="registrations" v-loading="loading" empty-text="暂无报名记录">
        <el-table-column label="活动" min-width="220">
          <template #default="{ row }">
            <strong>{{ row.activity?.title || '活动已删除' }}</strong>
            <div class="muted">{{ row.activity?.date }} {{ row.activity?.time }}</div>
          </template>
        </el-table-column>
        <el-table-column label="地点" prop="activity.location" min-width="160" />
        <el-table-column label="报名时间" prop="appliedAt" width="150" />
        <el-table-column label="状态" width="120">
          <template #default="{ row }">
            <el-tag :type="statusType(row.status)">{{ statusText(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="签到时间" prop="checkedInAt" width="150">
          <template #default="{ row }">{{ row.checkedInAt || '-' }}</template>
        </el-table-column>
        <el-table-column label="操作" width="310" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="$router.push(`/activities/${row.activityId}`)">详情</el-button>
            <el-button
              size="small"
              type="success"
              :disabled="row.status !== 'registered'"
              @click="$router.push(`/checkin/${row.activityId}`)"
            >
              签到
            </el-button>
            <el-button
              size="small"
              :disabled="row.status !== 'registered'"
              @click="cancel(row)"
            >
              取消
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { ElMessage, ElMessageBox } from 'element-plus'

const store = useStore()

const currentUser = computed(() => store.state.user.currentUser)
const registrations = computed(() => store.state.registration.registrations)
const loading = computed(() => store.state.registration.loading)

const statusText = status => {
  const map = {
    registered: '已报名',
    cancelled: '已取消',
    checkedIn: '已签到'
  }
  return map[status] || '未知'
}

const statusType = status => {
  const map = {
    registered: 'warning',
    cancelled: 'info',
    checkedIn: 'success'
  }
  return map[status] || 'info'
}

const load = () => store.dispatch('registration/fetchUserRegistrations', currentUser.value.id)

const cancel = async row => {
  await ElMessageBox.confirm(`确定取消「${row.activity?.title}」的报名吗？`, '取消报名', {
    type: 'warning'
  })
  await store.dispatch('registration/cancelRegistration', row)
  ElMessage.success('已取消报名')
  await load()
}

onMounted(load)
</script>

<style scoped>
.muted {
  margin-top: 4px;
  color: #64748b;
  font-size: 12px;
}
</style>

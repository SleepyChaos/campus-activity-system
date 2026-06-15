<template>
  <div class="admin-layout">
    <AdminNav />
    <main>
      <div class="page-heading">
        <div>
          <h1>活动管理</h1>
          <p>管理员可以发布、编辑、删除活动，修改结果会同步到用户端页面。</p>
        </div>
        <el-button type="primary" @click="$router.push('/admin/activities/new')">发布活动</el-button>
      </div>

      <div class="toolbar-card">
        <el-input
          v-model="keyword"
          clearable
          placeholder="按标题、组织方、地点搜索"
          style="max-width: 360px"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
      </div>

      <el-card shadow="never">
        <el-table :data="filteredActivities" v-loading="loading" empty-text="暂无活动">
          <el-table-column label="活动" min-width="250">
            <template #default="{ row }">
              <div class="activity-cell">
                <img :src="row.cover" :alt="row.title">
                <div>
                  <strong>{{ row.title }}</strong>
                  <span>{{ row.organizer }}</span>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="分类" prop="categoryName" width="120" />
          <el-table-column label="时间" min-width="150">
            <template #default="{ row }">{{ row.date }} {{ row.time }}</template>
          </el-table-column>
          <el-table-column label="人数" width="110">
            <template #default="{ row }">{{ row.joined }}/{{ row.quota }}</template>
          </el-table-column>
          <el-table-column label="状态" width="110">
            <template #default="{ row }">
              <el-tag :type="statusType(row.status)">{{ statusText(row.status) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="260" fixed="right">
            <template #default="{ row }">
              <el-button size="small" @click="$router.push(`/activities/${row.id}`)">预览</el-button>
              <el-button size="small" type="primary" @click="$router.push(`/admin/activities/${row.id}/edit`)">
                编辑
              </el-button>
              <el-button size="small" type="danger" @click="remove(row)">删除</el-button>
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
import { ElMessage, ElMessageBox } from 'element-plus'
import AdminNav from '@/components/AdminNav.vue'

const store = useStore()
const keyword = ref('')

const activities = computed(() => store.state.activity.activities)
const loading = computed(() => store.state.activity.loading)
const filteredActivities = computed(() => {
  const text = keyword.value.trim().toLowerCase()
  if (!text) return activities.value
  return activities.value.filter(item => {
    return [item.title, item.organizer, item.location, item.categoryName]
      .join(' ')
      .toLowerCase()
      .includes(text)
  })
})

const statusText = status => {
  const map = {
    open: '报名中',
    full: '名额已满',
    closed: '已结束'
  }
  return map[status] || status
}

const statusType = status => {
  const map = {
    open: 'success',
    full: 'warning',
    closed: 'info'
  }
  return map[status] || 'info'
}

const remove = async row => {
  await ElMessageBox.confirm(`确定删除「${row.title}」吗？`, '删除活动', {
    type: 'warning'
  })
  await store.dispatch('activity/removeActivity', row.id)
  ElMessage.success('活动已删除')
}

onMounted(() => store.dispatch('activity/fetchActivities'))
</script>

<style scoped>
.activity-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.activity-cell img {
  width: 74px;
  height: 52px;
  object-fit: cover;
  border-radius: 8px;
}

.activity-cell strong,
.activity-cell span {
  display: block;
}

.activity-cell span {
  margin-top: 4px;
  color: #64748b;
  font-size: 12px;
}
</style>

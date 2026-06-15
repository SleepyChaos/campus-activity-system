<template>
  <el-card class="activity-card" shadow="hover" :body-style="{ padding: 0 }">
    <div class="cover-wrap" @click="$router.push(`/activities/${activity.id}`)">
      <img :src="activity.cover" :alt="activity.title">
      <el-tag class="status-tag" :type="statusType">{{ statusText }}</el-tag>
    </div>
    <div class="card-body">
      <div class="meta-line">
        <el-tag size="small" effect="plain">{{ activity.categoryName }}</el-tag>
        <span>{{ activity.date }} {{ activity.time }}</span>
      </div>
      <h3 @click="$router.push(`/activities/${activity.id}`)">{{ activity.title }}</h3>
      <p>{{ activity.description }}</p>
      <div class="info-row">
        <span><el-icon><Location /></el-icon>{{ activity.location }}</span>
        <span><el-icon><User /></el-icon>{{ activity.joined }}/{{ activity.quota }}</span>
      </div>
      <div class="tag-row">
        <el-tag v-for="tag in activity.tags" :key="tag" size="small" type="info">
          {{ tag }}
        </el-tag>
      </div>
      <div class="card-actions">
        <el-button type="primary" @click="$router.push(`/activities/${activity.id}`)">查看详情</el-button>
        <el-button @click="$router.push(`/albums/${activity.id}`)">活动相册</el-button>
      </div>
    </div>
  </el-card>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  activity: {
    type: Object,
    required: true
  }
})

const statusText = computed(() => {
  const map = {
    open: '报名中',
    full: '名额已满',
    closed: '已结束'
  }
  return map[props.activity.status] || '未知'
})

const statusType = computed(() => {
  const map = {
    open: 'success',
    full: 'warning',
    closed: 'info'
  }
  return map[props.activity.status] || 'info'
})
</script>

<style scoped>
.activity-card {
  overflow: hidden;
  height: 100%;
  border-radius: 8px;
}

.cover-wrap {
  position: relative;
  height: 168px;
  cursor: pointer;
  overflow: hidden;
}

.cover-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.25s ease;
}

.activity-card:hover .cover-wrap img {
  transform: scale(1.04);
}

.status-tag {
  position: absolute;
  right: 12px;
  top: 12px;
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
}

.meta-line,
.info-row,
.tag-row,
.card-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.meta-line {
  justify-content: space-between;
  color: #6b7280;
  font-size: 13px;
}

h3 {
  margin: 0;
  font-size: 18px;
  cursor: pointer;
}

p {
  display: -webkit-box;
  min-height: 44px;
  margin: 0;
  overflow: hidden;
  color: #64748b;
  line-height: 1.55;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.info-row {
  justify-content: space-between;
  color: #475569;
  font-size: 13px;
}

.info-row span {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.card-actions {
  margin-top: 4px;
}
</style>

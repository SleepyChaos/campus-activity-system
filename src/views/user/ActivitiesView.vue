<template>
  <div>
    <div class="page-heading">
      <div>
        <h1>活动广场</h1>
        <p>支持关键词、分类和状态筛选，列表数据来自 json-server REST API。</p>
      </div>
      <el-button type="primary" @click="$router.push('/login')" v-if="!currentUser">登录后报名</el-button>
    </div>

    <div class="toolbar-card">
      <el-form :model="filters" :inline="true" class="filter-form">
        <el-form-item label="关键词">
          <el-input v-model="filters.q" clearable placeholder="搜索标题、地点、标签" />
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="filters.categoryId" clearable placeholder="全部分类" style="width: 160px">
            <el-option v-for="category in categories" :key="category.id" :label="category.name" :value="category.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="filters.status" clearable placeholder="全部状态" style="width: 140px">
            <el-option label="报名中" value="open" />
            <el-option label="名额已满" value="full" />
            <el-option label="已结束" value="closed" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadActivities">筛选</el-button>
          <el-button @click="resetFilters">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div v-if="activities.length" class="grid-3" v-loading="loading">
      <ActivityCard v-for="activity in activities" :key="activity.id" :activity="activity" />
    </div>
    <div v-else class="empty-panel">暂无符合条件的活动</div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive } from 'vue'
import { useStore } from 'vuex'
import ActivityCard from '@/components/ActivityCard.vue'

const store = useStore()

const filters = reactive({
  q: '',
  categoryId: '',
  status: ''
})

const currentUser = computed(() => store.state.user.currentUser)
const categories = computed(() => store.state.activity.categories)
const activities = computed(() => store.state.activity.activities)
const loading = computed(() => store.state.activity.loading)

const loadActivities = () => store.dispatch('activity/fetchActivities', filters)

const resetFilters = () => {
  filters.q = ''
  filters.categoryId = ''
  filters.status = ''
  loadActivities()
}

onMounted(async () => {
  if (!categories.value.length) {
    await store.dispatch('activity/fetchCategories')
  }
  await loadActivities()
})
</script>

<style scoped>
.filter-form {
  display: flex;
  flex-wrap: wrap;
}
</style>

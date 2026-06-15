<template>
  <div>
    <div class="page-heading">
      <div>
        <h1>{{ currentCategory?.name || '分类活动' }}</h1>
        <p>当前分类下共 {{ activities.length }} 个活动。</p>
      </div>
      <el-button @click="$router.push('/activities')">返回活动广场</el-button>
    </div>

    <div v-if="activities.length" class="grid-3" v-loading="loading">
      <ActivityCard v-for="activity in activities" :key="activity.id" :activity="activity" />
    </div>
    <div v-else class="empty-panel">该分类暂时没有活动</div>
  </div>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import ActivityCard from '@/components/ActivityCard.vue'

const props = defineProps({
  categoryId: {
    type: String,
    required: true
  }
})

const store = useStore()

const categories = computed(() => store.state.activity.categories)
const activities = computed(() => store.state.activity.activities)
const loading = computed(() => store.state.activity.loading)
const currentCategory = computed(() => categories.value.find(item => String(item.id) === String(props.categoryId)))

const load = async () => {
  if (!categories.value.length) {
    await store.dispatch('activity/fetchCategories')
  }
  await store.dispatch('activity/fetchActivities', { categoryId: props.categoryId })
}

onMounted(load)
watch(() => props.categoryId, load)
</script>

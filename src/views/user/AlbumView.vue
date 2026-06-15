<template>
  <div v-loading="loading">
    <div class="page-heading">
      <div>
        <h1>活动相册</h1>
        <p>{{ activity?.title || '活动' }} 的照片墙，支持登录学生上传作品。</p>
      </div>
      <div>
        <el-button @click="$router.push(`/activities/${activityId}`)">活动详情</el-button>
        <el-button type="primary" @click="$router.push(`/albums/${activityId}/upload`)">上传照片</el-button>
      </div>
    </div>

    <div v-if="photos.length" class="photo-grid">
      <el-card v-for="photo in photos" :key="photo.id" shadow="hover" :body-style="{ padding: 0 }">
        <el-image :src="photo.url" :preview-src-list="previewList" fit="cover" class="photo" />
        <div class="photo-meta">
          <strong>{{ photo.title }}</strong>
          <span>{{ photo.createdAt }}</span>
        </div>
      </el-card>
    </div>
    <div v-else class="empty-panel">相册暂时没有照片，快上传第一张吧</div>
  </div>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue'
import { useStore } from 'vuex'

const props = defineProps({
  activityId: {
    type: String,
    required: true
  }
})

const store = useStore()
const photos = computed(() => store.state.album.photos)
const activity = computed(() => store.state.activity.currentActivity)
const loading = computed(() => store.state.album.loading || store.state.activity.loading)
const previewList = computed(() => photos.value.map(item => item.url))

const load = async () => {
  await Promise.all([
    store.dispatch('activity/fetchActivity', props.activityId),
    store.dispatch('album/fetchPhotos', Number(props.activityId))
  ])
}

onMounted(load)
watch(() => props.activityId, load)
</script>

<style scoped>
.photo-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}

.photo {
  width: 100%;
  height: 230px;
  display: block;
}

.photo-meta {
  display: grid;
  gap: 5px;
  padding: 14px;
}

.photo-meta span {
  color: #64748b;
  font-size: 13px;
}

@media (max-width: 900px) {
  .photo-grid {
    grid-template-columns: 1fr;
  }
}
</style>

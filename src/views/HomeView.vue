<template>
  <div>
    <section class="home-hero">
      <el-carousel height="360px" indicator-position="outside">
        <el-carousel-item v-for="activity in carouselActivities" :key="activity.id">
          <div class="hero-slide" :style="{ backgroundImage: `url(${activity.banner})` }">
            <div class="hero-copy">
              <el-tag type="success" effect="dark">{{ activity.categoryName }}</el-tag>
              <h1>{{ activity.title }}</h1>
              <p>{{ activity.description }}</p>
              <div class="hero-actions">
                <el-button type="primary" size="large" @click="$router.push(`/activities/${activity.id}`)">
                  查看活动
                </el-button>
                <el-button size="large" @click="$router.push('/activities')">浏览全部</el-button>
              </div>
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
    </section>

    <section class="quick-categories">
      <div
        v-for="category in categories"
        :key="category.id"
        class="category-tile"
        :style="{ borderColor: category.color }"
        @click="$router.push(`/activities/category/${category.id}`)"
      >
        <span :style="{ backgroundColor: category.color }">{{ category.name.slice(0, 1) }}</span>
        <strong>{{ category.name }}</strong>
        <small>查看分类活动</small>
      </div>
    </section>

    <div class="section-title">
      <h2>热门推荐</h2>
      <p>精选正在报名的校园活动，适合答辩演示完整报名流程。</p>
    </div>
    <div class="grid-4" v-loading="loading">
      <ActivityCard v-for="activity in featuredActivities" :key="activity.id" :activity="activity" />
    </div>

    <div class="section-title">
      <h2>最新发布</h2>
      <p>活动数据来自 json-server，首页和列表页会同步展示最新内容。</p>
    </div>
    <div class="grid-3">
      <ActivityCard v-for="activity in latestActivities" :key="activity.id" :activity="activity" />
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import ActivityCard from '@/components/ActivityCard.vue'

const store = useStore()

const loading = computed(() => store.state.activity.loading)
const categories = computed(() => store.state.activity.categories)
const activities = computed(() => store.state.activity.activities)
const carouselActivities = computed(() => activities.value.filter(item => item.status === 'open').slice(0, 3))
const featuredActivities = computed(() => store.getters['activity/featuredActivities'])
const latestActivities = computed(() => [...activities.value].sort((a, b) => b.id - a.id).slice(0, 3))

onMounted(async () => {
  await Promise.all([
    store.dispatch('activity/fetchCategories'),
    store.dispatch('activity/fetchActivities')
  ])
})
</script>

<style scoped>
.home-hero {
  overflow: hidden;
  border-radius: 8px;
  background: #fff;
}

.hero-slide {
  display: flex;
  align-items: flex-end;
  min-height: 360px;
  padding: 42px;
  background-position: center;
  background-size: cover;
}

.hero-copy {
  width: min(620px, 100%);
  padding: 24px;
  border-radius: 8px;
  color: #fff;
  background: rgba(13, 26, 44, 0.68);
}

.hero-copy h1 {
  margin: 14px 0 10px;
  font-size: 36px;
  line-height: 1.15;
}

.hero-copy p {
  margin: 0;
  line-height: 1.7;
}

.hero-actions {
  display: flex;
  gap: 12px;
  margin-top: 22px;
}

.quick-categories {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 14px;
  margin-top: 22px;
}

.category-tile {
  display: grid;
  gap: 7px;
  padding: 16px;
  border: 1px solid;
  border-radius: 8px;
  background: #fff;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.category-tile:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 26px rgba(15, 23, 42, 0.08);
}

.category-tile span {
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  color: #fff;
  font-weight: 800;
  border-radius: 8px;
}

.category-tile strong {
  font-size: 16px;
}

.category-tile small {
  color: #64748b;
}

@media (max-width: 900px) {
  .hero-slide {
    padding: 18px;
  }

  .hero-copy h1 {
    font-size: 28px;
  }

  .quick-categories {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>

<template>
  <aside class="admin-side">
    <el-button text :type="active === '/admin' ? 'primary' : 'default'" @click="$router.push('/admin')">
      <el-icon><DataAnalysis /></el-icon>
      管理概览
    </el-button>
    <el-button text :type="active.startsWith('/admin/activities') ? 'primary' : 'default'" @click="$router.push('/admin/activities')">
      <el-icon><Tickets /></el-icon>
      活动管理
    </el-button>
    <el-button type="primary" @click="$router.push('/admin/activities/new')">
      <el-icon><Plus /></el-icon>
      发布活动
    </el-button>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const active = computed(() => route.path)
</script>

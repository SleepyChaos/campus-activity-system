<template>
  <div class="not-found">
    <el-result
      icon="warning"
      title="页面不存在"
      sub-title="请检查访问地址，或返回活动首页继续浏览。"
    >
      <template #extra>
        <el-button type="primary" @click="$router.push('/')">返回首页</el-button>
        <el-button @click="$router.push('/activities')">活动广场</el-button>
      </template>
    </el-result>
  </div>
</template>

<style scoped>
.not-found {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #fff;
}
</style>

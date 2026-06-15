<template>
  <div class="admin-layout">
    <AdminNav />
    <main>
      <div class="page-heading">
        <div>
          <h1>{{ isEdit ? '编辑活动' : '发布活动' }}</h1>
          <p>表单提交后通过 Axios 调用 json-server 的 POST/PATCH 接口。</p>
        </div>
        <el-button @click="$router.push('/admin/activities')">返回列表</el-button>
      </div>

      <el-card shadow="never" class="form-card" v-loading="loading">
        <el-form ref="formRef" :model="form" :rules="rules" label-position="top">
          <div class="grid-2">
            <el-form-item label="活动标题" prop="title">
              <el-input v-model="form.title" placeholder="请输入活动标题" />
            </el-form-item>
            <el-form-item label="活动分类" prop="categoryId">
              <el-select v-model="form.categoryId" placeholder="请选择分类" style="width: 100%">
                <el-option v-for="category in categories" :key="category.id" :label="category.name" :value="category.id" />
              </el-select>
            </el-form-item>
          </div>

          <el-form-item label="活动描述" prop="description">
            <el-input v-model="form.description" type="textarea" :rows="3" placeholder="说明活动内容和价值" />
          </el-form-item>

          <div class="grid-2">
            <el-form-item label="活动日期" prop="date">
              <el-date-picker v-model="form.date" type="date" value-format="YYYY-MM-DD" placeholder="选择日期" style="width: 100%" />
            </el-form-item>
            <el-form-item label="活动时间" prop="time">
              <el-input v-model="form.time" placeholder="例如 14:00-17:00" />
            </el-form-item>
          </div>

          <div class="grid-2">
            <el-form-item label="活动地点" prop="location">
              <el-input v-model="form.location" placeholder="请输入地点" />
            </el-form-item>
            <el-form-item label="组织方" prop="organizer">
              <el-input v-model="form.organizer" placeholder="请输入组织方" />
            </el-form-item>
          </div>

          <div class="grid-3">
            <el-form-item label="活动状态" prop="status">
              <el-select v-model="form.status" style="width: 100%">
                <el-option label="报名中" value="open" />
                <el-option label="名额已满" value="full" />
                <el-option label="已结束" value="closed" />
              </el-select>
            </el-form-item>
            <el-form-item label="名额上限" prop="quota">
              <el-input-number v-model="form.quota" :min="1" :max="999" style="width: 100%" />
            </el-form-item>
            <el-form-item label="已报名人数" prop="joined">
              <el-input-number v-model="form.joined" :min="0" :max="form.quota" style="width: 100%" />
            </el-form-item>
          </div>

          <div class="grid-2">
            <el-form-item label="封面图片" prop="cover">
              <el-select v-model="form.cover" style="width: 100%">
                <el-option v-for="image in imageOptions" :key="image.value" :label="image.label" :value="image.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="签到码" prop="checkinCode">
              <el-input v-model="form.checkinCode" placeholder="例如 CAMPUS2026" />
            </el-form-item>
          </div>

          <el-form-item label="标签（用逗号分隔）">
            <el-input v-model="tagsText" placeholder="例如 AI,实践,证书" />
          </el-form-item>

          <el-form-item label="活动亮点（每行一条）">
            <el-input v-model="highlightsText" type="textarea" :rows="3" placeholder="现场实践&#10;导师点评&#10;证书发放" />
          </el-form-item>

          <el-form-item label="参与要求">
            <el-input v-model="form.requirement" type="textarea" :rows="2" placeholder="请输入报名或参与要求" />
          </el-form-item>

          <div v-if="form.cover" class="cover-preview">
            <img :src="form.cover" alt="活动封面预览">
          </div>

          <el-button type="primary" size="large" :loading="submitting" @click="submit">
            {{ isEdit ? '保存修改' : '发布活动' }}
          </el-button>
        </el-form>
      </el-card>
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'
import AdminNav from '@/components/AdminNav.vue'

const props = defineProps({
  id: {
    type: String,
    default: ''
  }
})

const store = useStore()
const router = useRouter()
const formRef = ref(null)
const submitting = ref(false)
const tagsText = ref('校园,活动')
const highlightsText = ref('流程清晰\n现场互动\n签到记录')

const form = reactive({
  title: '',
  categoryId: '',
  categoryName: '',
  status: 'open',
  location: '',
  date: '',
  time: '',
  quota: 80,
  joined: 0,
  organizer: '',
  banner: '/images/activity-ai.png',
  cover: '/images/activity-ai.png',
  description: '',
  requirement: '请提前报名，并在活动当天完成签到。',
  checkinCode: ''
})

const rules = {
  title: [{ required: true, message: '请输入活动标题', trigger: 'blur' }],
  categoryId: [{ required: true, message: '请选择分类', trigger: 'change' }],
  description: [{ required: true, message: '请输入活动描述', trigger: 'blur' }],
  date: [{ required: true, message: '请选择活动日期', trigger: 'change' }],
  time: [{ required: true, message: '请输入活动时间', trigger: 'blur' }],
  location: [{ required: true, message: '请输入活动地点', trigger: 'blur' }],
  organizer: [{ required: true, message: '请输入组织方', trigger: 'blur' }]
}

const imageOptions = [
  { label: 'AI 创新应用', value: '/images/activity-ai.png' },
  { label: '音乐演出', value: '/images/activity-music.png' },
  { label: '篮球竞赛', value: '/images/activity-basketball.png' },
  { label: '志愿服务', value: '/images/activity-volunteer.png' },
  { label: '创业路演', value: '/images/activity-startup.png' },
  { label: '摄影打卡', value: '/images/activity-photo.png' }
]

const categories = computed(() => store.state.activity.categories)
const activity = computed(() => store.state.activity.currentActivity)
const loading = computed(() => store.state.activity.loading)
const isEdit = computed(() => Boolean(props.id))

watch(() => form.cover, value => {
  form.banner = value
})

const fillForm = data => {
  Object.assign(form, {
    title: data.title,
    categoryId: data.categoryId,
    categoryName: data.categoryName,
    status: data.status,
    location: data.location,
    date: data.date,
    time: data.time,
    quota: data.quota,
    joined: data.joined,
    organizer: data.organizer,
    banner: data.banner,
    cover: data.cover,
    description: data.description,
    requirement: data.requirement,
    checkinCode: data.checkinCode
  })
  tagsText.value = (data.tags || []).join(',')
  highlightsText.value = (data.highlights || []).join('\n')
}

const buildPayload = () => {
  const category = categories.value.find(item => String(item.id) === String(form.categoryId))
  return {
    ...form,
    categoryId: Number(form.categoryId),
    categoryName: category?.name || '',
    quota: Number(form.quota),
    joined: Number(form.joined),
    tags: tagsText.value.split(',').map(item => item.trim()).filter(Boolean),
    highlights: highlightsText.value.split('\n').map(item => item.trim()).filter(Boolean),
    checkinCode: form.checkinCode || `ACT${Date.now().toString().slice(-6)}`
  }
}

const submit = async () => {
  await formRef.value.validate()
  submitting.value = true
  try {
    const payload = buildPayload()
    if (isEdit.value) {
      await store.dispatch('activity/updateActivity', {
        id: props.id,
        payload
      })
      ElMessage.success('活动已更新')
    } else {
      await store.dispatch('activity/createActivity', payload)
      ElMessage.success('活动已发布')
    }
    router.push('/admin/activities')
  } finally {
    submitting.value = false
  }
}

onMounted(async () => {
  if (!categories.value.length) {
    await store.dispatch('activity/fetchCategories')
  }
  if (isEdit.value) {
    const data = await store.dispatch('activity/fetchActivity', props.id)
    fillForm(data)
  }
})
</script>

<style scoped>
.form-card {
  border-radius: 8px;
}

.cover-preview {
  margin: 0 0 18px;
}

.cover-preview img {
  width: 100%;
  max-height: 260px;
  object-fit: cover;
  border-radius: 8px;
}
</style>

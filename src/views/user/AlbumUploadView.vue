<template>
  <div>
    <div class="page-heading">
      <div>
        <h1>上传活动照片</h1>
        <p>
          使用 Element Plus Upload 选择图片，提交后写入 json-server 相册数据。
        </p>
      </div>
      <el-button @click="$router.push(`/albums/${activityId}`)"
        >返回相册</el-button
      >
    </div>

    <el-card shadow="never" class="upload-card">
      <el-form label-position="top" :model="form">
        <el-form-item label="照片标题">
          <el-input
            v-model="form.title"
            maxlength="30"
            show-word-limit
            placeholder="例如：活动现场合影"
          />
        </el-form-item>
        <el-form-item label="选择照片">
          <el-upload
            class="photo-upload"
            drag
            accept="image/*"
            :limit="1"
            :auto-upload="false"
            :file-list="fileList"
            :on-change="handleChange"
            :on-remove="handleRemove"
          >
            <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
            <div class="el-upload__text">
              拖拽图片到这里，或 <em>点击选择</em>
            </div>
            <template #tip>
              <div class="el-upload__tip">
                演示环境会把图片转成 Base64 并保存到 db.json。
              </div>
            </template>
          </el-upload>
        </el-form-item>
        <div v-if="previewUrl" class="preview-box">
          <img :src="previewUrl" alt="上传预览" />
        </div>
        <el-alert
          title="上传仅用于课程演示，不做真实文件服务器存储。"
          type="info"
          show-icon
          :closable="false"
        />
        <el-button
          class="submit-button"
          type="primary"
          size="large"
          :loading="submitting"
          @click="submit"
        >
          提交到活动相册
        </el-button>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { ElMessage } from "element-plus";

const props = defineProps({
  activityId: {
    type: String,
    required: true,
  },
});

const store = useStore();
const router = useRouter();
const fileList = ref([]);
const previewUrl = ref("");
const submitting = ref(false);
const form = reactive({
  title: "",
});

const handleChange = (file) => {
  fileList.value = [file];
  const reader = new FileReader();
  reader.onload = (event) => {
    previewUrl.value = event.target.result;
  };
  reader.readAsDataURL(file.raw);
};

const handleRemove = () => {
  fileList.value = [];
  previewUrl.value = "";
};

const submit = async () => {
  if (!form.title.trim()) {
    ElMessage.warning("请填写照片标题");
    return;
  }
  if (!previewUrl.value) {
    ElMessage.warning("请选择要上传的图片");
    return;
  }
  submitting.value = true;
  try {
    await store.dispatch("album/uploadPhoto", {
      activityId: Number(props.activityId),
      userId: store.state.user.currentUser.id,
      title: form.title.trim(),
      url: previewUrl.value,
    });
    ElMessage.success("照片已上传");
    router.push(`/albums/${props.activityId}`);
  } finally {
    submitting.value = false;
  }
};
</script>

<style scoped>
.upload-card {
  max-width: 760px;
  border-radius: 8px;
}

.photo-upload {
  width: 100%;
}

.preview-box {
  margin: 18px 0;
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #f8fafc;
}

.preview-box img {
  width: 100%;
  max-height: 360px;
  object-fit: contain;
  display: block;
}

.submit-button {
  margin-top: 18px;
}
</style>

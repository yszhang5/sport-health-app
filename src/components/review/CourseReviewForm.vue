<template>
  <div class="course-review-form">
    <h3>发表评价</h3>
    <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
      <el-form-item label="评分" prop="rating">
        <el-rate v-model="form.rating" :max="5" />
      </el-form-item>
      <el-form-item label="评价内容" prop="content">
        <el-input
          v-model="form.content"
          type="textarea"
          :rows="4"
          placeholder="请输入评价内容（可选）"
          maxlength="500"
          show-word-limit
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSubmit" :loading="submitting">
          提交评价
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { createCourseReviewApi, type CourseReviewCreateParams } from '@/api/review'

interface Props {
  courseId: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  submitted: []
}>()

const formRef = ref<FormInstance>()
const submitting = ref(false)

const form = ref<CourseReviewCreateParams>({
  rating: 5,
  content: ''
})

const rules: FormRules = {
  rating: [
    { required: true, message: '请选择评分', trigger: 'change' }
  ]
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    
    submitting.value = true
    try {
      const res = await createCourseReviewApi(props.courseId, form.value)
      if (res.code === 200) {
        ElMessage.success('评价提交成功')
        form.value = { rating: 5, content: '' }
        emit('submitted')
      }
    } catch (error: any) {
      ElMessage.error(error.message || '提交评价失败')
    } finally {
      submitting.value = false
    }
  })
}
</script>

<style scoped lang="scss">
.course-review-form {
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  margin-bottom: 20px;

  h3 {
    margin: 0 0 20px 0;
    font-size: 18px;
    font-weight: 600;
  }
}
</style>

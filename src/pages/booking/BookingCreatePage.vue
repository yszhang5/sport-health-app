<template>
  <div class="booking-create-page">
    <h2>创建预约</h2>
    <el-card v-loading="loading">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="120px">
        <el-form-item label="选择场馆" prop="venueId">
          <el-select 
            v-model="form.venueId" 
            placeholder="请选择场馆"
            style="width: 100%"
            @change="handleVenueChange"
          >
            <el-option
              v-for="venue in venues"
              :key="venue.venueId"
              :label="venue.name"
              :value="venue.venueId"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="选择课程" prop="courseId" v-if="form.venueId">
          <el-select 
            v-model="form.courseId" 
            placeholder="请选择课程（可选）"
            style="width: 100%"
            clearable
          >
            <el-option
              v-for="course in courses"
              :key="course.courseId"
              :label="course.title"
              :value="course.courseId"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="预约时间" prop="bookingTime">
          <el-date-picker
            v-model="form.bookingTime"
            type="datetime"
            placeholder="选择预约时间"
            style="width: 100%"
            :disabled-date="disabledDate"
            :disabled-time="disabledTime"
            format="YYYY-MM-DD HH:mm"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSubmit" :loading="submitting">
            提交预约
          </el-button>
          <el-button @click="handleCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { createBookingApi, type BookingCreateParams } from '@/api/booking'
import { getVenueListApi } from '@/api/venue'
import { getCourseListApi } from '@/api/course'
import type { VenueVO } from '@/api/model/venueModel'
import type { CourseVO } from '@/api/model/courseModel'

const router = useRouter()
const route = useRoute()
const formRef = ref<FormInstance>()
const loading = ref(false)
const submitting = ref(false)
const venues = ref<VenueVO[]>([])
const courses = ref<CourseVO[]>([])

const form = ref<BookingCreateParams>({
  venueId: route.query.venueId ? Number(route.query.venueId) : 0,
  courseId: route.query.courseId ? Number(route.query.courseId) : undefined,
  bookingTime: ''
})

const rules: FormRules = {
  venueId: [
    { required: true, message: '请选择场馆', trigger: 'change' }
  ],
  bookingTime: [
    { required: true, message: '请选择预约时间', trigger: 'change' }
  ]
}

const disabledDate = (time: Date) => {
  return time.getTime() < Date.now() - 86400000 // 不能选择今天之前的日期
}

const disabledTime = (date: Date) => {
  const now = new Date()
  if (date.toDateString() === now.toDateString()) {
    // 如果是今天，禁用过去的时间
    return {
      disabledHours: () => {
        const hours = []
        for (let i = 0; i < now.getHours(); i++) {
          hours.push(i)
        }
        return hours
      },
      disabledMinutes: (hour: number) => {
        if (hour === now.getHours()) {
          const minutes = []
          for (let i = 0; i <= now.getMinutes(); i++) {
            minutes.push(i)
          }
          return minutes
        }
        return []
      }
    }
  }
  return {}
}

const loadVenues = async () => {
  try {
    const res = await getVenueListApi()
    if (res.code === 200) {
      venues.value = res.data || []
    }
  } catch (error: any) {
    ElMessage.error(error.message || '加载场馆列表失败')
  }
}

const handleVenueChange = async (venueId: number) => {
  if (!venueId) {
    courses.value = []
    return
  }
  
  loading.value = true
  try {
    const res = await getCourseListApi({ venueId })
    if (res.code === 200) {
      courses.value = res.data || []
    }
  } catch (error: any) {
    ElMessage.error(error.message || '加载课程列表失败')
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    
    submitting.value = true
    try {
      const res = await createBookingApi(form.value)
      if (res.code === 200) {
        ElMessage.success('预约成功')
        router.push('/bookings')
      }
    } catch (error: any) {
      ElMessage.error(error.message || '创建预约失败')
    } finally {
      submitting.value = false
    }
  })
}

const handleCancel = () => {
  router.back()
}

onMounted(async () => {
  await loadVenues()
  // 如果从查询参数中传入了 venueId，自动加载课程
  if (form.value.venueId) {
    await handleVenueChange(form.value.venueId)
  }
})
</script>

<style scoped lang="scss">
.booking-create-page {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;

  h2 {
    margin-bottom: 20px;
    font-size: 24px;
    font-weight: 600;
  }
}
</style>

<template>
  <div class="course-detail-page">
    <h2>课程详情</h2>

    <div v-loading="loading">
      <el-card v-if="course" class="course-card">
        <img :src="course.coverImage" :alt="course.title" class="cover" />
        
        <div class="info">
          <h1 class="title">{{ course.title }}</h1>
          
          <div class="meta-info">
            <el-tag type="primary" style="margin-right: 8px;">{{ course.typeName }}</el-tag>
            <el-tag type="warning" style="margin-right: 8px;">{{ course.difficultyName }}</el-tag>
            <span style="color: #999; font-size: 14px;">{{ course.duration }}分钟</span>
          </div>

          <div class="stats">
            <div class="stat-item">
              <el-icon><User /></el-icon>
              <span>{{ formatNumber(course.studentCount) }}人学习</span>
            </div>
            <div class="stat-item">
              <el-icon><Star /></el-icon>
              <span>{{ course.rating ? course.rating.toFixed(1) : '0.0' }}</span>
            </div>
            <div class="stat-item">
              <el-icon><Clock /></el-icon>
              <span>{{ course.duration }}分钟</span>
            </div>
            <div class="stat-item">
              <el-icon><Lightning /></el-icon>
              <span>预估消耗 {{ course.caloriesBurn || 0 }}大卡</span>
            </div>
          </div>

          <div class="action-section">
            <el-button 
              type="primary" 
              size="large" 
              @click="handleEnroll" 
              :loading="enrolling"
              style="width: 100%"
            >
              立即学习
            </el-button>
          </div>
        </div>
      </el-card>

      <el-empty v-else-if="!loading" description="课程不存在" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Star, Clock, Lightning } from '@element-plus/icons-vue'
import { getCourseDetailApi } from '@/api/course'
import { addCourseToUserApi } from '@/api/user'
import { useUserStore } from '@/stores/user'
import type { CourseDetailVO } from '@/api/model/courseModel'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const loading = ref(true)
const course = ref<CourseDetailVO | null>(null)
const enrolling = ref(false)

const formatNumber = (num: number | undefined | null) => {
  if (num === undefined || num === null || isNaN(num)) {
    return '0'
  }
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w'
  }
  return num.toString()
}

const loadCourseDetail = async () => {
  try {
    loading.value = true
    const courseId = Number(route.params.courseId)
    const res = await getCourseDetailApi(courseId)
    if (res.code === 200) {
      course.value = res.data
    } else {
      ElMessage.error('加载课程详情失败')
    }
  } catch (error) {
    console.error('Load course detail failed:', error)
    ElMessage.error('加载课程详情失败')
  } finally {
    loading.value = false
  }
}

const handleEnroll = async () => {
  if (!course.value) return
  
  try {
    enrolling.value = true
    const res = await addCourseToUserApi(course.value.courseId)
    if (res.code === 200) {
      ElMessage.success('已添加到我的课程')
      // 更新用户信息，刷新 userCourse 列表
      await userStore.getProfile()
    } else {
      ElMessage.error('添加失败：' + res.message)
    }
  } catch (error: any) {
    console.error('Add course to user failed:', error)
    ElMessage.error(error.message || '添加失败，请重试')
  } finally {
    enrolling.value = false
  }
}

onMounted(() => {
  loadCourseDetail()
})
</script>

<style scoped lang="scss">
.course-detail-page {
  padding: 20px;

  h2 {
    margin-bottom: 20px;
    color: #333;
  }

  .course-card {
    .cover {
      width: 100%;
      height: 300px;
      object-fit: cover;
      border-radius: 4px 4px 0 0;
      margin-bottom: 20px;
    }

    .info {
      .title {
        font-size: 24px;
        font-weight: 600;
        color: #333;
        margin: 0 0 16px 0;
      }

      .meta-info {
        margin-bottom: 16px;
      }

      .stats {
        display: flex;
        gap: 24px;
        margin-bottom: 20px;
        padding: 16px;
        background: #f5f7fa;
        border-radius: 8px;

        .stat-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          color: #666;

          :deep(.el-icon) {
            font-size: 16px;
            color: #409eff;
          }
        }
      }


      .action-section {
        margin-top: 20px;
      }
    }
  }
}
</style>

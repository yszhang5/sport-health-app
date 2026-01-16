<template>
  <div class="popular-section">
    <h3 class="section-title">热门课程</h3>
    <div v-loading="loading" class="courses-grid">
      <CourseCard
        v-for="course in courses"
        :key="course.courseId"
        :course="course"
        @click="handleCourseClick(course.courseId)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getPopularCoursesApi } from '@/api/course'
import type { CourseVO } from '@/api/model/courseModel'
import CourseCard from './CourseCard.vue'

const router = useRouter()
const loading = ref(false)
const courses = ref<CourseVO[]>([])

const loadCourses = async () => {
  loading.value = true
  try {
    const res = await getPopularCoursesApi(10)
    if (res.code === 200) {
      courses.value = res.data || []
    }
  } catch (error: any) {
    ElMessage.error(error.message || '加载热门课程失败')
  } finally {
    loading.value = false
  }
}

const handleCourseClick = (courseId: number) => {
  router.push(`/courses/${courseId}`)
}

onMounted(() => {
  loadCourses()
})
</script>

<style scoped lang="scss">
.popular-section {
  margin-bottom: 40px;

  .section-title {
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 20px;
    color: #333;
  }

  .courses-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
  }
}
</style>

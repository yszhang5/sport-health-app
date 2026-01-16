<template>
  <div class="discovery-page">
    <h2>运动社区</h2>
    
    <div class="content">
      <!-- 热门课程 -->
      <PopularSection />
      
      <!-- 推荐课程 -->
      <RecommendedSection />
      
      <el-card class="section-card">
        <template #header>
          <div class="card-header">
            <span>精选课程</span>
            <el-button link @click="goToCourses">更多</el-button>
          </div>
        </template>
        <div v-loading="coursesLoading">
          <div v-if="courses.length > 0" class="courses-grid">
            <div
              v-for="course in courses"
              :key="course.courseId"
              class="course-item"
              @click="goToCourseDetail(course.courseId)"
            >
              <img :src="course.coverImage" :alt="course.title" class="course-cover" />
              <div class="course-info">
                <h4>{{ course.title }}</h4>
                <div class="course-meta">
                  <span>{{ course.typeName }}</span>
                  <span>{{ course.duration }}分钟</span>
                </div>
              </div>
            </div>
          </div>
          <el-empty v-else description="暂无课程" />
        </div>
      </el-card>

      <el-card class="section-card">
        <template #header>
          <div class="card-header">
            <span>我的课程</span>
          </div>
        </template>
        <div v-loading="myCoursesLoading">
          <div v-if="myCourses.length > 0" class="courses-grid">
            <div
              v-for="course in myCourses"
              :key="course.courseId"
              class="course-item"
              @click="goToCourseDetail(course.courseId)"
            >
              <img :src="course.coverImage" :alt="course.title" class="course-cover" />
              <div class="course-info">
                <h4>{{ course.title }}</h4>
                <div class="course-meta">
                  <span>{{ course.typeName }}</span>
                  <span>{{ course.duration }}分钟</span>
                </div>
              </div>
            </div>
          </div>
          <el-empty v-else description="还没有学习的课程，快去添加吧！" />
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { getCourseListApi, getCourseDetailApi } from '@/api/course'
import { useUserStore } from '@/stores/user'
import type { CourseVO, CourseDetailVO } from '@/api/model/courseModel'
import type { Result } from '@/utils/request'
import PopularSection from '@/components/discovery/PopularSection.vue'
import RecommendedSection from '@/components/discovery/RecommendedSection.vue'

const router = useRouter()
const userStore = useUserStore()

const courses = ref<CourseVO[]>([])
const coursesLoading = ref(false)
const myCourses = ref<CourseVO[]>([])
const myCoursesLoading = ref(false)

const loadCourses = async () => {
  coursesLoading.value = true
  try {
    const res = await getCourseListApi()
    if (res.code === 200) {
      courses.value = res.data.slice(0, 6)
    }
  } catch (error) {
    console.error('Load courses failed:', error)
  } finally {
    coursesLoading.value = false
  }
}

const goToCourses = () => {
  router.push('/courses')
}

const goToCourseDetail = (courseId: number) => {
  router.push(`/courses/${courseId}`)
}

const loadMyCourses = async () => {
  if (!userStore.userInfo?.userCourse || userStore.userInfo.userCourse.length === 0) {
    myCourses.value = []
    return
  }

  myCoursesLoading.value = true
  try {
    // 根据课程ID列表获取课程详情
    const coursePromises = userStore.userInfo.userCourse.map(courseId => 
      getCourseDetailApi(courseId).catch(err => {
        console.error(`Failed to load course ${courseId}:`, err)
        return null
      })
    )
    
    const courseResults = await Promise.all(coursePromises)
    myCourses.value = courseResults
      .filter((res): res is Result<CourseDetailVO> => 
        res !== null && res.code === 200 && res.data !== undefined
      )
      .map(res => res.data as CourseVO) // CourseDetailVO extends CourseVO, so it's compatible
  } catch (error) {
    console.error('Load my courses failed:', error)
  } finally {
    myCoursesLoading.value = false
  }
}

// 监听用户信息变化，更新我的课程列表
watch(() => userStore.userInfo?.userCourse, () => {
  loadMyCourses()
}, { deep: true })

onMounted(async () => {
  await loadCourses()
  // 确保用户信息已加载
  if (!userStore.userInfo) {
    await userStore.getProfile()
  }
  await loadMyCourses()
})
</script>

<style scoped lang="scss">
.discovery-page {
  padding: 20px;

  h2 {
    margin-bottom: 20px;
    color: #333;
  }

  .content {
    .section-card {
      margin-bottom: 20px;

      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .courses-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 15px;

        .course-item {
          cursor: pointer;
          transition: all 0.3s ease;

          &:hover {
            transform: translateY(-4px);
          }

          .course-cover {
            width: 100%;
            height: 120px;
            object-fit: cover;
            border-radius: 8px;
            margin-bottom: 8px;
          }

          .course-info {
            h4 {
              margin: 0 0 4px 0;
              font-size: 14px;
              font-weight: 600;
              color: #333;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }

            .course-meta {
              display: flex;
              gap: 8px;
              font-size: 12px;
              color: #999;
            }
          }
        }
      }
    }
  }
}
</style>

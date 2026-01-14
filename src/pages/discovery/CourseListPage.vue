<template>
  <div class="course-list-page">
    <h2>全部课程</h2>

    <!-- 筛选栏 -->
    <div class="filter-bar">
      <el-select v-model="filterType" placeholder="全部类型" style="width: 140px; margin-right: 10px;" @change="handleFilterChange">
        <el-option label="全部类型" :value="null" />
        <el-option label="线上视频" :value="1" />
        <el-option label="线下预约" :value="2" />
      </el-select>
      <el-select v-model="filterDifficulty" placeholder="全部难度" style="width: 120px; margin-right: 10px;" @change="handleFilterChange">
        <el-option label="全部难度" :value="null" />
        <el-option label="入门" :value="1" />
        <el-option label="进阶" :value="2" />
        <el-option label="专业" :value="3" />
      </el-select>
    </div>

    <!-- 课程列表 -->
    <div v-loading="loading" class="course-list">
      <el-card
        v-for="course in courseList"
        :key="course.courseId"
        class="course-card"
        @click="toCourseDetail(course.courseId)"
      >
        <img :src="course.coverImage" :alt="course.title" class="cover" />
        <div class="info">
          <div class="header">
            <h4 class="title">{{ course.title }}</h4>
          </div>

          <div class="meta">
            <span>{{ course.typeName }}</span>
            <span>{{ course.difficultyName }}</span>
            <span>{{ course.duration }}分钟</span>
          </div>

          <div class="footer">
            <div class="stats">
              <span class="stat">
                <el-icon><User /></el-icon>
                {{ formatNumber(course.studentCount) }}
              </span>
              <span class="stat">
                <el-icon><Star /></el-icon>
                {{ course.rating ? course.rating.toFixed(1) : '0.0' }}
              </span>
            </div>
          </div>
        </div>
      </el-card>

      <el-empty v-if="!loading && courseList.length === 0" description="暂无课程" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { User, Star } from '@element-plus/icons-vue'
import { getCourseListApi } from '@/api/course'
import type { CourseVO } from '@/api/model/courseModel'

const router = useRouter()

const courseList = ref<CourseVO[]>([])
const loading = ref(false)
const filterType = ref<number | null>(null) // null 表示全部类型
const filterDifficulty = ref<number | null>(null) // null 表示全部难度

const formatNumber = (num: number | undefined | null) => {
  if (num === undefined || num === null || isNaN(num)) {
    return '0'
  }
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w'
  }
  return num.toString()
}

const loadCourses = async () => {
  loading.value = true
  try {
    const params: { type?: number; difficulty?: number } = {}
    if (filterType.value !== null) {
      params.type = filterType.value
    }
    if (filterDifficulty.value !== null) {
      params.difficulty = filterDifficulty.value
    }
    
    const res = await getCourseListApi(params)
    if (res.code === 200) {
      courseList.value = res.data
    }
  } catch (error) {
    console.error('Load courses failed:', error)
  } finally {
    loading.value = false
  }
}

const handleFilterChange = () => {
  // 筛选条件改变时重新加载课程列表
  loadCourses()
}

const toCourseDetail = (courseId: number) => {
  router.push(`/courses/${courseId}`)
}

onMounted(() => {
  loadCourses()
})
</script>

<style scoped lang="scss">
.course-list-page {
  padding: 20px;

  h2 {
    margin-bottom: 20px;
    color: #333;
  }

  .filter-bar {
    margin-bottom: 20px;
  }

  .course-list {
    .course-card {
      margin-bottom: 20px;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
      }

      .cover {
        width: 100%;
        height: 180px;
        object-fit: cover;
        border-radius: 4px 4px 0 0;
      }

      .info {
        padding: 16px;

        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 8px;

          .title {
            flex: 1;
            font-size: 16px;
            font-weight: 600;
            color: #333;
            margin: 0;
          }
        }

        .meta {
          display: flex;
          gap: 8px;
          margin-bottom: 12px;
          font-size: 12px;
          color: #999;
        }

        .footer {
          .stats {
            display: flex;
            gap: 16px;
            font-size: 12px;
            color: #999;

            .stat {
              display: flex;
              align-items: center;
              gap: 4px;
            }
          }
        }
      }
    }
  }
}
</style>

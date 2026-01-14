<template>
  <div class="home-container">
    <h2>数据看板</h2>

    <!-- 用户信息横幅 -->
    <div class="user-banner" v-if="userStore.userInfo">
      <div class="user-info">
        <el-avatar :size="60" :src="userStore.userInfo.avatarUrl" />
        <div class="user-details">
          <h3>你好，{{ userStore.userInfo.nickname }}！</h3>
          <p>今日已消耗 {{ todayCalories }} 大卡</p>
        </div>
      </div>
      <div class="stats-overview">
        <div class="stat-item">
          <div class="stat-value">{{ stats.totalWorkouts }}</div>
          <div class="stat-label">总运动</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ stats.currentStreak }}</div>
          <div class="stat-label">连续打卡</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ stats.totalDuration }}min</div>
          <div class="stat-label">总时长</div>
        </div>
      </div>
    </div>

    <!-- 快捷操作 -->
    <div class="quick-actions">
      <el-row :gutter="12">
        <el-col :span="6">
          <div class="action-card" @click="goToSportRecord">
            <div class="action-icon start-sport">
              <el-icon size="24"><VideoCamera /></el-icon>
            </div>
            <span>开始运动</span>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="action-card" @click="goToVenues">
            <div class="action-icon venue">
              <el-icon size="24"><Location /></el-icon>
            </div>
            <span>附近场馆</span>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="action-card" @click="goToCourses">
            <div class="action-icon course">
              <el-icon size="24"><Collection /></el-icon>
            </div>
            <span>精选课程</span>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="action-card" @click="goToRank">
            <div class="action-icon rank">
              <el-icon size="24"><Trophy /></el-icon>
            </div>
            <span>排行榜</span>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 内容区域 -->
    <div class="content-sections">
      <!-- 今日推荐 -->
      <el-card class="section-card">
        <template #header>
          <div class="card-header">
            <span>今日推荐课程</span>
            <el-button link @click="goToCourses">更多</el-button>
          </div>
        </template>
        <div v-loading="coursesLoading">
          <div v-if="recommendCourses.length > 0" class="courses-grid">
            <CourseCard
                v-for="course in recommendCourses"
                :key="course.courseId"
                :course="course"
                @click="goToCourseDetail(course.courseId)"
            />
          </div>
          <el-empty v-else description="暂无推荐课程" :image-size="80" />
        </div>
      </el-card>

      <!-- 最近运动 -->
      <el-card class="section-card">
        <template #header>
          <div class="card-header">
            <span>最近运动记录</span>
            <el-button link @click="goToHistory">查看全部</el-button>
          </div>
        </template>
        <div v-loading="recordsLoading">
          <div v-if="recentRecords.length > 0">
            <SportRecordCard
                v-for="record in recentRecords"
                :key="record.recordId"
                :record="record"
                class="record-item"
            />
          </div>
          <el-empty v-else description="暂无运动记录" :image-size="80">
            <el-button type="primary" @click="goToSportRecord">开始运动</el-button>
          </el-empty>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { VideoCamera, Location, Collection, Trophy } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import CourseCard from '@/components/discovery/CourseCard.vue'
import SportRecordCard from '@/components/sport/SportRecordCard.vue'
import { getCourseListApi } from '@/api/course'
import { getSportHistoryApi } from '@/api/sport'
import type { CourseVO } from '@/api/model/courseModel'
import type { SportRecordVO } from '@/api/model/sportModel'

const router = useRouter()
const userStore = useUserStore()

// 响应式数据
const recommendCourses = ref<CourseVO[]>([])
const recentRecords = ref<SportRecordVO[]>([])
const coursesLoading = ref(false)
const recordsLoading = ref(false)

const stats = reactive({
  totalWorkouts: 0,
  currentStreak: 0,
  totalDuration: 0
})

// 计算属性
const todayCalories = computed(() => {
  const today = new Date().toDateString()
  return recentRecords.value
      .filter(record => new Date(record.startTime).toDateString() === today)
      .reduce((sum, record) => sum + record.calories, 0)
})

// 导航方法
const goToSportRecord = () => router.push('/sport/record')
const goToVenues = () => router.push('/venues')
const goToCourses = () => router.push('/courses')
const goToRank = () => router.push('/sport/rank')
const goToHistory = () => router.push('/sport/history')
const goToCourseDetail = (courseId: number) => router.push(`/courses/${courseId}`)

// 加载数据方法
const loadRecommendCourses = async () => {
  coursesLoading.value = true
  try {
    const res = await getCourseListApi({ type: 1 }) // 线上课程
    if (res.code === 200) {
      recommendCourses.value = res.data.slice(0, 3)
    }
  } catch (error) {
    console.error('Load courses failed:', error)
  } finally {
    coursesLoading.value = false
  }
}

const loadRecentRecords = async () => {
  recordsLoading.value = true
  try {
    const res = await getSportHistoryApi()
    if (res.code === 200) {
      recentRecords.value = res.data.slice(0, 5)
      updateStats(res.data)
    }
  } catch (error) {
    console.error('Load records failed:', error)
  } finally {
    recordsLoading.value = false
  }
}

const updateStats = (records: SportRecordVO[]) => {
  stats.totalWorkouts = records.length
  stats.totalDuration = Math.round(records.reduce((sum, record) => sum + record.duration, 0) / 60)

  // 计算连续打卡天数（简化版）
  const today = new Date()
  let streak = 0
  for (let i = 0; i < 30; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    if (records.some(record => new Date(record.startTime).toDateString() === date.toDateString())) {
      streak++
    } else {
      break
    }
  }
  stats.currentStreak = streak
}

// 生命周期
onMounted(() => {
  loadRecommendCourses()
  loadRecentRecords()

  // 确保用户信息已加载
  if (!userStore.userInfo) {
    userStore.getProfile()
  }
})
</script>

<style scoped lang="scss">
.home-container {
  padding: 20px;
  max-width: 100%;
  width: 100%;
  box-sizing: border-box;

  h2 {
    margin-bottom: 20px;
    color: #333;
  }

  .user-banner {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 20px;
    width: 100%;
    box-sizing: border-box;

    .user-info {
      display: flex;
      align-items: center;
      margin-bottom: 15px;

      .user-details {
        margin-left: 15px;

        h3 {
          margin: 0 0 5px 0;
          font-size: 18px;
        }

        p {
          margin: 0;
          opacity: 0.9;
          font-size: 14px;
        }
      }
    }

    .stats-overview {
      display: flex;
      justify-content: space-around;

      .stat-item {
        text-align: center;

        .stat-value {
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 5px;
        }

        .stat-label {
          font-size: 12px;
          opacity: 0.8;
        }
      }
    }
  }

  .quick-actions {
    padding: 15px;
    background: white;
    width: 100%;
    box-sizing: border-box;

    .action-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 12px 0;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        background-color: #f5f7fa;
        transform: translateY(-2px);
      }

      .action-icon {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 8px;

        &.start-sport {
          background: linear-gradient(135deg, #ff6b6b, #ee5a52);
          color: white;
        }

        &.venue {
          background: linear-gradient(135deg, #4ecdc4, #44a08d);
          color: white;
        }

        &.course {
          background: linear-gradient(135deg, #fdbb2d, #b21f1f);
          color: white;
        }

        &.rank {
          background: linear-gradient(135deg, #8e2de2, #4a00e0);
          color: white;
        }
      }

      span {
        font-size: 12px;
        color: #666;
      }
    }
  }

  .content-sections {
    padding: 15px;
    max-width: 100%;

    .section-card {
      margin-bottom: 15px;
      width: 100%;

      :deep(.el-card__header) {
        padding: 12px 20px;
      }

      :deep(.el-card__body) {
        padding: 20px;
      }

      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;

        span {
          font-weight: 600;
          color: #333;
        }
      }

      .courses-grid {
        display: grid;
        gap: 15px;
      }

      .record-item {
        margin-bottom: 12px;

        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .home-container {
    .content-sections {
      padding: 10px;

      .courses-grid {
        grid-template-columns: 1fr;
      }
    }
  }
}
</style>
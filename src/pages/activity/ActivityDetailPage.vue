<template>
  <div class="activity-detail-page">
    <h2>活动详情</h2>
    <div v-loading="loading" v-if="activity">
      <el-card class="activity-card">
        <img :src="activity.coverImage" :alt="activity.title" class="cover-image" />
        <div class="activity-info">
          <h1 class="title">{{ activity.title }}</h1>
          <div class="meta">
            <el-tag>{{ activity.typeName }}</el-tag>
            <el-tag :type="getStatusType(activity.status)">
              {{ getStatusText(activity.status) }}
            </el-tag>
            <span class="participants">{{ activity.participantCount }}人参与</span>
          </div>
          <div class="time-range">
            <el-icon><Calendar /></el-icon>
            <span>{{ formatTime(activity.startTime) }} - {{ formatTime(activity.endTime) }}</span>
          </div>
          <div class="reward">
            <el-icon><Star /></el-icon>
            <span>奖励积分：{{ activity.rewardPoints }}</span>
          </div>
          <div class="description">{{ activity.description }}</div>
        </div>
      </el-card>

      <el-card class="progress-card" style="margin-top: 20px;" v-if="activity.userProgress !== undefined">
        <h3>我的进度</h3>
        <div class="progress-info">
          <el-progress :percentage="activity.userProgress" />
          <div class="progress-text">完成度：{{ activity.userProgress }}%</div>
        </div>
        <div v-if="activity.type === 'checkin'" class="checkin-actions" style="margin-top: 16px;">
          <el-button 
            type="primary" 
            @click="handleCheckin"
            :loading="updating"
          >
            今日打卡
          </el-button>
        </div>
      </el-card>

      <div class="actions" style="margin-top: 20px;">
        <el-button 
          v-if="!activity.isJoined"
          type="primary" 
          size="large" 
          @click="handleJoin"
          :loading="joining"
          style="width: 100%"
        >
          立即报名
        </el-button>
        <el-button 
          v-else
          type="info" 
          size="large" 
          disabled
          style="width: 100%"
        >
          已报名
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Calendar, Star } from '@element-plus/icons-vue'
import { getActivityDetailApi, joinActivityApi, updateActivityProgressApi, type ActivityDetailVO } from '@/api/activity'

const route = useRoute()
const loading = ref(false)
const joining = ref(false)
const updating = ref(false)
const activity = ref<ActivityDetailVO | null>(null)

const loadActivity = async () => {
  const activityId = Number(route.params.activityId)
  if (!activityId) {
    ElMessage.error('活动ID无效')
    return
  }

  loading.value = true
  try {
    const res = await getActivityDetailApi(activityId)
    if (res.code === 200) {
      activity.value = res.data
    }
  } catch (error: any) {
    ElMessage.error(error.message || '加载活动详情失败')
  } finally {
    loading.value = false
  }
}

const handleJoin = async () => {
  if (!activity.value) return

  joining.value = true
  try {
    const res = await joinActivityApi(activity.value.activityId)
    if (res.code === 200) {
      ElMessage.success('报名成功')
      loadActivity()
    }
  } catch (error: any) {
    ElMessage.error(error.message || '报名失败')
  } finally {
    joining.value = false
  }
}

const handleCheckin = async () => {
  if (!activity.value) return

  updating.value = true
  try {
    const currentProgress = activity.value.userProgress || 0
    const newProgress = Math.min(currentProgress + 10, 100)
    
    const res = await updateActivityProgressApi(activity.value.activityId, {
      progress: newProgress
    })
    if (res.code === 200) {
      ElMessage.success('打卡成功')
      loadActivity()
    }
  } catch (error: any) {
    ElMessage.error(error.message || '打卡失败')
  } finally {
    updating.value = false
  }
}

const getStatusText = (status: number) => {
  const statusMap: Record<number, string> = {
    0: '未开始',
    1: '进行中',
    2: '已结束'
  }
  return statusMap[status] || '未知'
}

const getStatusType = (status: number): '' | 'success' | 'warning' | 'danger' | 'info' => {
  const typeMap: Record<number, '' | 'success' | 'warning' | 'danger' | 'info'> = {
    0: 'info',
    1: 'success',
    2: 'warning'
  }
  return typeMap[status] || ''
}

const formatTime = (time: string) => {
  if (!time) return ''
  const date = new Date(time)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  loadActivity()
})
</script>

<style scoped lang="scss">
.activity-detail-page {
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;

  h2 {
    margin-bottom: 20px;
    font-size: 24px;
    font-weight: 600;
  }

  .activity-card {
    .cover-image {
      width: 100%;
      height: 400px;
      object-fit: cover;
      border-radius: 8px;
      margin-bottom: 20px;
    }

    .activity-info {
      .title {
        font-size: 24px;
        font-weight: 600;
        margin: 0 0 16px 0;
      }

      .meta {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 16px;

        .participants {
          color: #666;
          font-size: 14px;
        }
      }

      .time-range,
      .reward {
        display: flex;
        align-items: center;
        gap: 8px;
        color: #666;
        margin-bottom: 12px;
        font-size: 14px;
      }

      .description {
        color: #666;
        line-height: 1.6;
        margin-top: 16px;
      }
    }
  }

  .progress-card {
    h3 {
      margin: 0 0 16px 0;
      font-size: 18px;
      font-weight: 600;
    }

    .progress-info {
      .progress-text {
        margin-top: 8px;
        color: #666;
        font-size: 14px;
      }
    }
  }
}
</style>

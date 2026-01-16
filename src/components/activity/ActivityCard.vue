<template>
  <div class="activity-card" @click="$emit('click')">
    <div class="cover-wrapper">
      <img :src="activity.coverImage" :alt="activity.title" class="cover" />
      <div class="status-badge">
        <el-tag :type="getStatusType(activity.status)" size="small">
          {{ getStatusText(activity.status) }}
        </el-tag>
      </div>
      <div v-if="activity.isJoined" class="joined-badge">已报名</div>
    </div>
    <div class="content">
      <h4 class="title">{{ activity.title }}</h4>
      <div class="meta">
        <el-tag size="small">{{ activity.typeName }}</el-tag>
        <span class="time">{{ formatTime(activity.startTime) }}</span>
      </div>
      <div class="footer">
        <div class="reward">
          <el-icon><Star /></el-icon>
          {{ activity.rewardPoints }}积分
        </div>
        <div class="participants">
          <el-icon><User /></el-icon>
          {{ activity.participantCount }}人
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Star, User } from '@element-plus/icons-vue'
import type { ActivityVO } from '@/api/activity'

interface Props {
  activity: ActivityVO
}

defineProps<Props>()

defineEmits<{
  click: []
}>()

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
  return date.toLocaleDateString('zh-CN', {
    month: '2-digit',
    day: '2-digit'
  })
}
</script>

<style scoped lang="scss">
.activity-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }

  .cover-wrapper {
    position: relative;
    width: 100%;
    padding-top: 56.25%;
    overflow: hidden;
    background: #f5f7fa;

    .cover {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .status-badge {
      position: absolute;
      top: 8px;
      left: 8px;
    }

    .joined-badge {
      position: absolute;
      top: 8px;
      right: 8px;
      background: rgba(64, 158, 255, 0.9);
      color: #fff;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
    }
  }

  .content {
    padding: 12px;

    .title {
      font-size: 15px;
      font-weight: 600;
      color: #333;
      margin: 0 0 8px 0;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      line-height: 1.4;
      min-height: 42px;
    }

    .meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;

      .time {
        font-size: 12px;
        color: #999;
      }
    }

    .footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 8px;
      border-top: 1px solid #f0f0f0;

      .reward,
      .participants {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 12px;
        color: #666;

        :deep(.el-icon) {
          font-size: 14px;
        }
      }

      .reward {
        color: #F56C6C;
        font-weight: 600;
      }
    }
  }
}
</style>

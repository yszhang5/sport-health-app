<template>
  <div class="sport-record-card" @click="handleClick">
    <div class="card-header">
      <div class="sport-info">
        <div class="sport-icon" :style="{ backgroundColor: getSportColor(record.sportType) }">
          <el-icon :size="20">
            <component :is="getSportIcon(record.sportType)" />
          </el-icon>
        </div>
        <div class="sport-details">
          <h4 class="sport-name">{{ record.sportTypeName }}</h4>
          <span class="sport-time">{{ formatTime(record.startTime) }}</span>
        </div>
      </div>
      <div class="duration">
        {{ formatDuration(record.duration) }}
      </div>
    </div>
    
    <div class="card-body">
      <div class="stats-grid">
        <div class="stat-item" v-if="record.distance > 0">
          <el-icon><Location /></el-icon>
          <span class="stat-value">{{ record.distance.toFixed(2) }}</span>
          <span class="stat-label">公里</span>
        </div>
        <div class="stat-item" v-if="record.calories > 0">
          <el-icon><Lightning /></el-icon>
          <span class="stat-value">{{ record.calories }}</span>
          <span class="stat-label">大卡</span>
        </div>
        <div class="stat-item" v-if="record.steps">
          <el-icon><User /></el-icon>
          <span class="stat-value">{{ formatNumber(record.steps) }}</span>
          <span class="stat-label">步数</span>
        </div>
        <div class="stat-item" v-if="record.pace">
          <el-icon><Timer /></el-icon>
          <span class="stat-value">{{ formatPace(record.pace) }}</span>
          <span class="stat-label">配速</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Location, Lightning, User, Timer, VideoCamera, Promotion, Trophy, Star, Medal, Clock } from '@element-plus/icons-vue'
import type { SportRecordVO } from '@/api/model/sportModel'
import { SportType } from '@/api/model/sportModel'

interface Props {
  record: SportRecordVO
}

defineProps<Props>()

const emit = defineEmits<{
  click: []
}>()

const handleClick = () => {
  emit('click')
}

const getSportIcon = (sportType: number) => {
  const iconMap: Record<number, any> = {
    [SportType.RUNNING]: VideoCamera, // 跑步 - 使用 VideoCamera（录制运动）
    [SportType.WALKING]: User, // 健走 - 使用 User（人/步行）
    [SportType.CYCLING]: Promotion, // 骑行 - 使用 Promotion（移动/前进）
    [SportType.YOGA]: Star, // 瑜伽 - 使用 Star（平衡/柔和）
    [SportType.HIIT]: Medal, // HIIT - 使用 Medal（高强度/奖牌）
    [SportType.STRENGTH]: Lightning, // 力量训练 - 使用 Lightning（力量/能量）
    [SportType.SWIMMING]: Trophy, // 游泳 - 使用 Trophy（水上运动/成就）
    [SportType.BASKETBALL]: Location, // 篮球 - 使用 Location（场地/位置）
    [SportType.FOOTBALL]: Location, // 足球 - 使用 Location（场地/位置）
  }
  return iconMap[sportType] || Star
}

const getSportColor = (sportType: number) => {
  const colorMap: Record<number, string> = {
    [SportType.RUNNING]: '#ff6b6b',
    [SportType.WALKING]: '#4ecdc4',
    [SportType.CYCLING]: '#45b7d1',
    [SportType.YOGA]: '#96ceb4',
    [SportType.HIIT]: '#feca57',
    [SportType.STRENGTH]: '#ff9ff3',
    [SportType.SWIMMING]: '#54a0ff',
    [SportType.BASKETBALL]: '#5f27cd',
    [SportType.FOOTBALL]: '#00d2d3',
  }
  return colorMap[sportType] || '#95a5a6'
}

const formatTime = (timeStr: string) => {
  const date = new Date(timeStr)
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const recordDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  
  if (recordDate.getTime() === today.getTime()) {
    return `今天 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
  } else if (recordDate.getTime() === today.getTime() - 86400000) {
    return `昨天 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
  } else {
    return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
  }
}

const formatDuration = (seconds: number) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`
}

const formatNumber = (num: number) => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w'
  }
  return num.toString()
}

const formatPace = (pace: number) => {
  const minutes = Math.floor(pace)
  const seconds = Math.round((pace - minutes) * 60)
  return `${minutes}'${seconds.toString().padStart(2, '0')}`
}
</script>

<style scoped lang="scss">
.sport-record-card {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;

    .sport-info {
      display: flex;
      align-items: center;
      gap: 12px;
      flex: 1;

      .sport-icon {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;

        :deep(.el-icon) {
          color: white;
        }
      }

      .sport-details {
        flex: 1;

        .sport-name {
          margin: 0 0 4px 0;
          font-size: 16px;
          font-weight: 600;
          color: #333;
        }

        .sport-time {
          font-size: 12px;
          color: #999;
        }
      }
    }

    .duration {
      font-size: 14px;
      font-weight: 600;
      color: #409eff;
    }
  }

  .card-body {
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;

      .stat-item {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px;
        background: #f5f7fa;
        border-radius: 8px;

        :deep(.el-icon) {
          font-size: 18px;
          color: #409eff;
        }

        .stat-value {
          font-size: 16px;
          font-weight: 600;
          color: #333;
        }

        .stat-label {
          font-size: 12px;
          color: #999;
        }
      }
    }
  }
}
</style>


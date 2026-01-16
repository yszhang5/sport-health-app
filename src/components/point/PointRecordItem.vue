<template>
  <el-card class="point-record-item" shadow="hover">
    <div class="record-content">
      <div class="record-info">
        <div class="type-name">{{ record.typeName }}</div>
        <div class="description">{{ record.description }}</div>
        <div class="time">{{ formatTime(record.createdAt) }}</div>
      </div>
      <div class="points" :class="{ 'earned': record.points > 0, 'spent': record.points < 0 }">
        {{ record.points > 0 ? '+' : '' }}{{ record.points }}
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import type { PointRecordVO } from '@/api/point'

interface Props {
  record: PointRecordVO
}

defineProps<Props>()

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
</script>

<style scoped lang="scss">
.point-record-item {
  margin-bottom: 12px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateX(4px);
  }

  .record-content {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .record-info {
      flex: 1;

      .type-name {
        font-weight: 600;
        color: #333;
        margin-bottom: 4px;
      }

      .description {
        color: #666;
        font-size: 14px;
        margin-bottom: 4px;
      }

      .time {
        color: #999;
        font-size: 12px;
      }
    }

    .points {
      font-size: 20px;
      font-weight: 600;
      padding: 0 16px;

      &.earned {
        color: #67C23A;
      }

      &.spent {
        color: #F56C6C;
      }
    }
  }
}
</style>

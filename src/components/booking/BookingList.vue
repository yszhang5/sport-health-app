<template>
  <div class="booking-list">
    <div v-if="bookings.length === 0" class="empty">
      <el-empty description="暂无预约记录" />
    </div>
    <div v-else>
      <el-card 
        v-for="booking in bookings" 
        :key="booking.bookingId" 
        class="booking-card"
        shadow="hover"
      >
        <div class="booking-header">
          <div class="venue-info">
            <h3>{{ booking.venueName }}</h3>
            <p v-if="booking.courseTitle" class="course-name">{{ booking.courseTitle }}</p>
          </div>
          <el-tag :type="getStatusType(booking.status)">
            {{ getStatusText(booking.status) }}
          </el-tag>
        </div>
        
        <div class="booking-info">
          <div class="info-item">
            <el-icon><Clock /></el-icon>
            <span>预约时间：{{ formatDateTime(booking.bookingTime) }}</span>
          </div>
          <div class="info-item">
            <el-icon><Calendar /></el-icon>
            <span>创建时间：{{ formatDateTime(booking.createdAt) }}</span>
          </div>
        </div>

        <div class="booking-actions" v-if="booking.status !== 2 && booking.status !== 3">
          <el-button 
            type="danger" 
            size="small" 
            @click="$emit('cancel', booking.bookingId)"
            v-if="booking.status !== 3"
          >
            取消预约
          </el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Clock, Calendar } from '@element-plus/icons-vue'
import type { BookingVO } from '@/api/booking'

interface Props {
  bookings: BookingVO[]
}

defineProps<Props>()

defineEmits<{
  cancel: [bookingId: number]
}>()

const getStatusText = (status: number) => {
  const statusMap: Record<number, string> = {
    0: '待确认',
    1: '已确认',
    2: '已完成',
    3: '已取消'
  }
  return statusMap[status] || '未知'
}

const getStatusType = (status: number): '' | 'success' | 'warning' | 'danger' | 'info' => {
  const typeMap: Record<number, '' | 'success' | 'warning' | 'danger' | 'info'> = {
    0: 'warning',
    1: 'success',
    2: 'info',
    3: 'danger'
  }
  return typeMap[status] || ''
}

const formatDateTime = (dateTime: string) => {
  if (!dateTime) return ''
  const date = new Date(dateTime)
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
.booking-list {
  .empty {
    padding: 40px 0;
  }

  .booking-card {
    margin-bottom: 16px;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .booking-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 16px;

      .venue-info {
        flex: 1;

        h3 {
          margin: 0 0 8px 0;
          font-size: 18px;
          font-weight: 600;
          color: #333;
        }

        .course-name {
          margin: 0;
          color: #666;
          font-size: 14px;
        }
      }
    }

    .booking-info {
      margin-bottom: 16px;

      .info-item {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 8px;
        color: #666;
        font-size: 14px;

        &:last-child {
          margin-bottom: 0;
        }
      }
    }

    .booking-actions {
      display: flex;
      justify-content: flex-end;
      padding-top: 16px;
      border-top: 1px solid #f0f0f0;
    }
  }
}
</style>

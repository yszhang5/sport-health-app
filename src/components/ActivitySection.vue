<template>
  <div class="activity-section">
    <div class="section-header">
      <h3 class="title">热门活动</h3>
      <span class="more" @click="emit('view-more')">
        查看全部
        <van-icon name="arrow" />
      </span>
    </div>

    <van-skeleton v-if="loading" :row="2" :row-height="200" />
    <div v-else-if="activities.length > 0" class="activity-list">
      <div
          v-for="activity in activities"
          :key="activity.id"
          class="activity-card"
          @click="emit('activity-click', activity)"
      >
        <div class="card-header">
          <img :src="activity.cover" :alt="activity.title" class="cover" />
          <div class="badge" :class="activity.status">
            {{ getStatusText(activity.status) }}
          </div>
        </div>

        <div class="card-body">
          <div class="header">
            <h4 class="title">{{ activity.title }}</h4>
            <van-tag :type="getActivityTypeTag(activity.type)">
              {{ getActivityTypeText(activity.type) }}
            </van-tag>
          </div>

          <p class="desc">{{ activity.description }}</p>

          <div class="time">
            <van-icon name="clock-o" />
            {{ formatDate(activity.startTime) }} - {{ formatDate(activity.endTime) }}
          </div>

          <div class="reward">
            <van-icon name="gift-o" color="#ff9800" />
            <span>奖励：{{ activity.reward.name }}</span>
          </div>

          <div class="footer">
            <div class="participants">
              <van-icon name="friends-o" />
              {{ formatNumber(activity.participants) }}人参与
              <span v-if="activity.maxParticipants">
                / {{ formatNumber(activity.maxParticipants) }}
              </span>
            </div>
            <van-button type="primary" size="small" round>
              {{ activity.status === 'ongoing' ? '立即参加' : '查看详情' }}
            </van-button>
          </div>
        </div>
      </div>
    </div>
    <van-empty v-else description="暂无活动" />
  </div>
</template>

<script setup lang="ts">
import type { Activity } from '@/api/model'
import dayjs from 'dayjs'

interface Props {
  activities: Activity[]
  loading?: boolean
}

interface Emits {
  (e: 'activity-click', activity: Activity): void
  (e: 'view-more'): void
}

withDefaults(defineProps<Props>(), {
  loading: false,
})

const emit = defineEmits<Emits>()

const getStatusText = (status: string) => {
  const map: Record<string, string> = {
    upcoming: '即将开始',
    ongoing: '进行中',
    ended: '已结束',
  }
  return map[status] || status
}

const getActivityTypeText = (type: string) => {
  const map: Record<string, string> = {
    challenge: '挑战赛',
    event: '活动',
    mission: '任务',
  }
  return map[type] || type
}

const getActivityTypeTag = (type: string) => {
  const map: Record<string, string> = {
    challenge: 'danger',
    event: 'primary',
    mission: 'warning',
  }
  return map[type] || 'default'
}

const formatDate = (dateStr: string) => {
  return dayjs(dateStr).format('MM-DD')
}

const formatNumber = (num: number) => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w'
  }
  return num.toString()
}
</script>

<style scoped lang="scss">
.activity-section {
  margin: 20px 16px;

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    .title {
      font-size: 18px;
      font-weight: 600;
      color: #333;
      margin: 0;
    }

    .more {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 14px;
      color: #999;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: #667eea;
      }
    }
  }

  .activity-list {
    display: flex;
    flex-direction: column;
    gap: 16px;

    .activity-card {
      background: #fff;
      border-radius: 12px;
      overflow: hidden;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
      }

      &:active {
        transform: translateY(-2px);
      }

      .card-header {
        position: relative;
        height: 180px;

        .cover {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .badge {
          position: absolute;
          top: 12px;
          right: 12px;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
          backdrop-filter: blur(10px);

          &.upcoming {
            background: rgba(102, 126, 234, 0.9);
            color: #fff;
          }

          &.ongoing {
            background: rgba(82, 196, 26, 0.9);
            color: #fff;
          }

          &.ended {
            background: rgba(140, 140, 140, 0.9);
            color: #fff;
          }
        }
      }

      .card-body {
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
            line-height: 1.4;
          }
        }

        .desc {
          font-size: 13px;
          color: #666;
          margin: 0 0 12px 0;
          line-height: 1.5;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .time,
        .reward {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: #999;
          margin-bottom: 8px;
        }

        .reward {
          color: #ff9800;
        }

        .footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid #f0f0f0;

          .participants {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 13px;
            color: #999;
          }
        }
      }
    }
  }
}
</style>
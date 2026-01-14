<template>
  <div class="course-card" @click="$emit('click')">
    <div class="cover-wrapper">
      <img :src="course.coverImage || defaultCover" :alt="course.title" class="cover" />
    </div>
    <div class="content">
      <h4 class="title">{{ course.title }}</h4>
      <div class="meta">
        <span class="type">{{ course.typeName }}</span>
        <span class="difficulty">{{ course.difficultyName }}</span>
        <span class="duration">{{ course.duration }}分钟</span>
      </div>
      <div class="footer">
        <div class="stats">
          <span class="stat-item">
            <el-icon><User /></el-icon>
            {{ formatNumber(course.studentCount) }}
          </span>
          <span class="stat-item">
            <el-icon><Star /></el-icon>
            {{ course.rating ? course.rating.toFixed(1) : '0.0' }}
          </span>
        </div>
        <div class="calories">
          <el-icon><Lightning /></el-icon>
          {{ course.caloriesBurn || 0 }}大卡
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { User, Star, Lightning } from '@element-plus/icons-vue'
import type { CourseVO } from '@/api/model/courseModel'

interface Props {
  course: CourseVO
}

const props = defineProps<Props>()

defineEmits<{
  click: []
}>()

const defaultCover = 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400'

const formatNumber = (num: number | undefined | null) => {
  if (num === undefined || num === null || isNaN(num)) {
    return '0'
  }
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w'
  }
  return num.toString()
}
</script>

<style scoped lang="scss">
.course-card {
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
    padding-top: 56.25%; // 16:9 aspect ratio
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
      gap: 8px;
      margin-bottom: 10px;
      flex-wrap: wrap;

      span {
        font-size: 12px;
        color: #666;
        padding: 2px 6px;
        background: #f5f7fa;
        border-radius: 4px;
      }
    }

    .footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 8px;
      padding-top: 8px;
      border-top: 1px solid #f0f0f0;

      .stats {
        display: flex;
        gap: 12px;
        font-size: 12px;
        color: #999;

        .stat-item {
          display: flex;
          align-items: center;
          gap: 4px;

          :deep(.el-icon) {
            font-size: 14px;
          }
        }
      }

      .calories {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 12px;
        color: #ff6b6b;
        font-weight: 500;

        :deep(.el-icon) {
          font-size: 14px;
        }
      }
    }
  }
}
</style>


<template>
  <div class="review-list">
    <h3>用户评价</h3>
    <div v-if="reviews.length === 0" class="empty">
      <el-empty description="暂无评价" />
    </div>
    <div v-else>
      <div 
        v-for="review in reviews" 
        :key="review.reviewId" 
        class="review-item"
      >
        <div class="review-header">
          <el-avatar :size="40" :src="(review as any).avatarUrl || (review as any).userAvatar || defaultAvatar" />
          <div class="user-info">
            <div class="nickname">{{ (review as any).nickname || (review as any).userNickname }}</div>
            <div class="meta">
              <el-rate 
                :model-value="review.rating" 
                disabled 
                size="small"
                show-score
                text-color="#ff9900"
                score-template="{value}"
              />
              <span class="time">{{ formatTime(review.createdAt) }}</span>
            </div>
          </div>
          <el-button 
            v-if="canDelete(review.userId)"
            type="danger" 
            size="small" 
            text
            @click="handleDelete(review.reviewId)"
          >
            删除
          </el-button>
        </div>
        <div v-if="review.content" class="review-content">
          {{ review.content }}
        </div>
      </div>
      
      <div class="pagination" v-if="total > pageSize">
        <el-pagination
          v-model:current-page="currentPage"
          :page-size="pageSize"
          :total="total"
          layout="prev, pager, next"
          @current-change="handlePageChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '@/stores/user'
import type { CourseReviewVO } from '@/api/model/courseModel'
import type { VenueReviewVO } from '@/api/model/venueModel'

// 通用评价接口
type ReviewVO = CourseReviewVO | VenueReviewVO

interface Props {
  reviews: ReviewVO[]
  total?: number
  pageSize?: number
  onPageChange?: (page: number) => void
  onDelete?: (reviewId: number) => void
}

const props = withDefaults(defineProps<Props>(), {
  total: 0,
  pageSize: 10
})

const userStore = useUserStore()
const currentPage = ref(1)
const defaultAvatar = 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'

const canDelete = (userId: number) => {
  return userStore.userInfo?.userId === userId
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

const handlePageChange = (page: number) => {
  currentPage.value = page
  if (props.onPageChange) {
    props.onPageChange(page)
  }
}

const handleDelete = async (reviewId: number) => {
  try {
    await ElMessageBox.confirm('确定要删除这条评价吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    if (props.onDelete) {
      props.onDelete(reviewId)
    }
  } catch (error) {
    // 用户取消
  }
}
</script>

<style scoped lang="scss">
.review-list {
  padding: 20px;
  background: #fff;
  border-radius: 8px;

  h3 {
    margin: 0 0 20px 0;
    font-size: 18px;
    font-weight: 600;
  }

  .empty {
    padding: 40px 0;
  }

  .review-item {
    padding: 16px 0;
    border-bottom: 1px solid #f0f0f0;

    &:last-child {
      border-bottom: none;
    }

    .review-header {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      margin-bottom: 12px;

      .user-info {
        flex: 1;

        .nickname {
          font-weight: 600;
          color: #333;
          margin-bottom: 4px;
        }

        .meta {
          display: flex;
          align-items: center;
          gap: 12px;

          .time {
            font-size: 12px;
            color: #999;
          }
        }
      }
    }

    .review-content {
      color: #666;
      line-height: 1.6;
      margin-left: 52px;
    }
  }

  .pagination {
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }
}
</style>

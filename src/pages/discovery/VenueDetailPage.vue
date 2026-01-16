<template>
  <div class="venue-detail-page">
    <div v-loading="loading">
      <template v-if="venue">
        <!-- 场馆信息 -->
        <el-card class="venue-info-card">
          <div class="venue-header">
            <img 
              v-if="venue.images && venue.images.length > 0" 
              :src="venue.images[0]" 
              :alt="venue.name" 
              class="venue-cover" 
            />
            <div v-else class="venue-cover-placeholder">暂无图片</div>
            <div class="venue-info">
              <h1 class="venue-name">{{ venue.name }}</h1>
              <div class="venue-meta">
                <div class="venue-type">
                  <span class="label">场馆类型：</span>
                  <el-tag type="primary">{{ getVenueTypeName(venue.typeId) }}</el-tag>
                </div>
                <div class="rating">
                  <el-icon><Star /></el-icon>
                  <span>{{ (venue.rating || 0).toFixed(1) }}</span>
                </div>
                <div class="reviews">
                  {{ formatNumber(venue.reviewCount) }}条评价
                </div>
              </div>
              <div class="venue-address">
                <el-icon><Location /></el-icon>
                <span>{{ venue.address }}</span>
              </div>
              <div class="venue-contact">
                <el-icon><Phone /></el-icon>
                <span>{{ venue.contactPhone || '暂无联系电话' }}</span>
              </div>
              <div v-if="venue.description" class="venue-description">
                {{ venue.description }}
              </div>
            </div>
          </div>
        </el-card>

        <!-- 操作按钮 -->
        <div class="action-section" style="margin-bottom: 20px;">
          <el-button 
            type="primary" 
            size="large" 
            @click="handleBooking"
            style="width: 200px;"
          >
            预约场馆
          </el-button>
        </div>

        <!-- 评价区域 -->
        <el-card class="review-section" style="margin-bottom: 20px;">
          <ReviewList 
            :reviews="venueReviews"
            :total="reviewTotal"
            :page-size="10"
            @page-change="handleReviewPageChange"
            @delete="handleDeleteReview"
          />
        </el-card>

        <!-- 课程列表 -->
        <div class="courses-section">
          <h2>场馆课程</h2>
          <div v-loading="coursesLoading" class="courses-list">
            <el-card
              v-for="course in venueCourses"
              :key="course.courseId"
              class="course-card"
              @click="toCourseDetail(course.courseId)"
            >
              <img :src="course.coverImage || defaultCover" :alt="course.title" class="course-cover" />
              <div class="course-info">
                <h4 class="course-title">{{ course.title }}</h4>
                <div class="course-meta">
                  <el-tag type="info" size="small" style="margin-right: 6px;">{{ course.difficultyName }}</el-tag>
                  <span class="duration">{{ course.duration }}分钟</span>
                  <span class="calories">
                    <el-icon><Lightning /></el-icon>
                    {{ course.caloriesBurn || 0 }}大卡
                  </span>
                </div>
                <div class="course-footer">
                  <div class="course-stats">
                    <span class="stat-item">
                      <el-icon><User /></el-icon>
                      {{ formatNumber(course.studentCount) }}
                    </span>
                    <span class="stat-item">
                      <el-icon><Star /></el-icon>
                      {{ (course.rating || 0).toFixed(1) }}
                    </span>
                  </div>
                </div>
              </div>
            </el-card>

            <el-empty 
              v-if="!coursesLoading && venueCourses.length === 0" 
              description="该场馆还没开设课程" 
            />
          </div>
        </div>
      </template>
      
      <el-empty v-else-if="!loading" description="场馆不存在" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Location, Star, User, Lightning, Phone } from '@element-plus/icons-vue'
import { getVenueDetailApi } from '@/api/venue'
import { getCourseListApi } from '@/api/course'
import { getVenueReviewsApi, deleteVenueReviewApi } from '@/api/review'
import type { VenueVO } from '@/api/model/venueModel'
import type { CourseVO } from '@/api/model/courseModel'
import type { VenueReviewVO } from '@/api/model/venueModel'
import ReviewList from '@/components/review/ReviewList.vue'

const router = useRouter()
const route = useRoute()

const loading = ref(true)
const coursesLoading = ref(false)
const venue = ref<VenueVO | null>(null)
const allCourses = ref<CourseVO[]>([])
const venueReviews = ref<VenueReviewVO[]>([])
const reviewTotal = ref(0)
const reviewPage = ref(1)

const defaultCover = 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400'

// 筛选出该场馆的课程
const venueCourses = computed(() => {
  if (!venue.value) return []
  return allCourses.value.filter(course => course.venueId === venue.value?.venueId)
})

const formatNumber = (num: number | undefined | null) => {
  if (num === undefined || num === null || isNaN(num)) {
    return '0'
  }
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w'
  }
  return num.toString()
}

// 根据 type_id 获取场馆类型名称
const getVenueTypeName = (typeId: number | undefined | null): string => {
  if (typeId === undefined || typeId === null) {
    return '未知类型'
  }
  const typeMap: Record<number, string> = {
    0: '健身房',
    1: '瑜伽馆',
    2: '游泳馆'
  }
  return typeMap[typeId] || '未知类型'
}

const loadVenueDetail = async () => {
  try {
    loading.value = true
    const venueId = Number(route.params.venueId)
    const res = await getVenueDetailApi(venueId)
    if (res.code === 200) {
      venue.value = res.data
    }
  } catch (error) {
    console.error('Load venue detail failed:', error)
  } finally {
    loading.value = false
  }
}

const loadAllCourses = async () => {
  try {
    coursesLoading.value = true
    // 获取所有课程（包括线上和线下）
    const res = await getCourseListApi()
    if (res.code === 200) {
      allCourses.value = res.data
    }
  } catch (error) {
    console.error('Load courses failed:', error)
  } finally {
    coursesLoading.value = false
  }
}

const toCourseDetail = (courseId: number) => {
  router.push(`/courses/${courseId}`)
}

const handleBooking = () => {
  if (!venue.value) return
  router.push({
    path: '/bookings/create',
    query: {
      venueId: venue.value.venueId.toString()
    }
  })
}

const loadReviews = async (page: number = 1) => {
  if (!venue.value) return
  
  try {
    const res = await getVenueReviewsApi(venue.value.venueId, { page, size: 10 })
    if (res.code === 200) {
      venueReviews.value = res.data || []
    }
  } catch (error: any) {
    console.error('Load reviews failed:', error)
  }
}

const handleReviewPageChange = (page: number) => {
  reviewPage.value = page
  loadReviews(page)
}

const handleDeleteReview = async (reviewId: number) => {
  if (!venue.value) return
  
  try {
    await deleteVenueReviewApi(venue.value.venueId, reviewId)
    ElMessage.success('删除成功')
    loadReviews(reviewPage.value)
  } catch (error: any) {
    ElMessage.error(error.message || '删除失败')
  }
}

onMounted(async () => {
  await Promise.all([loadVenueDetail(), loadAllCourses()])
  if (venue.value) {
    await loadReviews()
  }
})
</script>

<style scoped lang="scss">
.venue-detail-page {
  padding: 20px;

  .venue-info-card {
    margin-bottom: 30px;

    .venue-header {
      display: flex;
      gap: 20px;

      .venue-cover {
        width: 300px;
        height: 200px;
        object-fit: cover;
        border-radius: 8px;
        flex-shrink: 0;
      }

      .venue-cover-placeholder {
        width: 300px;
        height: 200px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f5f7fa;
        color: #999;
        border-radius: 8px;
        flex-shrink: 0;
      }

      .venue-info {
        flex: 1;

        .venue-name {
          font-size: 24px;
          font-weight: 600;
          color: #333;
          margin: 0 0 16px 0;
        }

        .venue-meta {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 12px;
          flex-wrap: wrap;

          .venue-type {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 14px;
            color: #666;

            .label {
              color: #999;
            }
          }

          .rating {
            display: flex;
            align-items: center;
            gap: 4px;
            color: #ff9800;
            font-weight: 500;
          }

          .reviews {
            color: #666;
            font-size: 14px;
          }
        }

        .venue-address {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #666;
          font-size: 14px;
          margin-bottom: 12px;
        }

        .venue-contact {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #666;
          font-size: 14px;
          margin-bottom: 12px;
        }

        .venue-description {
          color: #666;
          font-size: 14px;
          line-height: 1.6;
          margin-top: 12px;
        }
      }
    }
  }

  .courses-section {
    h2 {
      font-size: 20px;
      font-weight: 600;
      color: #333;
      margin-bottom: 20px;
    }

    .courses-list {
      .course-card {
        margin-bottom: 20px;
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
          transform: translateY(-4px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
        }

        .course-cover {
          width: 100%;
          height: 180px;
          object-fit: cover;
          border-radius: 4px 4px 0 0;
        }

        .course-info {
          padding: 16px;

          .course-title {
            font-size: 16px;
            font-weight: 600;
            color: #333;
            margin: 0 0 12px 0;
          }

          .course-meta {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 12px;
            font-size: 13px;
            color: #666;

            .duration {
              color: #999;
            }

            .calories {
              display: flex;
              align-items: center;
              gap: 4px;
              color: #ff6b6b;
              font-weight: 500;
            }
          }

          .course-footer {
            .course-stats {
              display: flex;
              gap: 16px;
              font-size: 12px;
              color: #999;

              .stat-item {
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
}
</style>


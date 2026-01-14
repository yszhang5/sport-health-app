<template>
  <div class="course-section">
    <div class="section-header">
      <h3 class="title">精选课程</h3>
      <span class="more" @click="emit('view-more')">
        查看全部
        <van-icon name="arrow" />
      </span>
    </div>

    <van-skeleton v-if="loading" :row="2" :row-height="140" />
    <div v-else-if="courses.length > 0" class="course-list">
      <div
          v-for="course in courses"
          :key="course.id"
          class="course-card"
          @click="emit('course-click', course)"
      >
        <img :src="course.cover" :alt="course.title" class="cover" />
        <div class="info">
          <div class="header">
            <h4 class="title">{{ course.title }}</h4>
            <van-tag v-if="course.price === 0" type="success" size="medium">
              免费
            </van-tag>
            <div v-else class="price">
              <span class="current">¥{{ course.price }}</span>
              <span v-if="course.originalPrice" class="original">
                ¥{{ course.originalPrice }}
              </span>
            </div>
          </div>

          <div class="instructor">
            <img :src="course.instructorAvatar" class="avatar" />
            <span class="name">{{ course.instructor }}</span>
          </div>

          <p class="desc">{{ course.description }}</p>

          <div class="footer">
            <div class="stats">
              <span class="stat">
                <van-icon name="friends-o" />
                {{ formatNumber(course.students) }}人学习
              </span>
              <span class="stat">
                <van-icon name="star" color="#ff9800" />
                {{ course.rating }}
              </span>
              <span class="stat">
                <van-icon name="records-o" />
                {{ course.lessons }}课时
              </span>
            </div>
            <div class="tags">
              <span v-for="tag in course.tags.slice(0, 3)" :key="tag" class="tag">
                {{ tag }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <van-empty v-else description="暂无课程" />
  </div>
</template>

<script setup lang="ts">
import type { Course } from '@/api/model'

interface Props {
  courses: Course[]
  loading?: boolean
}

interface Emits {
  (e: 'course-click', course: Course): void
  (e: 'view-more'): void
}

withDefaults(defineProps<Props>(), {
  loading: false,
})

const emit = defineEmits<Emits>()

const formatNumber = (num: number) => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w'
  }
  return num.toString()
}
</script>

<style scoped lang="scss">
.course-section {
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

  .course-list {
    display: flex;
    flex-direction: column;
    gap: 16px;

    .course-card {
      display: flex;
      background: #fff;
      border-radius: 12px;
      overflow: hidden;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

      &:hover {
        transform: translateX(4px);
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
      }

      &:active {
        transform: translateX(2px);
      }

      .cover {
        width: 120px;
        height: 160px;
        object-fit: cover;
        flex-shrink: 0;
      }

      .info {
        flex: 1;
        padding: 12px;
        display: flex;
        flex-direction: column;

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
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          .price {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            margin-left: 8px;

            .current {
              font-size: 18px;
              font-weight: 600;
              color: #ff4d4f;
            }

            .original {
              font-size: 12px;
              color: #999;
              text-decoration: line-through;
            }
          }
        }

        .instructor {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 8px;

          .avatar {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            object-fit: cover;
          }

          .name {
            font-size: 13px;
            color: #666;
          }
        }

        .desc {
          font-size: 13px;
          color: #999;
          margin: 0 0 auto 0;
          line-height: 1.5;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .footer {
          margin-top: 12px;

          .stats {
            display: flex;
            gap: 16px;
            font-size: 12px;
            color: #999;
            margin-bottom: 8px;

            .stat {
              display: flex;
              align-items: center;
              gap: 4px;
            }
          }

          .tags {
            display: flex;
            gap: 6px;
            flex-wrap: wrap;

            .tag {
              padding: 2px 8px;
              font-size: 11px;
              color: #667eea;
              background: rgba(102, 126, 234, 0.1);
              border-radius: 4px;
            }
          }
        }
      }
    }
  }
}
</style>
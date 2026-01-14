<template>
  <div class="article-section">
    <div class="section-header">
      <h3 class="title">健康资讯</h3>
      <span class="more" @click="emit('view-more')">
        查看全部
        <van-icon name="arrow" />
      </span>
    </div>

    <van-skeleton v-if="loading" :row="3" :row-height="100" />
    <div v-else-if="articles.length > 0" class="article-list">
      <div
          v-for="article in articles"
          :key="article.id"
          class="article-card"
          @click="emit('article-click', article)"
      >
        <div class="content">
          <h4 class="title">{{ article.title }}</h4>
          <p class="summary">{{ article.summary }}</p>
          <div class="meta">
            <span class="author">{{ article.author }}</span>
            <span class="divider">·</span>
            <span class="time">{{ formatTime(article.publishTime) }}</span>
          </div>
          <div class="footer">
            <div class="stats">
              <span class="stat">
                <van-icon name="eye-o" />
                {{ formatNumber(article.views) }}
              </span>
              <span class="stat">
                <van-icon name="like-o" />
                {{ formatNumber(article.likes) }}
              </span>
            </div>
            <div class="tags">
              <span v-for="tag in article.tags.slice(0, 2)" :key="tag" class="tag">
                {{ tag }}
              </span>
            </div>
          </div>
        </div>
        <img :src="article.cover" :alt="article.title" class="cover" />
      </div>
    </div>
    <van-empty v-else description="暂无资讯" />
  </div>
</template>

<script setup lang="ts">
import type { HealthArticle } from '@/api/model'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'

dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

interface Props {
  articles: HealthArticle[]
  loading?: boolean
}

interface Emits {
  (e: 'article-click', article: HealthArticle): void
  (e: 'view-more'): void
}

withDefaults(defineProps<Props>(), {
  loading: false,
})

const emit = defineEmits<Emits>()

const formatTime = (timeStr: string) => {
  return dayjs(timeStr).fromNow()
}

const formatNumber = (num: number) => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}
</script>

<style scoped lang="scss">
.article-section {
  margin: 20px 16px;
  margin-bottom: 80px; // 底部留白

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

  .article-list {
    display: flex;
    flex-direction: column;
    gap: 16px;

    .article-card {
      display: flex;
      gap: 12px;
      background: #fff;
      padding: 16px;
      border-radius: 12px;
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

      .content {
        flex: 1;
        display: flex;
        flex-direction: column;

        .title {
          font-size: 15px;
          font-weight: 600;
          color: #333;
          margin: 0 0 8px 0;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .summary {
          font-size: 13px;
          color: #999;
          margin: 0 0 8px 0;
          line-height: 1.5;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .meta {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: #999;
          margin-bottom: auto;

          .divider {
            margin: 0 2px;
          }
        }

        .footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 12px;

          .stats {
            display: flex;
            gap: 16px;
            font-size: 12px;
            color: #999;

            .stat {
              display: flex;
              align-items: center;
              gap: 4px;
            }
          }

          .tags {
            display: flex;
            gap: 6px;

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

      .cover {
        width: 100px;
        height: 100px;
        border-radius: 8px;
        object-fit: cover;
        flex-shrink: 0;
      }
    }
  }
}
</style>
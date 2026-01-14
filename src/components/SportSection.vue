<template>
  <div class="sport-section">
    <div class="section-header">
      <h3 class="title">热门运动项目</h3>
      <span class="more" @click="emit('view-more')">
        查看全部
        <van-icon name="arrow" />
      </span>
    </div>

    <van-skeleton v-if="loading" :row="2" :row-height="120" />
    <div v-else-if="projects.length > 0" class="sport-grid">
      <div
          v-for="project in projects"
          :key="project.id"
          class="sport-card"
          @click="emit('project-click', project)"
      >
        <div class="cover-wrapper">
          <img :src="project.cover" :alt="project.name" class="cover" />
          <div class="difficulty-badge" :class="project.difficulty">
            {{ getDifficultyText(project.difficulty) }}
          </div>
        </div>
        <div class="info">
          <h4 class="name">{{ project.name }}</h4>
          <p class="desc">{{ project.description }}</p>
          <div class="tags">
            <span v-for="tag in project.tags.slice(0, 3)" :key="tag" class="tag">
              {{ tag }}
            </span>
          </div>
          <div class="stats">
            <span class="stat">
              <van-icon name="fire-o" />
              {{ project.calories }} 千卡
            </span>
            <span class="stat">
              <van-icon name="clock-o" />
              {{ project.duration }} 分钟
            </span>
          </div>
        </div>
      </div>
    </div>
    <van-empty v-else description="暂无运动项目" />
  </div>
</template>

<script setup lang="ts">
import type { SportProject } from '@/api/model'

interface Props {
  projects: SportProject[]
  loading?: boolean
}

interface Emits {
  (e: 'project-click', project: SportProject): void
  (e: 'view-more'): void
}

withDefaults(defineProps<Props>(), {
  loading: false,
})

const emit = defineEmits<Emits>()

const getDifficultyText = (difficulty: string) => {
  const map: Record<string, string> = {
    beginner: '入门',
    intermediate: '进阶',
    advanced: '高级',
  }
  return map[difficulty] || difficulty
}
</script>

<style scoped lang="scss">
.sport-section {
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

  .sport-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;

    .sport-card {
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

      .cover-wrapper {
        position: relative;
        width: 100%;
        height: 120px;

        .cover {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .difficulty-badge {
          position: absolute;
          top: 8px;
          right: 8px;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 500;
          backdrop-filter: blur(10px);

          &.beginner {
            background: rgba(82, 196, 26, 0.9);
            color: #fff;
          }

          &.intermediate {
            background: rgba(250, 173, 20, 0.9);
            color: #fff;
          }

          &.advanced {
            background: rgba(255, 77, 79, 0.9);
            color: #fff;
          }
        }
      }

      .info {
        padding: 12px;

        .name {
          font-size: 16px;
          font-weight: 600;
          color: #333;
          margin: 0 0 4px 0;
        }

        .desc {
          font-size: 12px;
          color: #999;
          margin: 0 0 8px 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .tags {
          display: flex;
          gap: 6px;
          margin-bottom: 8px;
          flex-wrap: wrap;

          .tag {
            padding: 2px 8px;
            font-size: 11px;
            color: #667eea;
            background: rgba(102, 126, 234, 0.1);
            border-radius: 4px;
          }
        }

        .stats {
          display: flex;
          gap: 12px;
          font-size: 12px;
          color: #999;

          .stat {
            display: flex;
            align-items: center;
            gap: 4px;
          }
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .sport-section .sport-grid {
    grid-template-columns: 1fr;
  }
}
</style>
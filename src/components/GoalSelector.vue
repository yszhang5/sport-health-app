<template>
  <div class="goal-selector">
    <div class="section-header">
      <h3 class="title">你的健身目标</h3>
      <span class="subtitle">选择目标，获得个性化推荐</span>
    </div>

    <div class="goal-list">
      <div
          v-for="goal in goals"
          :key="goal.type"
          class="goal-item"
          :class="{ active: selected === goal.type }"
          @click="handleSelect(goal.type)"
      >
        <div class="icon">{{ goal.icon }}</div>
        <div class="name">{{ goal.name }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { UserGoal } from '@/api/model'

interface Props {
  goals: UserGoal[]
  selected: string | null
}

interface Emits {
  (e: 'select', goalType: string): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const handleSelect = (goalType: string) => {
  emit('select', goalType)
}
</script>

<style scoped lang="scss">
.goal-selector {
  margin: 20px 16px;
  padding: 16px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  .section-header {
    margin-bottom: 16px;

    .title {
      font-size: 18px;
      font-weight: 600;
      color: #333;
      margin: 0 0 4px 0;
    }

    .subtitle {
      font-size: 13px;
      color: #999;
    }
  }

  .goal-list {
    display: flex;
    gap: 12px;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }

    .goal-item {
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      padding: 12px 20px;
      border-radius: 12px;
      background: #f5f5f5;
      cursor: pointer;
      transition: all 0.3s ease;
      user-select: none;

      .icon {
        font-size: 28px;
        transition: transform 0.3s ease;
      }

      .name {
        font-size: 14px;
        color: #666;
        white-space: nowrap;
        font-weight: 500;
      }

      &.active {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);

        .name {
          color: #fff;
        }

        .icon {
          transform: scale(1.1);
        }
      }

      &:hover:not(.active) {
        background: #ebebeb;
        transform: translateY(-2px);
      }

      &:active {
        transform: translateY(0);
      }
    }
  }
}
</style>
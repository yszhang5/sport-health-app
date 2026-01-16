<template>
  <div class="gift-card" @click="$emit('click')">
    <div class="cover-wrapper">
      <img :src="gift.image" :alt="gift.name" class="cover" />
      <div v-if="gift.stock === 0" class="stock-badge">缺货</div>
    </div>
    <div class="content">
      <h4 class="title">{{ gift.name }}</h4>
      <div class="meta">
        <el-tag size="small">{{ gift.typeName }}</el-tag>
        <span class="stock">库存：{{ gift.stock }}</span>
      </div>
      <div class="footer">
        <div class="points">
          <el-icon><Star /></el-icon>
          {{ gift.points }}积分
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Star } from '@element-plus/icons-vue'
import type { GiftVO } from '@/api/gift'

interface Props {
  gift: GiftVO
}

defineProps<Props>()

defineEmits<{
  click: []
}>()
</script>

<style scoped lang="scss">
.gift-card {
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
    padding-top: 56.25%;
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

    .stock-badge {
      position: absolute;
      top: 8px;
      right: 8px;
      background: rgba(0, 0, 0, 0.6);
      color: #fff;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
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
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;

      .stock {
        font-size: 12px;
        color: #999;
      }
    }

    .footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 8px;
      border-top: 1px solid #f0f0f0;

      .points {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 16px;
        color: #F56C6C;
        font-weight: 600;

        :deep(.el-icon) {
          font-size: 18px;
        }
      }
    }
  }
}
</style>

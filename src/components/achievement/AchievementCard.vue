<template>
  <el-card class="achievement-card" shadow="hover">
    <div class="card-content">
      <div class="icon-wrapper">
        <el-icon :size="40" :color="iconColor">
          <component :is="iconComponent" />
        </el-icon>
      </div>
      <div class="info">
        <div class="value">{{ formatValue(value) }}</div>
        <div class="unit">{{ unit }}</div>
        <div class="title">{{ title }}</div>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { 
  Location, 
  Document, 
  Calendar, 
  Star, 
  Wallet 
} from '@element-plus/icons-vue'

interface Props {
  title: string
  value: number
  unit: string
  icon: string
}

const props = defineProps<Props>()

const iconMap: Record<string, any> = {
  distance: Location,
  course: Document,
  days: Calendar,
  points: Star,
  current: Wallet
}

const iconComponent = computed(() => iconMap[props.icon] || Star)

const iconColor = computed(() => {
  const colorMap: Record<string, string> = {
    distance: '#409EFF',
    course: '#67C23A',
    days: '#E6A23C',
    points: '#F56C6C',
    current: '#909399'
  }
  return colorMap[props.icon] || '#409EFF'
})

const formatValue = (val: number) => {
  if (val >= 10000) {
    return (val / 10000).toFixed(1) + 'w'
  }
  return val.toLocaleString()
}
</script>

<style scoped lang="scss">
.achievement-card {
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
  }

  .card-content {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 8px;

    .icon-wrapper {
      flex-shrink: 0;
    }

    .info {
      flex: 1;

      .value {
        font-size: 28px;
        font-weight: 600;
        color: #333;
        line-height: 1.2;
      }

      .unit {
        font-size: 14px;
        color: #999;
        margin-top: 4px;
      }

      .title {
        font-size: 14px;
        color: #666;
        margin-top: 8px;
      }
    }
  }
}
</style>

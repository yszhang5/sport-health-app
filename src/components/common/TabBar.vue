<template>
  <div class="tab-bar">
    <div
      v-for="item in tabs"
      :key="item.path"
      class="tab-item"
      :class="{ active: isActive(item.path) }"
      @click="navigate(item.path)"
    >
      <el-icon :size="22">
        <component :is="item.icon" />
      </el-icon>
      <span class="tab-label">{{ item.label }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { HomeFilled, Search, VideoCamera, User } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()

const tabs = [
  { path: '/', label: '首页', icon: HomeFilled },
  { path: '/courses', label: '发现', icon: Search },
  { path: '/sport/record', label: '运动', icon: VideoCamera },
  { path: '/profile', label: '我的', icon: User }
]

const isActive = (path: string) => {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(path)
}

const navigate = (path: string) => {
  router.push(path)
}
</script>

<style scoped lang="scss">
.tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: #fff;
  border-top: 1px solid #e5e5e5;
  display: flex;
  justify-content: space-around;
  align-items: center;
  z-index: 1000;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);

  .tab-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    flex: 1;
    padding: 4px 0;

    .tab-label {
      font-size: 12px;
      margin-top: 4px;
      color: #666;
      transition: color 0.3s ease;
    }

    :deep(.el-icon) {
      color: #666;
      transition: color 0.3s ease;
    }

    &.active {
      .tab-label {
        color: #409eff;
        font-weight: 600;
      }

      :deep(.el-icon) {
        color: #409eff;
      }
    }

    &:active {
      transform: scale(0.95);
    }
  }
}
</style>


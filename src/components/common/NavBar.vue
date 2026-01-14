<template>
  <div class="nav-bar">
    <div class="nav-content">
      <el-icon v-if="showBack" class="back-icon" @click="handleBack">
        <ArrowLeft />
      </el-icon>
      <h2 class="nav-title">{{ title }}</h2>
      <div class="nav-right"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ArrowLeft } from '@element-plus/icons-vue'

interface Props {
  title: string
  showBack?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showBack: false
})

const router = useRouter()

const handleBack = () => {
  router.back()
}
</script>

<style scoped lang="scss">
.nav-bar {
  position: sticky;
  top: 0;
  z-index: 100;
  background: #fff;
  border-bottom: 1px solid #e5e5e5;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  .nav-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 50px;
    padding: 0 16px;

    .back-icon {
      cursor: pointer;
      font-size: 20px;
      color: #333;
      margin-right: 12px;
      transition: color 0.3s ease;

      &:hover {
        color: #409eff;
      }
    }

    .nav-title {
      flex: 1;
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: #333;
      text-align: center;
    }

    .nav-right {
      width: 32px; // 保持平衡
    }
  }
}
</style>


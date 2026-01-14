<template>
  <div class="rank-page">
    <h2>排行榜</h2>

    <div class="rank-content">
      <el-tabs v-model="activeTab" @tab-change="handleTabChange">
        <el-tab-pane label="步数排行" name="steps">
          <div v-loading="loading">
            <div v-if="rankList.length > 0" class="rank-list">
              <div
                v-for="(item, index) in rankList"
                :key="item.userId"
                class="rank-item"
                :class="{ 'top-three': index < 3 }"
              >
                <div class="rank-number">
                  <span v-if="index >= 3">{{ index + 1 }}</span>
                  <el-icon v-else :size="24" :color="getRankColor(index)">
                    <Trophy />
                  </el-icon>
                </div>
                <el-avatar :size="50" :src="item.avatarUrl" class="avatar" />
                <div class="user-info">
                  <div class="nickname">{{ item.nickname }}</div>
                  <div class="score">{{ formatNumber(item.score) }} 步</div>
                </div>
              </div>
            </div>
            <el-empty v-else description="暂无排行数据" :image-size="120" />
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Trophy } from '@element-plus/icons-vue'
import { getStepRankApi } from '@/api/sport'
import type { RankVO } from '@/api/model/sportModel'

const loading = ref(false)
const activeTab = ref('steps')
const rankList = ref<RankVO[]>([])

const loadRank = async () => {
  loading.value = true
  try {
    const res = await getStepRankApi()
    if (res.code === 200) {
      rankList.value = res.data
    }
  } catch (error) {
    console.error('Load rank failed:', error)
  } finally {
    loading.value = false
  }
}

const handleTabChange = (name: string) => {
  loadRank()
}

const getRankColor = (index: number) => {
  const colors = ['#ffd700', '#c0c0c0', '#cd7f32'] // 金银铜
  return colors[index] || '#666'
}

const formatNumber = (num: number) => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w'
  }
  return num.toString()
}

onMounted(() => {
  loadRank()
})
</script>

<style scoped lang="scss">
.rank-page {
  padding: 20px;

  h2 {
    margin-bottom: 20px;
    color: #333;
  }

  .rank-content {

    :deep(.el-tabs__header) {
      background: white;
      border-radius: 8px;
      padding: 0 15px;
      margin-bottom: 15px;
    }

    .rank-list {
      .rank-item {
        display: flex;
        align-items: center;
        gap: 15px;
        padding: 15px;
        background: white;
        border-radius: 12px;
        margin-bottom: 12px;
        transition: all 0.3s ease;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        &.top-three {
          background: linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%);
          border: 2px solid #409eff;
        }

        .rank-number {
          width: 30px;
          text-align: center;
          font-size: 18px;
          font-weight: 600;
          color: #666;
        }

        .avatar {
          flex-shrink: 0;
        }

        .user-info {
          flex: 1;

          .nickname {
            font-size: 16px;
            font-weight: 600;
            color: #333;
            margin-bottom: 4px;
          }

          .score {
            font-size: 14px;
            color: #666;
          }
        }
      }
    }
  }
}
</style>


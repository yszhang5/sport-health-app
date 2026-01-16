<template>
  <div class="my-exchanges-page">
    <h2>我的兑换记录</h2>
    <div v-loading="loading" class="exchanges-list">
      <div v-if="exchanges.length === 0" class="empty">
        <el-empty description="暂无兑换记录" />
      </div>
      <el-card 
        v-for="exchange in exchanges" 
        :key="exchange.exchangeId" 
        class="exchange-card"
        shadow="hover"
      >
        <div class="exchange-header">
          <img :src="exchange.giftImage" :alt="exchange.giftName" class="gift-image" />
          <div class="exchange-info">
            <h3>{{ exchange.giftName }}</h3>
            <div class="exchange-meta">
              <span class="points">消耗积分：{{ exchange.points }}</span>
              <el-tag :type="getStatusType(exchange.status)">
                {{ getStatusText(exchange.status) }}
              </el-tag>
            </div>
            <div v-if="exchange.address" class="address">
              收货地址：{{ exchange.address }}
            </div>
            <div v-if="exchange.contactPhone" class="phone">
              联系电话：{{ exchange.contactPhone }}
            </div>
            <div class="time">兑换时间：{{ formatTime(exchange.createdAt) }}</div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getMyExchangesApi, type GiftExchangeVO } from '@/api/gift'

const loading = ref(false)
const exchanges = ref<GiftExchangeVO[]>([])

const loadExchanges = async () => {
  loading.value = true
  try {
    const res = await getMyExchangesApi()
    if (res.code === 200) {
      exchanges.value = res.data || []
    }
  } catch (error: any) {
    ElMessage.error(error.message || '加载兑换记录失败')
  } finally {
    loading.value = false
  }
}

const getStatusText = (status: number) => {
  const statusMap: Record<number, string> = {
    0: '待发货',
    1: '已发货',
    2: '已完成',
    3: '已取消'
  }
  return statusMap[status] || '未知'
}

const getStatusType = (status: number): '' | 'success' | 'warning' | 'danger' | 'info' => {
  const typeMap: Record<number, '' | 'success' | 'warning' | 'danger' | 'info'> = {
    0: 'warning',
    1: 'info',
    2: 'success',
    3: 'danger'
  }
  return typeMap[status] || ''
}

const formatTime = (time: string) => {
  if (!time) return ''
  const date = new Date(time)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  loadExchanges()
})
</script>

<style scoped lang="scss">
.my-exchanges-page {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;

  h2 {
    margin-bottom: 20px;
    font-size: 24px;
    font-weight: 600;
  }

  .empty {
    padding: 40px 0;
  }

  .exchange-card {
    margin-bottom: 16px;

    .exchange-header {
      display: flex;
      gap: 16px;

      .gift-image {
        width: 100px;
        height: 100px;
        object-fit: cover;
        border-radius: 8px;
      }

      .exchange-info {
        flex: 1;

        h3 {
          margin: 0 0 8px 0;
          font-size: 18px;
          font-weight: 600;
        }

        .exchange-meta {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 8px;

          .points {
            color: #F56C6C;
            font-weight: 600;
          }
        }

        .address,
        .phone,
        .time {
          color: #666;
          font-size: 14px;
          margin-bottom: 4px;
        }
      }
    }
  }
}
</style>

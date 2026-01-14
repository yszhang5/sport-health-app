<template>
  <div class="sport-history-page">
    <h2>运动历史</h2>

    <div class="history-content">
      <div v-loading="loading">
        <div v-if="records.length > 0">
          <SportRecordCard
            v-for="record in records"
            :key="record.recordId"
            :record="record"
            class="record-item"
          />
        </div>
        <el-empty v-else description="暂无运动记录" :image-size="120">
          <el-button type="primary" @click="goToRecord">开始运动</el-button>
        </el-empty>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import SportRecordCard from '@/components/sport/SportRecordCard.vue'
import { getSportHistoryApi } from '@/api/sport'
import type { SportRecordVO } from '@/api/model/sportModel'

const router = useRouter()
const loading = ref(false)
const records = ref<SportRecordVO[]>([])

const loadHistory = async () => {
  loading.value = true
  try {
    const res = await getSportHistoryApi()
    if (res.code === 200) {
      records.value = res.data
    }
  } catch (error) {
    console.error('Load history failed:', error)
  } finally {
    loading.value = false
  }
}

const goToRecord = () => {
  router.push('/sport/record')
}

onMounted(() => {
  loadHistory()
})
</script>

<style scoped lang="scss">
.sport-history-page {
  padding: 20px;

  h2 {
    margin-bottom: 20px;
    color: #333;
  }

  .history-content {

    .record-item {
      margin-bottom: 12px;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}
</style>


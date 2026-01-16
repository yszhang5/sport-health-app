<template>
  <div class="activity-list-page">
    <h2>活动中心</h2>
    <div class="filters">
      <el-select v-model="filters.type" placeholder="选择类型" clearable style="width: 150px; margin-right: 12px;">
        <el-option label="线上" value="online" />
        <el-option label="线下" value="offline" />
        <el-option label="挑战赛" value="challenge" />
        <el-option label="打卡任务" value="checkin" />
      </el-select>
      <el-select v-model="filters.status" placeholder="选择状态" clearable style="width: 150px;">
        <el-option label="进行中" :value="1" />
        <el-option label="已结束" :value="2" />
      </el-select>
    </div>
    <div v-loading="loading" class="activities-grid">
      <ActivityCard
        v-for="activity in activities"
        :key="activity.activityId"
        :activity="activity"
        @click="handleActivityClick(activity.activityId)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getActivityListApi, type ActivityVO } from '@/api/activity'
import ActivityCard from '@/components/activity/ActivityCard.vue'

const router = useRouter()
const loading = ref(false)
const activities = ref<ActivityVO[]>([])
const filters = ref({
  type: '',
  status: undefined as number | undefined
})

const loadActivities = async () => {
  loading.value = true
  try {
    const res = await getActivityListApi({
      type: filters.value.type || undefined,
      status: filters.value.status
    })
    if (res.code === 200) {
      activities.value = res.data || []
    }
  } catch (error: any) {
    ElMessage.error(error.message || '加载活动列表失败')
  } finally {
    loading.value = false
  }
}

const handleActivityClick = (activityId: number) => {
  router.push(`/activities/${activityId}`)
}

watch(filters, () => {
  loadActivities()
}, { deep: true })

onMounted(() => {
  loadActivities()
})
</script>

<style scoped lang="scss">
.activity-list-page {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;

  h2 {
    margin-bottom: 20px;
    font-size: 24px;
    font-weight: 600;
  }

  .filters {
    margin-bottom: 20px;
    display: flex;
    align-items: center;
  }

  .activities-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 20px;
  }
}
</style>

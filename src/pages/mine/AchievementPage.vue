<template>
  <div class="achievement-page">
    <h2>运动成就</h2>
    <div v-loading="loading" class="achievement-content">
      <div class="achievement-grid" v-if="achievement">
        <AchievementCard
          title="总里程"
          :value="achievement.totalDistance"
          unit="公里"
          icon="distance"
        />
        <AchievementCard
          title="完成课程"
          :value="achievement.completedCourses"
          unit="门"
          icon="course"
        />
        <AchievementCard
          title="连续坚持"
          :value="achievement.consecutiveDays"
          unit="天"
          icon="days"
        />
        <AchievementCard
          title="总积分"
          :value="achievement.totalPoints"
          unit="分"
          icon="points"
        />
        <AchievementCard
          title="可用积分"
          :value="achievement.currentPoints"
          unit="分"
          icon="current"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getMyAchievementsApi, type AchievementVO } from '@/api/achievement'
import AchievementCard from '@/components/achievement/AchievementCard.vue'

const loading = ref(false)
const achievement = ref<AchievementVO | null>(null)

const loadAchievement = async () => {
  loading.value = true
  try {
    const res = await getMyAchievementsApi()
    if (res.code === 200) {
      achievement.value = res.data
    }
  } catch (error: any) {
    ElMessage.error(error.message || '加载成就数据失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadAchievement()
})
</script>

<style scoped lang="scss">
.achievement-page {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;

  h2 {
    margin-bottom: 20px;
    font-size: 24px;
    font-weight: 600;
  }

  .achievement-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
  }
}
</style>
